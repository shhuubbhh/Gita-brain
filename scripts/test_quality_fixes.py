import subprocess
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

queries = [
    ("Tell me about the Yoga of Action in Chapter 3", "neutral", 3),
    ("What does Chapter 2 teach", "neutral", 2),
    ("how to focus on my study", "neutral", None),
    ("I keep procrastinating", "neutral", None),
    ("BG 2.41", "neutral", 2),
    ("BG 4.17", "neutral", 4),
    ("hello how are you", "neutral", None),
    ("I feel so lonely and full of guilt", "neutral", None),
    ("I am terrified of failing", "anxious", 2)
]

failed = 0
for text, mood, exp_chap in queries:
    p = subprocess.run(
        [sys.executable, "scripts/build_evidence_pack.py", "--mood", mood, "--text", text],
        capture_output=True,
        text=True,
        encoding="utf-8"
    )
    if p.returncode != 0:
        print(f"FAIL {text}: return code {p.returncode}: {p.stderr.strip()}")
        failed += 1
        continue
    data = json.loads(p.stdout)
    ev = data.get("gita_evidence", [])
    if not ev:
        print(f"FAIL {text}: gita_evidence is empty!")
        failed += 1
        continue
    # Check all items have translation and sanskrit
    missing = [x["verse_id"] for x in ev if not x.get("translation") or not x.get("sanskrit")]
    if missing:
        print(f"FAIL {text}: verses missing translation/sanskrit: {missing}")
        failed += 1
        continue
    primary_id = ev[0]["verse_id"]
    chap = ev[0].get("chapter")
    print(f"PASS: \"{text}\" -> {len(ev)} verses: {[x['verse_id'] for x in ev]} (primary: {primary_id}, chap: {chap})")

print(f"\nTotal test cases: {len(queries)}, Failed: {failed}")
sys.exit(failed)
