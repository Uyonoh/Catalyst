import { NextRequest, NextResponse } from "next/server";
import { createClient, getSessionToken } from "@/app/lib/supabase-server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      promptId,
      prompt,
      model: modelId,
      mode = "text",
      negativePrompt,
      aspectRatio,
    } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt content is required" },
        { status: 400 },
      );
    }

    if (!modelId || typeof modelId !== "string") {
      return NextResponse.json(
        { error: "Target model is required" },
        { status: 400 },
      );
    }

    const accessToken = await getSessionToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ─── Image Generation Flow ────────────────────────────────────────────────
    if (mode === "image") {
      const { data: tokenResult, error: rpcError } = await supabase.rpc(
        "consume_image_tokens",
        { p_user_id: user.id, p_model: modelId, p_mode: "image-generation" },
      );

      if (rpcError) {
        console.error("Token consumption error:", rpcError);
        return NextResponse.json(
          { error: "Token check failed" },
          { status: 500 },
        );
      }

      if (!tokenResult.ok) {
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

      try {
        const calculateWidthHeight = (aspectRatioStr?: string) => {
          if (!aspectRatioStr) return [512, 512];
          const wh = aspectRatioStr.trim().split(":");
          if (wh.length !== 2) return [512, 512];

          const ax = parseInt(wh[0]);
          const ay = parseInt(wh[1]);
          if (isNaN(ax) || isNaN(ay)) return [512, 512];

          const maxWH = 1024;
          let multiplier = ax > ay ? maxWH / ax : maxWH / ay;

          const width = multiplier * ax;
          const height = multiplier * ay;
          const baseLCF = 32;
          const wRem = width % baseLCF;
          const hRem = height % baseLCF;
          return [width - wRem, height - hRem];
        };

        const [width, height] = calculateWidthHeight(aspectRatio);
        const structuredPrompt = negativePrompt
          ? `${prompt}. Avoid these concepts: ${negativePrompt}. The output AspectRatio should be ${aspectRatio || "1:1"}`
          : prompt;

        const backendRes = await fetch(`${BACKEND_URL}/generate-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            model: modelId,
            prompt: structuredPrompt,
            negativePrompt: negativePrompt || "",
            aspectRatio: aspectRatio || "1:1",
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
          throw new Error("No image URL received from backend");
        }

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
            throw new Error(`Failed to download image: ${imgRes.statusText}`);
          }
          const arrayBuffer = await imgRes.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
          contentType = imgRes.headers.get("content-type") || "image/png";
        }

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

        const { error: uploadError } = await supabase.storage
          .from("prompt-targets")
          .upload(filePath, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("prompt-targets").getPublicUrl(filePath);

        const targetJson: any = {
          output_type: "image",
          output: publicUrl,
        };
        if (negativePrompt) targetJson.negative_prompt = negativePrompt;
        if (aspectRatio) targetJson.aspect_ratio = aspectRatio;

        if (promptId) {
          const { error: updateError } = await supabase
            .from("prompts")
            .update({ target: targetJson })
            .eq("id", promptId);

          if (updateError) {
            console.error("Failed to update prompt target:", updateError);
          }
        }

        return NextResponse.json({
          target: targetJson,
          tokenResult,
        });
      } catch (llmError: any) {
        console.error("Image generation failed, reverting tokens:", llmError);
        await supabase.rpc("refund_image_tokens", {
          p_user_id: user.id,
          p_model: modelId,
          p_mode: "image-generation",
        });

        return NextResponse.json(
          {
            error:
              llmError?.message ||
              "We ran into an error while generating your image. Please try again later.",
          },
          { status: 500 },
        );
      }
    }

    // ─── Text / Code / Other Generation Flow ──────────────────────────────────
    const { data: tokenResult, error: rpcError } = await supabase.rpc(
      "consume_tokens",
      { p_user_id: user.id, p_model: modelId, p_mode: mode },
    );

    if (rpcError) {
      console.error("Token consumption error:", rpcError);
      return NextResponse.json(
        { error: "Token check failed" },
        { status: 500 },
      );
    }

    if (!tokenResult.ok) {
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

    try {
      const backendRes = await fetch(`${BACKEND_URL}/generate-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: prompt,
          model: modelId,
          mode: mode,
          controls: {
            outputFormat: "text",
            creativity: 0.7,
            precision: 0.7,
            length: "medium",
          },
          buildPrompt: false,
        }),
      });

      if (!backendRes.ok) {
        const errorText = await backendRes.text();
        throw new Error(
          `FastAPI backend error: ${backendRes.status} ${errorText}`,
        );
      }

      const backendData = await backendRes.json();
      const outputText = backendData.refinedPrompt || "";

      const targetJson = {
        output_type: mode || "text",
        output: outputText,
      };

      if (promptId) {
        const { error: updateError } = await supabase
          .from("prompts")
          .update({ target: targetJson })
          .eq("id", promptId);

        if (updateError) {
          console.error("Failed to update prompt target:", updateError);
        }
      }

      return NextResponse.json({
        target: targetJson,
        tokenResult,
      });
    } catch (llmError: any) {
      console.error("Text generation failed, reverting tokens:", llmError);
      await supabase.rpc("refund_tokens", {
        p_user_id: user.id,
        p_model: modelId,
        p_mode: mode,
      });

      return NextResponse.json(
        {
          error:
            llmError?.message ||
            "We ran into an error while generating your output. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in generate-output API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
