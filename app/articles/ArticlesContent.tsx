"use client";

import React, { useState, useMemo } from "react";
import StoryCard from "@/components/layout/StoryCard";
import { ArticleMeta } from "@/utils/content";
import { Search, X } from "lucide-react";

interface ArticlesContentProps {
  articles: ArticleMeta[];
  years: number[];
  tags: string[];
}

const ArticlesContent: React.FC<ArticlesContentProps> = ({
  articles,
  years,
  tags,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesYear = selectedYear
        ? new Date(article.date).getFullYear() === selectedYear
        : true;
      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) => article.tags.includes(tag))
          : true;
      const matchesSearch =
        searchQuery.length > 0
          ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.caption.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
      return matchesYear && matchesTags && matchesSearch;
    });
  }, [articles, selectedYear, selectedTags, searchQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
      <div className="mb-12 flex flex-col gap-8">
        <h1 className="text-4xl font-bold tracking-tight">Stories</h1>

        <div className="border-gray bg-nav/50 flex flex-col gap-6 rounded-xl border p-6 backdrop-blur-sm">
          {/* Search */}
          <div className="relative">
            <Search
              className="text-gray absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray focus:border-link focus:ring-link w-full rounded-lg border bg-white py-2 pr-4 pl-10 focus:ring-1 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Year Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray text-xs font-semibold tracking-wider uppercase">
                Year:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    selectedYear === null
                      ? "bg-link text-white"
                      : "border-gray hover:border-link border bg-white"
                  }`}
                >
                  All
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      selectedYear === year
                        ? "bg-link text-white"
                        : "border-gray hover:border-link border bg-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-gray text-xs font-semibold tracking-wider uppercase">
              Tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-link text-white"
                      : "border-gray hover:border-link border bg-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Clear */}
          {(selectedYear || selectedTags.length > 0 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedYear(null);
                setSelectedTags([]);
                setSearchQuery("");
              }}
              className="text-link flex w-fit items-center gap-1 text-xs font-medium hover:underline"
            >
              <X size={14} />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="fade-in">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <StoryCard key={article.slug} {...article} />
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              No stories match your filters. Try clearing some!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesContent;
