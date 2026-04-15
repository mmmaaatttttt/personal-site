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
      className="absolute hidden xl:block z-10"
      style={{
        width: "calc((100vw - var(--max-w-content)) / 2 - 2rem)",
        [direction]: "calc((var(--max-w-content) - 100vw) / 2 + 1rem)",
        backgroundColor: "#fff4eb", // Lightened #ff5700
        boxShadow: "0 0 6px 2px #ff5700",
        borderRadius: "10px",
        padding: "0.8rem",
      }}
    >
      <div className="italic text-sm leading-loose text-gray-800">
        {children}
      </div>
    </motion.div>
  );
};

export default Sidebar;
