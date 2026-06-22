interface Env {
  RESEND_API_KEY: string;
  RESEND_SEGMENT_ID: string;
  TURNSTILE_SECRET_KEY: string;
}

const WELCOME_EMAIL_TEMPLATE_ID = "597ebd3b-16ef-4e77-8aba-91e2d0d29dca";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://mattlane.us",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let email: string;
    let turnstileToken: string;
    try {
      const body = (await request.json()) as Record<string, unknown>;
      email = typeof body.email === "string" ? body.email.trim() : "";
      turnstileToken =
        typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    } catch {
      return json({ error: "Invalid request body" }, 400);
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      },
    );
    if (!verifyRes.ok) {
      return json({ error: "Bot verification unavailable" }, 503);
    }
    const verification = (await verifyRes.json()) as { success: boolean };
    if (!verification.success) {
      return json({ error: "Bot verification failed" }, 403);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address" }, 400);
    }

    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        segments: [{ id: env.RESEND_SEGMENT_ID }],
      }),
    });

    if (!res.ok) {
      let message = "Something went wrong";
      try {
        const data = (await res.json()) as { message?: string };
        if (typeof data.message === "string") message = data.message;
      } catch {
        // Resend didn't return JSON
      }
      return json({ error: message }, res.status);
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Matt Lane <yo@mattlane.us>",
        to: email,
        subject: "Matt Lane says hi!",
        template_id: WELCOME_EMAIL_TEMPLATE_ID,
      }),
    });

    return json({ success: true });
  },
};
