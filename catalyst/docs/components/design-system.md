# Design System Reference

This document provides comprehensive documentation for the **Catalyst Glass & Neon Design System**. It covers all visual tokens, components, patterns, and guidelines for maintaining consistent UI across the application.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Glass Panel Component](#glass-panel-component)
- [Neon Effects](#neon-effects)
- [Motion & Animation](#motion--animation)
- [Component Patterns](#component-patterns)
- [Layout Guidelines](#layout-guidelines)
- [Accessibility](#accessibility)
- [Usage Examples](#usage-examples)

---

## Design Philosophy

### Glass & Neon Aesthetic

Catalyst embodies a sophisticated **multi-layered aesthetic** that combines:

```
┌─────────────────────────────────────────────────────────────┐
│                    GLASS & NEON                              │
├─────────────────────────────────────────────────────────────┤
│  🟥 Glassmorphism: Transparent, frosted-glass surfaces          │
│      ↓ Provides depth and clarity without clutter            │
│                                                                │
│  🟦 Neon Glow: High-contrast, glowing accents                │
│      ↓ Guides user focus and signifies active states         │
│                                                                │
│  ⚡ Dynamic Energy: Subtle animations                          │
│      ↓ Makes the interface feel alive and responsive         │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Depth through Transparency**: Use varying levels of blur and opacity to indicate stacking order
2. **Focus through Light**: Neon accents guide user attention to important elements
3. **Modern Sophistication**: Premium, professional appearance suitable for AI tools
4. **Dark Mode Optimized**: Perfect for developer tools and long work sessions
5. **Accessibility First**: Ensure all elements meet WCAG 2.1 AA standards

---

## Color System

### Core Palette

The Catalyst color system is optimized for dark mode with a deep navy-slate foundation.

#### Background Colors

| Token | Hex | RGBA | Usage |
|-------|-----|------|-------|
| `background-dark` | `#101922` | `rgb(16, 25, 34)` | Primary background for all pages |
| `background-darker` | `#0a141b` | `rgb(10, 20, 27)` | Elevated surfaces, modals |
| `glass-base` | `rgba(16, 25, 34, 0.6)` | `hsla(205, 52%, 9%, 0.6)` | Standard glass panel background |
| `glass-dark` | `rgba(16, 25, 34, 0.9)` | `hsla(205, 52%, 9%, 0.9)` | High-contrast glass panels |

#### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#258cf4` | Catalyst Blue - Primary calls to action |
| `primary-light` | `#3b9ef9` | Hover states |
| `primary-dark` | `#1a6bc4` | Active/pressed states |
| `primary-50` | `#eff6ff` | Light backgrounds (rarely used) |
| `primary-100` | `#dbeafe` | Very light backgrounds |

#### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `cyan-400` | `#06b6d4` | Standard neon glow, secondary highlight |
| `cyan-500` | `#06b6d4` | Default cyan accent |
| `cyan-600` | `#0891b2` | Darker cyan |

### AI Model Color Mapping

Each AI model has a unique color signature for intuitive identification:

| Model | Token | Hex | Representative Symbol | Usage |
|-------|-------|-----|---------------------|-------|
| **Midjourney** | `cyan-400` | `#06b6d4` | Palette / Creative Arts | Image generation prompts |
| **Claude** | `purple-400` | `#a855f7` | Auto Awesome / Logic | Text analysis, reasoning |
| **GPT-4** | `green-400` | `#10b981` | Chat / Conversation | Chat, dialogue |
| **Llama** | `orange-400` | `#f59e0b` | Terminal / Efficiency | Code, efficiency tasks |
| **DALL-E** | `pink-400` | `#ec4899` | Image / Generation | Image creation |
| **Stable Diffusion** | `blue-400` | `#3b82f6` | Filter Frames / Precision | Precise image generation |

**Tailwind Classes:**
```typescript
// Use these color tokens in components
const modelColors = {
  midjourney: "text-cyan-400 bg-cyan-400/10",
  claude: "text-purple-400 bg-purple-400/10",
  gpt: "text-green-400 bg-green-400/10",
  llama: "text-orange-400 bg-orange-400/10",
  dalle: "text-pink-400 bg-pink-400/10",
  stableDiffusion: "text-blue-400 bg-blue-400/10",
};
```

### Semantic Colors

| Purpose | Token | Hex | Tailwind |
|---------|-------|-----|----------|
| Success | `success` | `#10b981` | `text-green-500` |
| Warning | `warning` | `#f59e0b` | `text-orange-500` |
| Error | `error` | `#ef4444` | `text-red-500` |
| Info | `info` | `#3b82f6` | `text-blue-500` |

### Glass Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `glass-border` | `rgba(255, 255, 255, 0.1)` | Standard glass panel borders |
| `glass-border-strong` | `rgba(255, 255, 255, 0.2)` | Highlighted borders |
| `glass-border-cyan` | `rgba(6, 182, 212, 0.3)` | Active/selected states |

### Text Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary text | `#f1f5f9` | `text-slate-100` | Main content |
| Secondary text | `#94a3b8` | `text-slate-400` | Metadata, labels |
| Tertiary text | `#64748b` | `text-slate-500` | Placeholders, disabled |
| Muted text | `#475569` | `text-slate-600` | Very subtle text |

---

## Typography

### Font Stack

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Inter** is the primary typeface for all text in Catalyst.

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Thin | `100` | Rarely used |
| Extra Light | `200` | Rarely used |
| Light | `300` | Rarely used |
| Normal | `400` | Body text |
| Medium | `500` | Emphasis, buttons |
| Semi Bold | `600` | Labels, headings |
| Bold | `700` | Strong emphasis |
| Extra Bold | `800` | Titles |
| Black | `900` | Headlines, hero text |

### Font Sizes

| Token | Size (px) | Size (rem) | Tailwind | Usage |
|-------|-----------|------------|----------|-------|
| `text-xs` | 12 | 0.75 | `text-xs` | Captions, tiny labels |
| `text-sm` | 14 | 0.875 | `text-sm` | Secondary text, form labels |
| `text-base` | 16 | 1 | `text-base` | Body text |
| `text-lg` | 18 | 1.125 | `text-lg` | Large body text |
| `text-xl` | 20 | 1.25 | `text-xl` | Subheadings |
| `text-2xl` | 24 | 1.5 | `text-2xl` | Section headings |
| `text-3xl` | 30 | 1.875 | `text-3xl` | Page headings |
| `text-4xl` | 36 | 2.25 | `text-4xl` | Hero headings |
| `text-5xl` | 48 | 3 | `text-5xl` | Large titles |
| `text-6xl` | 60 | 3.75 | `text-6xl` | Display headings |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `leading-none` | 1 | Tight spacing |
| `leading-tight` | 1.25 | Headings |
| `leading-snug` | 1.375 | Subheadings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.625 | Readable text |
| `leading-loose` | 2 | Spaced out |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | -0.05em | Very tight |
| `tracking-tight` | -0.025em | Tight (headlines) |
| `tracking-normal` | 0 | Normal |
| `tracking-wide` | 0.025em | Wide |
| `tracking-wider` | 0.05em | Wider |
| `tracking-widest` | 0.1em | Very wide |

### Text Styles

```typescript
// Headlines
const headlineStyles = {
  base: "font-black tracking-tight text-white to-slate-400 bg-gradient-to-r",
  xl: "text-4xl md:text-5xl lg:text-6xl",
  lg: "text-3xl md:text-4xl",
  md: "text-2xl md:text-3xl",
  sm: "text-xl md:text-2xl",
};

// Body text
const bodyStyles = {
  base: "text-slate-200",
  secondary: "text-slate-400",
  tertiary: "text-slate-500",
};

// Code text
const codeStyles = {
  base: "font-mono text-sm",
  block: "bg-slate-900 border border-slate-700 rounded-lg p-4",
  inline: "bg-slate-800 px-2 py-1 rounded",
};
```

---

## Spacing System

Catalyst uses Tailwind's spacing scale (rem-based):

| Token | Size (px) | Size (rem) | Usage |
|-------|-----------|------------|-------|
| `p-0` | 0 | 0 | No padding |
| `p-1` | 4 | 0.25 | Tight spacing |
| `p-2` | 8 | 0.5 | Small padding |
| `p-3` | 12 | 0.75 | Default padding for small components |
| `p-4` | 16 | 1 | Default padding |
| `p-5` | 20 | 1.25 | Medium padding |
| `p-6` | 24 | 1.5 | Standard panel padding |
| `p-8` | 32 | 2 | Large padding |
| `p-10` | 40 | 2.5 | Extra large padding |
| `p-12` | 48 | 3 | Section spacing |

---

## Glass Panel Component

The **GlassPanel** is the foundational UI primitive in Catalyst, embodying the Glass & Neon aesthetic.

### Variants

#### Standard Glass Panel

```typescript
// app/components/GlassPanel.tsx
import React, { ReactNode } from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "standard" | "dark";
  hoverable?: boolean;
  gradientBorder?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = "",
  variant = "standard",
  hoverable = false,
  gradientBorder = false,
}) => {
  const baseClasses = "rounded-xl p-6";
  const variantClasses = {
    standard: "bg-glass-base border border-glass-border",
    dark: "bg-glass-dark border border-glass-border-strong",
  };
  
  const hoverClasses = hoverable 
    ? "hover:bg-white/5 transition-colors duration-200" 
    : "";
  
  const borderClasses = gradientBorder
    ? "border-transparent bg-clip-padding bg-gradient-to-b from-cyan-500/20 to-primary/20" + 
      " [box-shadow:0_0_20px_rgba(6,182,212,0.3)]"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${borderClasses} ${className}`}
      style={{ backdropFilter: "blur(12px)" }}
    >
      {children}
    </div>
  );
};
```

### Usage Examples

```typescript
// Standard panel
<GlassPanel>
  <p>This is a standard glass panel</p>
</GlassPanel>

// Dark panel (higher contrast)
<GlassPanel variant="dark">
  <p>This panel has a darker background</p>
</GlassPanel>

// Hoverable panel
<GlassPanel hoverable>
  <button>Hover me for a subtle effect</button>
</GlassPanel>

// Gradient border panel
<GlassPanel gradientBorder>
  <p>This panel has a beautiful neon gradient border</p>
</GlassPanel>

// Custom styling
<GlassPanel className="p-8 m-4">
  <p>Custom padding and margin</p>
</GlassPanel>
```

### Visual Properties

| Property | Value | Description |
|----------|-------|-------------|
| Background | `rgba(16, 25, 34, 0.6)` | Semi-transparent dark base |
| Blur | `12px` | Backdrop filter blur amount |
| Border | `1px solid rgba(255, 255, 255, 0.1)` | Subtle white border |
| Border Radius | `12px` (`rounded-xl`) | Rounded corners |
| Padding | `24px` (`p-6`) | Internal spacing |

### States

| State | Visual Treatment |
|-------|-------------------|
| Default | Standard glass appearance |
| Hover | `bg-white/5` overlay (if hoverable) |
| Active | Subtle scale down (`scale-95`) |
| Focus | Neon glow ring (`ring-2 ring-cyan-400/50`) |
| Disabled | Reduced opacity (`opacity-50`) |

---

## Neon Effects

### Box Shadows (Glow Effects)

| Token | Value | Usage |
|-------|-------|-------|
| `neon-standard` | `0 0 20px rgba(37, 140, 244, 0.3)` | Standard primary glow |
| `neon-strong` | `0 0 30px rgba(6, 182, 212, 0.5)` | Strong cyan glow |
| `neon-subtle` | `0 0 10px rgba(37, 140, 244, 0.2)` | Subtle glow |
| `neon-error` | `0 0 20px rgba(239, 68, 68, 0.3)` | Error state glow |
| `neon-success` | `0 0 20px rgba(16, 185, 129, 0.3)` | Success state glow |

**Tailwind Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'neon-primary': '0 0 20px rgba(37, 140, 244, 0.3)',
        'neon-cyan': '0 0 30px rgba(6, 182, 212, 0.5)',
        'neon-error': '0 0 20px rgba(239, 68, 68, 0.3)',
        'neon-success': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
    },
  },
};
```

### Usage in Components

```typescript
// Button with neon glow on hover
<button className="px-4 py-2 bg-primary rounded-lg text-white 
  hover:shadow-neon-primary transition-shadow duration-300">
  Hover for Glow
</button>

// Input with focus glow
<input className="w-full px-4 py-2 bg-glass-base border border-glass-border rounded-lg 
  focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none" 
  placeholder="Type here..." />

// Card with subtle glow
<div className="glass-panel shadow-neon-subtle">
  Content with subtle glow
</div>
```

### Dynamic Glow (for Active States)

```typescript
// Animated glow for loading states
const PulseGlow = () => (
  <div className="relative">
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-cyan-400 
      opacity-20 blur-xl animate-pulse"></div>
    <div className="relative glass-panel">
      Loading...
    </div>
  </div>
);
```

**CSS for animations:**
```css
@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.2;
    filter: blur(10px);
  }
  50% {
    opacity: 0.4;
    filter: blur(15px);
  }
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}
```

---

## Motion & Animation

### Transition Properties

| Token | Value | Usage |
|-------|-------|-------|
| `transition-fast` | `150ms` | Instant feedback (buttons, toggles) |
| `transition-normal` | `200ms` | Standard transitions |
| `transition-slow` | `300ms` | Smooth animations |
| `transition-slower` | `500ms` | Slow, deliberate animations |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exit animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entrance animations |

### Common Animations

#### Entry Animations

```typescript
// Fade in with slight upward motion
const FadeInUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

// Scale in
const ScaleIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay }}
  >
    {children}
  </motion.div>
);
```

#### State Animations

```typescript
// Button press animation
<button className="px-4 py-2 bg-primary rounded-lg text-white 
  active:scale-95 transition-transform duration-150">
  Click Me
</button>

// Hover lift
<button className="px-4 py-2 glass-panel rounded-lg 
  hover:-translate-y-0.5 transition-transform duration-200">
  Hover Me
</button>
```

#### Analysis State Animations

```typescript
// Loading/pulse animation for analysis
const AnalysisLoader = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
    <div className="w-2 h-2 rounded-full bg-cyan-400 animation-delay-100 animate-bounce"></div>
    <div className="w-2 h-2 rounded-full bg-cyan-400 animation-delay-200 animate-bounce"></div>
    <span className="text-slate-400">Analyzing...</span>
  </div>
);
```

**Tailwind Animation Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.2', filter: 'blur(10px)' },
          '50%': { opacity: '0.4', filter: 'blur(15px)' },
        },
      },
    },
  },
};
```

---

## Component Patterns

### Common UI Patterns

#### Card Pattern

```typescript
// Standard card with glass panel
const Card = ({ children, className = "" }) => (
  <GlassPanel className={`overflow-hidden ${className}`}>
    {children}
  </GlassPanel>
);

