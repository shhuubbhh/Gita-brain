import argparse, json, re, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
ROOT=Path(__file__).resolve().parents[1]
MOODS=json.loads((ROOT/"knowledge/mood_profiles.json").read_text(encoding="utf-8"))
ALIASES=json.loads((ROOT/"knowledge/situation_aliases.json").read_text(encoding="utf-8"))
SITU=json.loads((ROOT/"knowledge/situations.json").read_text(encoding="utf-8"))
CUES=json.loads((ROOT/"knowledge/concept_cues.json").read_text(encoding="utf-8"))

def norm(s): return re.sub(r"\s+"," ",s.lower().strip())

def phrase_in_text(phrase, text):
    if re.match(r"^[A-Za-z0-9_]+$", phrase):
        return bool(re.search(r"\b" + re.escape(phrase) + r"\b", text, re.I))
    return phrase in text

CHAPTER_CONCEPTS = {
    1: ["duty", "grief_of_loss", "attachment", "discernment"],
    2: ["knowledge", "self_knowledge", "equanimity", "action", "duty"],
    3: ["action", "duty", "discipline", "self_control"],
    4: ["knowledge", "action", "renunciation", "discipline"],
    5: ["renunciation", "action", "equanimity", "detachment"],
    6: ["meditation", "mind", "self_control", "equanimity"],
    7: ["knowledge", "devotion", "faith"],
    8: ["devotion", "mortality", "meditation"],
    9: ["devotion", "faith", "acceptance"],
    10: ["devotion", "knowledge", "faith"],
    11: ["devotion", "acceptance"],
    12: ["devotion", "equanimity", "compassion"],
    13: ["knowledge", "discernment", "self_knowledge"],
    14: ["gunas", "equanimity", "detachment"],
    15: ["self_knowledge", "knowledge", "devotion"],
    16: ["self_control", "anger", "desire", "ego"],
    17: ["faith", "discipline", "action"],
    18: ["duty", "action", "devotion", "freedom", "svadharma"]
}

