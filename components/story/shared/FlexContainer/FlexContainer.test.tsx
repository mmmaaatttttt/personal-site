import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FlexContainer from '.';

describe('FlexContainer Component', () => {
  it('renders children correctly', () => {
    render(
      <FlexContainer>
        <div data-testid="child">Flex Child</div>
      </FlexContainer>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct flex direction classes', () => {
    const { rerender } = render(<FlexContainer column={false}>Content</FlexContainer>);
    expect(screen.getByText('Content')).toHaveClass('flex-row');
    
    rerender(<FlexContainer column={true}>Content</FlexContainer>);
    expect(screen.getByText('Content')).toHaveClass('flex-col');
  });

  it('applies alignment classes correctly', () => {
    render(
      <FlexContainer main="center" cross="end">
        Content
      </FlexContainer>
    );
    const container = screen.getByText('Content');
    expect(container).toHaveClass('justify-center');
    expect(container).toHaveClass('items-end');
  });

  it('applies custom styles', () => {
    render(
      <FlexContainer width="500px" margin="10px" textAlign="right" flex="2">
        Content
      </FlexContainer>
    );
    const container = screen.getByText('Content');
    expect(container).toHaveStyle({
      width: '500px',
      margin: '10px',
      textAlign: 'right',
      flex: '2',
    });
  });
});
