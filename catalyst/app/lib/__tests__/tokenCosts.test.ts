import { describe, it, expect } from 'vitest';
import { getFallbackCost } from '../tokenCosts';
import { TOKEN_COST_MATRIX } from '../tokens';

describe('tokenCosts module', () => {
  describe('getFallbackCost', () => {
    it('returns exact cost for known model and mode combinations', () => {
      expect(getFallbackCost('gpt', 'text')).toBe(TOKEN_COST_MATRIX['gpt']['text']);
      expect(getFallbackCost('gpt', 'vision')).toBe(3);
      expect(getFallbackCost('veo', 'video')).toBe(10);
      expect(getFallbackCost('dalle', 'image')).toBe(5);
    });

    it('returns cost for model when mode not found but model exists', () => {
      // For 'dalle', only 'image' mode is defined (cost: 5)
      // When requesting 'text' mode, it should return the first available mode's cost
      expect(getFallbackCost('dalle', 'text')).toBe(5);
    });

    it('falls back to 2 for unknown models', () => {
      expect(getFallbackCost('non_existent_model', 'text')).toBe(2);
    });

    it('falls back to 2 for unknown modes on known models', () => {
      expect(getFallbackCost('gpt', 'unknown_mode')).toBe(2);
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

    it('returns first mode cost when specific mode not found', () => {
      // llama has text: 1 and code: 1
      // requesting 'image' should return 1 (first value)
      expect(getFallbackCost('llama', 'image')).toBe(1);
    });
  });
});
