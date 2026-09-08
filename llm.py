import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

MODEL_NAME = "gemini-3.6-flash"

# Explicitly disable automatic function calling and set a hard timeout.
# Some SDK versions silently hang if AFC engages with no tools registered.
GEN_CONFIG = types.GenerateContentConfig(
    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
    http_options=types.HttpOptions(timeout=30000),  # 30 second hard timeout, in ms
)


def call_llm(prompt: str) -> str:
    """Plain text response from the LLM."""
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=GEN_CONFIG,
    )
    return response.text.strip()


def call_llm_json(prompt: str) -> dict:
    """
    Call the LLM and force/parse a JSON response.
    Strips markdown code fences if the model adds them anyway.
    """
    full_prompt = (
        prompt
        + "\n\nIMPORTANT: Respond with ONLY valid JSON. "
          "No markdown, no code fences, no explanation text before or after."
    )
    raw = call_llm(full_prompt)
    cleaned = raw.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # last-resort: try to find the first { ... last }
        start, end = cleaned.find("{"), cleaned.rfind("}")
        if start != -1 and end != -1:
            return json.loads(cleaned[start:end + 1])
        raise
