import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Sidebar from '.';

describe('Sidebar Component', () => {
  it('renders children correctly', () => {
    render(<Sidebar>Test Sidebar Content</Sidebar>);
    expect(screen.getByText('Test Sidebar Content')).toBeInTheDocument();
  });

  it('applies the direction prop correctly', () => {
    const { container } = render(<Sidebar direction="right">Right aligned</Sidebar>);
    expect(container.firstChild).toHaveClass('right-4');
    expect(container.firstChild).not.toHaveClass('left-4');
  });
});
