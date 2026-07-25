import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useUser } from '../AuthContext';
import { supabaseBrowser } from '../../lib/supabase-browser';

vi.mock('../../lib/supabase-browser', () => ({
  supabaseBrowser: {
    auth: {
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

function TestConsumer() {
  const { user, profile, isLoading, signOut } = useUser();

  if (isLoading) return <div>Loading Auth...</div>;
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <div data-testid="profile-plan">{profile?.plan || 'No Profile'}</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

describe('AuthContext and AuthProvider', () => {

  it('provides default unauthenticated context state when used outside AuthProvider', () => {
    render(<TestConsumer />);
    expect(screen.getByText('Loading Auth...')).toBeInTheDocument();
  });

  it('initializes with unauthenticated user state when onAuthStateChange fires SIGNED_OUT', async () => {
    let authCallback: any;
    vi.mocked(supabaseBrowser.auth.onAuthStateChange).mockImplementation((cb: any) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } } as any;
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      authCallback('SIGNED_OUT', null);
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    expect(screen.getByTestId('profile-plan')).toHaveTextContent('No Profile');
  });

  it('sets user state and fetches profile when onAuthStateChange fires SIGNED_IN', async () => {
    let authCallback: any;
    vi.mocked(supabaseBrowser.auth.onAuthStateChange).mockImplementation((cb: any) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } } as any;
    });

    vi.mocked(supabaseBrowser.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'user_999',
          email: 'test@example.com',
          plan: 'pro',
          tokens_used: 10,
        },
      }),
    } as any);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      authCallback('SIGNED_IN', {
        user: { id: 'user_999', email: 'test@example.com' },
      });
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('profile-plan')).toHaveTextContent('pro');
  });
});
