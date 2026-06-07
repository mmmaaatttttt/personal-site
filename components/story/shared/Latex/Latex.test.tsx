import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Latex from ".";

vi.mock("katex", () => ({
  default: {
    render: vi.fn(),
  },
}));
vi.mock("katex/dist/katex.min.css", () => ({}));

import katex from "katex";

describe("Latex", () => {
  it("renders without crashing", () => {
    const { container } = render(<Latex str="x^2" />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("calls katex.render with the str prop", () => {
    render(<Latex str="E = mc^2" />);
    expect(katex.render).toHaveBeenCalledWith(
      "E = mc^2",
      expect.any(HTMLDivElement),
      expect.objectContaining({ displayMode: false }),
    );
  });

  it("calls katex.render with displayMode=true when prop is set", () => {
    render(<Latex str={"\\frac{1}{2}"} displayMode />);
    expect(katex.render).toHaveBeenCalledWith(
      "\\frac{1}{2}",
      expect.any(HTMLDivElement),
      expect.objectContaining({ displayMode: true }),
    );
  });

  it("re-renders when str changes", async () => {
    const { rerender } = render(<Latex str="a" />);
    rerender(<Latex str="b" />);
    const calls = (katex.render as ReturnType<typeof vi.fn>).mock.calls;
    const strs = calls.map((c) => c[0]);
    expect(strs).toContain("a");
    expect(strs).toContain("b");
  });

  it("patches top style on any .delimcenter elements injected by katex", () => {
    vi.mocked(katex.render).mockImplementationOnce(
      (_str: string, el: Element) => {
        const span = document.createElement("span");
        span.className = "delimcenter";
        el.appendChild(span);
      },
    );
    const { container } = render(<Latex str="\\left( x \\right)" />);
    const delimcenter = container.querySelector(
      ".delimcenter",
    ) as HTMLElement | null;
    expect(delimcenter).not.toBeNull();
    expect(delimcenter?.style.top).toBe("0.1em");
  });
});
