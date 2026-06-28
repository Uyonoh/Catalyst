import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/app/lib/prompts/builder";
import { createClient } from "@/app/lib/supabase-server";
import { generateRefinedPrompt } from "@/app/lib/llm/router";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, model: modelId, controls, mode = "text" } = await req.json();

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

    const hasAnyKey = Object.keys(process.env).some(k => 
      k.startsWith("GEMINI_API_KEY") || k.startsWith("GROQ_API_KEY") || k.startsWith("OPENROUTER_API_KEY")
    );

    if (!hasAnyKey) {
        // Fallback for development if API key is missing
        console.warn("No LLM API keys are set. Returning mock response.");
        return NextResponse.json({
            refinedPrompt: `[MOCK REFINED PROMPT] ${text}\n\nThis is a placeholder refined prompt because no LLM API keys (GEMINI, GROQ, OPENROUTER) are configured. Please add them to your .env file.`,
            tokenResult
        });
    }

    const prompt = buildPrompt({ text, model: modelId, controls, mode });
    
    const format = controls?.outputFormat || "text";
    let refinedText = "";
    try {
      refinedText = await generateRefinedPrompt(prompt);
    } catch (llmError: any) {
      console.error("LLM Generation Failed. Reverting tokens.", llmError);
      
      // Revert tokens using our new RPC
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
        llmError.message.includes("429")
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

    let cleanedText = refinedText.trim();
    
    // Clean up code block wraps if LLM wrapper them (e.g., ```json ... ``` or ``` ... ```)
    const codeBlockRegex = /^```(?:[a-zA-Z0-9_\-+]+)?\n([\s\S]*?)\n```$/;
    const match = cleanedText.match(codeBlockRegex);
    if (match) {
      cleanedText = match[1].trim();
    } else {
      // Also catch cases where the markdown backticks don't have leading/trailing newlines or are using single quotes (as user reported: '''markdown ...''')
      cleanedText = cleanedText
        .replace(/^```[a-zA-Z0-9_\-+]*\s*/g, "")
        .replace(/\s*```$/g, "")
        .replace(/^'''[a-zA-Z0-9_\-+]*\s*/g, "")
        .replace(/\s*'''$/g, "");
    }

    return NextResponse.json({ 
      refinedPrompt: cleanedText, 
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
