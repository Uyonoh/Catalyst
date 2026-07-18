from fastapi import APIRouter, Depends
from schemas import TextGenerateRequest, TextGenerateResponse
from auth import verify_jwt
from services.prompt_builder import build_prompt
from services.router import generate_refined_prompt

router = APIRouter()

@router.post("", response_model=TextGenerateResponse)
async def generate_text_endpoint(req: TextGenerateRequest, user_id: str = Depends(verify_jwt)):
    prompt_str = build_prompt(
        text=req.text,
        model=req.model,
        controls=req.controls,
        mode=req.mode
    )
    
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
        # Replaces raw backticks
        cleaned_text = cleaned_text.replace("```json", "").replace("```markdown", "").replace("```", "").replace("'''", "").strip()

    output_format = req.controls.outputFormat if req.controls and req.controls.outputFormat else "text"
    
    return TextGenerateResponse(
        refinedPrompt=cleaned_text,
        format=output_format
    )
