import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, FC } from "react";
import placeholders from "@/lib/imagePlaceholders.json";
import { cn } from "@/lib/utils";
import { normalizeImagePath } from "@/utils/stringHelpers";

interface StoryCardProps {
  caption: string;
  date: string;
  featured_image: string;
  slug: string;
  tags: string[];
  title: string;
  timeToRead?: number;
  index?: number;
  className?: string;
}

const StoryCard: FC<StoryCardProps> = ({
  caption,
  date,
  featured_image,
  slug,
  tags,
  title,
  timeToRead,
  index = 0,
  className,
}) => {
  const imagePath = normalizeImagePath(featured_image);
  const blurDataURL = (placeholders as Record<string, string>)[imagePath];
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "group border-b border-gray py-8 last:border-0 sm:px-4",
        isEven ? "bounce-in-left" : "bounce-in-right",
        className,
      )}
      style={{ animationDelay: `${index * 0.25}s` } as CSSProperties}
    >
      <Link
        href={`/stories/${slug}`}
        className="flex flex-col gap-6 sm:flex-row"
      >
        <div className="relative w-full shrink-0 overflow-hidden rounded-lg sm:w-64 aspect-video">
          <Image
            src={imagePath}
            alt={`Card for ${title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h4 className="mb-1 font-serif text-2xl font-bold text-[#1a1a1a] group-hover:text-link transition-colors duration-200">
            {title}
          </h4>
          <h6 className="mb-4 text-sm font-bold text-gray-400">
            {date} {timeToRead ? `- ${timeToRead} minute read` : ""}
          </h6>
          <p className="text-sm leading-relaxed text-dark-gray">{caption}</p>
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-400 px-3 py-1 text-[11px] font-medium italic text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StoryCard;
