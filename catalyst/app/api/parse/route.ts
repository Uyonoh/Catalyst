import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `You are an expert prompt engineer. 
Your task is to take a "Raw Intent" from a user and transform it into a highly effective, structured, and refined prompt.

Rules:
1. Maintain the core essence of the original intent.
2. Structure the output clearly (e.g., Role, Task, Context, Constraints, Format).
3. Use professional, clear language.
4. Output ONLY the refined prompt text. Do not include any introductory or concluding remarks.
5. If the intent is complex, use techniques like Chain-of-Thought or step-by-step instructions.

Example:
Raw: "make a website for a coffee shop"
Refined: "Design a modern, minimalist website for a boutique coffee shop. Include sections for a menu with 'single-origin' categories, a history section about 'farm-to-cup' sourcing, and a booking system for coffee tasting events. The aesthetic should be cozy but professional, using earthy tones and high-quality photography."`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Raw intent text is required" },
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

    const prompt = `${SYSTEM_PROMPT}\n\nRaw Intent: "${text}"\nRefined Prompt:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const refinedText = response.text();

    return NextResponse.json({ refinedPrompt: refinedText.trim() });
  } catch (error: any) {
    console.error("LLM Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to parse intent with LLM" },
      { status: 500 },
    );
  }
}
