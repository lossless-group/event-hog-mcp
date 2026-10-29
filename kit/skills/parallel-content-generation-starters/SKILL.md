---
name: parallel-content-generation-starters
description: While someone works an event, turn their short, vague, thumb-typed notes on conversations, panels, and speakers into useful content alongside them, both anticipating (before a session or meeting) and reacting (right after they log something). The first content type is flash cards for acronyms, vocabulary, concepts, market standards, and anything that belongs in a reference list, saved to a shared deck the team can quiz from. The second is post drafts (tweets, threads, LinkedIn, blog posts) in the company voice for official pieces and the person's own voice for theirs, anticipated with [gaps] before a session and filled from notes after. Use whenever someone logs a contact, adds a note, saves a speaker profile, or shares an agenda or session; whenever they say "what's that?", "make flash cards", "quiz me", "what should I know before this panel?", or type a note with jargon or acronyms in it; and whenever an event-hog workspace is in use. Encodes reading vague notes against the event's context, answering the person first and generating after, never inventing what was said, sourced versus general-knowledge cards, and dedup against the shared deck.
---

# Parallel Content Generation: Starters

> **Status: Draft (2026-10-26).** Written for event-hog during the 7x24
> Exchange Fall Conference. Flash cards and post drafts are built; the
> other starters below save as notes until they earn their own tools.

At an event, people type with one thumb between conversations: *"ari legacy
— 20MW conv, ask abt PPA + N+1?"*. That note is the raw record, and it
matters. But it's also a signal of what the person is about to need: what
"N+1" means, a question for Ari's panel, a follow-up line. This skill
generates that alongside them, so they keep their attention on the room.

**Starters** are small, ready-to-use pieces of content, offered in parallel
with the person's own work, not instead of it.

## 0. The rules that come before any content

1. **Answer the person first.** Log the contact, save the note, finish what
   they asked. Starters come after, in two or three lines at most, and never
   delay or replace the logging.
2. **Never invent what was said.** A starter can expand a term, suggest a
   question, or draft a follow-up. It never adds facts about the
   conversation that the note doesn't contain. "Ari wants a PPA" is not in
   "ask abt PPA".
3. **Read vague notes against the event, not in a vacuum.** Before
   interpreting a note, use what the workspace already knows: the event brief,
   the prep map, the speaker profile, earlier notes on the same person. "2N"
   at a data-center conference is redundancy, not a chemistry formula.
4. **When a note is ambiguous, guess once and say so.** "Reading 'PPA' as a
   power purchase agreement" lets the person correct you in one word. Don't
   interrogate them.
5. **Small and frequent beats large and late.** Three cards now are worth
   more than thirty at the end of the day, when nobody remembers why they
   mattered.

## 1. When to fire

| Moment | Mode | What to generate |
|---|---|---|
| Someone shares an agenda, session, or speaker card | **Anticipate** | Cards for the session's likely vocabulary; two or three questions to ask |
| Before a meeting with a known person | **Anticipate** | Cards for terms in their company's work; an opening line from the prep map |
| `log_contact` with a jargon-heavy note | **React** | Cards for each unfamiliar term; a follow-up line if the note implies one |
| `add_note` on a session or panel | **React** | Cards for its vocabulary and standards mentioned |
| Notes typed **during a live session** | **React, live** | A live post quoting or paraphrasing the speaker, with their @ handle and a specific compliment; nuggets queued for a tweetstorm. See `references/live-posting.md` |
| `save_speaker_profile` | **React** | Cards for terms in their features and talks |
| "Quiz me", end of a block, waiting in line | **Review** | Quiz from the deck, newest and most-seen first |

**Parallel, where the app allows it.** In Claude Code or Codex, starters can
run as a background or sub-agent task while the main thread keeps logging. In
Claude Desktop and mobile, do the logging, then generate starters in the same
reply, briefly. Either way the person never waits on a starter.

## 2. Flash cards

**What earns a card:** something a smart newcomer to this industry would
need explained, that came up *here*.

| Category | Examples (data centers and energy) |
|---|---|
| `acronym` | PUE, UPS, PDU, PPA, BESS, CDU, MW vs MWh |
| `vocabulary` | white space, hyperscaler, colo, behind-the-meter, stranded power |
| `concept` | N+1 vs 2N redundancy, liquid vs air cooling, interconnection queue |
| `standard` | Uptime Tier III/IV, ASHRAE TC 9.9, NFPA 70E, TIA-942 |
| `reference` | named entities worth recalling: key operators, utilities, programs |

**Not a card:** anything everyone already knows ("AI", "data center"),
people (those are contacts or speaker profiles), and anything sensitive from
a conversation.

**Each card has:**
- **Front:** the term as people say it, plus its expansion for an acronym.
- **Back:** one or two plain sentences. What it is, and why it matters to
  this audience. No textbook paragraphs.
