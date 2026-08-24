import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import PodcastAllSentiments from "./index";

vi.mock("../../data/ba-all-sentiment", () => ({ default: [] }));

describe("PodcastAllSentiments with no episode data", () => {
  it("renders nothing", () => {
    const { container } = render(<PodcastAllSentiments />);
    expect(container).toBeEmptyDOMElement();
  });
});
