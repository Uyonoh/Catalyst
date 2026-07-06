# Analysis Engine

The **Analysis Engine** is the core AI-powered system that deconstructs, understands, and optimizes user prompts. It powers the intelligent features across Catalyst, providing real-time analysis and model-specific optimizations.

## Overview

The Analysis Engine consists of three main components:

1. **Parser** - Deconstructs raw input into structured data
2. **Analyzer** - Detects intents, domains, and optimizes content
3. **Compiler** - Formats optimized prompts for target models

## Architecture

```
app/lib/engine/
├── AnalyzerService.ts      # Main analysis logic
├── CompilerService.ts      # Prompt compilation
├── types.ts                # Core type definitions
└── detectors/
    └── types.ts            # Detection-specific types

app/lib/parsing/
├── strategies/
│   └── RegexParser.ts      # Fast pattern-based parsing
├── types.ts                # Parsing type definitions
└── ...
```

## Core Components

### 1. Input Modalities

The system supports multiple input types, defined in `InputModality` enum:

```typescript
// app/lib/engine/types.ts
export enum InputModality {
  TEXT = "TEXT",           // Text-based prompts
  IMAGE = "IMAGE",         // Image generation/analysis
  VIDEO = "VIDEO",         // Video generation/analysis  
  AUDIO = "AUDIO",         // Audio processing
  CODE = "CODE",           // Code generation/analysis
  GEOSPATIAL = "GEOSPATIAL" // GIS/Spatial data analysis
}
```

### 2. Target Models

Supported AI models for optimization:

```typescript
// app/lib/engine/types.ts
export enum TargetModel {
  // Text Models
  GPT_4O = "GPT_4O",
  CLAUDE_3_5_SONNET = "CLAUDE_3_5_SONNET",
  GEMINI_1_5_PRO = "GEMINI_1_5_PRO",
  LLAMA_3 = "LLAMA_3",
  GROK_1 = "GROK_1",
  
  // Image Models
  DALLE_3 = "DALLE_3",
  STABLE_DIFFUSION_XL = "STABLE_DIFFUSION_XL",
  MIDJOURNEY_V6 = "MIDJOURNEY_V6",
  
  // Video Models
  VEO_VIDEO = "VEO_VIDEO"
}
```

### 3. Domain Classification

The system categorizes prompts by domain:

```typescript
// app/lib/engine/types.ts
export enum Domain {
  TECHNICAL_BACKEND = "TECHNICAL_BACKEND",
  TECHNICAL_FRONTEND = "TECHNICAL_FRONTEND",
  TECHNICAL_GIS = "TECHNICAL_GIS",
  TECHNICAL_DEVOPS = "TECHNICAL_DEVOPS",
  CREATIVE_MOTION = "CREATIVE_MOTION",
  CREATIVE_COPY = "CREATIVE_COPY",
  CREATIVE_VISUAL = "CREATIVE_VISUAL",
  BUSINESS_STRATEGY = "BUSINESS_STRATEGY",
  GENERAL = "GENERAL"
}
```

### 4. Intent Detection

The system identifies user intents from prompts:

```typescript
// app/lib/engine/types.ts
export enum Intent {
  // Technical Intents
  DEBUG = "DEBUG",
  REFACTOR = "REFACTOR", 
  ARCHITECT = "ARCHITECT",
  SPATIAL_ANALYSIS = "SPATIAL_ANALYSIS",
  DOCUMENT = "DOCUMENT",
  
  // Creative Intents
  STORYBOARD = "STORYBOARD",
  COLOR_GRADE = "COLOR_GRADE",
  COMPOSITION = "COMPOSITION",
  SCRIPTWRITING = "SCRIPTWRITING",
  STYLE_TRANSFER = "STYLE_TRANSFER",
  
  // General Intents
  SUMMARIZE = "SUMMARIZE",
  EXPAND = "EXPAND",
  BRAINSTORM = "BRAINSTORM",
  GENERAL_TASK = "GENERAL_TASK"
}
```

## Data Structures

### Asset

Represents input assets (images, documents, etc.):

```typescript
interface Asset {
  id: string;
  type: InputModality;
  uri: string;                    // Remote URL or Local Path
  mimeType: string;
  description?: string;           // User-provided context
  metadata?: Record<string, any>; // EXIF, Resolution, Duration, etc.
}
```

### Prompt Constraints

Configurable parameters for prompt optimization:

```typescript
interface PromptConstraints {
  tone: "PROFESSIONAL" | "CONCISE" | "CREATIVE" | "ACADEMIC" | "ELI5";
  outputFormat: "MARKDOWN" | "JSON" | "CSV" | "YAML" | "PLAIN_TEXT";
  maxTokens?: number;
  temperature?: number;           // 0.0 to 1.0
  negativeConstraints?: string[]; // e.g. ["no code", "no intro"]
}
```

### Deconstructed Prompt

