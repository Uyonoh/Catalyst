from schemas import PromptControls
from services.prompt_profiles import get_profile_for_model

def build_control_directives(controls: PromptControls) -> str:
    creativity = controls.creativity if controls.creativity is not None else 0.5
    precision = controls.precision if controls.precision is not None else 0.5
    length = controls.length if controls.length is not None else "medium"

    creativity_str = "strict and literal" if creativity < 0.3 else "highly creative and expansive" if creativity > 0.7 else "balanced"
    precision_str = "highly specific and unambiguous" if precision > 0.7 else "moderately detailed"
    length_str = "concise" if length == "short" else "verbose" if length == "long" else "balanced"

    return f"""
Refinement Directives:
- Creativity Level: {creativity} ({creativity_str})
- Precision Level: {precision} ({precision_str})
- Output Length: {length} ({length_str})
"""

def build_system_prompt(model_id: str, controls: PromptControls, mode: str = "text") -> str:
    profile = get_profile_for_model(model_id)
    mode_instruction = profile.mode_instructions.get(mode, "")

    length_short = (controls.length == "short")
    structure_instruction = (
        "Structure the output in a way that is easy to understand" 
        if length_short 
        else f"Structure the output using the following sections:\n   " + "\n   ".join(profile.structure)
    )

    steps_instruction = (
        "Break down complex tasks into step-by-step instructions."
        if profile.prefers_steps
        else "Keep instructions naturally structured."
    )

    mode_specific_section = f"""Mode-Specific Instructions:
- This is a {mode.upper()} focused task.
- {mode_instruction}""" if mode_instruction else ""

    system_prompt = f"""
You are an expert prompt engineer.

Your task is to transform a "Raw Intent" into a highly effective prompt optimized for the target model.

Core Rules:
1. Preserve the original intent exactly.
2. {structure_instruction}
3. Use clear, professional, unambiguous language.
4. DO NOT include any explanations or conversational filler—output ONLY the final refined prompt.
5. {steps_instruction}

{mode_specific_section}

Model Optimization Notes:
- Ensure alignment with how {model_id.upper()} models interpret instructions.

{build_control_directives(controls)}
"""

    if controls.strategy == "chain_of_thought":
        system_prompt += """
Strategy Note:
- Use explicit step-by-step reasoning internally before producing the final structured prompt.
"""
    elif controls.strategy == "few_shot":
        system_prompt += """
Strategy Note:
- Provide multiple varied examples of well-refined output patterns (but don't output the examples themselves—just use them as guidance).
"""
    elif controls.strategy == "zero_shot":
        system_prompt += """
Strategy Note:
- Provide the refined prompt directly and concisely without any preamble or examples.
"""

    if controls.tone and controls.tone != "neutral":
        system_prompt += f"""
Tone:
- Write the optimized prompt in a {controls.tone} tone.
"""

    if controls.negativePrompt:
        system_prompt += f"""
Constraints:
- DO NOT include, mention, or reference the following: {controls.negativePrompt}
"""

    if controls.outputFormat and controls.outputFormat != "text":
        system_prompt += f"""
Output Format:
- Return the final prompt as valid {controls.outputFormat.upper()}.
"""
        if controls.outputFormat == "json":
            json_structure = ", ".join([s.lower().replace(" ", "_") for s in profile.structure])
            system_prompt += f"- Keys should correspond to the structure: {json_structure}.\n"

    if controls.failureHandling:
        system_prompt += """
Robustness:
- If the intent is ambiguous, resolve ambiguity by making reasonable assumptions and state them explicitly in the prompt.
"""

    return system_prompt

def build_prompt(text: str, model: str, controls: PromptControls, mode: str = "text") -> str:
    system_prompt = build_system_prompt(model, controls, mode)
    return f'{system_prompt}\n\nRaw Intent: "{text}"\n\nRefined Prompt:\n'
