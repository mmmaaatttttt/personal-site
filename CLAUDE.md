# Personal Site — Agent Context

## What This Is

Matt's personal/blog site. The Gatsby/JavaScript → Next.js + TypeScript + React migration is complete — all 12 stories are ported and live. The site hosts long-form "stories" — articles with embedded interactives and D3 visualizations.

**Active branch:** `next-upgrade-ftw`  
**Main branch:** `master`

---

## Visual Regression Tests

Playwright screenshot tests cover four pages: home, about, stories list, and beautiful-analysis (`e2e/*.spec.ts`). Baselines are gitignored and live only on the local machine.

**Run after any change that touches CSS, layout components, or shared MDX components:**

```bash
npm run test:e2e
```

**NEVER run `--update-snapshots` without explicit user consent.** Always run the tests normally first and show the diff to the user. Only update baselines after the user confirms the visual changes are correct.

If the user confirms the diff is correct, update the baselines:

```bash
npm run test:e2e -- --update-snapshots
```

Do not skip this step when making formatting changes. If the tests weren't run before a formatting session starts, ask the user before establishing fresh baselines (`--update-snapshots`), then make changes, then run normally to catch regressions.

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
| `fairest-of-them-all`            | ✅ Complete   | `CoinFlipHistogram`, `CoinFlipTable`, `CoinFlipBayesianModel` (beta PDF inline, no jStat; framer-motion animation for curve/color; `ToggleSwitch` now in shared), `RentDivision` (Sperner's Lemma triangle mesh; `LabeledCircle`, `RadioButtonGroup`, `Polygon` as local leaf components) |
| `harvesting-wins`                | ✅ Complete   | `OrchardGame` (spinner + fruit tiles + localStorage), `OrchardGameSimulation` (rAF loop), `OrchardGameHeatData` (D3 heat map + sliders)                                |
| `mind-the-gerrymandered-gap`     | ✅ Complete   | `IsoperimetricExplorer` + `data.ts`; `SampleGerrymander` (flood-fill BFS, localStorage, `GerrymanderGrid` + `InteractiveGrid` + `DistrictStatus`), `EfficiencyGapTable`, `GerrymanderPlayground` (shared-state wrapper replacing Redux); `GerrymanderHistoricalMap` (USMap + BarGraph, dual sliders, election data) |
| `strength-in-numbers`            | ✅ Complete   | `VotingTable`, `VotingPollWorkerAge`, `VotingBarChart` (voters/party variants), `VotingLineChart` (voters/workers), `VotingMap` (voters/workers); variant prop replaces function props across MDX boundary; `motion.circle` unavailable in framer-motion v12 jsdom — use plain `<circle>` |
| `keeping-distances`              | ✅ Complete   | K1: `DistanceExplorer` (+ `useDragState`), `ManhattanCircle`, `ManhattanPaths`. K2: `StringDistanceExplorer`, `FunctionDistanceExplorer`, `PAdicCalculator`. K3: `PAdicHeatChart` (p-adic distance grid), `PAdicFractalDistance` (`react-move/NodeGroup` → framer-motion `AnimatePresence`); `HeatChart` promoted to shared. `DraggableCircle` + `ToggleSwitch` + `Latex` promoted to shared. |

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
| `DraggableCircle`                                                                        | Pointer-event draggable SVG circle; props: `id`, `cx`, `cy`, `r` (default 8), `fill`, `stroke?`, `strokeWidth?`, `onDrag(id, {x,y})`. Reports SVG-pixel coords. Grows by 4px on hover/drag (CSS `r` transition). To clamp so the circle edge never leaves the SVG, wrap `onDrag` in the story and pre-clamp coords to `[2r, W−2r] × [2r, H−2r]`. |
| `HeatChart`                                                                              | Generic 2D heat map; props: `data: (T\|null)[][]`, `accessor`, `getTooltipBody(d,x,y)`, `colorDomain`, `colorRange`, `xAxisLabel`, `yAxisLabel`, `axes?` (default `true`), `paddingScale?` (default `0.075`). Pass `axes={false}` and a small `paddingScale` (e.g. `0.02`) when tick marks would be misleading. |
| `StyledTable`                                                                            | Styled table; accepts `headers`/`rows` (typed) or `data` (simple `string[][]` where first row is headers — use this for static tables)                                                               |
| `ToggleSwitch`                                                                           | Two-label toggle; props: `leftText`, `rightText`, `leftColor`, `rightColor`, `handleSwitchChange(checked: boolean)`. Manages its own checked state internally.                                        |
| `Latex`                                                                                  | Renders a LaTeX string via katex; props: `str`, `displayMode?` (default false). Requires `katex` in deps. Mock `katex` and `katex/dist/katex.min.css` in test files that import it.                  |

---

## Key Decisions & Conventions

### Identifying shared vs story-local components

Before writing any new component, check two places:

1. **Other stories' `components/` folders** — if the component already exists in a ported story (e.g. `fairest-of-them-all/components/CoinFlipBayesianModel/`), promote it to `components/story/shared/` rather than duplicating it.
2. **`src/story_components/atoms/` and `src/story_components/molecules/`** — these are the original shared library from the Gatsby stack. Any component that lived there is a strong candidate for `components/story/shared/` in the new stack.

**Decision rule:** if a component is used in 2+ stories — even if currently local to one — promote it to shared before shipping. The cost of the cross-story duplication compounds quickly.

When promoting a component to shared:
- Move the source file to `components/story/shared/<ComponentName>/index.tsx`
- Move or recreate its test at `components/story/shared/<ComponentName>/<ComponentName>.test.tsx` with `import from "."`
- Update all story imports to the new shared path
- Delete the old local copies

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

### CSV line endings

Strip Windows line endings before parsing any CSV loaded with `fs.readFileSync`:

```ts
const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
```

Without this, rows end with `\r` and header-column index lookups (`indexOf('column_name')`) silently return `-1`, producing `NaN` for every value in that column.

### Choropleth color scales

`USMap` choropleth scales use `COLORS.WHITE` (`#ffffff`) as the minimum color — not a lightened/tinted variant of the target color. A scale like `[COLORS.WHITE, COLORS.ORANGE]` matches production. If states look darker than expected, the minimum color is wrong.

### `Graph` y-axis label position and paint order (`yLabelSide`, `yAxisOnTop`)

`Graph` supports two props for histogram-style layouts where y-axis labels would otherwise be hidden under bars:

- `yLabelSide="right"`: renders y-axis tick labels to the right of the axis line (inside the chart area) rather than the left. Use when left padding is too small for labels.
- `yAxisOnTop={true}`: renders the y-axis `<Axis>` after `{children}` in SVG paint order, so labels appear on top of bars. **Only use via `BarGraph`'s `yLabelSide="right"` prop** — BarGraph sets `yAxisOnTop` automatically when `yLabelSide="right"`. Never pass `yAxisOnTop` directly to `Graph` from a story component.

`BarGraph` passes `yAxisOnTop={yLabelSide === "right"}` to `Graph`. The defaults remain `yLabelSide="left"` and `yAxisOnTop=false`, matching all pre-existing stories.

### Draggable SVG elements: use pointer events, not `cx.baseVal.value`

`DraggableCircle` is a shared component at `components/story/shared/DraggableCircle/`. It uses `onPointerDown/Move/Up` with `setPointerCapture` and `getScreenCTM` to convert mouse coords to SVG space, calling `onDrag(id, { x, y })` with SVG-pixel coordinates. The `useDragState` hook in `keeping-distances/components/DistanceExplorer/useDragState.ts` receives these SVG-pixel coords and converts to data space via `xScale.invert`/`yScale.invert`.

For click handlers on SVG grid points, **close over the data coordinate** in the JSX rather than reading `e.currentTarget.cx.baseVal.value`. This is simpler and testable without mocks:

```tsx
// ✅ close over pt directly
onClick={() => { setActivePoint({ x: pt.x, y: pt.y }); }}

// ❌ reads SVG geometry — fragile in tests
onClick={(e) => setActivePoint({ x: xScale.invert(e.currentTarget.cx.baseVal.value), ... })}
```

### Slider `NaN%` when `min === max`

The `Slider` component computes `percentage = ((value - min) / (max - min)) * 100`. When `min === max` (e.g. a path explorer where only one path exists), this produces `NaN`, and jsdom throws a css-tree SyntaxError when it tries to parse `width: NaN%`. Avoid tests that put the slider in this state — click on grid points that produce at least 2 paths.

### JSX string attributes do not process backslash escapes

In a JSX attribute written as a string literal, backslashes are **not** treated as escape sequences — the characters are passed literally. This matters for LaTeX strings:

```tsx
// ❌ passes the two-character sequence \\ to the prop
<Latex str="\\frac{1}{2}" />

// ✅ JS string in {} — \\ becomes a single backslash → passes \frac{1}{2}
<Latex str={"\\frac{1}{2}"} />
```

Always use curly-brace JS expressions when passing strings that contain backslashes (LaTeX, regex, escape codes).

### NarrowContainer widths inside Caption (breakout scaling)

`Caption` always applies the breakout (up to `w-[130%]` at large viewports), matching the legacy `CaptionWrapper` behavior. `NarrowContainer` and `SliderProvider` widths are percentages of the Caption container, **not** the prose column. Size them for the breakout width, not for prose width.

Rule of thumb: to match a target size that is X% of prose width, use `X / 1.3 ≈ X * 0.77%` as the NarrowContainer/SliderProvider width. For example, a component that should occupy ~75% of prose width gets `width="58%"` (58% × 130% ≈ 75%).

If you add a breakout to Caption for a new story and the interactives look too wide, **do not add a `bleed` opt-in prop** — instead reduce the internal NarrowContainer widths by ÷1.3. That was tried and reverted; the global behavior is intentional.

### Axis tick labels suppressed by default; suppress in tests by querying fill

`Axis` (and therefore `Graph`) suppresses all tick labels when no `tickFormat` is passed — text elements exist in the DOM but have empty `textContent`. When testing that a specific SVG `<text>` contains a value (e.g. a distance label), **do not** use `document.querySelector("text")` as it may return an empty axis tick text first. Instead query by attribute:

```ts
const label = document.querySelector('text[fill="#ff8f34"]');
```
