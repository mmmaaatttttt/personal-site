import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  caption: string;
  date: string;
  featured_image: string;
  slug: string;
  tags: string[];
  title: string;
  timeToRead: number;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  caption,
  date,
  featured_image,
  slug,
  tags,
  title,
  timeToRead,
  className,
}) => {
  // Normalize image path. MDX has ../../images/..., public has /images/...
  const imagePath = featured_image.replace(/^(\.\.\/)+images\//, "/images/");

  return (
    <div
      className={cn(
        "group border-b border-gray py-8 last:border-0 sm:px-4",
        className
      )}
    >
      <Link href={`/articles/${slug}`} className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
          <Image
            src={imagePath}
            alt={`Card for ${title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="mb-2 text-xl font-bold group-hover:text-link">{title}</h4>
          <h6 className="mb-4 text-sm text-gray font-medium">
            {date} — {timeToRead} minute read
          </h6>
          <p className="text-sm leading-relaxed text-dark-gray">{caption}</p>
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-light-gray px-3 py-1 text-[10px] font-medium italic text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StoryCard;
