import re

VERSE_RE = re.compile(r"\b(?:BG|Bhagavad\s*Gita)\s*\d+(?:[.:]\d+)?\b", re.I)

def validate_answer(answer, allowed_sources):
    problems = []
    allowed = {x.upper().replace(":", "_") for x in allowed_sources}

    # Any explicit BG reference must map to a retrieved source.
    for raw in VERSE_RE.findall(answer or ""):
        norm = raw.upper().replace("BHAGAVAD GITA", "BG").replace(" ", "")
        # Convert BG2.47 / BG 2:47 / BG 2.47 into BG_2_47.
        m = re.search(r"BG[_ ]?(\d+)[.:](\d+)", norm)
        if m:
            ref = f"BG_{m.group(1)}_{m.group(2)}"
            if ref not in allowed:
                problems.append(f"unsupported verse reference: {raw}")

    if not (answer or "").strip():
        problems.append("empty answer")

    return {"valid": not problems, "problems": problems}
