import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from api.server import parse_structured_answer, ENGLISH_SITUATIONS, HINDI_SITUATIONS

failed = 0

def check(name, condition, details=""):
    global failed
    if condition:
        print(f"  [PASS] {name}")
    else:
        print(f"  [FAIL] {name}: {details}")
        failed += 1

def run_analyzer(text, mood="neutral"):
    sub_env = {"PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
    res = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "analyze_input.py"), "--mood", mood, "--text", text],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    if res.returncode != 0:
        raise RuntimeError(f"analyze_input.py failed: {res.stderr}")
    return json.loads(res.stdout)

print("=" * 60)
print("RUNNING GITA BRAIN SITUATION CLASSIFICATION REGRESSION SUITE")
print("=" * 60)

# -------------------------------------------------------------
# 1. Photographer Query Tests (Objective 1, 2, 4 & Requirements)
# -------------------------------------------------------------
print("\n--- Test 1: Birthday Photographer (Practical Decision) ---")
q1 = "I wanna hire a photographer for my birthday. What should I do?"
a1 = run_analyzer(q1)
sit1 = a1["situation"]
primary1 = sit1["primary"]
conf1 = sit1["confidence"]

check("Primary is not career_confusion", primary1 != "career_confusion", f"Got: {primary1}")
check("Primary is practical/everyday decision", primary1 in ["everyday_decision", "decision_conflict"], f"Got: {primary1}")
check("Matched phrases does not contain career confusion alias", "what should i do" not in a1["situation"].get("matched_phrases", []) or primary1 != "career_confusion")

# Test Display Heading in English and Hindi
resp_en1 = parse_structured_answer("### Understanding\nReflecting...", sit1, [], language="en")
resp_hi1 = parse_structured_answer("### समझ\nविचार...", sit1, [], language="hi")
head_en1 = resp_en1["situation"]
head_hi1 = resp_hi1["situation"]

check("English heading does not contain Career Confusion", "Career" not in head_en1, f"Got: {head_en1}")
check("Hindi heading does not contain Career Confusion", "कैरियर" not in head_hi1, f"Got: {head_hi1}")
check("English heading is accurate", head_en1 == "A Personal Decision", f"Got: {head_en1}")
check("Hindi heading is accurate", head_hi1 == "व्यक्तिगत निर्णय एवं विचार", f"Got: {head_hi1}")

# -------------------------------------------------------------
# 2. Career Path Query Tests (Valid Career Classification)
# -------------------------------------------------------------
print("\n--- Test 2: Career Path Choice ---")
q2 = "I'm confused about which career path to choose."
a2 = run_analyzer(q2, mood="confused")
sit2 = a2["situation"]
check("Primary is career_confusion", sit2["primary"] == "career_confusion", f"Got: {sit2['primary']}")
check("High confidence for explicit career query", sit2["confidence"] >= 0.85, f"Got: {sit2['confidence']}")

# -------------------------------------------------------------
# 3. Fear of Failure Query
# -------------------------------------------------------------
print("\n--- Test 3: Fear of Business Failure ---")
q3 = "I am afraid my business will fail."
a3 = run_analyzer(q3, mood="anxious")
sit3 = a3["situation"]
check("Primary is fear_of_failure", sit3["primary"] == "fear_of_failure", f"Got: {sit3['primary']}")
check("Confidence is grounded", sit3["confidence"] >= 0.80, f"Got: {sit3['confidence']}")

# -------------------------------------------------------------
# 4. Social Comparison Query
# -------------------------------------------------------------
print("\n--- Test 4: Social Comparison ---")
q4 = "Everyone around me is more successful than me."
a4 = run_analyzer(q4, mood="jealous")
sit4 = a4["situation"]
check("Primary is jealousy / comparison", sit4["primary"] in ["jealousy", "career_comparison"], f"Got: {sit4['primary']}")
check("Not misclassified as career_confusion", sit4["primary"] != "career_confusion", f"Got: {sit4['primary']}")

# -------------------------------------------------------------
# 5. Purchase Decision (Everyday Decision)
# -------------------------------------------------------------
print("\n--- Test 5: Buying a Phone ---")
q5 = "I don't know whether I should buy this phone."
a5 = run_analyzer(q5)
sit5 = a5["situation"]
check("Primary is everyday_decision or decision_conflict", sit5["primary"] in ["everyday_decision", "decision_conflict"], f"Got: {sit5['primary']}")
check("Not career_confusion", sit5["primary"] != "career_confusion", f"Got: {sit5['primary']}")

