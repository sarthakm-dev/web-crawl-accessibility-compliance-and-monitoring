import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatBox } from '../StatBox';

describe('StatBox', () => {
  it('renders title and value', () => {
    render(<StatBox title="Active Sites" value="10" />);

    expect(screen.getByText(/active sites/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('updates when props change', () => {
    render(<StatBox title="Open Issues" value="25" />);

    expect(screen.getByText(/open issues/i)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
