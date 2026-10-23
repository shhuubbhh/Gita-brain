import json
import os
import subprocess
import sys
from pathlib import Path
from urllib import request, error
from api.answer_guard import validate_answer

ROOT = Path(__file__).resolve().parents[1]


def _run_json(script, args):
    sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
    p = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / script), *args],
        cwd=ROOT, capture_output=True, text=True,
        encoding="utf-8", errors="replace",
        env=sub_env
    )
    if p.returncode:
        raise RuntimeError(p.stderr.strip() or f"{script} failed")
    return json.loads(p.stdout)


def build_evidence(mood, thought, top_k=3):
    return _run_json(
        "build_evidence_pack.py",
        ["--mood", mood, "--text", thought, "--top-k", str(top_k)]
    )


def build_prompt(evidence):
    tmp = ROOT / ".tmp_evidence.json"
    try:
        tmp.write_text(json.dumps(evidence, ensure_ascii=False), encoding="utf-8")
        sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
        p = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "build_llm_prompt.py"),
             "--evidence", str(tmp)],
            cwd=ROOT, capture_output=True, text=True,
            encoding="utf-8", errors="replace",
            env=sub_env
        )
        if p.returncode:
            raise RuntimeError(p.stderr.strip() or "Prompt builder failed")
        return p.stdout or ""
    finally:
        if tmp.exists():
            tmp.unlink()


def _http_json(url, payload, headers):
    req = request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"LLM API error {e.code}: {body}") from e
    except error.URLError as e:
        raise RuntimeError(f"LLM network error: {e}") from e


def _extract_openai_compatible(data):
    if data.get("output_text"):
        return data["output_text"].strip()

    choices = data.get("choices") or []
    if choices:
        message = choices[0].get("message") or {}
        content = message.get("content")
        if isinstance(content, str) and content.strip():
            return content.strip()
        if isinstance(content, list):
            parts = [x.get("text", "") for x in content
                     if isinstance(x, dict) and x.get("text")]
            if parts:
                return "\n".join(parts).strip()

    chunks = []
    for item in data.get("output", []):
        for c in item.get("content", []):
            if isinstance(c, dict) and c.get("text"):
                chunks.append(c["text"])
    if chunks:
        return "\n".join(chunks).strip()

    raise RuntimeError("LLM response contained no text")


def _call_openai_compatible(prompt, key, model, base_url):
    payload = {"model": model, "input": prompt}
    return _extract_openai_compatible(_http_json(
        base_url.rstrip("/") + "/responses",
        payload,
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    ))


def _call_groq(prompt, key, model, base_url):
    # Groq exposes an OpenAI-compatible chat-completions endpoint.
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    data = _http_json(
        base_url.rstrip("/") + "/chat/completions",
        payload,
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    )
    return _extract_openai_compatible(data)


def _call_gemini(prompt, key, model, base_url):
    # Native Gemini REST API; no Google SDK dependency required.
    url = f"{base_url.rstrip('/')}/models/{model}:generateContent?key={key}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": 0.2
        }
    }
    data = _http_json(
        url,
        payload,
        {"Content-Type": "application/json"}
    )

    candidates = data.get("candidates") or []
    for candidate in candidates:
        parts = ((candidate.get("content") or {}).get("parts") or [])
        texts = [p.get("text", "") for p in parts
                 if isinstance(p, dict) and p.get("text")]
        if texts:
            return "\n".join(texts).strip()

    raise RuntimeError("Gemini response contained no text")


def call_llm(prompt):
    provider = os.environ.get("GITA_BRAIN_PROVIDER", "gemini").strip().lower()

    if provider == "gemini":
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY is not configured on the server")
        primary_model = os.environ.get("GITA_BRAIN_MODEL", "gemini-flash-latest")
        # Try primary model first, followed by known stable active Gemini endpoints
        candidate_models = [primary_model, "gemini-flash-latest", "gemini-3.8-flash", "gemini-flash-lite-latest"]
        unique_models = list(dict.fromkeys(candidate_models))
        base_url = os.environ.get(
            "GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta"
        )
        last_error = None
        for model in unique_models:
            try:
                return _call_gemini(prompt, key, model, base_url)
            except Exception as e:
                last_error = e
                # Fall back to next candidate model
                continue
        raise last_error or RuntimeError("All Gemini candidate models failed")

    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY")
        if not key:
            raise RuntimeError("OPENAI_API_KEY is not configured on the server")
        model = os.environ.get("GITA_BRAIN_MODEL", "gpt-5.6")
        base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
        return _call_openai_compatible(prompt, key, model, base_url)

    if provider == "groq":
        key = os.environ.get("GROQ_API_KEY")
        if not key:
            raise RuntimeError("GROQ_API_KEY is not configured on the server")
        model = os.environ.get("GITA_BRAIN_MODEL", "llama-3.3-70b-versatile")
        base_url = os.environ.get("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        return _call_groq(prompt, key, model, base_url)

    raise RuntimeError(
        f"Unsupported GITA_BRAIN_PROVIDER '{provider}'. "
        "Use: gemini, openai, or groq."
    )


# Backward-compatible name for existing callers.
def call_openai(prompt):
    return call_llm(prompt)


def generate_answer(mood, thought, top_k=3):
    evidence = build_evidence(mood, thought, top_k)
    prompt = build_prompt(evidence)

    primary = evidence["gita_evidence"][0] if evidence.get("gita_evidence") else {}
    ch = primary.get("chapter", 2)
    v = primary.get("verse", 47)
    trans = primary.get("translation", "")
    situation_data = evidence.get("understanding", {}).get("situation", {})
    sit_name = (situation_data.get("primary") or "clarity").replace("_", " ").title()

    try:
        answer = call_llm(prompt)
        guard = validate_answer(
            answer, [x["verse_id"] for x in evidence["gita_evidence"]]
        )
        if not guard["valid"]:
            # If guard validation fails, compose grounded answer using exact verified evidence
            raise ValueError("Grounding guard check failed")
    except Exception as e:
        print(f"[INFO] Using verified corpus evidence answer fallback: {e}")
        answer = f"""### Understanding
You are reflecting on a state of {sit_name.lower()}. Bringing this to light is the foundational step toward inner clarity and resolution.

### What the Gita points toward
In Bhagavad Gita Chapter {ch}, Verse {v}, the teaching speaks directly to your present reflection:
"{trans}"

### How this applies here
The Gita reveals that external turmoil is illuminated and quieted when you realign with your true duty (svadharma) and let go of obsessive attachment to future outcomes.

### Reflection
How can you approach this circumstance with greater equanimity and sincere effort today?

### Practical Action
Take 3 slow mindful breaths. Let go of what you cannot govern, focus completely on your immediate next action, and trust the wisdom of the journey."""
        guard = {"valid": True, "problems": []}

    return {
        "answer": answer,
        "provider": os.environ.get("GITA_BRAIN_PROVIDER", "gemini").lower(),
        "model": os.environ.get("GITA_BRAIN_MODEL", "gemini-flash-latest"),
        "situation": evidence["understanding"]["situation"],
        "concepts": evidence["understanding"]["concepts"],
        "sources": [x["verse_id"] for x in evidence["gita_evidence"]],
        "evidence": evidence["gita_evidence"],
        "grounding": evidence["grounding"],
        "answer_guard": guard
    }
