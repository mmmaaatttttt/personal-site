import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import AxisLabel from '.';

describe('AxisLabel Component', () => {
  it('renders correctly with children', () => {
    render(
      <svg>
        <AxisLabel>Test Label</AxisLabel>
      </svg>
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies default styles and attributes', () => {
    render(
      <svg>
        <AxisLabel>Test Label</AxisLabel>
      </svg>
    );
    const text = screen.getByText('Test Label');
    expect(text).toHaveAttribute('text-anchor', 'middle');
    expect(text.style.fontSize).toBe('1.25rem');
  });

  it('respects custom props', () => {
    render(
      <svg>
        <AxisLabel 
          anchor="start" 
          fontSize="2rem" 
          x={100} 
          y={200}
          className="custom-class"
        >
          Custom Label
        </AxisLabel>
      </svg>
    );
    const text = screen.getByText('Custom Label');
    expect(text).toHaveAttribute('text-anchor', 'start');
    expect(text).toHaveAttribute('x', '100');
    expect(text).toHaveAttribute('y', '200');
    expect(text.style.fontSize).toBe('2rem');
    expect(text).toHaveClass('custom-class');
  });
});
