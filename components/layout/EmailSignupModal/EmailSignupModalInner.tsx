"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmailSignup from "@/components/layout/EmailSignup";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { trackEvent } from "@/lib/analytics";
import {
  EMAIL_SIGNUP_DISMISSED_EVENT,
  EMAIL_SIGNUP_MODAL_QUERY_PARAM,
  EMAIL_SUBSCRIBED_STORAGE_KEY,
} from "@/lib/constants";

const EmailSignupModalInner: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubscribed] = useLocalStorage(EMAIL_SUBSCRIBED_STORAGE_KEY, false);

  // Local state drives the UI immediately on trigger click.
  // useSearchParams syncs it from the URL on mount (handles direct/shared links).
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    if (!isSubscribed) {
      trackEvent(EMAIL_SIGNUP_DISMISSED_EVENT, { source: "modal" });
    }
    setIsOpen(false);
    const params = new URLSearchParams(window.location.search);
    params.delete(EMAIL_SIGNUP_MODAL_QUERY_PARAM);
    const paramStr = params.toString();
    const hash = window.location.hash;
    router.replace(
      paramStr ? `?${paramStr}${hash}` : `${window.location.pathname}${hash}`,
      { scroll: false },
    );
  }, [router, isSubscribed]);

  useEffect(() => {
    setIsOpen(searchParams.has(EMAIL_SIGNUP_MODAL_QUERY_PARAM));
  }, [searchParams]);

  // Prevent background scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-black/70"
        onClick={close}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Email signup"
          className="pointer-events-auto relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <EmailSignup source="modal" />
        </div>
      </div>
    </>,
    document.body,
  );
};

export default EmailSignupModalInner;
