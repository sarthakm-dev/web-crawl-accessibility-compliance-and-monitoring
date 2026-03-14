import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaginationControls } from '../Pagination';

describe('PaginationControls', () => {
  const mockSetSearchParams = vi.fn();

  const defaultProps = {
    page: 2,
    limit: 10,
    totalPages: 5,
    search: '',
    status: '',
    setSearchParams: mockSetSearchParams,
  };

  it('renders current page information', () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('calls setSearchParams when clicking previous', () => {
    render(<PaginationControls {...defaultProps} />);

    fireEvent.click(screen.getByText('Previous'));

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '1',
      limit: '10',
      search: '',
      status: '',
    });
  });

  it('calls setSearchParams when clicking next', () => {
    render(<PaginationControls {...defaultProps} />);

    fireEvent.click(screen.getByText('Next'));

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '3',
      limit: '10',
      search: '',
      status: '',
    });
  });

  it('disables previous button on first page', () => {
    render(<PaginationControls {...defaultProps} page={1} />);

    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PaginationControls {...defaultProps} page={5} totalPages={5} />);

    expect(screen.getByText('Next')).toBeDisabled();
  });
});
