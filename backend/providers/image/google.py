import os
import base64
from google import genai
from google.genai import types
from typing import Optional
import asyncio
from backend.providers.image.base import ImageParams, ImageResult

class GoogleImageProvider:
    def __init__(self):
        self.id = "google"

    @property
    def keys(self) -> list[str]:
        keys = []
        for k, v in os.environ.items():
            if (k.startswith("GEMINI_API_KEY") or k.startswith("GOOGLE_GENAI_API_KEY")) and v:
                keys.append(v)
        return list(set(keys))

    async def call(self, prompt: str, key: str, params: Optional[ImageParams], model: Optional[str] = None) -> ImageResult:
        client = genai.Client(api_key=key)
        model_name = model if model else "gemini-3.1-flash-lite-image"
        
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"]
                )
            )
        )
        
        candidates = response.candidates
        if candidates and candidates[0].content.parts:
            for part in candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data:
                    mime_type = part.inline_data.mime_type
                    data_bytes = part.inline_data.data
                    b64_data = base64.b64encode(data_bytes).decode("utf-8")
                    return ImageResult(url=f"data:{mime_type};base64,{b64_data}")
        
        raise Exception("Model did not return valid inline image data")

    def is_rate_limit_error(self, err: Exception) -> bool:
        err_msg = str(err).lower()
        return "429" in err_msg or "quota" in err_msg or "high demand" in err_msg

