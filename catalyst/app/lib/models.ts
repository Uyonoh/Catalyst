import { createClient } from "./supabase-server";
import { FALLBACK_MODELS, Model } from "./models-shared";

export * from "./models-shared";

export async function getModels(): Promise<Model[]> {
  try {
    const supabase = await createClient();
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
