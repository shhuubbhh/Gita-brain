import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failed = 0

corpus = json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))
ok = (
    len(corpus) == 700
    and len({x.get("canonical_id") for x in corpus}) == 700
    and all(x.get("sanskrit") for x in corpus)
    and all(isinstance(x.get("enrichment"), dict) for x in corpus)
)
print(f"canonical_source: {'PASS' if ok else 'FAIL'}; verses={len(corpus)}")
if not ok:
    failed += 1

cases = [
    ("anxious", "I've worked on my business for two years and I'm terrified that all of it will fail. What if I lose everything?", ["BG_2_47"]),
    ("sad", "I lost someone important to me and I don't know how to handle the grief.", ["BG_2_11", "BG_2_13", "BG_2_20"]),
    ("angry", "I am furious at someone and want revenge.", ["BG_2_62", "BG_2_63"]),
]

for mood, text, expected in cases:
    r = subprocess.run(
        [sys.executable, str(ROOT/"scripts/build_evidence_pack.py"),
         "--mood", mood, "--text", text, "--top-k", "3"],
        cwd=ROOT, capture_output=True, text=True,
        encoding="utf-8", errors="replace"
    )
    if r.returncode:
        print(f"evidence:{mood}: FAIL; builder error")
        failed += 1
        continue
    packet = json.loads(r.stdout)
    ev = packet.get("gita_evidence", [])
    ids = [x.get("verse_id") for x in ev]
    complete = all(x.get("sanskrit") and x.get("translation") for x in ev)
    matched = any(x in ids for x in expected)
    ok = bool(ev) and complete and matched
    print(f"evidence:{mood}: {'PASS' if ok else 'FAIL'}; sources={ids}; text_fields={'complete' if complete else 'incomplete'}")
    if not ok:
        failed += 1

print("V1.0 EVIDENCE QUALITY " + ("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
