---
name: capture-slides
description: Save photos of presentation slides to an event workspace, small but still legible, and give each one its own transcript and narrative, so a talk can be re-read slide by slide after the event. Use whenever someone photographs or screenshots a slide, says "save this slide", "capture the slides", "grab this deck", "write up my slides", or attaches a slide photo in chat while working an event; and whenever an event-hog workspace has slides waiting for notes. Encodes why a chat attachment can't be saved by a tool (use the capture link), legibility-adaptive sizing, verbatim transcription with roles, a shared slide-type vocabulary, one-sentence core messages, metrics as printed, claims to verify, alt text, commentary kept apart from transcription, and the session's running narrative.
---

# Capture Slides

> **Status: Draft (2026-10-27).** Built for event-hog at the 7x24 Exchange
> Fall Conference. Sizing comes from memopop's deck slimming; the notes
> format comes from memopop's slide stenographer and remake-deck's extraction
> prompt.

A photo of a slide is worth keeping only if it's still readable later and
someone can find it without scrolling through 200 photos. This skill handles
both: the image gets saved at the smallest size a human can still read, and
each slide gets notes that say what it is and what it claims.

## 1. Getting the image saved

**A photo attached in chat can be read, but no tool can save it.** Tool
arguments are text the model writes, and the model can't write out an
image's bytes. Don't pretend otherwise, and don't try to describe the image
into a file instead of saving it.

So:
1. Call `slide_capture_link` (pass the session if you know it). It returns
   the person's own camera page.
2. They open it on their phone, take or pick photos, and the page saves them.
   It's fine to bookmark or add to the home screen for the whole event.
3. If they also attached the photo in chat, you can start the notes from
   that right away, but still send the link so the image itself is kept.

**What the page does with each photo** (so you can explain it):
- Measures how much fine detail the slide has (text, tables, chart labels)
  and picks the smallest width that keeps it legible: 1280px for a sparse
  slide, 1600px for an ordinary one, 2048px for detailed ones, and 2400px for
  dense ones. JPEG quality is 82–85. A "dense slide" switch moves it up one
  step.
- Fixes rotation and strips the photo's metadata, including GPS location.
- Typical result: a 3–5 MB phone photo becomes 150–500 KB.
- Uploads the image to the deployment's **image host** and saves a notes
  file `slides/<session>/NN.md` marked *needs notes*, credited to whoever
  captured it. The notes carry the image's URL (`image_url`, and an inline
  `![Slide NN](…)`), so the repo stays text and any markdown viewer shows the
  slide.

**Image hosts.** `get_config` with `capture-slides` says which host this
deployment uses (`image_host`) and any others the person has
(`extra_image_hosts`, e.g. ImageKit). Slides always go to the deployment's
host automatically. Other hosts are for re-publishing: when a slide image goes
into a public post or site, an agent with file access (Claude Code, Codex) can
resize and upload it to that host with the person's own tooling and put that
URL in the draft. A chat-only agent can't upload anything itself; it uses the
URL already in the notes.

## 2. Writing the notes

When the person says they've captured slides (or a `slides` call shows some
marked *needs notes*):

1. `slides` with `needs_notes: true` to see what's waiting.
2. For each, `view_slide` to look at the image (paths are the `.md` notes files).
3. `save_slide_notes` with the fields below.

Do several in a row without asking between each. Report once at the end.

**What a finished slide file looks like:**

````markdown
---
title: "From 1990 Mainframes to 20MW of GPUs"
core_message: "The building's power and cooling, not floor space, capped the AI conversion."
slide_type: "how_it_works"
speaker: "Ari Chernikoff"
session: "Converting a 1990 enterprise data center to 20MW of AI workloads"
captured_by: "Michael Staton"
captured_at: "2026-10-27T15:02:11Z"
image_url: "https://…/media/…/03-….jpg"
…
---

# From 1990 Mainframes to 20MW of GPUs

> The building's power and cooling, not floor space, capped the AI conversion.

