import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccessibilityTrendChart } from '../AccessibilityTrendChart';

describe('AccessibilityTrendChart', () => {
  it('renders chart without crashing', () => {
    const { container } = render(<AccessibilityTrendChart data={[]} />);

    expect(container).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    const mockData = [
      {
        created_at: '2024-01-01T10:00:00Z',
        accessibility_score: 85,
      },
      {
        created_at: '2024-01-02T10:00:00Z',
        accessibility_score: 90,
      },
    ];

    const { container } = render(<AccessibilityTrendChart data={mockData} />);

    expect(container).toBeInTheDocument();
  });
});
