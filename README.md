# mattlane.us

Matt Lane's personal site. Built with Next.js, TypeScript, Tailwind CSS, and MDX. Hosts long-form interactive stories with embedded D3 visualizations.

## Development

```bash
npm run dev      # start dev server (also runs image optimizer)
npm run build    # production build
npm run lint     # biome check
```

## Testing

### Unit tests (Vitest + React Testing Library)

```bash
npm test           # run once
npm run test:watch # watch mode
```

Component tests live colocated with their source files (`*.test.tsx`).

### Visual regression tests (Playwright + Percy)

Playwright drives the browser; Percy captures and diffs snapshots in the cloud. All story pages are covered.

```bash
# Check for regressions (also runs in CI)
npm run test:e2e

# Intentionally accept visual changes — only after confirming the diff is correct in Percy
npm run test:e2e -- --update-snapshots
```

Tests spin up a production build on port 3001 automatically. Percy uploads snapshots on every run when `PERCY_TOKEN` is set.

Local Playwright snapshots (`.spec.ts-snapshots/`) are gitignored and must be established after a fresh clone:

```bash
npm run test:e2e -- --update-snapshots
```

## Deploying

Deploys are automated via GitHub Actions. Merging to `main` triggers CI (lint, unit tests, E2E), and on success automatically builds and deploys to S3 + CloudFront.

To test a production build locally before merging:

```bash
NEXT_PUBLIC_BASE_URL='https://mattlane.us' npm run build && npx serve out -p 3001
```
