import { supabaseBrowser } from "./supabase-browser";

export async function toggleFavoritePrompt(userId: string, prompt: any) {
  // If the prompt belongs to the user, toggle is_favorite
  if (prompt.user_id === userId) {
    const { data, error } = await supabaseBrowser
      .from("prompts")
      .update({ is_favorite: !prompt.is_favorite })
      .eq("id", prompt.id)
      .select()
      .single();
    if (error) throw error;
    return { action: prompt.is_favorite ? "unfavorited" : "favorited", prompt: data };
  } else {
    // If it does not belong to the user:
    // Check if the user has already duplicated/favorited this prompt
    const { data: existing, error: fetchError } = await supabaseBrowser
      .from("prompts")
      .select("*")
      .eq("user_id", userId)
      .eq("title", prompt.title)
      .eq("content", prompt.content);

    if (fetchError) throw fetchError;

    if (existing && existing.length > 0) {
      // It exists. Let's toggle is_favorite on the existing one.
      const target = existing[0];
      if (target.is_favorite) {
        // If it was already favorited, we can toggle it to false (unfavorite)
        const { data, error } = await supabaseBrowser
          .from("prompts")
          .update({ is_favorite: false })
          .eq("id", target.id)
          .select()
          .single();
        if (error) throw error;
        return { action: "unfavorited", prompt: data };
      } else {
        // Toggle it to true
        const { data, error } = await supabaseBrowser
          .from("prompts")
          .update({ is_favorite: true })
          .eq("id", target.id)
          .select()
          .single();
        if (error) throw error;
        return { action: "favorited", prompt: data };
      }
    } else {
      // It does not exist in user's prompts at all. Let's duplicate it with is_favorite = true.
      const { data, error } = await supabaseBrowser
        .from("prompts")
        .insert({
          user_id: userId,
          title: prompt.title,
          content: prompt.content,
          snippet: prompt.snippet || prompt.content.substring(0, 150),
          target_model: prompt.target_model || prompt.model || "GPT-4 Turbo",
          model_color: prompt.model_color || "cyan",
          tag: prompt.tag || null,
          icon: prompt.icon || "auto_awesome",
          icon_color: prompt.icon_color || "cyan",
          has_gradient: prompt.has_gradient || false,
          is_favorite: true,
          is_public: false,
          raw_input: prompt.raw_input || prompt.content,
          mode: prompt.mode || "text",
        })
        .select()
        .single();
      if (error) throw error;
      return { action: "duplicated", prompt: data };
    }
  }
}

export async function checkPromptFavoriteStatus(userId: string, prompt: any): Promise<boolean> {
  if (!userId) return false;
  if (prompt.user_id === userId) {
    return !!prompt.is_favorite;
  }
  const { data, error } = await supabaseBrowser
    .from("prompts")
    .select("is_favorite")
    .eq("user_id", userId)
    .eq("title", prompt.title)
    .eq("content", prompt.content)
    .eq("is_favorite", true);
  if (error) return false;
  return data && data.length > 0;
}
