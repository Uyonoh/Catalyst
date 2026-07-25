import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModeSelector from '../ModeSelector';
import * as WorkspaceContextModule from '../../../context/WorkspaceContext';
import * as CatalogContextModule from '../../../context/CatalogContext';
import { FALLBACK_MODELS } from '../../../lib/models-shared';

vi.mock('../../../context/WorkspaceContext', () => ({
  useWorkspace: vi.fn(),
}));

vi.mock('../../../context/CatalogContext', () => ({
  useCatalog: vi.fn(),
}));

describe('ModeSelector component', () => {
  const setSelectedModeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(WorkspaceContextModule, 'useWorkspace').mockReturnValue({
      selectedModel: 'gpt',
      selectedMode: 'text',
      setSelectedMode: setSelectedModeMock,
    } as any);

    vi.spyOn(CatalogContextModule, 'useCatalog').mockReturnValue({
      models: FALLBACK_MODELS,
      categories: [],
    });
  });

  it('renders mode chips for multimodal models (e.g. GPT)', () => {
    render(<ModeSelector />);

    // GPT supports Text, Vision, Image, Audio, Code
    expect(screen.getByTitle('Text Mode')).toBeInTheDocument();
    expect(screen.getByTitle('Vision Mode')).toBeInTheDocument();
  });

  it('triggers setSelectedMode when a mode button is clicked', () => {
    render(<ModeSelector />);

    const visionButton = screen.getByTitle('Vision Mode');
    fireEvent.click(visionButton);

    expect(setSelectedModeMock).toHaveBeenCalledWith('vision');
  });

  it('hides/renders opacity-0 for unimodal models (e.g. DALL-E)', () => {
    vi.spyOn(WorkspaceContextModule, 'useWorkspace').mockReturnValue({
      selectedModel: 'dalle',
      selectedMode: 'image',
      setSelectedMode: setSelectedModeMock,
    } as any);

    const { container } = render(<ModeSelector />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('opacity-0');
  });
});
