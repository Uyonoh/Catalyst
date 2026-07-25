import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from '../ModelSelector';
import * as WorkspaceContextModule from '../../../context/WorkspaceContext';
import * as CatalogContextModule from '../../../context/CatalogContext';
import { FALLBACK_MODELS } from '../../../lib/models-shared';

vi.mock('../../../context/WorkspaceContext', () => ({
  useWorkspace: vi.fn(),
}));

vi.mock('../../../context/CatalogContext', () => ({
  useCatalog: vi.fn(),
}));

describe('ModelSelector component', () => {
  const setSelectedModelMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(WorkspaceContextModule, 'useWorkspace').mockReturnValue({
      selectedModel: 'gpt',
      setSelectedModel: setSelectedModelMock,
    } as any);

    vi.spyOn(CatalogContextModule, 'useCatalog').mockReturnValue({
      models: FALLBACK_MODELS,
      categories: [],
    });
  });

  it('renders currently selected model name and toggle button', () => {
    render(<ModelSelector />);

    expect(screen.getByLabelText('Select AI model')).toBeInTheDocument();
    expect(screen.getByText('ChatGPT-5')).toBeInTheDocument();
  });

  it('opens model dropdown list when toggle button is clicked', () => {
    render(<ModelSelector />);

    const toggleButton = screen.getByLabelText('Select AI model');
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Select Claude 4 Opus')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Gemini 3 Pro')).toBeInTheDocument();
  });

  it('selects new model and closes dropdown when an option is clicked', () => {
    render(<ModelSelector />);

    const toggleButton = screen.getByLabelText('Select AI model');
    fireEvent.click(toggleButton);

    const claudeOption = screen.getByLabelText('Select Claude 4 Opus');
    fireEvent.click(claudeOption);

    expect(setSelectedModelMock).toHaveBeenCalledWith('claude');
    expect(screen.queryByLabelText('Select Claude 4 Opus')).not.toBeInTheDocument();
  });
});
