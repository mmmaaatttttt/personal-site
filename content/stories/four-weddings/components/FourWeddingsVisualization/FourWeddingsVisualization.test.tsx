import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import FourWeddingsVisualization from './index';

// Mock the nested Selectable components
vi.mock('../SelectableUSMap', () => ({ default: () => <div data-testid="mock-map" /> }));
vi.mock('../SelectableHistogram', () => ({ default: () => <div data-testid="mock-histogram" /> }));
vi.mock('../SelectablePieChart', () => ({ default: () => <div data-testid="mock-pie" /> }));
vi.mock('../SelectableScatterplot', () => ({ default: () => <div data-testid="mock-scatter" /> }));

describe('FourWeddingsVisualization Dispatcher', () => {
  it('renders the US Map when vizType is "map"', () => {
    const { getByTestId } = render(<FourWeddingsVisualization vizType="map" vizIndex={1} />);
    expect(getByTestId('mock-map')).toBeInTheDocument();
  });

  it('renders the Histogram when vizType is "histogram"', () => {
    const { getByTestId } = render(<FourWeddingsVisualization vizType="histogram" vizIndex={1} />);
    expect(getByTestId('mock-histogram')).toBeInTheDocument();
  });

  it('renders the Pie Chart when vizType is "pie"', () => {
    const { getByTestId } = render(<FourWeddingsVisualization vizType="pie" vizIndex={1} />);
    expect(getByTestId('mock-pie')).toBeInTheDocument();
  });

  it('renders the Scatterplot when vizType is "scatter"', () => {
    const { getByTestId } = render(<FourWeddingsVisualization vizType="scatter" vizIndex={1} />);
    expect(getByTestId('mock-scatter')).toBeInTheDocument();
  });

  it('renders a caption when provided', () => {
    const { getByText } = render(
      <FourWeddingsVisualization vizType="pie" vizIndex={1} caption="Test Caption" />
    );
    expect(getByText('Test Caption')).toBeInTheDocument();
  });
});
