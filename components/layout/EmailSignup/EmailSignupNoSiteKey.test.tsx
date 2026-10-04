import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EmailSignup from ".";

vi.hoisted(() => {
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
});

describe("EmailSignup without a configured Turnstile site key", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("turnstile", { render: vi.fn(), reset: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("never attempts to render the Turnstile widget", () => {
    render(<EmailSignup source="modal" />);
    expect(window.turnstile.render).not.toHaveBeenCalled();
  });

  it("skips resetting the Turnstile widget on error since none was ever rendered", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Bot verification failed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<EmailSignup source="modal" />);
    fireEvent.change(screen.getByPlaceholderText("you-are@super.cool"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: /email signup/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Bot verification failed",
      );
    });
    expect(window.turnstile.reset).not.toHaveBeenCalled();
  });
});
