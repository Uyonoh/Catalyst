import { getProfileForModel } from "./profiles";
import { ModelMode } from "../models-shared";

export interface PromptControls {
  creativity?: number; // 0 to 1
  precision?: number; // 0 to 1
  length?: "short" | "medium" | "long";
  outputFormat?: "text" | "json" | "yaml" | "markdown";
  strategy?: "zero_shot" | "few_shot" | "chain_of_thought";
  failureHandling?: boolean;
  tone?: "neutral" | "professional" | "casual" | "academic" | "creative" | "authoritative" | "friendly";
  negativePrompt?: string;
}

export function buildControlDirectives({
  creativity = 0.5,
  precision = 0.5,
  length = "medium",
}: PromptControls) {
  return `
Refinement Directives:
- Creativity Level: ${creativity} (${
    creativity < 0.3
      ? "strict and literal"
      : creativity > 0.7
      ? "highly creative and expansive"
      : "balanced"
  })
- Precision Level: ${precision} (${
    precision > 0.7 ? "highly specific and unambiguous" : "moderately detailed"
  })
- Output Length: ${length} (${
    length === "short"
      ? "concise"
      : length === "long"
      ? "verbose"
      : "balanced"
  })
`;
}

export function buildSystemPrompt(
  modelId: string,
  controls: PromptControls = {},
  mode: ModelMode = "text",
) {
  const profile = getProfileForModel(modelId);
  const modeInstruction = profile.modeInstructions[mode];

  let systemPrompt = `
You are an expert prompt engineer.

Your task is to transform a "Raw Intent" into a highly effective prompt optimized for the target model.

Core Rules:
1. Preserve the original intent exactly.
${
  controls.length != "short"
    ? `2. Structure the output using the following sections:
   ${profile.structure.join("\n   ")}`
    : "Structure the output in a way that is easy to understand"
}
3. Use clear, professional, unambiguous language.
4. DO NOT include any explanations or conversational filler—output ONLY the final refined prompt.
5. ${
    profile.prefers_steps
      ? "Break down complex tasks into step-by-step instructions."
      : "Keep instructions naturally structured."
  }

${
  modeInstruction
    ? `Mode-Specific Instructions:
- This is a ${mode.toUpperCase()} focused task.
- ${modeInstruction}`
    : ""
}

Model Optimization Notes:
- Ensure alignment with how ${modelId.toUpperCase()} models interpret instructions.

${buildControlDirectives(controls)}
`;

  if (controls.strategy === "chain_of_thought") {
    systemPrompt += `
Strategy Note:
- Use explicit step-by-step reasoning internally before producing the final structured prompt.
`;
  } else if (controls.strategy === "few_shot") {
    systemPrompt += `
Strategy Note:
- Provide multiple varied examples of well-refined output patterns (but don't output the examples themselves—just use them as guidance).
`;
  } else if (controls.strategy === "zero_shot") {
    systemPrompt += `
Strategy Note:
- Provide the refined prompt directly and concisely without any preamble or examples.
`;
  }

  if (controls.tone && controls.tone !== "neutral") {
    systemPrompt += `
Tone:
- Write the optimized prompt in a ${controls.tone} tone.
`;
  }

  if (controls.negativePrompt) {
    systemPrompt += `
Constraints:
- DO NOT include, mention, or reference the following: ${controls.negativePrompt}
`;
  }

  if (controls.outputFormat && controls.outputFormat !== "text") {
    systemPrompt += `
Output Format:
- Return the final prompt as valid ${controls.outputFormat.toUpperCase()}.
`;
    if (controls.outputFormat === "json") {
      systemPrompt += `- Keys should correspond to the structure: ${profile.structure
        .map((s) => s.toLowerCase().replace(/ /g, "_"))
        .join(", ")}.
`;
    }
  }

  if (controls.failureHandling) {
    systemPrompt += `
Robustness:
- If the intent is ambiguous, resolve ambiguity by making reasonable assumptions and state them explicitly in the prompt.
`;
  }

  return systemPrompt;
}

export function buildPrompt({
  text,
  model = "gemini",
  controls = {},
  mode = "text",
}: {
  text: string;
  model: string;
  controls?: PromptControls;
  mode?: ModelMode;
}) {
  const systemPrompt = buildSystemPrompt(model, controls, mode);

  return `${systemPrompt}

Raw Intent: "${text}"

Refined Prompt:
`;
}
