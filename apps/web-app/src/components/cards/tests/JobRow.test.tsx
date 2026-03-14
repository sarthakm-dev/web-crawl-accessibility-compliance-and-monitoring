import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JobRow } from '../JobRow';

describe('JobRow', () => {
  it('renders site name and pages', () => {
    render(<JobRow site="example.com" pages="15" status="Completed" />);

    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByText('15 pages')).toBeInTheDocument();
  });

  it('renders completed status with green style', () => {
    render(<JobRow site="example.com" pages="15" status="Completed" />);

    const status = screen.getByText('Completed');

    expect(status).toBeInTheDocument();
    expect(status.className).toContain('text-green-600');
  });

  it('renders failed status with red style', () => {
    render(<JobRow site="example.com" pages="15" status="Failed" />);

    const status = screen.getByText('Failed');

    expect(status.className).toContain('text-red-600');
  });

  it('renders running status with blue style', () => {
    render(<JobRow site="example.com" pages="15" status="Running" />);

    const status = screen.getByText('Running');

    expect(status.className).toContain('text-blue-600');
  });
});
