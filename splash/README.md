# event-hog splash

The GitHub Pages site for event-hog-mcp:
**https://lossless-group.github.io/event-hog-mcp/**

It's laid out like a conference: a lanyard badge in the hero, what event-hog
does as the program, the three ways to run it as passes, and the workspace as
a floor plan. Light mode is the show floor, dark is after hours, vibrant is
the keynote.

## Local dev

```bash
cd splash
pnpm install --ignore-workspace
pnpm dev            # http://localhost:4321/event-hog-mcp/
pnpm build && pnpm preview   # to try search; the index is built at build time
```

## Deploy

Push to `main`. `.github/workflows/pages.yml` builds `splash/` and deploys it
with GitHub Pages (source: GitHub Actions). It runs only when `splash/`,
`changelog/` or `context-v/` changes.

## Where the content lives

| What | Where |
|---|---|
| The program (what event-hog does) | `src/content/program/*.md`, one file per session. `status: partial` with a `status_note` shows an "In progress" stamp |
| Hero, lost & found, passes, floor plan, fine print | `src/pages/index.astro` (arrays at the top) |
| Changelog pages | `../changelog/*.md` |
| Context pages | `../context-v/**/*.md`. Files with `publish: false` are skipped |
| Titles and descriptions | `src/lib/seo.ts` |
| Share image | `public/og/event-hog__Share-Banner.jpg`, a 1200×630 screenshot of the hero |

Keep the fine print in step with the README's "What the server guarantees"
section. If one changes, change the other.

## Isolation from the server

The splash is separate from the Worker: the root `tsconfig.json` only
includes `src/`, `wrangler.jsonc` bundles only `src/index.ts`, and
`splash/package.json` is `private`.

## Type

Big Shoulders Display (signage), Atkinson Hyperlegible Next (body), Martian
Mono (badge numbers and tool names), from Google Fonts.
