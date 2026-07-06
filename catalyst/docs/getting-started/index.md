# Getting Started

This guide will help you set up the Catalyst Workspace Studio for local development and understand the basic configuration required to run the application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure Environment](#configure-environment)
  - [Set Up Supabase](#set-up-supabase)
  - [Set Up External Services](#set-up-external-services)
  - [Run the Development Server](#run-the-development-server)
- [Configuration Reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| Node.js | 18.x or 20.x | [nodejs.org](https://nodejs.org) |
| pnpm | 8.x or later | [pnpm.io](https://pnpm.io/installation) |
| Git | Latest | [git-scm.com](https://git-scm.com/downloads) |
| Terminal | Any modern terminal | - |

**Recommended:**
- macOS, Linux, or Windows (WSL2 for best experience)
- VS Code or similar IDE
- Docker (optional, for Supabase local development)

---

## Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone the repository
git clone https://github.com/your-org/catalyst.git
cd catalyst

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Configure your environment variables (see below)
# nano .env.local

# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

---

## Detailed Setup

### Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-org/catalyst.git

# Or via SSH (recommended)
git clone git@github.com:your-org/catalyst.git

# Navigate to the project directory
cd catalyst
```

### Install Dependencies

Catalyst uses [pnpm](https://pnpm.io) for package management:

```bash
# Install all dependencies
pnpm install

# This will install:
# - Next.js 16.1.6
# - React 19.2.3
# - TypeScript 5.x
# - Tailwind CSS 4
# - Supabase client libraries
# - Google GenAI SDK
# - And all other dependencies
```

**Note:** If you prefer npm or yarn, you can use them, but the project is optimized for pnpm workspaces (see `pnpm-workspace.yaml`).

### Configure Environment

Copy the example environment file and configure your settings:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the file with your editor
code .env.local  # VS Code
# or
nano .env.local  # Terminal
```

#### Required Environment Variables

```bash
# ===========================================
# NEXT_PUBLIC Variables (exposed to client)
# ===========================================

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-anon-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===========================================
# Server-Side Variables (only on server)
# ===========================================

# Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google GenAI Configuration
GOOGLE_GENAI_API_KEY=your-google-genai-api-key

# Paystack Configuration (for billing)
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# JWT Secret for session management
JWT_SECRET=your-strong-jwt-secret-at-least-32-characters

# Encryption Key for sensitive data
ENCRYPTION_KEY=your-32-character-encryption-key

# Database URL for direct connections (if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/catalyst
```

### Set Up Supabase

Catalyst uses Supabase for database, authentication, and storage. You'll need a Supabase project:

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Enter a project name (e.g., "Catalyst Dev")
4. Select a region
5. Click **Create Project**

#### 2. Get Your Connection Details

1. Go to your project dashboard
2. Navigate to **Settings > API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. Set Up Database Schema

Run the following SQL in your Supabase SQL Editor (Settings > SQL):

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at on profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Analysis history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  refined_prompt TEXT,
  model VARCHAR(100) NOT NULL,
  mode VARCHAR(50),
  controls JSONB DEFAULT '{}',
  result JSONB,
  token_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 100,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  plan_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  paystack_subscription_id VARCHAR(255),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions ON DELETE CASCADE,
  api_endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  token_count INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT NOW()::DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, api_endpoint, date)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(20) DEFAULT '#258cf4',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Models table
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  provider VARCHAR(100) NOT NULL,
  category_id UUID REFERENCES categories ON DELETE SET NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(20) DEFAULT '#258cf4',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts library table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  category_id UUID REFERENCES categories ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  model_id UUID REFERENCES models ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Enable Row-Level Security (RLS)

In Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY; -- Public data
ALTER TABLE models DISABLE ROW LEVEL SECURITY; -- Public data
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for analysis_history
CREATE POLICY "Users can view own history" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own history" ON analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON analysis_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for api_keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for usage
CREATE POLICY "Users can view own usage" ON usage
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for prompts
CREATE POLICY "Users can view public prompts" ON prompts
  FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can create own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);
```

### Set Up External Services

#### Google GenAI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google GenAI API**
4. Navigate to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy the API key and set it as `GOOGLE_GENAI_API_KEY` in your `.env.local`

**Important:** Restrict your API key to prevent abuse:
- Go to your API key details
- Under **Application restrictions**, select **HTTP referrers**
- Add your domain(s): `localhost:3000`, `your-production-domain.com`

#### Paystack (Optional - for Billing)

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up for an account (Nigeria-based, but works internationally)
3. Go to **Settings > API Keys & Webhooks**
4. Copy your **Test Secret Key** and **Test Public Key**
5. Set them in your `.env.local`:
   ```bash
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key
   PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   ```

**For Production:**
- Use live keys (remove `_test_` prefix)
- Set up webhooks in Paystack to point to your production endpoint

### Run the Development Server

```bash
# Start the Next.js development server
pnpm dev

# Or with specific port
pnpm dev --port 3001
```

The application will be available at:
- Local: [http://localhost:3000](http://localhost:3000)
- Network: [http://192.168.x.x:3000](http://192.168.x.x:3000) (if accessible)

**Development Features:**
- Hot module replacement (HMR)
- TypeScript type checking
- ESLint integration
- Error overlays with helpful messages

---

## Configuration Reference

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | ✅ Yes | Supabase anon key | `eyJxxx` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service key | `eyJxxx` |
| `GOOGLE_GENAI_API_KEY` | ✅ Yes | Google GenAI API key | `AIxxx` |
| `JWT_SECRET` | ✅ Yes | JWT signing secret | `random-32-char-string` |
| `ENCRYPTION_KEY` | ✅ Yes | Data encryption key | `32-char-encryption-key` |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Dev | App URL | `http://localhost:3000` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | ❌ No | Paystack public key | `pk_test_xxx` |
| `PAYSTACK_SECRET_KEY` | ❌ No | Paystack secret key | `sk_test_xxx` |

### Application Configuration

**Site Configuration** (`next.config.ts`):
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
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: true,
  },
};

export default nextConfig;
```

**Tailwind Configuration** (`tailwind.config.js`):
```javascript
// tailwind.config.js
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Catalyst Glass & Neon color palette
        "background-dark": "#101922",
        primary: "#258cf4",
        cyan: {
          400: "#06b6d4",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [forms, containerQueries],
};
```

---

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables

**Error:** `Error: Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined`

**Solution:** Ensure all required environment variables are set in `.env.local`:

```bash
# Check if .env.local exists
ls -la .env.local

# If not, copy the example
cp .env.example .env.local

# Then edit and add your values
```

#### 2. Supabase Connection Failed

**Error:** `Error: could not connect to server: Connection refused`

**Solution:** Verify your Supabase URL and key:

1. Check `.env.local` for typos
2. Verify the URL doesn't have a trailing slash
3. Test your connection:
   ```bash
   # Install curl if not present
   curl -i "https://your-project-ref.supabase.co/rest/v1/"
   -H "apikey: your-supabase-anon-key"
   -H "Authorization: Bearer your-supabase-anon-key"
   ```

#### 3. Module Not Found Errors

**Error:** `Module not found: Can't resolve '@supabase/ssr'`

**Solution:** Install missing dependencies:

```bash
# Install the missing package
pnpm add @supabase/ssr

# Or reinstall all dependencies
pnpm install --force
```

#### 4. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:** Find and kill the process using port 3000:

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
pnpm dev --port 3001
```

#### 5. TypeScript Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solution:** Run the TypeScript compiler to see all errors:

```bash
# Check for TypeScript errors
pnpm run build

# Or run TypeScript directly
npx tsc --noEmit
```

#### 6. Google GenAI API Errors

**Error:** `403 Forbidden` or `Invalid API Key`

**Solution:**

1. Verify your API key is correct
2. Check for IP restrictions
3. Ensure billing is enabled on your Google Cloud project
4. Try the API key directly:
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
   ```

### Debug Mode

For detailed debugging, you can enable verbose logging:

```bash
# Set DEBUG environment variable
DEBUG=nextjs:* pnpm dev

# Or for specific modules
DEBUG=catalyst:* pnpm dev
```

### Development Proxy

If you're running into CORS issues in development, check `proxy.ts`:

```typescript
// proxy.ts
const { createProxyMiddleware } = require('http-proxy-middleware');

export default function setupProxy(app: any) {
  // Proxy API requests to avoid CORS
  app.use(
    '/api/proxy',
    createProxyMiddleware({
      target: 'https://generativelanguage.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/proxy': '',
      },
    })
  );
}
```

---

## Next Steps

Once you have the application running locally:

1. **Explore the codebase**: Familiarize yourself with the [Architecture](architecture/index.md)
2. **Try the features**: Test the Studio, analysis, and other features
3. **Check the API**: Browse to `/api/health` to verify the server is running
4. **Read the contributing guide**: [Contributing Guidelines](contributing/index.md)

---

## See Also

- [Architecture Overview](architecture/index.md)
- [Contributor Guidelines](contributing/index.md)
- [Coding Standards](development/coding-standards.md)
- [Supabase Setup Guide](integrations/supabase.md)
