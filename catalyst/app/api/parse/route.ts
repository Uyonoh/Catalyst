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

    // Call token check RPC
    const { data: tokenResult, error: rpcError } = await supabase.rpc(
      "consume_tokens",
      { p_user_id: user.id, p_model: modelId, p_mode: mode }
    );

    if (rpcError) {
      console.error("Token consumption error:", rpcError);
      return NextResponse.json({ error: "Token check failed" }, { status: 500 });
    }

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
          model: modelId,
          controls,
          mode
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
      
      // Revert tokens using our RPC
      const { error: revertError } = await supabase.rpc('refund_tokens', {
        p_user_id: user.id,
        p_model: modelId,
        p_mode: mode
      });
      
      if (revertError) {
        console.error("Critical: Failed to revert tokens after LLM failure:", revertError);
      }

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
        { error: "Failed to parse intent with LLM" },
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
      { error: "Server Error" },
      { status: 500 },
    );
  }
}

