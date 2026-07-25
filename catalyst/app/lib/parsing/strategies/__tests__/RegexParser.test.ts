import { describe, it, expect } from 'vitest';
import { RegexParser } from '../RegexParser';

describe('RegexParser parsing strategy', () => {
  const parser = new RegexParser();

  it('extracts persona, style, and intent correctly for creative generation prompt', () => {
    const promptText = 'Role: senior designer. Create a logo in the style of CyberArt.';
    const result = parser.analyze(promptText);

    expect(result.intent).toBe('Creative Generation');
    expect(result.intentClarity).toBeGreaterThan(0.3);

    const personaEntity = result.entities.find((e) => e.type === 'persona');
    expect(personaEntity?.value).toBe('senior');

    const styleEntity = result.entities.find((e) => e.type === 'style');
    expect(styleEntity?.value).toBe('CyberArt');
  });

  it('detects Code Generation intent and suggested markdown format for coding prompts', () => {
    const promptText = 'Write a python function to parse JSON data';
    const result = parser.analyze(promptText);

    expect(result.intent).toBe('Code Generation');
    expect(result.suggestedFormat).toBe('markdown');
  });

  it('returns default General Inquiry intent for simple prompts', () => {
    const promptText = 'Hello there!';
    const result = parser.analyze(promptText);

    expect(result.intent).toBe('General Inquiry');
    expect(result.suggestedFormat).toBe('natural_language');
  });
});
