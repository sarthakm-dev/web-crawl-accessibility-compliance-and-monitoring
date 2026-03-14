import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TableFilters } from '../TableFilters';

describe('TableFilters', () => {
  const createProps = () => ({
    search: '',
    status: '',
    limit: 10,
    statusOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    limitOptions: [
      { label: '10', value: 10 },
      { label: '20', value: 20 },
    ],
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onLimitChange: vi.fn(),
  });

  it('renders search input', () => {
    render(<TableFilters {...createProps()} />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<TableFilters {...props} />);

    const input = screen.getByPlaceholderText('Search...');

    await user.type(input, 'test');

    expect(props.onSearchChange).toHaveBeenCalled();
  });

  it('renders status filter', () => {
    render(<TableFilters {...createProps()} />);

    expect(screen.getByText('Filter Status')).toBeInTheDocument();
  });

  it('renders limit filter', () => {
    render(<TableFilters {...createProps()} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('hides status filter when showStatus=false', () => {
    render(<TableFilters {...createProps()} showStatus={false} />);

    expect(screen.queryByText('Filter Status')).toBeNull();
  });

  it('hides limit filter when showLimit=false', () => {
    render(<TableFilters {...createProps()} showLimit={false} />);

    expect(screen.queryByText('10')).toBeNull();
  });
});
