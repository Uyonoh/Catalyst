import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenMeter, TokensMobile } from '../TokenMeter';
import * as useTokensModule from '../../hooks/useTokens';

vi.mock('../../hooks/useTokens', () => ({
  useTokens: vi.fn(),
}));

describe('TokenMeter component', () => {
  it('renders ULTRA badge when user is on Ultra plan', () => {
    vi.spyOn(useTokensModule, 'useTokens').mockReturnValue({
      isSubscribed: true,
      isUltra: true,
      weeklyLimit: Infinity,
      bonusTokens: 0,
      remaining: Infinity,
      percentage: 100,
      isExhausted: false,
      used: 0,
      refreshProfile: vi.fn(),
    });

    render(<TokenMeter />);
    expect(screen.getByText('ULTRA')).toBeInTheDocument();
  });

  it('renders remaining tokens and token limit correctly for standard user', () => {
    vi.spyOn(useTokensModule, 'useTokens').mockReturnValue({
      isSubscribed: false,
      isUltra: false,
      weeklyLimit: 500,
      bonusTokens: 50,
      remaining: 450,
      percentage: 10,
      isExhausted: false,
      used: 50,
      refreshProfile: vi.fn(),
    });

    render(<TokenMeter />);
    expect(screen.getByText('450')).toBeInTheDocument();
    expect(screen.getByText('+50 bonus')).toBeInTheDocument();
  });

  it('renders mobile version TokensMobile properly', () => {
    vi.spyOn(useTokensModule, 'useTokens').mockReturnValue({
      isSubscribed: false,
      isUltra: false,
      weeklyLimit: 500,
      bonusTokens: 0,
      remaining: 300,
      percentage: 40,
      isExhausted: false,
      used: 200,
      refreshProfile: vi.fn(),
    });

    render(<TokensMobile />);
    expect(screen.getByText('300')).toBeInTheDocument();
  });
});
