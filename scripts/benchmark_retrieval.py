import json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CASES={
 "fear_of_failure":["BG_2_47"],
 "career_confusion":["BG_18_47","BG_3_19"],
 "anger_at_someone":["BG_2_62","BG_2_63"],
 "grief":["BG_2_11","BG_2_13","BG_2_20"],
}

failed=0
for sid,expected in CASES.items():
    p=subprocess.run(
        [sys.executable,str(ROOT/"scripts/retrieve_verses.py"),
         "--situation",sid,"--top-k","8"],
        capture_output=True,text=True
    )
    if p.returncode:
        print(sid+": ERROR")
        print(p.stderr)
        failed+=1
        continue

    data=json.loads(p.stdout)
    got=[x["verse_id"] for x in data["results"]]
    matched=[x for x in expected if x in got]

    # Quality condition: every case must retrieve at least one expected verse,
    # and grief must retrieve all three canonical benchmark passages.
    ok=bool(matched)
    if sid=="grief":
        ok=all(x in got for x in expected)

    print(
        f"{sid}: {'PASS' if ok else 'WEAK'}; "
        f"retrieved={got}; expected_hits={expected}; matched={matched}"
    )
    if not ok:
        failed+=1

print(
    "RETRIEVAL BENCHMARK COMPLETED"
    + (f" WITH {failed} WEAK/FAILED CASE(S)" if failed
       else " — ALL CASES PASS")
)
sys.exit(1 if failed else 0)
