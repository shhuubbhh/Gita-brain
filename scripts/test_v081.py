import sys
from pathlib import Path
import subprocess
import json

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.answer_engine import build_evidence

cases = [
    ("anxious", "I'm scared my business will fail after two years of hard work.", "fear_of_failure", "BG_2_47"),
    ("sad", "I lost someone I loved and I don't know how to deal with the grief.", "grief", "BG_2_13"),
    ("angry", "Someone betrayed me and I want revenge.", "revenge", "BG_2_62"),
    ("jealous", "Everyone around me is succeeding and I feel jealous and behind.", "jealousy", "BG_2_62"),
    ("confused", "I don't know which career path I should choose.", "career_confusion", "BG_18_47"),
]

failed = 0
for mood, thought, situation, source in cases:
    d = build_evidence(mood, thought, 3)
    ids = [x["verse_id"] for x in d["gita_evidence"]]
    ok = d["understanding"]["situation"]["primary"] == situation and source in ids
    print(f"{situation}: {'PASS' if ok else 'FAIL'}; sources={ids}")
    failed += not ok

# Verify the actual V0.8 prompt builder contract without depending on an
# implementation-specific Python return value.
d = build_evidence("anxious", "I'm scared my business will fail.", 3)
tmp = ROOT / ".tmp_v081_evidence.json"
tmp.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
try:
    p = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build_llm_prompt.py"),
         "--evidence", str(tmp)],
        cwd=ROOT, capture_output=True, text=True,
        encoding="utf-8", errors="replace"
    )
    prompt = p.stdout or ""
finally:
    tmp.unlink(missing_ok=True)

normalized = " ".join(prompt.split())
checks = [
    "ONLY the supplied Gita evidence" in normalized,
    "Never fabricate quotations" in prompt,
    "GITA EVIDENCE" in prompt,
    "Required output headings" in prompt,
]
ok = p.returncode == 0 and all(checks)
print("server_prompt_contract:", "PASS" if ok else "FAIL")
if not ok:
    failed += 1

print("V0.8.1 API FOUNDATION " + ("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
