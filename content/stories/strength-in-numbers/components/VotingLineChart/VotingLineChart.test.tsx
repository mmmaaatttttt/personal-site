import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      g: "g",
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

import type { VotingDataRow } from "../../data";
import VotingLineChart from ".";

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

const mockStates = ["Alabama", "Alaska", "Arizona"];

const mockData: VotingDataRow[] = [
  makeRow({ year: 2008, state: "Alabama" }),
  makeRow({
    year: 2010,
    state: "Alabama",
    active_registration: 2900000,
    election_participants: 1800000,
  }),
  makeRow({
    year: 2012,
    state: "Alabama",
    active_registration: 3100000,
    election_participants: 2100000,
  }),
  makeRow({
    year: 2014,
    state: "Alabama",
    active_registration: 3050000,
    election_participants: 1950000,
  }),
  makeRow({ year: 2016, state: "Alabama" }),
  makeRow({
    year: 2008,
    state: "Alaska",
    active_registration: 420000,
    election_participants: 280000,
    eligible_voters_estimated: 480000,
  }),
  makeRow({
    year: 2016,
    state: "Alaska",
    active_registration: 500000,
    election_participants: 320000,
    eligible_voters_estimated: 530000,
  }),
];

describe("VotingLineChart (voters variant)", () => {
  it("renders without crashing", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
  });

  it("renders two select dropdowns (statistic and state)", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("populates the statistic select with voter options", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
    const [statSelect] = screen.getAllByRole("combobox");
    const options = Array.from(statSelect.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Active Registered Voters");
    expect(options).toContain("Election Participants");
    expect(options).toContain("Election Turnout");
    expect(options).toHaveLength(5);
  });

  it("populates the state select with all states", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
    const [, stateSelect] = screen.getAllByRole("combobox");
    const options = Array.from(stateSelect.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Alabama");
    expect(options).toContain("Alaska");
    expect(options).toContain("Arizona");
  });

  it("renders the caption when provided", () => {
    render(
      <VotingLineChart
        data={mockData}
        states={mockStates}
        variant="voters"
        caption="Line chart caption"
      />,
    );
    expect(screen.getByText("Line chart caption")).toBeInTheDocument();
  });

  it("uses the provided svgId for the clip path", () => {
    const { container } = render(
      <VotingLineChart
        data={mockData}
        states={mockStates}
        variant="voters"
        svgId="my-line-graph"
      />,
    );
    expect(
      container.querySelector('[id="clip-path-my-line-graph"]'),
    ).toBeInTheDocument();
  });

  it("changes statistic when select changes", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
    const [statSelect] = screen.getAllByRole("combobox") as HTMLSelectElement[];
    fireEvent.change(statSelect, { target: { value: "1" } });
    expect(statSelect.value).toBe("1");
  });

  it("changes state when state select changes", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="voters" />,
    );
    const [, stateSelect] = screen.getAllByRole(
      "combobox",
    ) as HTMLSelectElement[];
    fireEvent.change(stateSelect, { target: { value: "1" } });
    expect(stateSelect.options[stateSelect.selectedIndex].text).toBe("Alaska");
  });
});

describe("VotingLineChart (workers variant)", () => {
  it("renders without crashing", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="workers" />,
    );
  });

  it("populates the statistic select with worker options", () => {
    render(
      <VotingLineChart data={mockData} states={mockStates} variant="workers" />,
    );
    const [statSelect] = screen.getAllByRole("combobox");
    const options = Array.from(statSelect.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Poll Workers");
    expect(options).toContain("Polling Places");
    expect(options).toContain("Average Difficulty of Finding Poll Workers");
    expect(options).toHaveLength(7);
  });

  it("uses the default svgId clip path when not provided", () => {
    const { container } = render(
      <VotingLineChart data={mockData} states={mockStates} variant="workers" />,
    );
    expect(
      container.querySelector('[id="clip-path-state-line-graph"]'),
    ).toBeInTheDocument();
  });
});
