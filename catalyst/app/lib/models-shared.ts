export type ModelMode =
  | "text" // standard text prompt
  | "image" // image generation / image-understanding
  | "video" // video generation
  | "audio" // audio input/output
  | "code" // code-focused prompt style
  | "vision"; // image-in, text-out (e.g. vision-only models)

export interface Model {
  id: string;
  slug: string;
  name: string;
  brief: string;
  type: "Txt" | "Img" | "Vid";
  icon: string;
  color: string;
  provider: string | null;
  sort_order: number;
  is_active: boolean;
  modes: ModelMode[]; // ordered — first entry is the default
}

export const FALLBACK_MODELS: Model[] = [
  {
    id: "1",
    slug: "gpt",
    name: "ChatGPT-5",
    brief: "ChatGPT",
    type: "Txt",
    icon: "chat",
    color: "green",
    provider: "OpenAI",
    sort_order: 1,
    is_active: true,
    modes: ["text", "vision", "image", "audio", "code"],
  },
  {
    id: "2",
    slug: "claude",
    name: "Claude 4 Opus",
    brief: "CLAUDE 4",
    type: "Txt",
    icon: "auto_awesome",
    color: "purple",
    provider: "Anthropic",
    sort_order: 2,
    is_active: true,
    modes: ["text", "vision", "code"],
  },
  {
    id: "3",
    slug: "gemini",
    name: "Gemini 3 Pro",
    brief: "GEMINI 3",
    type: "Txt",
    icon: "auto_awesome",
    color: "yellow",
    provider: "Google",
    sort_order: 3,
    is_active: true,
    modes: ["text", "vision", "image", "video", "audio", "code"],
  },
  {
    id: "4",
    slug: "llama",
    name: "Llama 3",
    brief: "LLAMA 3",
    type: "Txt",
    icon: "terminal",
    color: "orange",
    provider: "Meta",
    sort_order: 4,
    is_active: true,
    modes: ["text", "code"],
  },
  {
    id: "5",
    slug: "grok",
    name: "Grok-1",
    brief: "GROK-1",
    type: "Txt",
    icon: "terminal",
    color: "cyan",
    provider: "xAI",
    sort_order: 5,
    is_active: true,
    modes: ["text", "vision", "code"],
  },
  {
    id: "6",
    slug: "dalle",
    name: "DALL-E 3",
    brief: "DALLE 3",
    type: "Img",
    icon: "image",
    color: "pink",
    provider: "OpenAI",
    sort_order: 6,
    is_active: true,
    modes: ["image"],
  },
  {
    id: "7",
    slug: "stablediffusion",
    name: "Stable Diffusion",
    brief: "SDXL",
    type: "Img",
    icon: "filter_frames",
    color: "blue",
    provider: "Stability",
    sort_order: 7,
    is_active: true,
    modes: ["image"],
  },
  {
    id: "8",
    slug: "midjourney",
    name: "Midjourney v6",
    brief: "MJ v6",
    type: "Img",
    icon: "palette",
    color: "cyan",
    provider: "Midjourney",
    sort_order: 8,
    is_active: true,
    modes: ["image"],
  },
  {
    id: "9",
    slug: "veo",
    name: "Veo Video",
    brief: "VEO",
    type: "Vid",
    icon: "video",
    color: "rose",
    provider: "Google",
    sort_order: 9,
    is_active: true,
    modes: ["video"],
  },
];

export const MODE_LABELS: Record<ModelMode, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
  code: "Code",
  vision: "Vision",
};

export const MODE_ICONS: Record<ModelMode, string> = {
  text: "file-text",
  image: "image",
  video: "video",
  audio: "mic",
  code: "code",
  vision: "eye",
};

export function getModelModes(model: Model): ModelMode[] {
  if (model.modes && Array.isArray(model.modes) && model.modes.length > 0) {
    return model.modes;
  }
  const fallback = FALLBACK_MODELS.find(m => m.slug === model.slug);
  if (fallback && fallback.modes) {
    return fallback.modes;
  }
  if (model.type === "Img") return ["image"];
  if (model.type === "Vid") return ["video"];
  return ["text"];
}

export function isMultimodal(model: Model): boolean {
  const modes = getModelModes(model);
  return modes.length > 1;
}

export function getDefaultMode(model: Model): ModelMode {
  const modes = getModelModes(model);
  return modes[0] || "text";
}
