import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
d = json.loads((ROOT/"knowledge/verse_concept_candidates_v2.json").read_text(encoding="utf-8"))

ids = sys.argv[1:] or ["BG_2_47","BG_2_62","BG_2_63","BG_3_19","BG_6_5","BG_6_6","BG_12_13","BG_18_47","BG_18_66"]
for x in d:
    if x["verse_id"] in ids:
        print(x["verse_id"])
        for c in x["candidates"]:
            print("  ", c["concept_id"], c["relationship"], c["candidate_score"], c["evidence"])
