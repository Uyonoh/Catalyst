import { NextResponse } from "next/server";
import { ALL_PROVIDERS } from "./providers";
import { IMAGE_PROVIDERS } from "./image_providers";
import type { ImageResponse } from "./image_providers";

// Helper to shuffle an array (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Tries to generate a refined prompt across all available LLM providers.
 * If a provider hits a rate limit, it falls back to the next key or provider.
 */
export async function generateRefinedPrompt(prompt: string): Promise<string> {
  const ObjectProviders = ALL_PROVIDERS;

  for (const provider of ObjectProviders) {
    const keys = provider.keys;
    
    if (!keys || keys.length === 0) {
      continue;
    }

    const shuffledKeys = shuffle(keys);

    for (const key of shuffledKeys) {
      try {
        console.log(`Trying provider [${provider.id}] with key ending in '...${key.substring(key.length - 4)}'`);
        const result = await provider.call(prompt, key);
        return result;
      } catch (err: any) {
        if (provider.isRateLimitError(err)) {
          console.warn(`Provider [${provider.id}] key hit rate limit, falling back...`);
          continue; // Try next key in this provider, or move to next provider
        } else {
          // If it's a structural error (e.g., bad model, invalid format), we still want to fallback 
          // or fail. If we fail, it stops everything. We fallback for maximum resilience.
          console.error(`Provider [${provider.id}] failed with non-rate-limit error:`, err);
          continue;
        }
      }
    }
  }

  throw new Error("All LLM providers exhausted. Our servers are currently experiencing high demand. Please try again later.");
}



export async function generateImage(prompt: string): Promise<NextResponse<ImageResponse>> {
  const ObjectProviders = IMAGE_PROVIDERS;

  for (const provider of ObjectProviders) {
    const keys = provider.keys;
    
    if (!keys || keys.length === 0) {
      continue;
    }

    const shuffledKeys = shuffle(keys);

    for (const key of shuffledKeys) {
      try {
        console.log(`Trying provider [${provider.id}] with key ending in '...${key.substring(key.length - 4)}'`);
        const result = await provider.call(prompt, key);
        return result;
      } catch (err: any) {
        if (provider.isRateLimitError(err)) {
          console.warn(`Provider [${provider.id}] key hit rate limit, falling back...`);
          continue; // Try next key in this provider, or move to next provider
        } else {
          // If it's a structural error (e.g., bad model, invalid format), we still want to fallback 
          // or fail. If we fail, it stops everything. We fallback for maximum resilience.
          console.error(`Provider [${provider.id}] failed with non-rate-limit error:`, err);
          continue;
        }
      }
    }
  }

  throw new Error("All LLM providers exhausted. Our servers are currently experiencing high demand. Please try again later.");
}
