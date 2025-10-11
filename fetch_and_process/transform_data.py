import pandas as pd
import os

df = pd.read_csv("data/natur_reacties_full.csv")
df_clean = df.drop(columns=["list_name", "detail_relative", "detail_url", "detail_naam", "qna_text", "qna_count", "raw_html_length", "qna", "identifies_as_immigrant"])
df_clean.to_csv(os.path.join("..", "nextjs-app/public", "natur_reacties.csv"), index=False)
