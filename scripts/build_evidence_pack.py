import argparse,json,subprocess,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VERSE_FILE=ROOT/"data/processed/verses.json"
POL=ROOT/"knowledge/llm_response_contract.json"

def text_field(v, names):
    for n in names:
        x=v.get(n)
        if isinstance(x,str) and x.strip(): return x.strip()
    return None

def get_verse_map():
    vs=json.loads(VERSE_FILE.read_text(encoding="utf-8"))
    out={}
    for v in vs:
        vid=v.get("verse_id") or v.get("canonical_id") or v.get("id")
        if vid: out[vid]=v
    return out

def analyze_and_retrieve(mood,text,top_k):
    p=subprocess.run([sys.executable,str(ROOT/"scripts/build_answer_plan.py"),
                      "--mood",mood,"--text",text,"--top-k",str(max(top_k,3))],
                     capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr)
    return json.loads(p.stdout)

def build(mood,text,top_k=3):
    plan=analyze_and_retrieve(mood,text,top_k)
    vm=get_verse_map()
    evidence=[]
    for item in plan["retrieval"][:top_k]:
        v=vm.get(item["verse_id"],{})
        # Common schema candidates; absent fields are explicitly omitted.
        sanskrit=text_field(v,["sanskrit","text_sanskrit","verse_sanskrit","sloka","shloka"])
        translation=text_field(v,["translation","english_translation","text_english","meaning","translation_en"])
        if not translation:
            enrichment=v.get("enrichment") if isinstance(v.get("enrichment"),dict) else {}
            translation=text_field(enrichment,["primary_meaning","translation","english_translation","meaning"])
        transliteration=text_field(v,["transliteration","romanized"])
        chapter=v.get("chapter") or v.get("chapter_number")
        verse=v.get("verse") or v.get("verse_number")
        ev={"verse_id":item["verse_id"],"retrieval_score":item["score"],
            "role":item["role"],"matched_evidence":item.get("reason"),
            "source_of_truth":"data/processed/verses.json"}
        if chapter is not None: ev["chapter"]=chapter
        if verse is not None: ev["verse"]=verse
        if sanskrit: ev["sanskrit"]=sanskrit
        if transliteration: ev["transliteration"]=transliteration
        if translation: ev["translation"]=translation
        # Keep the complete source record available for audit, but don't put it
        # into the LLM prompt unless a supported textual field exists.
        ev["source_fields"]=sorted(v.keys())
        evidence.append(ev)

    return {
      "input":{"mood":mood,"thought":text},
      "understanding":{
        "situation":plan["situation"],
        "concepts":plan["concepts"],
        "concept_evidence":plan.get("concept_evidence",[])
      },
      "gita_evidence":evidence,
      "grounding":{
        "evidence_count":len(evidence),
        "max_scriptural_claims":len(evidence),
        "citation_required":True,
        "source_of_truth":"retrieved corpus only"
      }
    }

ap=argparse.ArgumentParser()
ap.add_argument("--mood",default="neutral")
ap.add_argument("--text",required=True)
ap.add_argument("--top-k",type=int,default=3)
ap.add_argument("--out")
a=ap.parse_args()
d=build(a.mood,a.text,a.top_k)
s=json.dumps(d,ensure_ascii=False,indent=2)
if a.out: Path(a.out).write_text(s,encoding="utf-8")
print(s)
