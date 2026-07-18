import random
from typing import List, Union, Optional
from fastapi import HTTPException
from providers.text.base import LLMTextProvider
from providers.text.gemini import GeminiTextProvider
from providers.text.groq import GroqTextProvider
from providers.text.openrouter import OpenRouterTextProvider

from providers.image.base import LLMImageProvider, ImageParams, ImageResult
from providers.image.gemini import GeminiImageProvider
from providers.image.huggingface import HuggingFaceImageProvider
from providers.image.pollinations import PollinationsImageProvider

# Shuffles in-place using random
def shuffle_list(lst: list) -> list:
    shuffled = list(lst)
    random.shuffle(shuffled)
    return shuffled

# Text Providers list
TEXT_PROVIDERS: List[LLMTextProvider] = [
    GeminiTextProvider(),
    GroqTextProvider(),
    OpenRouterTextProvider()
]

# Image Providers list
IMAGE_PROVIDERS: List[LLMImageProvider] = [
    HuggingFaceImageProvider(),
    GeminiImageProvider(),
    PollinationsImageProvider()
]

async def generate_refined_prompt(prompt: str) -> str:
    for provider in TEXT_PROVIDERS:
        keys = provider.keys
        if not keys:
            continue
        
        shuffled_keys = shuffle_list(keys)
        for key in shuffled_keys:
            try:
                print(f"Trying text provider [{provider.id}] with key ending in ...{key[-4:] if len(key) >= 4 else key}")
                result = await provider.call(prompt, key)
                return result
            except Exception as err:
                if provider.is_rate_limit_error(err):
                    print(f"Provider [{provider.id}] key hit rate limit, falling back...")
                    continue
                else:
                    print(f"Provider [{provider.id}] failed with non-rate-limit error: {err}")
                    continue
                    
    print("All LLM text providers exhausted. Our servers are currently experiencing high demand. Please try again later.")
    raise HTTPException(status_code=503, detail="All LLM providers exhausted. Our servers are currently experiencing high demand. Please try again later.")

async def generate_image(selected_provider_id: str, prompt: str, parameters: Optional[ImageParams]) -> ImageResult:
    for provider in IMAGE_PROVIDERS:
        if provider.id != selected_provider_id:
            continue
            
        keys = provider.keys
        if not keys:
            continue
            
        shuffled_keys = shuffle_list(keys)
        for key in shuffled_keys:
            try:
                print(f"Trying image provider [{provider.id}] with key ending in ...{key[-4:] if len(key) >= 4 else key}")
                result = await provider.call(prompt, key, parameters)
                return result
            except Exception as err:
                if provider.is_rate_limit_error(err):
                    print(f"Provider [{provider.id}] key hit rate limit, falling back...")
                    continue
                else:
                    print(f"Provider [{provider.id}] failed with error: {err}")
                    continue

    print("All LLM image providers exhausted. Our servers are currently experiencing high demand. Please try again later.")
    raise HTTPException(status_code=503, detail="All LLM image providers exhausted. Our servers are currently experiencing high demand. Please try again later.")
