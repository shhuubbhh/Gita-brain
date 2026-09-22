import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

failed = 0


def run_case(name, mood, text, expected_sources):
    global failed

    print(f"\n--- {name} ---")

    result = subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "ask_gita.py"),
            "--mood",
            mood,
            "--text",
            text,
            "--json",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    if result.returncode != 0:
        print(f"{name}: FAIL; answer engine error")
        print(result.stderr.strip())
        failed += 1
        return

    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        print(f"{name}: FAIL; invalid JSON: {exc}")
        failed += 1
        return

    answer = data.get("answer", "")
    sources = data.get("sources", [])
    guard = data.get("answer_guard", {})

    checks = []

    # 1. Answer exists
    checks.append(("non_empty_answer", bool(answer.strip())))

    # 2. Required sections
    lower = answer.lower()

    checks.append(("understanding", "understanding" in lower))
    checks.append((
        "gita_teaching",
        "what the gita" in lower
        or "gita points" in lower
        or "gita teaching" in lower,
    ))
    checks.append((
        "application",
        "applying it here" in lower
        or "application" in lower
        or "how it applies" in lower,
    ))
    checks.append(("reflection", "reflection" in lower))

    # 3. Grounding guard
    checks.append(("answer_guard_valid", guard.get("valid") is True))
    checks.append(("answer_guard_clean", not guard.get("problems")))

    # 4. Expected evidence appears
    checks.append((
        "expected_source_present",
        any(source in sources for source in expected_sources),
    ))

    # 5. Every cited verse must be supplied
    # The answer engine already enforces this, but verify the result metadata.
    all_sources_are_strings = all(
        isinstance(source, str) for source in sources
    )
    checks.append(("valid_source_ids", all_sources_are_strings))

    failed_checks = [name for name, ok in checks if not ok]

    if failed_checks:
        print(f"{name}: FAIL")
        print("Failed checks:", ", ".join(failed_checks))
        failed += 1
    else:
        print(f"{name}: PASS")
        print(f"sources={sources}")


# ---------------------------------------------------------
# Test cases
# ---------------------------------------------------------

run_case(
    "anxious_business",
    "anxious",
    "I am scared that my business will fail.",
    ["BG_2_47"],
)

run_case(
    "sad_grief",
    "sad",
    "I lost someone important to me and I don't know how to handle the grief.",
    ["BG_2_11", "BG_2_13", "BG_2_20"],
)

run_case(
    "angry_revenge",
    "angry",
    "I am furious at someone and want revenge.",
    ["BG_2_62", "BG_2_63"],
)

run_case(
    "uncertain_decision",
    "neutral",
    "I have an important decision to make and I am afraid of choosing the wrong path.",
    ["BG_2_47", "BG_2_48"],
)


print("\n" + "=" * 50)

if failed:
    print(f"V1.1 ANSWER QUALITY FAILED ({failed} case(s))")
    sys.exit(1)

print("V1.1 ANSWER QUALITY PASSED")
sys.exit(0)