import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionToken } from "@/app/lib/supabase-server";
import { consumeTokens, refundTokens } from "@/app/lib/tokenCosts";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, model: modelId, controls, mode = "text" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Raw intent text is required" },
        { status: 400 },
      );
    }

    if (!modelId || typeof modelId !== "string") {
      return NextResponse.json(
        { error: "Invalid model input" },
        { status: 400 },
      );
    }

    // Consume tokens using the new function that queries public.token_costs with fallback
    const tokenResult = await consumeTokens(supabase, user.id, modelId, mode, '/api/parse');

    if (!tokenResult.ok) {
      return NextResponse.json({
        error: "Token quota exceeded",
        remaining: tokenResult.remaining,
        resets_at: tokenResult.resets_at,
        limit: tokenResult.limit,
      }, { status: 402 });
    }

    // Retrieve the server-side session token to authenticate with FastAPI.
    // We already verified the user above via getUser(), so the session is valid.
    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let refinedText = "";
    let format = controls?.outputFormat || "text";

    try {
      const backendRes = await fetch(`${BACKEND_URL}/generate-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text,
          model: "gemini-3.1-flash-lite",
          provider: "gemini",
          controls,
          mode,
          buildPrompt: true
        }),
      });

      if (!backendRes.ok) {
        const errorText = await backendRes.text();
        throw new Error(`FastAPI backend error: ${backendRes.status} ${errorText}`);
      }

      const backendData = await backendRes.json();
      refinedText = backendData.refinedPrompt;
      format = backendData.format;
    } catch (llmError: any) {
      console.error("LLM Generation Failed. Reverting tokens.", llmError);

      // Revert tokens using our new function
      await refundTokens(supabase, user.id, modelId, mode, '/api/parse');

      const isRateLimit = llmError?.message && (
        llmError.message.includes("exhausted") ||
        llmError.message.includes("high demand") ||
        llmError.message.includes("429") ||
        llmError.message.includes("503")
      );

      if (isRateLimit) {
        return NextResponse.json(
          { error: "Our servers are currently experiencing high demand. Please try again later." },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "We're sorry, we could not complete your request at the moment. Please try again later or contact support." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      refinedPrompt: refinedText,
      format: format,
      tokenResult
    });
  } catch (error: any) {
    console.error("LLM Parsing Router Error:", error);
    return NextResponse.json(
      { error: "We're sorry, we could not complete your request at the moment. Please try again later or contact support." },
      { status: 500 },
    );
  }
}
