import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

describe('/api/detect-currency GET route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('returns supported currency info for recognized country code NG', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ countryCode: 'NG' }),
    });

    const req = new NextRequest('http://localhost:3000/api/detect-currency', {
      headers: { 'x-forwarded-for': '197.211.63.102' },
    });

    const response = await GET(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.supported).toBe(true);
    expect(json.currencyData).toEqual({ currency: 'NGN', symbol: '₦' });
  });

  it('returns default USD fallback for unsupported country code', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ countryCode: 'FR' }),
    });

    const req = new NextRequest('http://localhost:3000/api/detect-currency');

    const response = await GET(req);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.supported).toBe(false);
    expect(json.currencyData).toEqual({ currency: 'USD', symbol: '$' });
  });

  it('returns 500 status when IP API fetch throws an error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const req = new NextRequest('http://localhost:3000/api/detect-currency');

    const response = await GET(req);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json.error).toBe('Failed to parse location');
  });
});
