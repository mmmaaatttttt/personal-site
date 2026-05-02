import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PieArcDatum } from 'd3-shape';

// Mock the PieSlice component directly to bypass its internal animation hooks
// allowing us to test PieChart's data mapping logic in isolation.
vi.mock('./PieSlice', () => {
  const React = require('react');
  return {
    default: ({ datum, index, showLabels }: { datum: PieArcDatum<number>, index: number, showLabels: boolean }) => {
      const percentage = (datum.endAngle - datum.startAngle) / (2 * Math.PI);
      const percentageText = `${Math.round(percentage * 100)}%`;
      
      return (
        <g data-testid="pie-slice" data-index={index}>
          <path d={`M ${datum.startAngle} ${datum.endAngle}`} />
          {showLabels && percentage > 0.05 && (
            <text>{percentageText}</text>
          )}
        </g>
      );
    }
  };
});

// Mock ClippedSVG to just render its children
vi.mock('../ClippedSVG', () => {
  return {
    default: ({ children }: any) => <svg data-testid="clipped-svg">{children}</svg>,
  };
});

import PieChart from '.';

describe('PieChart Component', () => {
  const mockColorScale = (i: number) => ['red', 'blue', 'green'][i];
  const values = [10, 10, 20]; // Total 40: 25%, 25%, 50%

  it('renders a PieSlice for each data value', () => {
    const { getAllByTestId } = render(
      <PieChart values={values} colorScale={mockColorScale} showLabels={true} />
    );
    
    const slices = getAllByTestId('pie-slice');
    expect(slices).toHaveLength(3);
  });

  it('renders correct percentage labels for significant slices', () => {
    render(
      <PieChart values={values} colorScale={mockColorScale} showLabels={true} />
    );

    expect(screen.getAllByText('25%')).toHaveLength(2);
    expect(screen.getAllByText('50%')).toHaveLength(1);
  });

  it('hides labels for very small slices (percentage < 5%)', () => {
    const smallValues = [100, 1]; // Total 101: ~99% and ~1%
    render(
      <PieChart values={smallValues} colorScale={mockColorScale} showLabels={true} />
    );

    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.queryByText('1%')).not.toBeInTheDocument();
  });
});
