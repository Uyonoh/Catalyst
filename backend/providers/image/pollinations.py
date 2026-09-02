from urllib.parse import quote
from typing import Optional
from backend.providers.image.base import ImageParams, ImageResult

class PollinationsImageProvider:
    def __init__(self):
        self.id = "pollinations"

    @property
    def keys(self) -> list[str]:
        return ["Dummy Key"]

    async def call(self, prompt: str, key: str, params: Optional[ImageParams], model: Optional[str] = None) -> ImageResult:
        encoded_prompt = quote(prompt)
        image_url = f"https://image.pollinations.ai/p/{encoded_prompt}?enhance=true"

        # Pollinations generates the image and returns to the user once the url is hit
        return ImageResult(url=image_url)

    def is_rate_limit_error(self, err: Exception) -> bool:
        return "429" in str(err)
