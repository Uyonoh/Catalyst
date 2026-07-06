# Coding Standards

This document outlines the coding standards and best practices for the Catalyst Workspace Studio project. Following these standards ensures consistency, maintainability, and high quality across the codebase.

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript Standards](#typescript-standards)
- [React Standards](#react-standards)
- [Next.js Standards](#nextjs-standards)
- [CSS and Styling Standards](#css-and-styling-standards)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Code Formatting](#code-formatting)
- [Testing Standards](#testing-standards)
- [Performance Standards](#performance-standards)
- [Security Standards](#security-standards)
- [Documentation Standards](#documentation-standards)
- [Git Standards](#git-standards)

---

## General Principles

### 1. Readability First

> "Code is read more often than it is written." - Guido van Rossum

- Write code that is easy to understand
- Use clear, descriptive names
- Keep functions and components small
- Add comments for complex logic

### 2. Consistency

- Follow existing patterns in the codebase
- When in doubt, match the style of surrounding code
- Use consistent conventions across the project

### 3. Simplicity

- Keep it simple, stupid (KISS principle)
- Avoid over-engineering
- Prefer straightforward solutions

### 4. Maintainability

- Write code that is easy to modify and extend
- Avoid tight coupling
- Follow SOLID principles where applicable

### 5. Performance

- Optimize for the user experience
- Avoid premature optimization
- Profile before optimizing

---

## TypeScript Standards

### Type Annotations

**Always use TypeScript types. Never use `any`.**

```typescript
// ✅ Good
const name: string = "Catalyst";
const count: number = 0;
const isActive: boolean = true;
const data: User[] = [];

// ❌ Bad
const name: any = "Catalyst";
const count = 0; // Missing type
let data; // Any type
```

### Interfaces vs. Types

| Use | When |
|-----|------|
| `interface` | For object shapes, especially public APIs |
| `type` | For unions, intersections, primitives, complex types |

```typescript
// ✅ Good - Use interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Good - Use type for unions
 type Status = "active" | "inactive" | "suspended";

// ✅ Good - Use type for complex types
type Maybe<T> = T | null | undefined;
```

### Type Exports

Always export types that are used across multiple files:

```typescript
// ✅ Good
export interface User {
  id: string;
  name: string;
}

// ✅ Good - Re-export from index file
export * from "./types/user";
```

### Generic Types

Use generics for reusable utility functions:

```typescript
// ✅ Good
function first<T>(array: T[]): T | undefined {
  return array[0];
}

// ✅ Good - Constrained generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Type Guards

Use type guards for runtime type checking:

```typescript
// ✅ Good
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data
  );
}

// ✅ Good - Using type predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

### Optional and Nullable Types

| Case | Syntax | When to Use |
|------|--------|--------------|
| Optional | `property?: Type` | Properties that may be undefined |
| Nullable | `property: Type | null` | Properties that may be explicitly null |
| Maybe | `property: Type | null | undefined` | Properties that may be either |

```typescript
// ✅ Good
interface User {
  name: string;
  email: string;
  bio?: string; // Optional
  deletedAt: Date | null; // Nullable
}
```

### Type Assertions

Avoid type assertions (`as` keyword). Use type guards instead:

```typescript
// ✅ Good - Type guard
if (typeof value === "string") {
  // value is now string
  processString(value);
}

// ⚠️ Caution - Only use when you're absolutely sure
const element = document.getElementById("app") as HTMLElement;

// ✅ Better - Optional chaining
const element = document.getElementById("app");
if (element) {
  // element is HTMLElement
}
```

### Enum vs. Union Types

Prefer union types over enums for better tree-shaking and interoperability:

```typescript
// ✅ Good - Union types
type Status = "active" | "inactive" | "pending";

// ⚠️ Use sparingly - Enums
// Only use when you need reverse mapping (Status["active"] -> "active")
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
}
```

---

## React Standards

### Component Structure

Use a consistent component structure:

```typescript
// ✅ Good - Recommended component structure
import React from "react";
import { ComponentProps } from "./types";

interface Props {
  // Component props
}

const ComponentName: React.FC<Props> = ({
  // Destructure props
}) => {
  // State hooks at the top
  const [state, setState] = useState();
  
  // Context hooks
  const context = useContext();
  
  // Custom hooks
  const result = useCustomHook();
  
  // Effects
  useEffect(() => { }, []);
  
  // Memoized values
  const memoized = useMemo();
  
  // Callback functions
  const handleClick = () => { };
  
  // Rendered JSX
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Component Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useCounter.ts`, `useWorkspace.ts` |
| Context | PascalCase with `Context` suffix | `AuthContext.tsx`, `WorkspaceContext.tsx` |
| Utility functions | camelCase | `formatDate.ts`, `calculateTotal.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL.ts`, `COLORS.ts` |

### Props

**Always type component props:**

```typescript
// ✅ Good - Typed props
interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  className = "",
}) => { ... };

// ✅ Good - Using React.HTMLAttributes for extension
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**Prop Types:**
- Use specific types, not `any`
- Use unions for limited set of values
- Mark optional props with `?`
- Provide default values when appropriate

### Children Props

For components that accept children, use `React.ReactNode`:

```typescript
// ✅ Good
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

// ✅ Good - For specific element types
interface ListProps {
  children: React.ReactElement<LiProps> | React.ReactElement<LiProps>[];
}
```

### Event Handlers

Prefix event handler props with `on`:

```typescript
// ✅ Good
interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => void | Promise<void>;
}
```

### Custom Hooks

**Hook Structure:**
```typescript
// ✅ Good - Custom hook structure
import { useState, useEffect, useCallback } from "react";

export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(c => c - 1);
  }, []);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return {
    count,
    increment,
    decrement,
    reset,
  };
}
```

**Hook Rules:**
1. Always start hook names with `use`
2. Only call hooks at the top level (not in loops, conditions, or nested functions)
3. Only call hooks from React functions or other custom hooks
4. Keep hooks focused on a single responsibility

### Context Usage

**Creating Context:**
```typescript
// ✅ Good - Typed context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Good - Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const login = async (credentials: LoginCredentials) => { ... };
  const logout = async () => { ... };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Good - Custom hook for consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Consuming Context:**
```typescript
// ✅ Good - Use custom hook
function UserProfile() {
  const { user, logout } = useAuth();
  ...
}

// ❌ Bad - Direct context consumption
// const context = useContext(AuthContext);
```

### Server Components vs. Client Components

**Server Components:**
- Default in Next.js 16
- No client-side interactivity
- Can access database directly
- Can use Node.js APIs
- Better for SEO

```typescript
// ✅ Good - Server component
async function UserList() {
  const users = await getUsers(); // Direct DB access
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Client Components:**
- Must be marked with `"use client"`
- Can use hooks and browser APIs
- Can have interactivity

```typescript
// ✅ Good - Client component
"use client";

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Next.js Standards

### File-based Routing

Follow Next.js App Router conventions:

```
app/
├── page.tsx              # Root page (/)
├── about/
│   └── page.tsx          # About page (/about)
├── blog/
│   ├── page.tsx          # Blog index (/blog)
│   └── [slug]/
│       └── page.tsx      # Dynamic blog post (/blog/some-post)
├── api/
│   └── users/
│       └── route.ts      # API endpoint (/api/users)
└── layout.tsx            # Root layout
```

### Route Groups

Use route groups `(group-name)` for organization without affecting URL:

```
app/
├── (marketing)/          # Marketing pages
│   ├── about/
│   │   └── page.tsx      # /about
│   └── contact/
│       └── page.tsx      # /contact
└── (auth)/               # Auth pages
    ├── login/
    │   └── page.tsx      # /login
    └── signup/
        └── page.tsx      # /signup
```

### Layouts

- Use `layout.tsx` for shared UI
- Layouts preserve state and don't re-render on navigation
- Use `template.tsx` for layouts that should re-render

```typescript
// ✅ Good - Layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Loading and Error States

Use special files for loading and error states:

```
app/
├── page.tsx
├── loading.tsx            # Loading UI
├── error.tsx              # Error UI
└── not-found.tsx          # 404 page
```

```typescript
// ✅ Good - Loading component
export default function Loading() {
  return <div>Loading...</div>;
}

// ✅ Good - Error component
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### API Routes

**Route Handlers:**
```typescript
// ✅ Good - GET handler
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const data = await getData();
  return NextResponse.json(data);
}

// ✅ Good - POST handler with validation
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate
  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }
  
  const result = await createItem(body);
  return NextResponse.json(result, { status: 201 });
}

// ✅ Good - Dynamic route segments
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = await getItemById(params.id);
  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(item);
}
```

**HTTP Methods:**
- `GET`: Retrieve data
- `POST`: Create data
- `PUT`/`PATCH`: Update data
- `DELETE`: Delete data
- `HEAD`: Headers only
- `OPTIONS`: CORS preflight

**Status Codes:**
| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 405 | Method Not Allowed | Wrong HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Server Actions

Use Server Actions for form submissions and data mutations:

```typescript
// ✅ Good - Server Action
"use server";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
  // Validation
  if (!name || !email) {
    throw new Error("Name and email are required");
  }
  
  // Database operation
  const user = await createUserInDB({ name, email });
  
  // Revalidate cache
  revalidatePath("/users");
  
  return user;
}
```

**Calling Server Actions:**
```typescript
// ✅ Good - From client component
"use client";

import { createUser } from "./actions";

export function UserForm() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await createUser(formData);
      // Success
    } catch (error) {
      // Handle error
    }
  };
  
  return <form action={handleSubmit}>...</form>;
}
```

### Metadata

Use Next.js metadata API for SEO:

```typescript
// ✅ Good - Static metadata
export const metadata: Metadata = {
  title: "Catalyst - AI Prompt Studio",
  description: "Transform your prompts with AI-powered optimization",
  keywords: ["AI", "prompts", "optimization"],
  openGraph: {
    title: "Catalyst",
    description: "AI Prompt Studio",
    images: "/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalyst",
    description: "AI Prompt Studio",
    images: "/og-image.png",
  },
};

// ✅ Good - Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

---

## CSS and Styling Standards

### Tailwind CSS

Catalyst uses Tailwind CSS 4 with the Glass & Neon design system.

**Utility Classes:**
- Use Tailwind utility classes for styling
- Keep class lists readable (max 4-5 classes per line)

```typescript
// ✅ Good - Readable class list
return (
  <button
    className={
      "px-4 py-2 bg-primary text-white rounded-lg " +
      "hover:bg-primary/80 transition-colors duration-200 " +
      "font-medium text-sm"
    }
  >
    Click me
  </button>
);

// ✅ Good - Multi-line for readability
return (
  <div
    className="glass-panel rounded-xl p-6"
    style={{ backdropFilter: "blur(12px)" }}
  >
    Content
  </div>
);
```

### Glass & Neon Design System

Follow the design tokens defined in `DESIGN.md`:

**Colors:**
```css
/* Glass & Neon color palette */
--background-dark: #101922;
--primary: #258cf4;
--cyan-400: #06b6d4;
--glass-base: rgba(16, 25, 34, 0.6);
--glass-border: rgba(255, 255, 255, 0.1);
```

**Glass Panel:**
```typescript
// ✅ Good - Glass panel component
const GlassPanel = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-glass-base border border-glass-border rounded-xl p-6 ${className}`}
    style={{ backdropFilter: "blur(12px)" }}
  >
    {children}
  </div>
);
```

**Neon Effects:**
```css
/* Neon glow effects */
.box-shadow: 0 0 20px rgba(37, 140, 244, 0.3);
.box-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
```

### CSS Modules

Avoid CSS Modules. Use Tailwind CSS or inline styles.

### Global Styles

Put global styles in `app/globals.css`:

```css
/* ✅ Good - Global styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
  
  body {
    @apply bg-background-dark text-white font-display;
  }
}

@layer components {
  .glass-panel {
    @apply bg-glass-base border border-glass-border rounded-xl;
    backdrop-filter: blur(12px);
  }
  
  .neon-glow {
    box-shadow: 0 0 20px rgba(37, 140, 244, 0.3);
  }
}
```

### Custom Properties

Use CSS custom properties for design tokens:

```css
/* ✅ Good - CSS custom properties */
:root {
  --color-primary: #258cf4;
  --color-cyan: #06b6d4;
  --color-background: #101922;
  --blur-amount: 12px;
  --transition-duration: 200ms;
}
```

---

## File Organization

### Grouping by Feature

Organize files by feature rather than by type:

```
app/
├── studio/
│   ├── page.tsx          # Studio page
│   ├── components/       # Studio-specific components
│   │   ├── PromptInput.tsx
│   │   └── ResultDisplay.tsx
│   ├── hooks/             # Studio-specific hooks
│   │   └── useAnalysis.ts
│   └── lib/               # Studio-specific utilities
│       └── promptHelpers.ts
└── settings/
    ├── page.tsx
    └── components/
        └── ProfileForm.tsx
```

### Colocation

Keep related files together:
- Components with their styles, tests, and types
- API routes with their handlers and schemas

```
app/
├── api/
│   └── users/
│       ├── route.ts      # Route handler
│       ├── schema.ts     # Request/response schemas
│       └── service.ts    # Business logic
└── components/
    └── Button/
        ├── Button.tsx    # Component
        ├── Button.test.tsx  # Tests
        └── index.ts       # Exports
```

### Index Files

Use `index.ts` files for clean exports:

```typescript
// ✅ Good - Index file for exports
// app/components/index.ts
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Modal } from "./Modal";

// ✅ Good - Re-export types
export type { ButtonProps } from "./Button";
```

---

## Naming Conventions

### Variables

| Type | Convention | Example |
|------|------------|---------|
| Regular variables | camelCase | `userName`, `tokenCount` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Boolean variables | Prefix with `is`, `has`, `can`, `should` | `isActive`, `hasPermission`, `canEdit` |
| Collections | Plural names | `users`, `items`, `models` |
| Promises | Suffix with `Promise` | `UserPromise`, `fetchDataPromise` |

```typescript
// ✅ Good
const userName = "John";
const MAX_RETRIES = 3;
const isLoading = true;
const users = [user1, user2];

// ❌ Bad
const UserName = "John";
const max_retries = 3;
const loading = true;
const userList = [user1, user2];
```

### Functions

| Type | Convention | Example |
|------|------------|---------|
| Regular functions | camelCase | `getUser`, `formatDate` |
| Async functions | camelCase with `Async` suffix (optional) | `fetchData`, `fetchDataAsync` |
| Factory functions | Prefix with `create` | `createUser`, `createStore` |
| Getter functions | Prefix with `get` | `getUser`, `getConfig` |
| Setter functions | Prefix with `set` | `setUser`, `setConfig` |
| Boolean functions | Prefix with `is`, `has`, `can`, `should` | `isValid`, `hasPermission` |
| Event handlers | Prefix with `handle` | `handleClick`, `handleSubmit` |

```typescript
// ✅ Good
function getUser(id: string) { ... }
async function fetchData() { ... }
function isValid(email: string): boolean { ... }
function handleClick(event: React.MouseEvent) { ... }

// ❌ Bad
function GetUser(id: string) { ... }
function fetch_data() { ... }
function valid(email: string) { ... }
function onClick(event: React.MouseEvent) { ... }
```

### Files

| Type | Convention | Example |
|------|------------|---------|
| TypeScript files | camelCase or PascalCase | `utils.ts`, `UserModel.ts` |
| React components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useCounter.ts`, `useWorkspace.ts` |
| Context | PascalCase with `Context` suffix | `AuthContext.tsx`, `ThemeContext.tsx` |
| Constants | SCREAMING_SNAKE_CASE | `API_CONFIG.ts`, `COLORS.ts` |
| Types | PascalCase or camelCase | `types.ts`, `UserTypes.ts` |
| Tests | Same as source file with `.test` suffix | `Button.test.tsx`, `utils.test.ts` |

---

## Code Formatting

### Prettier Configuration

The project uses Prettier for consistent formatting:

```json
// .prettierrc (if exists)
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Run Prettier:**
```bash
# Format all files
pnpm run pretty

# Or manually
pnpm exec prettier --write "./**/*.{js,jsx,mjs,cjs,ts,tsx,json}"
```

### ESLint Configuration

The project uses ESLint for code quality:

```bash
# Run ESLint
pnpm lint

# Fix issues
pnpm lint --fix
```

### Formatting Rules

**Indentation:**
- 2 spaces (no tabs)
- Consistent indentation throughout

**Line Length:**
- Maximum 80-100 characters per line
- Break long lines for readability

**Quotes:**
- Single quotes for strings
- Double quotes for JSX attributes

**Semicolons:**
- Required at the end of statements

**Commas:**
- Trailing commas in multi-line objects/arrays

**Braces:**
- Opening braces on the same line
- Closing braces on their own line

```typescript
// ✅ Good
if (condition) {
  doSomething();
}

function example(
  arg1: string,
  arg2: number,
) {
  // ...
}

const obj = {
  key1: value1,
  key2: value2,
};

// ❌ Bad
if (condition)
{
  doSomething();
}

function example(arg1: string, arg2: number) {
  // ...
}

const obj = {
  key1: value1,
  key2: value2
};
```

---

## Testing Standards

### Testing Framework

Catalyst uses Jest and React Testing Library:

```typescript
// ✅ Good - Test file structure
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test File Structure

- Test files have `.test.ts` or `.test.tsx` extension
- Colocate tests with the source files
- Use `describe` to group related tests
- Use `it` or `test` for individual test cases

### Test Naming

- Use "should" for test descriptions
- Be specific about what you're testing

```typescript
// ✅ Good
describe("Button", () => {
  it("should render with children", () => { ... });
  it("should call onClick when clicked", () => { ... });
  it("should be disabled when disabled prop is true", () => { ... });
});

// ❌ Bad
describe("Button", () => {
  it("works", () => { ... });
  it("does the thing", () => { ... });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Test edge cases and error conditions
- Test user interactions
- Test accessibility

**Run Tests:**
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test
pnpm test path/to/file.test.ts
```

---

## Performance Standards

### Code Performance

1. **Avoid premature optimization**: Write clean code first, optimize later
2. **Profile before optimizing**: Use tools to identify bottlenecks
3. **Memoize expensive calculations**: Use `useMemo`, `useCallback`

```typescript
// ✅ Good - Memoize expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// ✅ Good - Memoize event handlers
const handleClick = useCallback(() => {
  doExpensiveOperation();
}, [dep1, dep2]);
```

### React Performance

1. **Avoid unnecessary re-renders**: Use `React.memo`, `useMemo`, `useCallback`
2. **Use keys correctly**: Always use stable, unique keys
3. **Code-split**: Use dynamic imports for large components

```typescript
// ✅ Good - Memoize component
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
}: {
  data: Data;
}) {
  return <div>{/* ... */}</div>;
});

// ✅ Good - Dynamic import for code splitting
const HeavyComponent = dynamic(
  () => import("@/components/HeavyComponent"),
  { loading: () => <p>Loading...</p> }
);
```

### Bundle Size

- Keep dependencies to a minimum
- Prefer smaller libraries
- Use tree-shaking where possible

**Analyze Bundle:**
```bash
# Analyze bundle size
pnpm run build
pnpm run analyze  # If configured
```

### API Performance

1. **Use caching**: Cache API responses when appropriate
2. **Pagination**: Implement pagination for large datasets
3. **Rate limiting**: Protect against abuse

```typescript
// ✅ Good - API response caching
import { cache } from "react";

const getData = cache(async () => {
  const res = await fetch("https://api.example.com/data");
  return res.json();
});
```

---

## Security Standards

### Authentication and Authorization

1. **Always validate**: Never trust client input
2. **Use secure tokens**: JWT with strong secrets
3. **Implement proper auth**: Use Supabase Auth or similar

```typescript
// ✅ Good - Protected API route
export async function GET(request: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated logic
}
```

### Input Validation

Always validate and sanitize user input:

```typescript
// ✅ Good - Input validation
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

try {
  const user = userSchema.parse(requestBody);
  // user is now typed and validated
} catch (error) {
  // Handle validation error
}
```

### Sensitive Data

1. **Never log sensitive data**: Passwords, tokens, PII
2. **Use environment variables**: For secrets
3. **Encrypt sensitive data**: At rest and in transit

```typescript
// ✅ Good - Environment variables
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

// ✅ Good - Redact in logs
console.log("User created:", {
  id: user.id,
  name: user.name,
  // Never log: password, token, email, etc.
});

// ❌ Bad - Logging sensitive data
console.log("User created:", user); // Might include password
```

### Dependency Security

1. **Keep dependencies updated**: Regularly update to latest secure versions
2. **Audit dependencies**: Check for vulnerabilities
3. **Use trusted sources**: Only use well-maintained packages

**Audit Dependencies:**
```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Or use npm audit
npm audit
```

---

## Documentation Standards

### JSDoc Comments

Use JSDoc for all exported functions, classes, and complex logic:

```typescript
// ✅ Good - Function documentation
/**
 * Analyzes a user prompt using the configured AI model
 *
 * @param prompt - The user's input text to analyze
 * @param options - Configuration options for the analysis
 * @param options.model - AI model to use (defaults to user's preference)
 * @param options.mode - Processing mode (text, code, etc.)
 * @returns Promise resolving to the analysis result
 * @throws {AnalysisError} When the AI provider returns an error
 *
 * @example
 * ```typescript
 * const result = await analyzePrompt("Explain quantum computing", {
 *   model: "gpt-4",
 *   mode: "text",
 * });
 * ```
 */
async function analyzePrompt(
  prompt: string,
  options?: AnalysisOptions
): Promise<AnalysisResult> {
  // ...
}
```

### Component Documentation

Document component props with TypeScript interfaces:

```typescript
// ✅ Good - Component with documented props
/**
 * A button component with multiple variants and sizes
 */
interface ButtonProps {
  /** The button text or child elements */
  children: React.ReactNode;
  
  /** Button variant: primary, secondary, or tertiary */
  variant?: "primary" | "secondary" | "tertiary";
  
  /** Button size: small, medium, or large */
  size?: "small" | "medium" | "large";
  
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
```

### Markdown Documentation

For markdown files:
- Use consistent heading hierarchy
- Use fenced code blocks with language specification
- Use tables for structured data
- Link to related documentation

```markdown
# Page Title

## Section

### Subsection

- List item 1
- List item 2

```typescript
// Code example
const example = "code";
```

| Column 1 | Column 2 |
|----------|----------|
| Row 1    | Data     |
| Row 2    | Data     |
```

---

## Git Standards

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# ✅ Good commit messages
feat: add new analysis feature
fix: resolve login redirect issue
fix(api): handle null user in auth check
docs: update contributing guide
docs(readme): fix typo in setup instructions
refactor: extract workspace logic to context
chore: update dependencies
perf: optimize prompt parsing
style: fix header spacing
```

**Commit Message Structure:**
```
type(scope): description

[optional body - explain what and why]

[optional footer - issue references, breaking changes]
```

### Branches

**Naming Convention:**
```
<type>/<short-description>
```

| Type | Usage | Example |
|------|-------|---------|
| `feature/` | New features | `feature/add-dark-mode` |
| `fix/` | Bug fixes | `fix/login-error` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Refactoring | `refactor/auth-context` |
| `chore/` | Maintenance | `chore/update-deps` |
| `perf/` | Performance | `perf/optimize-api` |
| `test/` | Tests | `test/add-button-tests` |

### Pull Requests

**PR Title:** Follow commit message convention

**PR Description:**
- What the PR does
- Why it's needed
- Related issues
- Screenshots (if UI changes)
- Testing notes

**PR Labels:**
- `bug` - Bug fixes
- `enhancement` - New features
- `documentation` - Docs updates
- `refactor` - Code refactoring
- `breaking` - Breaking changes
- `WIP` - Work in progress

---

## See Also

- [Architecture Overview](architecture/index.md)
- [Development Guide](index.md)
- [Contributing Guidelines](contributing/index.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React Documentation](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
