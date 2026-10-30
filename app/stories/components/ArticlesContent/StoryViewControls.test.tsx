import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StoryViewControls from "./StoryViewControls";

const renderControls = (
  overrides: Partial<Parameters<typeof StoryViewControls>[0]> = {},
) => {
  const props = {
    view: "date" as const,
    reversed: false,
    onSelect: vi.fn(),
    ...overrides,
  };
  const { container } = render(<StoryViewControls {...props} />);
  return { props, container };
};

describe("StoryViewControls", () => {
  it("renders an icon button per view and marks the active one", () => {
    renderControls({ view: "title" });
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "A to Z" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Newest first" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("names and draws the reversed direction for the active view", () => {
    const { container } = renderControls({ view: "date", reversed: true });
    expect(
      screen.getByRole("button", { name: "Oldest first" }),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-view="date"] svg.lucide-calendar-arrow-up',
      ),
    ).toBeInTheDocument();
  });

  it("only reverses the active view", () => {
    renderControls({ view: "date", reversed: true });
    expect(screen.getByRole("button", { name: "A to Z" })).toBeInTheDocument();
  });

  it("shows each label as a tooltip hidden from screen readers", () => {
    renderControls();
    const tooltip = screen.getByText("Similarity");
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("centers the buttons", () => {
    const { container } = renderControls();
    expect(container.firstChild).toHaveClass("justify-center");
  });

  it("does nothing on click before it is interactive", () => {
    render(<StoryViewControls view="date" reversed={false} />);
    expect(() =>
      fireEvent.click(screen.getAllByRole("button", { name: "Similarity" })[0]),
    ).not.toThrow();
  });

  it("reports the selected view", () => {
    const { props } = renderControls();
    fireEvent.click(screen.getByRole("button", { name: "Similarity" }));
    expect(props.onSelect).toHaveBeenCalledWith("similarity");
  });
});
