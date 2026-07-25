import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlassPanel from '../GlassPanel';

describe('GlassPanel component', () => {
  it('renders children correctly', () => {
    render(
      <GlassPanel>
        <span>Test Glass Panel Content</span>
      </GlassPanel>
    );

    expect(screen.getByText('Test Glass Panel Content')).toBeInTheDocument();
  });

  it('handles click events when onClick prop is passed', () => {
    const handleClick = vi.fn();
    render(
      <GlassPanel onClick={handleClick}>
        <button>Clickable Content</button>
      </GlassPanel>
    );

    fireEvent.click(screen.getByText('Clickable Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with gradient border styling structure when gradientBorder is true', () => {
    const { container } = render(
      <GlassPanel gradientBorder={true}>
        <div>Gradient Border Content</div>
      </GlassPanel>
    );

    expect(container.querySelector('.bg-gradient-to-r')).toBeInTheDocument();
  });
});
