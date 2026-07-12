import { NextResponse } from "next/server";
import { generateImage } from "../../lib/llm/router";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, negativePrompt, aspectRatio } = body;

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Subject or prompt is required." },
        { status: 400 }
      );
    }

    const structuredPrompt = `${prompt}. Avoid these concepts: ${negativePrompt}. The output AspectRatio should be ${aspectRatio}`;
    const response = await generateImage(structuredPrompt);
    const data = await response.json();

    // Determine dimensions based on aspect ratio
    let width = 512;
    let height = 512;
    if (aspectRatio === "16:9") {
      width = 896;
      height = 504;
    } else if (aspectRatio === "9:16") {
      width = 504;
      height = 896;
    } else if (aspectRatio === "4:3") {
      width = 768;
      height = 576;
    } else if (aspectRatio === "3:2") {
      width = 768;
      height = 512;
    } else if (aspectRatio === "2:3") {
      width = 512;
      height = 768;
    } else if (aspectRatio === "21:9") {
      width = 1008;
      height = 432;
    }

    const seed = Math.floor(Math.random() * 9999999);
    
    // Using a reliable public mockup/unsplash source with query to vary it slightly
    // const url = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=${width}&h=${height}&q=80&sig=${seed}`;

    const url = data?.imageUrl;
    console.log("URL: ", data?.imageUrl);

    return NextResponse.json({
      url,
      width,
      height,
      seed,
      prompt
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate image." },
      { status: 500 }
    );
  }
}
