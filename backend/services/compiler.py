from typing import Dict, Any, Tuple
from backend.services.types import TargetModel, Domain, Intent

class CompilerService:
    def compile(self, metadata: Dict[str, Any], target: str) -> Dict[str, Any]:
        formatted_prompt = ""
        system_instruction = ""

        # Normalize target
        target_normalized = target.upper()

        if target_normalized == TargetModel.CLAUDE_3_5_SONNET or target_normalized == "CLAUDE":
            formatted_prompt, system_instruction = self.compile_for_claude(metadata)
            compiled_target = TargetModel.CLAUDE_3_5_SONNET
        elif target_normalized == TargetModel.GPT_4O or target_normalized == "GPT":
            formatted_prompt, system_instruction = self.compile_for_gpt(metadata)
            compiled_target = TargetModel.GPT_4O
        elif target_normalized == TargetModel.GEMINI_1_5_PRO or target_normalized == "GEMINI":
            formatted_prompt, system_instruction = self.compile_for_gemini(metadata)
            compiled_target = TargetModel.GEMINI_1_5_PRO
        else:
            # Fallbacks
            formatted_prompt = metadata.get("originalInput", "")
            compiled_target = target_normalized

        return {
            "model": compiled_target,
            "formattedPrompt": formatted_prompt,
            "systemInstruction": system_instruction,
            "metadata": metadata,
        }

    def compile_for_claude(self, meta: Dict[str, Any]) -> Tuple[str, str]:
        detected_domain = meta.get("detectedDomain", "GENERAL")
        primary_intent = meta.get("primaryIntent", "GENERAL_TASK")
        constraints = meta.get("constraints", {})
        tone = constraints.get("tone", "PROFESSIONAL")
        output_format = constraints.get("outputFormat", "PLAIN_TEXT")
        original_input = meta.get("originalInput", "")
        assets = meta.get("assets", [])

        system = f"You are an expert in {detected_domain.replace('_', ' ')}. Your task is {primary_intent}. " \
                 f"Respond in a {tone} tone and output as {output_format}."

        assets_section = ""
        if assets:
            assets_str = ", ".join([a.get("type", "UNKNOWN") for a in assets])
            assets_section = f"Analyze the following attached assets: {assets_str}"

        prompt = f"""
<context>
  Domain: {detected_domain}
  Intent: {primary_intent}
</context>

<instruction>
  Please address the following request: {original_input}
  {assets_section}
</instruction>

<constraints>
  Format: {output_format}
  Tone: {tone}
</constraints>

Please provide your response below:"""

        return prompt.strip(), system.strip()

    def compile_for_gpt(self, meta: Dict[str, Any]) -> Tuple[str, str]:
        detected_domain = meta.get("detectedDomain", "GENERAL")
        primary_intent = meta.get("primaryIntent", "GENERAL_TASK")
        constraints = meta.get("constraints", {})
        tone = constraints.get("tone", "PROFESSIONAL")
        output_format = constraints.get("outputFormat", "PLAIN_TEXT")
        original_input = meta.get("originalInput", "")
        assets = meta.get("assets", [])

        system = f"ACT AS A {detected_domain.upper()}.\nPRIMARY OBJECTIVE: {primary_intent}.\nOUTPUT REQUIREMENT: {output_format}."

        assets_note = "NOTE: Consider the visual/data evidence in the provided assets." if assets else ""

        prompt = f"""
# TASK OVERVIEW
Identify the core problem in: "{original_input}"

# EXECUTION STEPS
1. Analyze the context of {detected_domain}.
2. Apply the {primary_intent} logic.
3. Verify the result matches the {tone} tone.

# OUTPUT
Provide the result strictly in {output_format} format.
{assets_note}"""

        return prompt.strip(), system.strip()

    def compile_for_gemini(self, meta: Dict[str, Any]) -> Tuple[str, str]:
        detected_domain = meta.get("detectedDomain", "GENERAL")
        primary_intent = meta.get("primaryIntent", "GENERAL_TASK")
        constraints = meta.get("constraints", {})
        tone = constraints.get("tone", "PROFESSIONAL")
        output_format = constraints.get("outputFormat", "PLAIN_TEXT")
        original_input = meta.get("originalInput", "")
        assets = meta.get("assets", [])

        system = f"You are a helpful assistant specializing in {detected_domain}.\n" \
                 f"Follow these constraints: Tone={tone}, Format={output_format}."

        assets_str = " ".join([f"[Reference Asset: {a.get('type')} at {a.get('uri')}]" for a in assets])

        prompt = f"""
[TASK_START]
GOAL: {primary_intent}
INPUT_DATA: {original_input}
[ASSETS]: {assets_str}
[TASK_END]

Please process the input above and return the result in {output_format}."""

        return prompt.strip(), system.strip()
