import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ToggleSwitch from ".";

const defaultProps = {
  leftText: "Option A",
  rightText: "Option B",
  leftColor: "#ff0000",
  rightColor: "#0000ff",
  handleSwitchChange: vi.fn(),
};

describe("ToggleSwitch", () => {
  it("renders left and right labels", () => {
    render(<ToggleSwitch {...defaultProps} />);
    expect(screen.getByText("Option A")).toBeTruthy();
    expect(screen.getByText("Option B")).toBeTruthy();
  });

  it("starts unchecked", () => {
    render(<ToggleSwitch {...defaultProps} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles to checked on click and calls handleSwitchChange", () => {
    const handleSwitchChange = vi.fn();
    render(<ToggleSwitch {...defaultProps} handleSwitchChange={handleSwitchChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    expect(handleSwitchChange).toHaveBeenCalledWith(true);
  });

  it("toggles back to unchecked on second click", () => {
    const handleSwitchChange = vi.fn();
    render(<ToggleSwitch {...defaultProps} handleSwitchChange={handleSwitchChange} />);
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(handleSwitchChange).toHaveBeenCalledWith(false);
  });
});
