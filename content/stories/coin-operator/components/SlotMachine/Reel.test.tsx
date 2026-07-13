import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SlotValue } from "../../data";
import Reel from "./Reel";

describe("Reel", () => {
  it("renders a placeholder glyph when value is null", () => {
    render(<Reel value={null} />);
    expect(screen.getByText("❔")).toBeInTheDocument();
  });

  it("renders the emoji for the given symbol", () => {
    render(<Reel value={SlotValue.CROWN} />);
    expect(screen.getByText("👑")).toBeInTheDocument();
  });

  it("accepts a custom className without crashing", () => {
    render(<Reel value={SlotValue.CLOVER} className="custom-class" />);
    expect(screen.getByText("🍀")).toBeInTheDocument();
  });

  it("applies a pulse animation while active", () => {
    render(<Reel value={null} active />);
    expect(screen.getByText("❔")).toHaveClass("animate-pulse");
  });

  it("does not pulse once settled", () => {
    render(<Reel value={SlotValue.SNAKE} active={false} />);
    expect(screen.getByText("🐍")).not.toHaveClass("animate-pulse");
  });
});
