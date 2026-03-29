import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matt Lane",
  description: "Inside the mind of Matt Lane. Teacher, math doctor, lover of ice cream. Stories on the intersection of math, equity, games, and whatever else piques my interest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased text-[#1a1a1a] bg-white">
        {children}
      </body>
    </html>
  );
}
