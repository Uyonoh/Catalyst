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

async function getLibraryItems(searchParams: { [key: string]: string | undefined }): Promise<LibraryItem[]> {
  let query = supabase
    .from("prompts_public")
    .select(
      "id, title, updated_at, snippet, content, target_model, model_color, tag, icon, icon_color, has_gradient",
    );

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,snippet.ilike.%${searchParams.q}%`);
  }

  if (searchParams.tag) {
    query = query.eq('tag', searchParams.tag);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

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

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const params = {
    q: typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined,
    tag: typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined,
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
