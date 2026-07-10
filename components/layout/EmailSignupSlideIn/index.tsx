"use client";

import { X } from "lucide-react";
import type { FC } from "react";
import EmailSignup from "@/components/layout/EmailSignup";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import {
  EMAIL_SIGNUP_DISMISS_COOLDOWN_MS,
  EMAIL_SIGNUP_DISMISSED_EVENT,
  EMAIL_SIGNUP_DISMISSED_STORAGE_KEY,
  EMAIL_SUBSCRIBED_STORAGE_KEY,
} from "@/lib/constants";

const SCROLL_THRESHOLD = 0.5;

const EmailSignupSlideIn: FC = () => {
  const [isSubscribed] = useLocalStorage(EMAIL_SUBSCRIBED_STORAGE_KEY, false);
  const [dismissedAt, setDismissedAt] = useLocalStorage<number | null>(
    EMAIL_SIGNUP_DISMISSED_STORAGE_KEY,
    null,
  );
  const scrollThresholdReached = useScrollThreshold(SCROLL_THRESHOLD);

  const recentlyDismissed =
    dismissedAt !== null &&
    Date.now() - dismissedAt < EMAIL_SIGNUP_DISMISS_COOLDOWN_MS;

  if (isSubscribed || recentlyDismissed || !scrollThresholdReached) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm animate-[fade-in_0.4s_ease-out_forwards]">
      <div className="relative rounded-lg border border-gray bg-white p-4 pr-8 shadow-lg">
        <button
          type="button"
          onClick={() => setDismissedAt(Date.now())}
          aria-label="Dismiss email signup"
          data-umami-event={EMAIL_SIGNUP_DISMISSED_EVENT}
          data-umami-event-source="slideIn"
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
        <EmailSignup source="slideIn" />
      </div>
    </div>
  );
};

export default EmailSignupSlideIn;
