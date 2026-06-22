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

## Email subscriptions

The site uses [Resend](https://resend.com) for email and [Cloudflare Workers](https://workers.cloudflare.com) for the subscribe endpoint and welcome email, with [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) for bot protection.

### Services to set up

1. **Resend** — create an account, verify your sending domain, create an audience, and create a segment within it. Note the audience ID and segment ID.
2. **Cloudflare** — create an account and create a Turnstile site (Managed type) for your domain. Note the site key and secret key.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `.env.local` + GitHub Actions secret | Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Worker secret | Turnstile secret key |
| `RESEND_API_KEY` (worker) | Cloudflare Worker secret | Resend API key with Full Access |
| `RESEND_SEGMENT_ID` | Cloudflare Worker secret + GitHub Actions secret | Resend segment ID |
| `RESEND_API_KEY` (broadcast) | GitHub Actions secret | Resend API key with Send Access |

### Cloudflare Worker

The subscribe worker lives in `workers/subscribe/`. Deploy it with:

```bash
npm run deploy:worker
```

Set worker secrets from the `workers/subscribe/` directory:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_SEGMENT_ID
npx wrangler secret put TURNSTILE_SECRET_KEY
```

### Email templates

Email templates live in `emails/`. Preview them locally with:

```bash
npm run dev:email
```

Templates are built with [React Email](https://react.email). After editing, sync them to Resend via the React Email dev server's built-in Resend integration (`npx react-email resend setup`).

### Newsletter broadcast

When a new story is published (a new `content/stories/*/meta.ts` is added in a merge to `main`), the `Send Newsletter` GitHub Actions workflow automatically sends a broadcast to your Resend segment. The workflow uses:

- `RESEND_API_KEY` — GitHub Actions secret
- `RESEND_SEGMENT_ID` — GitHub Actions secret

## Deploying

Deploys are automated via GitHub Actions. Merging to `main` triggers CI (lint, unit tests, E2E), and on success automatically builds and deploys to S3 + CloudFront.

To test a production build locally before merging:

```bash
NEXT_PUBLIC_BASE_URL='https://mattlane.us' npm run build && npx serve out -p 3001
```
