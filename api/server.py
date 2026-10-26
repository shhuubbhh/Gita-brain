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
from api.answer_engine import generate_answer, get_active_model, _sanitize_error

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


def _clean_section_content(text):
    if not text:
        return ""
    # Strip leading markdown headers in both English and Hindi
    text = re.sub(
        r'^(?:#{1,4}\s+|\*\*)?(?:\d+[\.\)]\s+)?(?:understanding|what the gita points toward|applying it here|applying this here|reflection|daily practice|meaning|application|समझ|गीता का मार्गदर्शन|मार्गदर्शन|जीवन में अनुप्रयोग|अनुप्रयोग|चिंतन|दैनिक अभ्यास|अभ्यास)[\s:*#-]*(?:\*\*)?',
        '',
        text,
        flags=re.IGNORECASE
    ).strip()
    return text


ENGLISH_SITUATIONS = {
    "career_confusion": "Career Confusion",
    "everyday_decision": "A Personal Decision",
    "general_uncertainty": "Seeking Clarity",
    "decision_conflict": "Difficult Decision",
    "fear_of_failure": "Fear of Failure",
    "money_anxiety": "Money Anxiety",
    "loneliness": "Loneliness",
    "grief": "Grief After Loss",
    "guilt": "Guilt About Past Action",
    "procrastination": "Procrastination",
    "jealousy": "Comparison & Envy",
    "purpose_crisis": "Questioning Life Purpose",
    "revenge": "Desire for Revenge",
    "anger_at_someone": "Anger Toward Someone",
    "family_pressure": "Family Pressure",
    "breakup": "Breakup / Relationship Loss",
}

HINDI_SITUATIONS = {
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
    (9, 22): "जो अनन्य भक्त केवल मेरा ही चिंतन करते हुए निष्काम भाव से मेरी उपासना करते हैं, उनके योग-क्षेम (प्राप्ति और रक्षा) का वहन मैं स्वयं करता हूँ।",
    (18, 47): "श्रेष्ठ रीति से आचरण किए हुए दूसरे के धर्म की अपेक्षा गुणरहित भी अपना स्वाभाविक धर्म श्रेष्ठ है। अपने स्वभाव के अनुसार नियत कर्म करने से मनुष्य को कोई दोष नहीं लगता।",
    (18, 66): "सब धर्मों को मुझमें त्यागकर केवल मेरी शरण में आओ; मैं तुम्हें समस्त पापों और कष्टों से मुक्त कर दूँगा, शोक मत करो।"
}


