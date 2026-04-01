import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { provider, key } = await request.json();
    if (!provider || !key) return NextResponse.json({ message: "Provider and key required" }, { status: 400 });

    // Validation logic per provider can go here (ping the API)
    
    // For Option B scaffold: We encrypt before storing
    // In this draft implementation we store as-is or we can use pgcrypto via SQL if we want it fully secure.
    // Let's use a preview format for UI and store the full one.
    const keyPreview = key.length > 8 
        ? `${key.slice(0, 4)}...${key.slice(-4)}` 
        : "****";

    const { error } = await supabase
      .from("user_api_keys")
      .upsert({
        user_id: user.id,
        provider,
        key_preview: keyPreview,
        encrypted_key: key, // Future: encrypt with crypto.
      }, { onConflict: "user_id, provider" });

    if (error) throw error;
    return NextResponse.json({ message: "Key saved successfully", provider }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data } = await supabase
      .from("user_api_keys")
      .select("id, provider, key_preview, created_at");

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
