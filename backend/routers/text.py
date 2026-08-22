from fastapi import APIRouter, Depends
from backend.schemas import TextGenerateRequest, TextGenerateResponse
from backend.auth import verify_jwt
from backend.services.prompt_builder import build_prompt
from backend.services.router import generate_refined_prompt
from backend.logging_config import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post("", response_model=TextGenerateResponse)
async def generate_text_endpoint(req: TextGenerateRequest, user_id: str = Depends(verify_jwt)):
    logger.info(f"Processing text generation request from user {user_id}")

    if req.buildPrompt:
        prompt_str = build_prompt(
            text=req.text,
            model=req.model,
            controls=req.controls,
            mode=req.mode
        )
    else:
        prompt_str = req.text

    logger.debug(f"Compiled prompt: {prompt_str[:100]}...")

    refined_text = await generate_refined_prompt(prompt_str)

    # Mirroring clean-up code block wraps logic in parse/route.ts
    cleaned_text = refined_text.strip()
    if cleaned_text.startswith("```") and cleaned_text.endswith("```"):
        # Strip outer block
        lines = cleaned_text.splitlines()
        if len(lines) >= 2:
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1] == "```":
                lines = lines[:-1]
            cleaned_text = "\n".join(lines).strip()
        else:
            # Single line code block - strip the backticks
            cleaned_text = cleaned_text[3:-3].strip()
    else:
        # Replaces raw backticks
        cleaned_text = cleaned_text.replace("```json", "").replace("```markdown", "").replace("```", "").replace("'''", "").strip()

    output_format = req.controls.outputFormat if req.controls and req.controls.outputFormat else "text"

    logger.info(f"Text generation completed for user {user_id}, output format: {output_format}")

    return TextGenerateResponse(
        refinedPrompt=cleaned_text,
        format=output_format
    )
