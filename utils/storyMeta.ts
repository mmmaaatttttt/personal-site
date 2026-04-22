import type { ArticleFrontmatter } from "@/utils/content";
import fourWeddings from "@/content/stories/four-weddings/meta";
import beautifulAnalysis from "@/content/stories/beautiful-analysis/meta";
import dishingOnPetrie from "@/content/stories/dishing-on-petrie/meta";
import warmingDots from "@/content/stories/warming-dots/meta";
import gamingRelationshipsLinear from "@/content/stories/gaming-relationships-linear/meta";
import gamingRelationshipsNonlinear from "@/content/stories/gaming-relationships-nonlinear/meta";
import incomeInequality from "@/content/stories/income-inequality/meta";
import harvestingWins from "@/content/stories/harvesting-wins/meta";
import fairestOfThemAll from "@/content/stories/fairest-of-them-all/meta";

/**
 * Typed metadata for ported stories. getArticle() checks here first;
 * non-ported stories fall back to gray-matter parsing of their MDX frontmatter.
 *
 * Add an entry here when porting a new story.
 */
export const storyMeta: Record<string, ArticleFrontmatter> = {
  "four-weddings": fourWeddings,
  "beautiful-analysis": beautifulAnalysis,
  "dishing-on-petrie": dishingOnPetrie,
  "warming-dots": warmingDots,
  "gaming-relationships-linear": gamingRelationshipsLinear,
  "gaming-relationships-nonlinear": gamingRelationshipsNonlinear,
  "income-inequality": incomeInequality,
  "harvesting-wins": harvestingWins,
  "fairest-of-them-all": fairestOfThemAll,
};
