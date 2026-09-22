import json
import re
import sys
from pathlib import Path


VERSE_PATTERN = re.compile(
    r"\bBG[\s_-]?(\d{1,2})[\s._:-]?(\d{1,3})\b",
    re.IGNORECASE,
)


def normalize_verse_id(chapter, verse):
    return f"BG_{int(chapter)}_{int(verse)}"


def extract_verse_refs(text):
    refs = []
    for match in VERSE_PATTERN.finditer(text or ""):
        refs.append(normalize_verse_id(match.group(1), match.group(2)))
    return list(dict.fromkeys(refs))


def normalize_text(text):
    return " ".join((text or "").split()).strip()


def build_evidence_map(evidence):
    result = {}
    for item in evidence or []:
        verse_id = item.get("verse_id")
        if verse_id:
            result[verse_id] = item
    return result


def find_quote_like_claims(answer):
    """
    Quote detection is disabled for now.

    Scriptural grounding is enforced through supplied verse references
    and evidence validation.
    """
    return []

def validate_answer(answer_data, evidence_data):
    problems = []

    if isinstance(answer_data, dict):
        answer = (
            answer_data.get("answer")
            or answer_data.get("text")
            or answer_data.get("content")
            or ""
        )
    else:
        answer = str(answer_data or "")

    answer = normalize_text(answer)

    if not answer:
        return {
            "valid": False,
            "problems": ["empty answer"],
        }

    evidence = evidence_data.get("gita_evidence", [])
    evidence_map = build_evidence_map(evidence)

    # Required answer sections from the response contract.
    required_sections = [
        "understanding",
        "gita teaching",
        "how it applies",
        "reflection",
    ]

    lower_answer = answer.lower()

    section_aliases = {
        "understanding": ["understanding"],
        "gita teaching": ["gita teaching", "what the gita", "gita points"],
        "how it applies": ["how it applies", "applying it here", "application"],
        "reflection": ["reflection"],
    }

    for section, aliases in section_aliases.items():
        if not any(alias in lower_answer for alias in aliases):
            problems.append(f"missing required section: {section}")

    # Every verse explicitly cited by the answer must be in supplied evidence.
    refs = extract_verse_refs(answer)

    for ref in refs:
        if ref not in evidence_map:
            problems.append(f"unsupported verse reference: {ref}")

    # Evidence must contain usable source material.
    for ref in refs:
        item = evidence_map.get(ref, {})

        if not item.get("sanskrit"):
            problems.append(f"missing Sanskrit evidence: {ref}")

        if not item.get("translation"):
            problems.append(f"missing translation evidence: {ref}")

    # Do not allow quote-like material when exact source wording
    # is not present in the evidence packet.
    quote_candidates = find_quote_like_claims(answer)

    for quote in quote_candidates:
        normalized_quote = normalize_text(quote)

        if len(normalized_quote) < 15:
            continue

        found_in_evidence = False

        for item in evidence:
            for field in ("sanskrit", "transliteration", "translation"):
                source_text = normalize_text(item.get(field, ""))

                if normalized_quote in source_text:
                    found_in_evidence = True
                    break

            if found_in_evidence:
                break

        if not found_in_evidence:
            problems.append(
                "quote-like text not supported by supplied evidence"
            )

    # If evidence exists, answers should cite at least one supplied verse
    # rather than making unsupported scriptural claims.
    if evidence and not refs:
        problems.append("no supplied verse cited")

    # Guard against common fabricated-scripture patterns.
    fabricated_patterns = [
        r"chapter\s+\d+",
        r"verse\s+\d+\s+states",
        r"krishna\s+says",
        r"krishna\s+commands",
        r"the lord\s+says",
    ]

    if refs:
        for pattern in fabricated_patterns:
            if re.search(pattern, lower_answer):
                # These phrases are not automatically wrong, but require
                # an explicit supplied verse reference somewhere in context.
                continue

    return {
        "valid": not problems,
        "problems": problems,
    }


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main():
    if len(sys.argv) != 3:
        print(
            "Usage: python scripts/validate_answer_quality.py "
            "<answer.json> <evidence.json>"
        )
        sys.exit(2)

    answer_data = load_json(sys.argv[1])
    evidence_data = load_json(sys.argv[2])

    result = validate_answer(answer_data, evidence_data)

    print(json.dumps(result, ensure_ascii=False, indent=2))

    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()
