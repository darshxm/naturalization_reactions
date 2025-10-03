#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import asyncio
import aiohttp
import async_timeout
import time
import json
import csv
import sys
import os
import re
from typing import List, Dict
from typing import Set
from urllib.parse import urljoin
from bs4 import BeautifulSoup

BASE = "https://internetconsultatie.nl"
CONSULTATION_SLUG = "naturalisatietermijn"
LIST_ROOT = f"{BASE}/{CONSULTATION_SLUG}/reacties"
PER_PAGE = 100
STATE_FILE = "natur_reacties_seen.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0; +https://example.org/bot) "
                  "AsyncScraper/2025-10-01"
}
TIMEOUT = 20
MAX_CONCURRENCY = 5   # at most 5 requests in flight (reduced to be more respectful)


# ------------------------------
# State management for incremental scraping
# ------------------------------
def load_seen_ids() -> Set[str]:
    """Load previously seen detail_relative IDs from state file."""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_seen_ids(ids: Set[str]) -> None:
    """Save seen detail_relative IDs to state file."""
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(list(ids)), f, ensure_ascii=False, indent=2)


# ------------------------------
# Async Fetch Helpers
# ------------------------------
async def fetch(session: aiohttp.ClientSession, url: str) -> str:
    async with async_timeout.timeout(TIMEOUT):
        async with session.get(url, ssl=False) as resp:
            resp.raise_for_status()
            return await resp.text()


def detect_last_page(soup: BeautifulSoup) -> int:
    last_page = 1
    nav = soup.select_one("div.pagination div.pagination__index ul")
    if not nav:
        return last_page
    for a in nav.find_all("a"):
        m = re.search(r"/reacties/(?:datum|naam)/(\d+)", a.get("href", ""))
        if m:
            last_page = max(last_page, int(m.group(1)))
    return last_page


def parse_list_items(soup: BeautifulSoup) -> List[Dict]:
    out = []
    box = soup.select_one("div.result--list ul")
    if not box:
        return out
    for li in box.find_all("li", recursive=False):
        a = li.find("a")
        p = li.find("p")
        if not a:
            continue
        name = a.get_text(strip=True)
        href = a.get("href", "").strip()
        abs_link = urljoin(BASE, href)
        place, date_time = None, None
        if p:
            txt = p.get_text(" ", strip=True)
            if " | " in txt:
                place, date_time = txt.split(" | ", 1)
            else:
                place = txt
        out.append({
            "list_name": name,
            "list_place": place,
            "list_date_time": date_time,
            "detail_relative": href,
            "detail_url": abs_link,
        })
    return out


def parse_detail_html(html: str) -> Dict:
    soup = BeautifulSoup(html, "html.parser")
    data = {
        "detail_naam": None,
        "detail_plaats": None,
        "detail_datum": None,
        "qna": [],
        "raw_html_length": len(html),
    }

    table = soup.select_one("table.table__data-overview")
    if table:
        for tr in table.select("tr"):
            th, td = tr.find("th"), tr.find("td")
            if not th or not td:
                continue
            key = th.get_text(" ", strip=True).lower()
            val = td.get_text(" ", strip=True)
            if key == "naam":
                data["detail_naam"] = val
            elif key == "plaats":
                data["detail_plaats"] = val
            elif key == "datum":
                data["detail_datum"] = val

    content_root = soup.select_one('div.container[role="main"]#content')
    if content_root:
        for h3 in content_root.find_all("h3"):
            vraag = h3.get_text(" ", strip=True)
            blockquote = h3.find_next("blockquote")
            if blockquote:
                antwoord = blockquote.get_text("\n", strip=True)
                data["qna"].append({"vraag": vraag, "antwoord": antwoord})

    return data


async def fetch_detail(sem: asyncio.Semaphore, session: aiohttp.ClientSession, item: Dict) -> Dict:
    url = item["detail_url"]
    async with sem:
        try:
            # Small delay to be respectful to the server
            await asyncio.sleep(0.1)
            html = await fetch(session, url)
            detail = parse_detail_html(html)
        except Exception as e:
            error_msg = str(e) if str(e) else "Unknown error"
            print(f"    ! Error fetching {url}: {type(e).__name__}: {error_msg}", file=sys.stderr)
            detail = {"detail_naam": None, "detail_plaats": None, "detail_datum": None, "qna": [], "raw_html_length": 0}

    qna_flat = [f"{q['vraag']}: {q['antwoord']}" for q in detail.get("qna", [])]
    return {
        **item,
        "detail_naam": detail.get("detail_naam"),
        "detail_plaats": detail.get("detail_plaats"),
        "detail_datum": detail.get("detail_datum"),
        "qna_text": "\n\n".join(qna_flat),
        "qna_count": len(detail.get("qna", [])),
        "raw_html_length": detail.get("raw_html_length"),
        "_qna_structured": detail.get("qna", []),
    }


