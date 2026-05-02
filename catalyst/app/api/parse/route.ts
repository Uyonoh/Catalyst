import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt } from "@/app/lib/prompts/builder";
import { createClient } from "@/app/lib/supabase-server";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
        error: "Daily quota exceeded",
        remaining: tokenResult.remaining,
        resets_at: tokenResult.resets_at,
        limit: tokenResult.limit,
      }, { status: 402 });
    }

    if (!process.env.GEMINI_API_KEY) {
        // Fallback for development if API key is missing
        console.warn("GEMINI_API_KEY is not set. Returning mock response.");
        return NextResponse.json({
            refinedPrompt: `[MOCK REFINED PROMPT] ${text}\n\nThis is a placeholder refined prompt because the GEMINI_API_KEY environment variable is not configured. Please add it to your .env file to enable real LLM parsing.`,
            tokenResult
        });
    }

    const prompt = buildPrompt({ text, model: modelId, controls, mode });
    
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
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

      // Existing error response parsing
      try {
        const message = JSON.parse(llmError.message);
        const err1 = "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.";
        const err2 = "You exceeded your current quota";

        if (message.error.message.includes(err1) || message.error.message.includes(err2)) {
          return NextResponse.json(
            { error: "Our servers are currently experiencing high demand. Please try again later." },
            { status: 503 },
          );
        }
      } catch (err) {
        console.error("Parsing error: ", llmError.message);
      }
      return NextResponse.json(
        { error: "Failed to parse intent with LLM" },
        { status: 500 },
      );
    }
    
    const refinedText = response.text || "";

    return NextResponse.json({ refinedPrompt: refinedText.trim(), tokenResult });
  } catch (error: any) {
    console.error("LLM Parsing Router Error:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 },
    );
  }
}
