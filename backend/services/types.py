from enum import Enum
from typing import List, Optional, Dict, Any

class InputModality(str, Enum):
    TEXT = "TEXT"
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    AUDIO = "AUDIO"
    CODE = "CODE"
    GEOSPATIAL = "GEOSPATIAL"

class TargetModel(str, Enum):
    GPT_4O = "GPT_4O"
    CLAUDE_3_5_SONNET = "CLAUDE_3_5_SONNET"
    GEMINI_1_5_PRO = "GEMINI_1_5_PRO"
    LLAMA_3 = "LLAMA_3"
    GROK_1 = "GROK_1"
    DALLE_3 = "DALLE_3"
    STABLE_DIFFUSION_XL = "STABLE_DIFFUSION_XL"
    MIDJOURNEY_V6 = "MIDJOURNEY_V6"
    VEO_VIDEO = "VEO_VIDEO"

class Domain(str, Enum):
    TECHNICAL_BACKEND = "TECHNICAL_BACKEND"
    TECHNICAL_FRONTEND = "TECHNICAL_FRONTEND"
    TECHNICAL_GIS = "TECHNICAL_GIS"
    TECHNICAL_DEVOPS = "TECHNICAL_DEVOPS"
    CREATIVE_MOTION = "CREATIVE_MOTION"
    CREATIVE_COPY = "CREATIVE_COPY"
    CREATIVE_VISUAL = "CREATIVE_VISUAL"
    BUSINESS_STRATEGY = "BUSINESS_STRATEGY"
    GENERAL = "GENERAL"

class Intent(str, Enum):
    DEBUG = "DEBUG"
    REFACTOR = "REFACTOR"
    ARCHITECT = "ARCHITECT"
    SPATIAL_ANALYSIS = "SPATIAL_ANALYSIS"
    DOCUMENT = "DOCUMENT"
    STORYBOARD = "STORYBOARD"
    COLOR_GRADE = "COLOR_GRADE"
    COMPOSITION = "COMPOSITION"
    SCRIPTWRITING = "SCRIPTWRITING"
    STYLE_TRANSFER = "STYLE_TRANSFER"
    SUMMARIZE = "SUMMARIZE"
    EXPAND = "EXPAND"
    BRAINSTORM = "BRAINSTORM"
    GENERAL_TASK = "GENERAL_TASK"

class Asset:  # To avoid pydantic dependency import cycle we can define it plain or simple dict, or Pydantic if needed. Let's make it a plain class or dict representation. Pydantic is good.
    pass

# We will use Pydantic in schemas.py, but for type-hints in services we can define standard python structures or import from schemas if needed. Let's just import from schemas.py when needed, or define types directly.
