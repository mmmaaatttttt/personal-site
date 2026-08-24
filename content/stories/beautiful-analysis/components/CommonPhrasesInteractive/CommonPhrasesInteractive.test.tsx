import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { CommonPhrases } from "../../data/ba-common-phrases";
import CommonPhrasesInteractive from "./index";

interface SliderInitialDatum {
  initialValue: number;
  title: (val: number) => string;
}

const { capturedInitialData, mockValues, mockCommonPhrases } = vi.hoisted(
  () => ({
    capturedInitialData: { current: null as unknown as SliderInitialDatum[] },
    mockValues: { current: null as unknown as number[] | null },
    mockCommonPhrases: { current: null as unknown as CommonPhrases | null },
  }),
);

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
    headers,
    rows,
  }: {
    headers: unknown[];
    rows: { key: string; cells: { key: string; content: ReactNode }[] }[];
  }) => (
    <div data-testid="mock-styled-table">
      <div data-testid="headers-count">{headers.length}</div>
      <div data-testid="rows-count">{rows.length}</div>
      <table>
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

vi.mock("../../data/ba-common-phrases", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../data/ba-common-phrases")>();
  return {
    ...actual,
    get default() {
      return mockCommonPhrases.current ?? actual.default;
    },
  };
});

describe("CommonPhrasesInteractive Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockValues.current = null;
    mockCommonPhrases.current = null;
  });

  it("renders correctly and transforms data for the initial phrase count", () => {
    render(<CommonPhrasesInteractive />);

    expect(
      screen.getByTestId("common-phrases-interactive-container"),
    ).toBeInTheDocument();

    // Chris and Caller headers
    expect(screen.getByTestId("headers-count")).toHaveTextContent("2");

    // Should have some rows for the initial phrase count
    const rowsCount = parseInt(
      screen.getByTestId("rows-count").textContent || "0",
      10,
    );
    expect(rowsCount).toBeGreaterThan(0);
  });

  it("labels the slider with the word-phrase count", () => {
    render(<CommonPhrasesInteractive />);
    expect(capturedInitialData.current[0].title(5)).toBe("5-word phrases");
  });

  it("renders no table when the phrase count matches no entry", () => {
    mockValues.current = [999];
    render(<CommonPhrasesInteractive />);
    expect(screen.queryByTestId("mock-styled-table")).not.toBeInTheDocument();
  });

  it("fills missing cells with a placeholder when one speaker has fewer phrases", () => {
    mockCommonPhrases.current = {
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
    };
    mockValues.current = [2];
    render(<CommonPhrasesInteractive />);
    expect(screen.getByText("--")).toBeInTheDocument();
  });
});
