import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Legend from '.';

describe('Legend Component', () => {
  const mockLabels = [
    { text: 'Label 1', color: 'red' },
    { text: 'Label 2', color: 'blue' },
  ];

  it('renders title and labels correctly', () => {
    render(<Legend title="Test Legend" labels={mockLabels} />);
    
    expect(screen.getByText('Test Legend')).toBeInTheDocument();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    
    // Check for color boxes
    const colorBoxes = document.querySelectorAll('div[style*="background-color: red"]');
    expect(colorBoxes.length).toBeGreaterThan(0);
  });

  it('renders without title if not provided', () => {
    render(<Legend labels={mockLabels} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
  });
});
