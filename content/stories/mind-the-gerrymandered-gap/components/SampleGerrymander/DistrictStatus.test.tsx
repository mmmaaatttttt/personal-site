import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DistrictStatus from "./DistrictStatus";

const baseProps = {
  rowCount: 6,
  colCount: 9,
  districts: [] as [number, number][][],
  saveable: false,
  onSave: vi.fn(),
  onReset: vi.fn(),
};

function makeDistrict(rows: number[]): [number, number][] {
  return rows.map((r, c) => [r, c] as [number, number]);
}

describe("DistrictStatus", () => {
  it("renders without crashing", () => {
    render(<DistrictStatus {...baseProps} />);
  });

  it("renders one row per district slot", () => {
    render(<DistrictStatus {...baseProps} />);
    expect(screen.getByText(/D1:/)).toBeInTheDocument();
    expect(screen.getByText(/D6:/)).toBeInTheDocument();
  });

  it("shows '--' for missing districts", () => {
    const { container } = render(<DistrictStatus {...baseProps} />);
    const headings = container.querySelectorAll("h4");
    expect(headings[0].textContent).toContain("--");
  });

  it("shows district size when district exists", () => {
    const districts: [number, number][][] = [makeDistrict([0, 1, 2, 0, 1, 2, 0, 1, 2])];
    render(<DistrictStatus {...baseProps} districts={districts} />);
    expect(screen.getByText(/D1: 9/)).toBeInTheDocument();
  });

  it("shows blue/red breakdown when district exists", () => {
    // rows 0,2,4,6,8 are even (blue); rows 1,3 are odd (red)
    const district = [
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
    ] as [number, number][];
    render(
      <DistrictStatus {...baseProps} districts={[district]} />
    );
    // 3 blue (rows 0,2), 3 red (row 1) - wait rows are [0,0][0,1][0,2][1,0][1,1][1,2][2,0][2,1][2,2]
    // rows 0,2 = even (blue) = 6 cells; row 1 = odd (red) = 3 cells
    expect(screen.getByText(/6 blue, 3 red/)).toBeInTheDocument();
  });

  it("shows too many districts warning when districts exceed rowCount", () => {
    const tooMany: [number, number][][] = Array.from({ length: 8 }, () => []);
    render(<DistrictStatus {...baseProps} districts={tooMany} />);
    expect(screen.getByText(/Too many districts/)).toBeInTheDocument();
  });

  it("calls onSave when Save button is clicked (saveable)", () => {
    const onSave = vi.fn();
    render(<DistrictStatus {...baseProps} saveable={true} onSave={onSave} />);
    fireEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("Save button is disabled when not saveable", () => {
    render(<DistrictStatus {...baseProps} saveable={false} />);
    expect(screen.getByText("Saved")).toBeDisabled();
  });

  it("calls onReset when Reset button is clicked", () => {
    const onReset = vi.fn();
    render(<DistrictStatus {...baseProps} onReset={onReset} />);
    fireEvent.click(screen.getByText("Reset"));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
