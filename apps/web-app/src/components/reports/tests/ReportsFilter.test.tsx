import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportsFilters } from '../ReportsFilter';
import api from '@/utils/api';

vi.mock('@/utils/api');

const mockSites = {
  data: {
    data: [
      {
        id: 'site1',
        name: 'Example',
        base_url: 'example.com',
      },
    ],
  },
};

describe('ReportsFilters', () => {
  const setSiteId = vi.fn();
  const setStartDate = vi.fn();
  const setEndDate = vi.fn();
  const onGenerate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (api.get as any).mockResolvedValue(mockSites);
  });

  it('fetches sites on mount', async () => {
    render(
      <ReportsFilters
        siteId=""
        setSiteId={setSiteId}
        startDate="2024-01-01"
        endDate="2024-01-02"
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={onGenerate}
      />
    );

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith('/api/sites?limit=100')
    );
  });

  it('updates start date', async () => {
    render(
      <ReportsFilters
        siteId=""
        setSiteId={setSiteId}
        startDate="2024-01-01"
        endDate="2024-01-02"
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={onGenerate}
      />
    );

    await waitFor(() => screen.getByLabelText('Start Date'));

    const startInput = screen.getByLabelText('Start Date');

    fireEvent.change(startInput, {
      target: { value: '2024-02-01' },
    });

    expect(setStartDate).toHaveBeenCalledWith('2024-02-01');
  });

  it('updates end date', async () => {
    render(
      <ReportsFilters
        siteId=""
        setSiteId={setSiteId}
        startDate="2024-01-01"
        endDate="2024-01-02"
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={onGenerate}
      />
    );

    await waitFor(() => screen.getByLabelText('End Date'));

    const endInput = screen.getByLabelText('End Date');

    fireEvent.change(endInput, {
      target: { value: '2024-02-01' },
    });

    expect(setEndDate).toHaveBeenCalledWith('2024-02-01');
  });

  it('calls onGenerate when button clicked', async () => {
    render(
      <ReportsFilters
        siteId="site1"
        setSiteId={setSiteId}
        startDate="2024-01-01"
        endDate="2024-01-02"
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={onGenerate}
      />
    );

    await waitFor(() =>
      screen.getByRole('button', { name: /generate report/i })
    );

    const button = screen.getByRole('button', { name: /generate report/i });

    await userEvent.click(button);

    expect(onGenerate).toHaveBeenCalled();
  });

  it('disables button when no site selected', async () => {
    render(
      <ReportsFilters
        siteId=""
        setSiteId={setSiteId}
        startDate="2024-01-01"
        endDate="2024-01-02"
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onGenerate={onGenerate}
      />
    );

    await waitFor(() =>
      screen.getByRole('button', { name: /generate report/i })
    );

    const button = screen.getByRole('button', { name: /generate report/i });

    expect(button).toBeDisabled();
  });
});
