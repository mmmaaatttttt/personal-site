import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SentimentScoreTable from "./index";

type MockHeader = { key: string; content: ReactNode };
type MockCell = { key: string; content: ReactNode };
type MockRow = { key: string; cells: MockCell[] };

const { mockSentimentOptions } = vi.hoisted(() => ({
  mockSentimentOptions: {
    current: null as unknown as { value: string; label: string }[][] | null,
  },
}));

vi.mock("../../data/beautiful-analysis", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../data/beautiful-analysis")>();
  return {
    ...actual,
    get defaultSentimentOptions() {
      return mockSentimentOptions.current ?? actual.defaultSentimentOptions;
    },
  };
});

// Mock StyledTable for easier verification
vi.mock("@/components/story/shared/StyledTable", () => ({
  default: ({ headers, rows }: { headers: MockHeader[]; rows: MockRow[] }) => (
    <div data-testid="mock-styled-table" data-rows-count={rows.length}>
      <div data-testid="mock-headers">
        {JSON.stringify(headers.map((h) => h.key))}
      </div>
      <div data-testid="mock-rows-data">{JSON.stringify(rows.length)}</div>
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h.key}>{h.content}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell) => (
                <td key={cell.key}>{cell.content}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

describe("SentimentScoreTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockSentimentOptions.current = null;
  });

  it("renders correctly and filters data initial state", () => {
    render(<SentimentScoreTable />);

    expect(
      screen.getByTestId("sentiment-score-table-container"),
    ).toBeInTheDocument();

    const table = screen.getByTestId("mock-styled-table");
    const rowCount = parseInt(table.getAttribute("data-rows-count") || "0", 10);

    // Initial selection should have some rows
    expect(rowCount).toBeGreaterThan(0);
  });

  it("updates table rows when a different filter is selected", () => {
    render(<SentimentScoreTable />);

    const initialContent = screen.getByTestId("mock-styled-table").textContent;

    const select = screen.getByRole("combobox");
    // Change to a different index (e.g., 0 for most negative)
    fireEvent.change(select, { target: { value: "0" } });

    const newContent = screen.getByTestId("mock-styled-table").textContent;
    // Different filters should yield different content
    expect(newContent).not.toBe(initialContent);
  });

  it("renders the caption when provided", () => {
    render(<SentimentScoreTable caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });

  it("does not render a caption element when not provided", () => {
    const { container } = render(<SentimentScoreTable />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("falls back to the full [-1, 1] range when the selected filter has no matching range", () => {
    render(<SentimentScoreTable sentimentRanges={[[-1, 1]]} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "4" } });

    const table = screen.getByTestId("mock-styled-table");
    const rowCount = parseInt(table.getAttribute("data-rows-count") || "0", 10);
    expect(rowCount).toBeGreaterThan(0);
  });

  it("renders nothing when there are no sentiment options", () => {
    mockSentimentOptions.current = [];
    const { container } = render(<SentimentScoreTable />);
    expect(container).toBeEmptyDOMElement();
  });
});
