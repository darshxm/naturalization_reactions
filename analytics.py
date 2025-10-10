import pandas as pd
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import math
import time
import pandas as pd
from typing import List, Dict
from pydantic import BaseModel
import enum

# pip install google-genai pydantic pandas
from google import genai

# ----------------------------
# Config
# ----------------------------
CSV_PATH_IN  = "natur_reacties.csv"          # <-- change if your file has a different name
CSV_PATH_OUT = "natur_reacties_labeled.csv"
TEXT_COLUMN  = "qna_text"                     # column with opinion text
BATCH_SIZE   = 20
MODEL_NAME   = "gemini-2.5-flash"
SAVE_INTERVAL = 5  # Save progress every N batches
SLEEP_TIME = 1  # Sleep time in seconds between API calls
START_FRESH = False  # Set to True to start from beginning, False to resume from where you left off

# Define what “For/Against” means for your task.
POLICY_STATEMENT = (
    "the proposal to extend the Dutch naturalization waiting period from 5 years to 10 years"
)

# ----------------------------
# Structured output types
# ----------------------------
class Stance(enum.Enum):
    FOR = "For"
    AGAINST = "Against"

class Language(enum.Enum):
    DUTCH = "Dutch"
    ENGLISH = "English"
    OTHER = "Other"

class ImmigrantStatus(enum.Enum):
    YES = "Yes"
    NO = "No"
    UNCLEAR = "Unclear"

class OpinionLabel(BaseModel):
    row_index: int
    label: Stance
    language: Language
    identifies_as_immigrant: ImmigrantStatus

# ----------------------------
# Gemini client
# ----------------------------
# Ensure your API key is set in environment (e.g. export GEMINI_API_KEY=...)
def load_json_api(path: str) -> Dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

api_key = load_json_api("api.json")["gemini_key"]
client = genai.Client(api_key=api_key)

def chunk_indices(n_rows: int, batch_size: int):
    for start in range(0, n_rows, batch_size):
        yield start, min(start + batch_size, n_rows)

def build_prompt(items: List[Dict]) -> str:
    """
    items: list of {row_index: int, text: str}
    """
    return (
        "You are a careful annotator.\n"
        f"Task: For each item, read the 'text' and classify the author's stance toward {POLICY_STATEMENT}.\n"
        "Return a JSON array of objects with fields:\n"
        "- row_index: the same integer we provide\n"
        "- label: one of \"For\" or \"Against\" only\n"
        "- language: one of \"Dutch\", \"English\", or \"Other\" (detect the language of the text)\n"
        "- identifies_as_immigrant: one of \"Yes\", \"No\", or \"Unclear\" (does the author identify themselves as an immigrant/migrant?)\n\n"
        "Decision rules:\n"
        "- \"For\"  = the author supports the proposal.\n"
        "- \"Against\" = the author opposes the proposal.\n"
        "If the stance is mixed or ambiguous, pick the more likely one—do not return any other labels.\n\n"
        "- \"Dutch\" = text is primarily in Dutch\n"
        "- \"English\" = text is primarily in English\n"
        "- \"Other\" = text is in another language or mixed\n\n"
        "- \"Yes\" = the author explicitly identifies as an immigrant/migrant or strongly implies they are\n"
        "- \"No\" = the author clearly indicates they are not an immigrant/migrant\n"
        "- \"Unclear\" = there is no clear indication either way\n\n"
        "Items to classify (JSON):\n"
        f"{json.dumps(items, ensure_ascii=False)}"
    )

def classify_batch(df_batch: pd.DataFrame) -> List[OpinionLabel]:
    # Prepare minimal inputs to keep token usage efficient
    items = []
    for row_idx, row in df_batch.iterrows():
        # Collect text from both qna_text and qna columns
        text_parts = []
        
        # Get qna_text if available
        qna_text = str(row.get("qna_text", "") or "").strip()
        if qna_text:
            text_parts.append(qna_text)
        
        # Get qna if available (might be JSON string)
        qna = str(row.get("qna", "") or "").strip()
        if qna and qna != qna_text:  # Avoid duplication
            text_parts.append(qna)
        
        # Combine both columns
        text = " ".join(text_parts).strip()
        
        # Fallback: if text still empty, build from other columns (rare)
        if not text:
            parts = [
                str(row.get("detail_naam", "")),
                str(row.get("detail_plaats", "")),
            ]
            text = " ".join([p for p in parts if p]).strip()

        items.append({"row_index": int(row_idx), "text": text})

    prompt = build_prompt(items)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "temperature": 0.0,
            "response_mime_type": "application/json",
            "response_schema": list[OpinionLabel],  # Pydantic → schema sent to API
        },
    )

    # Prefer structured parse; fallback to JSON text
    parsed = response.parsed
    if not parsed:
        parsed = [OpinionLabel(**obj) for obj in json.loads(response.text)]
    return parsed

def save_stance_column(df: pd.DataFrame):
    """Save the entire dataframe (with stance column) back to the original CSV."""
    df.to_csv(CSV_PATH_IN, index=False)

def main():
    df = pd.read_csv(CSV_PATH_IN)
    
    # Initialize or reset columns based on START_FRESH setting
    if START_FRESH:
        print("Starting fresh - clearing all previous classifications...")
        df["stance"] = pd.NA
        df["language"] = pd.NA
        df["identifies_as_immigrant"] = pd.NA
        start_from = 0
    else:
        # Create columns if they don't exist
        if "stance" not in df.columns:
            df["stance"] = pd.NA
        if "language" not in df.columns:
            df["language"] = pd.NA
        if "identifies_as_immigrant" not in df.columns:
            df["identifies_as_immigrant"] = pd.NA
        
        # Find where to resume from (first row without a stance)
        start_from = 0
        if df["stance"].notna().any():
            # Find the first NA value after any filled values
            filled_count = df["stance"].notna().sum()
            start_from = filled_count
            print(f"Resuming from row {start_from} ({filled_count} already processed)")
        else:
            print("No previous progress found - starting from beginning...")

    n = len(df)
    if n == 0:
        print("No rows found in CSV.")
        return
    
    print(f"Classifying {n} opinions in batches of {BATCH_SIZE}...")

    batch_count = 0
    for start, end in chunk_indices(n, BATCH_SIZE):
        # Skip already processed batches
        if end <= start_from:
            continue
            
        batch = df.iloc[start:end]
        results = classify_batch(batch)

        # Write results back into dataframe
        for r in results:
            df.at[r.row_index, "stance"] = r.label.value
            df.at[r.row_index, "language"] = r.language.value
            df.at[r.row_index, "identifies_as_immigrant"] = r.identifies_as_immigrant.value

        print(f"Processed rows {start}–{end-1} ({end}/{n}).")
        
        batch_count += 1
        
        # Save at regular intervals
        if batch_count % SAVE_INTERVAL == 0:
            save_stance_column(df)
            print(f"Progress saved to {CSV_PATH_IN}")
        
        # Sleep between batches to avoid rate limiting
        if end < n:  # Don't sleep after the last batch
            time.sleep(SLEEP_TIME)

    # Final save
    save_stance_column(df)
    print(f"Done. Saved labeled data to: {CSV_PATH_IN}")

if __name__ == "__main__":
    main()
