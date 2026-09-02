import random
from typing import List, Union, Optional
from fastapi import HTTPException
from backend.providers.text.base import LLMTextProvider
from backend.providers.text.gemini import GeminiTextProvider
from backend.providers.text.groq import GroqTextProvider
from backend.providers.text.openrouter import OpenRouterTextProvider

from backend.providers.image.base import LLMImageProvider, ImageParams, ImageResult
from backend.providers.image.gemini import GeminiImageProvider
from backend.providers.image.huggingface import HuggingFaceImageProvider
from backend.providers.image.pollinations import PollinationsImageProvider

from backend.logging_config import get_logger

logger = get_logger(__name__)

# Provider configurations with allowed models and defaults
TEXT_PROVIDER_CONFIG = {
    "gemini": {
        "default_model": "gemini-3.1-flash-lite",
        "allowed_models": ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-3.1-flash-lite-image"],
    },
    "groq": {
        "default_model": "openai/gpt-oss-20b",
        "allowed_models": ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "meta-llama/llama-prompt-guard-2-86m"],
    },
    "openrouter": {
        "default_model": "google/gemma-4-31b-it:free",
        "allowed_models": [
            "google/gemma-4-31b-it:free", "google/gemma-2-9b-it:free",
            "google/gemini-2.0-flash-exp:free", "openchat/openchat-7b:free",
            "mistralai/mistral-7b-instruct:free", "meta-llama/llama-3.1-8b-instruct:free",
        ],
    },
}

IMAGE_PROVIDER_CONFIG = {
    "pollinations": {
        "default_model": "pollinations",
        "allowed_models": ["pollinations"],
    },
    "gemini": {
        "default_model": "gemini-3.1-flash-lite-image",
        "allowed_models": ["gemini-3.1-flash-lite-image", "imagen-3.0-generate-002"],
    },
    "huggingface": {
        "default_model": "black-forest-labs/FLUX.1-schnell",
        "allowed_models": [
            "black-forest-labs/FLUX.1-schnell",
            "stabilityai/stable-diffusion-xl-base-1.0",
            "runwayml/stable-diffusion-v1-5",
        ],
    },
}

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

def get_text_provider(provider_id: str) -> Optional[LLMTextProvider]:
    for provider in TEXT_PROVIDERS:
        if provider.id == provider_id:
            return provider
    return None

def get_image_provider(provider_id: str) -> Optional[LLMImageProvider]:
    for provider in IMAGE_PROVIDERS:
        if provider.id == provider_id:
            return provider
    return None

def validate_text_model(provider_id: str, model: Optional[str]) -> str:
    config = TEXT_PROVIDER_CONFIG.get(provider_id)
    if not config:
        return TEXT_PROVIDER_CONFIG["gemini"]["default_model"]

    if model and model in config["allowed_models"]:
        return model

    return config["default_model"]

def validate_image_model(provider_id: str, model: Optional[str]) -> str:
    config = IMAGE_PROVIDER_CONFIG.get(provider_id)
    if not config:
        return IMAGE_PROVIDER_CONFIG["pollinations"]["default_model"]

    if model and model in config["allowed_models"]:
        return model

    return config["default_model"]

async def generate_refined_prompt(
    prompt: str,
    provider_id: Optional[str] = None,
    model_id: Optional[str] = None,
    build_prompt_step: bool = True
) -> str:
    """
    Generate refined prompt using specified provider/model.

    For prompt generation (build_prompt_step=True): Always use gemini with gemini-3.5-flash
    For output generation (build_prompt_step=False): Use specified provider/model with defaults
    """
    # For prompt generation step, always use gemini-3.-flash-lite
    if build_prompt_step:
        provider_id = "gemini"
        model_id = "gemini-3.1-flash-lite"
    else:
        # For output generation, use provided or default
        if not provider_id:
            provider_id = "gemini"
        model_id = validate_text_model(provider_id, model_id)

    provider = get_text_provider(provider_id)
    if not provider:
        logger.error(f"Text provider '{provider_id}' not found, defaulting to gemini")
        provider = get_text_provider("gemini")
        provider_id = "gemini"
        model_id = "gemini-3.1-flash-lite"

    keys = provider.keys
    if not keys:
        logger.error(f"No API keys available for provider [{provider_id}]")
        raise HTTPException(status_code=503, detail=f"No API keys available for provider {provider_id}")

    shuffled_keys = shuffle_list(keys)
    for key in shuffled_keys:
        try:
            logger.debug(f"Trying text provider [{provider_id}] with model [{model_id}] and key ending in ...{key[-4:] if len(key) >= 4 else key}")
            result = await provider.call(prompt, key, model_id)
            return result
        except Exception as err:
            if provider.is_rate_limit_error(err):
                logger.info(f"Provider [{provider_id}] key hit rate limit, trying next key...")
                continue
            else:
                logger.warning(f"Provider [{provider_id}] failed with non-rate-limit error: {err}")
                continue

    logger.error(f"All keys exhausted for provider [{provider_id}]. Our servers are currently experiencing high demand. Please try again later.")
    raise HTTPException(status_code=503, detail="All LLM provider keys exhausted. Our servers are currently experiencing high demand. Please try again later.")

async def generate_image(
    provider_id: Optional[str],
    model_id: Optional[str],
    prompt: str,
    parameters: Optional[ImageParams]
) -> ImageResult:
    # Default to pollinations if no provider specified
    if not provider_id:
        provider_id = "pollinations"

    # Validate and get model (pollinations ignores model)
    model_id = validate_image_model(provider_id, model_id)

    provider = get_image_provider(provider_id)
    if not provider:
        logger.error(f"Image provider '{provider_id}' not found, defaulting to pollinations")
        provider = get_image_provider("pollinations")
        provider_id = "pollinations"
        model_id = "pollinations"

    keys = provider.keys
    if not keys:
        logger.error(f"No API keys available for provider [{provider_id}]")
        raise HTTPException(status_code=503, detail=f"No API keys available for provider {provider_id}")

    shuffled_keys = shuffle_list(keys)
    for key in shuffled_keys:
        try:
            logger.debug(f"Trying image provider [{provider_id}] with model [{model_id}] and key ending in ...{key[-4:] if len(key) >= 4 else key}")
            result = await provider.call(prompt, key, parameters, model_id)
            return result
        except Exception as err:
            if provider.is_rate_limit_error(err):
                logger.info(f"Provider [{provider_id}] key hit rate limit, trying next key...")
                continue
            else:
                logger.warning(f"Provider [{provider_id}] failed with error: {err}")
                continue

    logger.error(f"All keys exhausted for image provider [{provider_id}]. Our servers are currently experiencing high demand. Please try again later.")
    raise HTTPException(status_code=503, detail="All LLM image provider keys exhausted. Our servers are currently experiencing high demand. Please try again later.")
