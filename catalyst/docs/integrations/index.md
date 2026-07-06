# Integrations

This section documents all third-party integrations used by Catalyst Workspace Studio. Each integration provides specific functionality that extends the application's capabilities.

## Table of Contents

- [Overview](#overview)
- [Supabase Integration](supabase.md)
- [Google GenAI Integration](google-genai.md)
- [Paystack Integration](paystack.md)
- [Integration Architecture](#integration-architecture)
- [Testing Integrations](#testing-integrations)
- [Troubleshooting](#troubleshooting)

---

## Overview

Catalyst integrates with several external services to provide a complete AI-powered workspace experience:

| Service | Purpose | Location |
|---------|---------|----------|
| **Supabase** | Database, Authentication, Storage | `app/lib/supabase-*.ts` |
| **Google GenAI** | AI Model Access (Gemini, etc.) | `app/lib/llm/` |
| **Paystack** | Payment Processing | `app/lib/paystack.ts` |

### Integration Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   API Routes    │  │   Server        │  │   Client        │  │
│  │   (app/api/)    │  │   Components    │  │   Components    │  │
│  └─────────┬────────┘  └─────────┬────────┘  └─────────┬────────┘  │
└────────────┼───────────────────────┼───────────────────┼──────────┘
              │                       │                   │
              ▼                       ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      Integration Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Supabase      │  │   Google GenAI  │  │   Paystack       │  │
│  │   Client        │  │   SDK           │  │   API            │  │
│  │   (app/lib/)    │  │   (app/lib/llm) │  │   (app/lib/)     │  │
│  └─────────┬────────┘  └─────────┬────────┘  └─────────┬────────┘  │
└────────────┼───────────────────────┼───────────────────┼──────────┘
              │                       │                   │
              ▼                       ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Supabase      │  │   Google Cloud  │  │   Paystack       │  │
│  │   (PostgreSQL)  │  │   (GenAI API)   │  │   (Payments)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Architecture

### Service Layer Pattern

All integrations follow a **service layer pattern** for consistency:

```
app/lib/
├── supabase-server.ts    # Server-side Supabase client
├── supabase-browser.ts   # Browser-side Supabase client
├── supabase.ts           # Unified export
├── paystack.ts          # Paystack service
├── llm/                 # LLM service layer
│   ├── router.ts        # Model routing logic
│   └── ...
└── engine/              # Analysis engine using LLM
    └── ...
```

### Client Configuration

Each integration has a **client configuration** that handles:
- Authentication
- Error handling
- Request/response formatting
- Rate limiting
- Retry logic

**Example Service Structure:**

```typescript
// Service interface
interface ServiceConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retries: number;
}

// Service class
class IntegrationService {
  private config: ServiceConfig;
  private client: AnyClient;

  constructor(config: ServiceConfig) {
    this.config = config;
    this.client = this.createClient();
  }

  private createClient() {
    // Create and configure client
  }

  public async method(params: Params) {
    try {
      // Validate input
      // Make request
      // Handle response
      // Return data
    } catch (error) {
      // Handle error
      // Retry if appropriate
      // Throw formatted error
    }
  }
}

// Singleton instance
export const service = new IntegrationService(config);
```

---

## Testing Integrations

### Test Strategy

1. **Unit Tests**: Test service methods in isolation
2. **Integration Tests**: Test with real API calls (in test environment)
3. **Mock Tests**: Test with mocked responses
4. **E2E Tests**: Test complete user flows

### Mocking Pattern

```typescript
// __mocks__/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const createClientMock = () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
});
```

### Test Examples

```typescript
// Integration test with mocks
describe('Supabase Integration', () => {
  beforeEach(() => {
    jest.mock('@/lib/supabase-server', () => ({
      createClient: jest.fn().mockResolvedValue(mockClient),
    }));
  });

  it('should fetch user data', async () => {
    const result = await getUser('user-id');
    expect(result).toEqual(mockUser);
  });
});
```

---

## Troubleshooting

### Common Integration Issues

#### 1. Authentication Failures

**Symptoms:**
- `401 Unauthorized` errors
- Authentication required errors

**Solutions:**
- Verify API keys are set in environment variables
- Check API key permissions
- Verify the authentication method (bearer token, API key, etc.)
- Check token expiration

#### 2. Rate Limiting

**Symptoms:**
- `429 Too Many Requests` errors
- Slow responses

**Solutions:**
- Implement request queuing
- Add exponential backoff for retries
- Cache responses where appropriate
- Monitor usage and set up alerts

#### 3. Network Errors

**Symptoms:**
- Connection refused
- Timeout errors
- DNS resolution failures

**Solutions:**
- Check network connectivity
- Verify service status
- Test with curl/postman
- Check firewall/proxy settings

#### 4. Data Format Mismatches

**Symptoms:**
- Type errors
- Undefined properties
- Parsing errors

**Solutions:**
- Validate API responses
- Use TypeScript interfaces for response types
- Implement data transformation
- Add error handling for malformed responses

### Debugging Tools

**Logging:**
```typescript
// Enable debug logging
import debug from 'debug';
const log = debug('catalyst:supabase');

// Log requests and responses
log('Request:', { method, url, body });
log('Response:', { status, data });

// Run with debug
DEBUG=catalyst:* pnpm dev
```

**cURL Testing:**
```bash
# Test Supabase connection
curl -i "https://your-project.supabase.co/rest/v1/"
  -H "apikey: your-anon-key"
  -H "Authorization: Bearer your-anon-key"

# Test Google GenAI
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"

# Test Paystack
curl -X POST https://api.paystack.co/transaction/initialize \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "amount": 10000}'
```

---

## Best Practices

### 1. Error Handling

```typescript
// Wrap API calls with error handling
async function safeApiCall(fn: () => Promise<any>) {
  try {
    return await fn();
  } catch (error) {
    // Log error
    console.error('API Error:', error);
    
    // Transform error for client
    if (error.code === 'PGRST116') {
      throw new Error('Invalid credentials');
    }
    if (error.code === '429') {
      throw new Error('Rate limit exceeded');
    }
    throw new Error('Service unavailable');
  }
}
```

### 2. Rate Limiting

```typescript
// Implement rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
});
```

### 3. Retry Logic

```typescript
// Exponential backoff retry
async function withRetry(fn: () => Promise<any>, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}
```

### 4. Caching

```typescript
// Simple in-memory cache
const cache = new Map();

async function cachedGet(key: string, fn: () => Promise<any>, ttl = 60000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  const data = await fn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

---

## Security Considerations

### 1. API Key Management

- **Never expose secrets** in client-side code
- Use environment variables for all secrets
- Rotate API keys regularly
- Use different keys for different environments

```typescript
// ✅ Good - Server-side only
async function getServerData() {
  const apiKey = process.env.SECRET_API_KEY; // Only available on server
  // Use apiKey
}

// ❌ Bad - Client-side exposure
const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Exposed to client
```

### 2. Input Validation

- Always validate external data
- Use schema validation (Zod, Yup, etc.)
- Sanitize user input

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});

async function createUser(data: unknown) {
  const validated = userSchema.parse(data);
  // Use validated data
}
```

### 3. Rate Limiting

- Implement per-user rate limits
- Use IP-based rate limiting for public endpoints
- Return appropriate headers

### 4. Monitoring

- Log API usage
- Monitor for unusual patterns
- Set up alerts for errors

---

## See Also

- [Supabase Integration](supabase.md)
- [Google GenAI Integration](google-genai.md)
- [Paystack Integration](paystack.md)
- [API Reference](../api/index.md)
- [Architecture Overview](../architecture/index.md)
