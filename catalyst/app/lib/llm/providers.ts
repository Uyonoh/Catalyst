import { GoogleGenAI } from "@google/genai";

export interface LLMProvider {
  id: string;
  keys: string[];
  call(prompt: string, key: string): Promise<string>;
  isRateLimitError(err: any): boolean;
}

function getEnvKeys(prefix: string): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith(prefix) && v) {
      keys.push(v);
    }
  }
  return [...new Set(keys)]; // Deduplicate keys
}

export const geminiProvider: LLMProvider = {
  id: "gemini",
  get keys() { return getEnvKeys("GEMINI_API_KEY"); },
  async call(prompt: string, key: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "";
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

export const groqProvider: LLMProvider = {
  id: "groq",
  get keys() { return getEnvKeys("GROQ_API_KEY"); },
  async call(prompt: string, key: string): Promise<string> {
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

export const openRouterProvider: LLMProvider = {
  id: "openrouter",
  get keys() { return getEnvKeys("OPENROUTER_API_KEY"); },
  async call(prompt: string, key: string): Promise<string> {
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

export const ALL_PROVIDERS = [geminiProvider, groqProvider, openRouterProvider];
