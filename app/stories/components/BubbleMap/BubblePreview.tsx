import type { FC, Ref } from "react";
import { cn } from "@/lib/utils";
import type { ArticleMeta } from "@/utils/content";
import { datelineFor } from "@/utils/formatHelpers";

interface BubblePreviewProps {
  article: ArticleMeta | undefined;
  visible: boolean;
  left: number;
  top: number;
  ref?: Ref<HTMLDivElement>;
}

const BubblePreview: FC<BubblePreviewProps> = ({
  article,
  visible,
  left,
  top,
  ref,
}) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute w-[min(280px,70%)] rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-opacity duration-150",
      visible ? "opacity-100" : "opacity-0",
    )}
    style={{ left, top }}
  >
    {article && (
      <div className="px-4 py-3">
        <p className="m-0 font-serif text-[19px] font-bold leading-tight text-[#1a1a1a]">
          {article.title}
        </p>
        <p className="mb-2 mt-0.5 font-serif text-[13px] font-bold text-gray-400">
          {datelineFor(article)}
        </p>
        <p className="m-0 text-sm leading-snug text-dark-gray">
          {article.caption}
        </p>
      </div>
    )}
  </div>
);

export default BubblePreview;
