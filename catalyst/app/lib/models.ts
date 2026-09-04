import { createPublicClient } from "./supabase-server";
import { FALLBACK_MODELS, Model } from "./models-shared";

export * from "./models-shared";

const supabase = createPublicClient();

export async function getModels(): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data as Model[]) ?? FALLBACK_MODELS;
  } catch (err) {
    console.error("getModels fallback:", err);
    return FALLBACK_MODELS;
  }
}

export async function getModelBySlug(slug: string): Promise<Model | undefined> {
  const models = await getModels();
  return models.find((m) => m.slug === slug);
}
