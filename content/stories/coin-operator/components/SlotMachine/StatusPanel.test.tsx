import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusPanel from "./StatusPanel";

describe("StatusPanel", () => {
  it("renders the cost and an em dash when payout is null", () => {
    render(<StatusPanel cost={1} payout={null} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("renders the payout value once a spin has resolved", () => {
    render(<StatusPanel cost={1} payout={15} />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });
});
