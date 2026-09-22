import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.answer_guard import validate_answer

cases = [
    (
        "valid",
        "The Gita's teaching here can be connected to BG 2.47.",
        ["BG_2_47", "BG_2_38"]
    ),
    (
        "reject_unretrieved",
        "The Gita says this in BG 18.66.",
        ["BG_2_47", "BG_2_38"]
    ),
    (
        "empty",
        "",
        ["BG_2_47"]
    ),
]

failed = 0
for name, answer, sources in cases:
    result = validate_answer(answer, sources)
    expected = name == "valid"
    ok = result["valid"] == expected
    print(f"{name}: {'PASS' if ok else 'FAIL'}; result={result}")
    failed += not ok

print("V0.9 GROUNDING GUARD " + ("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
