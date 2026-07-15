import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

export interface ModelParameters {
  model?: string;
  width?: number;
  height?: number;
  size?: string;
  aspectRatio?: number;
  numImages?: number;
  negativePrompt?: string;
  numInferenceSteps?: number;
  cfgScale?: number; // Classifier free guidance. Higher value to adhere strictly to prompts
  temperature?: number;
  initImage?: string; // Reference image for image-image generations
  mask?: string; // Mask for reference image: the parts to be edited
  denoisingStrength?: number; // 0.0 - 1.0, controls how much the original image is changed
  seed?: number; // set seed for reproducability
};

export interface ImageLLMProvider {
  id: string;
  keys: string[];
  call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>>;
  isRateLimitError(err: any): boolean;
};

export interface ImageResponse {
  imageUrl?: string;
  error?: string;
};

function getEnvKeys(prefix: string): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith(prefix) && v) {
      keys.push(v);
    }
  }
  return [...new Set(keys)]; // Deduplicate keys
}

export const geminiProvider: ImageLLMProvider = {
  id: "gemini",
  get keys() { return getEnvKeys("GEMINI_API_KEY"); },
  async call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>> {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );
    const base64Image = imagePart?.inlineData?.data;

    if (!base64Image) {
      return NextResponse.json(
        { error: "Model did not return valid inline image data" },
        { status: 500 }
      );
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');
    const fileName = `${Date.now()}.jpg`;

    return NextResponse.json(
      { imageUrl: `data:image/jpeg;base64,${base64Image}` },
      { status: 201 }
    );
  },
  isRateLimitError(err: any): boolean {
    if (!err || !err.message) return false;
    try {
      const message = JSON.parse(err.message);
      const err1 = "This model is currently experiencing high demand";
      const err2 = "You exceeded your current quota";
      return (
        message?.error?.message?.includes(err1) ||
        message?.error?.message?.includes(err2) ||
        err.message.includes("429")
      );
    } catch {
      return (
        err.message.includes("429") ||
        err.message.includes("Quota") ||
        err.message.includes("high demand")
      );
    }
  },
};

export const pollinationsProvider: ImageLLMProvider = {
  id: "pollinations",
  get keys() { return ["Dummy Key"] },
  async call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>> {

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/p/${encodedPrompt}?enhance=true`;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Model did not return valid image url" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { imageUrl: imageUrl },
      { status: 201 }
    );
  },
  isRateLimitError(err: any): boolean {
    return err?.message?.includes("429");
  },
};

export const huggingfaceProvider: ImageLLMProvider = {
  id: "huggingface",
  get keys() { return getEnvKeys("HF_TOKEN") },
  async call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>> {

    const hf = new InferenceClient(key);
    const responseBlob = await hf.textToImage(
      {
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: prompt,
        // parameters: {},
      },
      {
        outputType: "blob"
      }
    );

    // Convert raw binary Blob into Node.js Buffer
    const arrayBuffer = await responseBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Format buffer as a base64 string that the img tag can read natively
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    if (!base64Image) {
      return NextResponse.json(
        { error: "Model did not return valid image data" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { imageUrl: imageUrl },
      { status: 201 }
    );
  },
  isRateLimitError(err: any): boolean {
    return err?.message?.includes("429");
  },
};

export const groqProvider: ImageLLMProvider = {
  id: "groq",
  get keys() { return getEnvKeys("GROQ_API_KEY"); },
  async call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>> {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("429 Rate Limit");
      const text = await res.text();
      throw new Error(`Groq API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  },
  isRateLimitError(err: any): boolean {
    return err?.message?.includes("429");
  },
};

export const openRouterProvider: ImageLLMProvider = {
  id: "openrouter",
  get keys() { return getEnvKeys("OPENROUTER_API_KEY"); },
  async call(prompt: string, key: string, parameters: ModelParameters | null): Promise<NextResponse<ImageResponse>> {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Catalyst",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      // 402 is "Payment Required" but on OpenRouter it means free tier/credits might be exhausted
      if (res.status === 429 || res.status === 402) throw new Error("429 Rate Limit");
      const text = await res.text();
      throw new Error(`OpenRouter API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  },
  isRateLimitError(err: any): boolean {
    return err?.message?.includes("429");
  },
};

export const IMAGE_PROVIDERS = [huggingfaceProvider, geminiProvider, pollinationsProvider];
