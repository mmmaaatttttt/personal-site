import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import standeeStyles from "../Standee/Standee.module.css";
import StandeeGrid from ".";

const standeeData = [
  {
    character: "Mario",
    pose: "Jumping",
    image: "/images/standees/mario_jumping.png",
  },
  {
    character: "Mario",
    pose: "Swimming",
    image: "/images/standees/mario_swimming.png",
  },
  {
    character: "Luigi",
    pose: "Jumping",
    image: "/images/standees/luigi_jumping.png",
  },
];

describe("StandeeGrid", () => {
  it("renders one standee per tally, matched to the standee data at the same index", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 2, 5]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)")).toBeInTheDocument();
    expect(screen.getByAltText("Mario (Swimming)")).toBeInTheDocument();
    expect(screen.getByAltText("Luigi (Jumping)")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("labels each character group once, even for a lone standee from the next character", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getByText("Mario")).toBeInTheDocument();
    expect(screen.getByText("Luigi")).toBeInTheDocument();
  });

  it("gives each character group its real background color", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getByText("Mario").parentElement).toHaveClass(
      "bg-[color(display-p3_0.804_0.180_0.133)]",
    );
  });

  it("falls back to a neutral background for an unmapped character", () => {
    const unknownCharacterData = [
      {
        character: "Toad",
        pose: "Jumping",
        image: "/images/standees/toad_jumping.png",
      },
    ];
    render(
      <StandeeGrid
        standeeData={unknownCharacterData}
        tallies={[0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getByText("Toad").parentElement).toHaveClass("bg-gray-100");
  });

  it("only jiggles the standee at lastDrawnIndex, not every tile", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[1, 0, 0]}
        lastDrawnIndex={0}
      />,
    );
    expect(screen.getByAltText("Mario (Jumping)").parentElement).toHaveClass(
      standeeStyles.jiggle,
    );
    expect(
      screen.getByAltText("Mario (Swimming)").parentElement,
    ).not.toHaveClass(standeeStyles.jiggle);
    expect(
      screen.getByAltText("Luigi (Jumping)").parentElement,
    ).not.toHaveClass(standeeStyles.jiggle);
  });

  it("jiggles nothing when lastDrawnIndex is null (e.g. after a reset)", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    for (const alt of [
      "Mario (Jumping)",
      "Mario (Swimming)",
      "Luigi (Jumping)",
    ]) {
      expect(screen.getByAltText(alt).parentElement).not.toHaveClass(
        standeeStyles.jiggle,
      );
    }
  });

  it("treats every standee as a non-starter when starterFlags is omitted", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getAllByText("0")).toHaveLength(3);
  });

  it("hides the tally badge for standees flagged as starters", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        starterFlags={[true, false, true]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getAllByText("0")).toHaveLength(1);
  });

  it("chooses the grid column class from the number of character groups", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getByText("Mario").closest(".grid")).toHaveClass(
      "sm:grid-cols-2",
    );
  });

  it("sizes the tally badges from the number of character groups", () => {
    render(
      <StandeeGrid
        standeeData={standeeData}
        tallies={[0, 0, 0]}
        lastDrawnIndex={null}
      />,
    );
    expect(screen.getAllByText("0")[0]).toHaveClass("text-lg");
  });
});
