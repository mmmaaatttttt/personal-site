import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnimatedTile from "./AnimatedTile";
import styles from "./Standee.module.css";

describe("AnimatedTile", () => {
  it("renders its children", () => {
    render(
      <AnimatedTile animate={false}>
        <span>content</span>
      </AnimatedTile>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies the jiggle class when animate is true at mount", () => {
    render(
      <AnimatedTile animate={true}>
        <span>content</span>
      </AnimatedTile>,
    );
    expect(screen.getByText("content").parentElement).toHaveClass(
      styles.jiggle,
    );
  });

  it("does not apply the jiggle class when animate is false at mount", () => {
    render(
      <AnimatedTile animate={false}>
        <span>content</span>
      </AnimatedTile>,
    );
    expect(screen.getByText("content").parentElement).not.toHaveClass(
      styles.jiggle,
    );
  });

  it("keeps the jiggle class after animate flips to false on the same instance (no key change)", () => {
    const { rerender } = render(
      <AnimatedTile animate={true}>
        <span>content</span>
      </AnimatedTile>,
    );
    rerender(
      <AnimatedTile animate={false}>
        <span>content</span>
      </AnimatedTile>,
    );
    expect(screen.getByText("content").parentElement).toHaveClass(
      styles.jiggle,
    );
  });
});
