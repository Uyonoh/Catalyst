# Deployment Guide

This guide provides comprehensive instructions for deploying Catalyst in various environments, from local development to production deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Development Deployment](#development-deployment)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Deployment Platforms](#deployment-platforms)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18.x+ | JavaScript runtime |
| **pnpm** | 8.x+ | Package manager |
| **Git** | 2.x+ | Version control |
| **Docker** | 20.x+ | Containerization |
| **Supabase CLI** | Latest | Database management |

### System Requirements

- **Memory**: Minimum 4GB RAM (8GB+ recommended for production)
- **CPU**: 2+ cores
- **Storage**: 10GB+ free disk space
- **Network**: Stable internet connection
- **OS**: macOS, Linux, or Windows (WSL recommended for Windows)

### Installation

```bash
# Install required tools

# Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 18
nvm use 18

# pnpm
npm install -g pnpm

# Docker
echo "Install from https://www.docker.com/get-started"

# Supabase CLI
npm install -g supabase
```

---

## Environment Configuration

### Environment Variables

Catalyst requires several environment variables for proper operation. See the [`.env.example`](/.env.example) file for the complete template.

#### Core Configuration

```bash
# .env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-side configuration
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Session management
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# API Configuration
NODE_ENV=development
PORT=3000
```

#### External Service Integration

```bash
# Google GenAI
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Paystack (for Nigerian users)
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_WEBHOOK_SECRET=your-paystack-webhook-secret

# Stripe (for international users)
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### Feature Flags

```bash
# Enable/disable features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_HISTORY=true
NEXT_PUBLIC_ENABLE_PUBLIC_PROMPTS=false

# AI Provider configuration
NEXT_PUBLIC_DEFAULT_MODEL=CLAUDE_3_5_SONNET
NEXT_PUBLIC_AVAILABLE_MODELS=CLAUDE_3_5_SONNET,GPT_4O,GEMINI_1_5_PRO
```

#### Rate Limiting and Quotas

```bash
# Token limits
NEXT_PUBLIC_FREE_WEEKLY_LIMIT=50
NEXT_PUBLIC_BASIC_WEEKLY_LIMIT=200
NEXT_PUBLIC_PLUS_WEEKLY_LIMIT=1000
NEXT_PUBLIC_PRO_WEEKLY_LIMIT=5000

# Rate limiting
RATE_LIMIT_WINDOW=900000 # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuration Files

#### Database Configuration

```typescript
// app/lib/supabase.ts (client-side)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```typescript
// app/lib/supabase-server.ts (server-side)
import { createServerComponentClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createClient() {
  return createServerComponentClient({ 
    cookies: () => cookieStore 
  })
}
```

#### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'avatar.vercel.sh'],
    minimumCacheTTL: 60,
  },
  
  // Experimental features
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  
  // Compression
  compress: true,
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/legacy/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

#### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Development Deployment

### Local Development

#### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/catalyst.git
cd catalyst

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start the development server
pnpm dev

# 5. Open in browser
# Application will be available at http://localhost:3000
```

#### With Docker (Development)

```bash
# 1. Build the development image
docker-compose -f docker-compose.dev.yml build

# 2. Start the development environment
docker-compose -f docker-compose.dev.yml up

# 3. Access the application
docker-compose -f docker-compose.dev.yml logs -f
```

#### Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    command: pnpm dev
    
  # Add Supabase for local development
  supabase:
    image: supabase/postgres:15.1.0.73
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=yourpassword
    volumes:
      - supabase-data:/var/lib/postgresql/data

volumes:
  supabase-data:
```

### Hot Reloading

The development server supports automatic reloading:

- **Code changes**: Hot Module Replacement (HMR) for React components
- **Style changes**: CSS updates without page reload
- **Configuration changes**: Requires server restart
- **Environment changes**: Requires server restart

### Development Tools

#### Debugging

```bash
# Run with debug logging
pnpm dev --debug

# Debug with Node.js inspector
NODE_OPTIONS='--inspect' pnpm dev

# Debug specific components
# Add debug statements in your components
console.debug("Debug message", { data })
```

#### Testing

```bash
# Run all tests
pnpm test

# Run specific test files
pnpm test -- --testPathPattern=studio

# Run with coverage
pnpm test -- --coverage

# Run in watch mode
pnpm test -- --watch
```

---

## Staging Deployment

### Vercel Staging

#### Prerequisites

- Vercel account
- GitHub repository connected
- Environment variables configured in Vercel

#### Deployment Steps

```bash
# 1. Install Vercel CLI
pnpm add -g vercel

# 2. Link project to Vercel
vercel link

# 3. Configure project
vercel env pull

# 4. Deploy to staging
vercel --env preview

# 5. Promote to staging (optional)
vercel deploy --prod --env staging
```

#### Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "pnpm install",
        "zeroConfig": true
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "headers": {
        "Cache-Control": "no-cache"
      }
    }
  ]
}
```

### Supabase Staging Setup

```bash
# 1. Create a new Supabase project for staging
supabase projects create catalyst-staging

# 2. Configure staging environment
supabase db push --db-url postgresql://postgres:yourpassword@localhost:5432/postgres

# 3. Set up storage for staging
supabase storage create buckets --db-url postgresql://...

# 4. Configure auth for staging
supabase auth import users --db-url postgresql://...
```

---

## Production Deployment

### Production Requirements

- **Domain**: Custom domain with SSL certificate
- **Database**: Production-grade Supabase/PostgreSQL
- **Monitoring**: Health checks and logging
- **Backups**: Regular database backups
- **Scaling**: Horizontal scaling capability
- **Security**: Enhanced security measures

### Vercel Production Deployment

#### Setup

```bash
# 1. Configure production environment
vercel env add NEXT_PUBLIC_APP_URL https://catalyst.yourdomain.com
vercel env add NEXT_PUBLIC_SUPABASE_URL https://your-project-ref.supabase.co
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY your-supabase-anon-key

# 2. Add sensitive environment variables
vercel env add SUPABASE_SERVICE_ROLE_KEY --sensitive
ercel env add JWT_SECRET --sensitive
vercel env add ENCRYPTION_KEY --sensitive

# 3. Configure external services
vercel env add GOOGLE_AI_API_KEY --sensitive
vercel env add PAYSTACK_SECRET_KEY --sensitive
vercel env add STRIPE_SECRET_KEY --sensitive

# 4. Deploy to production
vercel --prod
```

#### Production Configuration

```json
// vercel.json for production
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "pnpm install --frozen-lockfile",
        "buildCommand": "pnpm build",
        "outputDirectory": ".next"
      }
    }
  ],
  "regions": ["iad1", "sfo1", "pdx1"],
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Production Docker Deployment

#### Dockerfile for Production

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build application
FROM deps AS builder
COPY . .
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["pnpm", "start"]
```

#### Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://catalyst.yourdomain.com
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
  # Load balancer (optional)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  node_modules:
  next_cache:
```

### Kubernetes Deployment

#### Deployment Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: catalyst-app
  labels:
    app: catalyst
spec:
  replicas: 3
  selector:
    matchLabels:
      app: catalyst
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: catalyst
    spec:
      containers:
      - name: catalyst
        image: your-registry/catalyst:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_APP_URL
          value: "https://catalyst.yourdomain.com"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: catalyst-secrets
              key: database-url
        - name: SUPABASE_SERVICE_ROLE_KEY
          valueFrom:
            secretKeyRef:
              name: catalyst-secrets
              key: supabase-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
      imagePullSecrets:
      - name: regcred
```

#### Service and Ingress

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: catalyst-service
spec:
  selector:
    app: catalyst
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: catalyst-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - catalyst.yourdomain.com
    secretName: catalyst-tls
  rules:
  - host: catalyst.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: catalyst-service
            port:
              number: 80
```

---

## Deployment Platforms

### Vercel (Recommended)

**Pros:**
- ✅ Zero-configuration deployment
- ✅ Automatic CI/CD
- ✅ Edge functions and ISR
- ✅ Built-in monitoring
- ✅ Easy scaling

**Cons:**
- ❌ Vendor lock-in
- ❌ Limited customization
- ❌ Cost at scale

**Setup:**
```bash
# Deploy to Vercel
vercel --prod
```

### AWS ECS

**Pros:**
- ✅ High scalability
- ✅ Full control over infrastructure
- ✅ AWS ecosystem integration
- ✅ Cost-effective at scale

**Cons:**
- ❌ Complex setup
- ❌ Requires infrastructure knowledge
- ❌ Manual monitoring setup

### Google Cloud Run

**Pros:**
- ✅ Serverless containers
- ✅ Automatic scaling
- ✅ Pay-per-use pricing
- ✅ Easy deployment

**Cons:**
- ❌ Cold start latency
- ❌ Limited configuration options
- ❌ Vendor lock-in

### Heroku

**Pros:**
- ✅ Easy deployment
- ✅ Managed services
- ✅ Free tier available
- ✅ Good for small projects

**Cons:**
- ❌ Limited scaling
- ❌ Costly at scale
- ❌ Slow build times

---

## Post-Deployment Checklist

### Immediate Checks

- [ ] Application starts without errors
- [ ] All environment variables are properly set
- [ ] Database connection is working
- [ ] External service integrations are functional
- [ ] Basic functionality works (authentication, prompt analysis)

### Functional Testing

- [ ] User registration and login
- [ ] Prompt analysis functionality
- [ ] History management
- [ ] Token tracking
- [ ] Payment processing (if enabled)
- [ ] Error handling and user feedback

### Performance Testing

- [ ] Page load times are acceptable (< 2s for main pages)
- [ ] API response times are acceptable (< 500ms for analysis)
- [ ] Memory usage is within expected ranges
- [ ] CPU usage is within expected ranges

### Security Checks

- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed
- [ ] Authentication is required for protected routes
- [ ] Rate limiting is working
- [ ] Error messages don't leak sensitive information

### Monitoring Setup

- [ ] Health check endpoints are accessible
- [ ] Logging is configured and working
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Performance monitoring is configured
- [ ] Alerting thresholds are set

---

## Monitoring and Maintenance

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseHealth();
    
    // Check external services
    const servicesHealth = await checkExternalServices();
    
    // Check cache
    const cacheHealth = await checkCacheHealth();
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth,
        services: servicesHealth,
        cache: cacheHealth,
      },
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

### Logging Configuration

```typescript
// app/lib/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: {
    service: 'catalyst',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }),
  ],
});

