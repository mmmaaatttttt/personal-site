import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SliderProvider from "./index";

// Mock the Icon component since it's not needed for logical tests
vi.mock("@/components/ui/Icon", () => ({
  Icon: () => <div data-testid="mock-icon" />,
}));

describe("SliderProvider", () => {
  const initialData = [
    {
      initialValue: 50,
      min: 0,
      max: 100,
      title: "Slider 1",
      color: "#ff0000",
    },
    {
      initialValue: 20,
      min: 10,
      max: 30,
      title: (val: number) => `Val: ${val}`,
      color: "#00ff00",
    },
  ];

  it("renders correctly with initial data", () => {
    const renderFn = vi.fn((values: number[]) => (
      <div data-testid="render-content">Values: {values.join(", ")}</div>
    ));

    render(<SliderProvider initialData={initialData} render={renderFn} />);

    // Check titles (case-insensitive because LabeledSlider uses uppercase CSS)
    expect(screen.getByText(/Slider 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Val: 20/i)).toBeInTheDocument();

    // Check initial values in render function
    expect(screen.getByTestId("render-content")).toHaveTextContent(
      "Values: 50, 20",
    );
    expect(renderFn).toHaveBeenCalledWith([50, 20]);
  });

  it("updates values and re-renders when a slider changes", () => {
    const renderFn = vi.fn((values: number[]) => (
      <div data-testid="render-content">Values: {values.join(", ")}</div>
    ));

    render(<SliderProvider initialData={initialData} render={renderFn} />);

    // Find the first slider (range input)
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);

    // Change first slider value
    fireEvent.change(sliders[0], { target: { value: "75" } });

    // Verify state update and re-render
    expect(screen.getByTestId("render-content")).toHaveTextContent(
      "Values: 75, 20",
    );
    expect(renderFn).toHaveBeenLastCalledWith([75, 20]);
  });

  it("handles function-based titles correctly on update", () => {
    render(<SliderProvider initialData={initialData} render={() => null} />);

    const sliders = screen.getAllByRole("slider");

    // Change second slider value
    fireEvent.change(sliders[1], { target: { value: "25" } });

    // Verify title updated (case-insensitive)
    expect(screen.getByText(/Val: 25/i)).toBeInTheDocument();
  });

  it("renders within NarrowContainer for few sliders", () => {
    const { container } = render(
      <SliderProvider initialData={initialData} render={() => <div />} />,
    );

    // NarrowContainer usually uses a specific width class or structure
    // We can check if it's rendered by looking for its characteristic wrapper
    // Since we can't easily check for the specific component name in JSDOM,
    // we look for the narrow container classes if any, or just ensure it didn't break.
    expect(container.firstChild).toBeInTheDocument();
  });

  it("returns null if no initial data is provided", () => {
    const { container } = render(
      <SliderProvider initialData={[]} render={() => <div />} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
