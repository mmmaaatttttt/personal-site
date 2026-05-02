"use client";

import { Search } from "lucide-react";
import { type FC, useMemo, useState } from "react";
import type { CSSObjectWithLabel, MultiValue, SingleValue } from "react-select";
import Select from "react-select";
import StoryCard from "@/components/layout/StoryCard";
import type { ArticleMeta } from "@/utils/content";

type YearOption = { value: number; label: string };
type TagOption = { value: string; label: string };

interface ArticlesContentProps {
  articles: ArticleMeta[];
  years: number[];
  tags: string[];
}

const ArticlesContent: FC<ArticlesContentProps> = ({
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

  const yearOptions: YearOption[] = years.map((y) => ({
    value: y,
    label: y.toString(),
  }));
  const tagOptions: TagOption[] = tags.map((t) => ({ value: t, label: t }));

  const selectStyles = {
    control: (base: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "var(--color-link)" : "var(--color-gray)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--color-link)" : "none",
      padding: "2px",
      "&:hover": {
        borderColor: "var(--color-link)",
      },
    }),
    option: (
      base: CSSObjectWithLabel,
      state: { isSelected: boolean; isFocused: boolean },
    ) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--color-dark-gray)"
        : state.isFocused
          ? "var(--color-light-gray)"
          : "white",
      color:
        state.isSelected || state.isFocused
          ? "var(--color-dark-gray)"
          : "inherit",
      cursor: "pointer",
    }),
    multiValue: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: "var(--color-gray)",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base: CSSObjectWithLabel) => ({
      ...base,
      color: "white",
      fontWeight: 500,
      fontSize: "0.75rem",
    }),
    multiValueRemove: (base: CSSObjectWithLabel) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "var(--color-dark-gray)",
        color: "white",
      },
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      zIndex: 50,
    }),
  };

  return (
    <div className="mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0">
      <div className="mb-12 flex flex-col gap-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          Stories
        </h1>

        <div className="relative z-20 border-gray bg-nav/50 flex flex-col gap-6 rounded-xl border p-6 backdrop-blur-sm">
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
              className="border-gray focus:border-link focus:ring-link w-full rounded-lg border bg-white py-2 pr-4 pl-10 focus:ring-1 focus:outline-none placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Year Filter */}
            <div className="flex-1 text-sm font-sans">
              <Select
                options={yearOptions}
                isClearable
                placeholder="Filter by year..."
                value={
                  selectedYear
                    ? { value: selectedYear, label: selectedYear.toString() }
                    : null
                }
                onChange={(option: SingleValue<YearOption>) =>
                  setSelectedYear(option ? option.value : null)
                }
                styles={selectStyles}
              />
            </div>

            {/* Tag Filter */}
            <div className="flex-1 text-sm font-sans">
              <Select
                options={tagOptions}
                isMulti
                isClearable
                placeholder="Filter by tag..."
                value={selectedTags.map((t) => ({ value: t, label: t }))}
                onChange={(options: MultiValue<TagOption>) =>
                  setSelectedTags(options ? options.map((o) => o.value) : [])
                }
                styles={selectStyles}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fade-in relative z-10">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <StoryCard key={article.slug} {...article} />
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="font-sans text-gray-500">
              No stories match your filters. Try clearing some!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesContent;
