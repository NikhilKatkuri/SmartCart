import csv
import json

categories = {}

with open("SMART_CART_DATA.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        category = row["category"].strip()
        sub_category = row["sub_category"].strip()

        if category not in categories:
            categories[category] = set()

        if sub_category:
            categories[category].add(sub_category)

data = [
    {
        "name": category,
        "sub_categories": sorted(list(subcats))
    }
    for category, subcats in categories.items()
]

payload = {"data": data}

print(json.dumps(payload, indent=2, ensure_ascii=False))