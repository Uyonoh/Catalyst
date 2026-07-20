from fastapi import APIRouter, Depends
from schemas import AnalyzeRequest, AnalyzeResponse
from auth import verify_jwt
from services.analyzer import AnalyzerService
from services.compiler import CompilerService
from logging_config import get_logger

router = APIRouter()
logger = get_logger(__name__)

analyzer_service = AnalyzerService()
compiler_service = CompilerService()

@router.post("", response_model=AnalyzeResponse)
async def analyze_endpoint(req: AnalyzeRequest, user_id: str = Depends(verify_jwt)):
    logger.info(f"Processing analyze request from user {user_id}, model: {req.model}")
    
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
