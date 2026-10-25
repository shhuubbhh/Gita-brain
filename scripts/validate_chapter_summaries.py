import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

def main():
    print("=" * 60)
    print("Running Chapter Summaries Validation Suite...")
    print("=" * 60)
    
    # 1. Load canonical sources
    chapters_meta_path = DATA_DIR / "chapters.json"
    verses_corpus_path = DATA_DIR / "processed" / "verses.json"
    gita_chapters_path = DATA_DIR / "gita_chapters.json"
    ts_file_path = ROOT / "frontend" / "src" / "data" / "chapterSummaries.ts"

    assert chapters_meta_path.exists(), f"Missing {chapters_meta_path}"
    assert verses_corpus_path.exists(), f"Missing {verses_corpus_path}"
    assert gita_chapters_path.exists(), f"Missing {gita_chapters_path}"
    assert ts_file_path.exists(), f"Missing {ts_file_path}"

    with open(chapters_meta_path, "r", encoding="utf-8") as f:
        chapters_meta = json.load(f)
    with open(verses_corpus_path, "r", encoding="utf-8") as f:
        verses_corpus = json.load(f)
    with open(gita_chapters_path, "r", encoding="utf-8") as f:
        gita_chapters = json.load(f)

    canonical_ch_counts = {c["chapter"]: c["expected_verses"] for c in chapters_meta}
    canonical_verse_ids = {v["canonical_id"] for v in verses_corpus}

    # 2. Verify dataset chapter count and uniqueness
    chapters_list = gita_chapters.get("chapters", [])
    print(f"Total chapters in dataset: {len(chapters_list)}")
    assert len(chapters_list) == 18, f"Expected 18 chapters, got {len(chapters_list)}"

    seen_chapters = set()
    total_important_verses = 0

    for ch in chapters_list:
        ch_num = ch["chapter_number"]
        assert 1 <= ch_num <= 18, f"Invalid chapter number: {ch_num}"
        assert ch_num not in seen_chapters, f"Duplicate chapter number: {ch_num}"
        seen_chapters.add(ch_num)

        # Canonical verse count verification (including Chapter 13 = 34 verses)
        expected_verses = canonical_ch_counts[ch_num]
        if ch_num == 13:
            assert expected_verses == 34, f"Chapter 13 expected 34 verses, got {expected_verses}"

        # Bilingual titles and Sanskrit names
        assert ch.get("sanskrit_name"), f"Missing sanskrit_name in ch {ch_num}"
        assert ch.get("sanskrit_name_devanagari"), f"Missing sanskrit_name_devanagari in ch {ch_num}"
        assert ch.get("title", {}).get("en"), f"Missing English title in ch {ch_num}"
        assert ch.get("title", {}).get("hi"), f"Missing Hindi title in ch {ch_num}"

        # Bilingual summaries
        summary = ch.get("summary", {})
        assert summary.get("en") and len(summary["en"].strip()) > 50, f"English summary too short in ch {ch_num}"
        assert summary.get("hi") and len(summary["hi"].strip()) > 50, f"Hindi summary too short in ch {ch_num}"

        # 3-5 Key teachings in both languages
        teachings = ch.get("key_teachings", [])
        assert 3 <= len(teachings) <= 5, f"Expected 3-5 teachings in ch {ch_num}, got {len(teachings)}"
        for idx, t in enumerate(teachings):
            assert t.get("en") and len(t["en"].strip()) > 0, f"Empty English teaching {idx} in ch {ch_num}"
            assert t.get("hi") and len(t["hi"].strip()) > 0, f"Empty Hindi teaching {idx} in ch {ch_num}"

        # Themes in both languages
        themes = ch.get("themes", {})
        assert themes.get("en") and len(themes["en"]) >= 2, f"Missing English themes in ch {ch_num}"
        assert themes.get("hi") and len(themes["hi"]) >= 2, f"Missing Hindi themes in ch {ch_num}"

        # Practical reflection in both languages
        reflection = ch.get("practical_reflection", {})
        assert reflection.get("en") and len(reflection["en"].strip()) > 10, f"Missing English practical reflection in ch {ch_num}"
        assert reflection.get("hi") and len(reflection["hi"].strip()) > 10, f"Missing Hindi practical reflection in ch {ch_num}"

        # Important verse verification against canonical corpus
        iv_list = ch.get("important_verses", [])
        assert len(iv_list) > 0, f"No important verses for ch {ch_num}"
        for iv in iv_list:
            v_ch = iv.get("chapter")
            v_num = iv.get("verse")
            assert v_ch == ch_num, f"Verse chapter {v_ch} does not match chapter {ch_num}"
            vid = f"BG_{v_ch}_{v_num}"
            assert vid in canonical_verse_ids, f"Important verse {vid} NOT found in canonical corpus!"
            total_important_verses += 1

    print(f"All 18 chapters validated against canonical corpus.")
    print(f"Total important verses verified: {total_important_verses}")

    # 3. Validate frontend chapterSummaries.ts export
    with open(ts_file_path, "r", encoding="utf-8") as f:
        ts_text = f.read()

    assert "export const CHAPTER_SUMMARIES" in ts_text, "CHAPTER_SUMMARIES export missing"
    assert "export const VERSE_DETAILS" in ts_text, "VERSE_DETAILS export missing"

    # Count occurrences of chapter: 1 .. 18
    for i in range(1, 19):
        assert f'"chapter": {i}' in ts_text, f'chapter: {i} missing from frontend TS bundle'

    print("Frontend bundle chapterSummaries.ts structure verified.")
    print("=" * 60)
    print("ALL 18 BHAGAVAD GITA CHAPTER SUMMARY CHECKS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
