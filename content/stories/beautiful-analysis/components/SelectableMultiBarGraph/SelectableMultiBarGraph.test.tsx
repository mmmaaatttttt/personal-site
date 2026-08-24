import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { EpisodeSentimentCounts } from "../../data/ba-sentiment-counts";
import SelectableMultiBarGraph from "./index";

const { mockBaSentimentCounts, mockSentimentOptions } = vi.hoisted(() => ({
  mockBaSentimentCounts: {
    current: null as unknown as EpisodeSentimentCounts[] | null,
  },
  mockSentimentOptions: {
    current: null as unknown as { value: string; label: string }[][] | null,
  },
}));

vi.mock("../../data/ba-sentiment-counts", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../data/ba-sentiment-counts")>();
  return {
    ...actual,
    get default() {
      return mockBaSentimentCounts.current ?? actual.default;
    },
  };
});

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

// Mock MultiBarGraph to verify the data and yMax passed to it
vi.mock("@/components/story/shared/MultiBarGraph", () => ({
  default: ({ data, yMax }: { data: unknown[]; yMax?: number }) => (
    <div
      data-testid="mock-multi-bar-graph"
      data-data={JSON.stringify(data)}
      data-ymax={yMax}
    />
  ),
}));

describe("SelectableMultiBarGraph Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockBaSentimentCounts.current = null;
    mockSentimentOptions.current = null;
  });

  it("renders correctly and calculates yMax dynamically based on data", () => {
    render(<SelectableMultiBarGraph />);

    expect(
      screen.getByTestId("selectable-multi-bar-graph-container"),
    ).toBeInTheDocument();

    const graph = screen.getByTestId("mock-multi-bar-graph");
    const data = JSON.parse(graph.getAttribute("data-data") || "[]");
    const yMaxAttr = Number(graph.getAttribute("data-ymax"));

    expect(data.length).toBeGreaterThan(0);

    // Calculate expected yMax based on mock data (default selection index 2)
    const maxVal = Math.max(
      ...data.map((d: { counts: Record<string, number> }) =>
        Object.values(d.counts).reduce((a: number, b: number) => a + b, 0),
      ),
    );
    const expectedYMax = Math.ceil((maxVal * 1.1) / 100) * 100;

    expect(yMaxAttr).toBe(expectedYMax);
    expect(yMaxAttr).toBeGreaterThan(0);
  });

  it("updates the graph data and yMax when a different sentiment range is selected", () => {
    render(<SelectableMultiBarGraph />);

    const select = screen.getByRole("combobox");
    const graph = screen.getByTestId("mock-multi-bar-graph");
    const initialYMax = graph.getAttribute("data-ymax");

    // Change option to "Extremely Negative" (value "0")
    fireEvent.change(select, { target: { value: "0" } });

    const newYMax = screen
      .getByTestId("mock-multi-bar-graph")
      .getAttribute("data-ymax");

    // The data counts differ between index 2 and index 0, so yMax should update
    expect(newYMax).not.toBe(initialYMax);
  });

  it("passes an empty data array and falls back to the default yMax when there is no episode data", () => {
    mockBaSentimentCounts.current = [];
    render(<SelectableMultiBarGraph yMax={250} />);

    const graph = screen.getByTestId("mock-multi-bar-graph");
    expect(graph.getAttribute("data-data")).toBe("[]");
    expect(graph.getAttribute("data-ymax")).toBe("250");
  });

  it("falls back to sentiment index 0 when the selected option's value is empty", () => {
    mockSentimentOptions.current = [
      [
        { value: "0", label: "A" },
        { value: "1", label: "B" },
        { value: "", label: "C" },
        { value: "3", label: "D" },
        { value: "4", label: "E" },
      ],
    ];
    render(<SelectableMultiBarGraph />);

    const graph = screen.getByTestId("mock-multi-bar-graph");
    const data = JSON.parse(graph.getAttribute("data-data") ?? "[]");
    expect(data[0].counts).toEqual({ Chris: 29, Caller: 11 });
  });
});
