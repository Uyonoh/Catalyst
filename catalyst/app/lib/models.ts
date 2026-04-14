import { createClient } from "./supabase-server";

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
}

const FALLBACK_MODELS: Model[] = [
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
  },
];

export async function getModels(): Promise<Model[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? FALLBACK_MODELS;
  } catch (err) {
    console.error("getModels fallback:", err);
    return FALLBACK_MODELS;
  }
}
