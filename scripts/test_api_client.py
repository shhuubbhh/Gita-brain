import json
import sys
import urllib.request

url = "http://127.0.0.1:8080/v1/answer"
payload = {
    "mood": "neutral",
    "thought": "I have an important decision to make and I am afraid of choosing the wrong path.",
    "top_k": 3
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

print("Calling POST /v1/answer...")
try:
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP ERROR", e.code, ":", e.read().decode("utf-8"))
    sys.exit(1)

print("\n" + "="*50)
print("SUCCESSFULLY RECEIVED RESPONSE FROM GITA BRAIN SERVER!")
print("="*50)
structured = data.get("structured", {})
print("Emotion:", structured.get("emotion"))
print("Situation:", structured.get("situation"))
print("Understanding:", structured.get("understanding")[:120], "...")
verse = structured.get("verse", {})
print(f"Verse: Bhagavad Gita Chapter {verse.get('chapter')}, Verse {verse.get('verse')}")
print("Reflection:", structured.get("reflection")[:100], "...")
print("Action:", structured.get("action"))
print("="*50)
