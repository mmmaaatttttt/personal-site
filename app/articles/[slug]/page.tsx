import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import MainLayout from "@/components/layout/MainLayout";
import { getArticle, ArticleFrontmatter, getArticleSlugs } from "@/utils/content";
import { MdxComponents } from "@/components/mdx/MdxComponents";
import Image from "next/image";
import { notFound } from "next/navigation";
import COLORS from "@/utils/styles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const { frontmatter } = getArticle(slug);
    return {
      title: `${frontmatter.title} | Matt Lane`,
      description: frontmatter.caption,
    };
  } catch (e) {
    return { title: "Article Not Found" };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article;
  try {
    article = getArticle(slug);
  } catch (e) {
    notFound();
  }

  const { frontmatter, source } = article;

  // 1. Strip import/export statements and legacy attribute syntax from MDX source
  // 1. Strip import/export statements and legacy attribute syntax from MDX source
  const cleanSource = source
    .replace(/^import\s+.*\s+from\s+['"].*['"];?\s*$/gm, "")
    .replace(/^export\s+.*\s*$/gm, "")
    .replace(/\{(\s*\.[a-zA-Z0-9_-]+\s*)+\}/g, "");


 // Strips attributes like {.w-80} or {.my-class}

  // 2. Data Resolution (Simplified for Phase 2)
  // We'll provide common data objects to the MDX scope.
  // In a real migration, we'd dynamically load the specific data file mentioned in the MDX.
  const scope = {
    COLORS,
    // Add other common data providers here if needed
  };

  const { content } = await compileMDX<{ title: string }>({
    source: cleanSource,
    components: MdxComponents,
    options: {
      parseFrontmatter: true,
      scope,
    },
  });

  const featuredImage = frontmatter.featured_image.replace(
    /^(\.\.\/)+images\//,
    "/images/"
  );

  return (
    <MainLayout outline={true}>
      <article className="mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
        <header className="mb-12">
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-[400px]">
            <Image
              src={featuredImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-light-gray px-3 py-1 text-xs font-medium italic text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-6xl">
            {frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600 italic">{frontmatter.caption}</p>
        </header>

        <div className="prose prose-lg max-w-none text-dark-gray">
          {content}
        </div>
      </article>
    </MainLayout>
  );
}
