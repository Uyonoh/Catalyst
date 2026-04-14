export type ModelFamily =
  | "gemini"
  | "gpt"
  | "claude"
  | "llama"
  | "grok"
  | "dalle"
  | "stablediffusion"
  | "midjourney"
  | "veo";

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
    structure: [
      "System Role",
      "Objective",
      "Instructions",
      "Constraints",
      "Output Format",
    ],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
  },
  claude: {
    structure: [
      "Role",
      "Goal",
      "Detailed Instructions",
      "Edge Cases",
      "Output Format",
    ],
    style: "verbose",
    prefers_steps: true,
    verbosity_control: false,
  },
  llama: {
    structure: ["System Prompt", "User Task", "Constraints", "Desired Output"],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
  },
  grok: {
    structure: ["Identity", "Objective", "Detailed Steps", "Style Guidelines"],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
  },
  dalle: {
    structure: ["Subject", "Style", "Composition", "Lighting", "Technical Info"],
    style: "concise",
    prefers_steps: false,
    verbosity_control: false,
  },
  stablediffusion: {
    structure: [
      "Prompt",
      "Negative Prompt",
      "Style Tags",
      "Technical Parameters",
    ],
    style: "concise",
    prefers_steps: false,
    verbosity_control: false,
  },
  midjourney: {
    structure: ["Core Concept", "Artistic Style", "Parameters (--v, --ar)"],
    style: "concise",
    prefers_steps: false,
    verbosity_control: false,
  },
  veo: {
    structure: ["Motion Description", "Camera Work", "Aesthetic Style", "Timing"],
    style: "balanced",
    prefers_steps: false,
    verbosity_control: false,
  },
};

export function getProfileForModel(modelId: string): ModelProfile {
  const id = modelId.toLowerCase();
  if (id.includes("gemini")) return MODEL_PROFILES.gemini;
  if (id.includes("claude")) return MODEL_PROFILES.claude;
  if (id.includes("llama")) return MODEL_PROFILES.llama;
  if (id.includes("grok")) return MODEL_PROFILES.grok;
  if (id.includes("dalle")) return MODEL_PROFILES.dalle;
  if (id.includes("stablediffusion") || id.includes("sdxl"))
    return MODEL_PROFILES.stablediffusion;
  if (id.includes("midjourney")) return MODEL_PROFILES.midjourney;
  if (id.includes("veo")) return MODEL_PROFILES.veo;
  return MODEL_PROFILES.gpt; // Default to GPT profile
}
