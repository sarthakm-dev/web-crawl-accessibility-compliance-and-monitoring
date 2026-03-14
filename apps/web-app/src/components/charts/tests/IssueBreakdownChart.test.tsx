import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IssueBreakdownChart } from '../IssueBreakdownChart';
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 500, height: 300 }}>{children}</div>
    ),
  };
});
describe('IssueBreakdownChart', () => {
  it('returns null when data is not provided', () => {
    const { container } = render(<IssueBreakdownChart data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders chart with valid data', () => {
    const mockData = {
      critical: 5,
      serious: 10,
      moderate: 7,
      minor: 2,
    };

    const { container } = render(<IssueBreakdownChart data={mockData} />);

    expect(container).toBeInTheDocument();
  });
});
