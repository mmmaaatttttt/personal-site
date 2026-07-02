import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EMAIL_SIGNUP_DISMISS_COOLDOWN_MS,
  EMAIL_SIGNUP_DISMISSED_EVENT,
  EMAIL_SIGNUP_DISMISSED_STORAGE_KEY,
  EMAIL_SUBSCRIBED_STORAGE_KEY,
} from "@/lib/constants";
import EmailSignupSlideIn from ".";

function setScrollMetrics({
  scrollHeight,
  innerHeight,
  scrollY,
}: {
  scrollHeight: number;
  innerHeight: number;
  scrollY: number;
}) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

function scrollPastThreshold() {
  setScrollMetrics({ scrollHeight: 2000, innerHeight: 800, scrollY: 700 });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("EmailSignupSlideIn", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("turnstile", {
      render: vi.fn(
        (_el: HTMLElement, opts: { callback: (t: string) => void }) => {
          opts.callback("test-token");
          return "widget-id";
        },
      ),
      reset: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    setScrollMetrics({ scrollHeight: 0, innerHeight: 0, scrollY: 0 });
  });

  it("renders nothing before the scroll threshold is reached", () => {
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 800, scrollY: 0 });
    const { container } = render(<EmailSignupSlideIn />);
    expect(container).toBeEmptyDOMElement();
  });

  it("appears once the reader scrolls past the threshold", () => {
    render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    expect(
      screen.getByRole("form", { name: /email signup/i }),
    ).toBeInTheDocument();
  });

  it("dismisses when the close button is clicked", () => {
    render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("tags the dismiss button with the umami tracking attribute", () => {
    render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    expect(screen.getByRole("button", { name: /dismiss/i })).toHaveAttribute(
      "data-umami-event",
      EMAIL_SIGNUP_DISMISSED_EVENT,
    );
  });

  it("stays hidden on a later visit within the dismiss cooldown window", () => {
    localStorage.setItem(
      EMAIL_SIGNUP_DISMISSED_STORAGE_KEY,
      JSON.stringify(Date.now() - 1000),
    );
    const { container } = render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    expect(container).toBeEmptyDOMElement();
  });

  it("reappears once the dismiss cooldown window has elapsed", () => {
    localStorage.setItem(
      EMAIL_SIGNUP_DISMISSED_STORAGE_KEY,
      JSON.stringify(Date.now() - EMAIL_SIGNUP_DISMISS_COOLDOWN_MS - 1000),
    );
    render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    expect(
      screen.getByRole("form", { name: /email signup/i }),
    ).toBeInTheDocument();
  });

  it("never renders for a reader who has already subscribed", () => {
    localStorage.setItem(EMAIL_SUBSCRIBED_STORAGE_KEY, JSON.stringify(true));
    const { container } = render(<EmailSignupSlideIn />);
    scrollPastThreshold();
    expect(container).toBeEmptyDOMElement();
  });

  it("disappears after a successful signup", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));
    render(<EmailSignupSlideIn />);
    scrollPastThreshold();

    fireEvent.change(screen.getByPlaceholderText("you-are@super.cool"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /email signup/i }));

    await waitFor(() => {
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    });
  });
});
