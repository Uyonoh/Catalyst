import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Unhandled promise rejection warning if set from Server Component.
            // Safe to ignore because the set process is handled by a Server Action or Middleware.
          }
        },
      },
    }
  );
}

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}

export async function getServerUser() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error retrieving user from server:", error);
    return null;
  }
}

/**
 * Returns the current session's JWT access token for server-side use.
 * Use this to inject `Authorization: Bearer <token>` when proxying
 * requests to the FastAPI backend — never forward the client header directly.
 */
export async function getSessionToken(): Promise<string | null> {
  const supabase = await createClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.access_token;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return null;
  }
}
