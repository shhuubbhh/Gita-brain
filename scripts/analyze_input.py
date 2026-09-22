import argparse,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
MOODS=json.loads((ROOT/"knowledge/mood_profiles.json").read_text(encoding="utf-8"))
ALIASES=json.loads((ROOT/"knowledge/situation_aliases.json").read_text(encoding="utf-8"))
SITU=json.loads((ROOT/"knowledge/situations.json").read_text(encoding="utf-8"))
CUES=json.loads((ROOT/"knowledge/concept_cues.json").read_text(encoding="utf-8"))

def norm(s): return re.sub(r"\s+"," ",s.lower().strip())

def analyze(mood,text):
    t=norm(text)
    # Selected mood is authoritative UI context; text can still produce a
    # detected mood for diagnostics.
    mood_hits={}
    for m,p in MOODS.items():
        hits=[x for x in p["signals"] if x in t]
        mood_hits[m]=hits
    detected=max(mood_hits,key=lambda x:len(mood_hits[x])) if any(mood_hits.values()) else "neutral"
    if mood in MOODS and mood!="neutral": detected=mood

    # Situation phrase matching.
    sit_scores=[]
    for sid,aliases in ALIASES.items():
        hits=[a for a in aliases if a in t]
        if hits:
            # Specific multi-word phrases carry more situation evidence than
            # broad one-word matches such as "career" or "loss".
            score=sum(1.0 + 0.35*max(0,len(a.split())-1) for a in hits)
            sit_scores.append((score,sid,hits))
    sit_scores.sort(key=lambda x:(-x[0],x[1]))

    # Concept cues. Multi-word cues naturally carry semantic weight.
    concept_hits=[]
    for cid,cues in CUES.items():
        hits=[c for c in cues if c in t]
        if hits:
            score=sum(2.0 if " " in h else 1.0 for h in hits)
            concept_hits.append((score,cid,hits))
    concept_hits.sort(key=lambda x:(-x[0],x[1]))

    # Semantic fallback: jealousy can be expressed without the literal word
    # "jealous" (comparison, inferiority, wanting what others have). Prefer it
    # when its concept evidence is substantially stronger than a weak/no
    # situation phrase match.
    concept_ids={cid: (score,hits) for score,cid,hits in concept_hits}
    jealousy_score=concept_ids.get("jealousy",(0,[]))[0]
    comparison_score=concept_ids.get("comparison",(0,[]))[0]
    if jealousy_score>0 and (not sit_scores or sit_scores[0][0] <= 1):
        if jealousy_score >= 1.0 or comparison_score >= 1.0:
            sit_scores=[(1,"jealousy",concept_ids.get("jealousy",(0,[]))[1] or concept_ids.get("comparison",(0,[]))[1])] + [x for x in sit_scores if x[1]!="jealousy"]
    primary=sit_scores[0][1] if sit_scores else None
    primary_concepts=[]
    if primary:
        primary_concepts=next(s["concepts"] for s in SITU if s["id"]==primary)

    # Situation concepts are the prior; text cues and mood are evidence.
    concepts=list(primary_concepts)
    for _,cid,_ in concept_hits:
        if cid not in concepts: concepts.append(cid)
    if detected in MOODS:
        for cid in MOODS[detected]["concepts"]:
            if cid not in concepts: concepts.append(cid)

    evidence=[]
    for score,cid,hits in concept_hits[:12]:
        evidence.append({"concept_id":cid,"score":score,"matched_phrases":hits,"source":"text_cue"})
    if primary:
        for cid in primary_concepts:
            if not any(e["concept_id"]==cid for e in evidence):
                evidence.append({"concept_id":cid,"score":0.5,"matched_phrases":[],
                                 "source":"situation_prior"})

    # Confidence reflects converging evidence, not just one keyword.
    sit_conf=0.0
    if sit_scores:
        top=sit_scores[0][0]
        second=sit_scores[1][0] if len(sit_scores)>1 else 0
        sit_conf=min(0.97,0.58+0.10*top+0.05*max(0,top-second))
    if primary and any(e["concept_id"] in primary_concepts and e["source"]=="text_cue" for e in evidence):
        sit_conf=min(0.99,sit_conf+0.10)

    mood_conf=1.0 if mood and mood!="neutral" else (
        min(0.95,0.45+0.12*len(mood_hits[detected])) if detected!="neutral" else 0.3
    )
    return {
      "mood":{"selected":mood or "neutral","detected":detected,"confidence":round(mood_conf,2),
              "text_signals":mood_hits.get(detected,[])},
      "situation":{"primary":primary,"confidence":round(sit_conf,2),
                   "matched_phrases":sit_scores[0][2] if sit_scores else [],
                   "alternatives":[{"id":x[1],"hits":x[2]} for x in sit_scores[1:3]]},
      "concepts":concepts[:16],
      "concept_evidence":evidence[:16]
    }

ap=argparse.ArgumentParser(); ap.add_argument("--mood",default="neutral"); ap.add_argument("--text",required=True)
a=ap.parse_args()
print(json.dumps(analyze(a.mood,a.text),ensure_ascii=False,indent=2))
