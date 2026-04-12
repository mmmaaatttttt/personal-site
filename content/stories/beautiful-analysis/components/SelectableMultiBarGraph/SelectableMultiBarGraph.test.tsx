import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SelectableMultiBarGraph from './index';

// Mock MultiBarGraph to verify the data passed to it
vi.mock('@/components/story/shared/MultiBarGraph', () => ({
  default: ({ data }: any) => (
    <div data-testid="mock-multi-bar-graph" data-data={JSON.stringify(data)} />
  ),
}));

describe('SelectableMultiBarGraph Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and passes initial data to the graph', () => {
    render(<SelectableMultiBarGraph />);
    
    expect(screen.getByTestId('selectable-multi-bar-graph-container')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    const graph = screen.getByTestId('mock-multi-bar-graph');
    const data = JSON.parse(graph.getAttribute('data-data') || '[]');
    
    expect(data.length).toBeGreaterThan(0);
    // Initial selection should result in some data objects with counts
    expect(data[0]).toHaveProperty('meta');
    expect(data[0]).toHaveProperty('counts');
  });

  it('updates the graph data when a different sentiment range is selected', () => {
    render(<SelectableMultiBarGraph />);
    
    const select = screen.getByRole('combobox');
    const initialData = screen.getByTestId('mock-multi-bar-graph').getAttribute('data-data');
    
    // Change option (standard select)
    // The options are from baSentimentCounts. They are integers 0-4 usually.
    fireEvent.change(select, { target: { value: "0" } });
    
    const newData = screen.getByTestId('mock-multi-bar-graph').getAttribute('data-data');
    expect(newData).not.toBe(initialData);
  });
});
