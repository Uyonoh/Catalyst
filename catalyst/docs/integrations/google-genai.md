# Google GenAI Integration

This document provides comprehensive documentation for the Google GenAI integration in Catalyst Workspace Studio, covering AI model access, prompt generation, and response handling.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Model Access](#model-access)
- [Prompt Generation](#prompt-generation)
- [Router Service](#router-service)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)
- [Supported Models](#supported-models)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Google GenAI** provides access to Google's state-of-the-art AI models through a unified API. Catalyst uses this integration for:

| Feature | Description | Models Used |
|---------|-------------|-------------|
| **Prompt Analysis** | Analyze and optimize user prompts | Claude, GPT-4, Gemini |
| **Prompt Parsing** | Full AI-powered prompt refinement | All models |
| **Content Generation** | Generate text, code, images | All models |
| **Multi-model Support** | Access various AI providers | 10+ models |

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    app/api/                             │  │
│  │  ┌─────────────┐  ┌─────────────┐                      │  │
│  │  │ /api/parse  │  │ /api/analyze│                      │  │
│  │  └──────┬──────┘  └──────┬──────┘                      │  │
│  └─────────┼─────────────────┼──────────────────────────────┘  │
└────────────┼─────────────────┼──────────────────────────────────┘
              │                 │
              ▼                 ▼
┌─────────────────────┐ ┌─────────────────────────────────┐
│   LLM Layer         │ │         Engine Layer             │
│   (app/lib/llm/)    │ │      (app/lib/engine/)          │
│                     │ │                                  │
│  ┌───────────────┐  │ │  ┌───────────────────────────┐  │
│  │ router.ts    │  │ │  │ AnalyzerService.ts        │  │
│  │ (model       │  │ │  │ (prompt analysis)          │  │
│  │  routing)     │  │ │  └───────────────────────────┘  │
│  └───────────────┘  │ │  ┌───────────────────────────┐  │
│                     │ │  │ CompilerService.ts         │  │
│  ┌───────────────┐  │ │  │ (prompt optimization)      │  │
│  │ providers/   │──┼─┼─►│                               │  │
│  │ (per-model  │  │ │  └───────────────────────────┘  │
│  │  configs)    │  │ │  ┌───────────────────────────┐  │
│  └───────────────┘  │ │  │ ParserService.ts          │  │
│                     │ │  │ (regex-based parsing)       │  │
│                     │ │  └───────────────────────────┘  │
│                     │ └─────────────────────────────────┘
└─────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google GenAI API                         │
├─────────────────────────────────────────────────────────────┤
│  Models: Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4, Llama 3    │
│  Endpoint: https://generativelanguage.googleapis.com        │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google GenAI API**
4. Navigate to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy the API key

### 2. Configure Environment

Add to your `.env.local`:

```bash
GOOGLE_GENAI_API_KEY=your_api_key_here
```

**Important:** Restrict your API key:
- Go to your API key details
- Under **Application restrictions**, select **HTTP referrers**
- Add your domains: `localhost:3000`, `your-production-domain.com`

### 3. Install SDK

```bash
pnpm add @google/generative-ai
```

---

## Model Access

### Supported Models

Catalyst supports multiple AI models through Google GenAI and other providers:

| Model | Provider | ID | Use Case |
|-------|----------|----|----------|
| **Gemini 1.5 Pro** | Google | `gemini-1.5-pro-latest` | General, complex tasks |
| **Claude 3.5 Sonnet** | Anthropic | `claude-3-5-sonnet` | Reasoning, analysis |
| **GPT-4o** | OpenAI | `gpt-4o` | General, creative |
| **GPT-4** | OpenAI | `gpt-4` | Complex reasoning |
| **Llama 3** | Meta | `llama3` | Open source alternative |
| **Grok 1** | xAI | `grok-1` | Real-time, conversational |
| **DALL-E 3** | OpenAI | `dalle-3` | Image generation |
| **Midjourney v6** | Midjourney | `midjourney-v6` | Image generation |
| **Stable Diffusion XL** | Stability AI | `stable-diffusion-xl` | Image generation |
| **Veo Video** | Google | `veo-video` | Video generation |

### Model Configuration

**TargetModel Enum:**

```typescript
// app/lib/engine/types.ts
export enum TargetModel {
  GEMINI_1_5_PRO = "gemini-1.5-pro-latest",
  CLAUDE_3_5_SONNET = "claude-3-5-sonnet",
  GPT_4O = "gpt-4o",
  GPT_4 = "gpt-4",
  LLAMA_3 = "llama3",
  GROK_1 = "grok-1",
  DALLE_3 = "dalle-3",
  MIDJOURNEY_V6 = "midjourney-v6",
  STABLE_DIFFUSION_XL = "stable-diffusion-xl",
  VEO_VIDEO = "veo-video",
}
```

**Model Mapping:**

```typescript
// app/lib/llm/router.ts
export function getModelConfig(model: TargetModel) {
  const configs = {
    [TargetModel.GEMINI_1_5_PRO]: {
      provider: "google",
      id: "gemini-1.5-pro-latest",
      maxTokens: 8192,
      temperature: 0.7,
    },
    [TargetModel.CLAUDE_3_5_SONNET]: {
      provider: "anthropic",
      id: "claude-3-5-sonnet-20241022",
      maxTokens: 4096,
      temperature: 0.7,
    },
    [TargetModel.GPT_4O]: {
      provider: "openai",
      id: "gpt-4o",
      maxTokens: 4096,
      temperature: 0.7,
    },
    // ... other models
  };
  
  return configs[model] || configs[TargetModel.GEMINI_1_5_PRO];
}
```

---

## Prompt Generation

### Router Service

The router service handles model selection and prompt generation.

**Location:** `app/lib/llm/router.ts`

```typescript
// app/lib/llm/router.ts
import { GoogleGenAI } from "@google/generative-ai";

// Initialize Google GenAI client
function getGoogleClient() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set");
  }
  return new GoogleGenAI(apiKey);
}

// Generate refined prompt using AI
export async function generateRefinedPrompt(prompt: string): Promise<string> {
  const client = getGoogleClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  
  const systemPrompt = `
    You are an AI assistant specializing in prompt optimization. 
    Your task is to take a user's raw intent and refine it into a well-structured, 
    detailed prompt that will produce the best possible output from an AI model.
    
    Guidelines:
    - Preserve the user's original intent
    - Add relevant details and context
    - Specify desired output format
    - Include examples if helpful
    - Use clear, unambiguous language
    - Optimize for quality and specificity
  `;

  const fullPrompt = `
    User's raw intent: ${prompt}
    
    Please refine this into an optimized prompt:
  `;

  const result = await model.generateContent([systemPrompt, fullPrompt]);
  const response = await result.response;
  
  return response.text();
}
```

### Fallback Mechanism

When Google GenAI API keys are not configured, Catalyst falls back to regex-based parsing:

```typescript
// app/api/parse/route.ts (excerpt)
const hasAnyKey = Object.keys(process.env).some(k => 
  k.startsWith("GEMINI_API_KEY") || 
  k.startsWith("GROQ_API_KEY") || 
  k.startsWith("OPENROUTER_API_KEY")
);

if (!hasAnyKey) {
  // Fallback for development
  console.warn("No LLM API keys are set. Returning mock response.");
  return NextResponse.json({
    refinedPrompt: `[MOCK REFINED PROMPT] ${text}\n\n` +
      "This is a placeholder refined prompt because no LLM API keys are configured. " +
      "Please add them to your .env file.",
    tokenResult,
  });
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `403 Forbidden` | Invalid or missing API key | Verify API key in environment |
| `404 Not Found` | Model not available | Use a different model |
| `429 Too Many Requests` | Rate limit exceeded | Implement retry with backoff |
| `500 Internal Server Error` | Server-side error | Check Google Cloud status |
| `503 Service Unavailable` | Service down | Retry later |

### Error Handling Code

```typescript
// app/lib/llm/router.ts
export async function generateRefinedPrompt(prompt: string): Promise<string> {
  try {
    const client = getGoogleClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    
    return response.text();
    
  } catch (error: any) {
    console.error("LLM Generation Error:", error);
    
    // Handle specific errors
    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      throw new Error("Invalid API key");
    }
    
    if (error.message.includes("429") || error.message.includes("rate limit")) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    
    if (error.message.includes("404") || error.message.includes("Not Found")) {
      throw new Error("Selected model is not available");
    }
    
    // Generic error
    throw new Error("Failed to generate prompt: " + error.message);
  }
}
```

### Retry Logic

```typescript
// Exponential backoff retry for rate limiting
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Don't retry for non-retryable errors
    if (error.message.includes("403") || error.message.includes("404")) {
      throw error;
    }
    
    if (retries <= 0) throw error;
    
    // Check if rate limited
    const isRateLimited = error.message.includes("429") ||
      error.message.includes("rate limit") ||
      error.message.includes("quota");
    
    const actualDelay = isRateLimited ? delay * 2 : delay;
    
    await new Promise(resolve => setTimeout(resolve, actualDelay));
    
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// Usage
const refinedPrompt = await withRetry(() => 
  generateRefinedPrompt(originalPrompt)
);
```

---

## Rate Limiting

### Google GenAI Limits

| Model | Tokens per Minute | Tokens per Day | Requests per Minute |
|-------|-------------------|----------------|---------------------|
| gemini-1.5-pro | 1,000,000 | 15,000,000 | 100 |
| gemini-1.5-flash | 1,500,000 | 50,000,000 | 100 |

### Catalyst Rate Limiting

Catalyst implements **token-based rate limiting** to prevent abuse:

```typescript
// app/lib/engine/tokenManager.ts
export class TokenManager {
  private static instance: TokenManager;
  private usage: Map<string, { count: number; lastReset: Date }> = new Map();
  
  private constructor() {}
  
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  public canUse(model: TargetModel, userId: string): boolean {
    const limit = this.getLimit(model);
    const key = `${userId}:${model}`;
    
    const current = this.usage.get(key) || { count: 0, lastReset: new Date() };
    
    // Reset if new day
    if (this.isNewDay(current.lastReset)) {
      current.count = 0;
      current.lastReset = new Date();
    }
    
    return current.count < limit;
  }
  
  public consume(model: TargetModel, userId: string): void {
    const key = `${userId}:${model}`;
    const current = this.usage.get(key) || { count: 0, lastReset: new Date() };
    
    if (this.isNewDay(current.lastReset)) {
      current.count = 0;
      current.lastReset = new Date();
    }
    
    current.count++;
    this.usage.set(key, current);
  }
  
  private getLimit(model: TargetModel): number {
    const limits: Record<TargetModel, number> = {
      [TargetModel.GEMINI_1_5_PRO]: 100,
      [TargetModel.CLAUDE_3_5_SONNET]: 80,
      [TargetModel.GPT_4O]: 60,
      [TargetModel.GPT_4]: 50,
      [TargetModel.LLAMA_3]: 100,
      [TargetModel.GROK_1]: 100,
      [TargetModel.DALLE_3]: 30,
      [TargetModel.MIDJOURNEY_V6]: 20,
      [TargetModel.STABLE_DIFFUSION_XL]: 40,
      [TargetModel.VEO_VIDEO]: 10,
    };
    return limits[model] || 100;
  }
  
  private isNewDay(date: Date): boolean {
    const now = new Date();
    return now.getDate() !== date.getDate() ||
      now.getMonth() !== date.getMonth() ||
      now.getFullYear() !== date.getFullYear();
  }
}
```

---

## Best Practices

### 1. Prompt Engineering

```typescript
// Use system prompts for better control
const systemPrompt = `
  You are a helpful AI assistant. 
  Follow these guidelines:
  - Be concise but thorough
  - Use clear, simple language
  - Provide examples when helpful
  - Always preserve the user's intent
`;

// Structure user prompts clearly
const userPrompt = `
  User Intent: ${userInput}
  
  Please refine this into an optimized prompt that will produce 
  the best possible output. Include:
  - Clear instructions
  - Context and details
  - Desired output format
  - Tone and style preferences
`;
```

### 2. Model Selection

```typescript
// Choose model based on task complexity
function selectModel(task: TaskType): TargetModel {
  switch (task) {
    case TaskType.CODE_GENERATION:
      return TargetModel.GPT_4O; // Best for code
    case TaskType.REASONING:
      return TargetModel.CLAUDE_3_5_SONNET; // Best for reasoning
    case TaskType.CREATIVE_WRITING:
      return TargetModel.GEMINI_1_5_PRO; // Best for creativity
    case TaskType.IMAGE_GENERATION:
      return TargetModel.DALLE_3; // Best for images
    default:
      return TargetModel.GEMINI_1_5_PRO; // Default
  }
}
```

### 3. Caching

```typescript
// Cache generated prompts
const promptCache = new Map<string, { prompt: string; timestamp: number }>();

async function getCachedOrGenerate(prompt: string, model: TargetModel): Promise<string> {
  const cacheKey = `${model}:${prompt}`;
  const cached = promptCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
    return cached.prompt;
  }
  
  const refinedPrompt = await generateRefinedPrompt(prompt, model);
  promptCache.set(cacheKey, { prompt: refinedPrompt, timestamp: Date.now() });
  
  return refinedPrompt;
}
```

### 4. Streaming Responses

```typescript
// Stream responses for better UX
async function streamResponse(prompt: string) {
  const client = getGoogleClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  
  const result = await model.generateContentStream([systemPrompt, prompt]);
  
  let fullResponse = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text;
    fullResponse += chunkText;
    // Send chunk to client
    process.stdout.write(chunkText);
  }
  
  return fullResponse;
}
```

---

## Supported Models

### Model Capabilities

| Model | Max Tokens | Temperature Range | Best For |
|-------|------------|-------------------|----------|
| gemini-1.5-pro | 8,192 | 0.0 - 1.0 | Complex reasoning, multi-turn |
| gemini-1.5-flash | 1,048,576 | 0.0 - 1.0 | High-volume, fast responses |
| claude-3-5-sonnet | 4,096 | 0.0 - 1.0 | Structured reasoning |
| gpt-4o | 4,096 | 0.0 - 2.0 | General purpose |
| gpt-4 | 8,192 | 0.0 - 2.0 | Complex tasks |
| llama3 | 8,192 | 0.0 - 1.0 | Open source |
| grok-1 | 4,096 | 0.0 - 1.0 | Real-time |
| dalle-3 | - | 0.0 - 1.0 | Image generation |
| midjourney-v6 | - | 0.0 - 1.0 | High-quality images |
| stable-diffusion-xl | - | 0.0 - 1.0 | Open source images |
| veo-video | - | 0.0 - 1.0 | Video generation |

### Model Configuration

```typescript
// app/lib/models-shared.ts
export interface ModelConfig {
  id: string;
  name: string;
  slug: string;
  provider: string;
  maxTokens: number;
  defaultTemperature: number;
  pricePerToken: number;
  isActive: boolean;
  icon?: string;
  color?: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "1",
    name: "Gemini 1.5 Pro",
    slug: "gemini",
    provider: "google",
    maxTokens: 8192,
    defaultTemperature: 0.7,
    pricePerToken: 0.00001,
    isActive: true,
    icon: "GeminiIcon",
    color: "cyan",
  },
  {
    id: "2",
    name: "Claude 3.5 Sonnet",
    slug: "claude",
    provider: "anthropic",
    maxTokens: 4096,
    defaultTemperature: 0.7,
    pricePerToken: 0.00002,
    isActive: true,
    icon: "ClaudeIcon",
    color: "purple",
  },
  // ... other models
];
```

---

## Troubleshooting

### Common Issues

#### 1. API Key Not Found

**Error:** `GOOGLE_GENAI_API_KEY is not set`

**Solution:**
- Verify `.env.local` has the API key
- Restart the development server
- Check the key is not in `.env` (which might be in `.gitignore`)

#### 2. Invalid API Key

**Error:** `403 Forbidden`

**Solution:**
- Verify the API key is correct
- Check for typos
- Regenerate the key if compromised
- Verify the key has the correct permissions

#### 3. Model Not Available

**Error:** `404 Not Found` or `Model not found`

**Solution:**
- Check the model ID is correct
- Verify the model is available in your region
- Use a different model as fallback
- Update the SDK

#### 4. Rate Limit Exceeded

**Error:** `429 Too Many Requests`

**Solution:**
- Implement retry with exponential backoff
- Add client-side caching
- Monitor usage and set up alerts
- Consider upgrading your plan

#### 5. Network Errors

**Error:** `Fetch failed` or `Network error`

**Solution:**
- Check internet connectivity
- Verify Google GenAI API is operational
- Check for firewall/proxy issues
- Try from a different network

### Debugging Tools

**Logging:**
```typescript
// Enable debug logging
import debug from 'debug';
const log = debug('catalyst:llm');

// Log model requests
log('Generating prompt with model:', { model, promptLength: prompt.length });

// Run with debug
DEBUG=catalyst:llm pnpm dev
```

**Testing with cURL:**
```bash
# Test Google GenAI directly
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "Hello"}]}]
  }'
```

---

## See Also

- [Integrations Overview](./index.md)
- [Supabase Integration](supabase.md)
- [Paystack Integration](paystack.md)
- [API Reference](../api/index.md)
- [Engine Module](../features/analysis.md)
