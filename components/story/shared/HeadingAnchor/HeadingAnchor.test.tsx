import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import HeadingAnchor from ".";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: writeTextMock },
    configurable: true,
  });
  writeTextMock.mockClear();
  window.history.replaceState({}, "", "/stories/test-story/");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("HeadingAnchor", () => {
  it("renders children and a copy button", () => {
    render(<HeadingAnchor id="section-one">Heading text</HeadingAnchor>);
    expect(screen.getByText("Heading text")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy link to section" }),
    ).toBeInTheDocument();
  });

  it("copies the section URL when the button is clicked", () => {
    render(<HeadingAnchor id="section-one">Heading text</HeadingAnchor>);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy link to section" }),
    );
    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining("#section-one"),
    );
  });

  it("builds the URL from origin + pathname (no trailing slash, search params, or existing hash)", () => {
    window.history.replaceState({}, "", "/stories/my-story/?figure=1#old-hash");
    render(<HeadingAnchor id="my-section">text</HeadingAnchor>);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy link to section" }),
    );
    expect(writeTextMock).toHaveBeenCalledWith(
      `${window.location.origin}/stories/my-story#my-section`,
    );
  });

  it("shows 'Copied!' label on the button after clicking", () => {
    render(<HeadingAnchor id="section-one">Heading text</HeadingAnchor>);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy link to section" }),
    );
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("reverts button label back after 1500ms", () => {
    vi.useFakeTimers();
    render(<HeadingAnchor id="section-one">Heading text</HeadingAnchor>);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy link to section" }),
    );
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(
      screen.getByRole("button", { name: "Copy link to section" }),
    ).toBeInTheDocument();
  });
});
