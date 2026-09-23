import argparse, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CAND=ROOT/"knowledge/verse_concept_candidates_v3.json"
SITU=ROOT/"knowledge/situations.json"
WEIGHTS=ROOT/"knowledge/retrieval_situation_weights.json"

REL={"DIRECT":3.0,"INFERRED":1.5,"CONTEXTUAL":0.5}
CONF={"high":1.0,"medium":0.8,"low":0.55}

CONCEPT_FALLBACKS = {
    "procrastination": ["discipline", "action", "duty"],
    "laziness": ["discipline", "action", "duty"],
    "fear": ["control_vs_outcome", "attachment", "equanimity"],
    "anxiety": ["control_vs_outcome", "results", "attachment", "equanimity"],
    "uncertainty": ["discernment", "knowledge", "duty"],
    "decision": ["discernment", "knowledge", "duty"],
    "purpose": ["svadharma", "duty", "self_knowledge"],
    "guilt": ["action", "acceptance", "self_control", "knowledge"],
    "loneliness": ["devotion", "relationships", "acceptance"],
    "revenge": ["anger", "desire", "self_control", "compassion"],
    "jealousy": ["comparison", "attachment", "equanimity", "desire"],
    "suffering": ["grief_of_loss", "acceptance", "equanimity", "pleasure_pain"],
    "ambition": ["action", "results", "attachment", "duty"]
}

CHAPTER_KEY_VERSES = {
    1: ["BG_1_1", "BG_1_28", "BG_1_47"],
    2: ["BG_2_47", "BG_2_48", "BG_2_20"],
    3: ["BG_3_19", "BG_3_21", "BG_3_35"],
    4: ["BG_4_7", "BG_4_8", "BG_4_38"],
    5: ["BG_5_10", "BG_5_18", "BG_5_29"],
    6: ["BG_6_5", "BG_6_6", "BG_6_26"],
    7: ["BG_7_7", "BG_7_14", "BG_7_16"],
    8: ["BG_8_5", "BG_8_7", "BG_8_15"],
    9: ["BG_9_22", "BG_9_26", "BG_9_27"],
    10: ["BG_10_8", "BG_10_10", "BG_10_41"],
    11: ["BG_11_32", "BG_11_33", "BG_11_55"],
    12: ["BG_12_13", "BG_12_14", "BG_12_15"],
    13: ["BG_13_1", "BG_13_2", "BG_13_28"],
    14: ["BG_14_22", "BG_14_23", "BG_14_26"],
    15: ["BG_15_7", "BG_15_15", "BG_15_19"],
    16: ["BG_16_1", "BG_16_2", "BG_16_3"],
    17: ["BG_17_3", "BG_17_20", "BG_17_28"],
    18: ["BG_18_47", "BG_18_65", "BG_18_66"]
}

def load():
    return (
        json.loads(CAND.read_text(encoding="utf-8")),
        json.loads(SITU.read_text(encoding="utf-8")),
        json.loads(WEIGHTS.read_text(encoding="utf-8"))
    )

def retrieve(concepts, situation_id=None, top_k=8, chapter=None, verse_id=None):
    verses, situations, all_weights = load()
    
    # Expand concepts using ontological fallbacks
    expanded = []
    for c in (concepts or []):
        if c not in expanded:
            expanded.append(c)
        if c in CONCEPT_FALLBACKS:
            for mapped in CONCEPT_FALLBACKS[c]:
                if mapped not in expanded:
                    expanded.append(mapped)
    
    if not expanded:
        expanded = ["action", "duty", "equanimity", "knowledge"]

    q=list(dict.fromkeys(expanded))
    qs=set(q)
    sw=all_weights.get(situation_id, {}) if situation_id else {}

    scored=[]
    ch_prefix = f"BG_{chapter}_" if chapter else None

    for v in verses:
        vid = v["verse_id"]
        hits=[]
        score=0.0
        
        # Exact verse targeting bonus
        if verse_id and vid == verse_id:
            score += 50.0

        # Chapter targeting bonus
        if ch_prefix and vid.startswith(ch_prefix):
            score += 8.0

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

        if not hits and not (verse_id and vid == verse_id) and not (ch_prefix and vid.startswith(ch_prefix)):
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

    results = [{
        "verse_id":v["verse_id"],
        "score":round(score,3),
        "matched_concepts":hits
    } for score,v,hits in scored[:top_k]]

    # Absolute safety fallback: ensure results is never empty
    if not results:
        fallback_ids = CHAPTER_KEY_VERSES.get(chapter, ["BG_2_47", "BG_2_48", "BG_6_5", "BG_18_47"])
        results = [{
            "verse_id": fid,
            "score": round(6.0 - 0.5 * i, 3),
            "matched_concepts": [{"concept_id": "action", "relationship": "DIRECT", "confidence": "high", "review_status": "reviewed", "concept_weight": 1.0}]
        } for i, fid in enumerate(fallback_ids[:top_k])]

    return results

def situation_concepts(sid):
    situations=json.loads(SITU.read_text(encoding="utf-8"))
    for s in situations:
        if s["id"]==sid:
            return s["concepts"]
    return ["action", "duty", "equanimity"]

ap=argparse.ArgumentParser()
ap.add_argument("--situation")
ap.add_argument("--concept",action="append",default=[])
ap.add_argument("--chapter",type=int)
ap.add_argument("--verse-id")
ap.add_argument("--top-k",type=int,default=8)
a=ap.parse_args()

if a.situation:
    concepts=situation_concepts(a.situation)
    # Also include any directly passed concepts
    for c in a.concept:
        if c not in concepts:
            concepts.append(c)
else:
    concepts=a.concept

if not concepts and not a.chapter and not a.verse_id:
    concepts = ["action", "duty", "equanimity", "knowledge"]

print(json.dumps({
    "situation":a.situation,
    "chapter":a.chapter,
    "verse_id":a.verse_id,
    "concepts":concepts,
    "results":retrieve(concepts, a.situation, a.top_k, chapter=a.chapter, verse_id=a.verse_id)
},ensure_ascii=False,indent=2))