# -------------------------------------------------------------
# 6. Career Transition Decision
# -------------------------------------------------------------
print("\n--- Test 6: Job vs Business Decision ---")
q6 = "Should I leave my job and start my own business?"
a6 = run_analyzer(q6)
sit6 = a6["situation"]
check("Primary recognizes work/career context", sit6["primary"] in ["career_confusion", "decision_conflict"], f"Got: {sit6['primary']}")

# -------------------------------------------------------------
# 7. Life Direction Confusion
# -------------------------------------------------------------
print("\n--- Test 7: Life Confusion ---")
q7 = "I feel confused about my life."
a7 = run_analyzer(q7)
sit7 = a7["situation"]
check("Primary is general_uncertainty or purpose_crisis", sit7["primary"] in ["general_uncertainty", "purpose_crisis"], f"Got: {sit7['primary']}")
check("Not career_confusion", sit7["primary"] != "career_confusion", f"Got: {sit7['primary']}")

# -------------------------------------------------------------
# 8. Betrayal & Revenge
# -------------------------------------------------------------
print("\n--- Test 8: Betrayal & Revenge ---")
q8 = "Someone betrayed me and I want revenge."
a8 = run_analyzer(q8, mood="angry")
sit8 = a8["situation"]
check("Primary is revenge", sit8["primary"] == "revenge", f"Got: {sit8['primary']}")

# -------------------------------------------------------------
# 9. Money Spending Worry
# -------------------------------------------------------------
print("\n--- Test 9: Spending Money Anxiety ---")
q9 = "I am worried about spending too much money."
a9 = run_analyzer(q9, mood="anxious")
sit9 = a9["situation"]
check("Primary is money_anxiety", sit9["primary"] == "money_anxiety", f"Got: {sit9['primary']}")

# -------------------------------------------------------------
# 10. Photographer with Budget
# -------------------------------------------------------------
print("\n--- Test 10: Photographer with Budget ---")
q10 = "Should I hire a photographer for my birthday? I have a very limited budget."
a10 = run_analyzer(q10)
sit10 = a10["situation"]
check("Not career_confusion", sit10["primary"] != "career_confusion", f"Got: {sit10['primary']}")
check("Classified as everyday_decision, money_anxiety, or decision_conflict", sit10["primary"] in ["everyday_decision", "money_anxiety", "decision_conflict"], f"Got: {sit10['primary']}")

# -------------------------------------------------------------
# 11. Job Offer Decision
# -------------------------------------------------------------
print("\n--- Test 11: Job Offer Dilemma ---")
q11 = "I'm confused about whether to accept a job offer."
a11 = run_analyzer(q11)
sit11 = a11["situation"]
check("Primary is career_confusion", sit11["primary"] == "career_confusion", f"Got: {sit11['primary']}")

# -------------------------------------------------------------
# 12. Minimal Context ("What should I do?")
# -------------------------------------------------------------
print("\n--- Test 12: Minimal Context ('What should I do?') ---")
q12 = "What should I do?"
a12 = run_analyzer(q12)
sit12 = a12["situation"]
conf12 = sit12["confidence"]
check("Not career_confusion", sit12["primary"] != "career_confusion", f"Got: {sit12['primary']}")
check("Mapped to general_uncertainty or decision_conflict", sit12["primary"] in ["general_uncertainty", "decision_conflict"], f"Got: {sit12['primary']}")
check("Confidence is low (< 0.50) due to lack of context", conf12 < 0.50, f"Got confidence: {conf12}")

# -------------------------------------------------------------
# 13. Full Evidence Pack Pipeline Test
# -------------------------------------------------------------
print("\n--- Test 13: Full Pipeline Evidence Pack Relevance ---")
pack_res = subprocess.run(
    [sys.executable, str(ROOT / "scripts" / "build_evidence_pack.py"), "--mood", "neutral", "--text", q1, "--top-k", "3"],
    cwd=ROOT,
    capture_output=True,
    text=True,
    encoding="utf-8"
)
check("build_evidence_pack succeeds", pack_res.returncode == 0)
pack_data = json.loads(pack_res.stdout)
pack_sit = pack_data["understanding"]["situation"]["primary"]
check("Evidence pack situation is not career_confusion", pack_sit != "career_confusion", f"Got: {pack_sit}")
check("Evidence pack has valid verses", len(pack_data["gita_evidence"]) >= 1)

print("\n" + "=" * 60)
if failed == 0:
    print("ALL REGRESSION TESTS PASSED SUCCESSFULLY! (0 failures)")
else:
    print(f"REGRESSION TESTS FAILED: {failed} test(s) failed.")
print("=" * 60)

sys.exit(1 if failed else 0)
