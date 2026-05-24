"use client";

import Link from "next/link";
import type { FC } from "react";

interface NavbarProps {
  title: string;
  hide?: boolean;
  outline?: boolean;
}

const Navbar: FC<NavbarProps> = ({ title, hide = false, outline = false }) => {
  return (
    <nav
      className={`flex flex-row items-center justify-between sm:flex-col sm:justify-center sm:items-center border-b py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${
        hide
          ? "absolute top-0 z-20 w-full border-b-0 bg-transparent text-white shadow-none"
          : "bg-nav text-link border-gray shadow-[0_1px_12px_3px_#e2e2e2]"
      } ${
        outline
          ? "[text-shadow:-0.1px_-0.1px_1px_#000,0.1px_-0.1px_1px_#000,-0.1px_0.1px_1px_#000,0.1px_0.1px_1px_#000]"
          : ""
      }`}
    >
      <Link href="/" className="sm:mb-2 hover:opacity-80">
        <h3 className="font-serif text-sm sm:text-2xl font-bold tracking-tight">
          {title}
        </h3>
      </Link>
      <div className="flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-sans">
        <Link href="/about" className="hover:opacity-80">
          About
        </Link>
        <span className={hide ? "text-white/70" : "text-gray-400"}>|</span>
        <Link href="/stories" className="hover:opacity-80">
          Stories
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
