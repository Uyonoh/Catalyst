import os
import base64
from io import BytesIO
from typing import Optional
import asyncio
from huggingface_hub import InferenceClient
from backend.providers.image.base import ImageParams, ImageResult

class HuggingFaceImageProvider:
    def __init__(self):
        self.id = "huggingface"

    @property
    def keys(self) -> list[str]:
        keys = []
        for k, v in os.environ.items():
            if (k.startswith("HF_TOKEN") or k.startswith("HF_API_KEY")) and v:
                keys.append(v)
        return list(set(keys))

    async def call(self, prompt: str, key: str, params: Optional[ImageParams], model: Optional[str] = None) -> ImageResult:
        client = InferenceClient(
            token=key
        )
        width = params.width if params and params.width else 1024
        height = params.height if params and params.height else 1024
        n_steps = params.num_steps if params and params.num_steps else 1
        model_name = model if model else "black-forest-labs/FLUX.1-schnell"

        loop = asyncio.get_running_loop()
        # text_to_image returns a PIL Image object
        image = await loop.run_in_executor(
            None,
            lambda: client.text_to_image(
                prompt,
                model=model_name,
                width=width,
                height=height,
                num_inference_steps=n_steps,
            )
        )

        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return ImageResult(url=f"data:image/jpeg;base64,{img_str}")

    def is_rate_limit_error(self, err: Exception) -> bool:
        return "429" in str(err)
