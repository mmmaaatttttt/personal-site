import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Select from ".";

describe("Select Component", () => {
  const mockOptions = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
  ];

  it("renders correctly with options", () => {
    render(
      <Select
        name="test-select"
        value="opt1"
        onChange={() => {}}
        options={mockOptions}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls onChange with the correct option object", () => {
    const handleChange = vi.fn();
    render(
      <Select
        name="test-select"
        value="opt1"
        onChange={handleChange}
        options={mockOptions}
      />,
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "opt2" } });

    expect(handleChange).toHaveBeenCalledWith(mockOptions[1]);
  });

  it("renders placeholder if provided", () => {
    render(
      <Select
        name="test-select"
        value=""
        onChange={() => {}}
        options={mockOptions}
        placeholder="Select an option"
      />,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeDisabled();
  });
});
