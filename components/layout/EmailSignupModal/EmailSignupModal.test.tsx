import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import {
  EMAIL_SIGNUP_DISMISSED_EVENT,
  EMAIL_SIGNUP_MODAL_QUERY_PARAM,
  EMAIL_SUBSCRIBED_STORAGE_KEY,
} from "@/lib/constants";
import EmailSignupModal from ".";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
}));

describe("EmailSignupModal — closed state", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    mockReplace.mockClear();
  });

  it("renders nothing when the query param is absent", () => {
    const { container } = render(<EmailSignupModal />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EmailSignupModal — open state", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams(`${EMAIL_SIGNUP_MODAL_QUERY_PARAM}`);
    mockReplace.mockClear();
    localStorage.clear();
    window.umami = { track: vi.fn() };
  });

  afterEach(() => {
    document.body.style.overflow = "";
    window.history.replaceState({}, "", "/");
    localStorage.clear();
    window.umami = undefined;
  });

  it("opens when the query param is present on mount", () => {
    render(<EmailSignupModal />);
    expect(
      screen.getByRole("dialog", { name: /email signup/i }),
    ).toBeInTheDocument();
  });

  it("renders the email signup form", () => {
    render(<EmailSignupModal />);
    expect(
      screen.getByRole("form", { name: /email signup/i }),
    ).toBeInTheDocument();
  });

  it("locks body scroll while open", () => {
    render(<EmailSignupModal />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll on unmount", () => {
    const { unmount } = render(<EmailSignupModal />);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes via router.replace when the close button is clicked", () => {
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockReplace).toHaveBeenCalledWith(
      expect.not.stringContaining(EMAIL_SIGNUP_MODAL_QUERY_PARAM),
      expect.objectContaining({ scroll: false }),
    );
  });

  it("closes via router.replace when the backdrop is clicked", () => {
    render(<EmailSignupModal />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop as HTMLElement);
    expect(mockReplace).toHaveBeenCalled();
  });

  it("does not close when clicking inside the dialog content", () => {
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("dialog", { name: /email signup/i }));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("closes on Escape key", () => {
    render(<EmailSignupModal />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockReplace).toHaveBeenCalled();
  });

  it("does not close on non-Escape key", () => {
    render(<EmailSignupModal />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("preserves other URL params when closing", () => {
    window.history.replaceState(
      {},
      "",
      `?${EMAIL_SIGNUP_MODAL_QUERY_PARAM}&tab=overview`,
    );
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockReplace).toHaveBeenCalledWith(
      "?tab=overview",
      expect.objectContaining({ scroll: false }),
    );
  });

  it("leaves the pathname exactly as-is when closing with no other params", () => {
    window.history.replaceState(
      {},
      "",
      `/stories/dailemma?${EMAIL_SIGNUP_MODAL_QUERY_PARAM}`,
    );
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockReplace).toHaveBeenCalledWith(
      "/stories/dailemma",
      expect.objectContaining({ scroll: false }),
    );
  });

  it("preserves URL hash when closing", () => {
    window.history.replaceState(
      {},
      "",
      `?${EMAIL_SIGNUP_MODAL_QUERY_PARAM}#section-one`,
    );
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("#section-one"),
      expect.objectContaining({ scroll: false }),
    );
  });

  it("tracks a dismiss event when the close button is clicked", () => {
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(window.umami?.track).toHaveBeenCalledWith(
      EMAIL_SIGNUP_DISMISSED_EVENT,
      { source: "modal" },
    );
  });

  it("tracks a dismiss event when the backdrop is clicked", () => {
    render(<EmailSignupModal />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop as HTMLElement);
    expect(window.umami?.track).toHaveBeenCalledWith(
      EMAIL_SIGNUP_DISMISSED_EVENT,
      { source: "modal" },
    );
  });

  it("tracks a dismiss event on Escape key close", () => {
    render(<EmailSignupModal />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(window.umami?.track).toHaveBeenCalledWith(
      EMAIL_SIGNUP_DISMISSED_EVENT,
      { source: "modal" },
    );
  });

  it("does not track a dismiss event when closing after a successful signup", () => {
    localStorage.setItem(EMAIL_SUBSCRIBED_STORAGE_KEY, JSON.stringify(true));
    render(<EmailSignupModal />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(window.umami?.track).not.toHaveBeenCalledWith(
      EMAIL_SIGNUP_DISMISSED_EVENT,
      expect.anything(),
    );
  });
});
