import {
  MessageSquare,
  Sparkles,
  Terminal,
  Image as ImageIcon,
  Box,
  Palette,
  FileText,
  Code,
} from "lucide-react";

/** Maps icon key → { Icon component, Tailwind color classes for the tile } */
export const PROMPT_TYPE_TOKENS: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    bg: string; // e.g. "bg-emerald-500/10"
    border: string; // e.g. "border-emerald-500/20"
    text: string; // e.g. "text-emerald-400"
  }
> = {
  chat: {
    Icon: MessageSquare,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  auto_awesome: {
    Icon: Sparkles,
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
  },
  terminal: {
    Icon: Terminal,
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
  },
  image: {
    Icon: ImageIcon,
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
  },
  filter_frames: {
    Icon: Box,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  palette: {
    Icon: Palette,
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
  },
  article: {
    Icon: FileText,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
  code: {
    Icon: Code,
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    text: "text-lime-400",
  },
};

export const PROMPT_TYPE_FALLBACK = {
  Icon: FileText,
  bg: "bg-slate-500/10",
  border: "border-slate-500/20",
  text: "text-slate-400",
};

/** Maps model_color → static Tailwind classes for the model badge pill */
export const MODEL_BADGE_TOKENS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
  }
> = {
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  purple: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
};

export const MODEL_BADGE_FALLBACK = {
  bg: "bg-cyan-500/10",
  border: "border-cyan-500/20",
  text: "text-cyan-400",
};

/** Derive model color from target_model string (for HistoryCard) */
export const TARGET_MODEL_COLOR_MAP: Record<string, string> = {
  "gpt": "green",
  "gpt-4": "green",
  "gpt-4-turbo": "green",
  "gpt-4o": "green",
  "claude": "purple",
  "claude-3-opus": "purple",
  "claude-3-sonnet": "purple",
  "claude-3-haiku": "purple",
  "gemini": "yellow",
  "gemini-1.5-pro": "yellow",
  "gemini-1.5-flash": "yellow",
  "llama": "orange",
  "llama-3": "orange",
  "llama-3.1": "orange",
  "grok": "cyan",
  "dalle": "pink",
  "dall-e-3": "pink",
  "stablediffusion": "blue",
  "stable-diffusion-xl": "blue",
  "midjourney": "cyan",
  "midjourney-v6": "cyan",
  "veo": "rose",
};
