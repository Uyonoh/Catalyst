import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogSection {
  type: "heading" | "paragraph" | "callout" | "code" | "list" | "divider";
  level?: 2 | 3;
  text?: string;
  items?: string[];
  variant?: "tip" | "warning" | "info";
  language?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: BlogSection[];
  category: string;
  cover_gradient: string;
  icon_bg: string;
  icon_color: string;
  category_color: string;
  read_time: string;
  published_at: string;
  author_name: string;
  author_role: string;
  author_initials: string;
  author_color: string;
  tags: string[];
  is_published: boolean;
  sort_order: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all published blog posts, ordered by sort_order then published_at desc.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });

    if (error) throw error;
    return (data as BlogPost[]) ?? [];
  } catch (err) {
    console.error("getBlogPosts error:", err);
    return [];
  }
}

/**
 * Fetch a single published blog post by its slug.
 * Returns null if not found or not published.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) throw error;
    return (data as BlogPost) ?? null;
  } catch (err) {
    console.error(`getBlogPost(${slug}) error:`, err);
    return null;
  }
}

/**
 * Fetch only slugs — used by generateStaticParams in the [slug] page.
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true);

    if (error) throw error;
    return (data ?? []).map((row: { slug: string }) => row.slug);
  } catch (err) {
    console.error("getAllBlogSlugs error:", err);
    return [];
  }
}

