import { ModelMode } from "../models-shared";

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
  modeInstructions: Partial<Record<ModelMode, string>>;
}

export const MODEL_PROFILES: Record<ModelFamily, ModelProfile> = {
  gemini: {
    structure: ["Role", "Task", "Context", "Constraints", "Output Format"],
    style: "concise",
    prefers_steps: true,
    verbosity_control: true,
    modeInstructions: {
      text: "Optimise for a natural language conversation task.",
      vision:
        "The user will provide an image. Focus the prompt on visual analysis, scene description, or extracting information from the image.",
      image:
        "Craft a detailed image generation prompt, including subject, style, composition, lighting, and technical details.",
      video:
        "Describe motion, camera movement, scene transitions, timing, and aesthetic style for video generation.",
      audio:
        "Design the prompt for an audio/speech task. Specify tone, pacing, and voice characteristics.",
      code: "Structure the prompt as a programming task with clearly defined requirements and expected output format.",
    },
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
    modeInstructions: {
      text: "Optimise the prompt for a natural language conversation task.",
      vision:
        "The prompt will be used with an image attached. Include references to visual details, composition, and scene description.",
      image:
        "Craft a detailed DALL-E 3 prompt. Describe subject, style, composition, lighting, and negative constraints.",
      code: "Structure the prompt as a programming task with clearly defined requirements, language, and expected output format.",
      audio:
        "Design the prompt for an audio/speech task. Specify tone, pacing, and voice characteristics.",
    },
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
    modeInstructions: {
      text: "Optimise for a nuanced and detailed natural language response.",
      vision:
        "An image is provided. Refer to visual elements, text within the image, or spatial relationships in your instructions.",
      code: "Emphasize correct syntax, edge case handling, and best practices in the prompt.",
    },
  },
  llama: {
    structure: ["System Prompt", "User Task", "Constraints", "Desired Output"],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
    modeInstructions: {
      text: "Ensure instructions are direct and clear for a text-based task.",
      code: "Provide clear logic steps and language requirements for the coding task.",
    },
  },
  grok: {
    structure: ["Identity", "Objective", "Detailed Steps", "Style Guidelines"],
    style: "balanced",
    prefers_steps: true,
    verbosity_control: true,
    modeInstructions: {
      text: "Maintain an objective but witty tone in the instructions.",
      vision: "Reference real-time visual information provided in the input.",
      code: "Focus on modern, efficient code implementations.",
    },
  },
  dalle: {
    structure: ["Subject", "Style", "Composition", "Lighting", "Technical Info"],
    style: "concise",
    prefers_steps: false,
    verbosity_control: false,
    modeInstructions: {
      image:
        "Write a detailed DALL-E prompt: subject, artistic style, medium, lighting, mood, and composition.",
    },
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
    modeInstructions: {
      image:
        "Generate a tag-heavy prompt suitable for SDXL, including lighting, high-quality tags, and stylistic preferences.",
    },
  },
  midjourney: {
    structure: ["Core Concept", "Artistic Style", "Parameters (--v, --ar)"],
    style: "concise",
    prefers_steps: false,
    verbosity_control: false,
    modeInstructions: {
      image:
        "Focus on concept, aesthetic, and specific Midjourney parameters like aspect ratio and version tags.",
    },
  },
  veo: {
    structure: ["Motion Description", "Camera Work", "Aesthetic Style", "Timing"],
    style: "balanced",
    prefers_steps: false,
    verbosity_control: false,
    modeInstructions: {
      video:
        "Describe the video scene with motion cues, camera angles, transitions, colour grading, and timing beats.",
    },
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
