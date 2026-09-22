import argparse, json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser()
ap.add_argument("--situation",required=True)
ap.add_argument("--top-k",type=int,default=8)
a=ap.parse_args()

p=subprocess.run(
    [sys.executable,str(ROOT/"scripts/retrieve_verses.py"),
     "--situation",a.situation,"--top-k",str(a.top_k)],
    capture_output=True,text=True
)
if p.returncode:
    print(p.stderr)
    raise SystemExit(p.returncode)

data=json.loads(p.stdout)
print("Situation:",data["situation"])
print("Concepts:",", ".join(data["concepts"]))
print("\nRanked verses:")
for i,r in enumerate(data["results"],1):
    print(f"{i}. {r['verse_id']}  score={r['score']}")
    print("   " + ", ".join(
        f"{x['concept_id']}:{x['relationship']}×{x['concept_weight']}"
        for x in r["matched_concepts"]
    ))
