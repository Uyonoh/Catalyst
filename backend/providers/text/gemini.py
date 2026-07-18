import os
from google import genai
from google.genai import types
import asyncio

class GeminiTextProvider:
    def __init__(self):
        self.id = "gemini"

    @property
    def keys(self) -> list[str]:
        keys = []
        for k, v in os.environ.items():
            if (k.startswith("GEMINI_API_KEY") or k.startswith("GOOGLE_GENAI_API_KEY")) and v:
                keys.append(v)
        return list(set(keys))

    async def call(self, prompt: str, key: str) -> str:
        client = genai.Client(api_key=key)
        
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
        )
        return response.text or ""

    def is_rate_limit_error(self, err: Exception) -> bool:
        err_msg = str(err).lower()
        if "429" in err_msg or "quota" in err_msg or "high demand" in err_msg:
            return True
        return False

