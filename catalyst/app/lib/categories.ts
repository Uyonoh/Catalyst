import { createClient } from "./supabase-server";

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

// Fallback if DB is unreachable — keeps the app functional
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "1",
    slug: "chat",
    label: "Chat / Conversation",
    icon: "chat",
    description: null,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    slug: "auto_awesome",
    label: "Creative / AI",
    icon: "auto_awesome",
    description: null,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    slug: "terminal",
    label: "CLI / DevOps",
    icon: "terminal",
    description: null,
    sort_order: 3,
    is_active: true,
  },
  {
    id: "4",
    slug: "image",
    label: "Image Generation",
    icon: "image",
    description: null,
    sort_order: 4,
    is_active: true,
  },
  {
    id: "5",
    slug: "filter_frames",
    label: "3D / Frames",
    icon: "filter_frames",
    description: null,
    sort_order: 5,
    is_active: true,
  },
  {
    id: "6",
    slug: "palette",
    label: "Design / Visual",
    icon: "palette",
    description: null,
    sort_order: 6,
    is_active: true,
  },
  {
    id: "7",
    slug: "article",
    label: "Writing / Article",
    icon: "article",
    description: null,
    sort_order: 7,
    is_active: true,
  },
  {
    id: "8",
    slug: "code",
    label: "Code / Engineering",
    icon: "code",
    description: null,
    sort_order: 8,
    is_active: true,
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? FALLBACK_CATEGORIES;
  } catch (err) {
    console.error("getCategories fallback:", err);
    return FALLBACK_CATEGORIES;
  }
}
