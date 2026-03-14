import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IssueRow } from '../IssueRow';

describe('IssueRow', () => {
  const props = {
    title: 'Missing alt attribute',
    site: 'example.com',
    severity: 'Critical' as const,
    pages: 12,
    status: 'Open' as const,
  };

  it('renders issue title and site', () => {
    render(<IssueRow {...props} />);

    expect(screen.getByText('Missing alt attribute')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('renders severity badge', () => {
    render(<IssueRow {...props} />);

    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('renders page count', () => {
    render(<IssueRow {...props} />);

    expect(screen.getByText('12 pages')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<IssueRow {...props} />);

    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
