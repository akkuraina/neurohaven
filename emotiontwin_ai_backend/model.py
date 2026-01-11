import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_mood(user_text: str):
    prompt = f"""
    You are EmotionTwin AI, a mental wellness assistant.
    Analyze the user's mood and suggest one short activity.

    Input: "{user_text}"

    Respond in JSON with:
    {{
      "mood": "<one-word mood>",
      "confidence": "<0-100 score>",
      "suggestion": "<short helpful activity>"
    }}
    """

    response = model.generate_content(prompt)
    return response.text
