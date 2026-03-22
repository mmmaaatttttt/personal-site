"use client";

import Link from "next/link";
import React from "react";

interface NavbarProps {
  title: string;
  hide?: boolean;
  outline?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, hide = false, outline = false }) => {
  return (
    <nav
      className={`flex flex-col items-center justify-between border-b border-gray p-4 transition-all duration-300 sm:flex-row ${
        hide
          ? "absolute top-0 z-10 w-full border-b-0 bg-transparent text-white shadow-none"
          : "bg-nav text-default"
      } ${
        outline
          ? "[text-shadow:-0.1px_-0.1px_1px_#000,0.1px_-0.1px_1px_#000,-0.1px_0.1px_1px_#000,0.1px_0.1px_1px_#000]"
          : ""
      }`}
    >
      <Link href="/" className="font-bold">
        <h3 className="mb-2 text-2xl sm:mb-0 sm:text-base">{title}</h3>
      </Link>
      <div className="flex justify-center gap-4 text-sm">
        <Link href="/about" className="hover:opacity-80">
          About
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="/articles" className="hover:opacity-80">
          Stories
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
