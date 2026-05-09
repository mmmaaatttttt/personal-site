"use client";

import { type FC, useMemo, useState } from "react";
import type { CSSObjectWithLabel, MultiValue, SingleValue } from "react-select";
import Select from "react-select";
import StoryCard from "@/components/layout/StoryCard";
import type { ArticleMeta } from "@/utils/content";

const selectStyles = {
  control: (base: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
    ...base,
    borderColor: state.isFocused ? "var(--color-link)" : "var(--color-gray)",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-link)" : "none",
    "&:hover": { borderColor: "var(--color-link)" },
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
    color: state.isSelected ? "white" : "inherit",
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
    ":hover": { backgroundColor: "var(--color-dark-gray)", color: "white" },
  }),
  menu: (base: CSSObjectWithLabel) => ({ ...base, zIndex: 50 }),
};

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

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesYear = selectedYear
        ? new Date(article.date).getFullYear() === selectedYear
        : true;
      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) => article.tags.includes(tag))
          : true;
      return matchesYear && matchesTags;
    });
  }, [articles, selectedYear, selectedTags]);

  const yearOptions = useMemo<YearOption[]>(
    () => years.map((y) => ({ value: y, label: y.toString() })),
    [years],
  );
  const tagOptions = useMemo<TagOption[]>(
    () => tags.map((t) => ({ value: t, label: t })),
    [tags],
  );

  return (
    <div className="mx-auto w-full max-w-[var(--max-w-content)] px-4 sm:px-0 pt-10 pb-12">
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row font-sans text-sm">
        <div className="flex-1">
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
        <div className="flex-1">
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

      {/* Story cards — overflow-x-hidden prevents horizontal scroll during bounce animations */}
      <div className="overflow-x-hidden">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <StoryCard key={article.slug} {...article} index={index} />
          ))
        ) : (
          <p className="py-12 text-center font-sans text-gray-500">
            No stories match your filters. Try clearing some!
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticlesContent;
