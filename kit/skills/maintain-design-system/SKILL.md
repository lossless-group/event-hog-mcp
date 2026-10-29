---
name: maintain-design-system
description: Keep a company's design system (a DESIGN.md in Google Stitch's open spec, with colors, typography, spacing, components, logo, and do's and don'ts) where every agent on the team can read it, and draft one from the company's own website when none exists. Use before recreating slides or making anything "in our brand"; whenever someone says "our colors", "our fonts", "make it look like us", "brand guidelines", "design system", or "DESIGN.md"; and whenever get_design_system says a brand has none. Encodes evidence-first drafting (the site's real CSS, never invented values), the Stitch section order, confirming with the person before saving, and refining over time.
---

# Maintain a Design System

> **Status: Draft (2026-10-27).** The event-hog version of the
> `maintain-design-md` skill in lossless-agent-skills, which owns the spec
> details. This one adds where brands live in event-hog and how to draft
> one from a website when there's no codebase to read.

Anything made "in our brand" (a recreated slide, a one-pager, a social
card) needs the brand written down: exact colors, fonts, logo, and the
rules. That's a `DESIGN.md`. Agents read it instead of guessing.

## Where it lives

- event-hog: `get_design_system` (omit `brand` for the organization's
  default). Brands are stored in the kit at `brand/<name>/DESIGN.md`, with
  git history.
- The kit's config (`maintain-design-system`) names the `default_brand` and
  each brand's `company_url`.

## When there's no DESIGN.md yet

1. **Gather evidence, don't invent.** Call `extract_brand` with the company
   URL. It reads the homepage and its stylesheets on the server and returns
   CSS variables, colors by frequency, fonts, font stylesheets (Google Fonts
   and others), logo candidates, theme color, and og:image. If the chat can
   browse, also look at one or two inner pages (product, about) for
   components the homepage doesn't show.
2. **Interpret the evidence:**
   - **Primary and accent:** the named CSS variables first (`--primary`,
     `--brand`, `--accent`), then the most frequent saturated color. Grays and
     near-whites are surfaces and text, not brand colors.
   - **Fonts:** the families loaded from a font service or `@font-face`, then
     the most frequent `font-family`. Note which is used for headings vs body
     if the CSS shows it. Note whether each font is on Google Fonts, since
     a recreated slide can only load fonts it can link to.
   - **Logo:** prefer an SVG or a transparent PNG from the logo candidates.
     Record its URL. Favicons are a last resort.
   - **Voice and feel:** from the page's own words and density (plain or
     playful, dense or spacious). One or two sentences.
3. **Draft the DESIGN.md** in Stitch's shape (see `maintain-design-md` for
   the full spec): YAML frontmatter with `version: alpha`, `name`,
   `description`, `colors` (at least `primary`, plus `on-primary`,
   `surface`, `on-surface`, `accent` where the site shows them), `typography`
   (`headline`, `body`, `label` with family, size, weight), `rounded`,
   `spacing`, and an off-spec `logo:` block (`url`, `on_dark_url` if there's
   one, `min_height_px`). Then the sections in order: Overview, Colors,
   Typography, Layout, Elevation & Depth, Shapes, Components, Do's and
   Don'ts. Add a **## Slides** section before Do's and Don'ts: the slide
   canvas (16:9, 1920×1080), margins, title size, where the logo and the
   source credit sit.
4. **Mark what's inferred.** At the top, under the title:
   `> Drafted from <url> on <date> by reading its CSS. Values marked
   (inferred) weren't explicit on the site; confirm with the brand owner.`
5. **Show the person the key choices** (primary color, fonts, logo) in a
   few lines, and save only after they say it's right:
   `save_design_system`.

## Keeping it current

- **Real brand guidelines beat the website.** If someone shares a brand PDF or
  a Figma link, update the DESIGN.md from it and drop the "(inferred)" marks
  it settles.
- **Every recreated slide is a test.** If something looked wrong (logo too
  small on dark, a color too loud for charts), add a line to Do's and
  Don'ts and save. The next recreation inherits the fix.
- **Never silently change a brand color.** Say what changed and why in the
  `why` of `save_design_system`.

## See also

- `recreate-slides-in-brand`: the main consumer
- `maintain-design-md` (lossless-agent-skills): the full Stitch spec and drift rules
