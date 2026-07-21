import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StrategyProbabilityTable from ".";

// This state's DP is a small subgraph reachable within a handful of spins of
// one fixed starting state, but under full-suite parallel worker contention
// it can still run past vitest's 5s default.
const SLOW_TEST_TIMEOUT = 20000;

describe("StrategyProbabilityTable", () => {
  it(
    "renders both sliders defaulting to r=1 and 5 bonus spins",
    () => {
      render(<StrategyProbabilityTable />);
      const sliders = screen.getAllByRole("slider");

      expect(sliders).toHaveLength(2);
      expect(sliders[0]).toHaveValue("1");
      expect(sliders[1]).toHaveValue("5");
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "renders the example state's emoji as the first column header",
    () => {
      render(<StrategyProbabilityTable />);
      expect(screen.getByText("🟡🟡💰💰")).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "renders the three strategy column headers and a row per action",
    () => {
      render(<StrategyProbabilityTable />);

      expect(screen.getByText("No strategy (random)")).toBeInTheDocument();
      expect(screen.getByText("Unoptimized strategy")).toBeInTheDocument();
      expect(screen.getByText("Optimized strategy")).toBeInTheDocument();
      expect(screen.getByText("Stay")).toBeInTheDocument();
      expect(screen.getByText("Spin 🟡")).toBeInTheDocument();
      expect(screen.getByText("Spin 💰")).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "renders an Expected Value column immediately after the state column",
    () => {
      render(<StrategyProbabilityTable />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers[0]).toHaveTextContent("🟡🟡💰💰");
      expect(headers[1]).toHaveTextContent("Expected Value");

      expect(screen.getByText("0.000")).toBeInTheDocument();
      expect(screen.getByText("0.444")).toBeInTheDocument();
      expect(screen.getByText("0.463")).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "highlights spin-a-3-coin as optimal at the default 5 bonus spins",
    () => {
      render(<StrategyProbabilityTable />);

      expect(screen.getByText("Spin 💰").closest("tr")).toHaveClass(
        "bg-green-100",
      );
      expect(screen.getByText("Stay").closest("tr")).not.toHaveClass(
        "bg-green-100",
      );
      expect(screen.getByText("Spin 🟡").closest("tr")).not.toHaveClass(
        "bg-green-100",
      );
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "moves the highlight to Stay when only 1 bonus spin remains",
    () => {
      render(<StrategyProbabilityTable />);
      const spinsSlider = screen.getAllByRole("slider")[1];

      fireEvent.change(spinsSlider, { target: { value: "1" } });

      expect(screen.getByText("Stay").closest("tr")).toHaveClass(
        "bg-green-100",
      );
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "moves the highlight to spin-a-single-coin at 10 bonus spins",
    () => {
      render(<StrategyProbabilityTable />);
      const spinsSlider = screen.getAllByRole("slider")[1];

      fireEvent.change(spinsSlider, { target: { value: "10" } });

      expect(screen.getByText("Spin 🟡").closest("tr")).toHaveClass(
        "bg-green-100",
      );
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "recomputes the current column when the optimality slider moves to r=0.5",
    () => {
      render(<StrategyProbabilityTable />);
      const optimalitySlider = screen.getAllByRole("slider")[0];

      fireEvent.change(optimalitySlider, { target: { value: "0.5" } });

      expect(screen.getByText("36.2%")).toBeInTheDocument();
      expect(screen.getByText("29.9%")).toBeInTheDocument();
      expect(screen.getByText("33.9%")).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );
});
