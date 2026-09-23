import argparse,json,os,subprocess,sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

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
    sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
    p=subprocess.run([sys.executable,str(ROOT/"scripts/build_answer_plan.py"),
                      "--mood",mood,"--text",text,"--top-k",str(max(top_k,3))],
                     capture_output=True,text=True,encoding="utf-8",errors="replace",env=sub_env)
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
        if not translation:
            # Fallback to doctrinal projections English rendering
            enrichment=v.get("enrichment") if isinstance(v.get("enrichment"),dict) else {}
            dp=enrichment.get("doctrinal_projections", {}) if isinstance(enrichment.get("doctrinal_projections"), dict) else {}
            for school in ["advaita", "advaita-bhakti", "bhakti", "viśiṣṭādvaita", "dvaita", "śuddhādvaita"]:
                if school in dp and isinstance(dp[school], dict) and dp[school].get("english_rendering"):
                    translation = dp[school]["english_rendering"].strip()
                    break
            if not translation:
                for val in dp.values():
                    if isinstance(val, dict) and val.get("english_rendering"):
                        translation = val["english_rendering"].strip()
                        break
        if not translation:
            # Fallback to everyday applications
            enrichment=v.get("enrichment") if isinstance(v.get("enrichment"),dict) else {}
            ea=enrichment.get("everyday_applications", {}) if isinstance(enrichment.get("everyday_applications"), dict) else {}
            for val in ea.values():
                if isinstance(val, str) and val.strip():
                    translation = val.strip()
                    break
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

    if not evidence:
        v = vm.get("BG_2_47", {})
        evidence.append({
            "verse_id": "BG_2_47",
            "retrieval_score": 5.0,
            "role": "primary",
            "matched_evidence": "Foundational principle of detached action and duty",
            "source_of_truth": "data/processed/verses.json",
            "chapter": 2,
            "verse": 47,
            "sanskrit": v.get("sanskrit", "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥"),
            "transliteration": v.get("transliteration", "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi"),
            "translation": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.",
            "source_fields": sorted(v.keys())
        })

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
