import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Since we need admin privileges to delete a user from auth.users,
    // we use the service role key.
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Everything else (prompts, analyses, etc.) will cascade automatically
    // due to the ON DELETE CASCADE foreign key constraints in our DB.
    
    // However, storage files do not cascade automatically. We should clear the avatars.
    // In a real prod environment we might queue an edge function rather than doing it live 
    // to prevent timeout if there are many files.
    // For now, we delete avatar if exists and prompt-assets.
    await supabaseAdmin.storage.from("avatars").remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`]);

    // Finally delete the user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
