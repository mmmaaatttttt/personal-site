import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SelectableMultiBarGraph from './index';

// Mock MultiBarGraph to verify the data and yMax passed to it
vi.mock('@/components/story/shared/MultiBarGraph', () => ({
  default: ({ data, yMax }: any) => (
    <div 
      data-testid="mock-multi-bar-graph" 
      data-data={JSON.stringify(data)} 
      data-ymax={yMax}
    />
  ),
}));

describe('SelectableMultiBarGraph Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and calculates yMax dynamically based on data', () => {
    render(<SelectableMultiBarGraph />);
    
    expect(screen.getByTestId('selectable-multi-bar-graph-container')).toBeInTheDocument();
    
    const graph = screen.getByTestId('mock-multi-bar-graph');
    const data = JSON.parse(graph.getAttribute('data-data') || '[]');
    const yMaxAttr = Number(graph.getAttribute('data-ymax'));
    
    expect(data.length).toBeGreaterThan(0);
    
    // Calculate expected yMax based on mock data (default selection index 2)
    const maxVal = Math.max(...data.map((d: any) => Object.values(d.counts).reduce((a: any, b: any) => a + b, 0)));
    const expectedYMax = Math.ceil((maxVal * 1.1) / 100) * 100;
    
    expect(yMaxAttr).toBe(expectedYMax);
    expect(yMaxAttr).toBeGreaterThan(0);
  });

  it('updates the graph data and yMax when a different sentiment range is selected', () => {
    render(<SelectableMultiBarGraph />);
    
    const select = screen.getByRole('combobox');
    const graph = screen.getByTestId('mock-multi-bar-graph');
    const initialYMax = graph.getAttribute('data-ymax');
    
    // Change option to "Extremely Negative" (value "0")
    fireEvent.change(select, { target: { value: "0" } });
    
    const newYMax = screen.getByTestId('mock-multi-bar-graph').getAttribute('data-ymax');
    
    // The data counts differ between index 2 and index 0, so yMax should update
    expect(newYMax).not.toBe(initialYMax);
  });
});
