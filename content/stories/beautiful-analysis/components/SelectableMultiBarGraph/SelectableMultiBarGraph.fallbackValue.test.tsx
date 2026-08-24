import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SelectableMultiBarGraph from "./index";

vi.mock("../../data/beautiful-analysis", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../data/beautiful-analysis")>();
  return {
    ...actual,
    defaultSentimentOptions: [
      [
        { value: "0", label: "A" },
        { value: "1", label: "B" },
        { value: "", label: "C" },
        { value: "3", label: "D" },
        { value: "4", label: "E" },
      ],
    ],
  };
});

vi.mock("@/components/story/shared/MultiBarGraph", () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="mock-multi-bar-graph" data-data={JSON.stringify(data)} />
  ),
}));

describe("SelectableMultiBarGraph with a falsy default option value", () => {
  it("falls back to sentiment index 0 when the selected option's value is empty", () => {
    render(<SelectableMultiBarGraph />);

    const graph = screen.getByTestId("mock-multi-bar-graph");
    const data = JSON.parse(graph.getAttribute("data-data") ?? "[]");
    expect(data[0].counts).toEqual({ Chris: 29, Caller: 11 });
  });
});
