# Troubleshooting Guide

This guide provides solutions to common issues encountered when developing, deploying, and using Catalyst.

## Table of Contents

- [Getting Started Issues](#getting-started-issues)
- [Development Issues](#development-issues)
- [Deployment Issues](#deployment-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Feature-Specific Issues](#feature-specific-issues)
- [Performance Issues](#performance-issues)
- [Database Issues](#database-issues)
- [External Service Issues](#external-service-issues)
- [Error Code Reference](#error-code-reference)

---

## Getting Started Issues

### Installation Problems

#### `pnpm install` fails

**Symptoms:**
- Installation hangs or fails with network errors
- Dependency resolution failures
- Permission errors

**Solutions:**

1. **Clear cache and retry:**
   ```bash
   pnpm store prune
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **Use different registry:**
   ```bash
   pnpm config set registry https://registry.npmjs.org
   pnpm install
   ```

3. **Node.js version mismatch:**
   ```bash
   # Check Node.js version
   node -v
   
   # Use nvm to switch to supported version
   nvm install 18
   nvm use 18
   pnpm install
   ```

4. **Memory issues:**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS=--max-old-space-size=4096 pnpm install
   ```

#### Missing environment variables

**Symptoms:**
- Application fails to start
- "Missing environment variable" errors
- API calls failing with 500 errors

**Solutions:**

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Check required variables:**
   ```bash
   # These are always required
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   JWT_SECRET
   ENCRYPTION_KEY
   ```

3. **Validate environment file:**
   ```bash
   # Check if .env file exists and has content
   ls -la .env
   cat .env
   ```

4. **Restart development server:**
   ```bash
   # Environment variable changes require server restart
   pkill -f "next dev"
   pnpm dev
   ```

### Project Structure Issues

#### Missing directories

**Symptoms:**
- Import errors for modules that should exist
- File not found errors
- Build failures

**Solutions:**

1. **Create missing directories:**
   ```bash
   mkdir -p app/api app/components app/lib app/hooks app/context
   ```

2. **Check case sensitivity:**
   ```bash
   # On Linux/macOS, paths are case-sensitive
   # Ensure import paths match exactly
   ```

3. **Verify file extensions:**
   ```bash
   # Ensure all files have proper extensions (.ts, .tsx)
   find app -name "*.ts" -o -name "*.tsx" | head -10
   ```

---

## Development Issues

### Development Server Issues

#### `pnpm dev` fails to start

**Symptoms:**
- "Port already in use" errors
- "Address already in use" errors
- Development server crashes immediately

**Solutions:**

1. **Port conflict:**
   ```bash
   # Find and kill process using port 3000
   lsof -i :3000
   kill -9 <PID>
   
   # Or use different port
   PORT=3001 pnpm dev
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   pnpm dev
   ```

3. **Check Node.js version:**
   ```bash
   # Must be Node.js 18+
   node -v
   nvm use 18
   ```

4. **Memory issues:**
   ```bash
   # Increase memory limit
   NODE_OPTIONS=--max-old-space-size=4096 pnpm dev
   ```

#### Hot Module Replacement (HMR) not working

**Symptoms:**
- Changes don't appear without page refresh
- CSS changes not updating
- "Failed to load HMR" errors

**Solutions:**

1. **Clear browser cache:**
   ```bash
   # Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   ```

2. **Check WebSocket connection:**
   ```bash
   # Look for WebSocket errors in browser console
   # Ensure no firewall is blocking WebSocket connections
   ```

3. **Disable conflicting browser extensions:**
   ```bash
   # Some extensions (ad blockers, privacy extensions) can interfere
   ```

4. **Restart development server:**
   ```bash
   pkill -f "next dev"
   pnpm dev
   ```

### TypeScript Issues

#### Type errors during development

**Symptoms:**
- Red squiggly lines in editor
- TypeScript compilation errors
- "Cannot find type" errors

**Solutions:**

1. **Restart TypeScript server:**
   ```bash
   # In VS Code: Ctrl+Shift+P > "TypeScript: Restart TS server"
   ```

2. **Check type definitions:**
   ```bash
   # Install missing type definitions
   pnpm add -D @types/react @types/node
   ```

3. **Clear TypeScript cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

4. **Check tsconfig.json:**
   ```bash
   # Ensure paths and includes are correct
   cat tsconfig.json
   ```

#### TypeScript compilation fails during build

**Symptoms:**
- `pnpm build` fails with TypeScript errors
- "Type X is not assignable to type Y" errors

**Solutions:**

1. **Strict mode violations:**
   ```bash
   # Temporarily disable strict mode in tsconfig.json
   # Then fix errors incrementally
   ```

2. **Missing imports:**
   ```bash
   # Check for missing or incorrect imports
   grep -r "Cannot find module" .
   ```

3. **Version mismatches:**
   ```bash
   # Ensure all @types packages match their implementation versions
   pnpm outdated
   ```

---

## Deployment Issues

### Build Issues

#### `pnpm build` fails

**Symptoms:**
- Build process hangs
- Build fails with errors
- Memory issues during build

**Solutions:**

1. **Clear build cache:**
   ```bash
   rm -rf .next
   pnpm build
   ```

2. **Memory issues:**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS=--max-old-space-size=4096 pnpm build
   ```

3. **Environment variable issues:**
   ```bash
   # Ensure all required environment variables are set
   # Build-time variables must have NEXT_PUBLIC_ prefix
   ```

4. **Check build logs:**
   ```bash
   # Look for specific error messages in build output
   pnpm build 2>&1 | grep -i error
   ```

#### Build succeeds but deployment fails

**Symptoms:**
- Vercel deployment fails
- Docker build succeeds but container won't start
- "Module not found" errors in production

**Solutions:**

1. **Vercel-specific issues:**
   ```bash
   # Check Vercel logs
   vercel logs
   
   # Ensure all dependencies are listed in package.json
   # Remove devDependencies that are needed in production
   ```

2. **Docker build issues:**
   ```bash
   # Check Docker build logs
   docker build -t catalyst . 2>&1 | tail -50
   
   # Ensure proper file copying in Dockerfile
   ```

3. **Missing production dependencies:**
   ```bash
   # Some packages need to be in dependencies, not devDependencies
   pnpm add package-name  # instead of pnpm add -D package-name
   ```

### Runtime Issues

#### Application crashes on startup

**Symptoms:**
- "Failed to load environment variables"
- "Database connection failed"
- "Cannot read property X of undefined"

**Solutions:**

1. **Check environment variables:**
   ```bash
   # Verify all required variables are set in production
   printenv | grep NEXT_PUBLIC
   printenv | grep SUPABASE
   ```

2. **Database connection issues:**
   ```bash
   # Test database connection
   psql postgresql://user:password@host:5432/database
   ```

3. **Missing required files:**
   ```bash
   # Ensure all files are included in Docker build
   # Check .dockerignore to ensure needed files aren't excluded
   ```

#### White screen / blank page

**Symptoms:**
- Application loads but shows white screen
- No errors in console
- Loading spinner appears but nothing happens

**Solutions:**

1. **Check browser console:**
   ```bash
   # Look for JavaScript errors
   # Check network tab for failed API calls
   ```

2. **Enable debug logging:**
   ```bash
   # Set NODE_ENV=development temporarily in production
   ```

3. **Common causes:**
   - **Missing environment variables** on client side
   - **API failures** - check server logs
   - **Authentication issues** - session not being maintained
   - **CORS issues** - if using external APIs

4. **Sentry/Error tracking:**
   ```bash
   # Check error tracking service for client-side errors
   ```

---

## Authentication Issues

### Login/Registration Issues

#### User cannot register

**Symptoms:**
- Registration form submits but no account created
- "User already exists" errors
- Registration API call fails

**Solutions:**

1. **Check Supabase Auth:**
   ```bash
   # Enable email auth in Supabase
   # Go to Supabase Dashboard > Authentication > Providers > Email
   # Ensure email auth is enabled
   ```

2. **Email configuration:**
   ```bash
   # Ensure SMTP is configured in Supabase
   # Go to Supabase Dashboard > Authentication > Templates
   ```

3. **Rate limiting:**
   ```bash
   # Check if you're hitting rate limits
   # Try with a different email or wait a few minutes
   ```

#### User cannot login

**Symptoms:**
- Login form submits but redirects back
- "Invalid credentials" errors
- Session not being created

**Solutions:**

1. **Verify credentials:**
   ```bash
   # Try resetting password
   # Check Supabase Auth logs
   ```

2. **Session configuration:**
   ```bash
   # Check JWT_SECRET environment variable
   echo $JWT_SECRET
   ```

3. **Cookie issues:**
   ```bash
   # Clear browser cookies
   # Try in incognito mode
   # Check if domain matches cookie settings
   ```

#### Session expires immediately

**Symptoms:**
- User logged in but immediately logged out
- Session not persisting across page refreshes
- "Session expired" errors

**Solutions:**

1. **Check session configuration:**
   ```typescript
   // Ensure proper session settings in app/lib/supabase-server.ts
   cookies: () => cookieStore
   ```

2. **Cookie domain settings:**
   ```bash
   # Ensure cookie domain matches your deployment domain
   # In development: localhost
   # In production: .yourdomain.com
   ```

3. **Time synchronization:**
   ```bash
   # Ensure server time is synchronized
   date
   # If wrong, install ntp: apt-get install ntp
   ```

### Profile Issues

#### Profile data not loading

**Symptoms:**
- User information missing
- Token counts not updating
- Plan information not showing

**Solutions:**

1. **Check database:**
   ```sql
   -- Query user profile in Supabase
   SELECT * FROM profiles WHERE user_id = 'user-uuid';
   ```

2. **Profile creation:**
   ```bash
   # Ensure profiles are created on user registration
   # Check app/lib/supabase-server.ts for profile creation logic
   ```

3. **Cache issues:**
   ```bash
   # Clear user cache
   localStorage.clear()
   sessionStorage.clear()
   ```

---

## API Issues

### Analysis API Issues

#### `/api/analyze` returns errors

**Symptoms:**
- HTTP 500 errors
- "Failed to analyze prompt" errors
- Analysis taking too long

**Solutions:**

1. **Check API route implementation:**
   ```typescript
   // app/api/analyze/route.ts
   // Ensure all required services are instantiated
   const parser = new RegexParser();
   const analyzerService = new AnalyzerService();
   const compilerService = new CompilerService();
   ```

2. **Input validation:**
   ```typescript
   // Ensure input is valid
   if (!text || typeof text !== "string") {
     return NextResponse.json(
       { error: "Text prompt is required" },
       { status: 400 }
     );
   }
   ```

3. **Model configuration:**
   ```typescript
   // Ensure model mapping is working
   console.log("Model string:", model);
   console.log("Mapped to:", targetModel);
   ```

4. **Service health:**
   ```bash
   # Check if external AI services are accessible
   curl -X POST https://generativelanguage.googleapis.com/v1beta/models/claude-3-5-sonnet:generateContent \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents": [{"parts": [{"text": "Hello"}]}]}'
   ```

#### Analysis returns empty or incorrect results

**Symptoms:**
- Empty `formattedPrompt`
- Wrong model in response
- Incorrect analysis metadata

**Solutions:**

1. **Check parsing logic:**
   ```typescript
   // Test RegexParser directly
   const parser = new RegexParser();
   const result = parser.analyze("test prompt");
   console.log("Parsed result:", result);
   ```

2. **Verify service integration:**
   ```typescript
   // Test AnalyzerService
   const analyzer = new AnalyzerService();
   const analysis = analyzer.analyze("test prompt");
   console.log("Analysis:", analysis);
   ```

3. **Check compilation:**
   ```typescript
   // Test CompilerService
   const compiler = new CompilerService();
   const optimized = compiler.compile(deconstructed, TargetModel.CLAUDE_3_5_SONNET);
   console.log("Optimized:", optimized);
   ```

### Billing API Issues

#### Payment processing fails

**Symptoms:**
- Payment form submits but no charge
- "Payment failed" errors
- Webhook not being called

**Solutions:**

1. **Check payment provider:**
   ```bash
   # Test Paystack API directly
   curl https://api.paystack.co/transaction/initialize \
     -H "Authorization: Bearer YOUR_SECRET_KEY" \
     -H "Content-Type: application/json" \
     -d '{"amount": 10000, "email": "user@example.com"}'
   ```

2. **Webhook verification:**
   ```typescript
   // Check webhook endpoint in app/api/webhooks/paystack/route.ts
   // Ensure webhook secret matches Paystack configuration
   ```

3. **Database transactions:**
   ```bash
   # Check if payment was recorded in database
   SELECT * FROM subscriptions WHERE user_id = 'user-uuid';
   ```

---

## Feature-Specific Issues

### Studio Issues

#### Real-time analysis not working

**Symptoms:**
- Analysis panel not updating
- No results when typing
- "Loading" state stuck

**Solutions:**

1. **Check useParsing hook:**
   ```typescript
   // Ensure hook is being used correctly
   const { result, isLoading, error } = useParsing(input, selectedModel);
   ```

2. **Debounce settings:**
   ```typescript
   // Try reducing debounce time for testing
   const { result, isLoading, error } = useParsing(input, selectedModel, 100);
   ```

3. **Console errors:**
   ```bash
   # Check for JavaScript errors in browser console
   # Look for network errors in Network tab
   ```

#### Auto-save not working

**Symptoms:**
- Prompts not being saved to history
- No prompts in history page
- Save API calls failing

**Solutions:**

1. **Check save logic:**
   ```typescript
   // In StudioPageContent.tsx, check auto-save useEffect
   useEffect(() => {
     if (parsedPrompt && user && !isSaving) {
       autoSave();
     }
   }, [parsedPrompt, user, ...]);
   ```

2. **Database permissions:**
   ```bash
   # Check Supabase row-level security (RLS)
   # Go to Supabase Dashboard > Table Editor > prompts > RLS
   # Ensure insert permissions are enabled for authenticated users
   ```

3. **Token refund logic:**
   ```typescript
   # Check if token refund is working on save failure
   # In StudioPageContent.tsx, look for refund_tokens RPC call
   ```

### History Issues

#### History not loading

**Symptoms:**
- Empty history page
- "Loading" spinner indefinitely
- "Failed to load history" errors

**Solutions:**

1. **Check history query:**
   ```typescript
   // In app/history/page.tsx, check getHistoryItems function
   const { data, error } = await query;
   if (error) {
     console.error("History error:", error);
   }
   ```

2. **Authentication check:**
   ```typescript
   // Ensure user is authenticated
   const user = await getServerUser();
   if (!user) {
     redirect("/login?redirect=/history");
   }
   ```

3. **Database query:**
   ```sql
   -- Test history query directly
   SELECT * FROM prompts WHERE user_id = 'user-uuid' LIMIT 10;
   ```

#### Search and filters not working

**Symptoms:**
- Search returns no results
- Filters not applied correctly
- Wrong results returned

**Solutions:**

1. **Check filter logic:**
   ```typescript
   // In app/history/page.tsx, verify filter application
   if (searchParams.q) {
     query = query.or(
       `title.ilike.%${searchParams.q}%,content.ilike.%${searchParams.q}%,raw_input.ilike.%${searchParams.q}%`
     );
   }
   ```

2. **URL parameter parsing:**
   ```typescript
   // Ensure searchParams are being parsed correctly
   const resolvedSearchParams = await searchParams;
   console.log("Search params:", resolvedSearchParams);
   ```

3. **SQL syntax:**
   ```sql
   -- Test search query directly
   SELECT * FROM prompts 
   WHERE user_id = 'user-uuid' 
   AND (title ILIKE '%react%' OR content ILIKE '%react%');
   ```

---

## Performance Issues

### Slow Analysis

**Symptoms:**
- Analysis taking > 1 second
- UI freezing during analysis
- Timeouts during analysis

**Solutions:**

1. **Check debounce settings:**
   ```typescript
   // Reduce debounce time for faster feedback
   const { result, isLoading, error } = useParsing(input, selectedModel, 300);
   ```

2. **Service optimization:**
   ```typescript
   // Check if RegexParser can be optimized
   // Consider caching common patterns
   ```

3. **External API calls:**
   ```bash
   # Check if external AI services are responding quickly
   # Consider implementing local caching for common prompts
   ```

### Memory Issues

**Symptoms:**
- "Out of memory" errors
- Application crashing
- Slow response times over time

**Solutions:**

1. **Memory profiling:**
   ```bash
   # Use Node.js inspector for memory profiling
   NODE_OPTIONS='--inspect' pnpm dev
   
   # Open Chrome DevTools > Memory tab
   ```

2. **Memory limit increase:**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS=--max-old-space-size=4096 pnpm dev
   ```

3. **Memory leak investigation:**
   ```typescript
   // Check for event listener leaks
   // Ensure cleanup in useEffect return functions
   useEffect(() => {
     const timer = setTimeout(() => {}, 1000);
     return () => clearTimeout(timer); // Always cleanup!
   }, []);
   ```

### High CPU Usage

**Symptoms:**
- High CPU usage in Docker
- Server response times increasing
- Application becoming unresponsive

**Solutions:**

1. **CPU profiling:**
   ```bash
   # Use Node.js CPU profiler
   NODE_OPTIONS='--prof' pnpm dev
   
   # Analyze CPU usage
   node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
   ```

2. **Check expensive operations:**
   ```typescript
   // Look for CPU-intensive operations
   // Consider using Web Workers for heavy tasks
   ```

3. **Rate limiting:**
   ```typescript
   // Implement rate limiting for API endpoints
   // Use libraries like rate-limiter-flexible
   ```

---

## Database Issues

### Connection Issues

**Symptoms:**
- "Database connection failed" errors
- Timeouts when accessing database
- Intermittent connection failures

**Solutions:**

1. **Check connection string:**
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Test connection:**
   ```bash
   # Use psql to test connection
   psql postgresql://postgres:yourpassword@host:5432/postgres
   ```

3. **Connection pooling:**
   ```typescript
   // Ensure proper connection pooling in Supabase client
   import { createClient } from '@supabase/supabase-js'
   
   // Reuse client instances
   const supabase = createClient(url, key)
   ```

### Query Performance

**Symptoms:**
- Slow database queries
- Timeouts on complex queries
- Database connection pool exhaustion

**Solutions:**

1. **Query optimization:**
   ```typescript
   // Add indexes for frequently queried columns
   // Use .select() to only fetch needed columns
   // Avoid .select('*')
   ```

2. **Add database indexes:**
   ```sql
   -- Add index for user_id column
   CREATE INDEX IF NOT EXISTS idx_prompts_user_id 
   ON prompts (user_id);
   
   -- Add index for created_at column
   CREATE INDEX IF NOT EXISTS idx_prompts_created_at 
   ON prompts (created_at DESC);
   ```

3. **Query analysis:**
   ```sql
   -- Use EXPLAIN ANALYZE to check query performance
   EXPLAIN ANALYZE SELECT * FROM prompts WHERE user_id = 'user-uuid';
   ```

### Row-Level Security (RLS)

**Symptoms:**
- "Permission denied" errors
- No data returned despite data existing
- Insert/update operations failing

**Solutions:**

1. **Check RLS policies:**
   ```sql
   -- Check current RLS policies
   SELECT * FROM pg_policies WHERE tablename = 'prompts';
   ```

2. **Create RLS policies:**
   ```sql
   -- Enable RLS for authenticated users
   CREATE POLICY "Enable insert for authenticated users"
   ON prompts FOR INSERT TO authenticated
   WITH CHECK (true);
   
   CREATE POLICY "Enable select for authenticated users"
   ON prompts FOR SELECT TO authenticated
   USING (user_id = auth.uid());
   ```

3. **Test RLS:**
   ```bash
   # Use Supabase JavaScript client to test
   const { data, error } = await supabase
     .from('prompts')
     .select('*')
     .eq('user_id', user.id);
   
   if (error) console.error('RLS Error:', error);
   ```

---

## External Service Issues

### Supabase Issues

#### Supabase connection issues

**Symptoms:**
- "Invalid Supabase URL" errors
- "Invalid API key" errors
- Connection timeouts

**Solutions:**

1. **Verify Supabase configuration:**
   ```bash
   # Check Supabase project settings
   # Go to Supabase Dashboard > Project Settings > API
   ```

2. **Test API key:**
   ```bash
   curl https://your-project-ref.supabase.co/rest/v1/ \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

3. **CORS settings:**
   ```bash
   # Ensure your domain is added to CORS allowed origins
   # Go to Supabase Dashboard > API Settings > CORS
   ```

### Google GenAI Issues

#### API key issues

**Symptoms:**
- "Invalid API key" errors
- "Permission denied" errors
- Quota exceeded errors

**Solutions:**

1. **Verify API key:**
   ```bash
   echo $GOOGLE_AI_API_KEY
   ```

2. **Test API directly:**
   ```bash
   curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents": [{"parts": [{"text": "Hello"}]}]}'
   ```

3. **Check quota:**
   ```bash
   # Go to Google Cloud Console > APIs & Services > Dashboard
   # Check usage for Generative Language API
   ```

### Paystack Issues

#### Webhook issues

**Symptoms:**
- Webhook not being called
- Webhook signature verification failing
- Payments not being recorded

**Solutions:**

1. **Test webhook locally:**
   ```bash
   # Use ngrok to expose local server
   ngrok http 3000
   
   # Add ngrok URL to Paystack webhook settings
   ```

2. **Verify webhook signature:**
   ```typescript
   // In app/api/webhooks/paystack/route.ts
   const hash = crypto
     .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
     .update(body)
     .digest('hex');
   
   if (hash !== signature) {
     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
   }
   ```

3. **Check Paystack dashboard:**
   ```bash
   # Go to Paystack Dashboard > Transactions
   # Check recent transactions and webhook deliveries
   ```

---

## Error Code Reference

### HTTP Status Codes

| Code | Name | Description | Solution |
|------|------|-------------|----------|
| 400 | Bad Request | Invalid input parameters | Check request format and parameters |
| 401 | Unauthorized | Authentication required | Ensure user is logged in, check session |
| 403 | Forbidden | Insufficient permissions | Check user role and permissions |
| 404 | Not Found | Resource doesn't exist | Verify URL and resource availability |
| 429 | Too Many Requests | Rate limit exceeded | Wait and retry, check rate limiting |
| 500 | Internal Server Error | Server-side error | Check server logs, review error details |
| 502 | Bad Gateway | Proxy/gateway error | Check external service connectivity |
| 503 | Service Unavailable | Service temporarily unavailable | Retry later, check service health |

### Application Error Codes

| Code | Description | HTTP Status | Solution |
|------|-------------|-------------|----------|
| `AUTH_REQUIRED` | Authentication required | 401 | Redirect to login |
| `INVALID_INPUT` | Invalid input data | 400 | Validate input, show user-friendly error |
| `RATE_LIMITED` | Rate limit exceeded | 429 | Wait and retry, upgrade plan |
| `TOKEN_EXHAUSTED` | No tokens remaining | 402 | Upgrade plan or wait for reset |
| `DATABASE_ERROR` | Database operation failed | 500 | Check database connectivity, review query |
| `EXTERNAL_SERVICE_ERROR` | External service failure | 503 | Check service status, retry |
| `NOT_FOUND` | Resource not found | 404 | Check resource exists, verify permissions |
| `VALIDATION_ERROR` | Input validation failed | 400 | Fix input data, show specific error messages |

### Database Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `23505` | Unique violation | Check for duplicate entries |
| `23503` | Foreign key violation | Ensure referenced records exist |
| `23502` | Not null violation | Provide required values |
| `23514` | Check violation | Ensure data meets check constraints |
| `42P01` | Undefined table | Verify table exists |
| `42703` | Undefined column | Verify column exists |

---

## Getting Help

### Debug Information to Provide

When seeking help, include the following information:

1. **Environment:**
   - Node.js version: `node -v`
   - pnpm version: `pnpm -v`
   - Operating system and version
   - Browser and version (for client-side issues)

2. **Steps to reproduce:**
   - Detailed steps to reproduce the issue
   - Expected vs actual behavior

3. **Error messages:**
   - Exact error messages (copy and paste)
   - Stack traces
   - Browser console logs

4. **Configuration:**
   - Relevant environment variables (with sensitive values redacted)
   - Relevant code snippets
   - Configuration files

5. **Additional context:**
   - Recent changes that might have caused the issue
   - Whether the issue occurs consistently or intermittently
   - Any patterns or timing you've noticed

### Support Channels

1. **GitHub Issues:**
   - For bugs and feature requests
   - Provide detailed reproduction steps
   - Include error logs and screenshots

2. **Discord Community:**
   - For general questions and discussion
   - Real-time help from community members

3. **Official Documentation:**
   - Check this documentation first
   - Look for similar issues in the docs

### Self-Help Resources

- **Search GitHub Issues:** Look for similar reported issues
- **Check GitHub Discussions:** Browse community discussions
- **Review Commit History:** Check recent changes that might be related
- **Inspect Browser DevTools:** Check console, network, and performance tabs
- **Server Logs:** Review server console output and log files

---

## See Also

- [Getting Started](./getting-started/index.md) - Initial setup and configuration
- [Development Guide](./development/index.md) - Development best practices
- [Deployment Guide](./deployment.md) - Deployment instructions
- [API Reference](./api/index.md) - API endpoint documentation
- [Features](./features/index.md) - Feature-specific documentation