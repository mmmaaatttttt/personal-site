import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Spinner from "./Spinner";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// animate is imperative and doesn't run in jsdom — mock it as a no-op
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

describe("Spinner", () => {
  it("renders the Spin button when message is empty", () => {
    render(<Spinner onSpinEnd={vi.fn()} message="" />);
    expect(screen.getByRole("button", { name: "Spin!" })).toBeInTheDocument();
  });

  it("renders message text instead of button when message is set", () => {
    render(<Spinner onSpinEnd={vi.fn()} message="Pick a fruit." />);
    expect(screen.getByText("Pick a fruit.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Spin!" })).not.toBeInTheDocument();
  });

  it("disables the button while spinning", () => {
    render(<Spinner onSpinEnd={vi.fn()} message="" />);
    const btn = screen.getByRole("button", { name: "Spin!" });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });
});
