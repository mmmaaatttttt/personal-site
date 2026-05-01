"use client";

import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const Sidebar: FC<SidebarProps> = ({ children, direction = "left" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`absolute hidden xl:block z-10 w-[calc((100vw-var(--max-w-content))/2-2rem)] bg-[#fff4eb] shadow-[0_0_6px_2px_#ff5700] rounded-[10px] p-[0.8rem] ${
        direction === "left"
          ? "left-[calc((var(--max-w-content)-100vw)/2+1rem)]"
          : "right-[calc((var(--max-w-content)-100vw)/2+1rem)]"
      }`}
    >
      <div className="italic text-sm leading-loose text-gray-800">
        {children}
      </div>
    </motion.div>
  );
};

export default Sidebar;
