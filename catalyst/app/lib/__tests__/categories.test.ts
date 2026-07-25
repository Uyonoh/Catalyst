import { describe, it, expect, vi } from 'vitest';
import { getCategories } from '../categories';

vi.mock('../supabase-server', () => ({
  createPublicClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: '1', slug: 'chat', label: 'Chat', icon: 'chat', description: null, sort_order: 1, is_active: true },
          { id: '2', slug: 'code', label: 'Code', icon: 'code', description: null, sort_order: 2, is_active: true },
        ],
        error: null,
      }),
    }),
  }),
}));

describe('categories module', () => {
  it('fetches active categories ordered by sort_order from Supabase', async () => {
    const categories = await getCategories();
    expect(categories).toHaveLength(2);
    expect(categories[0].slug).toBe('chat');
    expect(categories[1].slug).toBe('code');
  });

  it('returns fallback categories when database query fails', async () => {
    const { createPublicClient } = await import('../supabase-server');
    const client = createPublicClient();
    vi.mocked(client.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockRejectedValueOnce(new Error('DB connection failed')),
    } as any);

    const categories = await getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0].slug).toBe('chat');
  });
});
