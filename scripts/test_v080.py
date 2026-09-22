import subprocess,sys,json,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
cases=[
 ("anxious","I'm scared my business will fail after two years of hard work.","fear_of_failure","BG_2_47"),
 ("sad","I lost someone I loved and I don't know how to deal with the grief.","grief","BG_2_13"),
 ("angry","Someone betrayed me and I want revenge.","revenge","BG_2_62"),
 ("jealous","Everyone around me is succeeding and I feel jealous and behind.","jealousy","BG_2_62"),
 ("confused","I don't know which career path I should choose.","career_confusion","BG_18_47"),
]
failed=0
for mood,text,sid,want in cases:
 p=subprocess.run([sys.executable,str(ROOT/"scripts/build_evidence_pack.py"),
                   "--mood",mood,"--text",text,"--top-k","3"],
                  capture_output=True,text=True)
 if p.returncode:
  print(sid+": ERROR"); print(p.stderr); failed+=1; continue
 d=json.loads(p.stdout)
 ids=[x["verse_id"] for x in d["gita_evidence"]]
 ok=d["understanding"]["situation"]["primary"]==sid and want in ids
 print(f"{sid}: {'PASS' if ok else 'WEAK'}; evidence={ids}")
 if not ok: failed+=1

# Prompt smoke test.
p=subprocess.run([sys.executable,str(ROOT/"scripts/build_evidence_pack.py"),
                  "--mood","anxious","--text","I'm scared my business will fail.","--top-k","3"],
                 capture_output=True,text=True)
if not p.returncode:
 d=json.loads(p.stdout)
 with tempfile.TemporaryDirectory() as td:
  ev=Path(td)/"evidence.json"; ev.write_text(json.dumps(d,ensure_ascii=False),encoding="utf-8")
  q=subprocess.run([sys.executable,str(ROOT/"scripts/build_llm_prompt.py"),
                    "--evidence",str(ev)],capture_output=True,text=True)
  prompt=q.stdout
  normalized_prompt=" ".join(prompt.split())
  prompt_ok=("ONLY the supplied Gita evidence" in normalized_prompt and
             "Never fabricate quotations" in normalized_prompt and
             "GITA EVIDENCE — THE ONLY SCRIPTURAL SOURCE" in normalized_prompt)
  print("prompt_grounding:","PASS" if prompt_ok else "WEAK")
  if not prompt_ok: failed+=1

print("V0.8 GROUNDING PIPELINE "+("PASSED" if not failed else f"FAILED ({failed})"))
sys.exit(1 if failed else 0)
