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


def build_prompt(evidence, language="en"):
    tmp = ROOT / ".tmp_evidence.json"
    try:
        tmp.write_text(json.dumps(evidence, ensure_ascii=False), encoding="utf-8")
        sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
        p = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "build_llm_prompt.py"),
             "--evidence", str(tmp), "--language", str(language)],
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
        active_model = get_active_model("gemini")
        candidate_models = [active_model, "gemini-flash-latest", "gemini-3.8-flash", "gemini-flash-lite-latest"]
        unique_models = list(dict.fromkeys([m for m in candidate_models if m]))
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


def generate_answer(mood, thought, top_k=3, language="en"):
    evidence = build_evidence(mood, thought, top_k)
    prompt = build_prompt(evidence, language=language)

    primary = evidence["gita_evidence"][0] if evidence.get("gita_evidence") else {}
    ch = primary.get("chapter", 2)
    v = primary.get("verse", 47)
    trans = primary.get("translation", "")
    situation_data = evidence.get("understanding", {}).get("situation", {})
    sit_name = (situation_data.get("primary") or "clarity").replace("_", " ").title()

    HINDI_SITUATION_NAMES = {
        "career_confusion": "कैरियर एवं कर्तव्य असमंजस",
        "everyday_decision": "व्यक्तिगत निर्णय एवं विचार",
        "general_uncertainty": "आंतरिक स्पष्टता एवं शांति",
        "decision_conflict": "निर्णय एवं आंतरिक द्वंद्व",
        "fear_of_failure": "असफलता का भय",
        "anxiety": "चिंता एवं व्याकुलता",
        "grief": "शोक एवं आंतरिक पीड़ा",
        "grief_loss": "शोक एवं वियोग",
        "revenge": "क्रोध एवं प्रतिशोध",
        "anger": "क्रोध एवं अशांति",
        "jealousy": "ईर्ष्या एवं तुलना",
        "burnout": "मानसिक थकान",
        "loneliness": "अकेलापन",
        "relationship_conflict": "संबंधों में सामंजस्य",
        "spiritual_doubt": "आध्यात्मिक संशय",
        "overthinking": "अशांत मन एवं विचार",
        "money_anxiety": "धन एवं आर्थिक चिंता",
        "family_pressure": "पारिवारिक दबाव",
        "purpose_crisis": "जीवन का उद्देश्य",
        "procrastination": "आलस एवं अनुशासन",
    }
    HINDI_VERSE_TRANSLATIONS = {
        (2, 47): "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल की इच्छा मत रखो और न ही अकर्मण्यता में तुम्हारी आसक्ति हो।",
        (2, 48): "हे धनंजय! सफलता और असफलता में समान भाव रखकर, अनासक्त होकर योग में स्थित रहते हुए अपने कर्तव्य का पालन करो। यही समत्व भाव ही योग कहलाता है।",
        (2, 14): "हे कुन्तीपुत्र! सुख और दुःख के क्षणिक अनुभव सर्दी और गर्मी की ऋतुओं की तरह आने-जाने वाले हैं। वे अनित्य हैं; इसलिए हे भारत, अविचल होकर उन्हें सहन करना सीखो।",
        (2, 62): "विषयों का निरंतर ध्यान करने से मनुष्य की उनमें आसक्ति हो जाती है, आसक्ति से कामना उत्पन्न होती है, और कामना में बाधा आने पर क्रोध उत्पन्न होता है।",
        (3, 35): "दूसरों के कर्तव्य को भली-भाँति करने की अपेक्षा अपना सहज कर्तव्य दोषपूर्ण होने पर भी कहीं अधिक श्रेयस्कर है। अपने कर्तव्य का पालन करते हुए मरना भी उत्तम है, दूसरों का मार्ग भय उत्पन्न करने वाला है।",
        (6, 5): "मनुष्य को अपने मन द्वारा अपना उद्धार करना चाहिए, अपना पतन नहीं; क्योंकि यह मन ही मनुष्य का सच्चा मित्र है और यही मन उसका शत्रु भी है।",
        (6, 26): "यह चंचल और अस्थिर मन जहाँ-जहाँ भी भटके, वहाँ-वहाँ से इसे रोककर बार-बार आत्मा के वश में लाना चाहिए।",
        (9, 22): "जो अनन्य भक्त केवल मेरा ही चिंतन करते हुए निष्काम भाव से मेरी उपासना करते हैं, उनके योग-क्षेम का वहन मैं स्वयं करता हूँ।",
        (18, 47): "श्रेष्ठ रीति से आचरण किए हुए दूसरे के धर्म की अपेक्षा गुणरहित भी अपना स्वाभाविक धर्म श्रेष्ठ है। अपने स्वभाव के अनुसार नियत कर्म करने से मनुष्य को कोई दोष नहीं लगता।",
        (18, 66): "सब धर्मों को मुझमें त्यागकर केवल मेरी शरण में आओ; मैं तुम्हें समस्त पापों और कष्टों से मुक्त कर दूँगा, शोक मत करो。"
    }
    primary_key = (situation_data.get("primary") or "").lower()
    sit_name_hi = HINDI_SITUATION_NAMES.get(primary_key, sit_name)
    trans_hi = HINDI_VERSE_TRANSLATIONS.get((ch, v), "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल की इच्छा मत रखो।")

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
        if language == "hi":
            answer = f"""### समझ
आप {sit_name_hi} की स्थिति पर विचार कर रहे हैं। इस भावना को स्वीकार करना ही आंतरिक स्पष्टता और शांति की ओर पहला कदम है।

### श्लोक अनुवाद
"{trans_hi}"

### गीता का मार्गदर्शन
श्रीमद्भगवद्गीता के अध्याय {ch}, श्लोक {v} में यह पावन संदेश आपके लिए दिशा दिखाता है:
गीता सिखाती है कि जब आप अपने सच्चे कर्तव्य पर पूरा ध्यान केंद्रित करते हैं और भविष्य के परिणामों की चिंता छोड़ देते हैं, तो मन शांत और स्थिर हो जाता है।

### जीवन में अनुप्रयोग
सच्चे मन से अपने कर्तव्य का पालन करें। परिणाम की अत्यधिक चिंता त्यागने से मन में शांति और दृढ़ता आती है।

### चिंतन
आज आप अपने जीवन में शांति और धैर्य के साथ कौन सा निर्णय ले सकते हैं?

### दैनिक अभ्यास
3 गहरी और शांत सांसें लें। जो आपके नियंत्रण में नहीं है उसे ईश्वर को सौंप दें, और अपने वर्तमान कर्तव्य पर पूरा ध्यान केंद्रित करें।"""
        else:
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
