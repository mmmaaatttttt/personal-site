import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SelectableMultiBarGraph from "./index";

vi.mock("../../data/ba-sentiment-counts", () => ({ default: [] }));

vi.mock("@/components/story/shared/MultiBarGraph", () => ({
  default: ({ data, yMax }: { data: unknown[]; yMax?: number }) => (
    <div
      data-testid="mock-multi-bar-graph"
      data-data={JSON.stringify(data)}
      data-ymax={yMax}
    />
  ),
}));

describe("SelectableMultiBarGraph with no episode data", () => {
  it("passes an empty data array and falls back to the default yMax", () => {
    render(<SelectableMultiBarGraph yMax={250} />);

    const graph = screen.getByTestId("mock-multi-bar-graph");
    expect(graph.getAttribute("data-data")).toBe("[]");
    expect(graph.getAttribute("data-ymax")).toBe("250");
  });
});
