import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from api.answer_engine import generate_answer
from api.server import parse_structured_answer, ENGLISH_SITUATIONS

QUESTIONS = [
    "Should I hire a photographer for my birthday?",
    "Should I buy a new phone or save my money?",
    "Should I go on a trip this weekend?",
    "Should I leave my job and start a business?",
    "What should I do?",
    "I'm worried about my career.",
    "I want to celebrate my birthday, but I feel guilty spending money."
]

def main():
    results = []
    print("=" * 80)
    print("RUNNING 7-QUESTION LOCAL END-TO-END QUALITY CHECK")
    print("=" * 80)

    for idx, q in enumerate(QUESTIONS, 1):
        print(f"\nProcessing Question {idx}/{len(QUESTIONS)}: {q}")
        res = generate_answer("neutral", q, top_k=3, language="en")
        
        situation_data = res.get("situation", {})
        primary_id = situation_data.get("primary", "")
        confidence = situation_data.get("confidence", 0.0)
        
        structured = parse_structured_answer(
            res["answer"],
            situation_data,
            res.get("evidence", []),
            language="en"
        )
        display_heading = structured.get("situation", ENGLISH_SITUATIONS.get(primary_id, primary_id.replace("_", " ").title()))
        
        sources = res.get("sources", [])
        answer = res.get("answer", "")
        guard = res.get("answer_guard", {})
        
        item = {
            "index": idx,
            "question": q,
            "primary_id": primary_id,
            "confidence": confidence,
            "display_heading": display_heading,
            "sources": sources,
            "answer": answer,
            "guard": guard
        }
        results.append(item)

    out_path = ROOT / "scripts" / "e2e_results.json"
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved raw results to {out_path}")

if __name__ == "__main__":
    main()
