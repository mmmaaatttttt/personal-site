"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useFigureNumber } from "./FigureProvider";
import type { FigureProps } from "./types";

const bleedClasses = [
  "min-[890px]:w-[110%] min-[890px]:-ml-[5%]",
  "min-[1020px]:w-[120%] min-[1020px]:-ml-[10%]",
  "min-[1240px]:w-[130%] min-[1240px]:-ml-[15%]",
];

export default function FigureInner({
  children,
  caption,
  className,
  captionMarginTop,
  bleed = true,
}: FigureProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const figNum = useFigureNumber(id);
  const param = figNum > 0 ? String(figNum) : id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = searchParams.get("figure") === param;
  const isExpanded = isOpen && mounted;

  // Prevent background scroll while expanded.
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  // Escape key to close.
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const params = new URLSearchParams(window.location.search);
      params.delete("figure");
      const paramStr = params.toString();
      router.replace(paramStr ? `?${paramStr}` : window.location.pathname, {
        scroll: false,
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, router]);

  const handleOpen = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("figure", param);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("figure");
    const paramStr = params.toString();
    router.replace(paramStr ? `?${paramStr}` : window.location.pathname, {
      scroll: false,
    });
  };

  const backdrop =
    mounted && isExpanded
      ? createPortal(
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[49] bg-black/70"
            onClick={handleClose}
          />,
          document.body,
        )
      : null;

  return (
    <>
      {/*
       * Three wrapper levels are always in the DOM so React never unmounts
       * children (which would destroy simulation state). Only styles change.
       *
       * Expanded scroll pattern: outer is the overflow-y-auto scroll container
       * (not flex). Middle is min-h-full flex-col justify-center so short content
       * centers vertically while tall content overflows and scrolls from the
       * top — the fix for flex+justify-center clipping overflow at the start.
       *
       * The expand/collapse button lives in a header strip ABOVE the interactive
       * content in both states, so it never overlaps interactive UI elements and
       * is always in the same relative position whether collapsed or expanded.
       */}
      <div
        className={cn(
          isExpanded
            ? "fixed inset-0 z-50 overflow-y-auto bg-white"
            : [
                "my-8 flex flex-col items-center w-full ml-0",
                bleed && bleedClasses,
                className,
              ],
        )}
      >
        <div
          className={cn(
            isExpanded
              ? "flex min-h-full w-full flex-col items-center justify-center p-8"
              : "flex w-full flex-col items-center",
          )}
        >
          {/* Header strip: always above the interactive, never inside it. */}
          <div
            className={cn(
              "flex justify-end pb-1",
              isExpanded ? "w-full max-w-7xl" : "w-full",
            )}
          >
            <button
              type="button"
              onClick={isExpanded ? handleClose : handleOpen}
              className="cursor-pointer rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm transition-colors hover:border-gray-300 hover:text-gray-800"
              aria-label={
                isExpanded ? "Collapse interactive" : "Expand interactive"
              }
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>

          <div
            className={cn(
              "not-prose",
              isExpanded ? "w-full max-w-7xl" : "w-full",
            )}
          >
            {children}
          </div>

          {caption && (
            <div
              className={cn(
                "mt-1 px-4 text-center text-sm font-bold text-gray-600",
                isExpanded ? "w-full max-w-7xl" : "max-w-2xl",
              )}
              style={
                captionMarginTop && !isExpanded
                  ? { marginTop: captionMarginTop }
                  : undefined
              }
            >
              {figNum > 0 ? `Figure ${figNum}: ${caption}` : caption}
            </div>
          )}
        </div>
      </div>
      {backdrop}
    </>
  );
}
