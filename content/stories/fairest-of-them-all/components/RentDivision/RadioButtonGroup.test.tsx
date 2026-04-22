import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RadioButtonGroup from "./RadioButtonGroup";

const defaultLabels = [
  { text: "Room A", color: "#ff8f34", disabled: false },
  { text: "Room B", color: "#52a081", disabled: false },
  { text: "Room C", color: "#e15bff", disabled: false },
];

const defaultProps = {
  labels: defaultLabels,
  buttonText: "Confirm selection",
  handleRadioChange: vi.fn(),
  handleSelectConfirm: vi.fn(),
};

describe("RadioButtonGroup", () => {
  it("renders all labels", () => {
    render(<RadioButtonGroup {...defaultProps} />);
    expect(screen.getByText("Room A")).toBeTruthy();
    expect(screen.getByText("Room B")).toBeTruthy();
    expect(screen.getByText("Room C")).toBeTruthy();
  });

  it("initially shows disabled confirm button", () => {
    render(<RadioButtonGroup {...defaultProps} />);
    expect(screen.getByText("Please make a selection.")).toBeTruthy();
  });

  it("shows confirm button after selecting an option", () => {
    render(<RadioButtonGroup {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/Room A/));
    expect(screen.getByText("Confirm selection")).toBeTruthy();
  });

  it("calls handleRadioChange with the correct index on selection", () => {
    const handleRadioChange = vi.fn();
    render(<RadioButtonGroup {...defaultProps} handleRadioChange={handleRadioChange} />);
    fireEvent.click(screen.getByLabelText(/Room B/));
    expect(handleRadioChange).toHaveBeenCalledWith(1);
  });

  it("calls handleSelectConfirm and resets selection on confirm", () => {
    const handleSelectConfirm = vi.fn();
    render(<RadioButtonGroup {...defaultProps} handleSelectConfirm={handleSelectConfirm} />);
    fireEvent.click(screen.getByLabelText(/Room A/));
    fireEvent.click(screen.getByText("Confirm selection"));
    expect(handleSelectConfirm).toHaveBeenCalledWith(0);
    expect(screen.getByText("Please make a selection.")).toBeTruthy();
  });

  it("renders disabled labels with strikethrough", () => {
    const labels = [
      { text: "Room A", color: "#ff8f34", disabled: true },
      { text: "Room B", color: "#52a081", disabled: false },
    ];
    const { container } = render(
      <RadioButtonGroup {...defaultProps} labels={labels} />,
    );
    expect(container.querySelector("del")).toBeTruthy();
  });
});
