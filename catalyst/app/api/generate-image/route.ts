import { NextResponse } from "next/server";
import { generateImage } from "../../lib/llm/router";
import type { ModelParameters } from "../../lib/llm/image_providers";

export async function POST(request: Request) {
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
        // Ar: Aspect ratio
        // LCF: Lowest Common Factor, all width and height must be multiples of this, else the model might encounter errors
        const wRem = AR[0] % LCF;
        const hRem = AR[1] % LCF;

        const width = AR[0] - wRem;
        const height = AR[1] - hRem;

        return [width, height];
      };

      if (wh.length != 2) {
        return [512, 512]; // Defuault to 512x512 if aspect Ratio is invalid
      } else {
        const ax = parseInt(wh[0]);
        const ay = parseInt(wh[1]);

        // Convert all ARs to 16/y or x/16 and multiply by 64 to get W and H
        // Equivalent to setting AR to 1024/y and x/1024
        const maxWH = 128;
        let multiplier = 64;

        if (ax > ay) { // landscape
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
    const parameters: ModelParameters = {
      aspectRatio: aspectRatio,
      width: calculateWidthHeight(aspectRatio)[0],
      height: calculateWidthHeight(aspectRatio)[1],
      negativePrompt: negativePrompt,
    };
    const response = await generateImage(model, structuredPrompt, parameters); // provider, prompt, params
    const data = await response.json();

    // Determine dimensions based on aspect ratio
    let [width, height] = calculateWidthHeight(aspectRatio);

    const seed = Math.floor(Math.random() * 9999999);
    
    // Using a reliable public mockup/unsplash source with query to vary it slightly
    // const url = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=${width}&h=${height}&q=80&sig=${seed}`;

    const url = data?.imageUrl;

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
