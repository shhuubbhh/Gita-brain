import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
chapters=json.loads((ROOT/'data/chapters.json').read_text(encoding='utf-8'))
verses=json.loads((ROOT/'data/processed/verses.json').read_text(encoding='utf-8'))
expected={(c['chapter'],v) for c in chapters for v in range(1,c['expected_verses']+1)}
actual={(v['chapter'],v['verse']) for v in verses}
missing=sorted(expected-actual); extra=sorted(actual-expected)
print(f'Expected standard verse slots: {len(expected)}')
print(f'Loaded verse records: {len(actual)}')
print(f'Missing: {len(missing)}')
print(f'Unexpected: {len(extra)}')
if missing: print('First missing:',missing[:20])
if extra: print('Unexpected:',extra[:20])
raise SystemExit(1 if missing or extra else 0)
