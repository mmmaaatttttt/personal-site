"use client";

import { Coffee, Link2 } from "lucide-react";
import { type FC, useState } from "react";
import BlueskyIcon from "@/components/icons/BlueskyIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";

interface StoryActionsProps {
  githubUrl: string;
  blueskyUrl: string;
  linkedinUrl: string;
}

const StoryActions: FC<StoryActionsProps> = ({
  githubUrl,
  blueskyUrl,
  linkedinUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 pb-12 not-prose">
      <a
        href="https://buymeacoffee.com/mattlane"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded bg-link px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
      >
        <Coffee size={18} strokeWidth={1.5} />
        Buy me a coffee
      </a>
      <a
        href={blueskyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded border-2 border-link px-5 py-3 text-sm font-semibold text-link hover:opacity-80"
      >
        <BlueskyIcon size={18} />
        Share on Bluesky
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded border-2 border-link px-5 py-3 text-sm font-semibold text-link hover:opacity-80"
      >
        <LinkedinIcon size={18} strokeWidth={1.5} />
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded border border-current px-5 py-3 text-sm text-gray-500 hover:opacity-80"
      >
        <Link2 size={18} strokeWidth={1.5} />
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded border border-current px-5 py-3 text-sm text-gray-500 hover:opacity-80"
      >
        <GithubIcon size={18} strokeWidth={1.5} />
        Edit on GitHub
      </a>
    </div>
  );
};

export default StoryActions;
