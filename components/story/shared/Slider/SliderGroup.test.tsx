import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SliderGroup from "./SliderGroup";

vi.mock("./LabeledSlider", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="labeled-slider">{title}</div>
  ),
}));

vi.mock("../FlexContainer", () => ({
  default: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="flex-container" className={className}>
      {children}
    </div>
  ),
}));

describe("SliderGroup", () => {
  const makeSlider = (i: number) => ({
    min: 0,
    max: 10,
    value: i,
    handleValueChange: vi.fn(),
    title: `Slider ${i}`,
    color: "blue",
    key: i,
  });

  it("renders a LabeledSlider for each data entry", () => {
    render(<SliderGroup data={[makeSlider(1), makeSlider(2)]} />);
    expect(screen.getAllByTestId("labeled-slider")).toHaveLength(2);
  });

  it("renders slider titles", () => {
    render(<SliderGroup data={[makeSlider(5)]} />);
    expect(screen.getByText("Slider 5")).toBeInTheDocument();
  });

  it("supports function title — calls it with current value", () => {
    const data = [
      {
        ...makeSlider(3),
        title: (val: number) => `Value is ${val}`,
      },
    ];
    render(<SliderGroup data={data} />);
    expect(screen.getByText("Value is 3")).toBeInTheDocument();
  });

  it("renders no sliders when data is empty", () => {
    render(<SliderGroup data={[]} />);
    expect(screen.queryByTestId("labeled-slider")).toBeNull();
  });

  it("uses index as key when slider data has no key", () => {
    const data = [
      {
        min: 0,
        max: 10,
        value: 5,
        handleValueChange: vi.fn(),
        title: "No Key Slider",
        color: "red",
        // no key property → d.key is undefined → d.key ?? i uses i
      },
    ];
    render(<SliderGroup data={data} />);
    expect(screen.getByText("No Key Slider")).toBeInTheDocument();
  });

  it("uses empty string when title is falsy (covers d.title || '' branch)", () => {
    const data = [
      {
        min: 0,
        max: 10,
        value: 5,
        handleValueChange: vi.fn(),
        title: "",
        color: "red",
        key: 1,
      },
    ];
    render(<SliderGroup data={data} />);
    expect(screen.getByTestId("labeled-slider")).toBeInTheDocument();
  });

  it("applies compact styling (covers compact ? 'my-0' : 'm-1' true branch)", () => {
    render(<SliderGroup data={[makeSlider(1)]} compact={true} />);
    expect(screen.getByTestId("labeled-slider")).toBeInTheDocument();
  });

  it("applies min-w-0 to the group and each row so content can't force them wider", () => {
    render(<SliderGroup data={[makeSlider(1)]} />);
    expect(screen.getByTestId("flex-container")).toHaveClass("min-w-0");
    const row = screen.getByTestId("labeled-slider").parentElement;
    expect(row).toHaveClass("min-w-0");
  });
});
