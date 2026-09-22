# V0.4 Retrieval Design

We will not use a single vector search.

## Stage 1 — Context analysis
User mood + thought -> structured problem + candidate concepts.

## Stage 2 — Candidate retrieval
Retrieve verses using:
- reviewed verse->concept mappings
- Sūtrakṛt intertextual links
- lexical/semantic embedding similarity

## Stage 3 — Re-ranking
Score candidates for:
- concept match
- direct textual relevance
- context fit
- source confidence
- diversity across verses

## Stage 4 — Reasoner
Give the LLM only the top evidence set and require it to distinguish:
SCRIPTURE / INTERPRETATION / APPLICATION.

The system should prefer 1–3 strong teachings rather than 10 weak matches.
