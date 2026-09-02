import os
from typing import Optional
import httpx

class OpenRouterTextProvider:
    def __init__(self):
        self.id = "openrouter"

    @property
    def keys(self) -> list[str]:
        keys = []
        for k, v in os.environ.items():
            if k.startswith("OPENROUTER_API_KEY") and v:
                keys.append(v)
        return list(set(keys))

    async def call(self, prompt: str, key: str, model: Optional[str] = None) -> str:
        app_url = os.environ.get("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
        model_name = model if model else "google/gemma-4-31b-it:free"
        
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": app_url,
                    "X-Title": "Catalyst",
                },
                json={
                    "model": model_name,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                },
                timeout=45.0
            )

            if res.status_code != 200:
                if res.status_code in [429, 402]:
                    raise Exception("429 Rate Limit")
                raise Exception(f"OpenRouter API error: {res.status_code} {res.text}")

            data = res.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "")
            return ""

    def is_rate_limit_error(self, err: Exception) -> bool:
        return "429" in str(err)
