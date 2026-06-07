import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Figure from ".";
import { FigureProvider } from "./FigureProvider";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
}));

describe("Figure — collapsed state", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    mockReplace.mockClear();
  });

  it("renders children and caption without prefix when no FigureProvider", () => {
    render(
      <Figure caption="Test caption">
        <div data-testid="interactive">Interactive content</div>
      </Figure>,
    );
    expect(screen.getByTestId("interactive")).toBeInTheDocument();
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });

  it("shows expand button", () => {
    render(
      <Figure>
        <div>Content</div>
      </Figure>,
    );
    expect(
      screen.getByRole("button", { name: "Expand interactive" }),
    ).toBeInTheDocument();
  });

  it("calls router.replace with figure param when expanding", () => {
    render(
      <Figure>
        <div>Content</div>
      </Figure>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Expand interactive" }));
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("figure="),
      expect.objectContaining({ scroll: false }),
    );
  });

  it("renders without caption when none provided", () => {
    render(
      <Figure>
        <div data-testid="child">Content</div>
      </Figure>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByText(/caption/i)).not.toBeInTheDocument();
  });

  it("applies bleed classes by default", () => {
    const { container } = render(
      <Figure>
        <div>Content</div>
      </Figure>,
    );
    expect(container.firstChild).toHaveClass("min-[890px]:w-[110%]");
  });

  it("does not apply bleed classes when bleed={false}", () => {
    const { container } = render(
      <Figure bleed={false}>
        <div>Content</div>
      </Figure>,
    );
    expect(container.firstChild).not.toHaveClass("min-[890px]:w-[110%]");
  });

  it("passes custom className to the outer wrapper", () => {
    const { container } = render(
      <Figure className="custom-class">
        <div>Content</div>
      </Figure>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

// Wrap in FigureProvider so figNum=1 (predictable), then set ?figure=1 in searchParams.
describe("Figure — expanded state", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams("figure=1");
    mockReplace.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  function renderExpanded() {
    return render(
      <FigureProvider>
        <Figure caption="A caption">
          <div data-testid="content">Content</div>
        </Figure>
      </FigureProvider>,
    );
  }

  it("shows collapse button when expanded", () => {
    renderExpanded();
    expect(
      screen.getByRole("button", { name: "Collapse interactive" }),
    ).toBeInTheDocument();
  });

  it("locks body scroll when expanded", () => {
    renderExpanded();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll on unmount", () => {
    const { unmount } = renderExpanded();
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("calls router.replace to remove figure param when collapse button clicked", () => {
    renderExpanded();
    fireEvent.click(
      screen.getByRole("button", { name: "Collapse interactive" }),
    );
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining("figure="),
      expect.objectContaining({ scroll: false }),
    );
  });

  it("calls router.replace to close on Escape key", () => {
    renderExpanded();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining("figure="),
      expect.objectContaining({ scroll: false }),
    );
  });

  it("does not close on non-Escape key", () => {
    renderExpanded();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("renders children in expanded state", () => {
    renderExpanded();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders caption with auto-prefix in expanded state", () => {
    renderExpanded();
    expect(screen.getByText("Figure 1: A caption")).toBeInTheDocument();
  });
});
