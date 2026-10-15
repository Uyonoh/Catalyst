import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionToken } from "@/app/lib/supabase-server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, model: modelId = "gemini" } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Prompt content is required" },
        { status: 400 },
      );
    }

    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const titlePrompt = `Generate a short, descriptive title (max 60 characters) for this prompt. Return ONLY the title, no quotes or extra text:\n\n${content.substring(0, 2000)}`;

    const backendRes = await fetch(`${BACKEND_URL}/generate-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: titlePrompt,
        model: "gemini-3.1-flash-lite",
        provider: "google",
        mode: "text",
        controls: {
          outputFormat: "text",
          creativity: 0.3,
          precision: 0.8,
          length: "short",
        },
        buildPrompt: false,
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`[generate-title] Backend error ${backendRes.status}:`, errorText);
      return NextResponse.json(
        { error: "Failed to generate title" },
        { status: 500 },
      );
    }

    const backendData = await backendRes.json();
    let title = backendData.refinedPrompt || "Untitled Generated Prompt";
    
    title = title.replace(/^["']|["']$/g, '').trim();
    if (title.length > 60) {
      title = title.substring(0, 57) + "...";
    }

    return NextResponse.json({ title });
  } catch (error: any) {
    console.error("Error in generate-title API:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 },
    );
  }
}