import pandas as pd

df = pd.read_csv('natur_reacties.csv')

df_filtered = df[df['language']=="Other"]
print(df_filtered['qna_text'])
