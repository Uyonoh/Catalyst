import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import * as SupabaseServerModule from '@/app/lib/supabase-server';

vi.mock('@/app/lib/supabase-server', () => ({
  createClient: vi.fn(),
  getSessionToken: vi.fn(),
}));

describe('/api/analyze POST route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('returns 401 when user is unauthenticated', async () => {
    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    } as any);

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text: 'Test prompt', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when text is missing or invalid', async () => {
    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
    } as any);

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text: '', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toBe('Text prompt is required');
  });

  it('proxies request to FastAPI backend and returns result on success', async () => {
    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
    } as any);

    vi.spyOn(SupabaseServerModule, 'getSessionToken').mockResolvedValue('test_access_token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ intent: 'Creative Generation', intentClarity: 0.85 }),
    });

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text: 'Write a blog post about AI', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.intent).toBe('Creative Generation');
    expect(json.intentClarity).toBe(0.85);
  });
});
