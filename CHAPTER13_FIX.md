# Chapter 13 numbering fix — V0.4.2

The previous validator contained a second bug: the ingestion script had already
normalized source Chapter 13 records to canonical numbering, but the validator
then normalized the already-normalized `chapter/verse` fields a second time.

That caused:
- canonical 13.33 to be interpreted as 13.33 correctly
- canonical 13.34 to be incorrectly treated as source 13.34 and changed to 13.33

V0.4.2 fixes this by using `source_chapter/source_verse` when reconstructing the
canonical reference. The stored `chapter/verse` fields remain the canonical
700-verse numbering.

Expected mapping:
- source 13.34 -> canonical BG_13_33
- source 13.35 -> canonical BG_13_34

No verse is deleted.
