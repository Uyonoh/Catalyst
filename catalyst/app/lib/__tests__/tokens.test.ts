import { describe, it, expect } from 'vitest';
import { getPreviewCost, TOKEN_COST_MATRIX, tierLimits } from '../tokens';

describe('tokens module', () => {
  describe('getPreviewCost', () => {
    it('returns exact cost for known model and mode combinations', () => {
      expect(getPreviewCost('gpt', 'text')).toBe(TOKEN_COST_MATRIX['gpt']['text']); // 2
      expect(getPreviewCost('gpt', 'vision')).toBe(3);
      expect(getPreviewCost('veo', 'video')).toBe(10);
      expect(getPreviewCost('dalle', 'image')).toBe(5);
    });

    it('falls back to cost 2 for unknown modes or unknown models', () => {
      expect(getPreviewCost('gpt', 'unknown_mode')).toBe(2);
      expect(getPreviewCost('non_existent_model', 'text')).toBe(2);
    });
  });

  describe('tierLimits', () => {
    it('defines limits for free, basic, plus, pro, and ultra tiers', () => {
      expect(tierLimits['free']).toBe(25);
      expect(tierLimits['basic']).toBe(100);
      expect(tierLimits['plus']).toBe(250);
      expect(tierLimits['pro']).toBe(500);
      expect(tierLimits['ultra']).toBe(0);
    });
  });
});
