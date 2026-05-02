import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SentimentScoreTable from './index';

// Mock StyledTable for easier verification
vi.mock('@/components/story/shared/StyledTable', () => ({
  default: ({ headers, rows }: any) => (
    <div data-testid="mock-styled-table" data-rows-count={rows.length}>
      <div data-testid="mock-headers">{JSON.stringify(headers.map((h: any) => h.key))}</div>
      <div data-testid="mock-rows-data">{JSON.stringify(rows.length)}</div>
      <table>
        <thead>
           <tr>{headers.map((h: any) => <th key={h.key}>{h.content}</th>)}</tr>
        </thead>
        <tbody>
           {rows.map((row: any) => (
             <tr key={row.key}>{row.cells.map((cell: any) => <td key={cell.key}>{cell.content}</td>)}</tr>
           ))}
        </tbody>
      </table>
    </div>
  ),
}));

describe('SentimentScoreTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and filters data initial state', () => {
    render(<SentimentScoreTable />);
    
    expect(screen.getByTestId('sentiment-score-table-container')).toBeInTheDocument();
    
    const table = screen.getByTestId('mock-styled-table');
    const rowCount = parseInt(table.getAttribute('data-rows-count') || '0');
    
    // Initial selection should have some rows
    expect(rowCount).toBeGreaterThan(0);
  });

  it('updates table rows when a different filter is selected', () => {
    render(<SentimentScoreTable />);
    
    const initialContent = screen.getByTestId('mock-styled-table').textContent;
    
    const select = screen.getByRole('combobox');
    // Change to a different index (e.g., 0 for most negative)
    fireEvent.change(select, { target: { value: "0" } });
    
    const newContent = screen.getByTestId('mock-styled-table').textContent;
    // Different filters should yield different content
    expect(newContent).not.toBe(initialContent);
  });
});
