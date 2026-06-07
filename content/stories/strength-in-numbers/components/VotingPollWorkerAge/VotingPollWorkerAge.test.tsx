import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { PollWorkerAgeRow } from "../../data";
import VotingPollWorkerAge from ".";

vi.mock("@/components/story/shared/PieChart", () => ({
  default: ({ values }: { values: number[] }) => (
    <div data-testid="pie-chart" data-values={JSON.stringify(values)} />
  ),
}));

vi.mock("@/components/story/shared/PieChart/PieSlice", () => ({
  default: () => null,
}));

const mockStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California"];

const mockData: PollWorkerAgeRow[] = [
  { year: 2010, state: "Alabama", ages: [0, 100, 200, 300, 150, 50] },
  { year: 2012, state: "Alabama", ages: [5, 110, 210, 310, 160, 60] },
  { year: 2014, state: "Alabama", ages: [10, 120, 220, 320, 170, 70] },
  { year: 2016, state: "Alabama", ages: [15, 130, 230, 330, 180, 80] },
  { year: 2010, state: "Alaska", ages: [0, 0, 0, 0, 0, 0] },
  { year: 2010, state: "Arizona", ages: [20, 140, 240, 340, 190, 90] },
  { year: 2010, state: "Arkansas", ages: [0, 50, 100, 150, 80, 30] },
  { year: 2010, state: "California", ages: [500, 800, 1200, 900, 400, 200] },
];

describe("VotingPollWorkerAge", () => {
  it("renders without crashing", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
  });

  it("renders the year slider", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders the state select dropdown", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("populates the dropdown with all states", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Alabama");
    expect(options).toContain("California");
  });

  it("defaults to the third state (index 2)", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const selectedLabel = select.options[select.selectedIndex].text;
    expect(selectedLabel).toBe("Arizona");
  });

  it("shows pie chart when the selected state has data", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    // Arizona in 2010 has data
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("shows no-data message when state has no age data", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    // Switch to Alaska (all zeros in 2010)
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } }); // Alaska is index 1
    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });

  it("renders the legend when data is available", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    expect(screen.getByText("Poll worker ages (years)")).toBeInTheDocument();
  });

  it("updates the selected state when dropdown changes", () => {
    render(<VotingPollWorkerAge data={mockData} states={mockStates} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "0" } }); // Alabama
    expect(select.options[select.selectedIndex].text).toBe("Alabama");
  });
});
