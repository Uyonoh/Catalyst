import { supabase } from "./supabase";
import { LibraryItem } from "../components/library/LibraryCard";

export async function getRecentPrompts(): Promise<LibraryItem[]> {
  const { data, error } = await supabase
    .from("prompts_public")
    .select(
      "id, title, updated_at, snippet, target_model, model_color, tag, icon, icon_color, has_gradient",
    )
    .order("updated_at", { ascending: false })
    .limit(5);

  if (error) {
    console.warn("Failed to fetch library items:", error.message);
    return [];
  }

  // Map database target_model to model field
  return (data || []).map((item: any) => ({
    ...item,
    model: item.target_model,
  })) as LibraryItem[];
}

const PROMPTS = [
  {
    id: 1,
    title: "Code Refactor Agent",
    description:
      "System prompt designed to analyze legacy Python codebases and suggest modular improvements using SOLID principles.",
    tags: ["Python", "Engineering"],
    status: "Optimized",
    timeAgo: "2h ago",
    model: "GPT-4 Turbo",
    icon: "smart_toy",
    color: "green",
  },
  {
    id: 2,
    title: "SaaS Landing Copy",
    description:
      "Generating high-conversion hero section copy for a fintech startup targeting Gen Z users.",
    tags: ["Marketing", "Copywriting"],
    status: "Draft",
    timeAgo: "5h ago",
    model: "Claude 3 Opus",
    icon: "psychology",
    color: "yellow",
  },
  {
    id: 3,
    title: "Data Extraction JSON",
    description:
      "Reliably extract specific entities from unstructured medical text into a strict JSON schema.",
    tags: ["Data", "JSON"],
    status: "Testing",
    timeAgo: "1d ago",
    model: "Mistral Large",
    icon: "cloud",
    color: "purple",
  },
  {
    id: 4,
    title: "Legal Contract Summary",
    description:
      "Summarizing NDA documents highlighting key risk clauses and indemnity terms.",
    tags: ["Legal"],
    status: "Optimized",
    timeAgo: "2d ago",
    model: "Gemini 1.5 Pro",
    icon: "spark",
    color: "green",
  },
];
