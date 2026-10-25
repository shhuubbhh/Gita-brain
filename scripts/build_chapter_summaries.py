import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

with open(DATA_DIR / "gita_chapters.json", "r", encoding="utf-8") as f:
    gita_chapters = json.load(f)

with open(DATA_DIR / "chapters.json", "r", encoding="utf-8") as f:
    chapters_meta = json.load(f)

with open(DATA_DIR / "processed" / "verses.json", "r", encoding="utf-8") as f:
    verses_corpus = json.load(f)

# Optional Hindi translations for the 74 important verses
hi_meanings_path = DATA_DIR / "important_verse_meanings_hi.json"
hi_translations = {}
hi_source_meta = {}
if hi_meanings_path.exists():
    with open(hi_meanings_path, "r", encoding="utf-8") as f:
        hi_raw = json.load(f)
        hi_translations = hi_raw.get("translations", {})
        hi_source_meta = hi_raw.get("source", {})

ch_verse_counts = {c["chapter"]: c["expected_verses"] for c in chapters_meta}
verse_map = {v["canonical_id"]: v for v in verses_corpus}

chapters_out = []
verse_details = {}

for ch in gita_chapters["chapters"]:
    num = ch["chapter_number"]
    verse_count = ch_verse_counts.get(num, 0)
    
    important_verse_ids = []
    for iv in ch["important_verses"]:
        vid = f"BG_{iv['chapter']}_{iv['verse']}"
        important_verse_ids.append(vid)
        
        # Populate verse details from canonical corpus
        if vid in verse_map:
            v_data = verse_map[vid]
            enr = v_data.get("enrichment", {})
            primary_meaning = enr.get("primary_meaning")
            
            # If primary_meaning is None, extract from doctrinal renderings if available
            if not primary_meaning and "doctrinal_projections" in enr:
                projections = enr["doctrinal_projections"]
                for doc_key in ["bhakti", "advaita", "viśiṣṭādvaita", "dvaita"]:
                    if projections.get(doc_key):
                        primary_meaning = projections[doc_key]
                        break
            
            raw_sanskrit = v_data.get("sanskrit", "")
            raw_translit = v_data.get("transliteration", "")
            
            # Format shloka into traditional poetic lines
            fmt_sanskrit = raw_sanskrit.replace(" | ", " |\n") if " | " in raw_sanskrit and "\n" not in raw_sanskrit else raw_sanskrit
            fmt_translit = raw_translit.replace(" | ", " |\n") if " | " in raw_translit and "\n" not in raw_translit else raw_translit

            hi_entry = hi_translations.get(vid, {})
            hi_text = hi_entry.get("hi", "")

            verse_details[vid] = {
                "id": vid,
                "chapter": iv["chapter"],
                "verse": iv["verse"],
                "reference": f"{iv['chapter']}.{iv['verse']}",
                "sanskrit": fmt_sanskrit,
                "transliteration": fmt_translit,
                "english_translation": primary_meaning or "",
                "hindi_translation": hi_text,
                "has_hindi_translation": bool(hi_text)
            }
        else:
            print(f"WARNING: Verse ID {vid} not in corpus!")

    entry = {
        "chapter": num,
        "sanskrit_name": ch["sanskrit_name_devanagari"],
        "sanskrit_name_translit": ch["sanskrit_name"],
        "english_name": ch["title"]["en"],
        "hindi_name": ch["title"]["hi"],
        "verse_count": verse_count,
        "summary": {
            "en": ch["summary"]["en"],
            "hi": ch["summary"]["hi"]
        },
        "key_teachings": {
            "en": [kt["en"] for kt in ch["key_teachings"]],
            "hi": [kt["hi"] for kt in ch["key_teachings"]]
        },
        "themes": {
            "en": ch["themes"]["en"],
            "hi": ch["themes"]["hi"]
        },
        "practical_application": {
            "en": ch["practical_reflection"]["en"],
            "hi": ch["practical_reflection"]["hi"]
        },
        "important_verses": important_verse_ids
    }
    chapters_out.append(entry)

ts_content = f"""// Auto-generated from authoritative data/gita_chapters.json, data/chapters.json, and data/processed/verses.json
// DO NOT MODIFY DIRECTLY. Run scripts/build_chapter_summaries.py to regenerate.

export interface ChapterSummary {{
  chapter: number;
  sanskrit_name: string;
  sanskrit_name_translit: string;
  english_name: string;
  hindi_name: string;
  verse_count: number;
  summary: {{
    en: string;
    hi: string;
  }};
  key_teachings: {{
    en: string[];
    hi: string[];
  }};
  themes: {{
    en: string[];
    hi: string[];
  }};
  practical_application: {{
    en: string;
    hi: string;
  }};
  important_verses: string[];
}}

export interface CanonicalVerseDetail {{
  id: string;
  chapter: number;
  verse: number;
  reference: string;
  sanskrit: string;
  transliteration: string;
  english_translation: string;
  hindi_translation?: string;
  has_hindi_translation: boolean;
}}

export const VERSE_TRANSLATION_SOURCE = {json.dumps(hi_source_meta, ensure_ascii=False, indent=2)};

export const CHAPTER_SUMMARIES: ChapterSummary[] = {json.dumps(chapters_out, ensure_ascii=False, indent=2)};

export const VERSE_DETAILS: Record<string, CanonicalVerseDetail> = {json.dumps(verse_details, ensure_ascii=False, indent=2)};
"""

target_file = ROOT / "frontend" / "src" / "data" / "chapterSummaries.ts"
with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {len(chapters_out)} chapter summaries and {len(verse_details)} canonical verse details (with Hindi meanings) in {target_file}")
