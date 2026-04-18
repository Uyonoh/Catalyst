import Header from "../components/Header";
export const revalidate = 60;
import Footer from "../components/Footer";
import LibraryBackground from "../components/library/LibraryBackground";
import LibraryHero from "../components/library/LibraryHero";
import LibraryFeatured from "../components/library/LibraryFeatured";
import LibrarySearch from "../components/library/LibrarySearch";
import LibraryTags from "../components/library/LibraryTags";
import LibraryGrid from "../components/library/LibraryGrid";
import { LibraryItem } from "../components/library/LibraryCard";
import { supabase } from "../lib/supabase";

async function getLibraryItems(searchParams: {
  q?: string;
  tag?: string;
  tags?: string;
  icon?: string;
  icons?: string;
  models?: string;
  modes?: string;
  sort?: string;
}): Promise<LibraryItem[]> {
  let query = supabase
    .from("prompts_public")
    .select(
      "id, title, updated_at, snippet, content, target_model, model_color, tag, icon, icon_color, has_gradient",
    );

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,snippet.ilike.%${searchParams.q}%`,
    );
  }

  // Tags
  if (searchParams.tags) {
    const tagsArray = searchParams.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagsArray.length > 0) {
      query = query.in("tag", tagsArray);
    }
  } else if (searchParams.tag) {
    query = query.eq("tag", searchParams.tag);
  }

  // Category (icon)
  if (searchParams.icons) {
    const iconsArray = searchParams.icons
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (iconsArray.length > 0) {
      query = query.in("icon", iconsArray);
    }
  } else if (searchParams.icon) {
    console.log("Icon: ", searchParams.icon);
    query = query.eq("icon", searchParams.icon);
  }

  // Models
  if (searchParams.models) {
    const modelsArray = searchParams.models
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (modelsArray.length > 0) {
      query = query.in("target_model", modelsArray);
    }
  }

  // Sorting
  const sort = searchParams.sort || "newest";
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    // Default: newest
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.warn("Failed to fetch library items:", error.message);
    return [];
  }

  // Filter by modes if requested (since we map modes to types/models in memory for now)
  let filteredData = data || [];
  if (searchParams.modes) {
    const modesArray = searchParams.modes
      .split(",")
      .map((m) => m.trim().toLowerCase());
    // This is a simple heuristic: if it's Midjourney/DALLE -> image, etc.
    // In a real app we might join with a models table or have a 'type' on prompt.
    filteredData = filteredData.filter((item: any) => {
      const model = item.target_model.toLowerCase();
      if (
        modesArray.includes("image") &&
        (model.includes("midjourney") ||
          model.includes("dall-e") ||
          model.includes("stable diffusion"))
      )
        return true;
      if (
        modesArray.includes("video") &&
        (model.includes("veo") || model.includes("sora"))
      )
        return true;
      if (
        modesArray.includes("text") &&
        !(
          model.includes("midjourney") ||
          model.includes("dall-e") ||
          model.includes("stable diffusion") ||
          model.includes("veo")
        )
      )
        return true;
      return false;
    });
  }

  // Map database target_model to model field
  return filteredData.map((item: any) => ({
    ...item,
    model: item.target_model,
  })) as LibraryItem[];
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const params = {
    q:
      typeof resolvedSearchParams.q === "string"
        ? resolvedSearchParams.q
        : undefined,
    tag:
      typeof resolvedSearchParams.tag === "string"
        ? resolvedSearchParams.tag
        : undefined,
    tags:
      typeof resolvedSearchParams.tags === "string"
        ? resolvedSearchParams.tags
        : undefined,
    icon:
      typeof resolvedSearchParams.icon === "string"
        ? resolvedSearchParams.icon
        : undefined,
    icons:
      typeof resolvedSearchParams.icons === "string"
        ? resolvedSearchParams.icons
        : undefined,
    models:
      typeof resolvedSearchParams.models === "string"
        ? resolvedSearchParams.models
        : undefined,
    modes:
      typeof resolvedSearchParams.modes === "string"
        ? resolvedSearchParams.modes
        : undefined,
    sort:
      typeof resolvedSearchParams.sort === "string"
        ? resolvedSearchParams.sort
        : undefined,
  };

  const items = await getLibraryItems(params);

  return (
    <>
      <LibraryBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
          <LibraryHero />
          <LibraryFeatured />
          <LibrarySearch />
          <LibraryTags />
          <LibraryGrid items={items} />
        </main>

        <Footer />
      </div>
    </>
  );
}
