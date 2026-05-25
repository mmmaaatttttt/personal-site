import type { Metadata } from "next";
import { Domine, Open_Sans } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { SITE_DOMAIN, SITE_URL } from "@/lib/constants";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const domine = Domine({
  variable: "--font-domine",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const UMAMI_WEBSITE_ID = "a3606268-35c5-4d92-a5b9-bee9810db0e4";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Matt Lane",
  description:
    "Inside the mind of Matt Lane. Teacher, math doctor, lover of ice cream. Stories on the intersection of math, equity, games, and whatever else piques my interest.",
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${domine.variable}`}>
      <body className="font-sans antialiased text-[#1a1a1a] bg-white">
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains={SITE_DOMAIN}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
