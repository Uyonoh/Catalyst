# TypeScript Types Reference

This document provides comprehensive documentation for all TypeScript type definitions used throughout the Catalyst codebase.

## Table of Contents

- [Engine Types](#engine-types)
- [Parsing Types](#parsing-types)
- [API Types](#api-types)
- [Component Types](#component-types)
- [Database Types](#database-types)
- [Utility Types](#utility-types)

---

## Engine Types

The core type definitions for the Analysis Engine are located in `app/lib/engine/types.ts`.

### InputModality

Defines the supported input types for prompts:

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

**Usage:**
```typescript
import { InputModality } from "@/app/lib/engine/types";

function processAsset(asset: { type: InputModality }) {
  switch (asset.type) {
    case InputModality.TEXT:
      // Handle text processing
      break;
    case InputModality.IMAGE:
      // Handle image processing
      break;
    // ... other cases
  }
}
```

### TargetModel

Defines all supported AI models for prompt optimization:

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

**Usage:**
```typescript
import { TargetModel } from "@/app/lib/engine/types";

interface AnalysisRequest {
  text: string;
  model: TargetModel;
}

function mapStringToModel(modelString: string): TargetModel {
  switch (modelString.toLowerCase()) {
    case "gpt": return TargetModel.GPT_4O;
    case "claude": return TargetModel.CLAUDE_3_5_SONNET;
    case "gemini": return TargetModel.GEMINI_1_5_PRO;
    // ... other mappings
    default: return TargetModel.CLAUDE_3_5_SONNET;
  }
}
```

### Domain

Categorizes prompts by their domain of application:

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

### Intent

Defines the user's intent when creating a prompt:

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

### Asset

Represents input assets for multimodal prompts:

```typescript
// app/lib/engine/types.ts
export interface Asset {
  id: string;
  type: InputModality;
  uri: string;                    // Remote URL or Local Path
  mimeType: string;
  description?: string;           // User-provided context
  metadata?: Record<string, any>; // EXIF, Resolution, Duration, etc.
}
```

**Example:**
```typescript
const imageAsset: Asset = {
  id: "img_001",
  type: InputModality.IMAGE,
  uri: "https://example.com/image.jpg",
  mimeType: "image/jpeg",
  description: "A landscape photo for style reference",
  metadata: {
    width: 1920,
    height: 1080,
    size: 2048
  }
};
```

### PromptConstraints

Configurable parameters for prompt optimization:

```typescript
// app/lib/engine/types.ts
export interface PromptConstraints {
  tone: "PROFESSIONAL" | "CONCISE" | "CREATIVE" | "ACADEMIC" | "ELI5";
  outputFormat: "MARKDOWN" | "JSON" | "CSV" | "YAML" | "PLAIN_TEXT";
  maxTokens?: number;
  temperature?: number;           // 0.0 to 1.0
  negativeConstraints?: string[]; // e.g. ["no code", "no intro"]
}
```

**Example:**
```typescript
const constraints: PromptConstraints = {
  tone: "PROFESSIONAL",
  outputFormat: "MARKDOWN",
  maxTokens: 1000,
  temperature: 0.7,
  negativeConstraints: ["no code examples", "be concise"]
};
```

### DeconstructedPrompt

The result of parsing and analyzing user input:

```typescript
// app/lib/engine/types.ts
export interface DeconstructedPrompt {
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

**Example:**
```typescript
const deconstructed: DeconstructedPrompt = {
  originalInput: "Create a TypeScript class for user authentication",
  detectedDomain: Domain.TECHNICAL_BACKEND,
  primaryIntent: Intent.ARCHITECT,
  secondaryIntents: [Intent.DOCUMENT],
  confidenceScore: 0.95,
  assets: [],
  constraints: {
    tone: "PROFESSIONAL",
    outputFormat: "MARKDOWN",
    maxTokens: 2000
  },
  variables: {
    "auth_provider": "JWT"
  },
  persona: "Senior TypeScript Developer",
  style: "Step-by-step tutorial"
};
```

### OptimizedPrompt

The final output from the Compiler Service:

```typescript
// app/lib/engine/types.ts
export interface OptimizedPrompt {
  model: TargetModel;
  formattedPrompt: string | object; // Object for multimodal parts (Gemini style)
  systemInstruction?: string;
  metadata: Partial<DeconstructedPrompt>;
}
```

**Example:**
```typescript
const optimized: OptimizedPrompt = {
  model: TargetModel.CLAUDE_3_5_SONNET,
  formattedPrompt: "Create a comprehensive TypeScript class...",
  systemInstruction: "You are a senior TypeScript developer creating production-ready code",
  metadata: {
    originalInput: "Create a TypeScript class for user authentication",
    detectedDomain: Domain.TECHNICAL_BACKEND,
    primaryIntent: Intent.ARCHITECT,
    confidenceScore: 0.95
  }
};
```

---

## Parsing Types

Type definitions for the parsing system in `app/lib/parsing/types.ts`.

### Parser Interface

Base interface for all parsers:

```typescript
// app/lib/parsing/types.ts
export interface Parser {
  analyze(text: string): DeconstructedPrompt;
  detectDomain(text: string): Domain;
  detectIntent(text: string): Intent;
  extractConstraints(text: string): PromptConstraints;
}
```

### Parser Types

Enum for different parsing strategies:

```typescript
// app/lib/parsing/types.ts
export enum ParserType {
  REGEX = "REGEX",
  AI = "AI",
  HYBRID = "HYBRID"
}
```

---

## API Types

### API Request Types

```typescript
// Request type for /api/analyze endpoint
export interface AnalyzeRequest {
  text: string;
  model?: string; // String representation of TargetModel
}

// Request type for /api/parse endpoint
export interface ParseRequest {
  text: string;
  strategy?: ParserType;
}
```

### API Response Types

```typescript
// Response type for /api/analyze endpoint
export interface AnalyzeResponse extends OptimizedPrompt {}

// Error response type
export interface APIError {
  error: string;
  code?: string;
  details?: Record<string, any>;
  suggestions?: string[];
}
```

### Billing API Types

```typescript
// app/api/billing/types.ts
export interface BillingRequest {
  userId: string;
  plan: "free" | "basic" | "plus" | "pro" | "ultra";
  paymentMethodId?: string;
}

export interface BillingResponse {
  success: boolean;
  subscriptionId?: string;
  customerId?: string;
  plan: string;
  trialEnd?: Date;
  currentPeriodEnd?: Date;
}
```

---

## Component Types

### GlassPanel Props

```typescript
// app/components/GlassPanel.tsx
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
  elevation?: "low" | "medium" | "high";
}
```

### Common Component Props

```typescript
// Common props pattern used throughout components
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
}
```

### Header Props

```typescript
// app/components/Header.tsx
export interface HeaderProps {
  user?: User | null;
  currentPath?: string;
  showLogo?: boolean;
  showNavigation?: boolean;
  showUserMenu?: boolean;
}
```

### Button Props

```typescript
// app/components/ui/Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

---

## Database Types

### User Profile

```typescript
// Database user profile type
export interface Profile {
  id: string;
  user_id: string;
  username?: string;
  email: string;
  avatar_url?: string;
  plan: "free" | "basic" | "plus" | "pro" | "ultra";
  tokens_used: number;
  bonus_tokens: number;
  subscription_id?: string;
  customer_id?: string;
  last_active_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

### Prompt Entity

```typescript
// Database prompt entity type
export interface PromptRow {
  id: string;
  user_id: string;
  workspace_id: string | null;
  title: string;
  content: string;
  snippet: string;
  raw_input: string;
  target_model: string;
  is_public: boolean;
  icon: string;
  tag: string;
  format: string;
  is_favorite: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Workspace Entity

```typescript
// Database workspace entity type
export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}
```

---

## Utility Types

### Token Management Types

```typescript
// app/lib/tokens.ts
export interface TokenConfig {
  free: number;
  basic: number;
  plus: number;
  pro: number;
  ultra: number;
}

export const tierLimits: TokenConfig = {
  free: 50,
  basic: 200,
  plus: 1000,
  pro: 5000,
  ultra: Infinity
};
```

### Currency Types

```typescript
// app/lib/currency/types.ts
export type Currency = "USD" | "NGN" | "EUR" | "GBP";

export interface CurrencyRate {
  code: Currency;
  rate: number;
  symbol: string;
  name: string;
}
```

### Settings Types

```typescript
// app/settings/types.ts
export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  preferences: {
    defaultModel: TargetModel;
    defaultTone: "PROFESSIONAL" | "CONCISE" | "CREATIVE" | "ACADEMIC" | "ELI5";
    showAnalysisPanel: boolean;
    autoSave: boolean;
  };
}
```

---

## Authentication Types

### User Types

```typescript
// app/auth/types.ts
export interface User {
  id: string;
  email: string;
  email_confirmed_at?: Date;
  created_at: Date;
  updated_at: Date;
  last_sign_in_at?: Date;
}

export interface Session {
  user: User;
  access_token: string;
  expires_at: Date;
  token_type: "bearer";
}
```

### Auth Context Types

```typescript
// app/context/AuthContext.tsx
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: Error }>;
}
```

---

## Context Types

### Workspace Context

```typescript
// app/context/WorkspaceContext.tsx
export interface WorkspaceState {
  input: string;
  parsedPrompt: string | null;
  parsedFormat: string | null;
  selectedModel: TargetModel;
  analysisResult: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
  showAnalysis: boolean;
}

export interface WorkspaceContextType extends WorkspaceState {
  setInput: (input: string) => void;
  setSelectedModel: (model: TargetModel) => void;
  setShowAnalysis: (show: boolean) => void;
  analyze: (text: string, model: TargetModel) => Promise<void>;
  clearError: () => void;
}
```

---

## Type Utilities

### Conditional Types

```typescript
// Utility types used throughout the codebase
export type Maybe<T> = T | null | undefined;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Pick<T, K> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireAllOrNone<T, Keys extends keyof T = keyof T> =
  | Pick<T, Exclude<keyof T, Keys>>
  | Pick<T, keyof T>;
```

### Event Types

```typescript
// Common event handler types
export type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void;
export type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;
export type FormEventHandler<T = Element> = (event: React.FormEvent<T>) => void;
```

---

## Type Guards

### Type Prediction Functions

```typescript
// Type guards for runtime validation
export function isTargetModel(value: string): value is TargetModel {
  return Object.values(TargetModel).includes(value as TargetModel);
}

export function isDomain(value: string): value is Domain {
  return Object.values(Domain).includes(value as Domain);
}

export function isIntent(value: string): value is Intent {
  return Object.values(Intent).includes(value as Intent);
}
```

### Validation Functions

```typescript
// Validation functions for API inputs
export function validateAnalyzeRequest(request: any): request is AnalyzeRequest {
  return (
    typeof request === "object" &&
    typeof request.text === "string" &&
    request.text.trim().length > 0 &&
    (typeof request.model === "undefined" || typeof request.model === "string")
  );
}
```

---

## See Also

- [Hooks Reference](./hooks.md) - Custom React hooks
- [API Reference](../api/index.md) - API endpoint documentation
- [Components](../components/index.md) - React component library
- [Analysis Engine](../features/analysis.md) - How types are used in analysis