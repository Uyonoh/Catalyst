import Header from "../components/Header";
import Footer from "../components/Footer";
import LibraryBackground from "../components/library/LibraryBackground";
import LibraryHero from "../components/library/LibraryHero";
import LibraryFeatured from "../components/library/LibraryFeatured";
import LibrarySearch from "../components/library/LibrarySearch";
import WorkspaceSearch from "../components/library/WorkspaceSearch";
import LibraryTags from "../components/library/LibraryTags";
import LibraryGrid from "../components/library/LibraryGrid";
import Pagination from "../components/Pagination";
import { LibraryItem } from "../components/library/LibraryCard";
import { supabase } from "../lib/supabase";
import { Metadata } from "next";
import LibraryViewToggle from "../components/library/LibraryViewToggle";

export const metadata: Metadata = {
  title: "Free AI Prompt Library & Generator - Your Organized Prompt Catalog",
  description:
    "Browse, search, and manage prompts from the community. Your creative arsenal, organized.",
};

export const revalidate = 60;

const PAGE_SIZE = 9;

async function getLibraryWorkspaces(searchParams: {
  q?: string;
  sort?: string;
  page?: number;
  visibility?: string;
}): Promise<{ items: LibraryItem[]; totalCount: number }> {
  let query = supabase.from("workspaces").select(
    `
      id,
      name,
      description,
      visibility,
      user_id,
      created_at,
      updated_at,
      user_metadata (
        name
      )
      `,
  );

  if (
    searchParams.visibility &&
    ["community", "public"].includes(searchParams.visibility)
  ) {
    query = query.eq("visibility", searchParams.visibility);
  } else {
    query = query.in("visibility", ["community", "public"]);
  }

  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`,
    );
  }

  // Sorting
  const sort = searchParams.sort || "newest";
  if (sort === "oldest") {
    query = query.order("updated_at", { ascending: true });
  } else if (sort === "title") {
    query = query.order("name", { ascending: true });
  } else {
    // Default: newest
    query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.warn("Failed to fetch library workspaces:", error.message);
    return { items: [], totalCount: 0 };
  }

  const mappedData: LibraryItem[] = (data || []).map((item: any) => {
    const prof: any = Array.isArray(item.user_metadata)
      ? item.user_metadata[0]
      : item.user_metadata;
    const authorName = prof?.name || "Architect";
    const community = item.visibility === "community";

    return {
      id: item.id,
      title: item.name,
      updated_at: item.updated_at,
      snippet: item.description || "Active engineering workspace",
      content: "",
      model: community ? "Community" : "Public",
      model_color: community ? "purple" : "green",
      tag: `By ${authorName}`,
      icon: community ? "users" : "globe",
      icon_color: community ? "cyan" : "emerald",
      has_gradient: true,
      user_id: item.user_id,
      isWorkspace: true,
    };
  });

  const totalCount = mappedData.length;
  const page = searchParams.page || 1;
  const start = (page - 1) * PAGE_SIZE;
  const slicedData = mappedData.slice(start, start + PAGE_SIZE);

  return {
    items: slicedData,
    totalCount,
  };
}

async function getLibraryItems(searchParams: {
  q?: string;
  tag?: string;
  tags?: string;
  icon?: string;
  icons?: string;
  models?: string;
  modes?: string;
  sort?: string;
  page?: number;
}): Promise<{ items: LibraryItem[]; totalCount: number }> {
  let query = supabase
    .from("prompts_public")
    .select(
      "id, title, updated_at, snippet, content, target_model, model_color, tag, icon, icon_color, has_gradient, target",
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
    query = query.order("updated_at", { ascending: true });
  } else if (sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    // Default: newest
    query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.warn("Failed to fetch library items:", error.message);
    return { items: [], totalCount: 0 };
  }

  // Filter by modes if requested (since we map modes to types/models in memory for now)
  let filteredData = data || [];
  if (searchParams.modes) {
    const modesArray = searchParams.modes
      .split(",")
      .map((m) => m.trim().toLowerCase());
    // This is a simple heuristic: if it's Midjourney/DALLE -> image, etc.
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

  const mappedData = filteredData.map((item: any) => ({
    ...item,
    model: item.target_model,
  })) as LibraryItem[];

  const totalCount = mappedData.length;
  const page = searchParams.page || 1;
  const start = (page - 1) * PAGE_SIZE;
  const slicedData = mappedData.slice(start, start + PAGE_SIZE);

  return {
    items: slicedData,
    totalCount,
  };
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const pageVal =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page, 10)
      : 1;
  const currentPage = isNaN(pageVal) || pageVal < 1 ? 1 : pageVal;

  const view =
    typeof resolvedSearchParams.view === "string"
      ? resolvedSearchParams.view
      : "prompts";

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
    visibility:
      typeof resolvedSearchParams.visibility === "string"
        ? resolvedSearchParams.visibility
        : undefined,
    page: currentPage,
  };

  const { items, totalCount } =
    view === "workspaces"
      ? await getLibraryWorkspaces({
          q: params.q,
          sort: params.sort,
          page: params.page,
          visibility: params.visibility,
        })
      : await getLibraryItems(params);

  let featured: (typeof items)[number] | null = null;

  if (items && totalCount > 0) {
    featured =
      items.find((item) => item.id == "ffd8c7aa-24e4-4cb2-a691-7b060b25afcf") ??
      items[0];
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <LibraryBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
          <LibraryHero />
          <LibraryViewToggle />
          {view !== "workspaces" && <LibraryFeatured featured={featured} />}
          {view === "workspaces" ? <WorkspaceSearch /> : <LibrarySearch />}
          {view !== "workspaces" && <LibraryTags />}
          <LibraryGrid items={items} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
          />
        </main>

        <Footer />
      </div>
    </>
  );
}
