import { createClient } from "./supabase-server";

export type AIProvider = "openai" | "anthropic" | "google";

/**
 * Gets a user's API key, prioritizing environment variables (Option C) 
 * but checking the database (Option B scaffold) if not found.
 */
export async function getApiKey(provider: AIProvider): Promise<string | null> {
  // Option C: Shared environment variables (from .env)
  const envKey = getEnvKey(provider);
  if (envKey) return envKey;

  // Option B Scaffold: Check for user-provided key in the database
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: keyRecord } = await supabase
      .from("user_api_keys")
      .select("encrypted_key")
      .eq("user_id", user.id)
      .eq("provider", provider)
      .single();

    if (keyRecord) {
      // In a full Option B implementation, you would decrypt the key here
      // using pgp_sym_decrypt if stored encrypted at the DB level, 
      // or decrypt it here on the application side.
      return keyRecord.encrypted_key;
    }
  }

  return null;
}

function getEnvKey(provider: AIProvider): string | undefined {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY;
    case "google":
      return process.env.GEMINI_API_KEY;
    default:
      return undefined;
  }
}
