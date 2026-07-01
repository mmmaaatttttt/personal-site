"use client";

import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import EmailSignupModal from "./EmailSignupModal";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
  outline?: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, outline = false }) => {
  const pathname = usePathname();
  const mounted = useIsMounted();

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
      <main className="flex flex-1 justify-center">
        <div className="w-full flex flex-col">{children}</div>
      </main>
      <Footer />
      <EmailSignupModal />
    </div>
  );
};

export default MainLayout;