- **Why it came up:** one line naming the note, session, or person.
- **Confidence:** `sourced` when you retrieved a source (give the URL), or
  `general-knowledge` when it's from the model. General-knowledge cards are
  flagged in the deck for checking. **Standards and numbers** (Tier
  definitions, ASHRAE ranges, code sections) should be sourced whenever a
  research tool is available. Get the tools from `get_config` the same way
  `augment-speakers-panelists` does.
- **Related:** other terms that deserve a card, to suggest next.

**Saving (event-hog):**
1. Call `flash_cards` with a `query` first if you're unsure whether the deck
   already has it.
2. Call `save_flash_cards` with all the new cards from this moment in one
   call. It writes one file per card under `flash-cards/`, matches existing
   cards on term, expansion, or alias, and for a repeat adds a "seen again"
   line instead of a duplicate. It never overwrites a definition; a
   different one is kept as "another take".
3. Tell the person in one line: *"3 cards added: PUE, 2N, PPA. Say 'quiz
   me' anytime."*

**Without event-hog:** keep a `flash-cards.md` in the person's notes, one
`## Term` per card with the same fields.

**Quizzing:** show the front, wait, then the back. Prefer cards that came up
most often and most recently. Mark the ones the person missed and quiz those
again later. For spaced repetition outside chat, `flash_cards` with
`format: "csv"` gives a Front,Back file for Anki or Quizlet.

## 3. Post drafts: tweets, threads, LinkedIn, blog posts

Events are content. The best posts come from noticing an angle **before** the
session, then filling it with what was actually said.

**Voice, from `get_config` with this skill's name:**

| Kind | Default voice | Why |
|---|---|---|
| `blog` | **company** | Official, long-form, speaks for the organization |
| `linkedin`, `thread`, `tweet` | **personal** | The person, posting as themselves |

`company_voice` (organization level) and `personal_voice` (per person) each
give a tone, do's, don'ts, and sometimes examples. Follow them closely; when
`examples` exist, match their rhythm. A person can ask for the other voice
for any draft. Never blend the two: a company claim doesn't belong in a
personal post, and a personal joke doesn't belong on the company blog.

**Anticipate** (an agenda, session, or speaker card arrives):
- 1–2 **angles** for the session: the hook, why this audience cares, and
  `[gaps]` for what the speaker will actually say: `[his constraint]`,
  `[the number he gives for X]`.
- For a big session, a **thread outline** (3–5 beats) or a **blog skeleton**
  (working title, the question it answers, sections, which sessions should
  feed each section).
- Save each with `save_draft`, status `angle` or `outline`.

**React** (notes come in):
- Check `drafts` for open drafts this note feeds. Add quotes, numbers, and
  observations with `add_to_draft` (`mode: material`, with `section` and
  `from`).
- When the gaps can be filled, write a full new version with
  `add_to_draft` (`mode: version`). Every filled gap must trace to a note.
- A blog post grows across the whole event. After the event, assemble it
  into a version and set status `draft`.

**Live sessions.** When someone is typing notes in a talk or panel, load
`references/live-posting.md` (`get_skill` with `file`). It covers the
speaker's real handle (never guessed), quote versus paraphrase, the
one-line compliment, follow-up posts, and tweetstorms numbered 1/N … N/N.
For tweets and threads, send `posts` as an array; the server numbers them
and counts characters.

**Rules for posts:**
- **Never put words in anyone's mouth.** Quotes and numbers come only from
  notes or published sources, attributed. An unfilled gap stays `[visible]`.
- **Discretion** (the organization's `discretion` list): public sessions are
  fair game with attribution; hallway conversations are private unless the
  note says shareable; never reveal who the team is courting.
- **Nothing gets posted.** A person reviews and moves a draft to `ready`, and
  posts it themselves. `posted` is set only on their word.
- **Offer, don't flood.** One line: *"2 post angles saved for Ari's panel,
  one personal, one for the blog."*

## 4. Other starters (save with `add_note` until they get tools)

| Starter | When | Shape |
|---|---|---|
| **Questions to ask** | Before a session, or a meeting with a known person | 2–3 questions tied to their stated topic and our interests |
| **Follow-up line** | A logged conversation implies a next step | One or two sentences the person can paste into an email or LinkedIn message, written from the note only |
| **Session recap** | After a panel note | Five bullets: claims made, numbers cited, who said what, open questions |
| **Who to find next** | After a conversation names other people or companies | Matches from the prep map and contacts |

Use `add_note` with `kind` set to `idea` (questions, who to find),
`todo` (follow-ups), or `session` (recaps). Mark each one as a draft.

## See also

- `augment-speakers-panelists`: speaker profiles, the richest source of cards
- `event-prep`: the prep map these starters read against
