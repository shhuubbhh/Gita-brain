import json
import os
import re
import socket
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

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

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from api.answer_engine import generate_answer

MAX_TEXT = 4000


def _get_local_ips():
    ips = ["127.0.0.1"]
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


def parse_structured_answer(raw_text, situation, evidence):
    """
    Parses the Markdown answer from Gita Brain into structured sections
    suitable for mobile card rendering:
    - understanding
    - meaning
    - application
    - reflection
    - action
    """
    # Regex to split sections by ### headers
    sections = {}
    current_key = "intro"
    lines = raw_text.splitlines()
    buffer = []

    for line in lines:
        match = re.match(r"^###\s+(?:\d+\.\s+)?(.*)", line.strip())
        if match:
            if buffer:
                sections[current_key] = "\n".join(buffer).strip()
                buffer = []
            header = match.group(1).lower().strip()
            if "understand" in header:
                current_key = "understanding"
            elif "points toward" in header or "wisdom" in header or "teaching" in header or "mean" in header:
                current_key = "meaning"
            elif "apply" in header or "situation" in header or "here" in header:
                current_key = "application"
            elif "reflect" in header:
                current_key = "reflection"
            elif "action" in header:
                current_key = "action"
            else:
                current_key = header
        else:
            buffer.append(line)

    if buffer:
        sections[current_key] = "\n".join(buffer).strip()

    # Friendly emotion formatting
    primary_situation = (situation.get("primary") or "Seeking Clarity").replace("_", " ").title()
    emotion = f"{primary_situation}"

    # Extract primary verse details if available
    primary_verse = {}
    if evidence and len(evidence) > 0:
        for pv in evidence:
            if pv.get("translation") and pv.get("sanskrit"):
                primary_verse = {
                    "chapter": pv.get("chapter", 2),
                    "verse": pv.get("verse", 47),
                    "sanskrit": pv.get("sanskrit", ""),
                    "transliteration": pv.get("transliteration", ""),
                    "translation": pv.get("translation", "")
                }
                break
        if not primary_verse:
            pv = evidence[0]
            primary_verse = {
                "chapter": pv.get("chapter", 2),
                "verse": pv.get("verse", 47),
                "sanskrit": pv.get("sanskrit", ""),
                "transliteration": pv.get("transliteration", ""),
                "translation": pv.get("translation", "")
            }

    if not primary_verse or not primary_verse.get("translation"):
        primary_verse = {
            "chapter": 2,
            "verse": 47,
            "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            "transliteration": "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
            "translation": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction."
        }

    # Extract reflection quote
    reflection_text = sections.get("reflection", "")
    reflection_prompt = reflection_text
    # If reflection contains multiple paragraphs or quotes, clean it
    ref_match = re.search(r'["“]([^"”]+)["”]', reflection_text)
    if ref_match:
        reflection_prompt = ref_match.group(1).strip()

    # Generate one small action if not explicitly parsed
    action_text = sections.get("action", "")
    if not action_text:
        action_text = "Take 3 mindful breaths, focus on your sincere duty today, and release the anxious attachment to future outcomes."

    return {
        "emotion": emotion,
        "situation": primary_situation,
        "understanding": sections.get("understanding", raw_text[:300] + "..."),
        "meaning": sections.get("meaning", ""),
        "application": sections.get("application", ""),
        "reflection": reflection_prompt or "In what ways can you act with clarity and compassion today?",
        "action": action_text,
        "verse": primary_verse
    }


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin",
                         os.environ.get("CORS_ORIGIN", "*"))
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.end_headers()
        if body:
            self.wfile.write(body)

    def do_OPTIONS(self):
        self._json(204, {})

    def do_GET(self):
        if self.path in ("/", "/v1/health"):
            self._json(200, {
                "status": "ok",
                "service": "gita-brain",
                "version": "0.8.0"
            })
            return
        self._json(404, {"error": "not_found"})

    def do_POST(self):
        if self.path != "/v1/answer":
            self._json(404, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 10000:
                raise ValueError("request_too_large")
            data = json.loads(self.rfile.read(length))
            mood = str(data.get("mood", "neutral")).strip()
            thought = str(data.get("thought", "")).strip()
            top_k = max(1, min(int(data.get("top_k", 3)), 5))
            if not thought:
                raise ValueError("thought is required")
            if len(thought) > MAX_TEXT:
                raise ValueError(f"thought exceeds {MAX_TEXT} characters")
            
            result = generate_answer(mood, thought, top_k)
            # Add structured breakdown for mobile app UI
            result["structured"] = parse_structured_answer(
                result["answer"],
                result.get("situation", {}),
                result.get("evidence", [])
            )
            self._json(200, result)
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")
            self._json(400, {"error": str(e)})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    ips = _get_local_ips()
    print("=" * 60)
    print(f"Gita Brain API v0.8.0 listening on port {port}")
    print("Accessible locally & across your Wi-Fi network at:")
    for ip in ips:
        print(f"  -> http://{ip}:{port}/v1/answer")
    print("=" * 60)
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
