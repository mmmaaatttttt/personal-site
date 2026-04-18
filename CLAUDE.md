# Personal Site — Agent Context

## What This Is

Matt's personal/blog site, actively being migrated from a legacy Gatsby/JavaScript stack to Next.js + TypeScript + React. The site hosts long-form "stories" — articles with embedded interactives and D3 visualizations.

**Active branch:** `next-upgrade-ftw`  
**Main branch:** `master`

---

## Migration Pattern

### How MDX stories work

Stories are `.mdx` files in `content/stories/<slug>/index.mdx`. They are compiled at build time by `@next/mdx` (with `experimental.mdxRs: true`) and rendered via a module map in `app/stories/[slug]/page.tsx`.

MDX files are real modules — `import` statements work normally and are resolved by webpack/Turbopack at build time. This means components can be imported directly in the MDX file, and all JSX props (strings, numbers, expressions) work exactly as they do in `.tsx` files.

### Wiring a ported story

Three steps:

**1. Create `meta.ts`** in `content/stories/<slug>/meta.ts`:

```ts
import type { ArticleFrontmatter } from "@/utils/content";

const meta: ArticleFrontmatter = {
  title: "...",
  date: "YYYY-MM-DD",
  featured_image: "../../images/featured_images/foo.jpg",
  caption: "...",
  featured_image_caption: "...",
  tags: ["..."],
};

export default meta;
```

**2. Register it** in `utils/storyMeta.ts`:

```ts
import myStory from "@/content/stories/my-story/meta";

export const storyMeta = {
  "my-story": myStory,
  // existing entries...
};
```

**3. Add the story to the module map** in `app/stories/[slug]/page.tsx`:

```ts
const storyModules = {
  "my-story": () => import("@/content/stories/my-story/index.mdx"),
  // existing entries...
};
```

That's it. Story-specific components are imported directly in the MDX file — no registration in `MdxComponents.tsx` needed.

### Story frontmatter

Ported stories keep metadata in a typed `meta.ts` file (see above) — **not** in the MDX file. The `getArticle()` utility checks `storyMeta` first and falls back to gray-matter parsing of MDX frontmatter for non-ported stories.

Non-ported MDX files still have YAML frontmatter at the top — leave it there so gray-matter can read it.

### Story-level data files

If a story has static data (e.g. table contents, chart data), put it in `content/stories/<slug>/data.ts` and import it in the MDX:

```mdx
import { myTableData } from "./data";

<StyledTable data={myTableData} />
```

### Global components (no import needed in MDX)

The following shared utilities are registered globally in `components/mdx/MdxComponents.tsx` and are available in any MDX file without importing:

`Sidebar`, `ResponsiveIFrame`, `Latex`, `ColoredSpan`, `NarrowContainer`, `StyledTable`, `CaptionWrapper`, `HorizontalBarGraph`, `MultiBarGraph`, `Legend`, `SliderProvider`, `RelativeContainer`, `Strikethrough`

If a new shared component is added here it will be available in all stories automatically.

### Non-ported stories

Stories not yet in the module map display a "Coming soon" message. Their MDX files contain legacy Gatsby-style imports (e.g. `from "story_components"`, `from "data/..."`) that don't resolve in Next.js — do **not** add them to the module map until those imports are fixed and the components are ported.

### What "done" means for a story

- All custom interactive components ported from `content/stories/<slug>/components/` (Legacy JS → TypeScript)
- `meta.ts` created and registered in `utils/storyMeta.ts`
- Frontmatter removed from `index.mdx` (it lives in `meta.ts` now)
- Components imported directly in the story's `index.mdx`
- Story slug added to `storyModules` in `app/stories/[slug]/page.tsx`
- `tsc --noEmit` passes with no new errors
- Component-level tests exist and pass (`vitest run`)

---

## Story Status

