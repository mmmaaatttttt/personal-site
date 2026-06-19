import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import WedgeExplorer from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("WedgeExplorer", () => {
  it("renders without crashing", () => {
    render(<WedgeExplorer />);
  });

  it("shows the over-automation callout", () => {
    render(<WedgeExplorer />);
    expect(
      screen.getByText(/more jobs than if firms had coordinated/i),
    ).toBeInTheDocument();
  });

  it("shows plain-English legend entries", () => {
    render(<WedgeExplorer />);
    expect(screen.getByText(/market outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/coordinated outcome/i)).toBeInTheDocument();
  });

  it("renders four slider inputs", () => {
    render(<WedgeExplorer />);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
  });
});
