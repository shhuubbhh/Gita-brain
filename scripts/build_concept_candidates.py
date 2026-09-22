"""
Build candidate verse -> concept mappings.

This is intentionally a CANDIDATE generator, not an authority.
It combines:
  1. Sūtrakṛt theme memberships
  2. our controlled theme -> concept map
  3. Sanskrit/IAST keyword aliases

Output:
  knowledge/verse_concept_candidates.json

A human/LLM review step should turn candidates into:
  knowledge/verse_concepts.json
with:
  - concept_id
  - evidence
  - confidence
  - review_status
"""

import json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
verses = json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))
aliases = json.loads((ROOT/"knowledge/concept_aliases.json").read_text(encoding="utf-8"))
theme_map = json.loads((ROOT/"knowledge/theme_to_concepts.json").read_text(encoding="utf-8"))

alias_norm = {
    c: [a.casefold() for a in terms]
    for c, terms in aliases.items()
}

out = []
for v in verses:
    scores = defaultdict(float)
    evidence = defaultdict(list)

    # Theme memberships are the strongest existing structured signal.
    for group in v.get("enrichment", {}).get("theme_list_memberships", []):
        theme = group.get("list")
        role = group.get("role", "secondary")
        boost = 1.0 if role == "primary" else 0.65
        for concept in theme_map.get(theme, []):
            scores[concept] += boost
            evidence[concept].append({"type":"theme","value":theme,"role":role})

    text = " ".join([
        v.get("sanskrit",""),
        v.get("transliteration",""),
        v.get("enrichment", {}).get("primary_meaning") or ""
    ]).casefold()

    # Lightweight lexical evidence only. It never overrides structured evidence.
    for concept, terms in alias_norm.items():
        hits = [t for t in terms if t and t in text]
        if hits:
            scores[concept] += min(0.5, 0.1 * len(hits))
            evidence[concept].append({"type":"lexical","hits":hits[:10]})

    candidates = []
    for concept, score in sorted(scores.items(), key=lambda x: -x[1]):
        if score >= 0.5:
            candidates.append({
                "concept_id": concept,
                "candidate_score": round(score, 3),
                "evidence": evidence[concept],
                "review_status": "candidate"
            })

    out.append({
        "verse_id": v["canonical_id"],
        "chapter": v["chapter"],
        "verse": v["verse"],
        "candidates": candidates
    })

(ROOT/"knowledge/verse_concept_candidates.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
print("Built candidates for", len(out), "verses.")
