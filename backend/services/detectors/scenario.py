import re
from typing import Optional, Dict

class ScenarioDetector:
    def __init__(self):
        self.persona_patterns = [
            re.compile(r"(?:act as|you are|persona:)\s*a?\s*([^,.\n?]+)", re.IGNORECASE),
            re.compile(r"(?:expert in|specialist in)\s+([^,.\n?]+)", re.IGNORECASE),
            re.compile(r"(?:senior|junior|lead|expert)\s+([\w\s]+developer|[\w\s]+engineer|[\w\s]+consultant)", re.IGNORECASE),
        ]

        self.style_patterns = {
            "Step-by-step": [
                re.compile(r"\bstep[- ]by[- ]step\b", re.IGNORECASE),
                re.compile(r"\bin stages\b", re.IGNORECASE),
                re.compile(r"\bone by one\b", re.IGNORECASE),
            ],
            "Chain-of-thought": [
                re.compile(r"\blet's think step by step\b", re.IGNORECASE),
                re.compile(r"\breason through\b", re.IGNORECASE),
                re.compile(r"\bthought process\b", re.IGNORECASE),
            ],
            "Comparative": [
                re.compile(r"\bcompare and contrast\b", re.IGNORECASE),
                re.compile(r"\bversus\b", re.IGNORECASE),
                re.compile(r"\bvs\b", re.IGNORECASE),
                re.compile(r"\bdifference between\b", re.IGNORECASE),
            ],
            "Briefing": [
                re.compile(r"\btldr\b", re.IGNORECASE),
                re.compile(r"\bgive me a brief\b", re.IGNORECASE),
                re.compile(r"\bsummary for executives\b", re.IGNORECASE),
            ],
        }

    def detect(self, input_str: str) -> Dict[str, Optional[str]]:
        result: Dict[str, Optional[str]] = {}

        # 1. Persona Detection
        for pattern in self.persona_patterns:
            match = pattern.search(input_str)
            if match and match.group(1):
                result["persona"] = match.group(1).strip()
                break

        # 2. Style Detection
        for style_name, patterns in self.style_patterns.items():
            if any(p.search(input_str) for p in patterns):
                result["style"] = style_name
                break

        return result
