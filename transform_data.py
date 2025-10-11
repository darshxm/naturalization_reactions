import pandas as pd

df = pd.read_csv("natur_reacties.csv")
df_clean = df.drop(columns=["list_name", "detail_relative", "detail_url", "detail_naam", "qna_text", "qna_count", "raw_html_length", "qna"])
df_clean.to_csv("nextjs-app/public/natur_reacties.csv", index=False)