def analyze(mood,text):
    t=norm(text)
    # Selected mood is authoritative UI context; text can still produce a
    # detected mood for diagnostics.
    mood_hits={}
    for m,p in MOODS.items():
        hits=[x for x in p["signals"] if phrase_in_text(x, t)]
        mood_hits[m]=hits
    detected=max(mood_hits,key=lambda x:len(mood_hits[x])) if any(mood_hits.values()) else "neutral"
    if mood in MOODS and mood!="neutral": detected=mood

    # Chapter and specific verse detection
    chapter_num = None
    specific_verse = None
    ch_m = re.search(r"\b(?:chapter|ch\.?)\s*(\d{1,2})\b", t)
    if ch_m:
        val = int(ch_m.group(1))
        if 1 <= val <= 18:
            chapter_num = val
    v_m = re.search(r"\b(?:bg|bhagavad\s*gita)?\s*(\d{1,2})[.:](\d{1,2})\b", t)
    if v_m:
        c_val, v_val = int(v_m.group(1)), int(v_m.group(2))
        if 1 <= c_val <= 18 and 1 <= v_val <= 78:
            specific_verse = f"BG_{c_val}_{v_val}"
            if not chapter_num:
                chapter_num = c_val

    # Domain Gatekeeper Tokens
    CAREER_DOMAIN_TOKENS = {
        "career", "job", "profession", "vocation", "workplace", "boss", "employer",
        "colleague", "coworker", "interview", "resume", "promotion", "resignation",
        "resign", "fired", "startup", "naukri", "pesha", "rozgar", "business", "dhandha"
    }
    FAMILY_DOMAIN_TOKENS = {
        "parents", "family", "father", "mother", "mom", "dad", "brother", "sister",
        "relatives", "parivar", "mata", "pita", "gharwale"
    }
    RELATIONSHIP_DOMAIN_TOKENS = {
        "ex", "boyfriend", "girlfriend", "partner", "husband", "wife", "relationship",
        "dating", "breakup", "broke up", "divorce"
    }
    MONEY_DOMAIN_TOKENS = {
        "money", "debt", "salary", "financial", "finances", "bills", "income", "broke",
        "budget", "cost", "expensive", "afford", "loan", "rupees", "dollars", "cash",
        "paisa", "paise", "karz", "dhan", "spending"
    }

    has_career_domain = any(phrase_in_text(w, t) for w in CAREER_DOMAIN_TOKENS)
    has_family_domain = any(phrase_in_text(w, t) for w in FAMILY_DOMAIN_TOKENS)
    has_rel_domain = any(phrase_in_text(w, t) for w in RELATIONSHIP_DOMAIN_TOKENS)
    has_money_domain = any(phrase_in_text(w, t) for w in MONEY_DOMAIN_TOKENS)

    # Situation phrase matching with Domain Gatekeeper
    sit_scores = []
    for sid, aliases in ALIASES.items():
        # Domain Gatekeeper: specific situations require domain grounding
        if sid == "career_confusion" and not has_career_domain:
            continue
        if sid == "career_comparison" and not has_career_domain:
            continue
        if sid == "family_pressure" and not has_family_domain:
            continue
        if sid == "breakup" and not has_rel_domain:
            continue
        if sid == "money_anxiety" and not has_money_domain:
            continue

        hits = [a for a in aliases if phrase_in_text(a, t)]
        if hits:
            # Specific multi-word phrases carry more situation evidence than
            # broad one-word matches such as "career" or "loss".
            score = sum(1.0 + 0.35 * max(0, len(a.split()) - 1) for a in hits)
            sit_scores.append((score, sid, hits))
    
    # Extended keywords for common everyday queries
    if "procrastinat" in t or "delaying" in t:
        sit_scores.append((2.0, "procrastination", ["procrastinating"]))
    if any(w in t for w in ["study", "focus", "concentrat", "distract"]):
        sit_scores.append((1.5, "procrastination", ["focus/discipline"]))

    sit_scores.sort(key=lambda x:(-x[0],x[1]))

    # Concept cues. Multi-word cues naturally carry semantic weight.
    concept_hits=[]
    for cid,cues in CUES.items():
        hits=[c for c in cues if phrase_in_text(c, t)]
        if hits:
            score=sum(2.0 if " " in h else 1.0 for h in hits)
            concept_hits.append((score,cid,hits))
            
    # Additional topic keywords
    if "yoga of action" in t or "karma yoga" in t:
        concept_hits.append((3.0, "action", ["yoga of action"]))
        concept_hits.append((2.5, "duty", ["karma yoga"]))
    if any(w in t for w in ["focus", "concentrat", "distract", "study"]):
        concept_hits.append((2.0, "mind", ["focus"]))
        concept_hits.append((2.0, "self_control", ["concentration"]))
        concept_hits.append((1.5, "discipline", ["study"]))

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
    
    primary=sit_scores[0][1] if sit_scores else "general_uncertainty"
    primary_concepts=[]
    if primary:
        primary_concepts=next((s["concepts"] for s in SITU if s["id"]==primary), [])

    # Situation concepts are the prior; text cues and mood are evidence.
    concepts=list(primary_concepts)
    for _,cid,_ in concept_hits:
        if cid not in concepts: concepts.append(cid)
    if detected in MOODS:
        for cid in MOODS[detected]["concepts"]:
            if cid not in concepts: concepts.append(cid)

    # If chapter detected, add chapter concepts
    if chapter_num and chapter_num in CHAPTER_CONCEPTS:
        for cid in CHAPTER_CONCEPTS[chapter_num]:
            if cid not in concepts: concepts.append(cid)
        if not primary or primary == "general_uncertainty":
            # Map chapter to default primary situation if none
            primary = "decision_conflict" if chapter_num in [1, 2] else "procrastination" if chapter_num == 3 else "purpose_crisis"

    # Absolute safety fallback: ensure concepts is never empty
    if not concepts:
        concepts = ["action", "duty", "equanimity", "knowledge"]
        if not primary:
            primary = "general_uncertainty"

    evidence=[]
    for score,cid,hits in concept_hits[:12]:
        evidence.append({"concept_id":cid,"score":score,"matched_phrases":hits,"source":"text_cue"})
    if primary:
        for cid in primary_concepts:
            if not any(e["concept_id"]==cid for e in evidence):
                evidence.append({"concept_id":cid,"score":0.5,"matched_phrases":[],
                                 "source":"situation_prior"})

    # Calibrated confidence calculation based on actual classification evidence
    sit_conf=0.0
    if sit_scores:
        top_score = sit_scores[0][0]
        top_sid = sit_scores[0][1]
        second_score = sit_scores[1][0] if len(sit_scores) > 1 else 0.0

        word_count = len(t.split())
        has_converging_cues = any(e["source"] == "text_cue" for e in evidence)

        # Isolated generic phrase with minimal context (e.g., "What should I do?")
        is_isolated_generic = (
            top_sid in ["general_uncertainty", "decision_conflict"] and
            word_count <= 5 and
            not has_converging_cues and
            detected == "neutral"
        )

        if is_isolated_generic:
            # Low confidence (< 0.50) for brief, open-ended generic phrases
            sit_conf = round(min(0.48, max(0.35, 0.35 + 0.02 * word_count)), 2)
        elif top_sid in ["general_uncertainty", "everyday_decision"]:
            # Moderate calibrated confidence for everyday practical decisions or general clarity
            sit_conf = round(min(0.75, 0.52 + 0.08 * top_score + (0.05 if has_converging_cues else 0.0)), 2)
        else:
            # Domain-specific situations with grounded evidence
            base_conf = 0.65
            if has_converging_cues:
                base_conf += 0.10
            diff = max(0.0, top_score - second_score)
            sit_conf = round(min(0.98, base_conf + 0.08 * top_score + 0.04 * diff), 2)
    elif chapter_num:
        sit_conf = 0.85
    else:
        sit_conf = 0.40

    if primary and any(e["concept_id"] in primary_concepts and e["source"]=="text_cue" for e in evidence):
        sit_conf=min(0.99, round(sit_conf+0.05, 2))

    mood_conf=1.0 if mood and mood!="neutral" else (
        min(0.95,0.45+0.12*len(mood_hits[detected])) if detected!="neutral" else 0.3
    )
    res = {
      "mood":{"selected":mood or "neutral","detected":detected,"confidence":round(mood_conf,2),
              "text_signals":mood_hits.get(detected,[])},
      "situation":{"primary":primary,"confidence":round(sit_conf,2),
                   "matched_phrases":sit_scores[0][2] if sit_scores else [],
                   "alternatives":[{"id":x[1],"hits":x[2]} for x in sit_scores[1:3]]},
      "concepts":concepts[:16],
      "concept_evidence":evidence[:16]
    }
    if chapter_num:
        res["chapter"] = chapter_num
    if specific_verse:
        res["specific_verse"] = specific_verse
    return res

ap=argparse.ArgumentParser(); ap.add_argument("--mood",default="neutral"); ap.add_argument("--text",required=True)
a=ap.parse_args()
print(json.dumps(analyze(a.mood,a.text),ensure_ascii=False,indent=2))
