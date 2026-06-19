import type { ReactNode } from "react";

const MARKDOWN_LINK = /(\[[^\]]+\]\([^)]+\))/g;
const MARKDOWN_LINK_PARTS = /^\[([^\]]+)\]\(([^)]+)\)$/;

export function renderMarkdownLinks(str: string): ReactNode[] {
  return str.split(MARKDOWN_LINK).map((part, i) => {
    const match = part.match(MARKDOWN_LINK_PARTS);
    if (match) {
      return (
        <a
          // biome-ignore lint/suspicious/noArrayIndexKey: segments come from splitting a fixed string and never reorder
          key={i}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {match[1]}
        </a>
      );
    }
    return part;
  });
}
