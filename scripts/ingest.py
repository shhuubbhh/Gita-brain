"""
Download and normalize the selected Gita source.

Run:
    python scripts/ingest.py

Outputs:
    data/raw/chiragmirani_data.json
    data/processed/source_verses.json

Important:
- This script preserves the source's original IDs and verse numbering.
- It does NOT silently convert the 701-record source into 700 records.
- Canonical 700-verse mapping for Chapter 13 must be resolved explicitly.
"""

import json
import urllib.request
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
RAW.mkdir(parents=True, exist_ok=True)
PROCESSED.mkdir(parents=True, exist_ok=True)

URL = "https://chiragmirani.github.io/gita-quotes/data.json"
raw_path = RAW / "chiragmirani_data.json"
out_path = PROCESSED / "source_verses.json"

print("Downloading:", URL)
with urllib.request.urlopen(URL, timeout=60) as response:
    payload = response.read()

raw_path.write_bytes(payload)
data = json.loads(payload)

verses = data.get("verses", [])
if not verses:
    raise RuntimeError("No verses found in source payload.")

normalized = []
for item in verses:
    normalized.append({
        "source_id": item.get("id"),
        "chapter": int(item["chapter"]),
        "verse": int(item["verse"]),
        "sanskrit": item.get("sanskrit", ""),
        "transliteration": item.get("transliteration", ""),
        "translations": [
            {
                "language": "en",
                "text": item.get("english", ""),
                "author": item.get("translator", ""),
                "source": "chiragmirani_gita_quotes"
            },
            {
                "language": "en",
                "text": item.get("english_alt", ""),
                "author": item.get("translator_alt", ""),
                "source": "chiragmirani_gita_quotes"
            }
        ],
        "provenance": {
            "source_url": URL,
            "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
            "source_record": item.get("id")
        }
    })

out_path.write_text(
    json.dumps(
        {
            "source": "chiragmirani_gita_quotes",
            "source_url": URL,
            "source_total_verses": data.get("total_verses"),
            "records": normalized
        },
        ensure_ascii=False,
        indent=2
    ),
    encoding="utf-8"
)

print("Source records:", len(normalized))
print("Expected source count:", data.get("total_verses"))

if len(normalized) != 701:
    raise RuntimeError(f"Expected the selected source to contain 701 records; got {len(normalized)}.")

print("SUCCESS: source corpus downloaded and normalized.")
print("NEXT: run canonicalization review for Chapter 13 before producing data/processed/verses.json")
