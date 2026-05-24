import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { VotingDataRow } from "../../data";
import VotingMap from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("@/components/story/shared/USMap", () => ({
  default: ({ data, id }: { data: VotingDataRow[]; id: string }) => (
    <div data-testid="us-map" data-id={id} data-count={data.length} />
  ),
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
  makeRow({ year: 2008, state: "Alabama" }),
  makeRow({ year: 2012, state: "Alabama" }),
  makeRow({ year: 2016, state: "Alabama" }),
  makeRow({
    year: 2016,
    state: "Alaska",
    active_registration: 500000,
    election_participants: 320000,
    eligible_voters_estimated: 530000,
  }),
];

describe("VotingMap (voters variant)", () => {
  it("renders without crashing", () => {
    render(<VotingMap data={mockData} variant="voters" />);
  });

  it("renders the year slider", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders the statistic select", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("populates the statistic select with voters options", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Active Registered Voters");
    expect(options).toContain("Election Turnout");
    expect(options).toHaveLength(5);
  });

  it("renders the USMap", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    expect(screen.getByTestId("us-map")).toBeInTheDocument();
  });

  it("uses the voters variant map id", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    expect(screen.getByTestId("us-map")).toHaveAttribute(
      "data-id",
      "voting-map-voters",
    );
  });

  it("renders the caption when provided", () => {
    render(
      <VotingMap data={mockData} variant="voters" caption="Map caption" />,
    );
    expect(screen.getByText("Map caption")).toBeInTheDocument();
  });

  it("changes statistic when select changes", () => {
    render(<VotingMap data={mockData} variant="voters" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "4" } });
    expect(select.value).toBe("4");
  });
});

describe("VotingMap (workers variant)", () => {
  it("renders without crashing", () => {
    render(<VotingMap data={mockData} variant="workers" />);
  });

  it("populates the statistic select with workers options", () => {
    render(<VotingMap data={mockData} variant="workers" />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Poll Workers");
    expect(options).toContain("Average Difficulty of Finding Poll Workers");
    expect(options).toHaveLength(7);
  });

  it("uses the workers variant map id", () => {
    render(<VotingMap data={mockData} variant="workers" />);
    expect(screen.getByTestId("us-map")).toHaveAttribute(
      "data-id",
      "voting-map-workers",
    );
  });
});