| Story                            | Status        | Notes                                                                                                                                                                  |
| -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `four-weddings`                  | ✅ Complete   | SelectableHistogram, PieChart, Scatterplot, USMap                                                                                                                      |
| `beautiful-analysis`             | ✅ Complete   | Podcast sentiments, quiz, multi-bar graphs, etc.                                                                                                                       |
| `dishing-on-petrie`              | ✅ Complete   | HarassmentSimulation (D3 physics sim, 3 instances with `idx` prop); static tables via `StyledTable data={...}` with data in `data.ts`                                  |
| `warming-dots`                   | ❌ Not started | Single `WarmingDots` component                                                                                                                                         |
| `gaming-relationships-linear`    | ❌ Not started | Needs: `GamingRelationships`, `Sidebar`✓, `ResponsiveIFrame`✓, `Latex`✓                                                                                                |
| `gaming-relationships-nonlinear` | ❌ Not started | Needs: `GamingRelationships` (same component as linear)                                                                                                                |
| `income-inequality`              | ❌ Not started | Needs: `EconomySimulation`, `Sidebar`✓                                                                                                                                 |
| `fairest-of-them-all`            | ❌ Not started | Needs: `CoinFlipBayesianModel`, `CoinFlipHistogram`, `CoinFlipTable`, `RentDivision`                                                                                   |
| `harvesting-wins`                | ❌ Not started | Needs: `OrchardGame`, `OrchardGameHeatData`, `OrchardGameSimulation`                                                                                                   |
| `mind-the-gerrymandered-gap`     | ❌ Not started | Needs: `EfficiencyGapTable`, `GerrymanderHistoricalMap`, `IsoperimetricExplorer`, `SampleGerrymander`, `ResponsiveIFrame`✓                                             |
| `strength-in-numbers`            | ❌ Not started | Needs: `VotingBarChart`, `VotingLineChart`, `VotingMap`, `VotingPollWorkerAge`, `VotingTable`                                                                          |
| `keeping-distances`              | ❌ Not started | Largest: 8 components (`DistanceExplorer`, `ManhattanCircle/Paths`, `PAdicCalculator/FractalDistance/HeatChart`, `StringDistanceExplorer`, `FunctionDistanceExplorer`) |

✓ = already available as a shared component or simple wrapper

---

## Available Shared Components

All in `components/story/shared/`:

| Component                                                                                | Notes                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sidebar`                                                                                | Margin note, `direction="left"\|"right"`. Uses `position: absolute` anchored to nearest `relative` ancestor. The content wrapper in `app/stories/[slug]/page.tsx` has `relative` set for this reason. |
| `ClippedSVG`                                                                             | Responsive SVG wrapper with clip path; takes `id`, `width`, `height`, `padding`                                                                                                                       |
| `FlexContainer`                                                                          | Flex layout helper with `column`, `main`, `cross`, `shouldWrap` props                                                                                                                                 |
| `NarrowContainer`                                                                        | Width-constrained div, `width` as string, `fullWidthAt` breakpoint                                                                                                                                    |
| `SliderGroup`                                                                            | Renders an array of labeled sliders; takes `data: SliderData[]`                                                                                                                                       |
| `HorizontalBar`                                                                          | Animated proportional bar chart; takes `data: { size, color, tooltipText }[]`                                                                                                                         |
| `Legend`, `Caption`, `ColoredSpan`                                                       | Simple presentational                                                                                                                                                                                 |
| `Scatterplot`, `BarGraph`, `HorizontalBarGraph`, `MultiBarGraph`, `LinePlot`, `PieChart` | D3-backed chart components                                                                                                                                                                            |
| `USMap`                                                                                  | Choropleth US map with tooltip support                                                                                                                                                                |
| `Tooltip` / `useTooltip`                                                                 | Tooltip hook + component                                                                                                                                                                              |
| `Select`                                                                                 | Styled dropdown                                                                                                                                                                                       |
| `Axis`, `AxisLabel`, `ClippedSVG`                                                        | SVG utilities                                                                                                                                                                                         |
| `StyledTable`                                                                            | Styled table; accepts `headers`/`rows` (typed) or `data` (simple `string[][]` where first row is headers — use this for static tables)                                                               |

---

## Key Decisions & Conventions

### TypeScript errors in test fixtures

Test files use intentionally minimal mock data that doesn't satisfy complete `WeddingData[]` (or similar) types. The correct fix is `as unknown as WeddingData[]` at the declaration — do NOT fill in all the missing fields. This is established convention.

Mock option accessors must match the actual type contract (e.g., `PieOption.accessor` must return `number[]`, not `{ label, value }[]`).

### Unused parameters in tests

Prefix with `_` (e.g., `(_: number) => 'red'`).

### `"use client"` directive

Any component using hooks, refs, event handlers, or framer-motion must have `"use client"` at the top. The `HarassmentNodeGroup` component (D3 + `useRef`) is a good reference.

### No server component shells needed

With `@next/mdx`, you can import a `"use client"` component directly from MDX and all props flow correctly. The old pattern of a thin server wrapper (`index.tsx`) importing a `"use client"` inner component is no longer needed — put everything in one file with `"use client"` at the top.

### Legacy component location

Legacy JavaScript source for each story lives alongside the MDX in `content/stories/<slug>/components/`. These are the reference implementations when porting. The ported TypeScript versions live in the same directory.

### Test location

Tests live co-located with components (e.g., `ComponentName.test.tsx` next to `index.tsx`). When importing from index files, remember that the word "index" is not necessary (for example, always import from "." instead of "./index").
