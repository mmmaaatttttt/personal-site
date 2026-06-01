import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VerticalMarker from ".";

describe("VerticalMarker", () => {
  it("renders nothing outside ChartContext", () => {
    const { container } = render(
      <svg aria-label="test">
        <VerticalMarker x={5} color="#000" />
      </svg>,
    );
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });
});