The result of parsing and analysis:

```typescript
interface DeconstructedPrompt {
  originalInput: string;
  detectedDomain: Domain;
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  confidenceScore: number;       // 0.0 to 1.0
  assets: Asset[];
  constraints: PromptConstraints;
  variables: Record<string, string>; // Extracted placeholders like {{api_key}}
  persona?: string;               // e.g. "Senior React Developer"
  style?: string;                 // e.g. "Step-by-step", "Chain of thought"
}
```

### Optimized Prompt

The final compiled output:

```typescript
interface OptimizedPrompt {
  model: TargetModel;
  formattedPrompt: string | object; // Object for multimodal parts (Gemini style)
  systemInstruction?: string;
  metadata: Partial<DeconstructedPrompt>;
}
```

## Processing Pipeline

### 1. Parsing Phase

The `RegexParser` provides fast, pattern-based parsing for Phase 1:

```typescript
// app/lib/parsing/strategies/RegexParser.ts
class RegexParser {
  analyze(text: string): DeconstructedPrompt {
    // Fast regex-based parsing
    const domain = this.detectDomain(text);
    const intent = this.detectIntent(text);
    const constraints = this.extractConstraints(text);
    
    return {
      originalInput: text,
      detectedDomain: domain,
      primaryIntent: intent,
      secondaryIntents: [],
      confidenceScore: this.calculateConfidence(text, intent, domain),
      assets: [],
      constraints,
      variables: {},
      persona: undefined,
      style: undefined
    };
  }
}
```

### 2. Analysis Phase

The `AnalyzerService` provides deeper analysis:

```typescript
// app/lib/engine/AnalyzerService.ts
class AnalyzerService {
  analyze(text: string): DeconstructedPrompt {
    // Enhanced analysis with AI assistance
    const parsed = this.parser.analyze(text);
    
    // Additional analysis logic
    const enhanced = this.enhanceAnalysis(parsed);
    
    return enhanced;
  }
  
  private enhanceAnalysis(parsed: DeconstructedPrompt): DeconstructedPrompt {
    // Add secondary intents
    // Refine confidence scores
    // Detect persona and style
    // Extract variables
    return parsed;
  }
}
```

### 3. Compilation Phase

The `CompilerService` formats the prompt for the target model:

```typescript
// app/lib/engine/CompilerService.ts
class CompilerService {
  compile(deconstructed: DeconstructedPrompt, targetModel: TargetModel): OptimizedPrompt {
    const modelSpecific = this.getModelSpecificConfig(targetModel);
    const formatted = this.formatForModel(deconstructed, targetModel);
    
    return {
      model: targetModel,
      formattedPrompt: formatted,
      systemInstruction: this.generateSystemInstruction(deconstructed),
      metadata: deconstructed
    };
  }
  
  private formatForModel(prompt: DeconstructedPrompt, model: TargetModel): string | object {
    switch (model) {
      case TargetModel.CLAUDE_3_5_SONNET:
        return this.formatClaude(prompt);
      case TargetModel.GPT_4O:
        return this.formatGPT(prompt);
      case TargetModel.GEMINI_1_5_PRO:
        return this.formatGemini(prompt);
      // ... other models
      default:
        return prompt.originalInput;
    }
  }
}
```

## API Integration

The Analysis Engine is exposed via the `/api/analyze` endpoint:

```typescript
// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RegexParser } from "@/app/lib/parsing/strategies/RegexParser";
import { AnalyzerService } from "@/app/lib/engine/AnalyzerService";
import { CompilerService } from "@/app/lib/engine/CompilerService";

const parser = new RegexParser();
const analyzerService = new AnalyzerService();
const compilerService = new CompilerService();

export async function POST(req: NextRequest) {
  try {
    const { text, model } = await req.json();
    
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required" },
        { status: 400 }
      );
    }
    
    // Map string model to TargetModel enum
    let targetModel = this.mapStringToTargetModel(model);
    
    // Phase 1: Fast regex parsing
    const result = parser.analyze(text);
    const deconstructed = analyzerService.analyze(text);
    const optimized = compilerService.compile(deconstructed, targetModel);
    
    return NextResponse.json(optimized);
  } catch (error) {
    console.error("Parsing Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze prompt" },
      { status: 500 }
    );
  }
}
```

## Model-Specific Formatting

### Claude Models

Claude 3.5 Sonnet and other Claude models receive optimized prompts with:
- Clear system instructions
- Structured user messages
- Model-specific formatting

```typescript
private formatClaude(prompt: DeconstructedPrompt): string {
  const system = this.generateSystemInstruction(prompt);
  const user = this.formatUserMessage(prompt);
  
  return {
    system: system,
    user: user,
    max_tokens: prompt.constraints.maxTokens || 1000,
    temperature: prompt.constraints.temperature || 0.7
  };
}
```

### GPT-4 Models

