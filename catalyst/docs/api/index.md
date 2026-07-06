# API Reference

This document provides comprehensive documentation for all API endpoints in the Catalyst Workspace Studio. The API follows RESTful conventions and uses JSON for request/response formats.

## Table of Contents

- [Base URL & Authentication](#base-url--authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints by Category](#endpoints-by-category)
- [Request Examples](#request-examples)
- [Postman Collection](#postman-collection)

---

## Base URL & Authentication

### Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000/api` |
| Staging | `https://staging.prompts.uyonoh.com/api` |
| Production | `https://prompts.uyonoh.com/api` |

### Authentication

**Most endpoints require authentication** via Supabase session cookies. The authentication flow:

1. User logs in via `/auth/login` (handled by Next.js Auth)
2. Session cookie is set by Supabase
3. Subsequent API requests include the cookie automatically
4. Server validates the session

**For programmatic access**, use the `Authorization` header with a valid JWT:

```http
Authorization: Bearer <your-jwt-token>
```

**To get a JWT token:**
```bash
# Login and get session
curl -X POST https://prompts.uyonoh.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "your-password"}'
```

### Content-Type

All requests must include:
```http
Content-Type: application/json
```

---

## Response Format

### Success Response

All successful responses return:

```json
{
  "data": { ... },           // Response data (varies by endpoint)
  "message": "Success",       // Optional success message
  "ok": true                 // Success flag
}
```

**Simplified responses** (for simple endpoints):
```json
{
  "result": "value"           // Direct response value
}
```

### Paginated Response

Endpoints that return lists use pagination:

```json
{
  "data": [ ... ],           // Array of items
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing the issue",
  "message": "Human-readable error message",
  "status": 400,
  "details": { ... }          // Optional: Additional error details
}
```

### HTTP Status Codes

| Code | Name | Description | Example |
|------|------|-------------|---------|
| 200 | OK | Request successful | GET /api/users |
| 201 | Created | Resource created | POST /api/prompts |
| 204 | No Content | Resource deleted | DELETE /api/prompts/:id |
| 400 | Bad Request | Invalid input | Missing required field |
| 401 | Unauthorized | Authentication required | Missing session |
| 402 | Payment Required | Token quota exceeded | Rate limit hit |
| 403 | Forbidden | Insufficient permissions | Access denied |
| 404 | Not Found | Resource doesn't exist | Invalid ID |
| 405 | Method Not Allowed | Wrong HTTP method | POST to GET-only endpoint |
| 429 | Too Many Requests | Rate limit exceeded | Too many requests |
| 500 | Internal Server Error | Server error | Unexpected error |
| 502 | Bad Gateway | External service error | AI provider down |
| 503 | Service Unavailable | Maintenance mode | High demand |

### Common Error Types

**Validation Errors (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "field": ["Required", "Invalid format"]
  }
}
```

**Authentication Errors (401):**
```json
{
  "error": "Unauthorized",
  "message": "Please log in to access this resource"
}
```

**Token Quota Errors (402):**
```json
{
  "error": "Token quota exceeded",
  "remaining": 0,
  "resets_at": "2024-01-15T00:00:00Z",
  "limit": 100
}
```

---

## Rate Limiting

### Default Limits

| Endpoint Category | Rate Limit | Window |
|------------------|------------|--------|
| Analysis endpoints | 100 requests | per minute |
| Billing endpoints | 10 requests | per minute |
| Settings endpoints | 30 requests | per minute |
| General endpoints | 60 requests | per minute |

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1705310400
```

### Rate Limit Error (429)

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## Endpoints by Category

### Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze and optimize a prompt (fast, regex-based) |
| POST | `/api/parse` | Full AI-powered prompt parsing and refinement |

### Billing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/billing/initialize` | Initialize a payment transaction |
| POST | `/api/billing/webhook` | Paystack webhook handler |
| POST | `/api/billing/cancel` | Cancel a subscription |

### Settings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/api-keys` | List user API keys |
| POST | `/api/settings/api-keys` | Create a new API key |
| DELETE | `/api/settings/api-keys/[id]` | Delete an API key |
| POST | `/api/settings/billing-portal` | Redirect to billing portal |
| POST | `/api/settings/delete-account` | Delete user account |
| POST | `/api/settings/redeem-coupon` | Redeem a discount coupon |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/detect-currency` | Detect user's local currency |

---

## Detailed Endpoint Documentation

### Analysis Endpoints

#### POST /api/analyze

**Fast prompt analysis using regex-based parsing**

**Description:**
Quickly analyzes and optimizes a user prompt using regex pattern matching. This is the "Phase 1" analysis that provides immediate feedback without consuming AI tokens.

**Request Body:**
```json
{
  "text": "Explain quantum computing to a 10-year-old",
  "model": "gpt"
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ Yes | - | The user's prompt to analyze |
| `model` | string | ❌ No | `"claude"` | AI model to target for optimization |

**Model Options:**
- `"gpt"` - Optimize for GPT-4
- `"claude"` - Optimize for Claude 3.5 Sonnet
- `"gemini"` - Optimize for Gemini 1.5 Pro
- `"llama"` - Optimize for Llama 3
- `"grok"` - Optimize for Grok 1
- `"dalle"` - Optimize for DALL-E 3
- `"stablediffusion"` - Optimize for Stable Diffusion
- `"midjourney"` - Optimize for Midjourney
- `"veo"` - Optimize for Veo Video

**Response (200):**
```json
{
  "optimizedPrompt": "Please explain the concept of quantum computing...",
  "analysis": {
    "intent": "explanation",
    "subject": "quantum computing",
    "audience": "10-year-old",
    "style": "simple"
  },
  "suggestions": ["Add examples", "Use analogies", "Keep it simple"],
  "tokenCount": 15,
  "model": "gpt"
}
```

**Error Responses:**
- `400` - Text prompt is required
- `500` - Failed to analyze prompt

**Example:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Write a poem about the ocean", "model": "gpt"}'
```

**See Also:** [Analysis Engine Documentation](../features/analysis.md)

---

#### POST /api/parse

**Full AI-powered prompt parsing and refinement**

**Description:**
Uses Google GenAI to fully parse, understand, and refine user prompts. This consumes AI tokens and provides the most sophisticated optimization.

**Request Body:**
```json
{
  "text": "Explain quantum computing to a 10-year-old",
  "model": "gpt",
  "mode": "text",
  "controls": {
    "creativity": 0.5,
    "precision": 0.75,
    "length": "medium",
    "outputFormat": "text",
    "strategy": "zero_shot",
    "failureHandling": true,
    "tone": "neutral",
    "negativePrompt": ""
  }
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ Yes | - | The user's raw intent/prompt |
| `model` | string | ✅ Yes | - | AI model to use |
| `mode` | string | ❌ No | `"text"` | Processing mode |
| `controls` | object | ❌ No | `{}` | Fine-tuning controls |

**Mode Options:**
- `"text"` - Text generation
- `"code"` - Code generation
- `"image"` - Image generation
- `"video"` - Video generation

**Controls Object:**

| Control | Type | Range | Description |
|---------|------|-------|-------------|
| `creativity` | number | 0.0 - 1.0 | Controls creativity vs. factual accuracy |
| `precision` | number | 0.0 - 1.0 | Controls response precision |
| `length` | string | `"short"`, `"medium"`, `"long"` | Response length preference |
| `outputFormat` | string | `"text"`, `"json"`, `"markdown"` | Output format |
| `strategy` | string | `"zero_shot"`, `"few_shot"`, `"cot"` | Prompting strategy |
| `failureHandling` | boolean | true/false | Whether to handle failures gracefully |
| `tone` | string | `"neutral"`, `"formal"`, `"casual"`, `"friendly"` | Response tone |
| `negativePrompt` | string | - | What to avoid in the response |

**Response (200):**
```json
{
  "refinedPrompt": "Please explain the concept of quantum computing in simple terms that a 10-year-old child can understand. Use everyday analogies and avoid technical jargon. Make it engaging and fun to read.",
  "format": "text",
  "tokenResult": {
    "ok": true,
    "remaining": 85,
    "resets_at": "2024-01-15T00:00:00Z",
    "limit": 100
  }
}
```

**Error Responses:**
- `400` - Raw intent text is required / Invalid model input
- `401` - Unauthorized (user not logged in)
- `402` - Token quota exceeded
- `429` - Rate limit exceeded
- `500` - Failed to parse intent with LLM
- `503` - High demand (AI provider rate limited)

**Token Consumption:**
- Consumes tokens based on the selected model
- Returns remaining quota in `tokenResult`
- Automatic token refund on failure

**Example:**
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-session-cookie>" \
  -d '{
    "text": "Write a poem about the ocean",
    "model": "gpt",
    "mode": "text",
    "controls": {
      "creativity": 0.8,
      "tone": "poetic"
    }
  }'
```

**See Also:**
- [Token Management](#) (coming soon)
- [Model Configuration](../integrations/google-genai.md)

---

### Billing Endpoints

#### POST /api/billing/initialize

**Initialize a payment transaction with Paystack**

**Description:**
Creates a new payment transaction for subscription purchase. Returns a Paystack authorization URL for the user to complete payment.

**Request Body:**
```json
{
  "tier": "plus",
  "currency": "USD",
  "amount": 990,
  "baseAmount": 9.90
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tier` | string | ✅ Yes | Subscription tier |
| `currency` | string | ✅ Yes | Payment currency (ISO code) |
| `amount` | number | ✅ Yes | Amount in currency's smallest unit (e.g., cents for USD, kobo for NGN) |
| `baseAmount` | number | ✅ Yes | Amount in USD for reference |

**Tier Options:**
- `"free"` - Free tier (no payment required)
- `"basic"` - Basic subscription
- `"plus"` - Plus subscription
- `"pro"` - Professional subscription
- `"ultra"` - Ultra subscription

**Response (200):**
```json
{
  "url": "https://checkout.paystack.com/xxxxxx"
}
```

**Error Responses:**
- `400` - Invalid subscription tier
- `401` - Unauthorized
- `500` - Failed to initialize checkout

**Callback:**
After successful payment, Paystack redirects to:
```
{origin}/settings/subscriptions?session=success
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/billing/initialize \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-session-cookie>" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "tier": "plus",
    "currency": "USD",
    "amount": 990,
    "baseAmount": 9.90
  }'
```

**See Also:** [Billing Integration](../integrations/paystack.md)

---

#### POST /api/billing/webhook

**Handle Paystack webhook events**

**Description:**
Receives and processes Paystack webhook events for payment confirmation, subscription updates, and other billing events.

**This endpoint is for Paystack to call, not for client use.**

**Headers:**
```http
Content-Type: application/json
x-paystack-signature: <signature>
```

**Request Body:**
```json
{
  "event": "charge.success",
  "data": {
    "id": 12345,
    "reference": "transaction_reference",
    "status": "success",
    "amount": 99000,
    "customer": {
      "email": "user@example.com"
    },
    "metadata": {
      "tier": "plus",
      "userEmail": "user@example.com",
      "billingCurrency": "NGN",
      "baseAmount": 9.90
    }
  }
}
```

**Supported Events:**
- `charge.success` - Payment successful
- `subscription.create` - Subscription created
- `subscription.update` - Subscription updated
- `invoice.create` - Invoice created
- `invoice.payment_succeeded` - Invoice paid

**Response (200):**
```json
{
  "status": "success",
  "message": "Webhook processed"
}
```

**Error Responses:**
- `400` - Invalid signature or malformed request
- `401` - Unauthorized (invalid signature)
- `500` - Processing error

**Signature Verification:**
All requests are verified using the Paystack webhook signature.

**See Also:** [Paystack Webhooks](https://paystack.com/docs/webhooks/)

---

#### POST /api/billing/cancel

**Cancel a user subscription**

**Description:**
Initiates the cancellation of a user's subscription. The subscription will be canceled at the end of the current billing period.

**Request Body:**
```json
{
  "subscriptionId": "sub_xxxxxxxxx",
  "reason": "User requested cancellation"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subscriptionId` | string | ✅ Yes | Paystack subscription ID |
| `reason` | string | ❌ No | Reason for cancellation |

**Response (200):**
```json
{
  "status": "success",
  "message": "Subscription will be canceled at period end",
  "cancelAt": "2024-02-15T00:00:00Z"
}
```

**Error Responses:**
- `400` - Invalid subscription ID
- `401` - Unauthorized
- `404` - Subscription not found
- `500` - Failed to cancel subscription

**Example:**
```bash
curl -X POST http://localhost:3000/api/billing/cancel \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-session-cookie>" \
  -d '{
    "subscriptionId": "sub_xxxxxxxxx",
    "reason": "No longer need the service"
  }'
```

---

### Settings Endpoints

#### GET /api/settings/api-keys

**List all API keys for the authenticated user**

**Description:**
Retrieves all API keys created by the authenticated user.

**Response (200):**
```json
{
  "apiKeys": [
    {
      "id": "uuid",
      "name": "My Production Key",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastUsedAt": "2024-01-20T14:30:00Z",
      "usageCount": 42,
      "rateLimit": 100,
      "expiresAt": "2024-02-15T00:00:00Z"
    }
  ],
  "total": 1
}
```

**Error Responses:**
- `401` - Unauthorized

---

#### POST /api/settings/api-keys

**Create a new API key**

**Request Body:**
```json
{
  "name": "My Production Key",
  "permissions": {
    "analyze": true,
    "parse": true,
    "read": true,
    "write": false
  },
  "rateLimit": 100,
  "expiresIn": "30d"
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | ✅ Yes | - | Human-readable name for the key |
| `permissions` | object | ❌ No | `{"read": true}` | Key permissions |
| `rateLimit` | number | ❌ No | 100 | Requests per minute limit |
| `expiresIn` | string | ❌ No | `"30d"` | Expiration time (e.g., "7d", "30d", "1y") |

**Response (201):**
```json
{
  "apiKey": {
    "id": "uuid",
    "name": "My Production Key",
    "key": "catalyst_sk_xxxxxxxxx",  // Only shown once!
    "createdAt": "2024-01-15T10:00:00Z",
    "permissions": {"analyze": true, "parse": true, "read": true},
    "rateLimit": 100,
    "expiresAt": "2024-02-15T00:00:00Z"
  },
  "message": "Store this API key securely. It will not be shown again."
}
```

**Error Responses:**
- `400` - Invalid parameters
- `401` - Unauthorized
- `429` - Rate limit exceeded for key creation

**Important:** The API key is only returned once. Store it securely!

---

#### DELETE /api/settings/api-keys/[id]

**Delete an API key**

**Description:**
Permanently deletes an API key. The key will immediately stop working.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | API key ID to delete |

**Response (204):**
```
(no content)
```

**Error Responses:**
- `401` - Unauthorized
- `404` - API key not found
- `403` - Not your API key

---

#### POST /api/settings/billing-portal

**Redirect to the billing portal**

**Description:**
Generates a redirect URL to the Paystack billing portal where users can manage their subscriptions.

**Request Body:**
```json
{
  "returnPath": "/settings/subscriptions"
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `returnPath` | string | ❌ No | `"/settings"` | Path to return to after portal |

**Response (200):**
```json
{
  "url": "https://paystack.com/portal/xxxxxx"
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to generate portal URL

---

#### POST /api/settings/delete-account

**Permanently delete user account**

**Description:**
Initiates the account deletion process. This is a destructive action that cannot be undone.

**Request Body:**
```json
{
  "confirmation": "I understand this cannot be undone",
  "password": "your-password",
  "reason": "No longer need the service"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `confirmation` | string | ✅ Yes | Must match expected confirmation text |
| `password` | string | ✅ Yes | User password for verification |
| `reason` | string | ❌ No | Reason for deletion (for analytics) |

**Response (200):**
```json
{
  "status": "success",
  "message": "Account scheduled for deletion",
  "deletionDate": "2024-01-22T00:00:00Z"
}
```

**Error Responses:**
- `400` - Confirmation text mismatch or invalid password
- `401` - Unauthorized
- `500` - Failed to schedule deletion

**Deletion Process:**
- Account is scheduled for deletion (typically 7-day grace period)
- All user data is permanently removed
- Subscription is canceled
- Email confirmation is sent

---

#### POST /api/settings/redeem-coupon

**Redeem a discount coupon**

**Description:**
Applies a discount coupon to the user's account.

**Request Body:**
```json
{
  "couponCode": "SAVE20",
  "tier": "plus"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `couponCode` | string | ✅ Yes | The coupon code to redeem |
| `tier` | string | ❌ No | Subscription tier to apply coupon to |

**Response (200):**
```json
{
  "status": "success",
  "message": "Coupon applied successfully",
  "discount": {
    "type": "percentage",
    "value": 20,
    "duration": "3 months"
  },
  "newAmount": 792  // Amount after discount
}
```

**Error Responses:**
- `400` - Invalid coupon code or already used
- `401` - Unauthorized
- `404` - Coupon not found
- `410` - Coupon expired

---

### Utility Endpoints

#### POST /api/detect-currency

**Detect user's local currency based on IP**

**Description:**
Detects the user's local currency using their IP address geolocation.

**Request:**
```bash
curl -X POST http://localhost:3000/api/detect-currency \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
{
  "currency": "NGN",
  "country": "NG",
  "countryName": "Nigeria",
  "symbol": "₦",
  "exchangeRate": 1500  // NGN to USD rate
}
```

**Error Responses:**
- `500` - Failed to detect currency

---

## Request Examples

### cURL Examples

**Authentication:**
```bash
# Login (handled by Next.js Auth)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

**Analyze Prompt:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Write a Python function to sort a list", "model": "gpt"}'
```

**Parse with AI:**
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{
    "text": "Explain blockchain to a beginner",
    "model": "claude",
    "mode": "text",
    "controls": {"creativity": 0.7, "tone": "friendly"}
  }'
```

**Create API Key:**
```bash
curl -X POST http://localhost:3000/api/settings/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"name": "Production Key", "rateLimit": 200}'
```

**Initialize Payment:**
```bash
curl -X POST http://localhost:3000/api/billing/initialize \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -H "Origin: http://localhost:3000" \
  -d '{"tier": "pro", "currency": "USD", "amount": 2990, "baseAmount": 29.90}'
```

---

## Postman Collection

**Import the Catalyst API Collection:**

1. Download the Postman collection JSON (coming soon)
2. Import into Postman
3. Configure environment variables:
   - `base_url`: `http://localhost:3000/api` (or production URL)
   - `session_cookie`: Your session cookie for authenticated requests

**Collection Structure:**
```
Catalyst API
├── Authentication
│   └── Login
├── Analysis
│   ├── Analyze
│   └── Parse
├── Billing
│   ├── Initialize Transaction
│   ├── Webhook
│   └── Cancel Subscription
├── Settings
│   ├── API Keys
│   │   ├── List
│   │   ├── Create
│   │   └── Delete
│   ├── Billing Portal
│   ├── Delete Account
│   └── Redeem Coupon
└── Utilities
    └── Detect Currency
```

---

## OpenAPI Specification

An OpenAPI/Swagger specification is available for API clients:

```yaml
# OpenAPI 3.0
openapi: 3.0.0
info:
  title: Catalyst API
  description: AI-Powered Prompt Studio API
  version: 1.0.0
servers:
  - url: http://localhost:3000/api
  - url: https://prompts.uyonoh.com/api
paths:
  /analyze:
    post:
      summary: Analyze a prompt
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyzeRequest'
      responses:
        '200':
          description: Analysis result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyzeResponse'
  # ... (more endpoints)
```

**Download:** [OpenAPI Spec (JSON)](openapi.json) (coming soon)

---

## SDKs & Client Libraries

### JavaScript/TypeScript

**Install:**
```bash
npm install @catalyst/client
# or
pnpm add @catalyst/client
```

**Usage:**
```typescript
import { CatalystClient } from "@catalyst/client";

const client = new CatalystClient({
  baseUrl: "https://prompts.uyonoh.com/api",
  apiKey: "your-api-key"
});

// Analyze a prompt
const result = await client.analyze({
  text: "Write a haiku about coding",
  model: "gpt"
});

// Parse with AI
const parsed = await client.parse({
  text: "Explain recursion",
  model: "claude",
  mode: "text"
});
```

**Status:** JavaScript SDK is planned for future development.

### Python

```python
import requests

class CatalystClient:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"

    def analyze(self, text, model="claude"):
        response = requests.post(
            f"{self.base_url}/analyze",
            json={"text": text, "model": model},
            headers=self.headers
        )
        return response.json()

# Usage
client = CatalystClient("https://prompts.uyonoh.com/api")
result = client.analyze("Write a story", "gpt")
```

---

## Changelog

### Version 1.0.0 (Current)

- Initial API documentation
- All major endpoints documented
- Request/response examples added

---

## See Also

- [Architecture Overview](../architecture/index.md)
- [Integrations Documentation](../integrations/)
- [Features Documentation](../features/)
- [Getting Started Guide](../getting-started/index.md)
