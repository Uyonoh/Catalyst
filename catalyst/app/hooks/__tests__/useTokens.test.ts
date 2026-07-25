import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTokens } from '../useTokens';
import * as AuthContextModule from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useUser: vi.fn(),
}));

describe('useTokens custom hook', () => {
  it('calculates free tier token metrics correctly', () => {
    vi.spyOn(AuthContextModule, 'useUser').mockReturnValue({
      profile: {
        id: 'user_1',
        plan: 'free',
        tokens_used: 10,
        bonus_tokens: 20,
      },
      refreshProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useTokens());

    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.isUltra).toBe(false);
    expect(result.current.used).toBe(10);
    expect(result.current.bonusTokens).toBe(20);
    expect(result.current.remaining).toBe(35);
    expect(result.current.isExhausted).toBe(false);
  });

  it('handles Ultra plan correctly with infinite remaining tokens', () => {
    vi.spyOn(AuthContextModule, 'useUser').mockReturnValue({
      profile: {
        id: 'user_2',
        plan: 'ultra',
        tokens_used: 5000,
        bonus_tokens: 0,
      },
      refreshProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useTokens());

    expect(result.current.isSubscribed).toBe(true);
    expect(result.current.isUltra).toBe(true);
    expect(result.current.remaining).toBe(Infinity);
    expect(result.current.percentage).toBe(100);
    expect(result.current.isExhausted).toBe(false);
  });

  it('detects exhausted quota when remaining tokens reach zero', () => {
    vi.spyOn(AuthContextModule, 'useUser').mockReturnValue({
      profile: {
        id: 'user_3',
        plan: 'free',
        tokens_used: 500, // equal or greater than free limit
        bonus_tokens: 0,
      },
      refreshProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useTokens());

    expect(result.current.remaining).toBe(0);
    expect(result.current.isExhausted).toBe(true);
  });
});
