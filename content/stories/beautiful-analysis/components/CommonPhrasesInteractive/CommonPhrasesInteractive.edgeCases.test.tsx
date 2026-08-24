import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import CommonPhrasesInteractive from "./index";

interface SliderInitialDatum {
  initialValue: number;
  title: (val: number) => string;
}

const { capturedInitialData, mockValues } = vi.hoisted(() => ({
  capturedInitialData: { current: null as unknown as SliderInitialDatum[] },
  mockValues: { current: null as unknown as number[] },
}));

vi.mock("@/hooks/useSliders", () => ({
  default: (initialData: SliderInitialDatum[]) => {
    capturedInitialData.current = initialData;
    return {
      values: mockValues.current ?? initialData.map((d) => d.initialValue),
      sliderData: [],
    };
  },
}));

vi.mock("@/components/story/shared/Slider", () => ({
  SliderGroup: () => <div data-testid="mock-slider-group" />,
}));

vi.mock("@/components/story/shared/StyledTable", () => ({
  default: ({
    rows,
  }: {
    rows: { key: string; cells: { key: string; content: ReactNode }[] }[];
  }) => (
    <table data-testid="mock-styled-table">
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
  ),
}));

vi.mock("../../data/ba-common-phrases", () => ({
  default: {
    common_phrases: [
      {
        phrase_count: 2,
        speakers: {
          Chris: [
            ["going to", 10],
            ["want to", 8],
          ],
          Caller: [["I was", 12]],
        },
      },
    ],
    collocation_lists: [],
  },
}));

describe("CommonPhrasesInteractive slider title", () => {
  it("labels the slider with the word-phrase count", () => {
    render(<CommonPhrasesInteractive />);
    expect(capturedInitialData.current[0].title(5)).toBe("5-word phrases");
  });
});

describe("CommonPhrasesInteractive with no matching entry", () => {
  it("renders no table when the phrase count matches no entry", () => {
    mockValues.current = [999];
    render(<CommonPhrasesInteractive />);
    expect(screen.queryByTestId("mock-styled-table")).not.toBeInTheDocument();
    mockValues.current = null as unknown as number[];
  });
});

describe("CommonPhrasesInteractive with imbalanced speaker phrase counts", () => {
  it("fills missing cells with a placeholder when one speaker has fewer phrases", () => {
    mockValues.current = [2];
    render(<CommonPhrasesInteractive />);
    expect(screen.getByText("--")).toBeInTheDocument();
    mockValues.current = null as unknown as number[];
  });
});
