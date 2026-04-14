import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const Sidebar: FC<SidebarProps> = ({ children, direction = "left" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`
        absolute hidden lg:block
        w-[calc((100vw-768px)/2-2rem)]
        bg-blue-50/80 italic text-sm leading-loose p-6 rounded-xl shadow-[0_0_6px_2px_rgba(59,130,246,0.3)]
        ${direction === "left" ? "left-4" : "right-4"}
        mt-4
      `}
    >
      {children}
    </motion.div>
  );
};

export default Sidebar;
