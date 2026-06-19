"use client";

import type { FC, MouseEvent } from "react";
import type { Heading } from "@/utils/headings";

interface TableOfContentsProps {
  headings: Heading[];
}

const INTRO: Heading = { text: "Introduction", id: "introduction" };

function scrollTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

const TableOfContents: FC<TableOfContentsProps> = ({ headings }) => {
  if (headings.length === 0) return null;

  const all = [INTRO, ...headings];

  const linkList = (
    <ul className="m-0 space-y-1.5 p-0">
      {all.map((h) => (
        <li key={h.id} className="m-0 list-none p-0">
          <a
            href={`#${h.id}`}
            onClick={(e) => scrollTo(e, h.id)}
            className="block font-serif text-sm leading-snug text-[#1a1a1a] no-underline transition-colors hover:text-link mb-2"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: always-expanded */}
      <nav
        className="mb-4 hidden border-l-[3px] border-link pl-4 md:block"
        aria-label="Table of contents"
      >
        <p className="m-0 mb-3 font-serif text-xs font-bold uppercase tracking-widest text-link">
          Contents
        </p>
        {linkList}
      </nav>

      {/* Mobile: collapsible */}
      <details className="mb-4 border-l-[3px] border-link pl-4 md:hidden">
        <summary className="cursor-pointer select-none font-serif text-sm font-bold text-link">
          Contents
        </summary>
        <div className="mt-3">{linkList}</div>
      </details>

      <hr className="mb-8 border-gray-200" />
    </>
  );
};

export default TableOfContents;
