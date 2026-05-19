import Image from "next/image";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import BlueskyIcon from "@/components/icons/BlueskyIcon";
import MainLayout from "@/components/layout/MainLayout";
import StoryCard from "@/components/layout/StoryCard";
import placeholders from "@/lib/imagePlaceholders.json";
import { getArticle, getArticleSlugs, jaccardDistance } from "@/utils/content";
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

  const relatedArticles = getArticleSlugs()
    .filter((s) => s !== slug)
    .map((s) => {
      const { frontmatter: fm } = getArticle(s);
      const date = new Date(fm.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      return {
        ...fm,
        date,
        slug: s,
        distance: jaccardDistance(fm.tags, frontmatter.tags),
      };
    })
    .filter((a) => a.distance < 1)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  const githubUrl = `https://github.com/mmmaaatttttt/personal-site/blob/master/content/stories/${slug}/index.mdx`;

  return (
    <MainLayout outline={true}>
      <article className="w-full">
        {/* Full Bleed Hero Header */}
        <header className="relative w-full h-[60vh] sm:h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-0">
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

          <div className="relative z-10 max-w-5xl mt-12 sm:mt-0 hero-title-fade">
            <h1
              className="font-serif text-3xl sm:text-4xl md:text-[46px] font-bold text-white leading-tight"
              style={{
                textShadow:
                  "3px 3px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000",
              }}
            >
              {frontmatter.title}
            </h1>
            <h2
              className="mt-4 font-serif text-lg sm:text-xl font-bold text-white tracking-wide"
              style={{
                textShadow:
                  "2px 2px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000",
              }}
            >
              {formattedDate}
            </h2>
          </div>
        </header>

        {/* Featured image caption */}
        {frontmatter.featured_image_caption && (
          <small className="flex justify-end mt-0 mb-12 px-2 italic text-[#7d7d7d]">
            {frontmatter.featured_image_caption}
          </small>
        )}

        {/* Constrained Markdown Content */}
        <div className="relative mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
          <div className="prose max-w-none text-[#1a1a1a] pb-4">
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
          <div className="flex justify-between items-center pb-12 not-prose">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm italic text-link hover:opacity-80"
            >
              Edit this story on GitHub
            </a>
            <a
              href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${frontmatter.title} https://mattlane.us/stories/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-link hover:opacity-80 text-sm"
            >
              <BlueskyIcon size={20} />
              Post this story on Bluesky
            </a>
          </div>
          {relatedArticles.length > 0 && (
            <div className="not-prose pb-20">
              <h3 className="font-serif text-xl font-bold mb-4">
                Here are some other stories you may like:
              </h3>
              {relatedArticles.map((a, i) => (
                <StoryCard
                  key={a.slug}
                  caption={a.caption}
                  date={a.date}
                  featured_image={a.featured_image}
                  slug={a.slug}
                  tags={a.tags ? [...a.tags].sort() : []}
                  title={a.title}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </MainLayout>
  );
}
