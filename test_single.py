#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import asyncio
import aiohttp
import async_timeout
import json
from bs4 import BeautifulSoup

BASE = "https://internetconsultatie.nl"
CONSULTATION_SLUG = "naturalisatietermijn"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0; +https://example.org/bot) "
                  "AsyncScraper/2025-10-01"
}
TIMEOUT = 20

# Test with one of the URLs that was failing
TEST_URL = "https://internetconsultatie.nl/naturalisatietermijn/reactie/d4d35088-186f-4bda-83a4-5d41d273e445"

async def fetch(session: aiohttp.ClientSession, url: str) -> str:
    async with async_timeout.timeout(TIMEOUT):
        async with session.get(url, ssl=False) as resp:
            print(f"Status: {resp.status}")
            print(f"Headers: {dict(resp.headers)}")
            resp.raise_for_status()
            return await resp.text()

def parse_detail_html(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    data = {
        "detail_naam": None,
        "detail_plaats": None,
        "detail_datum": None,
        "qna": [],
        "raw_html_length": len(html),
    }

    print(f"HTML length: {len(html)}")
    print(f"Title: {soup.title.get_text() if soup.title else 'No title'}")

    table = soup.select_one("table.table__data-overview")
    if table:
        print("Found data table")
        for tr in table.select("tr"):
            th, td = tr.find("th"), tr.find("td")
            if not th or not td:
                continue
            key = th.get_text(" ", strip=True).lower()
            val = td.get_text(" ", strip=True)
            print(f"Table data: {key} = {val}")
            if key == "naam":
                data["detail_naam"] = val
            elif key == "plaats":
                data["detail_plaats"] = val
            elif key == "datum":
                data["detail_datum"] = val
    else:
        print("No data table found")

    content_root = soup.select_one('div.container[role="main"]#content')
    if content_root:
        print("Found content root")
        h3_count = len(content_root.find_all("h3"))
        print(f"Found {h3_count} h3 elements")
        
        for i, h3 in enumerate(content_root.find_all("h3")):
            vraag = h3.get_text(" ", strip=True)
            print(f"Question {i+1}: {vraag}")
            blockquote = h3.find_next("blockquote")
            if blockquote:
                antwoord = blockquote.get_text("\n", strip=True)
                print(f"Answer {i+1} (length: {len(antwoord)}): {antwoord[:100]}...")
                data["qna"].append({"vraag": vraag, "antwoord": antwoord})
            else:
                print(f"No blockquote found for question {i+1}")
    else:
        print("No content root found")

    return data

async def test_single_url():
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        try:
            print(f"Testing URL: {TEST_URL}")
            html = await fetch(session, TEST_URL)
            print(f"Successfully fetched HTML ({len(html)} chars)")
            
            detail = parse_detail_html(html)
            print(f"\nParsed result:")
            print(f"Name: {detail['detail_naam']}")
            print(f"Place: {detail['detail_plaats']}")
            print(f"Date: {detail['detail_datum']}")
            print(f"Q&A count: {len(detail['qna'])}")
            
            # Save the raw HTML for inspection
            with open("test_response.html", "w", encoding="utf-8") as f:
                f.write(html)
            print(f"Saved raw HTML to test_response.html")
            
            # Save parsed data
            with open("test_result.json", "w", encoding="utf-8") as f:
                json.dump(detail, f, ensure_ascii=False, indent=2)
            print(f"Saved parsed data to test_result.json")
            
        except Exception as e:
            print(f"Error: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_single_url())