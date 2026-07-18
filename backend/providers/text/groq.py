import os
import httpx

class GroqTextProvider:
    def __init__(self):
        self.id = "groq"

    @property
    def keys(self) -> list[str]:
        keys = []
        for k, v in os.environ.items():
            if k.startswith("GROQ_API_KEY") and v:
                keys.append(v)
        return list(set(keys))

    async def call(self, prompt: str, key: str) -> str:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=30.0
            )

            if res.status_code != 200:
                if res.status_code == 429:
                    raise Exception("429 Rate Limit")
                raise Exception(f"Groq API error: {res.status_code} {res.text}")

            data = res.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "")
            return ""

    def is_rate_limit_error(self, err: Exception) -> bool:
        return "429" in str(err)
