import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BaMultiBarGraph from './index';

// Mock MultiBarGraph to verify the data passed to it
vi.mock('@/components/story/shared/MultiBarGraph', () => ({
  default: ({ data }: any) => (
    <div 
      data-testid="mock-multi-bar-graph" 
      data-data-count={data.length} 
      data-first-value={data[0]?.counts?.Chris}
    />
  ),
}));

describe('BaMultiBarGraph Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders summary data by default', () => {
    render(<BaMultiBarGraph />);
    
    const graph = screen.getByTestId('mock-multi-bar-graph');
    // Summary data should have a certain number of entries
    expect(parseInt(graph.getAttribute('data-data-count') || '0')).toBeGreaterThan(0);
  });

  it('renders profanity data when dataType="profanity" is passed', () => {
    const { rerender } = render(<BaMultiBarGraph dataType="summary" />);
    const graph = screen.getByTestId('mock-multi-bar-graph');
    const summaryValue = JSON.parse(graph.getAttribute('data-first-value') || '0');
    
    rerender(<BaMultiBarGraph dataType="profanity" />);
    const profanityValue = JSON.parse(graph.getAttribute('data-first-value') || '0');
    
    // Summary first Chris count is ~6394, Profanity is ~15.
    expect(profanityValue).not.toBe(summaryValue);
  });
});
