import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button element", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies w-full when isFullWidth is true", () => {
    render(<Button isFullWidth>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("does not apply w-full by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).not.toHaveClass("w-full");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-accent");
  });

  it("applies sm size classes", () => {
    render(<Button size="sm">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
  });

  it("merges additional className", () => {
    render(<Button className="my-custom">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-custom");
  });

  it("forwards ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes through html button props", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
