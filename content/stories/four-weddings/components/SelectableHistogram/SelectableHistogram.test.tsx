import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SelectableHistogram from "./index";

// Mock components
vi.mock("@/components/story/shared/BarGraph", () => ({
  default: ({ barData }: any) => (
    <div data-testid="mock-bar-graph" data-bar-data={JSON.stringify(barData)} />
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

describe("SelectableHistogram Component", () => {
  const mockData = [{ value: 10 }, { value: 15 }, { value: 25 }, { value: 50 }];

  const mockOptions = [
    {
      value: "v1",
      label: "Option 1",
      accessor: (d: any) => d.value,
      step: 10,
      format: ".0f",
    },
    {
      value: "v2",
      label: "Option 2",
      accessor: (d: any) => d.value * 2,
      step: 50,
      format: ".0f",
    },
  ];

  it("bins data correctly for the initial selection", () => {
    const { getByTestId } = render(
      <SelectableHistogram
        data={mockData as any}
        selectOptions={mockOptions}
      />,
    );

    const graph = getByTestId("mock-bar-graph");
    const barData = JSON.parse(graph.getAttribute("data-bar-data") || "[]");

    // With step 10: [0-10), [10-20), [20-30), [30-40), [40-50), [50-60)
    // 10, 15, 25, 50
    // [0-10): 0
    // [10-20): 2 (10, 15)
    // [20-30): 1 (25)
    // [40-50): 0
    // [50-60): 1 (50)

    const countWithHeight = barData.filter((b: any) => b.height > 0);
    expect(countWithHeight).toHaveLength(3);

    const bin10to20 = barData.find((b: any) => b.x0 === 10);
    expect(bin10to20.height).toBe(2);
  });

  it("updates bins when a new option is selected", () => {
    const { getByTestId } = render(
      <SelectableHistogram
        data={mockData as any}
        selectOptions={mockOptions}
      />,
    );

    const select = getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "v2" } });

    const graph = getByTestId("mock-bar-graph");
    const barData = JSON.parse(graph.getAttribute("data-bar-data") || "[]");

    // With x2 and step 50: [0-50), [50-100), [100-150)
    // Values: 20, 30, 50, 100
    // [0-50): 2 (20, 30)
    // [50-100): 1 (50)
    // [100-150): 1 (100)

    const firstBin = barData[0];
    expect(firstBin.height).toBe(2);
    // Values: 20, 30 are in [0, 50)
  });

  it("maintains consistent bin widths for all bars", () => {
    const { getByTestId } = render(
      <SelectableHistogram
        data={mockData as any}
        selectOptions={mockOptions}
      />,
    );

    const graph = getByTestId("mock-bar-graph");
    const barData = JSON.parse(graph.getAttribute("data-bar-data") || "[]");

    // Check filtering out null/undefined bins if any
    const validBins = barData.filter(
      (b: any) => b.x0 !== undefined && b.x1 !== undefined,
    );

    const firstWidth = validBins[0].x1 - validBins[0].x0;
    validBins.forEach((bin: any, i: number) => {
      expect(bin.x1 - bin.x0).toBe(firstWidth);
    });
  });
});
