"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  outline?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, outline = false }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if it's an article page (previously /stories/...)
  // The new structure will be /articles/...
  const isArticlePage = pathname?.startsWith("/articles/") && pathname !== "/articles/";

  return (
    <div
      className={`flex min-h-screen flex-col transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar
        title="Matt Lane"
        hide={isArticlePage}
        outline={outline}
      />
      <main className="flex flex-1 justify-center py-6 sm:py-12">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
