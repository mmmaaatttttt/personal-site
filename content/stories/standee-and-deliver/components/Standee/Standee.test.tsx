import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Standee from ".";
import styles from "./Standee.module.css";

describe("Standee", () => {
  it("dims the image and shows a zero tally when not yet found", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={false}
        animate={false}
      />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
    const img = screen.getByAltText("Mario (Jumping)");
    expect(img).toHaveAttribute("src", "/images/standees/mario_jumping.png");
    expect(img).toHaveClass("grayscale");
  });

  it("never reduces opacity on the not-yet-found image (would fade its own white background into the panel color behind it)", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={false}
        animate={false}
      />,
    );
    const img = screen.getByAltText("Mario (Jumping)");
    expect(img.className).not.toMatch(/opacity-/);
  });

  it("shows the full-color image and tally count once found", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={3}
        isStarter={false}
        animate={false}
      />,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    const img = screen.getByAltText("Mario (Jumping)");
    expect(img).not.toHaveClass("grayscale");
  });

  it("keeps a white image background regardless of the character panel color behind it", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={false}
        animate={false}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)")).toHaveClass("bg-white");
  });

  it("falls back to a small tally text size when none is given", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={false}
        animate={false}
      />,
    );
    expect(screen.getByText("0")).toHaveClass("text-[10px]");
  });

  it("uses a custom tally badge class when given one", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={false}
        tallyBadgeClass="-top-0.5 right-0.25 text-lg leading-none"
        animate={false}
      />,
    );
    expect(screen.getByText("0")).toHaveClass(
      "text-lg",
      "-top-0.5",
      "right-0.25",
      "leading-none",
    );
  });

  it("shows a starter standee as full-color with no tally badge at all", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={0}
        isStarter={true}
        animate={false}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)")).not.toHaveClass("grayscale");
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("applies the jiggle animation when animate is true", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={true}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)").parentElement).toHaveClass(
      styles.jiggle,
    );
  });

  it("does not apply the jiggle animation when animate is false (e.g. adjusting a slider)", () => {
    render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={false}
      />,
    );
    expect(
      screen.getByAltText("Mario (Jumping)").parentElement,
    ).not.toHaveClass(styles.jiggle);
  });

  it("remounts the animated element when tally changes, so a repeat draw restarts the animation from scratch", () => {
    const { rerender } = render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={true}
      />,
    );
    const firstNode = screen.getByAltText("Mario (Jumping)").parentElement;

    rerender(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={2}
        isStarter={false}
        animate={true}
      />,
    );
    const secondNode = screen.getByAltText("Mario (Jumping)").parentElement;

    expect(secondNode).not.toBe(firstNode);
    expect(secondNode).toHaveClass(styles.jiggle);
  });

  it("does not remount the animated element when tally is unchanged", () => {
    const { rerender } = render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={true}
      />,
    );
    const firstNode = screen.getByAltText("Mario (Jumping)").parentElement;

    rerender(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={false}
      />,
    );
    const secondNode = screen.getByAltText("Mario (Jumping)").parentElement;

    expect(secondNode).toBe(firstNode);
  });

  it("keeps jiggling once a different standee gets drawn next, even though this standee's own animate prop flips back to false", () => {
    const { rerender } = render(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={true}
      />,
    );
    // Simulates the very next tick: some other tile was drawn, so this
    // standee's own `animate` prop goes false, but its `tally` (and thus
    // key) is unchanged since it wasn't the one just drawn.
    rerender(
      <Standee
        image="/images/standees/mario_jumping.png"
        alt="Mario (Jumping)"
        tally={1}
        isStarter={false}
        animate={false}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)").parentElement).toHaveClass(
      styles.jiggle,
    );
  });
});
