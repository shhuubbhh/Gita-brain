import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
verses = json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))

for v in verses:
    if v.get("chapter") == 13 and v.get("verse") in (33, 34):
        print({
            "canonical_id": v["canonical_id"],
            "chapter": v["chapter"],
            "verse": v["verse"],
            "source_verse": v.get("source_verse"),
            "sanskrit_preview": v.get("sanskrit", "")[:80]
        })
