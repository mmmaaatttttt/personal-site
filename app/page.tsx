import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { SITE_URL } from "@/lib/constants";

import placeholders from "@/lib/imagePlaceholders.json";
import { getLatestStory } from "@/utils/content";
import { normalizeImagePath } from "@/utils/stringHelpers";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Matt Lane",
  url: SITE_URL,
};

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default async function Home() {
  const latestStory = await getLatestStory();
  const imagePath = normalizeImagePath(latestStory.featured_image);
  const blurDataURL = (placeholders as Record<string, string>)[imagePath];

  return (
    <MainLayout>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <div className="flex-1 flex flex-col items-center justify-evenly text-center opacity-0 animate-[fade-in_2s_ease-out_0.5s_forwards]">
        <h1 className="font-serif text-[5rem] font-black leading-none">Hi!</h1>
        <h2 className="font-serif text-4xl font-bold leading-tight opacity-0 animate-[fade-in_1s_ease-out_1s_forwards]">
          I&apos;m Matt.{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="max-w-md opacity-0 animate-[fade-in_1s_ease-out_1.5s_forwards]">
          Use the nav bar to explore the site. You&apos;ll figure it out.
        </p>
        <div className="opacity-0 animate-[fade-in_1s_ease-out_2s_forwards]">
          <p className="text-sm mb-3">
            If you like, you can check out my latest story:
          </p>
          <Link
            href={`/stories/${latestStory.slug}`}
            className="group flex flex-col items-center gap-2 max-w-xs mx-auto"
          >
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <Image
                src={imagePath}
                alt={latestStory.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
              />
            </div>
            <span className="font-serif font-bold text-lg group-hover:text-link transition-colors duration-200">
              {latestStory.title}
            </span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
