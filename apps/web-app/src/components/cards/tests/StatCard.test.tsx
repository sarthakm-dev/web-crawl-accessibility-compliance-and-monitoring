import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders title, value and change badge', () => {
    render(<StatCard title="Accessibility Score" value="92" change="+5%" />);

    expect(screen.getByText(/accessibility score/i)).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('renders different values correctly', () => {
    render(<StatCard title="Open Issues" value="120" change="-10%" />);

    expect(screen.getByText(/open issues/i)).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('-10%')).toBeInTheDocument();
  });
});
