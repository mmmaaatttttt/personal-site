import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import VotingBarChart from ".";
import type { VotingDataRow } from "../../data";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const makeRow = (overrides: Partial<VotingDataRow>): VotingDataRow => ({
  year: 2016,
  state: "Alabama",
  abbreviation: "AL",
  num_jurisdictions: 67,
  active_registration: 3000000,
  election_participants: 2000000,
  eligible_voters_estimated: 3500000,
  jurisdictions_with_poll_worker_count: 30,
  participants_in_jurisdictions_with_poll_worker_info: 1500000,
  participants_in_jurisdictions_with_polling_place_info: 1500000,
  polling_places: 2000,
  poll_workers: 8000,
  difficulty_very_difficult: 5,
  difficulty_somewhat_difficult: 10,
  difficulty_neither_difficult_nor_easy: 15,
  difficulty_somewhat_easy: 20,
  difficulty_very_easy: 25,
  dem_percent: 35,
  rep_percent: 55,
  ages: [10, 50, 100, 150, 80, 30],
  ...overrides,
});

const mockData: VotingDataRow[] = [
  makeRow({ year: 2008, state: "Alabama", abbreviation: "AL", active_registration: 2800000, election_participants: 1900000 }),
  makeRow({ year: 2008, state: "Alaska", abbreviation: "AK", active_registration: 450000, election_participants: 300000, eligible_voters_estimated: 500000 }),
  makeRow({ year: 2016, state: "Alabama", abbreviation: "AL" }),
  makeRow({ year: 2016, state: "Alaska", abbreviation: "AK", active_registration: 500000, election_participants: 320000, eligible_voters_estimated: 530000, dem_percent: 38, rep_percent: 45 }),
];

describe("VotingBarChart (voters variant)", () => {
  it("renders without crashing", () => {
    render(<VotingBarChart data={mockData} variant="voters" />);
  });

  it("renders the year slider", () => {
    render(<VotingBarChart data={mockData} variant="voters" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders the statistic select with voters options", () => {
    render(<VotingBarChart data={mockData} variant="voters" />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(options).toContain("Registration Saturation");
    expect(options).toContain("Election Turnout");
    expect(options).toHaveLength(2);
  });

  it("renders the caption when provided", () => {
    render(<VotingBarChart data={mockData} variant="voters" caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });

  it("changes statistic when select changes", () => {
    render(<VotingBarChart data={mockData} variant="voters" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "turnout" } });
    expect(select.value).toBe("turnout");
  });
});

describe("VotingBarChart (party variant)", () => {
  it("renders without crashing", () => {
    render(<VotingBarChart data={mockData} variant="party" />);
  });

  it("renders the party statistic select with many options", () => {
    render(<VotingBarChart data={mockData} variant="party" />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
    expect(options).toContain("Most Democratic States");
    expect(options).toContain("Most Republican States");
    expect(options.length).toBeGreaterThan(10);
  });

  it("renders the year slider", () => {
    render(<VotingBarChart data={mockData} variant="party" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("changes statistic when select changes", () => {
    render(<VotingBarChart data={mockData} variant="party" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "1" } });
    expect(select.value).toBe("1");
  });
});
