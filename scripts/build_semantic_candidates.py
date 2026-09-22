import json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
verses = json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))
ontology = json.loads((ROOT/"knowledge/ontology.json").read_text(encoding="utf-8"))
aliases = json.loads((ROOT/"knowledge/concept_aliases.json").read_text(encoding="utf-8"))
theme_map = json.loads((ROOT/"knowledge/theme_to_concepts.json").read_text(encoding="utf-8"))

concepts = {c["id"]: c for c in ontology["concepts"]}

# Controlled phrase evidence. The point is to favor precision over coverage.
phrase_rules = {
    "action": ["action","actions","karma","work","deed","deeds","act"],
    "duty": ["duty","dharma","obligation","duties"],
    "svadharma": ["svadharma","own duty","one's duty"],
    "attachment": ["attachment","attached","clinging","possess","possessiveness","fruit of action"],
    "detachment": ["detachment","detached","non-attachment","without attachment"],
    "results": ["result","results","fruit","fruits","reward","outcome"],
    "equanimity": ["equanimity","equal","balance","steadiness","evenness","samatva"],
    "desire": ["desire","desires","craving","kama","lust"],
    "anger": ["anger","angry","wrath","krodha"],
    "fear": ["fear","afraid","dread"],
    "grief": ["grief","sorrow","lament","lamentation","shoka"],
    "suffering": ["suffering","distress","duhkha","duḥkha"],
    "mind": ["mind","mental","thought","thoughts","manas"],
    "self_control": ["control","restrain","restraint","senses","discipline"],
    "discipline": ["practice","discipline","steadfast","steady practice"],
    "meditation": ["meditation","meditate","dhyana","dhyāna","concentration"],
    "knowledge": ["knowledge","wisdom","jnana","jñāna"],
    "discernment": ["discernment","discrimination","wise","understanding"],
    "self_knowledge": ["self","atman","ātman","soul","purusha","puruṣa"],
    "ego": ["ego","doer","doership","ahamkara","ahaṃkāra"],
    "identity": ["identity","status","reputation","role"],
    "compassion": ["compassion","kindness","friendliness","non-harm"],
    "relationships": ["friend","friends","enemy","enemies","family","beings"],
    "pleasure_pain": ["pleasure","pain","sukha","duhkha","duḥkha"],
    "gain_loss": ["gain","loss"],
    "success_failure": ["success","failure","victory","defeat"],
    "uncertainty": ["doubt","uncertainty","confusion","confused"],
    "decision": ["decision","dilemma","choose","choice"],
    "purpose": ["purpose","meaning","goal","path"],
    "ambition": ["ambition","achievement","status"],
    "mortality": ["death","dying","birth","rebirth","mortal"],
    "change": ["change","transient","temporary","perishable"],
    "faith": ["faith","trust","shraddha","śraddhā"],
    "devotion": ["devotion","bhakti","worship","surrender"],
    "renunciation": ["renunciation","renounce","sannyasa","saṃnyāsa"],
    "freedom": ["liberation","moksha","mokṣa","freedom"],
    "gunas": ["sattva","rajas","tamas","guna","guṇa"],
    "acceptance": ["forbearance","endure","tolerate","tolerance"],
    "control_vs_outcome": ["result","fruit","outcome","control"]
}

# Concepts that are too broad to accept from lexical evidence alone.
lexical_only_block = {"self_knowledge","knowledge","freedom","discernment","purpose","identity","relationships"}

def text_for(v):
    e = v.get("enrichment", {})
    return " ".join([
        v.get("sanskrit",""),
        v.get("transliteration",""),
        e.get("primary_meaning") or "",
        " ".join(str(x) for x in e.get("everyday_applications", {}).values())
    ]).casefold()

def theme_names(v):
    names = []
    for x in v.get("enrichment", {}).get("theme_list_memberships", []):
        if isinstance(x, dict):
            names.append((x.get("list"), x.get("role","secondary")))
    return names

out = []
for v in verses:
    scores = defaultdict(float)
    evidence = defaultdict(list)
    direct = set()

    # Strong structured source evidence.
    for theme, role in theme_names(v):
        boost = 2.0 if role == "primary" else 1.0
        for concept in theme_map.get(theme, []):
            scores[concept] += boost
            evidence[concept].append({"type":"source_theme","value":theme,"role":role})
            if role == "primary":
                direct.add(concept)

    text = text_for(v)
    for concept, phrases in phrase_rules.items():
        if concept in lexical_only_block and concept not in direct:
            continue
        hits = [p for p in phrases if p.casefold() in text]
        if hits:
            scores[concept] += min(0.9, 0.2 * len(hits))
            evidence[concept].append({"type":"lexical","hits":hits[:8]})

    # High-precision relational rules based on combinations of evidence.
    if {"action","results"} <= set(scores):
        scores["control_vs_outcome"] += 1.2
        evidence["control_vs_outcome"].append({"type":"rule","rule":"action+results"})
    if {"desire","anger"} <= set(scores):
        scores["attachment"] += 0.8
        evidence["attachment"].append({"type":"rule","rule":"desire+anger"})
    if {"success_failure","gain_loss"} <= set(scores):
        scores["equanimity"] += 0.8
        evidence["equanimity"].append({"type":"rule","rule":"outcome-pairs"})
    if {"duty","action"} <= set(scores):
        scores["svadharma"] += 0.4
        evidence["svadharma"].append({"type":"rule","rule":"duty+action"})

    candidates = []
    for concept, score in sorted(scores.items(), key=lambda x: -x[1]):
        if score < 0.8:
            continue
        if concept not in concepts:
            continue

        # Map score bands to relationship strength, not "truth".
        if concept in direct:
            relation = "DIRECT"
        elif score >= 2.0:
            relation = "INFERRED"
        else:
            relation = "CONTEXTUAL"

        candidates.append({
            "concept_id": concept,
            "relationship": relation,
            "candidate_score": round(score,3),
            "evidence": evidence[concept],
            "review_status": "candidate"
        })

    out.append({
        "verse_id": v["canonical_id"],
        "chapter": v["chapter"],
        "verse": v["verse"],
        "candidates": candidates
    })

out_path = ROOT/"knowledge/verse_concept_candidates_v2.json"
out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

print("Built V2 candidates for", len(out), "verses.")
print("Total candidates:", sum(len(x["candidates"]) for x in out))
print("Verses with candidates:", sum(bool(x["candidates"]) for x in out))
