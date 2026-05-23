import type { Metadata } from "next";
import { Domine, Open_Sans } from "next/font/google";
import type { ReactNode } from "react";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mattlane.us"),
  title: "Matt Lane",
  description:
    "Inside the mind of Matt Lane. Teacher, math doctor, lover of ice cream. Stories on the intersection of math, equity, games, and whatever else piques my interest.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${domine.variable}`}>
      <body className="font-sans antialiased text-[#1a1a1a] bg-white">
        {children}
      </body>
    </html>
  );
}
