import pandas as pd
import os

df = pd.read_csv("data/natur_reacties_full.csv")

# Define columns to drop, but only drop those that exist
columns_to_drop = ["list_name", "detail_relative", "detail_url", "detail_naam", "qna_text", "qna_count", "raw_html_length", "qna", "identifies_as_immigrant"]
existing_columns_to_drop = [col for col in columns_to_drop if col in df.columns]

df_clean = df.drop(columns=existing_columns_to_drop)
df_clean.to_csv(os.path.join("..", "nextjs-app/public", "natur_reacties.csv"), index=False)

print(f"Transformed data saved to nextjs-app/public/natur_reacties.csv")
print(f"  Rows: {len(df_clean)}")
print(f"  Columns: {', '.join(df_clean.columns)}")