![…](https://…/media/…/03-….jpg)

## Layout

A left-to-right process flow: three equal boxes in one row joined by
arrows, under a full-width title. The third box is filled in the accent
color, so the eye lands on the outcome; the first two are outlined only.
A thin source line sits bottom-left. Generous whitespace above the row
makes the title the first read, then the flow left to right.

```text
+---------------------------------------------------------+
|  From 1990 Mainframes to 20MW of GPUs          (H1)     |
|                                                         |
|  [ 1990: 4MW ] ---> [ Retrofit ] ---> [## 20MW AI ##]   |
|   outline           outline           accent fill       |
|                                                         |
|  Source: …                                   (footnote) |
+---------------------------------------------------------+
```

## Content

**H1:** From 1990 Mainframes to 20MW of GPUs
**Box 1:** 1990: 4MW …
…

## Field notes

- 2026-10-27 10:02 CDT · Michael Staton: said 20MW is phase 2 not today
- 2026-10-27 10:15 CDT · Hursh Shah: ask him abt the PPA

## Metrics (as printed)
## Claims to verify
## Alt text
## Commentary (Michael Staton's read, not the slide's)
````

**The fields** (the rules are the point):

| Field | Rule |
|---|---|
| `title` | The slide's heading, verbatim. If it has none, a short descriptive one in `[brackets]`. Goes in the frontmatter and as the file's H1. |
| `core_message` | **One sentence, your words:** the single point this slide makes. Goes in the frontmatter and under the H1. |
| `layout` | **Read it like a layout designer.** Name the composition first (process flow, 1 row × 3 columns, 2×2 matrix, timeline, hub-and-spoke, chart with callout, title over full-bleed photo…). Then the grid and proportions, hierarchy and visual weight (what's biggest, boldest, colored), alignment and whitespace, how color and emphasis are used, and the reading path. Someone who never saw it should be able to rebuild it. |
| `layout_diagram` | **An ASCII sketch** of that layout: boxes, columns, arrows, labeled with the slide's real headings and noting emphasis (`accent fill`, `bold`). Plain ASCII only, no code fences; the tool adds them. Keep it under ~70 characters wide so it reads on a phone. |
| `transcript` | **The content, as accurately as possible**, in the slide's reading order. Every text element verbatim, labeled by role: **Kicker**, **H1**, **Sub**, **Body**, **List**, **Card N**, **Box N**, **Stat**, **Chart label**, **Axis**, **Legend**, **Footnote**, **Source**. Tables as markdown tables, chart series as label: value lines. Keep exact wording, capitalization, numbers, and typos. Never tidy, expand an abbreviation, or fix a spelling. Unreadable text is `[illegible]`, cut-off text is `[clipped]`; never complete it. |
| `transcription_fidelity` | `verbatim`, `partial` (some of it unreadable), or `illegible`. Phone photos at an angle are often `partial`; say so. |
| `slide_type` | One of: title, agenda, speaker_bio, divider, problem, data_chart, market_landscape, case_study, how_it_works, architecture, product, standards_regulation, roadmap, quote, takeaway, sponsor, contact, other. If none fits, coin a lower_snake_case type and explain it in `new_type_rationale`. Prefer a listed type; that's what makes "show me every data_chart slide" work. |
| `metrics` | Every claim number, `{ "label as printed": "value as printed" }`, units included. Numbers inside screenshots or decorative ones stay in the content only. |
| `claims_to_verify` | Factual assertions worth checking before anyone repeats them. |
| `alt` | One sentence for someone who can't see it, naming the numbers and people shown. |
| `commentary` | 2–4 sentences of **your judgment, kept apart from the content**: why it matters to our team, what's conspicuously missing, how strong the evidence is. |
| `field_notes` | Anything the person told you in chat about this slide (what was said while it was up, what they thought). **Exactly as typed**, never cleaned up. |
| `speaker`, `session` | Fill them if the capture didn't. Who took the photo is already recorded. |

**Field notes** are what the people in the room heard or thought while the
slide was up: *"said this number is 2027, not today"*. They're the raw
record, kept as typed (thumb typos included), credited and timestamped line
by line, and never rewritten. They come in three ways:
- the **note box on the capture page**, typed with the photo;
- **`field_notes` in `save_slide_notes`**, for what the person says in chat
  while you write the slide up;
- **`add_field_note`**, any time later, by anyone on the team.

Read the field notes before writing the commentary. They often change what a
slide means ("that chart is from 2023").

`save_slide_notes` fills an empty slide's notes. If notes already exist, it
adds yours as "another take" and never overwrites. The first notes on a slide
also add a line to the session's `README.md`, its running narrative, slide by
slide.

## 3. Then: starters

Slides are the richest input the starters skill gets. After writing a batch,
offer in one line:
- **Flash cards** for the vocabulary, standards, and acronyms on the slides
  (`save_flash_cards`, citing the slide path as `from`).
- **Post material**: a chart's number or a speaker's framing can go into an
  open draft with `add_to_draft`, attributed to the speaker and session. Slides
  shown in a public session are fair game; anything marked confidential on the
  slide isn't.

## Discipline

- **Transcribe, then judge, and keep them apart.** The content is what the
  slide says. Commentary is what we think. Never mix the two.
- **Never invent the unreadable.** A blurry number is `[illegible]`, not a
  guess.
- **Don't re-photograph the same slide in notes.** If two captures are the same
  slide, write notes for the clearer one and say so in the other's
  commentary.
- **Slides marked confidential or "do not distribute"**: transcribe them for the
  team, flag them in `claims_to_verify` or `commentary`, and never use them in
  post drafts.

## See also

- `parallel-content-generation-starters`: flash cards and post drafts from what the slides say
- `augment-speakers-panelists`: who the presenter is
- `remake-deck` (lossless-agent-skills): the full deck-extraction pipeline this borrows its transcription rules from