export default logger;
```

### Error Tracking

```typescript
// app/lib/error-tracking.ts
import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    release: process.env.npm_package_version,
    enabled: process.env.NODE_ENV === 'production',
  });
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { contexts: context });
  }
  console.error("Error:", error, context);
}

export function captureMessage(message: string, context?: Record<string, any>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, { contexts: context });
  }
  console.error("Message:", message, context);
}
```

### Performance Monitoring

```typescript
// app/api/metrics/route.ts
export async function GET() {
  const metrics = await collectMetrics();
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    metrics: {
      requests: metrics.requests,
      analysis: metrics.analysis,
      database: metrics.database,
      cache: metrics.cache,
      errors: metrics.errors,
    },
    system: {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpu: os.loadavg(),
    },
  });
}
```

---

## Rollback Procedures

### Vercel Rollback

```bash
# 1. List deployments
vercel deployments

# 2. Rollback to previous deployment
vercel rollback <deployment-id>

# 3. Redeploy previous version
vercel deploy --force
```

### Docker Rollback

```bash
# 1. List images
docker images

# 2. Rollback to previous image
docker-compose -f docker-compose.prod.yml up -d --build --no-cache

# 3. Or specify previous image
docker-compose -f docker-compose.prod.yml up -d --build --no-cache
```

### Kubernetes Rollback

```bash
# 1. View rollout history
kubectl rollout history deployment/catalyst-app

# 2. Rollback to previous revision
kubectl rollout undo deployment/catalyst-app

# 3. Rollback to specific revision
kubectl rollout undo deployment/catalyst-app --to-revision=2

# 4. Check rollout status
kubectl rollout status deployment/catalyst-app
```

### Database Rollback

```bash
# 1. Check migration history
supabase migration list

# 2. Rollback specific migration
supabase migration down --name <migration-name>

# 3. Restore from backup
pg_restore -U postgres -d catalyst -C -Fc backup_file.dump
```

---

## Deployment Scripts

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod --env preview'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Local Deployment Scripts

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "clean": "rm -rf .next node_modules",
    "docker:build": "docker build -t catalyst .",
    "docker:run": "docker run -p 3000:3000 catalyst",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up --build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up --build",
    "deploy": "vercel --prod",
    "deploy:staging": "vercel --env preview",
    "db:push": "supabase db push",
    "db:migrate": "supabase migration up",
    "db:rollback": "supabase migration down"
  }
}
```

---

## See Also

- [Architecture Overview](./architecture/index.md) - System design and structure
- [Getting Started](./getting-started/index.md) - Initial setup and configuration
- [Development Guide](./development/index.md) - Development best practices
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions