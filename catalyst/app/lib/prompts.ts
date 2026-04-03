import { createClient } from "../lib/supabase-server";
import { LibraryItem } from "../components/library/LibraryCard";

export async function getRecentPrompts(userId: string): Promise<LibraryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("id, title, updated_at, snippet, content, target_model, model_color, tag, icon, icon_color, has_gradient")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
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
