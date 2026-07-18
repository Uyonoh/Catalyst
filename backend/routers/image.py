from fastapi import APIRouter, Depends
import random
from schemas import ImageGenerateRequest, ImageGenerateResponse
from auth import verify_jwt
from providers.image.base import ImageParams
from services.router import generate_image

router = APIRouter()

@router.post("", response_model=ImageGenerateResponse)
async def generate_image_endpoint(req: ImageGenerateRequest, user_id: str = Depends(verify_jwt)):
    # Aspect ratio math / dimensions calculator is kept in Next.js to simplify,
    # but here we parse the request and call the provider logic.
    # Next.js will pass computed structured prompt and properties.
    # To match parameters:
    wh_map = {
        "1:1": (1024, 1024),
        "16:9": (1024, 576),
        "9:16": (576, 1024),
        "4:3": (1024, 768),
        "3:4": (768, 1024)
    }
    
    width, height = wh_map.get(req.aspectRatio, (1024, 1024))
    
    # Setup parameters
    params = ImageParams(
        width=width,
        height=height,
        negative_prompt=req.negativePrompt
    )
    
    # We pass model, prompt, parameters
    # The frontend expects structure matches generate-image/route.ts
    result = await generate_image(
        selected_provider_id=req.model,
        prompt=req.prompt,
        parameters=params
    )
    
    seed = random.randint(0, 9999999)
    
    return ImageGenerateResponse(
        url=result.url,
        width=width,
        height=height,
        seed=seed,
        prompt=req.prompt
    )
