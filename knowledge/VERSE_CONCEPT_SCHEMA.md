# Verse → Concept mapping

A mapping is not merely a keyword match.

```json
{
  "verse_id": "BG_2_47",
  "concept_id": "attachment",
  "relevance": 0.95,
  "evidence": [
    {"type": "source_theme", "value": "कर्म", "role": "primary"},
    {"type": "human_review", "note": "The verse explicitly distinguishes action from attachment to fruits."}
  ],
  "review_status": "reviewed",
  "reviewer": "..."
}
```

## Review states

- `candidate`: machine-generated; NOT safe for production retrieval
- `reviewed`: checked against the verse and source context
- `disputed`: plausible but interpretation-dependent
- `rejected`: false/weak association

## Rule

A concept should be attached because the verse supports the concept, not because
the concept is useful for a user's problem.
