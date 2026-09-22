import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.answer_engine import generate_answer

def main():
    ap = argparse.ArgumentParser(description="Ask Gita Brain a grounded question.")
    ap.add_argument("--mood", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--top-k", type=int, default=3)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    result = generate_answer(args.mood, args.text, args.top_k)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    print("\n=== GITA BRAIN ===\n")
    print(result["answer"])
    print("\n--- Sources ---")
    print(", ".join(result["sources"]))
    print("\n--- Situation ---")
    print(result["situation"].get("primary"))
    print("\n--- Concepts ---")
    print(", ".join(result["concepts"]))

if __name__ == "__main__":
    main()
