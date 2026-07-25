import { describe, it, expect } from 'vitest';
import {
  PROMPT_TYPE_TOKENS,
  PROMPT_TYPE_FALLBACK,
  MODEL_BADGE_TOKENS,
  MODEL_BADGE_FALLBACK,
  TARGET_MODEL_COLOR_MAP,
} from '../promptTokens';

describe('promptTokens utilities', () => {
  describe('PROMPT_TYPE_TOKENS', () => {
    it('contains configurations for known prompt types', () => {
      expect(PROMPT_TYPE_TOKENS).toHaveProperty('chat');
      expect(PROMPT_TYPE_TOKENS).toHaveProperty('code');
      expect(PROMPT_TYPE_TOKENS).toHaveProperty('image');
      expect(PROMPT_TYPE_TOKENS).toHaveProperty('terminal');
    });

    it('has correct shape with Icon, bg, border, and text classes', () => {
      const chatConfig = PROMPT_TYPE_TOKENS['chat'];
      expect(chatConfig.Icon).toBeDefined();
      expect(chatConfig.bg).toContain('bg-emerald');
      expect(chatConfig.border).toContain('border-emerald');
      expect(chatConfig.text).toContain('text-emerald');
    });
  });

  describe('PROMPT_TYPE_FALLBACK', () => {
    it('provides fallback styling for unmatched prompt types', () => {
      expect(PROMPT_TYPE_FALLBACK.Icon).toBeDefined();
      expect(PROMPT_TYPE_FALLBACK.bg).toContain('bg-slate');
      expect(PROMPT_TYPE_FALLBACK.border).toContain('border-slate');
      expect(PROMPT_TYPE_FALLBACK.text).toContain('text-slate');
    });
  });

  describe('MODEL_BADGE_TOKENS & FALLBACK', () => {
    it('maps color keys to badge styling tokens', () => {
      expect(MODEL_BADGE_TOKENS['green']).toEqual({
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
      });
      expect(MODEL_BADGE_TOKENS['purple']).toEqual({
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        text: 'text-violet-400',
      });
    });

    it('provides valid fallback for unknown colors', () => {
      expect(MODEL_BADGE_FALLBACK).toHaveProperty('bg');
      expect(MODEL_BADGE_FALLBACK).toHaveProperty('border');
      expect(MODEL_BADGE_FALLBACK).toHaveProperty('text');
    });
  });

  describe('TARGET_MODEL_COLOR_MAP', () => {
    it('maps model identifiers to color names', () => {
      expect(TARGET_MODEL_COLOR_MAP['gpt-4o']).toBe('green');
      expect(TARGET_MODEL_COLOR_MAP['claude-3-opus']).toBe('purple');
      expect(TARGET_MODEL_COLOR_MAP['gemini-1.5-pro']).toBe('yellow');
      expect(TARGET_MODEL_COLOR_MAP['llama-3.1']).toBe('orange');
      expect(TARGET_MODEL_COLOR_MAP['dall-e-3']).toBe('pink');
    });
  });
});
