import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Graph from '.';
import { scaleLinear } from 'd3-scale';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Axis and AxisLabel because they are tested separately
// This keeps Graph tests focused on layout coordination
vi.mock('../Axis', () => ({
  default: ({ direction, xShift = 0, yShift = 0 }: any) => (
    <g data-testid={`axis-${direction}`} transform={`translate(${xShift},${yShift})`} />
  )
}));

vi.mock('../AxisLabel', () => ({
  default: ({ children, x, y }: any) => (
    <text data-testid="axis-label" x={x} y={y}>{children}</text>
  )
}));

describe('Graph Component', () => {
  const xScale = scaleLinear().domain([0, 100]).range([0, 500]);
  const yScale = scaleLinear().domain([0, 100]).range([500, 0]);

  const defaultProps = {
    xScale,
    yScale,
    width: 600,
    height: 600,
    graphPadding: 50,
    svgPadding: 20,
    xLabel: 'X Axis',
    yLabel: 'Y Axis',
  };

  it('renders correctly with axes and labels', () => {
    const { container } = render(
      <Graph {...defaultProps}>
        <circle cx={100} cy={100} r={5} data-testid="child-element" />
      </Graph>
    );
    
    expect(screen.getByTestId('axis-x')).toBeInTheDocument();
    expect(screen.getByTestId('axis-y')).toBeInTheDocument();
    expect(screen.getByText('X Axis')).toBeInTheDocument();
    expect(screen.getByText('Y Axis')).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('applies correct axis positioning based on graphPadding', () => {
    // With graphPadding=50, left is 50, bottom is 50
    // x-axis (bottom) should be at height - padding = 600 - 50 = 550
    // y-axis (left) should be at padding = 50
    render(<Graph {...defaultProps} />);
    
    const xAxis = screen.getByTestId('axis-x');
    const yAxis = screen.getByTestId('axis-y');
    
    expect(xAxis).toHaveAttribute('transform', 'translate(0,550)');
    expect(yAxis).toHaveAttribute('transform', 'translate(50,0)');
  });

  it('renders a vertical zero edge line', () => {
    const { container } = render(<Graph {...defaultProps} />);
    const line = container.querySelector('line');
    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute('stroke', '#000');
    // yOptions.xShift for left is padding.left = 50
    expect(line).toHaveAttribute('x1', '50');
  });
});
