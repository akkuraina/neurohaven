from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from emotiontwin_ai_backend.model import analyze_mood
import json
import re
import sys, os

sys.path.append(os.path.dirname(__file__))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    user_input = data.get("text", "")
    result = analyze_mood(user_input)

    try:
        json_str = re.search(r"\{.*\}", result, re.DOTALL).group()
        parsed = json.loads(json_str)
    except Exception:
        parsed = {"mood": "Neutral", "confidence": 50, "suggestion": "Take a short walk."}

    return parsed
