# Reference Documentation

The Reference section provides comprehensive technical documentation for Catalyst's TypeScript types, React hooks, utility functions, and constants.

## TypeScript Types

### 📋 [Types Reference](./types.md)
Complete reference for all TypeScript interfaces, enums, and type definitions used throughout Catalyst.

**Key Categories:**
- **Engine Types** - Input modalities, target models, domains, intents
- **Data Structures** - DeconstructedPrompt, OptimizedPrompt, Asset, PromptConstraints
- **API Types** - Request/response schemas
- **Component Props** - React component property definitions

## React Hooks

### ⚡ [Hooks Reference](./hooks.md)
Comprehensive documentation for all custom React hooks in Catalyst.

**Available Hooks:**
- `useParsing` - Real-time prompt analysis
- `useTokens` - Token management and usage tracking
- `useWorkspace` - Workspace state management
- `useUser` - Authentication and user profile management

## Architecture Overview

```
reference/
├── index.md              # This file - Reference overview
├── types.md              # TypeScript type definitions
├── hooks.md              # Custom React hooks
├── utilities.md          # Utility functions and helpers
└── constants.md          # Application constants and configurations
```

## Quick Navigation

| Section | Description | Key Files |
|---------|-------------|------------|
| **Types** | TypeScript definitions | `app/lib/engine/types.ts`, `app/lib/parsing/types.ts` |
| **Hooks** | React custom hooks | `app/hooks/useParsing.ts`, `app/hooks/useTokens.ts` |
| **Utilities** | Helper functions | `app/lib/utils.ts`, `app/lib/formatters.ts` |
| **Constants** | Configuration values | `app/lib/tokens.ts`, `app/lib/config.ts` |

## Usage Patterns

### Type Usage

```typescript
import { TargetModel, Domain, Intent } from "@/app/lib/engine/types";

function getModelConfig(model: TargetModel): ModelConfig {
  switch (model) {
    case TargetModel.CLAUDE_3_5_SONNET:
      return claudeConfig;
    case TargetModel.GPT_4O:
      return gptConfig;
    default:
      return defaultConfig;
  }
}
```

### Hook Usage

```typescript
import { useParsing } from "@/app/hooks/useParsing";

function MyComponent() {
  const { result, isLoading, error } = useParsing(
    inputText,
    selectedModel,
    500
  );
  
  // Use the hook data...
}
```

## Best Practices

### Type Safety
1. **Always use defined types** instead of inline type definitions
2. **Extend existing types** rather than creating new ones
3. **Use enums** for fixed sets of values
4. **Document complex types** with JSDoc comments

### Hook Usage
1. **Minimize dependencies** in hook dependency arrays
2. **Handle loading states** gracefully
3. **Clean up effects** to prevent memory leaks
4. **Use proper error boundaries**

### Performance
1. **Memoize expensive computations** with `useMemo`
2. **Use `useCallback`** for event handlers passed to children
3. **Avoid unnecessary re-renders** with proper dependencies
4. **Debounce rapid operations** like search and analysis

## See Also

- [Architecture Overview](../architecture/index.md) - System design and structure
- [API Reference](../api/index.md) - API endpoints and schemas
- [Components](../components/index.md) - React component library
- [Features](../features/index.md) - Feature documentation