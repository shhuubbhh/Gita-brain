import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib import request, error
from api.answer_guard import validate_answer

ROOT = Path(__file__).resolve().parents[1]

# Load local .env if present
env_file = ROOT / ".env"
if env_file.exists():
    try:
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k_clean = k.strip()
                v_clean = v.strip().strip('"').strip("'")
                if k_clean and k_clean not in os.environ:
                    os.environ[k_clean] = v_clean
    except Exception:
        pass


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


def _sanitize_error(msg: str) -> str:
    if not msg:
        return ""
    # Mask Bearer tokens
    msg = re.sub(r'Bearer\s+[A-Za-z0-9_\-\.]+', 'Bearer [REDACTED]', msg)
    # Mask API keys in URL query params
    msg = re.sub(r'key=[A-Za-z0-9_\-\.]+', 'key=[REDACTED]', msg)
    # Mask OpenAI style sk- keys
    msg = re.sub(r'sk-[A-Za-z0-9_\-\.]+', 'sk-[REDACTED]', msg)
    return msg


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
        clean_body = _sanitize_error(body)
        err_msg = f"LLM API error {e.code}: {clean_body}"
        if e.code == 401:
            err_msg = f"LLM API authentication failed (401 Unauthorized): Check API key. {clean_body}"
        elif e.code == 429:
            err_msg = f"LLM API rate limit or quota exceeded (429): {clean_body}"
        exc = RuntimeError(err_msg)
        exc.status_code = e.code
        raise exc from e
    except error.URLError as e:
        clean_msg = _sanitize_error(str(e))
        raise RuntimeError(f"LLM network error: {clean_msg}") from e


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


def _call_openai(prompt, key, model, base_url):
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    # 1. Attempt OpenAI /responses endpoint
    responses_url = base_url.rstrip("/") + "/responses"
    payload_responses = {"model": model, "input": prompt}
    try:
        data = _http_json(responses_url, payload_responses, headers)
        return _extract_openai_compatible(data)
    except RuntimeError as err:
        status = getattr(err, "status_code", None)
        # Fall back to /chat/completions if /responses is not supported or fails with 400/404/405
        if status in (400, 404, 405):
            chat_url = base_url.rstrip("/") + "/chat/completions"
            payload_chat = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2
            }
            chat_data = _http_json(chat_url, payload_chat, headers)
            return _extract_openai_compatible(chat_data)
        raise


def _call_groq(prompt, key, model, base_url):
    # Groq exposes an OpenAI-compatible chat-completions endpoint.
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
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


def get_active_model(provider: str) -> str:
    prov = provider.strip().lower()
    if prov == "gemini":
        return os.environ.get("GEMINI_MODEL") or os.environ.get("GITA_BRAIN_MODEL") or "gemini-2.5-flash"
    if prov == "openai":
        openai_model = os.environ.get("OPENAI_MODEL")
        if openai_model:
            return openai_model.strip()
        brain_model = os.environ.get("GITA_BRAIN_MODEL", "").strip()
        # Avoid carrying over gemini or groq model names if set globally
        if brain_model and not brain_model.lower().startswith("gemini-") and not brain_model.lower().startswith("llama-"):
            return brain_model
        return "gpt-4o"
    if prov == "groq":
        groq_model = os.environ.get("GROQ_MODEL")
        if groq_model:
            return groq_model.strip()
        brain_model = os.environ.get("GITA_BRAIN_MODEL", "").strip()
        if brain_model and not brain_model.lower().startswith("gemini-") and not brain_model.lower().startswith("gpt-"):
            return brain_model
        return "llama-3.3-70b-versatile"
    return os.environ.get("GITA_BRAIN_MODEL", "")


def call_llm(prompt):
    provider = os.environ.get("GITA_BRAIN_PROVIDER", "gemini").strip().lower()

    if provider == "gemini":
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY is not configured on the server")
        model = get_active_model("gemini")
        base_url = os.environ.get(
            "GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta"
        )
        return _call_gemini(prompt, key, model, base_url)

    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY")
        if not key:
            raise RuntimeError("OPENAI_API_KEY is not configured on the server")
        model = get_active_model("openai")
        base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
        return _call_openai(prompt, key, model, base_url)

    if provider == "groq":
        key = os.environ.get("GROQ_API_KEY")
        if not key:
            raise RuntimeError("GROQ_API_KEY is not configured on the server")
        model = get_active_model("groq")
        base_url = os.environ.get("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        return _call_groq(prompt, key, model, base_url)

    raise RuntimeError(
        f"Unsupported GITA_BRAIN_PROVIDER '{provider}'. "
        "Use: gemini, openai, or groq."
    )


# Backward-compatible names for existing callers.
def call_openai(prompt):
    return call_llm(prompt)


_call_openai_compatible = _call_openai


def generate_answer(mood, thought, top_k=3):
    evidence = build_evidence(mood, thought, top_k)
    prompt = build_prompt(evidence)
    answer = call_llm(prompt)
    guard = validate_answer(
        answer, [x["verse_id"] for x in evidence["gita_evidence"]]
    )
    if not guard["valid"]:
        raise RuntimeError(
            "Generated answer failed grounding guard: " +
            "; ".join(guard["problems"])
        )

    provider = os.environ.get("GITA_BRAIN_PROVIDER", "gemini").lower()
    return {
        "answer": answer,
        "provider": provider,
        "model": get_active_model(provider),
        "situation": evidence["understanding"]["situation"],
        "concepts": evidence["understanding"]["concepts"],
        "sources": [x["verse_id"] for x in evidence["gita_evidence"]],
        "evidence": evidence["gita_evidence"],
        "grounding": evidence["grounding"],
        "answer_guard": guard
    }
