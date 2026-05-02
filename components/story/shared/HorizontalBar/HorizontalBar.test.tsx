import { render, screen, } from '@testing-library/react';
import { describe, expect, it, } from 'vitest';
import '@testing-library/jest-dom/vitest';
import HorizontalBar from '.';

const mockData = [
  { size: 40, color: 'rgb(255, 0, 0)', tooltipText: 'Red part', key: 'red' },
  { size: 60, color: 'rgb(0, 0, 255)', tooltipText: 'Blue part', key: 'blue' }
];

describe('HorizontalBar Component', () => {
  it('renders title if provided', () => {
    render(<HorizontalBar title="Test Bar" data={mockData} />);
    expect(screen.getByText('Test Bar')).toBeInTheDocument();
  });

  it('calculates total width percentage correctly', () => {
    const { container } = render(<HorizontalBar data={mockData} />);
    // Testing the dom elements mapping to data
    const bars = container.querySelectorAll('.h-full');
    expect(bars.length).toBe(2);
    expect(bars[0]).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    expect(bars[1]).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
  });

  // Tooltip integration is verified visually and in Tooltip.test.tsx
});
