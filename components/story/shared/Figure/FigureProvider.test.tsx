import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FigureProvider, useFigureNumber } from "./FigureProvider";

function TestFigure({ id, onNum }: { id: string; onNum: (n: number) => void }) {
  const num = useFigureNumber(id);
  onNum(num);
  return null;
}

describe("FigureProvider", () => {
  it("assigns sequential numbers starting at 1", () => {
    const nums: number[] = [];
    render(
      <FigureProvider>
        <TestFigure id="a" onNum={(n) => nums.push(n)} />
        <TestFigure id="b" onNum={(n) => nums.push(n)} />
        <TestFigure id="c" onNum={(n) => nums.push(n)} />
      </FigureProvider>,
    );
    expect(nums).toEqual([1, 2, 3]);
  });

  it("returns the same number for the same id on re-render", () => {
    const nums: number[] = [];
    const { rerender } = render(
      <FigureProvider>
        <TestFigure id="x" onNum={(n) => nums.push(n)} />
      </FigureProvider>,
    );
    rerender(
      <FigureProvider>
        <TestFigure id="x" onNum={(n) => nums.push(n)} />
      </FigureProvider>,
    );
    expect(nums[0]).toBe(nums[1]);
    expect(nums[0]).toBe(1);
  });
});

describe("useFigureNumber without a provider", () => {
  it("returns 0 when no FigureProvider is mounted", () => {
    let num = -1;
    render(<TestFigure id="y" onNum={(n) => (num = n)} />);
    expect(num).toBe(0);
  });
});
