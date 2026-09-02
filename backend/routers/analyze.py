from fastapi import APIRouter, Depends, HTTPException
from backend.schemas import AnalyzeRequest, AnalyzeResponse
from backend.auth import verify_jwt
from backend.services.analyzer import AnalyzerService
from backend.services.compiler import CompilerService
from backend.logging_config import get_logger

router = APIRouter()
logger = get_logger(__name__)

analyzer_service = AnalyzerService()
compiler_service = CompilerService()

@router.post("", response_model=AnalyzeResponse)
async def analyze_endpoint(req: AnalyzeRequest, user_id: str = Depends(verify_jwt)):
    logger.info(f"Processing analyze request from user {user_id}, model: {req.model}")

    try:
        # Deconstruct and analyze prompt
        deconstructed = analyzer_service.analyze(req.text)
        logger.debug(f"Analysis result: domain={deconstructed.get('detectedDomain')}, intent={deconstructed.get('primaryIntent')}")

        # Compile prompt for target model
        optimized = compiler_service.compile(deconstructed, req.model)

        logger.info(f"Analyze completed for user {user_id}")

        return AnalyzeResponse(
            model=optimized["model"],
            formattedPrompt=optimized["formattedPrompt"],
            systemInstruction=optimized["systemInstruction"],
            metadata=optimized["metadata"]
        )
    except HTTPException:
        # Re-raise HTTPExceptions as-is (they already have sanitized messages)
        raise
    except Exception as exc:
        logger.error(
            f"Unexpected error in analyze endpoint for user {user_id}: {exc}",
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )

