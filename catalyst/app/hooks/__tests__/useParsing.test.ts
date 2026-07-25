import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParsing } from '../useParsing';

describe('useParsing custom hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with null result and non-loading state when text is empty', () => {
    const { result } = renderHook(() => useParsing('', 'gpt-4o', 100));

    expect(result.current.result).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('triggers debounced fetch call when valid text is provided', async () => {
    const mockResponseData = { optimized_prompt: 'Enhanced prompt text' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const { result } = renderHook(() => useParsing('Write a blog post', 'gpt-4o', 100));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/analyze', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ text: 'Write a blog post', model: 'gpt-4o' }),
    }));

    expect(result.current.result).toEqual(mockResponseData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch failure and sets error state', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useParsing('Test prompt', 'claude-3-opus', 100));

    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.error).toBe('Failed to analyze prompt');
    expect(result.current.isLoading).toBe(false);
  });
});
