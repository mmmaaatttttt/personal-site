import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import StyledTable from ".";

describe("StyledTable Component", () => {
  const mockHeaders = [
    { key: "h1", content: "Header 1" },
    { key: "h2", content: "Header 2" },
  ];

  const mockRows = [
    {
      key: "r1",
      cells: [
        { key: "r1c1", content: "Row 1 Cell 1" },
        { key: "r1c2", content: "Row 1 Cell 2" },
      ],
    },
    {
      key: "r2",
      cells: [
        { key: "r2c1", content: "Row 2 Cell 1" },
        { key: "r2c2", content: "Row 2 Cell 2" },
      ],
    },
  ];

  it("renders headers correctly", () => {
    render(<StyledTable headers={mockHeaders} />);

    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Header 2")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  it("renders rows and cells correctly", () => {
    render(<StyledTable rows={mockRows} />);

    expect(screen.getByText("Row 1 Cell 1")).toBeInTheDocument();
    expect(screen.getByText("Row 1 Cell 2")).toBeInTheDocument();
    expect(screen.getByText("Row 2 Cell 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2 Cell 2")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // tbody rows (thead not present here)
  });

  it("renders both headers and rows together", () => {
    render(<StyledTable headers={mockHeaders} rows={mockRows} />);

    expect(screen.getAllByRole("row")).toHaveLength(3); // 1 header row + 2 data rows
  });

  it("applies custom padding via style tag", () => {
    const customPadding = "2rem 2rem";
    const { container } = render(<StyledTable padding={customPadding} />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.innerHTML).toContain(`padding: ${customPadding}`);
  });

  it("renders children if provided", () => {
    render(
      <StyledTable>
        <tfoot>
          <tr>
            <td>Footer Content</td>
          </tr>
        </tfoot>
      </StyledTable>,
    );

    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("applies inline margin style when margin prop is provided", () => {
    const { container } = render(<StyledTable margin="auto" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ margin: "auto" });
  });

  it("applies a row's className to its <tr>", () => {
    const rowsWithClassName = [
      { ...mockRows[0], className: "highlight-row" },
      mockRows[1],
    ];
    render(<StyledTable rows={rowsWithClassName} />);

    const rows = screen.getAllByRole("row");
    expect(rows[0]).toHaveClass("highlight-row");
    expect(rows[1].className).toBe("");
  });

  it("renders string[][] data via the data prop", () => {
    const tableData = [
      ["Name", "Score"],
      ["Alice", "95"],
      ["Bob", "87"],
    ];
    render(<StyledTable data={tableData} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
  });
});
