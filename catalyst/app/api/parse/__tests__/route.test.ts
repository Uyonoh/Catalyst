import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import * as SupabaseServerModule from '@/app/lib/supabase-server';

vi.mock('@/app/lib/supabase-server', () => ({
  createClient: vi.fn(),
  getSessionToken: vi.fn(),
}));

describe('/api/parse POST route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('returns 401 when user is unauthenticated', async () => {
    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    } as any);

    const req = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: JSON.stringify({ text: 'Generate code', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 402 Payment Required when token quota is exceeded', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: { ok: false, remaining: 0, limit: 25, resets_at: '2026-08-01' },
      error: null,
    });

    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      rpc: mockRpc,
    } as any);

    const req = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: JSON.stringify({ text: 'Generate code', model: 'gpt', mode: 'text' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(402);

    const json = await response.json();
    expect(json.error).toBe('Token quota exceeded');
    expect(json.remaining).toBe(0);
  });

  it('consumes tokens and returns refined prompt on success', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: { ok: true, remaining: 15, limit: 25 },
      error: null,
    });

    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      rpc: mockRpc,
    } as any);

    vi.spyOn(SupabaseServerModule, 'getSessionToken').mockResolvedValue('session_token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ refinedPrompt: 'Refined LLM Prompt Output', format: 'markdown' }),
    });

    const req = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: JSON.stringify({ text: 'Write python script', model: 'gpt', mode: 'code' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.refinedPrompt).toBe('Refined LLM Prompt Output');
    expect(json.format).toBe('markdown');
  });

  it('refunds tokens when LLM generation fails', async () => {
    const mockRpc = vi.fn().mockImplementation((fnName: string) => {
      if (fnName === 'consume_tokens') {
        return Promise.resolve({ data: { ok: true }, error: null });
      }
      if (fnName === 'refund_tokens') {
        return Promise.resolve({ data: { ok: true }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      rpc: mockRpc,
    } as any);

    vi.spyOn(SupabaseServerModule, 'getSessionToken').mockResolvedValue('session_token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'LLM Provider Exception',
    });

    const req = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: JSON.stringify({ text: 'Write script', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
    expect(mockRpc).toHaveBeenCalledWith('refund_tokens', expect.objectContaining({ p_user_id: 'u1' }));
  });
});
