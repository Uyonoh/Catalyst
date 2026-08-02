import {
  type LucideIcon,
  Zap,
  Orbit,
  Aperture,
  Activity,
  Infinity as InfinityIcon,
} from "lucide-react";

export interface Tier {
  name: string;
  alias: string;
  price: number;
  discountedPrice: number | null;
  period: string;
  description: string;
  features: string[];
  cta: string;
  tierKey: string;
  highlight: boolean;
  icon: LucideIcon;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  hoverClass: string;
  glowClass: string;
}

export interface ComparisonRow {
  category: string;
  feature: string;
  values: (string | boolean | null)[];
}

export const TIERS: Tier[] = [
  {
    name: "Free",
    alias: "Spark",
    price: 0,
    discountedPrice: null,
    period: "forever",
    description:
      "Ideal for beginners and hobbyists seeking core prompt optimization tools.",
    features: [
      "Access to standard models (GPT-3.5, Gemini Flash)",
      "25 weekly token limit",
      "Up to 20 saved prompts",
    ],
    cta: "Default Plan",
    tierKey: "free",
    highlight: false,
    icon: Zap,
    colorClass: "text-slate-400",
    borderClass: "border-white/10",
    bgClass: "bg-slate-500",
    hoverClass: "bg-slate-400 text-white",
    glowClass: "",
  },
  {
    name: "Basic",
    alias: "Orbit",
    price: 3,
    discountedPrice: 1,
    period: "per month",
    description:
      "Designed for individuals starting to experiment with premium AI models and workspaces.",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 50 saved prompts",
      "Up to 3 managed workspaces",
      "100 weekly token limit",
    ],
    cta: "Switch to Basic",
    tierKey: "basic",
    highlight: false,
    icon: Orbit,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    bgClass: "bg-cyan-500",
    hoverClass: "bg-cyan-400",
    glowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
  },
  {
    name: "Plus",
    alias: "Nova",
    price: 7,
    discountedPrice: 3,
    period: "per month",
    description:
      "Perfect for power prompt engineers and creators wanting higher token caps.",
    cta: "Switch to Plus",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 100 saved prompts",
      "Up to 10 managed workspaces",
      "250 weekly token limit",
    ],
    tierKey: "plus",
    highlight: true,
    icon: Aperture,
    colorClass: "text-blue-300",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400",
    hoverClass: "bg-blue-300",
    glowClass: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    name: "Pro",
    alias: "Pulsar",
    price: 12,
    discountedPrice: 5,
    period: "per month",
    description:
      "Built for professional studios and agencies needing high-frequency prompt engineering.",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 200 saved prompts",
      "Up to 30 managed workspaces",
      "500 weekly token limit",
    ],
    cta: "Switch to Pro",
    tierKey: "pro",
    highlight: false,
    icon: Activity,
    colorClass: "text-amber-400",
    borderClass: "border-yellow-500/20",
    bgClass: "bg-amber-500",
    hoverClass: "bg-amber-400",
    glowClass: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  },
  {
    name: "Ultra",
    alias: "Infinity",
    price: 20,
    discountedPrice: 10,
    period: "per month",
    description:
      "The ultimate tier offering infinite scale, custom integrations, and unlimited tokens.",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Unlimited saved prompts",
      "Unlimited managed workspaces",
      "Unlimited tokens",
    ],
    cta: "Switch to Ultra",
    tierKey: "ultra",
    highlight: false,
    icon: InfinityIcon,
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "bg-purple-500",
    hoverClass: "bg-purple-400",
    glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  // Usage
  {
    category: "Usage Limits",
    feature: "Weekly Tokens",
    values: ["25", "100", "250", "500", "Unlimited"],
  },
  {
    category: "Usage Limits",
    feature: "Saved Prompts",
    values: ["20", "50", "100", "200", "Unlimited"],
  },
  {
    category: "Usage Limits",
    feature: "Managed Workspaces",
    values: [false, "3", "10", "30", "Unlimited"],
  },

  // Models
  {
    category: "AI Models",
    feature: "Standard Models (GPT-3.5, Gemini Flash)",
    values: [true, true, true, true, true],
  },
  {
    category: "AI Models",
    feature: "Premium Models (GPT-4o, Claude Opus)",
    values: [false, true, true, true, true],
  },
  {
    category: "AI Models",
    feature: "Ultra-Advanced & Fine-Tuned Models",
    values: [false, false, false, false, true],
  },

  // Features
  {
    category: "Features",
    feature: "Prompt Optimization",
    values: [true, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Prompt History",
    values: [true, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Workspace Collaboration",
    values: [false, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Analytics & Insights",
    values: [false, false, true, true, true],
  },
  {
    category: "Features",
    feature: "Enterprise Audit Logs",
    values: [false, false, false, true, true],
  },
  {
    category: "Features",
    feature: "Custom Integrations",
    values: [false, false, false, false, true],
  },

  // Support
  {
    category: "Support",
    feature: "Community Support",
    values: [true, true, true, true, true],
  },
  {
    category: "Support",
    feature: "Email Support",
    values: [false, true, true, true, true],
  },
  {
    category: "Support",
    feature: "Priority Support",
    values: [false, false, true, true, true],
  },
  {
    category: "Support",
    feature: "Dedicated Account Manager",
    values: [false, false, false, false, true],
  },
];

export function getPlanByKey(tierKey: string): Tier | undefined {
  return TIERS.find((tier) => tier.tierKey === tierKey.toLowerCase());
}

export function getPlanCategories(): string[] {
  return Array.from(new Set(COMPARISON_ROWS.map((row) => row.category)));
}
