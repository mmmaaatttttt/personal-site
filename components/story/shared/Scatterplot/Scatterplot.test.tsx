import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Scatterplot from '.';

// Mock Graph component
vi.mock('../Graph', () => ({
  default: ({ children }: any) => <svg data-testid="mock-graph">{children}</svg>,
}));

// Mock ScatterPoint component
vi.mock('./ScatterPoint', () => ({
  default: ({ cx, cy, area, fill }: any) => (
    <circle data-testid="scatter-point" cx={cx} cy={cy} r={Math.sqrt(area)} fill={fill} />
  ),
}));

describe('Scatterplot Component', () => {
  const mockData = [
    { key: 'a', cx: 0, cy: 0, area: 100, fill: 'red' },
    { key: 'b', cx: 100, cy: 100, area: 400, fill: 'blue' },
  ];

  const defaultProps = {
    data: mockData,
    width: 600,
    height: 600,
    graphPadding: 0,
  };

  it('renders a ScatterPoint for each data item', () => {
    const { getAllByTestId } = render(<Scatterplot {...defaultProps} />);
    const points = getAllByTestId('scatter-point');
    expect(points).toHaveLength(2);
  });

  it('calculates correct cx and cy coordinates based on linear scales', () => {
    const { getAllByTestId } = render(<Scatterplot {...defaultProps} />);
    const points = getAllByTestId('scatter-point');

    // For width 600, cx [0, 100] -> [0, 600]
    // Point a: cx 0 -> 0
    // Point b: cx 100 -> 600
    expect(Number(points[0].getAttribute('cx'))).toBe(0);
    expect(Number(points[1].getAttribute('cx'))).toBe(600);

    // For height 600, cy [0, 100] -> [600, 0] (inverted y scale)
    // Point a: cy 0 -> 600
    // Point b: cy 100 -> 0
    expect(Number(points[0].getAttribute('cy'))).toBe(600);
    expect(Number(points[1].getAttribute('cy'))).toBe(0);
  });

  it('passes the square root of area as the radius', () => {
    const { getAllByTestId } = render(<Scatterplot {...defaultProps} />);
    const points = getAllByTestId('scatter-point');

    // sqrt(100) -> 10
    // sqrt(400) -> 20
    expect(Number(points[0].getAttribute('r'))).toBe(10);
    expect(Number(points[1].getAttribute('r'))).toBe(20);
  });
});
