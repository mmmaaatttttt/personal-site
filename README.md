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

### Visual regression tests (Playwright)

Screenshot-based tests for four pages: home, about, stories list, and beautiful-analysis. Baselines are local only (gitignored) — they must be established after a fresh clone.

```bash
# First time on a fresh clone — establish local baselines
npm run test:e2e -- --update-snapshots

# Check for regressions
npm run test:e2e

# Intentionally accept a formatting change and update baselines
npm run test:e2e -- --update-snapshots
```

Tests require a running dev server. If none is running on port 3000, Playwright starts one automatically. These tests are not wired into CI — run them locally before pushing formatting changes.

## Deploying

```bash
npm run deploy -- --distribution_id=<cloudfront-id>
```

Builds, uploads to S3, and invalidates the CloudFront cache.
