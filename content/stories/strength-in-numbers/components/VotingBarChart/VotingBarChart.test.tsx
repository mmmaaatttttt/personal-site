import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { VotingDataRow } from "../../data";
import VotingBarChart from ".";

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
  makeRow({
    year: 2008,
    state: "Alabama",
    abbreviation: "AL",
    active_registration: 2800000,
    election_participants: 1900000,
  }),
  makeRow({
    year: 2008,
    state: "Alaska",
    abbreviation: "AK",
    active_registration: 450000,
    election_participants: 300000,
    eligible_voters_estimated: 500000,
  }),
  makeRow({ year: 2016, state: "Alabama", abbreviation: "AL" }),
  makeRow({
    year: 2016,
    state: "Alaska",
    abbreviation: "AK",
    active_registration: 500000,
    election_participants: 320000,
    eligible_voters_estimated: 530000,
    dem_percent: 38,
    rep_percent: 45,
  }),
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
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Registration Saturation");
    expect(options).toContain("Election Turnout");
    expect(options).toHaveLength(2);
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
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
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

describe("VotingBarChart (edge cases)", () => {
  it("excludes a row whose statistic is not computable for the current year", () => {
    const partialData: VotingDataRow[] = [
      makeRow({
        year: 2008,
        state: "Alabama",
        abbreviation: "AL",
        active_registration: 2800000,
        eligible_voters_estimated: 3500000,
      }),
      makeRow({
        year: 2008,
        state: "Alaska",
        abbreviation: "AK",
        active_registration: 0,
        eligible_voters_estimated: 500000,
      }),
    ];
    render(<VotingBarChart data={partialData} variant="voters" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.queryByText("AK")).not.toBeInTheDocument();
  });

  it("falls back to the first option when the selected value doesn't exist on the new variant, and shows the no-data message", () => {
    const noPartyData: VotingDataRow[] = [
      makeRow({
        year: 2008,
        state: "Alabama",
        abbreviation: "AL",
        dem_percent: 0,
      }),
      makeRow({
        year: 2008,
        state: "Alaska",
        abbreviation: "AK",
        dem_percent: 0,
      }),
    ];
    const { rerender } = render(
      <VotingBarChart data={noPartyData} variant="voters" />,
    );
    rerender(<VotingBarChart data={noPartyData} variant="party" />);
    expect(
      screen.getByText("Most Democratic States has no data for 2008."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please make another selection."),
    ).toBeInTheDocument();
  });
});
