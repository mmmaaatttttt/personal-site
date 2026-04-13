import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ColoredSpan from '.';

describe('ColoredSpan Component', () => {
  it('renders children with correct color and font weight', () => {
    render(
      <ColoredSpan color="red" bold={true}>
        Highlighted Text
      </ColoredSpan>
    );
    
    const span = screen.getByText('Highlighted Text');
    expect(span).toBeInTheDocument();
    // JSDOM might return rgb(255, 0, 0) for red
    expect(span.style.color).toBe('red');
    expect(span.style.fontWeight).toBe('bold');
  });

  it('defaults to black color and normal weight', () => {
    render(<ColoredSpan>Default Text</ColoredSpan>);
    
    const span = screen.getByText('Default Text');
    expect(span.style.color).toBe('black');
    expect(span.style.fontWeight).toBe('normal');
  });
});
