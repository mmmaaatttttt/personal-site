import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import placeholders from "@/lib/imagePlaceholders.json";
import { getLatestStory } from "@/utils/content";
import { normalizeImagePath } from "@/utils/stringHelpers";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const latest = await getLatestStory();
  const imagePath = normalizeImagePath(latest.featured_image);
  const blurDataURL = (placeholders as Record<string, string>)[imagePath];

  return (
    <MainLayout>
      <div className="flex flex-col items-center px-4 py-16 text-center sm:py-24">
        <h1 className="mb-4 font-serif text-6xl font-black tracking-tighter sm:text-8xl">
          Oh no!{" "}
          <span role="img" aria-label="cry-face">
            😭
          </span>
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          It seems like the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="mb-10 text-lg text-gray-600">
          Please double-check your request and try again. Or, you&apos;re
          welcome to check out my latest story:
        </p>

        <Link
          href={`/stories/${latest.slug}`}
          className="group w-full max-w-sm text-center"
        >
          <h3 className="mb-4 font-serif text-2xl font-bold group-hover:text-link transition-colors duration-200">
            {latest.title}
          </h3>
          <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={imagePath}
              alt={latest.caption}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">{latest.caption}</p>
        </Link>
      </div>
    </MainLayout>
  );
}
