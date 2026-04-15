# Personal Site — Agent Context

## What This Is

Matt's personal/blog site, actively being migrated from a legacy Gatsby/JavaScript stack to Next.js + TypeScript + React. The site hosts long-form "stories" — articles with embedded interactives and D3 visualizations.

**Active branch:** `next-upgrade-ftw`  
**Main branch:** `master`

---

## Migration Pattern

### How MDX stories work

Stories are `.mdx` files in `content/stories/<slug>/index.mdx`. They are compiled server-side via `next-mdx-remote/rsc` in `app/stories/[slug]/page.tsx`.

**Critical:** The page strips all `import` and `export` statements from MDX source before compilation:

```ts
const cleanSource = source
  .replace(/^import\s+.*\s+from\s+['"].*['"];?\s*$/gm, "")
  .replace(/^export\s+.*\s*$/gm, "");
```

This means MDX components **cannot use local imports** — they must be provided via `MdxComponents`. Any `import` in an MDX file is only there as legacy documentation; it is silently stripped at runtime.

### Wiring an interactive component

Two steps in `components/mdx/MdxComponents.tsx`:

1. Add a dynamic import near the top (grouped with story peers):

```ts
// Dishing on Petrie components
const HarassmentSimulation = dynamic(
  () =>
    import("@/content/stories/dishing-on-petrie/components/HarassmentSimulation"),
);
```

2. Add an override in the `MdxComponents` export (this overrides the placeholder in `story_components`):

```ts
HarassmentSimulation: (props: any) => <HarassmentSimulation {...props} />,
```

All unported components degrade to a `<Placeholder name="..." />` UI — they render but show a "arriving in Phase 3" message. This means any story can be visited without crashing; you're just replacing placeholders with real components.

### What "done" means for a story

- All custom interactive components ported from `content/stories/<slug>/components/` (Legacy JS → TypeScript)
- Components wired in `MdxComponents.tsx` via dynamic import
- `tsc --noEmit` passes with no new errors
- Component-level tests exist and pass (`vitest run`)

---

## Story Status

| Story                            | Status         | Notes                                                                                                                                                                  |
| -------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `four-weddings`                  | ✅ Complete    | SelectableHistogram, PieChart, Scatterplot, USMap                                                                                                                      |
| `beautiful-analysis`             | ✅ Complete    | Podcast sentiments, quiz, multi-bar graphs, etc.                                                                                                                       |
| `dishing-on-petrie`              | In progress   | HarassmentSimulation (D3 physics sim, 3 instances with `idx` prop) - this component has some lingering issues                                                                                                     |
| `warming-dots`                   | ❌ Not started   | Single `WarmingDots` component                                                                                                                                         |
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
| `Axis`, `AxisLabel`, `ClippedSVG`, `ClippedSVG`                                          | SVG utilities                                                                                                                                                                                         |

Also available as pass-throughs in `MdxComponents` (no custom component needed):

- `ResponsiveIFrame` — renders a responsive iframe wrapper
- `Latex` — renders inline italic text (visual approximation)

---

## Key Decisions & Conventions

### TypeScript errors in test fixtures

Test files use intentionally minimal mock data that doesn't satisfy complete `WeddingData[]` (or similar) types. The correct fix is `as unknown as WeddingData[]` at the declaration — do NOT fill in all the missing fields. This is established convention.

Mock option accessors must match the actual type contract (e.g., `PieOption.accessor` must return `number[]`, not `{ label, value }[]`).

### Unused parameters in tests

Prefix with `_` (e.g., `(_: number) => 'red'`).

### Dynamic imports

All interactive components must use `next/dynamic` — they use browser APIs (D3, canvas, etc.) and can't be statically imported in an RSC context.

### `"use client"` directive

Any component using hooks, refs, event handlers, or framer-motion must have `"use client"` at the top. The `HarassmentNodeGroup` component (D3 + `useRef`) is a good reference.

### Legacy component location

Legacy JavaScript source for each story lives alongside the MDX in `content/stories/<slug>/components/`. These are the reference implementations when porting. The ported TypeScript versions live in the same directory.

### Test location

Tests live co-located with components (e.g., `ComponentName.test.tsx` next to `index.tsx`). When importing from index files, remember that the word "index" is not necessary (for example, always import from "." instead of "./index").
