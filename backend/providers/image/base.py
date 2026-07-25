from typing import Protocol, Optional
from pydantic import BaseModel

class ImageParams(BaseModel):
    width: int
    height: int
    num_steps: Optional[int] = 4
    negative_prompt: Optional[str] = ""

class ImageResult(BaseModel):
    url: str # data URI base64 or HTTP URL

class LLMImageProvider(Protocol):
    id: str
    
    @property
    def keys(self) -> list[str]:
        ...
        
    async def call(self, prompt: str, key: str, params: Optional[ImageParams]) -> ImageResult:
        ...
        
    def is_rate_limit_error(self, err: Exception) -> bool:
        ...
