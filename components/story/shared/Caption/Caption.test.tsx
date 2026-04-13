import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Caption from '.';

describe('Caption Component', () => {
  it('renders children and caption correctly', () => {
    render(
      <Caption caption="This is a test caption">
        <div data-testid="child">Main Content</div>
      </Caption>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('This is a test caption')).toBeInTheDocument();
    expect(screen.getByText('This is a test caption')).toHaveClass('italic');
  });

  it('renders without caption if not provided', () => {
    const { container } = render(
      <Caption>
        <div>Content only</div>
      </Caption>
    );
    
    expect(screen.getByText('Content only')).toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <Caption className="custom-wrapper-class">
        <div>Content</div>
      </Caption>
    );
    
    expect(container.firstChild).toHaveClass('custom-wrapper-class');
  });
});
