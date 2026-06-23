"use client";

import { Mail } from "lucide-react";
import { type FC, useEffect, useRef, useState } from "react";

const SUBSCRIBE_URL = "https://subscribe.mattlane.workers.dev";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EmailSignup: FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");

  useEffect(() => {
    const renderWidget = () => {
      if (!turnstileRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        appearance: "interaction-only",
      });
    };

    const initWidget = () => {
      if (!TURNSTILE_SITE_KEY) return;
      if (window.turnstile) {
        renderWidget();
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          initWidget();
        }
      },
      { threshold: 0.1 },
    );

    if (turnstileRef.current) {
      observer.observe(turnstileRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      let message = "Oops, sorry, something went wrong";
      try {
        const data = await res.json();
        if (typeof data?.error === "string") {
          message = data.error;
        }
      } catch {
        // JSON parse failed, use fallback message
      }
      setErrorMessage(message);
      setStatus("error");
      if (widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    } catch {
      setErrorMessage("Oops, sorry, something went wrong");
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="not-prose mb-8 text-sm text-gray-600">You're in!</p>;
  }

  return (
    <div className="not-prose mb-8">
      <p className="mb-2 text-sm font-semibold text-[#1a1a1a]">
        Never miss a story. No AI slop. Just sweet, sweet math.
      </p>
      <form
        onSubmit={handleSubmit}
        aria-label="Email signup"
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you-are@super.cool"
          required
          className="min-w-0 flex-1 rounded border border-gray-300 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded bg-link px-5 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
        >
          <Mail size={18} strokeWidth={1.5} />
          {status === "loading" ? "Just a sec..." : "Sign me up!"}
        </button>
      </form>
      <div ref={turnstileRef} />
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default EmailSignup;
