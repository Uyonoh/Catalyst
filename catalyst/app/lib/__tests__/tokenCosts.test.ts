import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getTokenCostFromDB,
  getBatchTokenCosts,
  getFallbackCost,
  OUTPUT_GENERATION_MODES,
  DEFAULT_MODE_COSTS,
  getDefaultCostForMode,
} from '../tokenCosts';
import { TOKEN_COST_MATRIX } from '../tokens';
import * as SupabaseServerModule from '../supabase-server';

vi.mock('../supabase-server', () => ({
  createClient: vi.fn(),
}));

describe('tokenCosts module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exports', () => {
    it('re-exports generation modes and default costs', () => {
      expect(OUTPUT_GENERATION_MODES).toEqual([
        'video-generation',
        'image-generation',
        'text-generation',
      ]);
      expect(DEFAULT_MODE_COSTS['video-generation']).toBe(10);
      expect(DEFAULT_MODE_COSTS['image-generation']).toBe(5);
      expect(DEFAULT_MODE_COSTS['text-generation']).toBe(2);
      expect(getDefaultCostForMode('video-generation')).toBe(10);
    });
  });

  describe('getTokenCostFromDB resolution flow', () => {
    it('Step 1: returns cost from DB when found', async () => {
      vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { cost: 7 }, error: null }),
              }),
            }),
          }),
        }),
      } as any);

      const cost = await getTokenCostFromDB('gpt', 'text-generation');
      expect(cost).toBe(7);
    });

    it('Step 2: falls back to matrix when DB does not have the mode', async () => {
      vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }),
      } as any);

      // gpt is in TOKEN_COST_MATRIX with text: 2
      const cost = await getTokenCostFromDB('gpt', 'text');
      expect(cost).toBe(2);
    });

    it('Step 3: returns any model cost from DB if mode not in matrix', async () => {
      let callCount = 0;
      vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation((col, val) => {
              return {
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({ data: { cost: 8 }, error: null }),
                  }),
                }),
              };
            }),
          }),
        }),
      } as any);

      // custom model not in matrix
      const cost = await getTokenCostFromDB('custom-model', 'custom-mode');
      expect(cost).toBe(8);
    });

    it('Step 4: returns default mode cost when model is completely unknown', async () => {
      vi.spyOn(SupabaseServerModule, 'createClient').mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation(() => ({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            })),
          }),
        }),
      } as any);

      expect(await getTokenCostFromDB('totally_unknown', 'video-generation')).toBe(10);
      expect(await getTokenCostFromDB('totally_unknown', 'image-generation')).toBe(5);
      expect(await getTokenCostFromDB('totally_unknown', 'text-generation')).toBe(2);
    });
  });

  describe('getFallbackCost', () => {
    it('returns exact cost for known model and mode combinations', () => {
      expect(getFallbackCost('gpt', 'text')).toBe(TOKEN_COST_MATRIX['gpt']['text']);
      expect(getFallbackCost('gpt', 'text-generation')).toBe(2);
      expect(getFallbackCost('gpt', 'vision')).toBe(3);
      expect(getFallbackCost('veo', 'video')).toBe(10);
      expect(getFallbackCost('veo', 'video-generation')).toBe(10);
      expect(getFallbackCost('dalle', 'image')).toBe(5);
      expect(getFallbackCost('dalle', 'image-generation')).toBe(5);
    });

    it('returns any model cost when mode is unknown for a known model', () => {
      // dalle only defines image: 5
      expect(getFallbackCost('dalle', 'unknown_mode')).toBe(5);
    });

    it('returns default cost for mode when model is unknown', () => {
      expect(getFallbackCost('non_existent_model', 'video-generation')).toBe(10);
      expect(getFallbackCost('non_existent_model', 'image-generation')).toBe(5);
      expect(getFallbackCost('non_existent_model', 'text-generation')).toBe(2);
      expect(getFallbackCost('non_existent_model', 'text')).toBe(2);
    });

    it('returns correct fallback for all models in TOKEN_COST_MATRIX', () => {
      const models = Object.keys(TOKEN_COST_MATRIX);
      for (const model of models) {
        const modes = Object.keys(TOKEN_COST_MATRIX[model]);
        for (const mode of modes) {
          const expected = TOKEN_COST_MATRIX[model][mode];
          expect(getFallbackCost(model, mode)).toBe(expected);
        }
      }
    });
  });
});
