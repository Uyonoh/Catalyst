# Prompt Studio

The **Prompt Studio** is the central workspace of Catalyst, designed to help users craft, refine, and optimize their prompts with real-time AI-powered analysis and intelligent suggestions.

## Overview

The Studio provides an intuitive interface for:
- Writing and editing prompts
- Viewing real-time analysis and optimization suggestions
- Selecting target AI models
- Configuring optimization settings
- Managing workspace sessions

## Core Components

### Raw Intent Panel

The main text input area where users can write their raw prompt ideas. Features include:

- **Real-time typing** with debounced analysis
- **Multi-line support** for complex prompts
- **Character counting** and validation
- **Auto-save** functionality

```tsx
// Example usage of the RawIntentPanel component
<RawIntentPanel 
  value={inputText}
  onChange={setInputText}
  placeholder="Describe what you want to achieve..."
/>
```

### Live Analysis Panel

Provides real-time feedback and optimization suggestions as users type:

- **Intent detection** - Identifies primary and secondary intents
- **Domain classification** - Categorizes prompts by domain (technical, creative, business, etc.)
- **Model recommendations** - Suggests optimal models for the detected intent
- **Confidence scoring** - Shows analysis confidence levels
- **Formatted output preview** - Displays the optimized prompt

### Optimization Settings

Configurable parameters that control how prompts are optimized:

| Setting | Description | Default | Options |
|---------|-------------|---------|---------|
| **Target Model** | AI model to optimize for | Claude 3.5 Sonnet | GPT-4O, GEMINI_1_5_PRO, LLAMA_3, GROK_1, etc. |
| **Mode** | Input modality | Text | Image, Video, Audio, Code, Geospatial |
| **Tone** | Output tone preference | Professional | Concise, Creative, Academic, ELI5 |
| **Format** | Output format | Markdown | JSON, CSV, YAML, Plain Text |
| **Temperature** | Creativity level | 0.7 | 0.0 - 1.0 |
| **Max Tokens** | Token limit | 1000 | 1 - 4096 |

## Workflow

### 1. Input Phase
User enters their raw prompt idea in the main text area. The system immediately begins analyzing the input.

### 2. Analysis Phase
The [Analysis Engine](../analysis.md) processes the input to detect:
- Primary intent and secondary intents
- Domain classification
- Optimal target models
- Confidence scores

### 3. Optimization Phase
The system generates optimized prompts tailored to:
- Selected target model
- User preferences (tone, format, etc.)
- Detected intent and domain

### 4. Output Phase
User sees the optimized prompt and can:
- Copy the result
- Save to history
- Continue refining
- Switch models for comparison

## Code Architecture

The Studio is built on several key React components and hooks:

### Main Components

```
app/studio/
├── StudioPageContent.tsx      # Main studio container
├── [id]/                      # Individual prompt editor
├── loading.tsx                # Loading states
└── page.tsx                   # Studio entry point
```

### Studio-Specific Components

```
app/components/studio/
├── RawIntentPanel.tsx         # Raw input panel
├── LiveAnalysisPanel.tsx     # Real-time analysis display
├── OptimizationSettings.tsx   # Configuration controls
├── ModeSelector.tsx           # Modality selector
├── ModelSelector.tsx          # Model selection
├── ModelTargets.tsx           # Target model options
├── ParsedIntentModal.tsx      # Intent details modal
├── PromptControlsPanel.tsx    # Action buttons
└── PromptEditor.tsx           # Advanced prompt editing
```

### State Management

The Studio uses a dedicated workspace context for state management:

```tsx
// app/context/WorkspaceContext.tsx
interface WorkspaceState {
  input: string;
  parsedPrompt: string;
  parsedFormat: string;
  selectedModel: TargetModel;
  analysisResult: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
}
```

## Integration with Analysis Engine

The Studio integrates with the [Analysis Engine](../analysis.md) via the `/api/analyze` endpoint:

```typescript
// Example API call from useParsing hook
const response = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    text: currentText, 
    model: currentModel 
  }),
});

const data = await response.json(); // Returns OptimizedPrompt
```

## Auto-Save Functionality

The Studio automatically saves successful analyses to the user's history:

```typescript
// Auto-save logic from StudioPageContent.tsx
useEffect(() => {
  if (parsedPrompt && user && !isSaving) {
    const autoSave = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .insert({
          user_id: user.id,
          workspace_id: workspaceId,
          title: "Untitled Generated Prompt",
          content: parsedPrompt,
          raw_input: input,
          target_model: selectedModel,
          is_public: isPublic,
          format: parsedFormat || "text"
        })
        .select()
        .single();
      
      if (data) {
        router.push(`/studio/${data.id}`);
      }
    };
    autoSave();
  }
}, [parsedPrompt, user, input, selectedModel]);
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current prompt |
| `Ctrl/Cmd + Enter` | Analyze current input |
| `Ctrl/Cmd + M` | Toggle analysis panel |
| `Escape` | Close modals/dialogs |
| `Arrow Up/Down` | Navigate model selector |

## Customization Options

### Theme Support
- Light and dark mode compatible
- Glass-panel aesthetic with neon accents
- Custom background gradients

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly controls on mobile devices

## Performance Considerations

- **Debounced analysis** - 500ms delay to prevent excessive API calls
- **Efficient rendering** - Virtualized lists for large history sets
- **Memory management** - Clean up event listeners and timeouts
- **Optimized dependencies** - Minimal re-renders with proper dependency arrays

## Error Handling

Common error scenarios and their handling:

| Error Type | Cause | User Experience |
|------------|-------|-----------------|
| Network Error | API unavailable | Shows retry button with error message |
| Rate Limit | Too many requests | Displays rate limit notification |
| Authentication | Session expired | Redirects to login |
| Validation | Invalid input | Highlights problematic fields |
| Model Error | Model unavailable | Suggests alternative models |

## Examples

### Basic Usage
```tsx
import { useWorkspace } from "../context/WorkspaceContext";

function MyStudioComponent() {
  const { input, setInput, selectedModel, setSelectedModel } = useWorkspace();
  
  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <select 
        value={selectedModel} 
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="claude">Claude 3.5 Sonnet</option>
        <option value="gpt">GPT-4O</option>
        <option value="gemini">Gemini 1.5 Pro</option>
      </select>
    </div>
  );
}
```

### Advanced Integration
```tsx
import { useParsing } from "../hooks/useParsing";

function SmartStudio() {
  const { result, isLoading, error } = useParsing(
    inputText, 
    selectedModel, 
    500 // debounceMs
  );
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (result) return <OptimizedResult prompt={result} />;
  
  return <EmptyState />;
}
```

## See Also

- [Analysis Engine](../analysis.md) - The AI-powered analysis system
- [History Management](../history.md) - Saved prompt management
- [API Reference - Analyze Endpoint](../api/index.md#analyze) - Technical API details
- [Custom Hooks](../reference/hooks.md) - `useParsing` and `useTokens` hooks
- [Types Reference](../reference/types.md) - TypeScript interfaces and enums