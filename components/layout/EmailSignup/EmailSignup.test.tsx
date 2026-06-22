import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EmailSignup from ".";

function fillAndSubmit(email = "test@example.com") {
  fireEvent.change(screen.getByPlaceholderText("you-are@super.cool"), {
    target: { value: email },
  });
  fireEvent.submit(screen.getByRole("form", { name: /email signup/i }));
}

describe("EmailSignup", () => {
  beforeEach(() => {
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
  });

  it("renders the email input and submit button", () => {
    render(<EmailSignup />);
    expect(
      screen.getByPlaceholderText("you-are@super.cool"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("disables the button while loading", async () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  it("hides the form on ok response", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    });
  });

  it("sends the turnstile token with the request", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      const body = JSON.parse(
        vi.mocked(fetch).mock.calls[0][1]?.body as string,
      );
      expect(body.turnstileToken).toBe("test-token");
    });
  });

  it("shows API error message on non-ok response with string error", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ error: "This email is already subscribed." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "This email is already subscribed.",
      );
    });
  });

  it("resets the turnstile widget on error", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Bot verification failed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(window.turnstile.reset).toHaveBeenCalledWith("widget-id");
    });
  });

  it("shows fallback error when response data has no string error", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ detail: "error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows fallback error when response JSON cannot be parsed", async () => {
    const mockResponse = {
      ok: false,
      json: vi.fn().mockRejectedValue(new Error("parse error")),
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows fallback error when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));
    render(<EmailSignup />);
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
