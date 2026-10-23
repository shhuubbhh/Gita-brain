import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.answer_engine import call_llm, get_active_model, _sanitize_error, _extract_openai_compatible

# These checks only exercise configuration routing; they deliberately do not
# make network calls.
expected = {
    "gemini": "GEMINI_API_KEY",
    "openai": "OPENAI_API_KEY",
    "groq": "GROQ_API_KEY",
}

failed = 0
original = os.environ.copy()

for provider, key_name in expected.items():
    os.environ["GITA_BRAIN_PROVIDER"] = provider
    os.environ.pop("GEMINI_API_KEY", None)
    os.environ.pop("OPENAI_API_KEY", None)
    os.environ.pop("GROQ_API_KEY", None)

    try:
        call_llm("test")
    except RuntimeError as e:
        ok = key_name in str(e)
    except Exception:
        ok = False
    else:
        ok = False

    print(f"{provider}_routing: {'PASS' if ok else 'FAIL'}")
    failed += not ok

# Unsupported provider should fail clearly.
os.environ["GITA_BRAIN_PROVIDER"] = "not-a-provider"
try:
    call_llm("test")
except RuntimeError as e:
    ok = "Unsupported GITA_BRAIN_PROVIDER" in str(e)
else:
    ok = False

print(f"unsupported_provider: {'PASS' if ok else 'FAIL'}")
failed += not ok

# Test active model resolution
os.environ["GITA_BRAIN_PROVIDER"] = "openai"
os.environ["OPENAI_MODEL"] = "gpt-4o-mini"
os.environ["GITA_BRAIN_MODEL"] = "gemini-2.5-flash"
ok_model_1 = get_active_model("openai") == "gpt-4o-mini"

os.environ.pop("OPENAI_MODEL", None)
# Should ignore mismatched gemini- model name when provider is openai
ok_model_2 = get_active_model("openai") == "gpt-4o"

print(f"openai_model_resolution: {'PASS' if (ok_model_1 and ok_model_2) else 'FAIL'}")
failed += not (ok_model_1 and ok_model_2)

# Test credential sanitization
dirty_error = "Error: Invalid token Bearer sk-proj-1234567890abcdef at key=AIzaSyDummyKey"
cleaned = _sanitize_error(dirty_error)
ok_sanitization = ("sk-proj" not in cleaned and "AIzaSyDummyKey" not in cleaned and "[REDACTED]" in cleaned)
print(f"error_sanitization: {'PASS' if ok_sanitization else 'FAIL'}")
failed += not ok_sanitization

# Test OpenAI response extraction (chat completions and responses)
chat_response = {"choices": [{"message": {"content": "Om Shanti"}}]}
responses_api_response = {"output_text": "Om Shanti"}
ok_extract = (
    _extract_openai_compatible(chat_response) == "Om Shanti" and
    _extract_openai_compatible(responses_api_response) == "Om Shanti"
)
print(f"openai_response_extraction: {'PASS' if ok_extract else 'FAIL'}")
failed += not ok_extract

os.environ.clear()
os.environ.update(original)

print("V0.9.1 PROVIDER ROUTING " + ("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)

