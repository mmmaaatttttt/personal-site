import { fireEvent, render } from "@testing-library/react";
import type { SVGProps } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      path: (
        props: SVGProps<SVGPathElement> & {
          initial?: unknown;
          animate?: unknown;
          transition?: unknown;
        },
      ) => {
        const { initial: _i, animate: _a, transition: _t, ...rest } = props;
        return <path {...rest} />;
      },
    },
  };
});

import USState from "./USState";

describe("USState", () => {
  const baseProps = {
    d: "M 0 0 L 100 0 L 100 100 Z",
    fill: "#ff0000",
    index: 0,
    title: "Alabama",
    body: "Value: 10",
  };

  it("renders a path with the given fill", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <USState {...baseProps} />
      </svg>,
    );
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("fill", "#ff0000");
  });

  it("renders without event handlers (optional chaining returns undefined)", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <USState {...baseProps} />
      </svg>,
    );
    expect(container.querySelector("path")).toBeInTheDocument();
  });

  it("calls onMouseMove handler when mouse moves over the path", () => {
    const onMouseMove = vi.fn(() => vi.fn());
    const { container } = render(
      <svg role="img" aria-label="test">
        <USState {...baseProps} onMouseMove={onMouseMove} />
      </svg>,
    );
    const path = container.querySelector("path")!;
    fireEvent.mouseMove(path);
    expect(onMouseMove).toHaveBeenCalledWith("Alabama", "Value: 10");
  });

  it("calls onMouseLeave handler when mouse leaves the path", () => {
    const onMouseLeave = vi.fn();
    const { container } = render(
      <svg role="img" aria-label="test">
        <USState {...baseProps} onMouseLeave={onMouseLeave} />
      </svg>,
    );
    const path = container.querySelector("path")!;
    fireEvent.mouseLeave(path);
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it("accepts array body", () => {
    const onMouseMove = vi.fn(() => vi.fn());
    const { container } = render(
      <svg role="img" aria-label="test">
        <USState
          {...baseProps}
          body={["Line 1", "Line 2"]}
          onMouseMove={onMouseMove}
        />
      </svg>,
    );
    const path = container.querySelector("path")!;
    fireEvent.mouseMove(path);
    expect(onMouseMove).toHaveBeenCalledWith("Alabama", ["Line 1", "Line 2"]);
  });
});
