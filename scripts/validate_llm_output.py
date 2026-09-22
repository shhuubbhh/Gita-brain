import argparse,json,re,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VERS=json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))
VALID=set(v.get("verse_id") or v.get("id") for v in VERS)

def validate(answer,evidence):
    ids=set(x["verse_id"] for x in evidence["gita_evidence"])
    mentioned=set(re.findall(r"\bBG_\d+_\d+\b",answer))
    unknown=mentioned-VALID
    supplied=mentioned-ids
    problems=[]
    if unknown: problems.append("unknown_verse_ids:"+",".join(sorted(unknown)))
    if supplied: problems.append("verse_ids_not_in_evidence:"+",".join(sorted(supplied)))
    required=["Understanding","What the Gita points toward","Applying it here","Reflection"]
    missing=[x for x in required if x.lower() not in answer.lower()]
    if missing: problems.append("missing_sections:"+",".join(missing))
    return problems

ap=argparse.ArgumentParser()
ap.add_argument("--answer",required=True)
ap.add_argument("--evidence",required=True)
a=ap.parse_args()
ans=Path(a.answer).read_text(encoding="utf-8")
ev=json.loads(Path(a.evidence).read_text(encoding="utf-8"))
problems=validate(ans,ev)
if problems:
 print("LLM OUTPUT VALIDATION FAILED")
 for p in problems: print(" -",p)
 sys.exit(1)
print("LLM OUTPUT VALIDATION PASSED")
