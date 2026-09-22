"""
Ingest Sūtrakṛt-Gītā's 700 source records.

Chapter 13 source numbering is preserved, but normalized to the conventional
700-verse application numbering:
source 13.34 -> canonical 13.33
source 13.35 -> canonical 13.34
"""

import json, subprocess
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "processed"
RAW.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

repo = RAW / "sutrakrit-gita"
url = "https://github.com/ekras-doloop/sutrakrit-gita.git"

if repo.exists():
    subprocess.run(["git", "-C", str(repo), "pull", "--ff-only"], check=True)
else:
    subprocess.run(["git", "clone", "--depth", "1", url, str(repo)], check=True)

files = sorted((repo / "rendered").glob("bg_*_*.json"))
if len(files) != 700:
    raise RuntimeError(f"Expected 700 source records, found {len(files)}")

records = []
for path in files:
    obj = json.loads(path.read_text(encoding="utf-8"))
    ch, vs = map(int, obj["verse_id"].split("."))

    canonical_ch, canonical_vs = ch, vs
    aliases = []
    if ch == 13 and vs == 34:
        canonical_vs = 33
        aliases = [{"chapter": 13, "verse": 34, "source": "sutrakrit"}]
    elif ch == 13 and vs == 35:
        canonical_vs = 34
        aliases = [{"chapter": 13, "verse": 35, "source": "sutrakrit"}]

    m = obj["mūla"]
    records.append({
        "canonical_id": f"BG_{canonical_ch}_{canonical_vs}",
        "chapter": canonical_ch,
        "verse": canonical_vs,
        "source_chapter": ch,
        "source_verse": vs,
        "alternate_references": aliases,
        "sanskrit": m.get("devanāgarī", ""),
        "transliteration": m.get("iast", ""),
        "speaker": m.get("speaker"),
        "addressed_to": m.get("addressed_to"),
        "enrichment": {
            "primary_meaning": obj.get("primary_meaning"),
            "theme_list_memberships": obj.get("theme_list_memberships", []),
            "intertextual_panel": obj.get("intertextual_panel", []),
            "doctrinal_projections": obj.get("doctrinal_projections", {}),
            "everyday_applications": obj.get("everyday_applications", {})
        },
        "provenance": {
            "source_id": "sutrakrit_gita_canonical",
            "source_file": str(path.relative_to(repo)).replace("\\", "/"),
            "moola": obj.get("audit_trail", {}).get("corpus_provenance", {}).get("mūla"),
            "audit_trail": obj.get("audit_trail", {}),
            "ingested_at_utc": datetime.now(timezone.utc).isoformat()
        }
    })

records.sort(key=lambda x: (x["chapter"], x["verse"]))
out = OUT / "verses.json"
out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print("SUCCESS: wrote", len(records), "source records to", out)