// Usage
<Card className="p-6">
  <h3 className="text-xl font-bold mb-2">Card Title</h3>
  <p className="text-slate-400">Card content goes here</p>
</Card>
```

#### Button Variants

```typescript
// Primary button
const ButtonPrimary = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 bg-primary hover:bg-primary/80 text-white 
      rounded-lg font-medium transition-colors duration-200 
      active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Secondary button (glass)
const ButtonSecondary = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 glass-panel border border-glass-border hover:bg-white/5 
      text-white rounded-lg font-medium transition-colors duration-200 
      active:scale-95 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Neon button
const ButtonNeon = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 
      rounded-lg font-medium hover:bg-cyan-400/10 hover:border-cyan-300 
      transition-all duration-200 shadow-neon-cyan/50 hover:shadow-neon-cyan ${className}`}
    {...props}
  >
    {children}
  </button>
);
```

#### Form Inputs

```typescript
// Text input
const Input = ({ label, error, className = "", ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
    )}
    <input
      className={`w-full px-4 py-2 bg-glass-base border 
        ${error ? 'border-error/50' : 'border-glass-border'} 
        rounded-lg text-white placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400
        transition-all duration-200 ${className}`}
      placeholder={props.placeholder || " "}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-error">{error}</p>
    )}
  </div>
);

// Textarea
const Textarea = ({ label, error, className = "", ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
    )}
    <textarea
      className={`w-full px-4 py-2 bg-glass-base border 
        ${error ? 'border-error/50' : 'border-glass-border'} 
        rounded-lg text-white placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400
        transition-all duration-200 resize-none min-h-[100px] ${className}`}
      placeholder={props.placeholder || " "}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-error">{error}</p>
    )}
  </div>
);
```

