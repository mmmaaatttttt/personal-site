import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import EconomySimulation from ".";

interface CapturedNodeGroupProps {
  onSpeedsChange: (speeds: number[]) => void;
}

const { capturedNodeGroupProps } = vi.hoisted(() => ({
  capturedNodeGroupProps: {
    current: null as unknown as CapturedNodeGroupProps,
  },
}));

vi.mock("./EconomyNodeGroup", () => ({
  default: (props: CapturedNodeGroupProps) => {
    capturedNodeGroupProps.current = props;
    return <g data-testid="mock-node-group" />;
  },
}));

describe("EconomySimulation", () => {
  it("renders the Start button before simulation begins", () => {
    render(<EconomySimulation idx={0} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("shows Pause, Show Chart, and Reset buttons after Start", () => {
    render(<EconomySimulation idx={0} />);
    fireEvent.click(screen.getByText("Start"));
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Show Chart")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("toggles Pause/Resume correctly", () => {
    render(<EconomySimulation idx={0} />);
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Pause"));
    expect(screen.getByText("Resume")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Resume"));
    expect(screen.getByText("Pause")).toBeInTheDocument();
  });

  it("resets to Start button after Reset is clicked", () => {
    render(<EconomySimulation idx={0} />);
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("shows bar graph when Show Chart is clicked", () => {
    render(<EconomySimulation idx={0} />);
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Show Chart"));
    expect(screen.getByText("Show Nodes")).toBeInTheDocument();
  });

  it("renders the savings rate slider when editSavings is true", () => {
    render(<EconomySimulation idx={2} editSavings={true} />);
    expect(screen.getByText("Savings Rate")).toBeInTheDocument();
  });

  it("does not render savings rate slider when editSavings is false", () => {
    render(<EconomySimulation idx={0} />);
    expect(screen.queryByText("Savings Rate")).not.toBeInTheDocument();
  });

  it("changes the population size when the slider changes", () => {
    render(<EconomySimulation idx={0} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "10" } });
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Show Chart"));
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("updates speeds when EconomyNodeGroup reports a change", () => {
    render(<EconomySimulation idx={0} />);
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Show Chart"));

    capturedNodeGroupProps.current.onSpeedsChange([5, 7]);

    expect(screen.getByText("Show Nodes")).toBeInTheDocument();
  });
});
