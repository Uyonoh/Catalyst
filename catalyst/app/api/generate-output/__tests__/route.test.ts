import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import * as SupabaseServerModule from '@/app/lib/supabase-server';

vi.mock('@/app/lib/supabase-server', () => ({
  createClient: vi.fn(),
  getSessionToken: vi.fn(),
}));

describe('/api/generate-output POST route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('returns 401 when user is unauthenticated', async () => {
    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    } as any);

    const req = new NextRequest('http://localhost:3000/api/generate-output', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Generate code', model: 'gpt' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 402 Payment Required when token quota is exceeded for text mode', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: { ok: false, remaining: 0, limit: 25, resets_at: '2026-08-01' },
      error: null,
    });

    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      rpc: mockRpc,
    } as any);

    vi.spyOn(SupabaseServerModule, 'getSessionToken').mockResolvedValue('session_token');

    const req = new NextRequest('http://localhost:3000/api/generate-output', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Generate code', model: 'gpt', mode: 'text' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(402);
  });

  it('generates text output and updates prompt in database', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: { ok: true, remaining: 10, limit: 25 },
      error: null,
    });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      rpc: mockRpc,
      from: vi.fn().mockReturnValue({
        update: mockUpdate,
      }),
    } as any);

    vi.spyOn(SupabaseServerModule, 'getSessionToken').mockResolvedValue('session_token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ refinedPrompt: 'Generated output response' }),
    });

    const req = new NextRequest('http://localhost:3000/api/generate-output', {
      method: 'POST',
      body: JSON.stringify({
        promptId: 'prompt-123',
        prompt: 'Write a python function',
        model: 'gpt',
        mode: 'text',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.target).toEqual({
      output_type: 'text',
      output: 'Generated output response',
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      target: {
        output_type: 'text',
        output: 'Generated output response',
      },
    });
  });
});
