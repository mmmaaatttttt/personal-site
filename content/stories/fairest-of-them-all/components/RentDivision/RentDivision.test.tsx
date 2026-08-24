import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RentDivision from ".";

describe("RentDivision", () => {
  it("renders without crashing", () => {
    const { container } = render(<RentDivision />);
    expect(container).toBeTruthy();
  });

  it("shows the mesh slider and start button before starting", () => {
    render(<RentDivision />);
    expect(screen.getByText("Start Demonstration")).toBeTruthy();
    expect(screen.getByText(/Mesh Size/i)).toBeTruthy();
  });

  it("transitions to roommate selection after clicking Start", () => {
    render(<RentDivision />);
    fireEvent.click(screen.getByText("Start Demonstration"));
    expect(screen.getByText(/Turn/)).toBeTruthy();
  });

  it("shows the SVG mesh", () => {
    const { container } = render(<RentDivision />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("polygon").length).toBeGreaterThan(0);
  });

  it("changes the mesh size before starting", () => {
    const { container } = render(<RentDivision />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "2" } });
    fireEvent.click(screen.getByText("Start Demonstration"));
    expect(container.querySelectorAll("circle").length).toBe(6);
  });

  it("plays a full round to a fair-division result, then resets", () => {
    const { container } = render(<RentDivision />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "2" } });
    fireEvent.click(screen.getByText("Start Demonstration"));

    const pickAndConfirm = (radioId: string) => {
      fireEvent.click(container.querySelector(radioId) as Element);
      const confirmBtn = Array.from(container.querySelectorAll("button")).find(
        (b) => b.textContent?.startsWith("Confirm"),
      );
      fireEvent.click(confirmBtn as Element);
    };

    expect(screen.getByText(/Alex's Turn/)).toBeTruthy();
    pickAndConfirm("#radio-0");

    expect(screen.getByText(/Brett's Turn/)).toBeTruthy();
    pickAndConfirm("#radio-1");

    expect(screen.getByText(/Cameron's Turn/)).toBeTruthy();
    pickAndConfirm("#radio-0");

    expect(screen.getByText(/Alex's Turn/)).toBeTruthy();
    pickAndConfirm("#radio-2");

    expect(screen.getByText(/within \$\d+ of a fair division/)).toBeTruthy();
    expect(screen.getByText(/Alex is paying/)).toBeTruthy();
    expect(screen.getByText(/Brett is paying/)).toBeTruthy();
    expect(screen.getByText(/Cameron is paying/)).toBeTruthy();

    fireEvent.click(screen.getByText("Try again"));
    expect(screen.getByText("Start Demonstration")).toBeTruthy();
  });
});
