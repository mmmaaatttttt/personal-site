"use client";

import { FC, ReactNode } from "react";

interface ScreenOverlayProps {
  backgroundColor: string;
  children: ReactNode;
}

const ScreenOverlay: FC<ScreenOverlayProps> = ({ backgroundColor, children }) => (
  <div
    className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
    style={{ backgroundColor: `${backgroundColor}b3` }}
  >
    <div className="bg-white p-8 rounded-lg text-center [&_p]:mb-0">
      {children}
    </div>
  </div>
);

export default ScreenOverlay;
