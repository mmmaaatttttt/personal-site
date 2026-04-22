import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Polygon from "./Polygon";

const points = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 50, y: 100 },
];

describe("Polygon", () => {
  it("renders a polygon by default", () => {
    const { container } = render(
      <svg>
        <Polygon points={points} />
      </svg>,
    );
    expect(container.querySelector("polygon")).toBeTruthy();
    expect(container.querySelector("polyline")).toBeNull();
  });

  it("renders a polyline when open=true", () => {
    const { container } = render(
      <svg>
        <Polygon points={points} open />
      </svg>,
    );
    expect(container.querySelector("polyline")).toBeTruthy();
    expect(container.querySelector("polygon")).toBeNull();
  });

  it("applies fill and stroke props", () => {
    const { container } = render(
      <svg>
        <Polygon points={points} fill="#ff0000" stroke="#0000ff" strokeWidth={2} />
      </svg>,
    );
    const el = container.querySelector("polygon")!;
    expect(el.getAttribute("fill")).toBe("#ff0000");
    expect(el.getAttribute("stroke")).toBe("#0000ff");
    expect(el.getAttribute("stroke-width")).toBe("2");
  });

  it("generates the points attribute string correctly", () => {
    const { container } = render(
      <svg>
        <Polygon points={points} />
      </svg>,
    );
    const el = container.querySelector("polygon")!;
    expect(el.getAttribute("points")).toBe("0,0 100,0 50,100");
  });
});
