from fastapi import APIRouter, Depends
from schemas import AnalyzeRequest, AnalyzeResponse
from auth import verify_jwt
from services.analyzer import AnalyzerService
from services.compiler import CompilerService

router = APIRouter()

analyzer_service = AnalyzerService()
compiler_service = CompilerService()

@router.post("", response_model=AnalyzeResponse)
async def analyze_endpoint(req: AnalyzeRequest, user_id: str = Depends(verify_jwt)):
    # Deconstruct and analyze prompt
    deconstructed = analyzer_service.analyze(req.text)
    
    # Compile prompt for target model
    optimized = compiler_service.compile(deconstructed, req.model)
    
    return AnalyzeResponse(
        model=optimized["model"],
        formattedPrompt=optimized["formattedPrompt"],
        systemInstruction=optimized["systemInstruction"],
        metadata=optimized["metadata"]
    )
