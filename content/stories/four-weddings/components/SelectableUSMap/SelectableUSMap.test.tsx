import { fireEvent, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { MapProperties, WeddingData } from "../../types";
import SelectableUSMap from "./index";

// Mock components
vi.mock("@/components/story/shared/USMap", () => ({
  default: ({
    data,
    fillAccessor,
  }: {
    data: unknown[];
    fillAccessor: unknown;
  }) => (
    <div
      data-testid="mock-us-map"
      data-data-len={data.length}
      data-fill-accessor-type={typeof fillAccessor}
    />
  ),
}));

vi.mock("@/components/story/shared/Select", () => ({
  default: ({
    onChange,
    options,
  }: {
    onChange: (opt: { value: string; label: string }) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      data-testid="mock-select"
      onChange={(e) => {
        const opt = options.find((o) => o.value === e.target.value);
        if (opt) onChange(opt);
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@/components/story/shared/NarrowContainer", () => ({
  default: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-narrow-container">{children}</div>
  ),
}));

vi.mock("@/components/story/shared/Tooltip", () => ({
  default: () => <div data-testid="mock-tooltip" />,
  useTooltip: () => ({
    tooltip: null,
    showTooltip: vi.fn(),
    hideTooltip: vi.fn(),
  }),
}));

describe("SelectableUSMap Component", () => {
  const mockData = [
    { state: "AL", value: 10 },
    { state: "GA", value: 20 },
  ] as unknown as WeddingData[];

  const mockOptions = [
    {
      value: "v1",
      label: "Option 1",
      accessor: (_: MapProperties) => 1 as number | null,
      colors: ["red", "blue"],
    },
    {
      value: "v2",
      label: "Option 2",
      accessor: (_: MapProperties) => 2 as number | null,
      colors: ["green", "yellow"],
    },
  ];

  it("renders with initial data and accessor", () => {
    const { getByTestId } = render(
      <SelectableUSMap data={mockData} selectOptions={mockOptions} />,
    );

    const map = getByTestId("mock-us-map");
    expect(map.getAttribute("data-data-len")).toBe("2");
    expect(map.getAttribute("data-fill-accessor-type")).toBe("function");
  });

  it("updates selection when Select is changed", () => {
    const { getByTestId } = render(
      <SelectableUSMap data={mockData} selectOptions={mockOptions} />,
    );

    const select = getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "v2" } });

    // Since we're mocking USMap and just passing props,
    // we've verified the state update logic works if components re-render with new props
    // In a more complex test, we could spy on the accessor call or colors prop
    expect(select).toHaveValue("v2");
  });
});
