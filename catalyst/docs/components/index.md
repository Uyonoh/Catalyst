# Component Library

This document catalogs all React components in the Catalyst Workspace Studio. Each component is documented with its props, usage examples, and visual specifications following the Glass & Neon design system.

## Table of Contents

- [Component Organization](#component-organization)
- [Core Components](#core-components)
- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [History Components](#history-components)
- [Feature Components](#feature-components)
- [Usage Guidelines](#usage-guidelines)

---

## Component Organization

Components are organized in the `app/components/` directory:

```
app/components/
├── ClickFeedbackProvider.tsx    # Global click feedback context
├── DesktopNav.tsx              # Desktop navigation bar
├── Footer.tsx                  # Site footer
├── GlassPanel.tsx             # Core glass panel component
├── Header.tsx                 # Site header
├── Pagination.tsx             # Pagination component
├── Skeleton.tsx               # Loading skeleton component
├── TokenMeter.tsx             # Token usage meter
├── history/                    # History-related components
│   ├── HistoryCard.tsx
│   ├── HistoryFilters.tsx
│   ├── HistoryList.tsx
│   └── Notification.tsx
└── ...
```

---

## Core Components

### GlassPanel

**The foundational UI primitive for Catalyst's Glass & Neon aesthetic.**

**Location:** `app/components/GlassPanel.tsx`

**Description:**
A versatile panel component that provides the glassmorphism effect with optional gradient borders and hover states. All Catalyst UI is built on top of this component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Panel content |
| `className` | `string` | `""` | Additional CSS classes |
| `hoverable` | `boolean` | `false` | Enable hover effect (subtle light overlay) |
| `gradientBorder` | `boolean` | `false` | Enable gradient neon border effect |
| `onClick` | `() => void` | - | Click handler |

**Usage:**

```typescript
import GlassPanel from "@/components/GlassPanel";

// Basic panel
<GlassPanel>
  <p>This is a standard glass panel</p>
</GlassPanel>

// Hoverable panel
<GlassPanel hoverable>
  <button>Click me</button>
</GlassPanel>

// Panel with gradient border
<GlassPanel gradientBorder>
  <p>This panel has a beautiful neon gradient border</p>
</GlassPanel>

// Custom styled panel
<GlassPanel className="p-8 m-4">
  <p>Custom padding and margin</p>
</GlassPanel>

// Clickable panel
<GlassPanel onClick={() => console.log("Clicked")} hoverable>
  <p>Clickable panel</p>
</GlassPanel>
```

**Visual Properties:**

| Property | Value | Notes |
|----------|-------|-------|
| Background | `rgba(16, 25, 34, 0.6)` | Semi-transparent dark base |
| Blur | `12px` | CSS `backdrop-filter: blur(12px)` |
| Border | `1px solid rgba(255, 255, 255, 0.1)` | Subtle white border |
| Border Radius | `12px` | `rounded-xl` in Tailwind |
| Gradient Border | `from-cyan-500 to-primary` | When `gradientBorder` is true |
| Hover Effect | `bg-white/5` | Subtle white overlay on hover |

**Source Code:**

```typescript
// app/components/GlassPanel.tsx
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  gradientBorder?: boolean;
  onClick?: () => void;
}

export default function GlassPanel({
  children,
  className = "",
  hoverable = false,
  gradientBorder = false,
  onClick,
}: GlassPanelProps) {
  const baseClasses = `${className} ${hoverable ? "hover:bg-white/5 transition-colors" : ""}`;

  if (gradientBorder) {
    return (
      <div className="relative group h-full" onClick={onClick}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className={`relative glass-panel rounded-xl h-full ${baseClasses}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-xl ${baseClasses}`} onClick={onClick}>
      {children}
    </div>
  );
}
```

**CSS Requirements:**

The `.glass-panel` class must be defined in your global CSS:

```css
/* app/globals.css */
.glass-panel {
  background: rgba(16, 25, 34, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
```

---

### TokenMeter

**Displays token usage and remaining quota.**

**Location:** `app/components/TokenMeter.tsx`

**Description:**
A visual meter that shows the user's token consumption. Changes color based on usage level (green, yellow, red).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (no explicit props) | - | - | Uses workspace context |

**Usage:**

```typescript
import TokenMeter from "@/components/TokenMeter";

// In your component (must be within WorkspaceProvider)
function StudioPage() {
  return (
    <div>
      <TokenMeter />
    </div>
  );
}
```

**Features:**
- Shows current token count and limit
- Color-coded based on usage percentage:
  - Green: < 80% used
  - Yellow: 80-95% used
  - Red: > 95% used
- Smooth transitions when token count changes

**Visual States:**
```
┌─────────────────────────────────────────────┐
│ Tokens Used                    42/100      │
├─────────────────────────────────────────────┤
│ ████████████████████░░░░░░░░░░░░░░░░░░ 42% │  ← Green (normal)
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Tokens Used                    85/100      │
├─────────────────────────────────────────────┤
│ ████████████████████████████░░░░░░ 85%   │  ← Yellow (warning)
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Tokens Used                    98/100      │
├─────────────────────────────────────────────┤
│ ████████████████████████████████░░ 98%   │  ← Red (danger)
└─────────────────────────────────────────────┘
```

---

### ClickFeedbackProvider

**Provides global click feedback animations.**

**Location:** `app/components/ClickFeedbackProvider.tsx`

**Description:**
A context provider that adds ripple click effects to all interactive elements. Wraps the entire application.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Application content |

**Usage:**

```typescript
// app/layout.tsx
import { ClickFeedbackProvider } from "@/components/ClickFeedbackProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClickFeedbackProvider>
          {children}
        </ClickFeedbackProvider>
      </body>
    </html>
  );
}
```

**Features:**
- Adds ripple animation on click for all buttons and interactive elements
- Configurable ripple color and duration
- Automatically handles click positioning

---

### Skeleton

**Placeholder loading component.**

**Location:** `app/components/Skeleton.tsx`

**Description:**
Displays animated skeleton placeholders while content is loading.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `variant` | `"text"` \| `"circular"` \| `"rectangular"` | `"text"` | Skeleton shape |
| `width` | `string` | `"100%"` | Width of skeleton |
| `height` | `string` | `"1em"` | Height of skeleton |
| `animation` | `boolean` | `true` | Enable pulsing animation |

**Usage:**

```typescript
import Skeleton from "@/components/Skeleton";

// Text skeleton
<Skeleton className="w-32" />

// Circular skeleton (for avatars)
<Skeleton variant="circular" className="w-10 h-10" />

// Rectangular skeleton (for images/cards)
<Skeleton variant="rectangular" className="w-full h-64" />

// Multiple lines
<div className="space-y-2">
  <Skeleton className="w-full" />
  <Skeleton className="w-3/4" />
  <Skeleton className="w-1/2" />
</div>
```

**Animation:**
```css
/* Pulsing animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, 
    rgba(37, 140, 244, 0.2) 50%, rgba(6, 182, 212, 0.2) 100%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## Layout Components

### Header

**Site header with navigation and branding.**

**Location:** `app/components/Header.tsx`

**Description:**
The main header component displayed at the top of every page. Includes branding, navigation, and user actions.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (no props) | - | - | Uses global state |

**Features:**
- Logo/branding
- Navigation links
- User avatar/dropdown
- Mobile menu toggle
- Responsive design

**Usage:**

```typescript
// app/layout.tsx
import { Header } from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

---

### Footer

**Site footer with links and information.**

**Location:** `app/components/Footer.tsx`

**Description:**
The footer component displayed at the bottom of every page. Includes links, copyright, and social media.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (no props) | - | - | Static content |

**Usage:**

```typescript
// app/layout.tsx
import { Footer } from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

### DesktopNav

**Desktop navigation bar.**

**Location:** `app/components/DesktopNav.tsx`

**Description:**
Horizontal navigation bar for desktop viewports. Part of the Header component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| (no props) | - | - | Uses navigation context |

**Features:**
- Navigation links with active states
- Hover effects with neon glow
- Responsive to viewport size
- Integration with auth state

---

### Pagination

**Pagination controls for lists.**

**Location:** `app/components/Pagination.tsx`

**Description:**
Pagination component for navigating through paginated content.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current page number |
| `totalPages` | `number` | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `showPageNumbers` | `boolean` | `true` | Show page number buttons |
| `showFirstLast` | `boolean` | `true` | Show first/last page buttons |

**Usage:**

```typescript
import Pagination from "@/components/Pagination";

function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div>
      {/* History list */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

**Visual Appearance:**
```
┌─────────────────────────────────────────────┐
│  <<  <  1  2  [3]  4  5  >  >>             │
└─────────────────────────────────────────────┘
      ↑           ↑           ↑
      ↑           ↑           ↑
   First      Pages      Last
   Previous               Next
```

---

## History Components

Components related to analysis history management.

### HistoryCard

**Individual history item card.**

**Location:** `app/components/history/HistoryCard.tsx`

**Description:**
Displays a single analysis history item with prompt, result, and metadata.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `historyItem` | `HistoryItem` | - | History data object |
| `onDelete` | `(id: string) => void` | - | Delete handler |
| `onCopy` | `(id: string) => void` | - | Copy handler |

**Usage:**

```typescript
import HistoryCard from "@/components/history/HistoryCard";

function HistoryList({ items }) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <HistoryCard
          key={item.id}
          historyItem={item}
          onDelete={handleDelete}
          onCopy={handleCopy}
        />
      ))}
    </div>
  );
}
```

**Data Structure:**

```typescript
interface HistoryItem {
  id: string;
  userId: string;
  prompt: string;
  refinedPrompt: string;
  model: string;
  mode: string;
  controls: Record<string, any>;
  result: any;
  tokenCount: number;
  createdAt: Date;
}
```

---

### HistoryList

**List of history items.**

**Location:** `app/components/history/HistoryList.tsx`

**Description:**
Renders a list of HistoryCard components with proper layout and empty states.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `HistoryItem[]` | - | Array of history items |
| `onDelete` | `(id: string) => void` | - | Delete handler |
| `onCopy` | `(id: string) => void` | - | Copy handler |
| `isLoading` | `boolean` | `false` | Loading state |
| `emptyMessage` | `string` | - | Message to show when empty |

---

### HistoryFilters

**Filter controls for history list.**

**Location:** `app/components/history/HistoryFilters.tsx`

**Description:**
Provides filtering options (by model, date, etc.) for the history list.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `HistoryFilters` | - | Current filter values |
| `onFilterChange` | `(filters: HistoryFilters) => void` | - | Filter change handler |
| `models` | `Model[]` | - | Available models for filtering |

---

### Notification

**Toast notification component.**

**Location:** `app/components/history/Notification.tsx`

**Description:**
Displays temporary notification messages (success, error, info).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | - | Notification message |
| `type` | `"success"` \| `"error"` \| `"info"` \| `"warning"` | `"info"` | Notification type |
| `duration` | `number` | `3000` | Auto-dismiss duration (ms) |
| `onDismiss` | `() => void` | - | Manual dismiss handler |
| `show` | `boolean` | `false` | Visibility control |

**Usage:**

```typescript
import Notification from "@/components/history/Notification";

function App() {
  const [notification, setNotification] = useState(null);

  const showSuccess = () => {
    setNotification({
      message: "Prompt copied to clipboard!",
      type: "success"
    });
  };

  return (
    <>
      <button onClick={showSuccess}>Copy</button>
      <Notification
        show={!!notification}
        message={notification?.message}
        type={notification?.type}
        onDismiss={() => setNotification(null)}
      />
    </>
  );
}
```

**Visual Styles:**

```
┌─────────────────────────────────────┐
│ ✓  Success! Action completed        │  ← Green background
├─────────────────────────────────────┤
│     (auto-dismisses after 3s)        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✗  Error! Something went wrong       │  ← Red background
├─────────────────────────────────────┤
│     (auto-dismisses after 5s)        │
└─────────────────────────────────────┘
```

---

## Usage Guidelines

### Component Selection

| Use Case | Recommended Component |
|----------|----------------------|
| Container with depth | `GlassPanel` |
| Loading placeholder | `Skeleton` |
| Token display | `TokenMeter` |
| Page header | `Header` |
| Page footer | `Footer` |
| Navigation | `DesktopNav` |
| List pagination | `Pagination` |
| History item | `HistoryCard` |
| History list | `HistoryList` |
| Filters | `HistoryFilters` |
| User feedback | `Notification` |

### Composition Patterns

**Card with GlassPanel:**
```typescript
<GlassPanel hoverable gradientBorder className="p-6">
  <h3 className="text-xl font-bold mb-2">Card Title</h3>
  <p className="text-slate-400">Content</p>
</GlassPanel>
```

**Loading State:**
```typescript
{isLoading ? (
  <Skeleton className="w-full h-64" />
) : (
  <ActualContent />
)}
```

**List with Pagination:**
```typescript
<div className="space-y-4">
  {items.map(item => (
    <HistoryCard key={item.id} historyItem={item} />
  ))}
</div>
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### Best Practices

1. **Always use GlassPanel for containers**: This maintains visual consistency
2. **Use semantic component names**: Prefer `ButtonPrimary` over `BlueButton`
3. **Keep components focused**: Each component should have a single responsibility
4. **Compose over configure**: Build complex UIs by composing simple components
5. **Use Tailwind classes**: Avoid inline styles for maintainability
6. **Respect the design tokens**: Use the color system and spacing scale

---

## Component Development

### Creating a New Component

1. **Create the file**:
   ```bash
   touch app/components/NewComponent.tsx
   ```

2. **Add TypeScript interface**:
   ```typescript
   interface NewComponentProps {
     // Define props with TypeScript types
     children?: React.ReactNode;
     className?: string;
     variant?: "primary" | "secondary";
   }
   ```

3. **Implement the component**:
   ```typescript
   export const NewComponent: React.FC<NewComponentProps> = ({
     children,
     className = "",
     variant = "primary",
   }) => {
     return (
       <div className={`glass-panel rounded-xl p-4 ${className}`}>
         {children}
       </div>
     );
   };
   ```

4. **Add to exports**:
   ```typescript
   // app/components/index.ts
   export { NewComponent } from "./NewComponent";
   ```

5. **Document the component**:
   - Add JSDoc comments
   - Document props and usage
   - Add examples

### Component Testing

```typescript
// NewComponent.test.tsx
import { render, screen } from "@testing-library/react";
import { NewComponent } from "./NewComponent";

describe("NewComponent", () => {
  it("renders children", () => {
    render(<NewComponent>Test</NewComponent>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<NewComponent className="custom-class">Test</NewComponent>);
    expect(screen.getByText("Test")).toHaveClass("custom-class");
  });
});
```

---

## See Also

- [Design System Reference](./design-system.md) - Visual tokens and guidelines
- [Development Guide](../development/index.md) - Development workflow
- [Coding Standards](../development/coding-standards.md) - Component coding standards
- [Architecture Overview](../architecture/index.md)
