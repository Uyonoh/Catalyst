import { NextRequest, NextResponse } from "next/server";
import { RegexParser } from "@/app/lib/parsing/strategies/RegexParser";
import { AnalyzerService } from "@/app/lib/engine/AnalyzerService";
import { CompilerService } from "@/app/lib/engine/CompilerService";
import { TargetModel } from "@/app/lib/engine/types";

const parser = new RegexParser();
const analyzerService = new AnalyzerService();
const compilerService = new CompilerService();

export async function POST(req: NextRequest) {
  try {
    const { text, model } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required" },
        { status: 400 },
      );
    }

    let targetModel = TargetModel.CLAUDE_3_5_SONNET;
    if (model === "gpt") {
      targetModel = TargetModel.GPT_4O;
    } else if (model === "claude") {
      targetModel = TargetModel.CLAUDE_3_5_SONNET;
    } else if (model === "gemini") {
      targetModel = TargetModel.GEMINI_1_5_PRO;
    } else if (model === "llama") {
      targetModel = TargetModel.LLAMA_3;
    } else if (model === "grok") {
      targetModel = TargetModel.GROK_1;
    } else if (model === "dalle") {
      targetModel = TargetModel.DALLE_3;
    } else if (model === "stablediffusion") {
      targetModel = TargetModel.STABLE_DIFFUSION_XL;
    } else if (model === "midjourney") {
      targetModel = TargetModel.MIDJOURNEY_V6;
    } else if (model === "veo") {
      targetModel = TargetModel.VEO_VIDEO;
    }

    // For Phase 1, we use the fast RegexParser
    const result = parser.analyze(text);
    const deconstructed = analyzerService.analyze(text);
    const optimized = compilerService.compile(deconstructed, targetModel);

    return NextResponse.json(optimized);
  } catch (error) {
    console.error("Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze prompt" },
      { status: 500 },
    );
  }
}
