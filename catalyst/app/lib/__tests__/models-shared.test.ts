import { describe, it, expect } from 'vitest';
import {
  getModelModes,
  isMultimodal,
  getDefaultMode,
  FALLBACK_MODELS,
  Model,
} from '../models-shared';

describe('models-shared module', () => {
  it('getModelModes returns model modes array if defined', () => {
    const customModel: Model = {
      id: 'custom_1',
      slug: 'custom',
      name: 'Custom Model',
      brief: 'Custom',
      type: 'Txt',
      icon: 'chat',
      color: 'blue',
      provider: 'Test',
      text_provider: 'groq',
      text_model: 'openai/gpt-oss-120b',
      image_provider: null,
      image_model: null,
      sort_order: 1,
      is_active: true,
      modes: ['text', 'code'],
    };

    expect(getModelModes(customModel)).toEqual(['text', 'code']);
  });

  it('getModelModes falls back to FALLBACK_MODELS by slug when modes array is empty', () => {
    const modelWithoutModes: Model = {
      id: '1',
      slug: 'gpt',
      name: 'ChatGPT-5',
      brief: 'ChatGPT',
      type: 'Txt',
      icon: 'chat',
      color: 'green',
      provider: 'OpenAI',
      text_provider: 'groq',
      text_model: 'openai/gpt-oss-120b',
      image_provider: 'pollinations',
      image_model: 'pollinations',
      sort_order: 1,
      is_active: true,
      modes: [],
    };

    expect(getModelModes(modelWithoutModes)).toEqual(['text', 'vision', 'image', 'audio', 'code']);
  });

  it('isMultimodal returns true when model supports multiple modes', () => {
    const gptModel = FALLBACK_MODELS.find(m => m.slug === 'gpt')!;
    const dalleModel = FALLBACK_MODELS.find(m => m.slug === 'dalle')!;

    expect(isMultimodal(gptModel)).toBe(true);
    expect(isMultimodal(dalleModel)).toBe(false);
  });

  it('getDefaultMode returns first mode or fallback text', () => {
    const gptModel = FALLBACK_MODELS.find(m => m.slug === 'gpt')!;
    const dalleModel = FALLBACK_MODELS.find(m => m.slug === 'dalle')!;

    expect(getDefaultMode(gptModel)).toBe('text');
    expect(getDefaultMode(dalleModel)).toBe('image');
  });
});
