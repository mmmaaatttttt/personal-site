import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import MainLayout from "@/components/layout/MainLayout";
import { getArticle, ArticleFrontmatter, getArticleSlugs } from "@/utils/content";
import { MdxComponents } from "@/components/mdx/MdxComponents";
import Image from "next/image";
import { notFound } from "next/navigation";
import COLORS from "@/utils/styles";

// Beautiful Analysis Data
import baSummary from "@/content/stories/beautiful-analysis/data/ba-summary.json";
import baFeatures from "@/content/stories/beautiful-analysis/data/ba-features.json";
import baSentimentData from "@/content/stories/beautiful-analysis/data/ba-sentiment-examples.json";
import baSentimentCounts from "@/content/stories/beautiful-analysis/data/ba-sentiment-counts.json";
import baAllSentiment from "@/content/stories/beautiful-analysis/data/ba-all-sentiment.json";
import baProfanity from "@/content/stories/beautiful-analysis/data/ba-profanity.json";
import baCommonPhrases from "@/content/stories/beautiful-analysis/data/ba-common-phrases.json";
import baQuizData from "@/content/stories/beautiful-analysis/data/ba-quiz.json";
import {
  defaultSentimentOptions,
  generateTooltipData,
  colorMap,
} from "@/content/stories/beautiful-analysis/data/beautiful-analysis";

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

  // 2. Data Resolution (Story-specific)
  const scope: any = {
    COLORS,
  };

  if (slug === "beautiful-analysis") {
    Object.assign(scope, {
      baSummary,
      baFeatures,
      baSentimentData,
      baSentimentCounts,
      baAllSentiment,
      baProfanity,
      baCommonPhrases,
      baQuizData,
      defaultSentimentOptions,
      generateTooltipData,
      colorMap,
    });
  }

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

  const dateObj = new Date(frontmatter.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
          />
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mt-12 sm:mt-0">
             <h1 
               className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white leading-tight"
               style={{ WebkitTextStroke: "2px black", textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
             >
                {frontmatter.title}
             </h1>
             <h2 
               className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide"
               style={{ WebkitTextStroke: "1px black", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
             >
                {formattedDate}
             </h2>
          </div>
        </header>

        {/* Constrained Markdown Content */}
        <div className="relative mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
          <div className="prose prose-lg max-w-none text-[#1a1a1a] pb-20">
            {content}
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
