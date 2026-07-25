import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getApiKey } from '../apiKeys';

vi.mock('../supabase-server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { encrypted_key: 'db_encrypted_key_value' },
      }),
    }),
  }),
}));

describe('apiKeys module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('prioritizes environment variables over database keys for OpenAI', async () => {
    process.env.OPENAI_API_KEY = 'sk-env-openai-key';
    const key = await getApiKey('openai');
    expect(key).toBe('sk-env-openai-key');
  });

  it('prioritizes environment variables over database keys for Anthropic', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-env-anthropic-key';
    const key = await getApiKey('anthropic');
    expect(key).toBe('sk-env-anthropic-key');
  });

  it('falls back to database key when env variable is not set', async () => {
    delete process.env.OPENAI_API_KEY;
    const key = await getApiKey('openai');
    expect(key).toBe('db_encrypted_key_value');
  });

  it('returns null when neither env key nor DB key is available', async () => {
    delete process.env.GROQ_API_KEY;
    const { createClient } = await import('../supabase-server');
    const mockSupabase = await createClient();
    vi.mocked(mockSupabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null }),
    } as any);

    const key = await getApiKey('groq');
    expect(key).toBeNull();
  });
});
