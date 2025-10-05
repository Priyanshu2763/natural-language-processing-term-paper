import requests

url = "https://priyanshu161-test.hf.space/api/predict"
payload = {"data": ["speling"]}  # गलत शब्द input
response = requests.post(url, json=payload)
print(response.json())