GPT-4 optimized prompts include:
- Role-based messaging
- Token-efficient formatting
- Model-specific optimizations

### Gemini Models

Gemini models support multimodal content:
- Text and image combinations
- Structured content arrays
- Model-specific constraints

## Performance Optimization

### Caching
- **Input caching** - Cache recent analysis results
- **Model config caching** - Cache model-specific configurations
- **Pattern caching** - Cache common intent/domain patterns

### Performance Metrics
| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Regex Parsing | O(n) | Linear with input length |
| Intent Detection | O(1) | Fixed pattern matching |
| Domain Classification | O(1) | Fixed pattern matching |
| Compilation | O(m) | Linear with output length |

### Benchmarks
- **Average analysis time**: < 500ms for typical prompts
- **Max input length**: 10,000 characters
- **Concurrent requests**: Up to 100 per minute (rate limited)
- **Memory usage**: < 10MB per request

## Error Handling

### Common Errors

| Error Type | Cause | Resolution |
|------------|-------|------------|
| `InvalidInputError` | Empty or malformed input | Return 400 with validation message |
| `ModelNotFoundError` | Unsupported model specified | Use default model, log warning |
| `AnalysisTimeoutError` | Processing took too long | Return partial results, suggest retry |
| `RateLimitError` | Too many requests | Return 429, suggest retry after delay |

### Error Response Format

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {
    "inputLength": 1234,
    "model": "CLAUDE_3_5_SONNET",
    "processingTime": 456
  },
  "suggestions": [
    "Reduce prompt length",
    "Try a different model"
  ]
}
```

## Testing

### Unit Tests

```typescript
// Example test for AnalyzerService
describe('AnalyzerService', () => {
  it('should detect technical backend domain', () => {
    const service = new AnalyzerService();
    const result = service.analyze("Create a Node.js API server");
    
    expect(result.detectedDomain).toBe(Domain.TECHNICAL_BACKEND);
    expect(result.primaryIntent).toBe(Intent.ARCHITECT);
  });
  
  it('should detect creative intent', () => {
    const service = new AnalyzerService();
    const result = service.analyze("Write a poem about the ocean");
    
    expect(result.detectedDomain).toBe(Domain.CREATIVE_COPY);
    expect(result.primaryIntent).toBe(Intent.SCRIPTWRITING);
  });
});
```

### Integration Tests

```typescript
// Example integration test for analyze endpoint
describe('POST /api/analyze', () => {
  it('should return optimized prompt', async () => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'Create a React component',
        model: 'claude' 
      })
    });
    
    const data = await response.json();
    expect(data.model).toBe(TargetModel.CLAUDE_3_5_SONNET);
    expect(data.formattedPrompt).toBeDefined();
    expect(data.metadata.primaryIntent).toBe(Intent.ARCHITECT);
  });
});
```

## Examples

### Basic Analysis

```typescript
import { AnalyzerService } from "@/app/lib/engine/AnalyzerService";

const analyzer = new AnalyzerService();
const result = analyzer.analyze("Create a TypeScript class for user management");

console.log(result);
// {
//   originalInput: "Create a TypeScript class for user management",
//   detectedDomain: Domain.TECHNICAL_BACKEND,
//   primaryIntent: Intent.ARCHITECT,
//   secondaryIntents: [Intent.DOCUMENT],
//   confidenceScore: 0.95,
//   constraints: { tone: "PROFESSIONAL", outputFormat: "MARKDOWN" },
//   persona: "Senior TypeScript Developer"
// }
```

### Full Pipeline

```typescript
import { RegexParser } from "@/app/lib/parsing/strategies/RegexParser";
import { AnalyzerService } from "@/app/lib/engine/AnalyzerService";
import { CompilerService } from "@/app/lib/engine/CompilerService";

const parser = new RegexParser();
const analyzer = new AnalyzerService();
const compiler = new CompilerService();

const input = "Explain quantum computing to a 5-year-old";

// Step 1: Parse
const parsed = parser.analyze(input);

// Step 2: Analyze
const analyzed = analyzer.analyze(input);

// Step 3: Compile for target model
const optimized = compiler.compile(analyzed, TargetModel.CLAUDE_3_5_SONNET);

console.log(optimized);
// {
//   model: TargetModel.CLAUDE_3_5_SONNET,
//   formattedPrompt: "Explain quantum computing in simple terms...",
//   systemInstruction: "You are a patient teacher explaining complex concepts to children",
//   metadata: { ... }
// }
```

## See Also

- [Prompt Studio](../studio.md) - The user interface for analysis
- [API Reference - Analyze Endpoint](../api/index.md#analyze) - Technical API documentation
- [Types Reference](../reference/types.md) - All TypeScript types and interfaces
- [Custom Hooks - useParsing](../reference/hooks.md#useparsing) - React hook for analysis
- [History Management](../history.md) - Storing and managing analysis results