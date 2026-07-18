import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { text, model } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("Authorization") || "";

    const backendRes = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        text,
        model
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

