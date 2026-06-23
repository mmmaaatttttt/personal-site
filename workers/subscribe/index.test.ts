// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "./index";

const env = {
  RESEND_API_KEY: "test-api-key",
  RESEND_SEGMENT_ID: "test-segment-id",
  TURNSTILE_SECRET_KEY: "test-secret-key",
};

function postRequest(body: unknown) {
  return new Request("https://subscribe.mattlane.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockTurnstileSuccess() {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ success: true }), { status: 200 }),
  );
}

function mockResendSuccess() {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ id: "contact-id" }), { status: 200 }),
  );
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ id: "email-id" }), { status: 200 }),
  );
}

describe("subscribe worker", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 200 for OPTIONS preflight with CORS headers", async () => {
    const req = new Request("https://subscribe.mattlane.workers.dev", {
      method: "OPTIONS",
    });
    const res = await handler.fetch(req, env);
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://mattlane.us",
    );
  });

  it("returns 405 for non-POST methods", async () => {
    const req = new Request("https://subscribe.mattlane.workers.dev", {
      method: "GET",
    });
    const res = await handler.fetch(req, env);
    expect(res.status).toBe(405);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("https://subscribe.mattlane.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    const res = await handler.fetch(req, env);
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Invalid request body",
    );
  });

  it("treats non-string email as invalid after Turnstile passes", async () => {
    mockTurnstileSuccess();
    const res = await handler.fetch(
      postRequest({ email: 123, turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Invalid email address",
    );
  });

  it("treats non-string turnstileToken as empty", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: 42 }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("returns 503 when Turnstile API is unavailable", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(503);
  });

  it("returns 403 when Turnstile verification fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "fake" }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("returns 400 for malformed email after Turnstile passes", async () => {
    mockTurnstileSuccess();
    const res = await handler.fetch(
      postRequest({ email: "not-an-email", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Invalid email address",
    );
  });

  it("returns Resend error message when contact creation fails with JSON", async () => {
    mockTurnstileSuccess();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Contact already exists" }), {
        status: 422,
      }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(422);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Contact already exists",
    );
  });

  it("falls back to generic error when Resend error body has no message field", async () => {
    mockTurnstileSuccess();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ code: "ERR" }), { status: 500 }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(500);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Something went wrong",
    );
  });

  it("falls back to generic error when Resend returns non-JSON", async () => {
    mockTurnstileSuccess();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("bad gateway", { status: 502 }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toBe(
      "Something went wrong",
    );
  });

  it("logs error but still returns 200 when welcome email send fails with JSON", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockTurnstileSuccess();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "contact-id" }), { status: 200 }),
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "template not found" }), {
        status: 422,
      }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Welcome email failed:",
      422,
      expect.anything(),
    );
    consoleSpy.mockRestore();
  });

  it("logs error but still returns 200 when welcome email send fails with non-JSON", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockTurnstileSuccess();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "contact-id" }), { status: 200 }),
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("bad gateway", { status: 502 }),
    );
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Welcome email failed:",
      502,
      expect.anything(),
    );
    consoleSpy.mockRestore();
  });

  it("returns 200 and sends welcome email on successful subscription", async () => {
    mockTurnstileSuccess();
    mockResendSuccess();
    const res = await handler.fetch(
      postRequest({ email: "test@example.com", turnstileToken: "token" }),
      env,
    );
    expect(res.status).toBe(200);
    expect(((await res.json()) as { success: boolean }).success).toBe(true);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(3);
    const [welcomeUrl] = vi.mocked(fetch).mock.calls[2] as [
      string,
      RequestInit,
    ];
    expect(welcomeUrl).toContain("resend.com/emails");
  });
});
