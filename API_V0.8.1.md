# V0.8.1 — API-backed Answer Engine

Adds a server-side API boundary around the existing Gita Brain.

Flow:
Android -> POST /v1/answer -> analysis -> retrieval -> evidence pack ->
grounded prompt -> LLM -> JSON response.

## Configure the server

PowerShell:
```powershell
$env:OPENAI_API_KEY="YOUR_SERVER_SIDE_KEY"
$env:GITA_BRAIN_MODEL="gpt-5.6"
```

Never put the API key inside the Android app.

## Test

```powershell
python scripts/test_v081.py
```

## Run

```powershell
python -m api.server
```

Default port: 8080.

Endpoint:
`POST /v1/answer`

Example request:
```json
{
  "mood": "anxious",
  "thought": "I'm scared my business will fail after two years of hard work."
}
```

The response contains the generated answer, detected situation, concepts,
source verse IDs, evidence, and grounding metadata.

This is a development foundation, not yet a production deployment.
Authentication, rate limiting, logging/privacy policy, and deployment come next.
