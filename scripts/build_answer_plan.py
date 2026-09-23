import argparse,json,os,subprocess,sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT=Path(__file__).resolve().parents[1]
POL=json.loads((ROOT/"knowledge/answer_policy.json").read_text(encoding="utf-8"))

def run(mood,text,top_k):
    sub_env = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
    p=subprocess.run([sys.executable,str(ROOT/"scripts/analyze_input.py"),
                      "--mood",mood,"--text",text],capture_output=True,text=True,
                     encoding="utf-8",errors="replace",env=sub_env)
    if p.returncode: raise SystemExit(p.stderr)
    a=json.loads(p.stdout)
    cmd=[sys.executable,str(ROOT/"scripts/retrieve_verses.py"),"--top-k",str(top_k)]
    if a.get("chapter"):
        cmd += ["--chapter", str(a["chapter"])]
    if a.get("specific_verse"):
        cmd += ["--verse-id", a["specific_verse"]]
    if a.get("situation", {}).get("primary"):
        cmd += ["--situation", a["situation"]["primary"]]
    for c in a.get("concepts", []):
        cmd += ["--concept", c]
    p=subprocess.run(cmd,capture_output=True,text=True,encoding="utf-8",errors="replace",env=sub_env)
    if p.returncode: raise SystemExit(p.stderr)
    r=json.loads(p.stdout)["results"]
    # Keep answer generation downstream from retrieval. No prose is generated here.
    selected=r[:3] if r else [{"verse_id": "BG_2_47", "score": 8.0}]
    roles=[]
    for i,x in enumerate(selected):
        roles.append({
          "verse_id":x["verse_id"],
          "role":"primary" if i==0 else "supporting",
          "score":x["score"],
          "reason":"Highest evidence-weighted relevance" if i==0 else "Supporting evidence"
        })
    return {
      "situation":a["situation"],
      "mood":a["mood"],
      "concepts":a["concepts"],
      "retrieval":roles,
      "answer_plan":{
        "core_teaching":"Explain the strongest retrieved passage without adding unsupported scripture claims.",
        "connection_to_user":"Connect the teaching to the user's stated situation and mood, explicitly as modern application.",
        "reflection":"Offer one practical reflection or next action.",
        "guardrails":POL["principles"]
      }
    }

ap=argparse.ArgumentParser()
ap.add_argument("--mood",default="neutral")
ap.add_argument("--text",required=True)
ap.add_argument("--top-k",type=int,default=8)
a=ap.parse_args()
print(json.dumps(run(a.mood,a.text,a.top_k),ensure_ascii=False,indent=2))
