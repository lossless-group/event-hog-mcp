# Live posting: live tweets, follow-ups, and tweetstorms

> Part of `parallel-content-generation-starters`. Load with
> `get_skill name=parallel-content-generation-starters file=references/live-posting.md`
> when someone is taking notes in a live session (a talk or a panel).

When someone is in a session typing notes, the best posts are the ones
ready the moment the speaker lands a point. This file covers three shapes:
the **live post** (during), the **follow-up** (after), and the
**tweetstorm** (when there are many nuggets).

## 0. Before the session: get the mention right

- Check for the speaker's profile (`read_file speakers/…` or `search`). If
  there isn't one and there's time, run `augment-speakers-panelists` first.
- `save_draft` with `speaker` set looks up their **X handle** from that
  profile and reports it. **Use only that handle.** If none is on file, name
  them in plain text ("Ari Chernikoff of Legacy Investing"). Never guess a
  handle from the name; a wrong @ tags a stranger.
- Same for their **organization**: its X handle and LinkedIn company page
  come from the profile's Organization section. Posts tag both when it fits
  ("@speaker of @org").
- LinkedIn can't be tagged from a link: in a LinkedIn post you type `@` and
  the name, then pick from the list. So the draft records both LinkedIn URLs
  (to open and check the right person and page) and the exact names to type.
- `save_draft` with `speaker` reports all four: speaker X and LinkedIn,
  organization X and LinkedIn, or says which aren't on file.
- Anticipate: draft 1–2 **angles** for the session (see the main skill), so
  live posts have somewhere to land.

## 1. Quote or paraphrase

| | When | How it looks |
|---|---|---|
| **Direct quote** | Only when the person's note or a field note has the **exact words**, usually in quotation marks or marked "quote" | `"The building did not get a vote." —@handle on 1990s data centers meeting 2026 GPU density` |
| **Paraphrase** | Everything else, which is most notes | `@handle's point: power, not floor space, capped the conversion.` |

- **Never put quotation marks around a paraphrase.** If the note says
  *"ari: power not space was the limit"*, that's a paraphrase, not a quote.
- **Attribute every borrowed idea:** "@handle on X", "per @handle", "@handle's
  point".
- **Numbers exactly as the note has them.** If the note is vague ("like
  20-ish MW"), keep it vague or leave it out.

## 2. The compliment

One line that tells the speaker something specific landed. It's the reason
they'll reshare it.

- **Specific beats generic.** Not "great talk!", but what was great: "The
  cleanest explanation of N+1 vs 2N I've heard from a stage."
- **Creative and succinct:** a turn of phrase, a callback to their own words, a
  one-line metaphor. In the person's voice (`personal_voice` in
  `get_config`): for Michael, rhythm and a little wit, aimed at the
  industry, never at the speaker.
- **Earned, not inflated.** No "legendary", "game-changing", "mind-blowing".
  If nothing specific landed, skip the compliment rather than fake one.

## 3. Shapes

**Live post (during the session).** One post, under 280 characters:
point + attribution + optional compliment + event tag. Fast to approve.

```
@handle on retrofitting a 1990 mainframe hall for AI:
power, not floor space, was the wall.

Best before/after slide of the day. #7x24Exchange
```

**Follow-up (after the session).** One post or a short LinkedIn post: thanks
+ the key point + why it matters to us, in one or two sentences. Mention
them again. On LinkedIn, longer is fine (and tag by name).

**Tweetstorm.** When the notes have **4 or more distinct nuggets**, plan a
thread instead of many single posts:

- **1/N is the hook:** the session, the speaker (@ mention), and why
  anyone should read on. It must stand alone; most people only see 1/N.
- **Middle posts: one nugget each**, quote or paraphrase, attributed.
  Each readable on its own.
- **Last post:** our takeaway plus the compliment, and a thank-you.
- **5–8 posts is the sweet spot.** More nuggets than that: pick the best.
- **Send `posts` as an array, unnumbered.** The server adds `1/8` … `8/8`
  and counts characters (links count as 23), and flags any over 280.
  Tighten flagged posts before showing the person.
- **Build it as the session goes:** each new nugget goes into the open
  thread draft with `add_to_draft` (`mode: material`, `section: "nugget"`,
  `from`: the note). When the session ends, assemble the thread with
  `add_to_draft` with `posts` (it becomes a new version).

## 4. Where the person sees it

The event-hog draft is the shared record. What the person **looks at** while
the session runs depends on the app:

- **Claude (desktop, web, mobile) with artifacts:** keep **one HTML
  artifact per session**, titled *Live posts: <session>*. Create it with the
  first live post and **update the same artifact** as the session goes, never
  a new one per nugget. Every post is its own card:
  - the post text exactly as it will be sent (numbering included);
  - its character count, red when over 280;
  - a **Copy** button that copies that one post
    (`navigator.clipboard.writeText`, falling back to selecting the text
    so a long-press copies it on a phone);
  - a **Post on X** link: `https://x.com/intent/post?text=` plus the
    URL-encoded post, opening in a new tab. It opens X with the post filled
    in.

  Lay the page out top to bottom:
  0. **Tag strip**, pinned at the top, for the speaker and for their
     organization:
     - **LinkedIn:** an *Open profile* / *Open page* link (new tab) and a
       *Copy name* button with the exact name to type after `@`;
     - **X:** the handle with a *Copy* button.
     Anything not on file shows as "not on file", never a guess.
  1. **Live post(s)** ready now;
  2. **Tweetstorm**, one card per post, 1/N … N/N. Above it, one line: *"Post
     1/N, then reply to it with 2/N, and so on."* X's compose link can only
     start one post, not a whole thread;
  3. **Nuggets queued**: one line each, marked *quote* or *paraphrase*, with
     the note it came from (no buttons; they aren't posts yet);
  4. **Follow-up** draft (after the session), as cards; for LinkedIn, Copy
     only (LinkedIn has no compose link that fills in text);
  5. A footer: the event tag and the event-hog draft path.

  Make it readable on a phone: one column, large tap targets, no horizontal
  scrolling, light and dark mode. `save_draft` and `add_to_draft` return
  the numbered posts with counts; use that text exactly.
- **Anywhere else** (Codex, Claude Code, an app without artifacts): show the
  same layout as **markdown** in the reply. With file access, also write it
  to a local `live-posts_<session>.md` and keep updating that file.

Either way, keep event-hog in step: nuggets via `add_to_draft` (material),
the thread via `add_to_draft` with `posts`. A teammate opening `drafts` sees
the same thread.

## 5. Rules

- **Public stage only.** Sessions under the **Chatham House Rule**, or marked
  off the record, get no attribution: no names, no handles, no "X said".
  When unsure, ask.
- **Nothing posts from event-hog.** Show the draft, the person posts it
  themselves, then `add_to_draft` with `status: posted` and the live link.
- **Live means fast:** show the live post in the same reply as the note
  confirmation, in a quote block they can copy. One option, two at most.
- **Don't flood.** At most one live post per session segment unless they ask
  for more. Save the rest as nuggets for the thread.
