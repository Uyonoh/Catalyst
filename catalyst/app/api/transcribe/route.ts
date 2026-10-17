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

    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("file");

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const backendFormData = new FormData();
    backendFormData.append("file", audioFile);

    const backendRes = await fetch(`${BACKEND_URL}/transcribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error(`[transcribe] Backend error ${backendRes.status}:`, errorText);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Transcription Router Error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
