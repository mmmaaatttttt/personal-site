import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import SentimentCircle from "./SentimentCircle";

describe("SentimentCircle", () => {
  it("renders a circle with the given fill", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <SentimentCircle cx={10} cy={20} r={5} fill="#ff0000" delay={0} />
      </svg>,
    );
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("fill", "#ff0000");
    expect(circle).toHaveAttribute("opacity", "0.7");
  });
});