def parse_structured_answer(raw_text, situation, evidence, language="en"):
    """
    Parses the Markdown answer from Gita Brain into structured sections
    suitable for mobile card rendering in English or Hindi:
    - understanding
    - meaning
    - application
    - reflection
    - action
    """
    sections = {}
    current_key = "intro"
    lines = raw_text.splitlines()
    buffer = []

    for line in lines:
        line_clean = line.strip()
        match = re.match(r"^(?:#{1,4}\s+|\*\*)?(?:\d+[\.\)]\s+)?(.*)", line_clean)
        header_candidate = match.group(1).lower().strip().rstrip(":*# ") if match else ""
        is_known_heading = any(k in header_candidate for k in (
            "understand", "points toward", "wisdom", "teaching", "mean",
            "apply", "situation", "here", "reflect", "action", "practice", "daily", "verse",
            "समझ", "मार्गदर्शन", "अनुप्रयोग", "चिंतन", "अभ्यास", "कदम", "सीख", "अनुवाद", "श्लोक", "अर्थ"
        ))
        if match and (line_clean.startswith("#") or (is_known_heading and len(header_candidate) < 60)):
            if buffer:
                sections[current_key] = "\n".join(buffer).strip()
                buffer = []
            header = header_candidate
            if "understand" in header or "समझ" in header:
                current_key = "understanding"
            elif any(k in header for k in ("translation", "अनुवाद", "श्लोक का अर्थ", "श्लोक अनुवाद")):
                current_key = "verse_translation"
            elif any(k in header for k in ("points toward", "wisdom", "teaching", "mean", "मार्गदर्शन", "सीख")):
                current_key = "meaning"
            elif any(k in header for k in ("apply", "situation", "here", "अनुप्रयोग", "जीवन")):
                current_key = "application"
            elif any(k in header for k in ("reflect", "चिंतन", "विचार")):
                current_key = "reflection"
            elif any(k in header for k in ("action", "practice", "daily", "अभ्यास", "कदम")):
                current_key = "action"
            else:
                current_key = header
        else:
            buffer.append(line)

    if buffer:
        sections[current_key] = "\n".join(buffer).strip()

    # Friendly situation/emotion formatting
    primary_key = (situation.get("primary") or "").lower()
    if language == "hi":
        primary_situation = HINDI_SITUATIONS.get(primary_key, "आंतरिक स्पष्टता एवं शांति")
        default_reflection = "आज आप शांति और स्पष्टता के साथ अपने जीवन में कौन सा निर्णय ले सकते हैं?"
        default_action = "3 गहरी शांत सांसें लें, अपने वर्तमान कर्तव्य पर ध्यान केंद्रित करें, और चिंता को ईश्वर पर छोड़ दें।"
    else:
        primary_situation = ENGLISH_SITUATIONS.get(
            primary_key,
            (situation.get("primary") or "Seeking Clarity").replace("_", " ").title()
        )
        default_reflection = "In what ways can you act with clarity and compassion today?"
        default_action = "Take 3 mindful breaths, focus on your sincere duty today, and release the anxious attachment to future outcomes."
    emotion = f"{primary_situation}"

    # Extract primary verse details if available
    primary_verse = {}
    if evidence and len(evidence) > 0:
        for pv in evidence:
            if pv.get("translation") and pv.get("sanskrit"):
                primary_verse = {
                    "chapter": pv.get("chapter") or 2,
                    "verse": pv.get("verse") or 47,
                    "sanskrit": pv.get("sanskrit") or "",
                    "transliteration": pv.get("transliteration") or "",
                    "translation": pv.get("translation") or ""
                }
                break
        if not primary_verse:
            pv = evidence[0]
            primary_verse = {
                "chapter": pv.get("chapter") or 2,
                "verse": pv.get("verse") or 47,
                "sanskrit": pv.get("sanskrit") or "",
                "transliteration": pv.get("transliteration") or "",
                "translation": pv.get("translation") or ""
            }

    if not primary_verse or not primary_verse.get("translation"):
        primary_verse = {
            "chapter": 2,
            "verse": 47,
            "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            "transliteration": "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
            "translation": "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं।" if language == "hi" else "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction."
        }

    # If language is Hindi, ensure the verse translation is in Hindi
    if language == "hi":
        vt_from_llm = _clean_section_content(sections.get("verse_translation") or "")
        ch_num = int(primary_verse.get("chapter") or 2)
        v_num = int(primary_verse.get("verse") or 47)
        if vt_from_llm and any('\u0900' <= char <= '\u097f' for char in vt_from_llm):
            primary_verse["translation"] = vt_from_llm
        elif (ch_num, v_num) in HINDI_VERSE_TRANSLATIONS:
            primary_verse["translation"] = HINDI_VERSE_TRANSLATIONS[(ch_num, v_num)]
        elif not any('\u0900' <= char <= '\u097f' for char in primary_verse.get("translation", "")):
            # If current translation is English, replace with Hindi default for verse
            primary_verse["translation"] = HINDI_VERSE_TRANSLATIONS.get((ch_num, v_num), "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल की इच्छा मत रखो और न ही अकर्मण्यता में तुम्हारी आसक्ति हो।")

    # Clean sections
    understanding_raw = sections.get("understanding") or sections.get("intro") or ""
    if not understanding_raw and raw_text:
        understanding_raw = raw_text.split("\n\n")[0]
    understanding = _clean_section_content(understanding_raw)

    meaning_raw = sections.get("meaning") or ""
    meaning = _clean_section_content(meaning_raw)

    application_raw = sections.get("application") or ""
    application = _clean_section_content(application_raw)

    # Extract reflection quote
    reflection_text = _clean_section_content(sections.get("reflection", ""))
    reflection_prompt = reflection_text
    ref_match = re.search(r'["“]([^"”]+)["”]', reflection_text)
    if ref_match:
        reflection_prompt = ref_match.group(1).strip()

    # Dynamic action parsing
    action_text = _clean_section_content(sections.get("action", ""))
    if not action_text:
        if application:
            sentences = [s.strip() for s in re.split(r'[.!?\n।]+', application) if len(s.strip()) > 20]
            if sentences:
                action_text = sentences[-1] + ("।" if language == "hi" else ".")
    if not action_text:
        action_text = default_action

    return {
        "emotion": emotion,
        "situation": primary_situation,
        "understanding": understanding or raw_text[:300] + "...",
        "meaning": meaning,
        "application": application,
        "reflection": reflection_prompt or default_reflection,
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
        clean_path = self.path.split("?")[0]
        if clean_path in ("/", "/v1/health"):
            provider = os.environ.get("GITA_BRAIN_PROVIDER", "gemini").strip().lower()
            self._json(200, {
                "status": "ok",
                "service": "gita-brain",
                "version": "0.8.0",
                "provider": provider,
                "model": get_active_model(provider)
            })
            return
        elif clean_path in ("/privacy", "/privacy-policy", "/privacy_policy.html"):
            privacy_file = ROOT / "privacy_policy.html"
            if privacy_file.exists():
                content = privacy_file.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(content)
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
            
            language = str(data.get("language", "en")).strip().lower()
            if language not in ("en", "hi"):
                language = "en"

            result = generate_answer(mood, thought, top_k, language=language)
            # Add structured breakdown for mobile app UI
            result["structured"] = parse_structured_answer(
                result["answer"],
                result.get("situation", {}),
                result.get("evidence", []),
                language=language
            )
            self._json(200, result)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            return
        except Exception as e:
            safe_err = _sanitize_error(str(e))
            print(f"[ERROR] Request failed: {safe_err}")
            try:
                self._json(400, {"error": safe_err})
            except Exception:
                pass


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
