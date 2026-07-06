# Development Guide

This guide covers everything you need to know about developing the Catalyst Workspace Studio application, from setting up your environment to deploying changes.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Testing](#testing)
- [Build Process](#build-process)
- [Deployment](#deployment)

---

## Quick Start

If you're just getting started, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/catalyst.git
cd catalyst

# 2. Install dependencies
pnpm install

# 3. Set up environment (see Getting Started guide)
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
pnpm dev

# 5. Open http://localhost:3000 in your browser
```

---

## Development Environment

### Recommended Setup

| Tool | Purpose | Recommendation |
|------|---------|----------------|
| **Operating System** | Development platform | macOS, Linux, or Windows WSL2 |
| **IDE** | Code editor | VS Code with extensions |
| **Terminal** | Command line | iTerm2 (macOS), Terminal (Linux), PowerShell/WSL (Windows) |
| **Browser** | Testing | Chrome, Firefox, Edge |
| **Node.js** | Runtime | v18.x or v20.x LTS |
| **Package Manager** | Dependency management | pnpm 8.x |

### VS Code Extensions

**Recommended Extensions:**

| Extension | Purpose | ID |
|-----------|---------|----|
| ESLint | Linting | `dbaeumer.vscode-eslint` |
| Prettier | Code formatting | `esbenp.prettier-vscode` |
| TypeScript Toolbox | TypeScript utilities | `dsznajder.es7-react-js-snippets` |
| Tailwind CSS IntelliSense | Tailwind support | `bradlc.vscode-tailwindcss` |
| GitLens | Git supercharged | `eamodio.gitlens` |
| Code Spell Checker | Spell checking | `ewr.code-spell-checker` |
| Markdown Preview | Markdown preview | `shd101wyy.markdown-preview-enhanced` |
| Mermaid Preview | Mermaid diagram preview | `bierner.markdown-mermaid` |

### VS Code Settings

**Recommended settings.json:**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.wordWrap": "off",
  "editor.wrappingIndent": "same",
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Project Structure

```
catalyst/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   ├── api/                      # API route handlers
│   ├── components/               # React components
│   ├── context/                  # React Context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Business logic & utilities
│   ├── studio/                   # Studio workspace
│   ├── settings/                 # User settings
│   ├── history/                  # Analysis history
│   ├── workspace/                # Workspace pages
│   └── ...
│
├── docs/                        # Documentation (this folder)
│   ├── architecture/
│   ├── getting-started/
│   ├── development/
│   └── ...
│
├── public/                       # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── ...
│
├── supabase/                     # Supabase configurations
│   └── config.toml
│
├── node_modules/                 # Dependencies
├── .env                          # Environment variables (template)
├── .env.local                    # Local environment variables
├── .gitignore
├── DESIGN.md                     # Design system
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

### Key Directories

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `app/` | Application code | `page.tsx`, `layout.tsx`, API routes |
| `app/api/` | API endpoints | Route handlers, business logic |
| `app/components/` | UI components | Reusable components, design system |
| `app/context/` | State management | React Context providers |
| `app/hooks/` | Custom hooks | Reusable logic hooks |
| `app/lib/` | Business logic | Utilities, services, types |
| `public/` | Static assets | Images, fonts, etc. |
| `supabase/` | Database | Configurations, migrations |

---

## Common Tasks

### Adding a New Page

1. **Create the page file:**
   ```bash
   mkdir -p app/new-page
   touch app/new-page/page.tsx
   ```

2. **Add the page content:**
   ```typescript
   // app/new-page/page.tsx
   export default function NewPage() {
     return (
       <div>
         <h1>New Page</h1>
         <p>This is a new page.</p>
       </div>
     );
   }
   ```

3. **Add navigation link** (if needed):
   ```typescript
   // In your navigation component
   <Link href="/new-page">New Page</Link>
   ```

4. **Add metadata** (for SEO):
   ```typescript
   // app/new-page/page.tsx
   export const metadata: Metadata = {
     title: "New Page - Catalyst",
     description: "Description of the new page",
   };
   ```

### Adding a New API Endpoint

1. **Create the route file:**
   ```bash
   mkdir -p app/api/new-endpoint
   touch app/api/new-endpoint/route.ts
   ```

2. **Add the route handler:**
   ```typescript
   // app/api/new-endpoint/route.ts
   import { NextResponse } from "next/server";

   export async function GET(request: Request) {
     const data = { message: "Hello from new endpoint" };
     return NextResponse.json(data);
   }
   ```

3. **Test the endpoint:**
   ```bash
   curl http://localhost:3000/api/new-endpoint
   ```

### Adding a New Component

1. **Create the component file:**
   ```bash
   touch app/components/NewComponent.tsx
   ```

2. **Add the component code:**
   ```typescript
   // app/components/NewComponent.tsx
   "use client";

   import React from "react";

   interface NewComponentProps {
     title: string;
     children?: React.ReactNode;
   }

   export const NewComponent: React.FC<NewComponentProps> = ({
     title,
     children,
   }) => {
     return (
       <div className="glass-panel p-4 rounded-lg">
         <h2 className="text-xl font-bold mb-2">{title}</h2>
         {children}
       </div>
     );
   };
   ```

3. **Export from index file:**
   ```typescript
   // app/components/index.ts
   export { NewComponent } from "./NewComponent";
   ```

4. **Use the component:**
   ```typescript
   import { NewComponent } from "@/components";

   function Page() {
     return <NewComponent title="My Component">Content</NewComponent>;
   }
   ```

### Adding a New Hook

1. **Create the hook file:**
   ```bash
   touch app/hooks/useNewHook.ts
   ```

2. **Add the hook code:**
   ```typescript
   // app/hooks/useNewHook.ts
   "use client";

   import { useState, useEffect } from "react";

   export function useNewHook(initialValue: string = "") {
     const [value, setValue] = useState(initialValue);

     useEffect(() => {
       console.log("Value changed:", value);
     }, [value]);

     return {
       value,
       setValue,
     };
   }
   ```

3. **Use the hook:**
   ```typescript
   import { useNewHook } from "@/hooks/useNewHook";

   function Component() {
     const { value, setValue } = useNewHook("initial");
     return <input value={value} onChange={(e) => setValue(e.target.value)} />;
   }
   ```

### Adding Environment Variables

1. **Add to `.env.example`:**
   ```bash
   echo "NEW_VARIABLE=default_value" >> .env.example
   ```

2. **Add to `.env.local`:**
   ```bash
   echo "NEW_VARIABLE=your_value" >> .env.local
   ```

3. **Use in code:**
   ```typescript
   // For client-side (must be prefixed with NEXT_PUBLIC_)
   const clientVar = process.env.NEXT_PUBLIC_NEW_VARIABLE;

   // For server-side
   const serverVar = process.env.NEW_VARIABLE;
   ```

4. **Add type definitions (optional):**
   ```typescript
   // types/env.d.ts
   namespace NodeJS {
     interface ProcessEnv {
       NEW_VARIABLE: string;
     }
   }
   ```

---

## Debugging

### Client-side Debugging

**Browser DevTools:**
- Chrome: `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Opt+I` (macOS)
- Firefox: `F12` or `Ctrl+Shift+I`
- Edge: `F12` or `Ctrl+Shift+I`

**Useful Chrome DevTools Features:**
- **Elements**: Inspect and modify DOM
- **Console**: View logs, run JavaScript
- **Sources**: Debug JavaScript, set breakpoints
- **Network**: Monitor network requests
- **Performance**: Profile performance
- **Memory**: Check for memory leaks
- **Application**: View localStorage, cookies, service workers

**Debugging React:**

1. **React DevTools Extension**: Install from Chrome Web Store
2. **Inspect components**: View component hierarchy, props, state, hooks
3. **Highlight updates**: Show component re-renders
4. **Why did this render**: Track why components re-render

```bash
# Install React DevTools
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

### Server-side Debugging

**Node.js Debugger:**

1. **Start in debug mode:**
   ```bash
   # Using Node.js inspector
   NODE_OPTIONS='--inspect' pnpm dev
   
   # Or with specific port
   NODE_OPTIONS='--inspect=9229' pnpm dev
   ```

2. **Attach debugger:**
   - Chrome: Open `chrome://inspect`, click "Open dedicated DevTools for Node"
   - VS Code: Use the debugger with `launch.json`:
     ```json
     {
       "type": "node",
       "request": "attach",
       "name": "Next: Node",
       "skipFiles": ["<node_internals>/**"]
     }
     ```

**Debug Logs:**

```typescript
// Use console methods
console.log("Debug message");
console.warn("Warning message");
console.error("Error message");
console.table(data); // Pretty print arrays/objects
console.time("timer");
// ... code to measure
console.timeEnd("timer");

// Use DEBUG environment variable
import debug from "debug";

const log = debug("catalyst:api");
log("Processing request", { id: requestId });

// Run with debug
DEBUG=catalyst:* pnpm dev
```

### API Debugging

**Test API endpoints with curl:**

```bash
# GET request
curl http://localhost:3000/api/endpoint

# POST request with JSON body
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# POST with authentication
curl -X POST http://localhost:3000/api/protected \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"key": "value"}'

# Pretty print response
curl http://localhost:3000/api/endpoint | jq
```

**Test with Postman or Insomnia:**
- Import OpenAPI/Swagger specification (if available)
- Create collections for different endpoints
- Use environments for different configurations

### Error Handling Debugging

**Common error patterns:**

```typescript
// 1. API Error - Invalid request
try {
  const response = await fetch("/api/endpoint", { method: "POST", body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) {
    console.error("API Error:", result.error);
  }
} catch (error) {
  console.error("Network Error:", error);
}

// 2. TypeScript Error - Type mismatch
// Check the TypeScript error message for details
// Often means a type annotation is wrong or missing

// 3. Runtime Error - Undefined/null
// Check if the value exists before accessing properties
if (user?.profile?.avatar) {
  // Safe to access
}

// 4. React Error - Invalid hook usage
// Make sure hooks are called at the top level
// Make sure client components have "use client"
```

### Database Debugging

**Supabase Dashboard:**
- Go to [supabase.com/dashboard](https://app.supabase.com/)
- Navigate to your project
- Use the **Table Editor** to view and edit data
- Use the **SQL Editor** to run custom queries

**Query Debugging:**

```typescript
// Log queries in development
import { createClient } from "@/lib/supabase-server";

const supabase = createClient();

// Log the query
console.log("Fetching user with ID:", userId);

const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();

if (error) {
  console.error("Query Error:", error);
}
```

---

## Testing

### Test Setup

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test path/to/file.test.ts

# Run tests in watch mode
pnpm test --watch
```

### Test Structure

```
app/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx      # Component tests
app/
├── lib/
│   └── utils.ts
│   └── utils.test.ts            # Utility tests
app/
└── api/
    └── users/
        ├── route.ts
        └── route.test.ts         # API tests
```

### Test Examples

**Component Test:**

```typescript
// app/components/Button/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("should render with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

**Utility Test:**

```typescript
// app/lib/utils.test.ts
import { formatDate, truncate } from "./utils";

describe("utils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("January 15, 2024");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hi", 10)).toBe("Hi");
    });
  });
});
```

**API Test:**

```typescript
// app/api/users/route.test.ts
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  getUsers: jest.fn().mockResolvedValue([{ id: 1, name: "John" }]),
  createUser: jest.fn().mockResolvedValue({ id: 1, name: "John" }),
}));

describe("GET /api/users", () => {
  it("should return users", async () => {
    const request = new NextRequest("http://localhost:3000/api/users");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([{ id: 1, name: "John" }]);
  });
});

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const body = JSON.stringify({ name: "Jane" });
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ id: 1, name: "Jane" });
  });
});
```

---

## Build Process

### Development Build

```bash
# Start development server (automatic builds)
pnpm dev

# Or manually build for development
pnpm run build:dev
```

### Production Build

```bash
# Build for production
pnpm run build

# This will:
# 1. Run TypeScript compiler
# 2. Optimize images
# 3. Minify CSS and JavaScript
# 4. Generate static pages
# 5. Create production-ready output in .next/
```

### Build Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    // Optimize images up to 1MB
    maximumFileSize: "1MB",
  },

  // Experimental features
  experimental: {
    serverActions: true,
    // Other experimental features
  },

  // Output configuration
  output: "standalone", // For self-contained deployments
  // output: 'export', // For static exports

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,
};

export default nextConfig;
```

---

## Deployment

### Development Deployment

For testing deployments in a staging environment:

```bash
# 1. Build the application
pnpm run build

# 2. Start the production server locally
pnpm start

# 3. Test at http://localhost:3000
```

### Production Deployment

#### Vercel (Recommended)

Catalyst is optimized for Vercel deployment:

1. **Connect your repository** to Vercel
2. **Import the project**
3. **Configure environment variables**
4. **Deploy**

**Vercel Configuration (`vercel.json`):**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": { "installCommand": "pnpm install" }
    }
  ],
  "routes": [
    {
      "src": "/api/webhooks/(.*)",
      "dest": "/api/webhooks/$1"
    }
  ]
}
```

#### Other Platforms

**Netlify:**

```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = ".next"
  functions = ".next/server/functions"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**AWS Amplify:**

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - pnpm install
    build:
      commands:
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Docker:**

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public ./public/
COPY --from=builder /app/package.json ./package.json/
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml/
COPY --from=builder /app/node_modules ./node_modules/

# Run the server
CMD ["pnpm", "start"]
```

### Post-Deployment Checklist

- [ ] Test all major features
- [ ] Verify API endpoints
- [ ] Check error handling
- [ ] Test authentication flow
- [ ] Verify environment variables are set correctly
- [ ] Monitor logs for errors
- [ ] Set up monitoring (if available)

---

## See Also

- [Architecture Overview](architecture/index.md)
- [Coding Standards](coding-standards.md)
- [Getting Started](getting-started/index.md)
- [Contributing Guidelines](contributing/index.md)
- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Documentation](https://vercel.com/docs)
