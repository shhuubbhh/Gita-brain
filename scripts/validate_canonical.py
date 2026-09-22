import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
chapters = json.loads((ROOT/"data/chapters.json").read_text(encoding="utf-8"))
verses = json.loads((ROOT/"data/processed/verses.json").read_text(encoding="utf-8"))

expected = {(c["chapter"], v) for c in chapters for v in range(1, c["expected_verses"] + 1)}

# The ingester already normalizes Chapter 13 to canonical numbering.
# Therefore, use source_chapter/source_verse only when present to reconstruct
# the canonical reference; otherwise use the stored chapter/verse directly.
def canonical_ref(v):
    if "source_chapter" in v and "source_verse" in v:
        ch, vs = v["source_chapter"], v["source_verse"]
        if ch == 13 and vs == 34:
            return (13, 33)
        if ch == 13 and vs == 35:
            return (13, 34)
        return (ch, vs)
    return (v["chapter"], v["verse"])

canonical_actual = {canonical_ref(v) for v in verses}
missing = sorted(expected - canonical_actual)
unexpected = sorted(canonical_actual - expected)

canonical_ids = [v["canonical_id"] for v in verses]
duplicate_ids = len(canonical_ids) != len(set(canonical_ids))
duplicate_canonical_refs = len(canonical_actual) != len(verses)

print("Expected canonical slots:", len(expected))
print("Loaded source records:", len(verses))
print("Canonicalized slots:", len(canonical_actual))
print("Missing canonical slots:", len(missing))
print("Unexpected canonical slots:", len(unexpected))
print("Duplicate canonical refs:", duplicate_canonical_refs)
print("Duplicate canonical IDs:", duplicate_ids)

if missing:
    print("First missing:", missing[:20])
if unexpected:
    print("Unexpected:", unexpected[:20])

if (
    missing
    or unexpected
    or duplicate_canonical_refs
    or duplicate_ids
    or len(verses) != 700
):
    raise SystemExit(1)

print("CANONICAL CORPUS VALIDATION PASSED: 700 verses.")
