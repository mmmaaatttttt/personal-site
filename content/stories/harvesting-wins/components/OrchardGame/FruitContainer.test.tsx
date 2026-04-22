import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import FruitContainer from "./FruitContainer";

const baseProps = {
  color: "#ff3c23",
  count: 3,
  clickable: false,
  faded: false,
  title: "Fruit",
  onRemove: vi.fn(),
};

describe("FruitContainer", () => {
  it("renders title and count when count > 0", () => {
    render(<FruitContainer {...baseProps} />);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders nothing inside when count is 0", () => {
    render(<FruitContainer {...baseProps} count={0} />);
    expect(screen.queryByText("Fruit")).not.toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("calls onRemove when clicked and clickable", () => {
    const onRemove = vi.fn();
    render(<FruitContainer {...baseProps} clickable onRemove={onRemove} />);
    fireEvent.click(screen.getByText("Fruit").closest("div")!.parentElement!);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("does not call onRemove when clicked but not clickable", () => {
    const onRemove = vi.fn();
    render(<FruitContainer {...baseProps} clickable={false} onRemove={onRemove} />);
    fireEvent.click(screen.getByText("Fruit").closest("div")!.parentElement!);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("applies reduced opacity when faded", () => {
    const { container } = render(<FruitContainer {...baseProps} faded />);
    expect(container.firstChild).toHaveStyle({ opacity: 0.3 });
  });

  it("darkens the background when empty", () => {
    const { container } = render(<FruitContainer {...baseProps} count={0} />);
    const el = container.firstChild as HTMLElement;
    // When empty the bg should differ from the original color
    expect(el.style.backgroundColor).not.toBe("#ff3c23");
  });
});
