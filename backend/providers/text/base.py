from typing import Optional, Protocol

class LLMTextProvider(Protocol):
    id: str

    @property
    def keys(self) -> list[str]:
        ...

    async def call(self, prompt: str, key: str, model: Optional[str] = None) -> str:
        ...

    def is_rate_limit_error(self, err: Exception) -> bool:
        ...
