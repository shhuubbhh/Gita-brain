import argparse, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/"knowledge/verse_concept_candidates_v3.json"
SITU=ROOT/"knowledge/situations.json"
WEIGHTS=ROOT/"knowledge/retrieval_situation_weights.json"

REL={"DIRECT":3.0,"INFERRED":1.5,"CONTEXTUAL":0.5}
CONF={"high":1.0,"medium":0.8,"low":0.55}

def load():
    return (
        json.loads(CAND.read_text(encoding="utf-8")),
        json.loads(SITU.read_text(encoding="utf-8")),
        json.loads(WEIGHTS.read_text(encoding="utf-8"))
    )

def retrieve(concepts, situation_id=None, top_k=8):
    verses, situations, all_weights = load()
    q=list(dict.fromkeys(concepts))
    qs=set(q)
    sw=all_weights.get(situation_id, {}) if situation_id else {}

    scored=[]
    for v in verses:
        hits=[]
        score=0.0
        for c in v.get("candidates",[]):
            cid=c["concept_id"]
            if cid not in qs:
                continue

            # In situation mode, central concepts receive more influence.
            concept_weight=sw.get(cid, 1.0)
            evidence=REL[c["relationship"]]*CONF[c["confidence"]]
            reviewed_bonus=0.35 if c["review_status"]=="reviewed" else 0.0

            score += concept_weight * (evidence + reviewed_bonus)
            hits.append({
                "concept_id":cid,
                "relationship":c["relationship"],
                "confidence":c["confidence"],
                "review_status":c["review_status"],
                "concept_weight":concept_weight
            })

        if not hits:
            continue

        unique={h["concept_id"] for h in hits}
        # Coverage matters, but is capped so a verse does not win merely by
        # matching many low-priority concepts.
        weighted_coverage=sum(sw.get(cid,1.0) for cid in unique)
        total_query_weight=sum(sw.get(cid,1.0) for cid in qs) or 1.0
        coverage=min(weighted_coverage/total_query_weight, 1.0)
        score += 2.0*coverage

        direct=sum(h["relationship"]=="DIRECT" for h in hits)
        score += 0.4*min(direct,3)

        scored.append((score,v,hits))

    scored.sort(key=lambda x:(-x[0],x[1]["verse_id"]))

    return [{
        "verse_id":v["verse_id"],
        "score":round(score,3),
        "matched_concepts":hits
    } for score,v,hits in scored[:top_k]]

def situation_concepts(sid):
    situations=json.loads(SITU.read_text(encoding="utf-8"))
    for s in situations:
        if s["id"]==sid:
            return s["concepts"]
    raise SystemExit(f"Unknown situation: {sid}")

ap=argparse.ArgumentParser()
ap.add_argument("--situation")
ap.add_argument("--concept",action="append",default=[])
ap.add_argument("--top-k",type=int,default=8)
a=ap.parse_args()

if a.situation:
    concepts=situation_concepts(a.situation)
else:
    concepts=a.concept

if not concepts:
    raise SystemExit("Provide --situation or at least one --concept.")

print(json.dumps({
    "situation":a.situation,
    "concepts":concepts,
    "results":retrieve(concepts,a.situation,a.top_k)
},ensure_ascii=False,indent=2))
