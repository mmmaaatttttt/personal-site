import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Sidebar from ".";

beforeAll(() => {
  // Mock IntersectionObserver for framer-motion whileInView
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("Sidebar Component", () => {
  it("renders children correctly", () => {
    render(<Sidebar>Test Sidebar Content</Sidebar>);
    expect(screen.getByText("Test Sidebar Content")).toBeInTheDocument();
  });

  it("applies the direction style prop correctly", () => {
    const { container } = render(
      <Sidebar direction="right">Right aligned</Sidebar>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.right).toBeTruthy();
    expect(el.style.left).toBeFalsy();
  });
});