# ------------------------------
# Main
# ------------------------------
async def main_async():
    connector = aiohttp.TCPConnector(limit=20)
    sem = asyncio.Semaphore(MAX_CONCURRENCY)
    
    # Load previously seen IDs for incremental scraping
    seen_ids = load_seen_ids()
    new_seen_ids = set(seen_ids)
    print(f"Loaded {len(seen_ids)} previously seen IDs from state file", file=sys.stderr)
    
    async with aiohttp.ClientSession(headers=HEADERS, connector=connector) as session:
        # First page to detect number of pages
        first_url = f"{BASE}/{CONSULTATION_SLUG}/reacties/datum/1/{PER_PAGE}"
        html1 = await fetch(session, first_url)
        soup1 = BeautifulSoup(html1, "html.parser")
        last_page = detect_last_page(soup1)
        print(f"Detected {last_page} pages.", file=sys.stderr)

        all_items: List[Dict] = []
        total_items_found = 0
        for page in range(1, last_page + 1):
            list_url = f"{BASE}/{CONSULTATION_SLUG}/reacties/datum/{page}/{PER_PAGE}"
            print(f"Listing: {list_url}", file=sys.stderr)
            html = await fetch(session, list_url)
            soup = BeautifulSoup(html, "html.parser")
            items = parse_list_items(soup)
            total_items_found += len(items)
            
            # Filter out already seen items
            for item in items:
                if item["detail_relative"] in seen_ids:
                    continue   # skip old ones
                all_items.append(item)
                new_seen_ids.add(item["detail_relative"])

        print(f"Found {total_items_found} total items, {len(all_items)} new items to fetch (previously seen: {len(seen_ids)})", file=sys.stderr)

        if not all_items:
            print("No new items to process.", file=sys.stderr)
            return

        print(f"Starting to fetch {len(all_items)} detail pages...", file=sys.stderr)
        tasks = [fetch_detail(sem, session, it) for it in all_items]
        print(f"Created {len(tasks)} tasks, starting concurrent execution...", file=sys.stderr)
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Count successful vs failed fetches
    print(f"Completed all fetch tasks, processing results...", file=sys.stderr)
    
    # Handle any exceptions that were returned
    actual_results = []
    exceptions = 0
    for result in results:
        if isinstance(result, Exception):
            print(f"Task exception: {type(result).__name__}: {result}", file=sys.stderr)
            exceptions += 1
        else:
            actual_results.append(result)
    
    results = actual_results
    successful = sum(1 for r in results if r.get("raw_html_length", 0) > 0)
    failed = len(results) - successful
    print(f"Fetch results: {successful} successful, {failed} failed, {exceptions} task exceptions", file=sys.stderr)

    # Write CSV (append mode for incremental updates)
    csv_path = "natur_reacties.csv"
    fieldnames = [
        "list_name", "list_place", "list_date_time",
        "detail_relative", "detail_url",
        "detail_naam", "detail_plaats", "detail_datum",
        "qna_count", "qna_text", "raw_html_length"
    ]
    
    # Check if CSV exists to determine if we need to write headers
    csv_exists = os.path.exists(csv_path)
    with open(csv_path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        if not csv_exists:
            w.writeheader()
        for r in results:
            w.writerow({k: r.get(k, "") for k in fieldnames})
    print(f"Appended {len(results)} rows to CSV: {csv_path}")

    # Write JSONL (append mode)
    jsonl_path = "natur_reacties.jsonl"
    with open(jsonl_path, "a", encoding="utf-8") as f:
        for r in results:
            obj = {k: v for k, v in r.items() if k != "_qna_structured"}
            obj["qna"] = r.get("_qna_structured", [])
            f.write(json.dumps(obj, ensure_ascii=False) + "\n")
    print(f"Appended {len(results)} entries to JSONL: {jsonl_path}")
    
    # Save updated seen IDs state
    save_seen_ids(new_seen_ids)
    print(f"Updated state file with {len(new_seen_ids)} total seen IDs")


if __name__ == "__main__":
    asyncio.run(main_async())
