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
| `warming-dots`                   | ✅ Complete   | Single `WarmingDots` component; 5 interactive D3 line charts via `SliderProvider` + ODE solver                                                                         |
| `gaming-relationships-linear`    | ✅ Complete   | `GamingRelationships` base + `LinearGamingRelationships` wrapper; diff eqs in `data.ts`; 3 ODE visualizations                                                         |
| `gaming-relationships-nonlinear` | ✅ Complete   | `NonlinearGamingRelationships` wrapper; shares base component; 4-body chaotic ODE at `idx=1` uses `step=0.02`, `max=40`                                                |
| `income-inequality`              | ✅ Complete   | `EconomySimulation` + `EconomyNodeGroup` (D3 force sim); collision/wealth logic in `data.ts`; 3 instances with `idx` and optional `editSavings` prop                   |
| `fairest-of-them-all`            | ✅ Complete   | `CoinFlipHistogram`, `CoinFlipTable`, `CoinFlipBayesianModel` (beta PDF inline, no jStat; framer-motion animation for curve/color), `RentDivision` (Sperner's Lemma triangle mesh; `ToggleSwitch`, `LabeledCircle`, `RadioButtonGroup`, `Polygon` as local leaf components) |
| `harvesting-wins`                | ✅ Complete   | `OrchardGame` (spinner + fruit tiles + localStorage), `OrchardGameSimulation` (rAF loop), `OrchardGameHeatData` (D3 heat map + sliders)                                |
| `mind-the-gerrymandered-gap`     | 🔄 In progress (G2 done) | G1: `IsoperimetricExplorer` + `data.ts`. G2: `SampleGerrymander` (flood-fill BFS, localStorage, `GerrymanderGrid` + `InteractiveGrid` + `DistrictStatus` sub-components), `EfficiencyGapTable` (wasted votes table), `GerrymanderPlayground` (shared-state wrapper replacing Redux). Remaining: `GerrymanderHistoricalMap`, MDX wiring. |
| `strength-in-numbers`            | ❌ Not started | Needs: `VotingBarChart`, `VotingLineChart`, `VotingMap`, `VotingPollWorkerAge`, `VotingTable`                                                                          |
| `keeping-distances`              | ❌ Not started | Largest: 8 components (`DistanceExplorer`, `ManhattanCircle/Paths`, `PAdicCalculator/FractalDistance/HeatChart`, `StringDistanceExplorer`, `FunctionDistanceExplorer`) |

✓ = already available as a shared component or simple wrapper

### Remaining migration: session plan

8 sessions across 3 stories. Sessions are sized to be completable in one sitting.

**`mind-the-gerrymandered-gap`**

| Session | Focus | Risk |
|---------|-------|------|
| G1 ✅ | `IsoperimetricExplorer` + `data.ts` | Done |
| G2 ✅ | `SampleGerrymander` (flood-fill, localStorage, interactive grid) + `EfficiencyGapTable` + shared-state wrapper replacing Redux | Done |
| G3 | `GerrymanderHistoricalMap` (USMap + BarGraph, dual sliders, election data) + MDX wiring + `meta.ts` + all tests | Medium |

Key architecture note: legacy code uses Redux to share `districtCounts` between `SampleGerrymander` and `EfficiencyGapTable`. Replace with a thin wrapper component that holds state and passes it as props to both.

**`strength-in-numbers`**

| Session | Focus | Risk |
|---------|-------|------|
| S1 | Load voting CSV into `data.ts` (groupBy state, compute averages) + `VotingTable` (sortable, slider-controlled rows) + `VotingPollWorkerAge` (pie chart, year/state selectors) | Low |
| S2 | `VotingBarChart` + `VotingLineChart` (framer-motion replaces `react-move/Animate`) + `VotingMap` (USMap, year slider, stat selector) + MDX wiring + `meta.ts` + all tests | Medium |

All five components share one CSV (`data/csv/voting_data_2008_2016.csv`).

**`keeping-distances`**

| Session | Focus | Risk |
|---------|-------|------|
| K1 | `DistanceExplorer` (draggable points, euclidean distance) + `ManhattanCircle` (taxicab geometry) + `ManhattanPaths` (all-shortest-paths, clickable grid). Port `useDragState` hook once, reuse. | Low |
| K2 | `PAdicCalculator` (p-adic math, LaTeX) + `StringDistanceExplorer` (Hamming, Levenshtein, Damerau-Levenshtein) + `FunctionDistanceExplorer` (draggable piecewise functions, L¹/L∞ toggle) | Low–Medium |
| K3 | `HeatChart` as story-local component + `PAdicHeatChart` (grid of p-adic distances, tooltip) + `PAdicFractalDistance` (level/prime sliders, animated point emergence — `react-move/NodeGroup` → framer-motion) + MDX wiring + `meta.ts` + all tests | High |

No external data — all components use on-the-fly math. `HeatChart` is story-local (not shared); `OrchardGameHeatData` has a similar local `HeatChart.tsx` as a reference for the pattern.

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
| `GamingRelationships`                                                                    | ODE-based relationship visualizer; takes `visData` (includes diff eq functions — not serializable), `caption`, `min/max/step`. Use a story-specific `"use client"` wrapper to expose only `idx` to MDX. |
| `Scatterplot`, `BarGraph`, `HorizontalBarGraph`, `MultiBarGraph`, `LinePlot`, `PieChart` | D3-backed chart components                                                                                                                                                                            |
| `USMap`                                                                                  | Choropleth US map with tooltip support                                                                                                                                                                |
| `Tooltip` / `useTooltip`                                                                 | Tooltip hook + component                                                                                                                                                                              |
| `Select`                                                                                 | Styled dropdown                                                                                                                                                                                       |
| `Axis`, `AxisLabel`, `ClippedSVG`                                                        | SVG utilities                                                                                                                                                                                         |
| `StyledTable`                                                                            | Styled table; accepts `headers`/`rows` (typed) or `data` (simple `string[][]` where first row is headers — use this for static tables)                                                               |

---

## Key Decisions & Conventions

### Pure helpers belong in their own file

Pure functions (math, algorithms, data transforms) must **never** live in the same file as a component. Extract them to a dedicated module (e.g. `floodFill.ts`, `mathHelpers.ts`) and test them there. This applies even when a function is only used by one component — co-locating logic inside a component file makes it untestable in isolation and obscures the component's responsibility. The rule is: if a function doesn't import React and doesn't touch the DOM, it goes in its own file.

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

The full legacy Gatsby implementation also lives in `src/_legacy_pages/`. This is the authoritative reference when there is any ambiguity about how a story or component was supposed to work:

- `src/_legacy_pages/articles/<slug>.mdx` — the original MDX for each story (Gatsby-style imports, frontmatter, etc.)
- `src/story_components/` — the shared legacy component library (the source of truth for any component that existed before the migration)
- `src/layouts/`, `src/templates/`, `src/utils/` — supporting legacy utilities

### Component decomposition

**One component per file — no exceptions.** Even small sub-components that are only used by one parent must live in their own file. If a file exports multiple components, split it before shipping.

A typical story component folder looks like:

```
components/OrchardGame/
  constants.ts          ← shared colors, initial values used by siblings
  FruitContainer.tsx    ← leaf component
  FruitContainer.test.tsx
  ScreenOverlay.tsx     ← leaf component
  ScreenOverlay.test.tsx
  Spinner.tsx           ← leaf component
  Spinner.test.tsx
  index.tsx             ← orchestrator: state + layout only, imports siblings
  OrchardGame.test.tsx  ← tests for the orchestrator
```

`constants.ts` is for values (colors, initial counts, magic strings) that are referenced by more than one sibling file. Do not define constants in `index.tsx` and import them into leaf files — that creates circular-ish coupling and is harder to read.

### Test coverage

**Every file that exports a component must have a co-located test file** — including `index.tsx` orchestrators. "I tested the leaves" is not sufficient; the orchestrator wires things together and that wiring needs tests too.

What to test:
- **Initial render**: the component mounts without crashing and the expected elements are present
- **User interactions**: clicks, selects, slider changes — assert the resulting state or DOM change
- **State transitions**: play → pause → reset, overlay hidden → shown, etc.
- **Props**: verify that optional/custom props (e.g. `fruitCounts`, `ravenCount`) are accepted without crashing
- **Persistence**: `localStorage` reads on mount and writes on interaction, clear behavior

What not to test: implementation details, internal state variable names, class names.

### jsdom mock patterns

These are required in specific situations — copy them exactly:

**`ResizeObserver` (any component that renders `ClippedSVG`):**
```ts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```
Place this at module scope (outside `describe`).

**`framer-motion animate()` (any component that calls `animate()` imperatively on user interaction):**
```ts
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});
```
Without this, clicking a button that triggers `animate()` will throw an async error in jsdom.

**Pointer-event drag (any component using `onPointerDown/Move/Up` + `setPointerCapture`):**
```ts
beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  SVGSVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
});
```
jsdom doesn't implement `setPointerCapture` or `getScreenCTM`. The identity CTM (`a=1, d=1, e=0, f=0`) means clientX/Y maps directly to SVG coordinates in tests.

**`localStorage` (any component that reads/writes localStorage):**
```ts
beforeEach(() => {
  localStorage.clear();
});
```
Without this, tests bleed state into each other.

**Color assertions (jsdom normalizes hex to rgb/rgba):**
jsdom converts `#rrggbbaa` hex values to `rgba(r, g, b, a)` format. Never assert an exact hex string — use:
```ts
expect(element).toHaveStyle({ backgroundColor: expect.stringMatching(/rgba?\(/) });
// or
expect(getComputedStyle(element).backgroundColor).toMatch(/rgba?\(/);
```

### Test location

Tests live co-located with components (`ComponentName.test.tsx` next to `index.tsx`). When importing from index files, omit the word "index" — always `import from "."` not `from "./index"`.

### Axis tick labels

`Graph` passes `tickFormatX` / `tickFormatY` to `Axis`. **When these props are absent (the default), all tick labels are suppressed** — only gridlines render. To show labels, pass an explicit d3 format string, e.g. `tickFormatX=","` or `tickFormatY=".1f"`. This matches the legacy behavior where an empty tickFormat silenced labels.

The contract: `undefined` = suppress labels; any string = format and show labels.

### CSS transitions on data-driven SVG

Never apply `transition-all` (or any position/geometry transition) to elements whose attributes change in response to data/slider updates. The `LinePlot` `<path d={...}>` is the canonical example — CSS path interpolation is undefined behavior and browsers animate it left-to-right, making the curve appear to "snap in" piecemeal. Same applies to anything driven by `percentage` (slider track width, thumb `left` position). Only use transitions on pure style properties like `color` or `opacity`.

### SliderProvider layout

`SliderProvider` wraps everything in a `NarrowContainer` (for <4 sliders) or `ColumnLayout` (≥4 sliders). `ColumnLayout` uses `React.Children.map` internally — **do not wrap its children in a Fragment** or they collapse into a single column. Pass `SliderGroup` and the render output as direct JSX siblings.

### LabeledSlider step default

`LabeledSlider` defaults `step` to `(max - min) / 100` when no step is provided, matching legacy behavior. Only set an explicit `step` in slider data when you need integer increments (e.g. `step: 1` for a carrying-capacity slider over `[1, 100]`). Float-range sliders (0–5, 0–10, etc.) should omit `step` and rely on this default.

### Legacy Gatsby syntax in MDX

When removing frontmatter from an MDX file, also scan for Gatsby-era attribute syntax like `{.classname}` on images (e.g. `![alt](img.png){.w-80}`). The Next.js MDX compiler (swc) parses `{...}` as a JSX expression and will throw a build error. Strip these attributes.

### MDX / server-client boundary

MDX files are server components. Any component used directly in MDX can only receive **serializable props** (strings, numbers, booleans, plain objects, arrays). Functions cannot cross this boundary — Next.js will throw at runtime, and TypeScript will not catch it.

If a component needs a function prop (e.g. `getTooltipData`), wrap it in a `"use client"` component that defines the function internally. The MDX calls the wrapper with only serializable props. `BaMultiBarGraph` is the reference example: it owns `generateTooltipData` and `colors` internally, and exposes only a `dataType` string to the MDX call site.

**ODE / diff-eq stories follow the same pattern.** The `visData` objects in gaming-relationships stories contain `diffEqs: DiffEq[]` (functions). The solution is a thin `"use client"` wrapper per story (e.g. `LinearGamingRelationships`) that imports its data file internally and accepts only a serializable `idx: number` from MDX. The base rendering component (`GamingRelationships` in `components/story/shared/`) receives the full `visData` object (functions included) — that's fine because the handoff stays entirely within client components.

### ODE solver error handling

`generateData` in `utils/mathHelpers.ts` wraps `s.solve(...)` in a try/catch. When the equations blow up (e.g. "maximum allowed steps exceeded"), the solver throws; the catch returns whatever data was collected before divergence. The chart renders as far as it got and simply stops — no crash, and visually correct (you can see the curve going unstable).

### D3 force simulation: rendering when stopped

D3's force simulation only calls the `tick` handler while running. When `playing=false`, `sim.stop()` halts ticking, so nodes exist in the simulation but are never painted. Fix: extract the render logic into a named `draw` function, store it in a `drawRef`, and call `drawRef.current?.()` after any node generation or reset that happens while the simulation is stopped. This ensures circles are visible before the user hits Start and immediately after Reset. See `EconomyNodeGroup.tsx` as the reference.

### Simulation + chart view: always mount both, CSS-toggle visibility

When a simulation has a "Show Chart" toggle, keep both the `<ClippedSVG>` (with the node group) and the `<BarGraph>` mounted at all times. Use `style={{ display: "none" }}` to hide the inactive view rather than conditional rendering. Unmounting the node group stops the simulation — collisions stop firing and the chart never updates. CSS toggle keeps the sim running so the chart reflects live collision data.

### `BarGraph` animated prop

`BarGraph` accepts `animated={false}` for use with live simulations. When false, bars use `motion.rect` with `initial={false}` and `transition={{ duration: 0.1 }}`: they appear instantly at their correct position on first render and animate in 100ms as they reorder — matching the legacy `react-move` NodeGroup behavior. The default (`animated={true}`) keeps the staggered entrance animation from the bottom used in static stories.

### Ambient module declarations for untyped packages

Untyped packages (`d3-force-bounce`, `d3-force-surface`) get hand-rolled ambient declarations in `types/mdx.d.ts` — no `@ts-ignore` on the imports. Put `import type` statements inside each `declare module` block (not at the top level of the file), otherwise the file becomes a module and the declarations stop being ambient. The exported function should be generic over `NodeDatum extends SimulationNodeDatum` so the same declaration works for any simulation node type.

### `ResponsiveIFrame` and legacy props

`ResponsiveIFrame` in `MdxComponents.tsx` uses a fixed `aspect-video` class and ignores the legacy `heightOverWidth` prop. Destructure it out before spreading the rest onto `<iframe>` to avoid the React DOM prop warning.

### Static table data belongs in `data.ts`

Story-specific `StyledTable` data (the `string[][]` arrays) lives in `content/stories/<slug>/data.ts` alongside strategies and other story data — not inline in the MDX. Export each table as a named `const` (e.g. `firstOrchardTable`, `orchardGameTable`), import it in the MDX, and pass it as `<StyledTable data={myTable} />`. See `dishing-on-petrie/data.ts` and `harvesting-wins/data.ts` for examples.

### Markdown tables do not render in MDX

The Next.js MDX compiler does not render GFM-style `| col | col |` tables. Always use `<StyledTable data={...} />` instead. There is no remark plugin wired up for table support.

### `FlexContainer` inline style overrides Tailwind margin utilities

`FlexContainer` applies `style={{ margin: "0" }}` by default, which wins over Tailwind `mt-*` / `mb-*` classes on the same element. To add spacing between items in a column `FlexContainer`, use `className="gap-N"` on the parent rather than margin utilities on the children.

### `polished` is not installed

The `polished` npm package (used in legacy components for `darken`, `lighten`, etc.) is not in the new stack. Inline the math directly: for darkening a hex color, bit-shift the RGB channels and multiply by `(1 - amount)`.

### `pie<string>()` for spinner/color-keyed pie charts

When using d3-shape `pie` to render a color-keyed wheel (e.g. the `Spinner` in `harvesting-wins`), pass `pie<string>().sort(null)` with an array of equal values. Use `ClippedSVG` directly rather than the shared `PieChart` component when you need to overlay additional SVG elements (like a rotating needle) — `PieChart` does not accept children.

### framer-motion `animate()` for imperative animations

For one-shot imperative animations (e.g. spinning a needle to a random angle), use framer-motion's `animate(from, to, { duration, ease, onUpdate, onComplete })`. The `ease` array `[0, 0.55, 0.45, 1]` approximates `easeQuadOut` from the legacy `d3-ease` usage in `react-move`.

### Never change defaults in shared components

**Do not change the default props of any shared component** (`BarGraph`, `Graph`, `Axis`, `LinePlot`, etc.). Story-specific behavior must be set explicitly at the call site. If a story needs non-standard behavior (e.g. no vertical gridlines, right-aligned labels), pass those values as explicit props — never make them the new default. Changing defaults silently breaks every other story that relies on the original behavior.

### React keys required when SVG children change position

When a component uses d3 to imperatively draw into a `ref`-attached DOM element (e.g. the `Axis` component and its `<g ref={axisRef}>`), and that element can move to a different position in the React children array across renders, **explicit `key` props are mandatory**. Without keys, React's positional reconciliation can hand the wrong DOM `<g>` to the wrong Axis instance — causing d3 to draw an x-axis into a `<g>` that was previously a y-axis (or vice versa), which produces visually diagonal gridlines. The fix is `key="y-axis"` and `key="x-axis"` on the respective `<Axis>` elements inside `Graph`. This is already in place; preserve it when editing `Graph`.

### `Graph` y-axis label position and paint order (`yLabelSide`, `yAxisOnTop`)

`Graph` supports two props for histogram-style layouts where y-axis labels would otherwise be hidden under bars:

- `yLabelSide="right"`: renders y-axis tick labels to the right of the axis line (inside the chart area) rather than the left. Use when left padding is too small for labels.
- `yAxisOnTop={true}`: renders the y-axis `<Axis>` after `{children}` in SVG paint order, so labels appear on top of bars. **Only use via `BarGraph`'s `yLabelSide="right"` prop** — BarGraph sets `yAxisOnTop` automatically when `yLabelSide="right"`. Never pass `yAxisOnTop` directly to `Graph` from a story component.

`BarGraph` passes `yAxisOnTop={yLabelSide === "right"}` to `Graph`. The defaults remain `yLabelSide="left"` and `yAxisOnTop=false`, matching all pre-existing stories.
