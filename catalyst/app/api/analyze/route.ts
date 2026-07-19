import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionToken } from "@/app/lib/supabase-server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    // Verify the user server-side — never trust the client's Authorization header
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, model } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required" },
        { status: 400 },
      );
    }

    // Retrieve the server-side session token to authenticate with FastAPI
    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text,
        model,
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      throw new Error(`FastAPI backend error: ${backendRes.status} ${errorText}`);
    }

    const optimized = await backendRes.json();
    return NextResponse.json(optimized);
  } catch (error) {
    console.error("Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze prompt" },
      { status: 500 },
    );
  }
}
