import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CollocationTable from './index';

// Mock StyledTable for verification
vi.mock('@/components/story/shared/StyledTable', () => ({
  default: ({ headers, rows }: any) => (
    <div data-testid="mock-styled-table">
      <div data-testid="headers-count">{headers.length}</div>
      <div data-testid="rows-count">{rows.length}</div>
      <div data-testid="first-row-chris">{JSON.stringify(rows[0].cells[0].content.props.children)}</div>
    </div>
  ),
}));

describe('CollocationTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and transforms collocation data into table props', () => {
    render(<CollocationTable />);
    
    expect(screen.getByTestId('collocation-table-container')).toBeInTheDocument();
    
    // Check headers count (Chris, Caller)
    expect(screen.getByTestId('headers-count')).toHaveTextContent('2');
    
    // Check rows are present
    const rowsCount = parseInt(screen.getByTestId('rows-count').textContent || '0');
    expect(rowsCount).toBeGreaterThan(0);
    
    // Check specific data from first row
    // In ba-common-phrases.json, Chris[0] should be "I mean" or similar
    expect(screen.getByTestId('first-row-chris').textContent).not.toBe('""');
  });
});
