import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionToken } from "@/app/lib/supabase-server";
import { consumeTokens, refundTokens } from "@/app/lib/tokenCosts";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    // Verify the user server-side — never trust the client's Authorization header
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { model, prompt, negativePrompt, aspectRatio } = body;

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Subject or prompt is required." },
        { status: 400 },
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

        const maxWH = 1024;
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

    // Consume tokens using the new function that queries public.token_costs with fallback
    const tokenResult = await consumeTokens(supabase, user.id, model, "image-generation", '/api/generate-image');

    if (!tokenResult.ok) {
      console.error("Token quota exceeded");
      return NextResponse.json(
        {
          error: "Token quota exceeded",
          remaining: tokenResult.remaining,
          resets_at: tokenResult.resets_at,
          limit: tokenResult.limit,
        },
        { status: 402 },
      );
    }

    // Retrieve the server-side session token to authenticate with FastAPI
    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine provider and model based on model slug
    let provider = "pollinations";
    let actualModel = "pollinations";
    if (model === "huggingface") {
      provider = "huggingface";
      actualModel = "black-forest-labs/FLUX.1-schnell";
    } else if (model === "gemini") {
      provider = "gemini";
      actualModel = "gemini-3.1-flash-lite-image";
    } else if (model === "stablediffusion") {
      provider = "huggingface";
      actualModel = "stabilityai/stable-diffusion-xl-base-1.0";
    }

    try {
      const backendRes = await fetch(`${BACKEND_URL}/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          model: actualModel,
          provider: provider,
          prompt: structuredPrompt,
          negativePrompt,
          aspectRatio,
        }),
      });

      if (!backendRes.ok) {
        const errorText = await backendRes.text();
        throw new Error(
          `FastAPI backend error: ${backendRes.status} ${errorText}`,
        );
      }

      const data = await backendRes.json();
      const url = data?.url;
      if (!url) {
        throw new Error("No image URL received from FastAPI backend");
      }
      const seed = data?.seed || Math.floor(Math.random() * 9999999);

      // Download/convert image to Buffer
      let buffer: Buffer;
      let contentType = "image/png";

      if (url.startsWith("data:")) {
        const matches = url.match(
          /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/,
        );
        if (!matches) {
          throw new Error("Invalid base64 data URI received from backend");
        }
        contentType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
      } else {
        const imgRes = await fetch(url);
        if (!imgRes.ok) {
          throw new Error(
            `Failed to download image from external provider: ${imgRes.statusText}`,
          );
        }
        const arrayBuffer = await imgRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        contentType = imgRes.headers.get("content-type") || "image/png";
      }

      // Determine file extension and file path
      const extMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      const fileExt = extMap[contentType] || "png";
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const filePath = `${user.id}/${timestamp}-${randomStr}.${fileExt}`;

      // Upload image buffer to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("prompt-targets")
        .upload(filePath, buffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(
          `Failed to upload image to Supabase Storage: ${uploadError.message}`,
        );
      }

      // Retrieve public URL of the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("prompt-targets").getPublicUrl(filePath);

      // Prepare JSONB structure for target column
      const targetJson: any = {
        output_type: "image",
        output: publicUrl,
      };

      if (negativePrompt && negativePrompt.trim() !== "") {
        targetJson.negative_prompt = negativePrompt;
      }
      if (aspectRatio && aspectRatio.trim() !== "") {
        targetJson.aspect_ratio = aspectRatio;
      }

      const promptTitle =
        prompt.length > 50 ? prompt.substring(0, 47) + "..." : prompt;
      const promptSnippet =
        prompt.length > 150 ? prompt.substring(0, 147) + "..." : prompt;

      // Insert metadata record into public.prompts table
      const { data: insertData, error: insertError } = await supabase
        .from("prompts")
        .insert({
          user_id: user.id,
          title: promptTitle,
          content: prompt, // Original prompt text TODO: refine this
          raw_input: prompt, // Original prompt text
          target_model: model,
          snippet: promptSnippet,
           format: "text",
           target: targetJson,
           mode: body.mode || "image",
         })
        .select()
        .single();

      if (insertError) {
        throw new Error(
          `Failed to insert prompt metadata into database: ${insertError.message}`,
        );
      }

      return NextResponse.json({
        url: publicUrl,
        width,
        height,
        seed,
        prompt,
        promptId: insertData?.id,
      });
    } catch (llmError: any) {
      console.error("LLM Generation Failed. Reverting tokens.", llmError);

      // Revert tokens using our new function
      await refundTokens(supabase, user.id, model, "image-generation", '/api/generate-image');

      return NextResponse.json(
        {
          error:
            "We ran into an error while generating your image.\nPlease try again later",
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Failed to generate image with error: ", error);
    return NextResponse.json(
      {
        error:
          "There seems to be an issue on our end.\nRest assured, we're already on it!",
      },
      { status: 500 },
    );
  }
}
