import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, prompt, negativePrompt, aspectRatio } = body;

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Subject or prompt is required." },
        { status: 400 }
      );
    }

    const calculateWidthHeight = (aspectRatio: string) => {
      const wh = aspectRatio.trim().split(":");

      const validateAR = (AR: number[], LCF: number): number[] => {
        const wRem = AR[0] % LCF;
        const hRem = AR[1] % LCF;

        const width = AR[0] - wRem;
        const height = AR[1] - hRem;

        return [width, height];
      };

      if (wh.length != 2) {
        return [512, 512];
      } else {
        const ax = parseInt(wh[0]);
        const ay = parseInt(wh[1]);

        const maxWH = 128;
        let multiplier = 64;

        if (ax > ay) {
          multiplier = maxWH / ax;
        } else {
          multiplier = maxWH / ay;
        }

        const width = multiplier * ax;
        const height = multiplier * ay;

        const baseLCF = 32;
        return validateAR([width, height], baseLCF);
      }
    };

    const structuredPrompt = `${prompt}. Avoid these concepts: ${negativePrompt}. The output AspectRatio should be ${aspectRatio}`;
    
    // Compute dimensions to forward or use locally
    let [width, height] = calculateWidthHeight(aspectRatio);

    const authHeader = request.headers.get("Authorization") || "";

    const backendRes = await fetch(`${BACKEND_URL}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        model,
        prompt: structuredPrompt,
        negativePrompt,
        aspectRatio
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      throw new Error(`FastAPI backend error: ${backendRes.status} ${errorText}`);
    }

    const data = await backendRes.json();
    const url = data?.url;
    const seed = data?.seed || Math.floor(Math.random() * 9999999);

    return NextResponse.json({
      url,
      width,
      height,
      seed,
      prompt
    });
  } catch (error: any) {
    console.error("Failed to generate image with error: ", error);
    return NextResponse.json(
      { error: "We ran into an error while generating your image.\nPlease try again later" },
      { status: 500 }
    );
  }
}

