import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportSection } from '../ExportSection';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('ExportSection', () => {
  const mutateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMutation as any).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it('calls mutation when button clicked', async () => {
    render(
      <ExportSection
        siteId="site-1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    const button = screen.getByRole('button', { name: /generate pdf/i });

    await userEvent.click(button);

    expect(mutateMock).toHaveBeenCalled();
  });

  it('shows warning when siteId missing', async () => {
    render(
      <ExportSection siteId={''} startDate="2024-01-01" endDate="2024-01-02" />
    );

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(toast.warning).toHaveBeenCalledWith('Please select a site first');
  });

  it('disables button when mutation pending', () => {
    (useMutation as any).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    });

    render(
      <ExportSection
        siteId="site-1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Generating...');
  });
});
