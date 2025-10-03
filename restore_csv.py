#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Restore the CSV file from the JSONL backup
"""

import json
import pandas as pd

JSONL_PATH = "natur_reacties.jsonl"
CSV_OUTPUT = "natur_reacties.csv"

def restore_csv_from_jsonl():
    """Read JSONL file and convert to CSV"""
    data = []
    
    with open(JSONL_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    df.to_csv(CSV_OUTPUT, index=False)
    
    print(f"✓ Restored {len(df)} rows from {JSONL_PATH} to {CSV_OUTPUT}")
    print(f"✓ Columns: {', '.join(df.columns.tolist())}")
    
    return df

if __name__ == "__main__":
    df = restore_csv_from_jsonl()
