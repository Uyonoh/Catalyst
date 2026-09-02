import { describe, it, expect } from 'vitest';
import {
  getPreviewCost,
  getFallbackCost,
  TOKEN_COST_MATRIX,
  tierLimits,
  OUTPUT_GENERATION_MODES,
  DEFAULT_MODE_COSTS,
  getDefaultCostForMode,
} from '../tokens';

describe('tokens module', () => {
  describe('OUTPUT_GENERATION_MODES', () => {
    it('defines only video-generation, image-generation, and text-generation for output generation', () => {
      expect(OUTPUT_GENERATION_MODES).toEqual([
        'video-generation',
        'image-generation',
        'text-generation',
      ]);
    });
  });

  describe('DEFAULT_MODE_COSTS and getDefaultCostForMode', () => {
    it('defines default costs for each generation mode', () => {
      expect(DEFAULT_MODE_COSTS['video-generation']).toBe(10);
      expect(DEFAULT_MODE_COSTS['image-generation']).toBe(5);
      expect(DEFAULT_MODE_COSTS['text-generation']).toBe(2);
      expect(getDefaultCostForMode('video-generation')).toBe(10);
      expect(getDefaultCostForMode('image-generation')).toBe(5);
      expect(getDefaultCostForMode('text-generation')).toBe(2);
    });

    it('falls back to 2 for unspecified unknown modes', () => {
      expect(getDefaultCostForMode('unknown_mode')).toBe(2);
    });
  });

  describe('getPreviewCost and getFallbackCost', () => {
    it('returns exact cost for known model and mode combinations', () => {
      expect(getPreviewCost('gpt', 'text')).toBe(TOKEN_COST_MATRIX['gpt']['text']); // 2
      expect(getPreviewCost('gpt', 'text-generation')).toBe(2);
      expect(getPreviewCost('gpt', 'vision')).toBe(3);
      expect(getPreviewCost('veo', 'video')).toBe(10);
      expect(getPreviewCost('veo', 'video-generation')).toBe(10);
      expect(getPreviewCost('dalle', 'image')).toBe(5);
      expect(getPreviewCost('dalle', 'image-generation')).toBe(5);
    });

    it('uses mode default cost if model is not found in database/matrix', () => {
      expect(getFallbackCost('unknown_model', 'video-generation')).toBe(10);
      expect(getFallbackCost('unknown_model', 'image-generation')).toBe(5);
      expect(getFallbackCost('unknown_model', 'text-generation')).toBe(2);
      expect(getPreviewCost('unknown_model', 'video-generation')).toBe(10);
      expect(getPreviewCost('unknown_model', 'image-generation')).toBe(5);
      expect(getPreviewCost('unknown_model', 'text-generation')).toBe(2);
    });

    it('falls back to mode default cost for unknown modes or unknown models', () => {
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