#### Model Selector

```typescript
// Model selection with AI model colors
const ModelSelector = ({ selectedModel, onSelect, models }) => (
  <div className="flex flex-wrap gap-2">
    {models.map((model) => {
      const color = modelColors[model.slug] || "text-primary";
      const isSelected = selectedModel === model.slug;
      
      return (
        <button
          key={model.slug}
          onClick={() => onSelect(model.slug)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${isSelected 
              ? `bg-${model.slug}-400/20 ${color} ring-1 ring-${model.slug}-400`
              : `bg-glass-base border border-glass-border text-slate-300 hover:bg-white/5`
            }`}
        >
          <model.icon className="w-4 h-4 inline-block mr-1" />
          {model.name}
        </button>
      );
    })}
  </div>
);
```

#### Token Meter

```typescript
// Token usage meter
const TokenMeter = ({ used, limit, className = "" }) => {
  const percentage = (used / limit) * 100;
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;
  
  return (
    <div className={`glass-panel p-3 ${className}`}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-400">Tokens Used</span>
        <span className={isDanger ? "text-error" : isWarning ? "text-warning" : "text-slate-300"}>
          {used}/{limit}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-glass-base overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300
            ${isDanger ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
```

---

## Layout Guidelines

### Page Layout Structure

```typescript
// Standard page layout
const PageLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-background-dark">
    {/* Header */}
    <Header />
    
    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      {title && (
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-white to-slate-400 bg-gradient-to-r bg-clip-text">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-slate-400">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Content */}
      {children}
    </main>
    
    {/* Footer */}
    <Footer />
  </div>
);
```

### Grid Layouts

```typescript
// Two-column layout
const TwoColumn = ({ left, right, gap = 8 }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-${gap}`}>
    <div className="space-y-6">{left}</div>
    <div className="space-y-6">{right}</div>
  </div>
);

// Three-column layout
const ThreeColumn = ({ col1, col2, col3, gap = 6 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-${gap}`}>
    <div>{col1}</div>
    <div>{col2}</div>
    <div>{col3}</div>
  </div>
);
```

### Responsive Patterns

```typescript
// Hide/Show at breakpoints
<div className="hidden md:block">Visible on medium and larger screens</div>
<div className="block md:hidden">Visible only on mobile</div>

// Responsive padding
<div className="p-4 sm:p-6 lg:p-8">Responsive padding</div>

// Responsive text
<h1 className="text-2xl sm:text-3xl lg:text-4xl">Responsive heading</h1>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Items */}
</div>
```

### Spacing Guidelines

**Vertical Rhythm:**
```typescript
// Consistent vertical spacing
<div className="space-y-4">
  <h1>Heading</h1>
  <p>Paragraph</p>
  <div>Component</div>
</div>

// Section spacing
<div className="py-12">Section with 3rem top/bottom padding</div>
<div className="py-16">Larger section with 4rem padding</div>
```

**Horizontal Spacing:**
```typescript
// Consistent gaps
<div className="flex gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

// Grid gaps
<div className="grid gap-6">Grid with 1.5rem gaps</div>
```

---

## Accessibility

### WCAG 2.1 Compliance

Catalyst aims for **WCAG 2.1 AA** compliance across all components.

#### Color Contrast

**Minimum Contrast Ratios:**
- Normal text: 4.5:1 minimum
- Large text (18.66px+): 3:1 minimum
- UI Components: 3:1 minimum

**Color Contrast Table:**

| Background | Text Color | Contrast Ratio | Status |
|------------|------------|----------------|--------|
| `#101922` | `#ffffff` | 15.3:1 | ✅ Pass |
| `#101922` | `#f1f5f9` | 14.0:1 | ✅ Pass |
| `#101922` | `#94a3b8` | 7.5:1 | ✅ Pass |
| `#101922` | `#64748b` | 5.2:1 | ✅ Pass |
| `rgba(16,25,34,0.6)` | `#ffffff` | 10.2:1 | ✅ Pass |
| `rgba(16,25,34,0.6)` | `#f1f5f9` | 9.3:1 | ✅ Pass |

#### Focus Indicators

All interactive elements must have visible focus states:

```typescript
// Standard focus ring
<button className="... focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
  Button
</button>

// Custom focus for dark backgrounds
<button className="... focus:outline-none focus:ring-2 focus:ring-white/50">
  Button
</button>
```

#### Keyboard Navigation

**Requirements:**
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus states
- Keyboard-only operation

**Skip Links:**
```typescript
// Skip to main content link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

#### ARIA Labels

```typescript
// Button with icon only
<button aria-label="Settings" className="p-2">
  <SettingsIcon className="w-5 h-5" />
</button>

// Input with label
<label htmlFor="email">Email Address</label>
<input id="email" type="email" aria-required="true" />

// Loading state
<button disabled aria-busy="true">
  <Spinner /> Loading...
</button>

// Error message
<div aria-live="polite" className="text-error">
  Error message
</div>
```

#### Screen Reader Support

```typescript
// Visually hidden but accessible
const SrOnly = ({ children, className = "" }) => (
  <span className={`sr-only ${className}`}>
    {children}
  </span>
);

// CSS for sr-only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Usage Examples

### Complete Page Example

```typescript
// app/studio/page.tsx
import { GlassPanel } from "@/components/GlassPanel";
import { TokenMeter } from "@/components/TokenMeter";
import { ModelSelector } from "@/components/ModelSelector";

export default function StudioPage() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  const [tokenCount, setTokenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const models = [
    { slug: "gpt", name: "GPT-4", icon: GptIcon, color: "green" },
    { slug: "claude", name: "Claude 3.5", icon: ClaudeIcon, color: "purple" },
    { slug: "gemini", name: "Gemini 1.5", icon: GeminiIcon, color: "cyan" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-black tracking-tight text-white to-slate-400 bg-gradient-to-r bg-clip-text">
          Catalyst Studio
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Transform your prompts with AI-powered optimization
        </p>
      </div>

      {/* Token Meter */}
      <TokenMeter used={tokenCount} limit={100} />

      {/* Input Area */}
      <GlassPanel gradientBorder>
        <textarea
          className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 
            resize-none min-h-[150px]"
          placeholder="Enter your prompt here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        {/* Model Selector */}
        <div className="mt-4">
          <ModelSelector
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            models={models}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white 
              rounded-lg font-medium transition-colors duration-200 
              active:scale-95 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
            onClick={handleAnalyze}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
          <button
            className="px-4 py-2 glass-panel border border-glass-border hover:bg-white/5 
              text-white rounded-lg font-medium transition-colors duration-200"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </GlassPanel>

      {/* Results */}
      {result && (
        <GlassPanel className="p-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            Optimized Prompt
          </h2>
          <pre className="bg-slate-900 p-4 rounded-lg text-green-400 overflow-x-auto">
            {result}
          </pre>
        </GlassPanel>
      )}
    </div>
  );
}
```

### Component Composition Example

```typescript
// Complex card with multiple design elements
const FeatureCard = ({ title, description, icon, color = "primary" }) => (
  <GlassPanel
    className="p-6 hoverable group"
    hoverable
  >
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${color}-400/20 
        flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
        {React.cloneElement(icon, { className: `w-5 h-5 text-${color}-400` })}
      </div>
      
      {/* Content */}
      <div>
        <h3 className={`text-lg font-semibold text-${color}-400 mb-1`}>
          {title}
        </h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  </GlassPanel>
);

// Usage
<FeatureCard
  title="AI-Powered Analysis"
  description="Get intelligent suggestions for improving your prompts"
  icon={<SparklesIcon />}
  color="cyan"
/>
```

---

## Design Tokens Reference

### CSS Custom Properties

All design tokens are available as CSS custom properties:

```css
:root {
  /* Colors */
  --color-background-dark: #101922;
  --color-primary: #258cf4;
  --color-cyan-400: #06b6d4;
  --color-glass-base: rgba(16, 25, 34, 0.6);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-neon-primary: 0 0 20px rgba(37, 140, 244, 0.3);
  --shadow-neon-cyan: 0 0 30px rgba(6, 182, 212, 0.5);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
  
  /* Blur */
  --blur-sm: 4px;
  --blur-md: 12px;
  --blur-lg: 20px;
}
```

### Tailwind Theme Extension

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background colors
        "background-dark": "#101922",
        "background-darker": "#0a141b",
        
        // Glass colors
        "glass-base": "rgba(16, 25, 34, 0.6)",
        "glass-dark": "rgba(16, 25, 34, 0.9)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
        
        // Primary colors
        primary: "#258cf4",
        
        // Accent colors
        cyan: {
          400: "#06b6d4",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        display: ["Inter", "-apple-system", "sans-serif"],
        mono: ["Monaco", "Menlo", "monospace"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
};
```

---

## See Also

- [DESIGN.md](/DESIGN.md) - Original design system document
- [Component Library](./index.md) - All available components
- [Architecture Overview](../architecture/index.md)
- [Development Guide](../development/index.md)
