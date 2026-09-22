import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.answer_engine import call_llm

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

os.environ.clear()
os.environ.update(original)

print("V0.9.1 PROVIDER ROUTING " + ("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
