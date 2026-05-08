import Image from "next/image";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import MainLayout from "@/components/layout/MainLayout";
import placeholders from "@/lib/imagePlaceholders.json";
import { getArticle, getArticleSlugs } from "@/utils/content";
import { normalizeImagePath } from "@/utils/stringHelpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Stories that have been ported to TypeScript with working imports.
// Add a story here once its components are fully ported.
const storyModules: Record<
  string,
  () => Promise<{ default: ComponentType<Record<string, unknown>> }>
> = {
  "beautiful-analysis": () =>
    import("@/content/stories/beautiful-analysis/index.mdx"),
  "dishing-on-petrie": () =>
    import("@/content/stories/dishing-on-petrie/index.mdx"),
  "four-weddings": () => import("@/content/stories/four-weddings/index.mdx"),
  "warming-dots": () => import("@/content/stories/warming-dots/index.mdx"),
  "gaming-relationships-linear": () =>
    import("@/content/stories/gaming-relationships-linear/index.mdx"),
  "gaming-relationships-nonlinear": () =>
    import("@/content/stories/gaming-relationships-nonlinear/index.mdx"),
  "income-inequality": () =>
    import("@/content/stories/income-inequality/index.mdx"),
  "harvesting-wins": () =>
    import("@/content/stories/harvesting-wins/index.mdx"),
  "fairest-of-them-all": () =>
    import("@/content/stories/fairest-of-them-all/index.mdx"),
  "mind-the-gerrymandered-gap": () =>
    import("@/content/stories/mind-the-gerrymandered-gap/index.mdx"),
  "strength-in-numbers": () =>
    import("@/content/stories/strength-in-numbers/index.mdx"),
  "keeping-distances": () =>
    import("@/content/stories/keeping-distances/index.mdx"),
};

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const { frontmatter } = getArticle(slug);
    return {
      title: `${frontmatter.title} | Matt Lane`,
      description: frontmatter.caption,
    };
  } catch (_e) {
    return { title: "Article Not Found" };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article: ReturnType<typeof getArticle> | undefined;
  try {
    article = getArticle(slug);
  } catch (_e) {
    notFound();
  }

  const { frontmatter } = article;

  const featuredImage = normalizeImagePath(frontmatter.featured_image);
  const blurDataURL = (placeholders as Record<string, string>)[featuredImage];

  const dateObj = new Date(frontmatter.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const storyModule = storyModules[slug];
  const StoryContent = storyModule ? (await storyModule()).default : null;

  return (
    <MainLayout outline={true}>
      <article className="w-full">
        {/* Full Bleed Hero Header */}
        <header className="relative w-full h-[60vh] sm:h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-12 sm:mb-16">
          <Image
            src={featuredImage}
            alt={frontmatter.title}
            fill
            className="object-cover z-0"
            priority
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
          />
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mt-12 sm:mt-0">
            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white leading-tight"
              style={{
                textShadow:
                  "3px 3px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000",
              }}
            >
              {frontmatter.title}
            </h1>
            <h2
              className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide"
              style={{
                textShadow:
                  "2px 2px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000",
              }}
            >
              {formattedDate}
            </h2>
          </div>
        </header>

        {/* Constrained Markdown Content */}
        <div className="relative mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
          <div className="prose prose-lg max-w-none text-[#1a1a1a] pb-20">
            {StoryContent ? (
              <StoryContent />
            ) : (
              <div className="py-24 text-center text-gray-500">
                <p className="text-xl font-semibold mb-2">Coming soon</p>
                <p className="text-sm">
                  This story&apos;s interactive components are still being
                  modernized.
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
