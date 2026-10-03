"use client";

import { Check, Coffee, Link2 } from "lucide-react";
import { type FC, useState } from "react";
import BlueskyIcon from "@/components/icons/BlueskyIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { trackEvent } from "@/lib/analytics";
import { STORY_ACTION_CLICK_EVENT } from "@/lib/constants";

interface StoryActionsProps {
  githubUrl: string;
  blueskyUrl: string;
  linkedinUrl: string;
}

const SECONDARY_ACTION_CLASS =
  "inline-flex h-11 w-11 items-center justify-center rounded border border-gray-300 text-gray-500 hover:border-link hover:text-link";

const StoryActions: FC<StoryActionsProps> = ({
  githubUrl,
  blueskyUrl,
  linkedinUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    trackEvent(STORY_ACTION_CLICK_EVENT, { action: "copy-link" });
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pb-6 not-prose">
      <a
        href="https://buymeacoffee.com/mattlane"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent(STORY_ACTION_CLICK_EVENT, { action: "coffee" })
        }
        className="inline-flex h-11 items-center justify-center gap-2 rounded bg-link px-5 text-sm font-semibold text-white hover:opacity-80"
      >
        <Coffee size={18} strokeWidth={1.5} />
        Buy me a coffee
      </a>
      <a
        href={blueskyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Bluesky"
        onClick={() =>
          trackEvent(STORY_ACTION_CLICK_EVENT, { action: "bluesky" })
        }
        className={SECONDARY_ACTION_CLASS}
      >
        <BlueskyIcon size={18} />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        onClick={() =>
          trackEvent(STORY_ACTION_CLICK_EVENT, { action: "linkedin" })
        }
        className={SECONDARY_ACTION_CLASS}
      >
        <LinkedinIcon size={18} strokeWidth={1.5} />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : "Copy link"}
        className={SECONDARY_ACTION_CLASS}
      >
        {copied ? (
          <Check size={18} strokeWidth={1.5} />
        ) : (
          <Link2 size={18} strokeWidth={1.5} />
        )}
      </button>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Edit on GitHub"
        onClick={() =>
          trackEvent(STORY_ACTION_CLICK_EVENT, { action: "github" })
        }
        className={SECONDARY_ACTION_CLASS}
      >
        <GithubIcon size={18} strokeWidth={1.5} />
      </a>
    </div>
  );
};

export default StoryActions;
