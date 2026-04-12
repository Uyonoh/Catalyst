import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt } from "@/app/lib/prompts/builder";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { text, model: modelId, controls } = await req.json();

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

    if (!process.env.GEMINI_API_KEY) {
        // Fallback for development if API key is missing
        console.warn("GEMINI_API_KEY is not set. Returning mock response.");
        return NextResponse.json({
            refinedPrompt: `[MOCK REFINED PROMPT] ${text}\n\nThis is a placeholder refined prompt because the GEMINI_API_KEY environment variable is not configured. Please add it to your .env file to enable real LLM parsing.`
        });
    }

    const prompt = buildPrompt({ text, model: modelId, controls });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const refinedText = response.text || "";

    return NextResponse.json({ refinedPrompt: refinedText.trim() });
  } catch (error: any) {
    console.error("LLM Parsing Error:", error);
    // error.message is a string: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}
    // Need to index the actual message in that sting.
    const message = JSON.parse(error.message);

    const err1 = "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.";
    const err2 = "You exceeded your current quota";

    if (message.error.message.includes(err1) || message.error.message.includes(err2)) {
        return NextResponse.json(
          { error: "Our servers are currently experiencing high demand. Please try again later." },
          { status: 503 },
        );
      }
    // else if (message.error.message.includes(err2)) {
    //     return NextResponse.json(
    //       { error: "You exceeded your current quota" },
    //       { status: 429 },
    //     );
    //   }

    return NextResponse.json(
      { error: "Failed to parse intent with LLM" },
      { status: 500 },
    );
  }
}
