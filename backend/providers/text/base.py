from typing import Protocol

class LLMTextProvider(Protocol):
    id: str
    
    @property
    def keys(self) -> list[str]:
        ...
        
    async def call(self, prompt: str, key: str) -> str:
        ...
        
    def is_rate_limit_error(self, err: Exception) -> bool:
        ...
