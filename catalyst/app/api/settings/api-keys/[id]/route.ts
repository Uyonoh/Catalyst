import { createClient } from "../../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const { error } = await supabase
      .from("user_api_keys")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ message: "Successfully deleted" }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
