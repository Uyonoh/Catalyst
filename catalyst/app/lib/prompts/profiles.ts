export type ModelFamily = "gemini" | "gpt" | "claude";

export interface ModelProfile {
  structure: string[];
  style: "concise" | "balanced" | "verbose";
  prefers_steps: boolean;
  verbosity_control: boolean;
}

export const MODEL_PROFILES: Record<ModelFamily, ModelProfile> = {
  gemini: {
    structure: ["Role", "Task", "Context", "Constraints", "Output Format"],
    style: "concise",
    prefers_steps: true,
    verbosity_control: true,
  },
  gpt: {
    structure: ["System Role", "Objective", "Instructions", "Constraints", "Output Format"],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
  },
  claude: {
    structure: ["Role", "Goal", "Detailed Instructions", "Edge Cases", "Output Format"],
    style: "verbose",
    prefers_steps: true,
    verbosity_control: false,
  },
};

export function getProfileForModel(modelId: string): ModelProfile {
  const id = modelId.toLowerCase();
  if (id.includes("gemini")) return MODEL_PROFILES.gemini;
  if (id.includes("claude")) return MODEL_PROFILES.claude;
  return MODEL_PROFILES.gpt; // Default to GPT profile
}
