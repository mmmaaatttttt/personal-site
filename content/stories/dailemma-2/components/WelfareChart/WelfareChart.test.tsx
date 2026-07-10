import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import WelfareChart from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("WelfareChart", () => {
  it("renders without crashing", () => {
    render(<WelfareChart />);
  });

  it("shows legend entries for company profits and worker income", () => {
    render(<WelfareChart />);
    expect(screen.getAllByText(/company profits/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/worker income/i).length).toBeGreaterThan(0);
  });

  it("shows coordinated and market vertical marker labels", () => {
    render(<WelfareChart />);
    expect(screen.getByText("Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("renders five slider inputs", () => {
    render(<WelfareChart />);
    expect(screen.getAllByRole("slider")).toHaveLength(5);
  });
});
