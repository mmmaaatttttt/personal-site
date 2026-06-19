"use client";

import { Check, Link2 } from "lucide-react";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

interface HeadingAnchorProps {
  id: string;
  children: ReactNode;
}

const HeadingAnchor: FC<HeadingAnchorProps> = ({ id, children }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  function copyLink() {
    const pathname = window.location.pathname.replace(/\/$/, "");
    const url = `${window.location.origin}${pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={copyLink}
        className={`ml-2 inline-flex cursor-pointer items-center text-link transition-opacity hover:opacity-100 ${copied ? "opacity-100" : "opacity-55"}`}
        aria-label={copied ? "Copied!" : "Copy link to section"}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
    </>
  );
};

export default HeadingAnchor;
