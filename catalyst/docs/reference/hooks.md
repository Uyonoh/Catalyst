# React Hooks Reference

This document provides comprehensive documentation for all custom React hooks used throughout the Catalyst codebase.

## Table of Contents

- [useParsing](#useparsing)
- [useTokens](#usetokens)
- [useWorkspace](#useworkspace)
- [useUser](#useuser)
- [Hook Utilities](#hook-utilities)
- [Best Practices](#best-practices)

---

## useParsing

**File:** `app/hooks/useParsing.ts`

**Purpose:** Provides real-time prompt analysis with debounced API calls.

### Signature

```typescript
export function useParsing(
  text: string,
  selectedModel: string,
  debounceMs: number = 500
): {
  result: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
}
```

### Parameters

| Parameter | Type | Description | Default | Required |
|-----------|------|-------------|---------|----------|
| `text` | `string` | The input text to analyze | - | Yes |
| `selectedModel` | `string` | The target AI model | - | Yes |
| `debounceMs` | `number` | Debounce delay in milliseconds | `500` | No |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `result` | `OptimizedPrompt \| null` | The analysis result from the API |
| `isLoading` | `boolean` | Whether an analysis is currently in progress |
| `error` | `string \| null` | Error message if analysis failed |

### Usage

```typescript
import { useState } from "react";
import { useParsing } from "@/app/hooks/useParsing";

function StudioComponent() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("claude");
  
  const { result, isLoading, error } = useParsing(input, model, 500);

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
      />
      
      {isLoading && <p>Analyzing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div>
          <h3>Optimized Prompt:</h3>
          <p>{result.formattedPrompt}</p>
          <p>Model: {result.model}</p>
        </div>
      )}
    </div>
  );
}
```

### Implementation Details

```typescript
// app/hooks/useParsing.ts
export function useParsing(
  text: string,
  selectedModel: string,
  debounceMs: number = 500,
) {
  const [result, setResult] = useState<OptimizedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePrompt = useCallback(
    async (currentText: string, currentModel: string) => {
      if (!currentText.trim()) {
        setResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: currentText, model: currentModel }),
        });

        if (!response.ok) throw new Error("Failed to analyze prompt");

        const data = await response.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!text.trim()) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    // Set loading immediately when the user starts typing/editing
    setIsLoading(true);

    const timer = setTimeout(() => {
      analyzePrompt(text, selectedModel);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [text, selectedModel, debounceMs, analyzePrompt]);

  return { result, isLoading, error };
}
```

### Key Features

- **Debounced API calls** - Prevents excessive API requests during rapid typing
- **Automatic cleanup** - Clears timeouts when component unmounts or dependencies change
- **Loading state management** - Sets loading state immediately on input change
- **Error handling** - Catches and displays API errors gracefully
- **Empty input handling** - Automatically clears results for empty input

### Dependencies

- React hooks: `useState`, `useEffect`, `useCallback`
- API endpoint: `/api/analyze`
- Types: `OptimizedPrompt` from `@/app/lib/engine/types`

---

## useTokens

**File:** `app/hooks/useTokens.ts`

**Purpose:** Manages token usage and subscription status for the current user.

### Signature

```typescript
export function useTokens(): {
  isSubscribed: boolean;
  isUltra: boolean;
  weeklyLimit: number;
  used: number;
  bonusTokens: number;
  remaining: number;
  percentage: number;
  isExhausted: boolean;
  refreshProfile: () => Promise<void>;
}
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `isSubscribed` | `boolean` | Whether user has an active subscription |
| `isUltra` | `boolean` | Whether user has Ultra plan |
| `weeklyLimit` | `number` | Weekly token limit for user's plan |
| `used` | `number` | Tokens used in current week |
| `bonusTokens` | `number` | Bonus tokens available |
| `remaining` | `number` | Remaining tokens available |
| `percentage` | `number` | Percentage of weekly limit used |
| `isExhausted` | `boolean` | Whether user has exhausted their token limit |
| `refreshProfile` | `() => Promise<void>` | Function to refresh user profile data |

### Usage

```typescript
import { useTokens } from "@/app/hooks/useTokens";

function TokenDisplay() {
  const { isSubscribed, remaining, percentage, isExhausted, isUltra } = useTokens();

  return (
    <div>
      <h3>Token Status</h3>
      <p>Subscription: {isUltra ? "Ultra" : isSubscribed ? "Paid" : "Free"}</p>
      <p>Remaining: {isUltra ? "Unlimited" : remaining}</p>
      <p>Usage: {percentage}%</p>
      <p>Status: {isExhausted ? "Exhausted" : "Active"}</p>
      
      <progress value={percentage} max="100" />
    </div>
  );
}
```

### Implementation Details

```typescript
// app/hooks/useTokens.ts
export function useTokens() {
  const { profile, refreshProfile } = useUser();

  const isUltra = profile?.plan === 'ultra';
  const isSubscribed = profile?.plan !== 'free';
  const weeklyLimit = tierLimits[profile?.plan ?? "free"]; 
  const used = profile?.tokens_used ?? 0;
  const bonusTokens = profile?.bonus_tokens ?? 0;
  const remaining = isUltra ? Infinity : Math.max(0, weeklyLimit - used + bonusTokens);
  const percentage = isUltra ? 100 : Math.round((used / weeklyLimit) * 100);
  const isExhausted = !isUltra && remaining === 0;

  return { 
    isSubscribed, 
    isUltra, 
    weeklyLimit, 
    used, 
    bonusTokens, 
    remaining, 
    percentage, 
    isExhausted, 
    refreshProfile 
  };
}
```

### Key Features

- **Real-time calculations** - All values computed from user profile
- **Ultra plan handling** - Special logic for unlimited usage
- **Percentage calculation** - Visual representation of usage
- **Exhaustion detection** - Identifies when user has no tokens left
- **Profile refresh** - Access to refresh function for updated data

### Dependencies

- Custom hook: `useUser` from `@/app/context/AuthContext`
- Constants: `tierLimits` from `@/app/lib/tokens`
- Types: `Profile` interface

---

## useWorkspace

**File:** `app/context/WorkspaceContext.tsx` (exposed as hook)

**Purpose:** Manages the state and logic for the prompt studio workspace.

### Context Provider

```typescript
// app/context/WorkspaceContext.tsx
export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  
  const value = {
    ...state,
    // Actions
    setInput: (input: string) => dispatch({ type: "SET_INPUT", payload: input }),
    setSelectedModel: (model: TargetModel) => dispatch({ type: "SET_MODEL", payload: model }),
    setShowAnalysis: (show: boolean) => dispatch({ type: "SET_SHOW_ANALYSIS", payload: show }),
    analyze: async (text: string, model: TargetModel) => {
      // Analysis logic
    },
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };
  
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
```

### Hook Usage

```typescript
// Custom hook for easy access
export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
```

### State Interface

```typescript
// app/context/WorkspaceContext.tsx
interface WorkspaceState {
  input: string;
  parsedPrompt: string | null;
  parsedFormat: string | null;
  selectedModel: TargetModel;
  analysisResult: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
  showAnalysis: boolean;
}

interface WorkspaceContextType extends WorkspaceState {
  setInput: (input: string) => void;
  setSelectedModel: (model: TargetModel) => void;
  setShowAnalysis: (show: boolean) => void;
  analyze: (text: string, model: TargetModel) => Promise<void>;
  clearError: () => void;
}
```

### Usage

```typescript
import { useWorkspace } from "@/app/context/WorkspaceContext";

function StudioInput() {
  const { input, setInput, selectedModel, setSelectedModel, isLoading } = useWorkspace();

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
        disabled={isLoading}
      />
      
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value as TargetModel)}
        disabled={isLoading}
      >
        <option value="CLAUDE_3_5_SONNET">Claude 3.5 Sonnet</option>
        <option value="GPT_4O">GPT-4O</option>
        <option value="GEMINI_1_5_PRO">Gemini 1.5 Pro</option>
      </select>
    </div>
  );
}
```

### Key Features

- **Centralized state management** - Single source of truth for studio state
- **Type-safe actions** - Strongly typed state updates
- **Async analysis support** - Built-in support for API calls
- **Error handling** - Consistent error management across components
- **Context validation** - Throws error if used outside provider

---

## useUser

**File:** `app/context/AuthContext.tsx` (exposed as hook)

**Purpose:** Provides access to user authentication and profile data.

### Hook Usage

```typescript
// Custom hook for easy access
export function useUser(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}
```

### Context Interface

```typescript
// app/context/AuthContext.tsx
interface AuthContextType {
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

### Usage

```typescript
import { useUser } from "@/app/context/AuthContext";

function UserProfile() {
  const { user, profile, isAuthenticated, signOut } = useUser();

  if (!isAuthenticated) {
    return <p>Please sign in</p>;
  }

  return (
    <div>
      <h2>Welcome, {profile?.username || user?.email}</h2>
      <p>Plan: {profile?.plan}</p>
      <p>Tokens used: {profile?.tokens_used}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Key Features

- **Authentication state** - Tracks login/logout state
- **User data access** - Access to user, session, and profile
- **Authentication methods** - Sign in, sign up, sign out
- **Profile management** - Update and refresh profile data
- **Loading states** - Handles async operations gracefully

---

## Hook Utilities

### Custom Hook Patterns

#### useDebounce

Generic debounce hook used internally by other hooks:

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### usePrevious

Track previous value of a variable:

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

#### useLocalStorage

Persistent local storage for simple values:

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
```

### Hook Composition

Combining hooks for complex functionality:

```typescript
function useStudioFeatures() {
  const { input, setInput, selectedModel, setSelectedModel } = useWorkspace();
  const { result, isLoading, error } = useParsing(input, selectedModel);
  const { remaining, isExhausted } = useTokens();
  
  const canAnalyze = input.trim().length > 0 && !isLoading && !isExhausted;
  
  return {
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    result,
    isLoading,
    error,
    remaining,
    isExhausted,
    canAnalyze
  };
}
```

---

## Best Practices

### 1. Performance Optimization

**✅ Do:**
- Use `useCallback` for functions passed to child components
- Use `useMemo` for expensive calculations
- Keep dependency arrays minimal
- Use stable references for dependencies

**❌ Don't:**
- Create functions inline in component bodies
- Perform expensive calculations on every render
- Include unstable references in dependency arrays
- Forget to clean up event listeners and subscriptions

### 2. Error Handling

**✅ Do:**
- Handle loading states gracefully
- Provide meaningful error messages
- Use error boundaries for UI errors
- Clean up errors when appropriate

**❌ Don't:**
- Let errors crash your application
- Show technical error messages to users
- Forget to clear errors on retry
- Ignore promise rejections

### 3. Type Safety

**✅ Do:**
- Use TypeScript interfaces for hook return values
- Type all parameters and return values
- Use generics for reusable hooks
- Validate inputs before processing

**❌ Don't:**
- Use `any` type in hook signatures
- Forget to type function parameters
- Ignore type errors in hooks

### 4. Testing

**✅ Do:**
- Test hooks in isolation using testing libraries
- Test different input scenarios
- Test error conditions
- Mock API calls and external dependencies

**❌ Don't:**
- Test hooks only through components
- Forget to test edge cases
- Test implementation details

### Example Test

```typescript
// Testing useParsing hook
import { renderHook, waitFor } from "@testing-library/react";
import { useParsing } from "@/app/hooks/useParsing";

// Mock the global fetch function
global.fetch = jest.fn();

describe("useParsing", () => {
  it("should return null result for empty input", () => {
    const { result } = renderHook(() => useParsing("", "claude", 500));
    expect(result.current.result).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should analyze non-empty input", async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        model: "CLAUDE_3_5_SONNET",
        formattedPrompt: "Test output",
        metadata: {}
      })
    });

    const { result } = renderHook(() => useParsing("test input", "claude", 0));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.result).not.toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  it("should handle API errors", async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Test error" })
    });

    const { result } = renderHook(() => useParsing("test input", "claude", 0));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe("Test error");
    });
  });
});
```

---

## See Also

- [Types Reference](./types.md) - TypeScript type definitions
- [Features - Studio](../features/studio.md) - How hooks are used in the Studio
- [Features - Analysis](../features/analysis.md) - Analysis engine integration
- [API Reference](../api/index.md) - API endpoints used by hooks
- [Components](../components/index.md) - Components that use these hooks