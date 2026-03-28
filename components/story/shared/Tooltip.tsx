"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipInfo {
  title: string;
  body: string | string[];
  x: number;
  y: number;
}

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const showTooltip = useCallback((title: string, body: string | string[]) => (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = "touches" in e;
    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setTooltip({
      title,
      body,
      x: clientX,
      y: clientY,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  return { tooltip, showTooltip, hideTooltip };
};

interface TooltipProps {
  info: TooltipInfo | null;
}

const Tooltip: React.FC<TooltipProps> = ({ info }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 15, y: 15 });

  useEffect(() => {
    if (info && tooltipRef.current) {
        const { width, height } = tooltipRef.current.getBoundingClientRect();
        const overflowX = info.x + width + 20 > window.innerWidth;
        const overflowY = info.y + height + 20 > window.innerHeight;
        
        setOffset({
            x: overflowX ? -width - 20 : 20,
            y: overflowY ? -height - 20 : 20
        });
    }
  }, [info]);

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            left: info.x + offset.x,
            top: info.y + offset.y
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
          className="fixed z-50 pointer-events-none bg-white/90 backdrop-blur-md border border-gray-200 p-3 rounded-lg shadow-xl max-w-xs transition-shadow"
          style={{ position: 'fixed' }}
        >
          <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1">
            {info.title}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {Array.isArray(info.body) ? (
              info.body.map((line, i) => <div key={i}>{line}</div>)
            ) : (
              <div>{info.body}</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;
