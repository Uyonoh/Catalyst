from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class PromptControls(BaseModel):
    creativity: Optional[float] = 0.5
    precision: Optional[float] = 0.5
    length: Optional[str] = "medium" # short, medium, long
    outputFormat: Optional[str] = "text" # text, json, yaml, markdown
    strategy: Optional[str] = "zero_shot" # zero_shot, few_shot, chain_of_thought
    failureHandling: Optional[bool] = False
    tone: Optional[str] = "neutral"
    negativePrompt: Optional[str] = None

class TextGenerateRequest(BaseModel):
    text: str
    model: str
    controls: Optional[PromptControls] = Field(default_factory=PromptControls)
    mode: Optional[str] = "text"

class TextGenerateResponse(BaseModel):
    refinedPrompt: str
    format: str

class ImageGenerateRequest(BaseModel):
    model: str
    prompt: str
    negativePrompt: Optional[str] = ""
    aspectRatio: Optional[str] = "1:1"

class ImageGenerateResponse(BaseModel):
    url: str
    width: int
    height: int
    seed: int
    prompt: str

class AnalyzeRequest(BaseModel):
    text: str
    model: Optional[str] = "claude"

class AnalyzeResponse(BaseModel):
    model: str
    formattedPrompt: Any # String or Dict/Object
    systemInstruction: Optional[str] = None
    metadata: Dict[str, Any]
