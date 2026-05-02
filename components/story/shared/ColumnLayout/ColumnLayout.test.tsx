import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ColumnLayout from '.';

describe('ColumnLayout Component', () => {
  it('renders children into separate columns', () => {
    render(
      <ColumnLayout>
        <div data-testid="col1">Col 1</div>
        <div data-testid="col2">Col 2</div>
      </ColumnLayout>
    );
    
    // Check if each child is wrapped in a flex-1 div
    const col1 = screen.getByTestId('col1').parentElement;
    const col2 = screen.getByTestId('col2').parentElement;
    
    expect(col1).toHaveClass('flex-1');
    expect(col2).toHaveClass('flex-1');
  });

  it('applies custom sizes to columns', () => {
    render(
      <ColumnLayout sizes={[1, 2]}>
        <div>Col 1</div>
        <div>Col 2</div>
      </ColumnLayout>
    );
    
    const divs = screen.getAllByText(/Col/).map(el => el.parentElement);
    expect(divs[0]).toHaveStyle({ flex: '1' });
    expect(divs[1]).toHaveStyle({ flex: '2' });
  });

  it('applies breakpoint classes', () => {
    const { container } = render(
      <ColumnLayout break="md">
        <div>Col 1</div>
        <div>Col 2</div>
      </ColumnLayout>
    );
    
    expect(container.firstChild).toHaveClass('max-md:flex-col');
  });
});
