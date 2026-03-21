# Catalyst Design System

This document outlines the **Glass & Neon** aesthetic of the Catalyst Prompt Studio, defining the visual language, core components, and design tokens that drive our premium user experience.

## Aesthetic Philosophy: Glass & Neon

Catalyst is built on a sophisticated, multi-layered aesthetic that combines transparency with vibrant energy:

- **Glassmorphism**: Transparent, frosted-glass surfaces that provide depth and clarity without cluttering the visual field.
- **Neon Glow**: High-contrast, glowing accents and semi-transparent borders that guide user focus and signify active states.
- **Dynamic Energy**: Subtle animations and micro-interactions that make the interface feel alive and responsive.

---

## Color Palette

Our palette is optimized for dark mode, utilizing deep navy-slate backgrounds paired with vibrant, energetic foreground accents.

### Core Tokens
- **Background Dark**: `#101922` (The foundation for all pages)
- **Primary Color**: `#258cf4` (Catalyst Blue - used for primary calls to action)
- **Cyan Accent**: `#06b6d4` (Standard glow color and secondary highlight)
- **Glass Base**: `rgba(16, 25, 34, 0.6)` (Background color for standard panels)
- **Glass Border**: `rgba(255, 255, 255, 0.1)` (Fine hairline borders for definitions)

### AI Model Accents (Semantic Mapping)
Each AI model is assigned a unique color signature to help users intuitively identify the active engine:

| Model Identity | Color Token | Representative Symbol |
| :--- | :--- | :--- |
| **Midjourney** | `cyan-400` | Palette / Creative Arts |
| **Claude** | `purple-400` | Auto Awesome / Logic |
| **GPT-4** | `green-400` | Chat / Conversation |
| **Llama** | `orange-400` | Terminal / Efficiency |
| **DALL-E** | `pink-400` | Image / Generation |
| **Stable Diffusion** | `blue-400` | Filter Frames / Precision |

---

## Typography

We use modern, clean typography designed for maximum readability across all screen sizes and contexts.

- **Typeface**: `Inter, sans-serif` (Universal font for display and body)
- **Iconography**: `Material Symbols Outlined` (Consistent, geometric iconography)
- **Headlines**: `font-black`, `tracking-tight`, with a `white` to `slate-400` gradient for an industrial feel.
- **Body Text**: `slate-200` for primary content; `slate-400` for secondary metadata and labels.

---

## Visual Components

### Glass Panels
The foundational element of the Catalyst layout. All panels use a `12px` backdrop blur for a premium look.

- **Variants**: 
  - `glass-panel`: Standard (60% opacity)
  - `glass-panel-dark`: High-contrast (90% opacity) for dropdowns and overlays.
- **Modifiers**:
  - `hoverable`: Subtle `hover:bg-white/5` effect for interactive cards.
  - `gradientBorder`: Outer neon gradient glow (`from-cyan-500` to `primary`) with `blur-md` for high-importance interface blocks.

### Neon Effects
- **Standard Neon**: `0 0 20px rgba(37, 140, 244, 0.3)`
- **Strong Neon**: `0 0 30px rgba(6, 182, 212, 0.5)`
- **Dynamic Glow**: Animated glows for indicating active analysis or real-time optimization.

---

## Motion & Interaction

State changes should always be supported by fluid transitions:

- **Entry**: `fadeIn` (0.2s duration) with a subtle `translateY` offset.
- **Analysis States**: `animate-pulse` or `pulseGlow` for background gradients during active computation.
- **Hover states**: Transform actions with `active:scale-95` and `hover:-translate-y-0.5` for tactile feedback.

---

## Layout Principles

1. **Hierarchy through Depth**: Use varying levels of blur and opacity to indicate stacking order.
2. **Mobile Optimized Accessibility**: Inputs and controls adapt from large-format desktop buttons to compact, icon-only mobile actions.
3. **Data Clarity**: Functional outputs (like Refined Prompts or Code blocks) are separated by distinct background changes (`code-preview` style).