import json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CASES=[
 ("sad","I've lost someone I loved and I don't know how to deal with the grief.","grief",["BG_2_11","BG_2_13","BG_2_20"]),
 ("anxious","I'm terrified my business will fail after two years of work.","fear_of_failure",["BG_2_47"]),
 ("confused","I don't know which career path I should choose.","career_confusion",["BG_18_47","BG_3_19"]),
 ("angry","Someone betrayed me and I want revenge.","revenge",["BG_2_62","BG_2_63"]),
 ("jealous","Everyone around me is succeeding and I feel jealous and behind.","jealousy",["BG_2_62"]),
]
failed=0
for mood,text,sid,expected in CASES:
 p=subprocess.run([sys.executable,str(ROOT/"scripts/build_answer_plan.py"),
                   "--mood",mood,"--text",text],capture_output=True,text=True)
 if p.returncode:
  print(sid+": ERROR"); print(p.stderr); failed+=1; continue
 d=json.loads(p.stdout)
 got=[x["verse_id"] for x in d["retrieval"]]
 ok=d["situation"]["primary"]==sid and any(x in got for x in expected)
 print(f"{sid}: {'PASS' if ok else 'WEAK'}; situation={d['situation']['primary']}; retrieved={got}; expected={expected}")
 if not ok: failed+=1
print("V0.7 INPUT→RETRIEVAL TEST "+("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
