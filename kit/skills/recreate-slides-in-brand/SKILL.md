---
name: recreate-slides-in-brand
description: Rebuild a slide photographed at an event as a clean slide in our own brand, credited to its source, so new ideas and concepts can go into our own presentations. Use right after a batch of captured slides is written up (ask whether any are worth it), and whenever someone says "recreate this slide", "put this in our brand", "I want this for our deck", "make our version of this chart", or "redo this in Edviro colors". Encodes picking the few slides worth it, rebuilding from the slide's Layout and Content notes, faithful versus integrated variants, exact numbers, the mandatory on-slide source credit, and self-contained HTML with no scripts.
---

# Recreate Slides in Our Brand

> **Status: Draft (2026-10-27).** Builds on `capture-slides` (its Layout and
> Content notes are the blueprint) and `maintain-design-system` (the brand).

Conferences hand you other people's best framings: a chart that makes the
case, a framework that names the problem. We want those ideas in our own
decks, in our own look, and **always credited**. This skill turns a
captured slide into a clean, branded slide that says where it came from.

## 1. When to offer

- **After a batch:** when the last slide in a session is written up, the
  server's reply cues you. Ask once, in one line, naming the 2–3 slides most
  worth recreating and why: a chart with strong numbers, a framework or
  diagram that names a problem we care about, a market map. Skip title,
  agenda, sponsor, and bio slides.
- **On request:** "recreate slide 4", "I want this for our deck".
- Don't recreate a slide marked confidential or "do not distribute" (check
  its notes and field notes).

## 2. Before building

1. `get_design_system` for the brand (default: the organization's). If there
   isn't one, follow `maintain-design-system` first, then come back.
2. `read_file` the slide's notes. The **Layout** section and its ASCII
   sketch are the blueprint; **Content** is the text; **Metrics** are the
   numbers; **Field notes** may change the meaning ("that's 2027, not
   today").
3. Decide the variant (default **faithful**):
   - **faithful:** same structure and content, our brand.
   - **integrated:** reworked for our narrative (our headline, their evidence).
     Only when the person asks, and say what you changed in `changes`.

## 3. Build the slide

One **self-contained HTML document**:
- **Canvas:** a 1920×1080 body (16:9), fixed size, `margin: 0`. Everything
  inside it.
- **Brand:** colors and type from the DESIGN.md frontmatter, as inline CSS.
  Load fonts only through a Google Fonts `<link>`; otherwise use the
  DESIGN.md's fallback stack. Put the logo where the DESIGN.md's Slides
  section says (default: top-right, about 48px high), from its URL.
- **No scripts,** no external CSS frameworks. The server rejects `<script>`
  and serves the page in a sandbox.
- **Rebuild the layout,** don't screenshot it: real text, CSS grid or flex,
  and charts redrawn as inline SVG or CSS bars from the exact numbers.
- **Numbers are exact.** Every number comes from the slide's Content or
  Metrics, unchanged, with its units and period. Never round, extrapolate,
  or "update" one. If a number was `[illegible]`, leave it out and say so.
- **Their words stay theirs.** A quote stays verbatim and attributed. In an
  integrated variant, our headline is ours, but their data and framing are
  labeled as theirs.
- **The source credit is mandatory and visible** on the slide itself,
  bottom-left, small but readable (at least 18px on the 1920 canvas):

  `Adapted from: <Speaker>, <Organization> · "<Session>" · <Event>, <Mon YYYY>`

  The server refuses a slide without a credit line. Link the original
  photo in the notes, not on the slide.

Then `save_recreated_slide` with the slide path, brand, HTML, variant, and
`changes`. It stores the HTML next to the slide, publishes it to a link,
and records it in the slide's notes under **Recreated in brand**.

## 4. Report

One line per slide with the link: *"Slide 04, Ari's 20MW conversion
flow, in Edviro's brand: <link>. Faithful; chart redrawn from his three
figures."* If something in the brand didn't work (logo on dark, a chart
color too loud), fix it in the DESIGN.md via `maintain-design-system`.

## Discipline

- **Attribution is not optional,** and it's on the slide, not just in the
  file. Presenting someone's framework as ours is the failure this skill
  exists to prevent.
- **Recreate few, well.** Two strong slides beat ten mediocre ones.
- **Don't fix their argument.** If a claim looks wrong, keep it as theirs
  and note it in `changes`; use `claims_to_verify` from the notes.

## See also

- `capture-slides`: where the Layout, Content, and Field notes come from
- `maintain-design-system`: the brand
- `parallel-content-generation-starters`: a recreated slide often anchors a blog post
