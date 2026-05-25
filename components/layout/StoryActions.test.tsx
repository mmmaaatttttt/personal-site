import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/icons/BlueskyIcon", () => ({
  default: () => <svg data-testid="bluesky-icon" />,
}));

import StoryActions from "./StoryActions";

const props = {
  githubUrl:
    "https://github.com/mmmaaatttttt/personal-site/blob/master/content/stories/test/index.mdx",
  blueskyUrl:
    "https://bsky.app/intent/compose?text=Test+Story+https%3A%2F%2Fmattlane.us%2Fstories%2Ftest",
};

describe("StoryActions", () => {
  it("renders all three action links", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /buy me a coffee/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /share on bluesky/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /edit on github/i }),
    ).toBeInTheDocument();
  });

  it("buy me a coffee links to the correct URL", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /buy me a coffee/i }),
    ).toHaveAttribute("href", "https://buymeacoffee.com/mattlane");
  });

  it("share on bluesky uses the provided blueskyUrl", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /share on bluesky/i }),
    ).toHaveAttribute("href", props.blueskyUrl);
  });

  it("edit on github uses the provided githubUrl", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /edit on github/i }),
    ).toHaveAttribute("href", props.githubUrl);
  });
});
