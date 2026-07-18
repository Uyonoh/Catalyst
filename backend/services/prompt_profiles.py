from typing import List, Dict, Union

class ModelProfile:
    def __init__(self, structure: List[str], style: str, prefers_steps: bool, verbosity_control: bool, mode_instructions: Dict[str, str]):
        self.structure = structure
        self.style = style
        self.prefers_steps = prefers_steps
        self.verbosity_control = verbosity_control
        self.mode_instructions = mode_instructions

MODEL_PROFILES: Dict[str, ModelProfile] = {
    "gemini": ModelProfile(
        structure=["Role", "Task", "Context", "Constraints", "Output Format"],
        style="concise",
        prefers_steps=True,
        verbosity_control=True,
        mode_instructions={
            "text": "Optimise for a natural language conversation task.",
            "vision": "The user will provide an image. Focus the prompt on visual analysis, scene description, or extracting information from the image.",
            "image": "Craft a detailed image generation prompt, including subject, style, composition, lighting, and technical details.",
            "video": "Describe motion, camera movement, scene transitions, timing, and aesthetic style for video generation.",
            "audio": "Design the prompt for an audio/speech task. Specify tone, pacing, and voice characteristics.",
            "code": "Structure the prompt as a programming task with clearly defined requirements and expected output format.",
        }
    ),
    "gpt": ModelProfile(
        structure=["System Role", "Objective", "Instructions", "Constraints", "Output Format"],
        style="balanced",
        prefers_steps=True,
        verbosity_control=True,
        mode_instructions={
            "text": "Optimise the prompt for a natural language conversation task.",
            "vision": "The prompt will be used with an image attached. Include references to visual details, composition, and scene description.",
            "image": "Craft a detailed DALL-E 3 prompt. Describe subject, style, composition, lighting, and negative constraints.",
            "code": "Structure the prompt as a programming task with clearly defined requirements, language, and expected output format.",
            "audio": "Design the prompt for an audio/speech task. Specify tone, pacing, and voice characteristics.",
        }
    ),
    "claude": ModelProfile(
        structure=["Role", "Goal", "Detailed Instructions", "Edge Cases", "Output Format"],
        style="verbose",
        prefers_steps=True,
        verbosity_control=False,
        mode_instructions={
            "text": "Optimise for a nuanced and detailed natural language response.",
            "vision": "An image is provided. Refer to visual elements, text within the image, or spatial relationships in your instructions.",
            "code": "Emphasize correct syntax, edge case handling, and best practices in the prompt.",
        }
    ),
    "llama": ModelProfile(
        structure=["System Prompt", "User Task", "Constraints", "Desired Output"],
        style="balanced",
        prefers_steps=True,
        verbosity_control=True,
        mode_instructions={
            "text": "Ensure instructions are direct and clear for a text-based task.",
            "code": "Provide clear logic steps and language requirements for the coding task.",
        }
    ),
    "grok": ModelProfile(
        structure=["Identity", "Objective", "Detailed Steps", "Style Guidelines"],
        style="balanced",
        prefers_steps=True,
        verbosity_control=True,
        mode_instructions={
            "text": "Maintain an objective but witty tone in the instructions.",
            "vision": "Reference real-time visual information provided in the input.",
            "code": "Focus on modern, efficient code implementations.",
        }
    ),
    "dalle": ModelProfile(
        structure=["Subject", "Style", "Composition", "Lighting", "Technical Info"],
        style="concise",
        prefers_steps=False,
        verbosity_control=False,
        mode_instructions={
            "image": "Write a detailed DALL-E prompt: subject, artistic style, medium, lighting, mood, and composition."
        }
    ),
    "stablediffusion": ModelProfile(
        structure=["Prompt", "Negative Prompt", "Style Tags", "Technical Parameters"],
        style="concise",
        prefers_steps=False,
        verbosity_control=False,
        mode_instructions={
            "image": "Generate a tag-heavy prompt suitable for SDXL, including lighting, high-quality tags, and stylistic preferences."
        }
    ),
    "midjourney": ModelProfile(
        structure=["Core Concept", "Artistic Style", "Parameters (--v, --ar)"],
        style="concise",
        prefers_steps=False,
        verbosity_control=False,
        mode_instructions={
            "image": "Focus on concept, aesthetic, and specific Midjourney parameters like aspect ratio and version tags."
        }
    ),
    "veo": ModelProfile(
        structure=["Motion Description", "Camera Work", "Aesthetic Style", "Timing"],
        style="balanced",
        prefers_steps=False,
        verbosity_control=False,
        mode_instructions={
            "video": "Describe the video scene with motion cues, camera angles, transitions, colour grading, and timing beats."
        }
    )
}

def get_profile_for_model(model_id: str) -> ModelProfile:
    model_id_lower = model_id.lower()
    if "gemini" in model_id_lower:
        return MODEL_PROFILES["gemini"]
    if "claude" in model_id_lower:
        return MODEL_PROFILES["claude"]
    if "llama" in model_id_lower:
        return MODEL_PROFILES["llama"]
    if "grok" in model_id_lower:
        return MODEL_PROFILES["grok"]
    if "dalle" in model_id_lower:
        return MODEL_PROFILES["dalle"]
    if "stablediffusion" in model_id_lower or "sdxl" in model_id_lower:
        return MODEL_PROFILES["stablediffusion"]
    if "midjourney" in model_id_lower:
        return MODEL_PROFILES["midjourney"]
    if "veo" in model_id_lower:
        return MODEL_PROFILES["veo"]
    return MODEL_PROFILES["gpt"] # default
