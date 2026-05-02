import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ClippedSVG from '.';

// Mock ResizeObserver for JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('ClippedSVG Component', () => {
  const defaultProps = {
    id: 'test-svg',
    width: 600,
    height: 400,
    padding: 20,
  };

  it('renders correctly with viewBox and children', () => {
    const { container } = render(
      <ClippedSVG {...defaultProps}>
        <circle cx={50} cy={50} r={10} data-testid="test-child" />
      </ClippedSVG>
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 600 400');
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('generates correct clipPath and rect attributes', () => {
    const { container } = render(<ClippedSVG {...defaultProps}><g /></ClippedSVG>);
    
    const clipPath = container.querySelector('clipPath');
    expect(clipPath).toHaveAttribute('id', 'clip-path-test-svg');
    
    const rect = clipPath?.querySelector('rect');
    // padding 20 means top=20, left=0, right=20, bottom=20 according to the code:
    // typeof padding === "number" ? { top: padding, left: 0, right: padding, bottom: padding } : padding;
    expect(rect).toHaveAttribute('x', '0');
    expect(rect).toHaveAttribute('y', '20');
    // width - left - right = 600 - 0 - 20 = 580
    expect(rect).toHaveAttribute('width', '580');
    // height - top - bottom = 400 - 20 - 20 = 360
    expect(rect).toHaveAttribute('height', '360');
  });

  it('applies clip-path to child group by default', () => {
    const { container } = render(<ClippedSVG {...defaultProps}><g /></ClippedSVG>);
    const g = container.querySelector('svg > g');
    expect(g).toHaveAttribute('clip-path', 'url(#clip-path-test-svg)');
  });

  it('skips clip-path when clipChildren is false', () => {
    const { container } = render(<ClippedSVG {...defaultProps} clipChildren={false}><g /></ClippedSVG>);
    const g = container.querySelector('svg > g');
    expect(g).not.toHaveAttribute('clip-path');
  });
});
