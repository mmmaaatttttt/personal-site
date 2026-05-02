"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
  outline?: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({
  children,
  outline = false,
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if it's a story page
  const isArticlePage =
    pathname?.startsWith("/stories/") && pathname !== "/stories/";

  return (
    <div
      className={`flex min-h-screen flex-col transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar title="Matt Lane" hide={isArticlePage} outline={outline} />
      <main
        className={`flex flex-1 justify-center ${isArticlePage ? "" : "py-6 sm:py-12"}`}
      >
        <div className="w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
