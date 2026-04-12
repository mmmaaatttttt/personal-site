import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BaHorizontalBarGraph from './index';

// Mock HorizontalBarGraph to verify the data passed to it
vi.mock('@/components/story/shared/HorizontalBarGraph', () => ({
  default: ({ data }: any) => (
    <div data-testid="mock-horizontal-graph" data-data={JSON.stringify(data)} />
  ),
}));

describe('BaHorizontalBarGraph Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and transforms data with colors', () => {
    render(<BaHorizontalBarGraph />);
    
    expect(screen.getByTestId('ba-horizontal-bar-graph-container')).toBeInTheDocument();
    
    const graph = screen.getByTestId('mock-horizontal-graph');
    const data = JSON.parse(graph.getAttribute('data-data') || '[]');
    
    expect(data.length).toBeGreaterThan(0);
    
    // Check that fill colors are assigned
    expect(data[0]).toHaveProperty('fill');
    
    // Verify specific mapping if possible (Chris vs Caller)
    data.forEach((d: any) => {
      if (d.width > 0) {
        // Should be Chris's color (from beautiful-analysis data)
        // Chris: #2227ff
        expect(d.fill).toBe('#2227ff'); 
      } else {
        // Should be Caller's color
        // Caller: #ff8f34
        expect(d.fill).toBe('#ff8f34');
      }
    });
  });
});
