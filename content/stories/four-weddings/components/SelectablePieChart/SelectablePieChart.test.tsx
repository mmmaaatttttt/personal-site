import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { PieOption, WeddingData } from "../../types";
import SelectablePieChart from "./index";

// Mock components
vi.mock("@/components/story/shared/PieChart", () => ({
  default: ({ values }: any) => (
    <div data-testid="mock-pie-chart" data-values={JSON.stringify(values)} />
  ),
}));

vi.mock("@/components/story/shared/Select", () => ({
  default: ({ onChange, options }: any) => (
    <select
      data-testid="mock-select"
      onChange={(e) => {
        const opt = options.find((o: any) => o.value === e.target.value);
        if (opt) onChange(opt);
      }}
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@/components/story/shared/NarrowContainer", () => ({
  default: ({ children }: any) => (
    <div data-testid="mock-narrow-container">{children}</div>
  ),
}));

describe("SelectablePieChart Component", () => {
  const mockData = [
    { id: 1, type: "A" },
    { id: 2, type: "B" },
  ] as unknown as WeddingData[];

  const mockOptions: PieOption[] = [
    {
      value: "v1",
      label: "Option 1",
      accessor: (_data: WeddingData[]) => [1, 2],
    },
    {
      value: "v2",
      label: "Option 2",
      accessor: (_data: WeddingData[]) => [10, 20],
    },
  ];

  const graphOptions = {
    colorScale: (_: number) => "red",
  };

  it("renders with the initial option data passed to PieChart", () => {
    const { getByTestId } = render(
      <SelectablePieChart
        data={mockData}
        selectOptions={mockOptions}
        graphOptions={graphOptions}
      />,
    );

    const chart = getByTestId("mock-pie-chart");
    const values = JSON.parse(chart.getAttribute("data-values") || "[]");

    // First option accessor output is passed through to PieChart
    expect(values).toEqual([1, 2]);
  });

  it("updates the PieChart values when a new option is selected", () => {
    const { getByTestId } = render(
      <SelectablePieChart
        data={mockData}
        selectOptions={mockOptions}
        graphOptions={graphOptions}
      />,
    );

    const select = getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "v2" } });

    const chart = getByTestId("mock-pie-chart");
    const values = JSON.parse(chart.getAttribute("data-values") || "[]");

    // Second option accessor output is passed through to PieChart
    expect(values).toEqual([10, 20]);
  });
});
