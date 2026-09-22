"""
Canonicalization gate.

The selected source exposes 701 records. The standard application corpus is 700.
We intentionally stop here rather than silently dropping a Chapter 13 record.

A future approved mapping file should be:
    data/schemas/chapter13_mapping.json

It must explicitly identify how source Chapter 13 records map to the chosen
canonical edition. Once reviewed, this script can create:
    data/processed/verses.json
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source_path = ROOT / "data" / "processed" / "source_verses.json"
mapping_path = ROOT / "data" / "schemas" / "chapter13_mapping.json"

if not source_path.exists():
    raise SystemExit("Run scripts/ingest.py first.")

source = json.loads(source_path.read_text(encoding="utf-8"))
records = source["records"]

chapter13 = [r for r in records if r["chapter"] == 13]

print("Source records:", len(records))
print("Chapter 13 records:", len(chapter13))

if not mapping_path.exists():
    raise SystemExit(
        "STOP: Chapter 13 has an edition-numbering difference. "
        "Create and review data/schemas/chapter13_mapping.json before canonicalization."
    )

mapping = json.loads(mapping_path.read_text(encoding="utf-8"))

if mapping.get("status") != "reviewed":
    raise SystemExit("STOP: chapter13_mapping.json exists but is not marked reviewed.")

# No automatic dropping is performed by this scaffold.
raise SystemExit(
    "Mapping is marked reviewed, but automatic canonicalization is intentionally "
    "disabled until a human-approved mapping rule is implemented."
)
