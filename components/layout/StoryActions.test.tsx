import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/icons/BlueskyIcon", () => ({
  default: () => <svg data-testid="bluesky-icon" />,
}));
vi.mock("@/components/icons/GithubIcon", () => ({
  default: () => <svg data-testid="github-icon" />,
}));
vi.mock("@/components/icons/LinkedinIcon", () => ({
  default: () => <svg data-testid="linkedin-icon" />,
}));

import StoryActions from "./StoryActions";

const props = {
  githubUrl:
    "https://github.com/mmmaaatttttt/personal-site/blob/main/content/stories/test/index.mdx",
  blueskyUrl:
    "https://bsky.app/intent/compose?text=Test+Story+https%3A%2F%2Fmattlane.us%2Fstories%2Ftest",
  linkedinUrl:
    "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmattlane.us%2Fstories%2Ftest",
};

describe("StoryActions", () => {
  it("renders all action buttons and links", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /buy me a coffee/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /share on bluesky/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /share on linkedin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy link/i }),
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

  it("share on linkedin uses the provided linkedinUrl", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /share on linkedin/i }),
    ).toHaveAttribute("href", props.linkedinUrl);
  });

  it("edit on github uses the provided githubUrl", () => {
    render(<StoryActions {...props} />);
    expect(
      screen.getByRole("link", { name: /edit on github/i }),
    ).toHaveAttribute("href", props.githubUrl);
  });

  it("copy button writes current URL to clipboard and shows Copied!", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<StoryActions {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /copied!/i }),
      ).toBeInTheDocument();
    });
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it("copy button reverts to Copy link after 2 seconds", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<StoryActions {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole("button", { name: /copied!/i }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("button", { name: /copy link/i }),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });
});
