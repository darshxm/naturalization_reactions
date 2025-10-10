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
CSV_PATH_IN  = "natur_reacties.csv"
BATCH_SIZE   = 20
MODEL_NAME   = "gemini-2.5-flash"
SAVE_INTERVAL = 5  # Save progress every N batches
SLEEP_TIME = 1  # Sleep time in seconds between API calls

# ----------------------------
# Structured output types
# ----------------------------
class Language(enum.Enum):
    DUTCH = "Dutch"
    ENGLISH = "English"
    OTHER = "Other"

class LanguageLabel(BaseModel):
    row_index: int
    language: Language

# ----------------------------
# Gemini client
# ----------------------------
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
        "You are a careful language detector.\n"
        "Task: For each item, read the 'text' and detect the primary language.\n"
        "Return a JSON array of objects with fields:\n"
        "- row_index: the same integer we provide\n"
        "- language: one of \"Dutch\", \"English\", or \"Other\"\n\n"
        "Language detection rules:\n"
        "- \"Dutch\" = text is primarily in Dutch\n"
        "- \"English\" = text is primarily in English\n"
        "- \"Other\" = text is in another language or mixed languages\n\n"
        "Items to classify (JSON):\n"
        f"{json.dumps(items, ensure_ascii=False)}"
    )

def classify_language_batch(df_batch: pd.DataFrame) -> List[LanguageLabel]:
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
            "response_schema": list[LanguageLabel],
        },
    )

    # Prefer structured parse; fallback to JSON text
    parsed = response.parsed
    if not parsed:
        parsed = [LanguageLabel(**obj) for obj in json.loads(response.text)]
    return parsed

def save_dataframe(df: pd.DataFrame):
    """Save the entire dataframe back to the CSV."""
    df.to_csv(CSV_PATH_IN, index=False)

def main():
    df = pd.read_csv(CSV_PATH_IN)
    
    # Check if language column exists
    if "language" not in df.columns:
        print("Error: 'language' column not found in CSV.")
        return
    
    # Filter rows where language is "Other"
    other_mask = df["language"] == "Other"
    other_indices = df[other_mask].index.tolist()
    
    if len(other_indices) == 0:
        print("No rows with language='Other' found. Nothing to process.")
        return
    
    print(f"Found {len(other_indices)} rows with language='Other'")
    print(f"Re-classifying language for these rows in batches of {BATCH_SIZE}...")
    
    # Create a new dataframe with just the rows to process
    df_to_process = df.loc[other_indices].copy()
    
    batch_count = 0
    processed_count = 0
    
    for start, end in chunk_indices(len(df_to_process), BATCH_SIZE):
        batch = df_to_process.iloc[start:end]
        results = classify_language_batch(batch)

        # Write results back into main dataframe
        for r in results:
            df.at[r.row_index, "language"] = r.language.value
            processed_count += 1

        print(f"Processed batch {batch_count + 1}: rows {start}–{end-1} of filtered data ({processed_count}/{len(other_indices)} total).")
        
        batch_count += 1
        
        # Save at regular intervals
        if batch_count % SAVE_INTERVAL == 0:
            save_dataframe(df)
            print(f"Progress saved to {CSV_PATH_IN}")
        
        # Sleep between batches to avoid rate limiting
        if end < len(df_to_process):  # Don't sleep after the last batch
            time.sleep(SLEEP_TIME)

    # Final save
    save_dataframe(df)
    
    # Show summary
    print(f"\nDone! Re-classified {processed_count} rows.")
    print("\nLanguage distribution after re-classification:")
    print(df["language"].value_counts())
    print(f"\nData saved to: {CSV_PATH_IN}")

if __name__ == "__main__":
    main()
