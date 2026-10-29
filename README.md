# event-hog-mcp

A remote MCP server that gives a team working a conference one shared
workspace in Claude (Desktop, web, mobile) or Codex: prep before, contacts,
notes and slides during, follow-ups and CRM sync after. Every write is a git
commit by the person who made it.

It runs as one Cloudflare Worker. First used for real at the 7x24 Exchange
Fall Conference 2026 (San Antonio, Oct 25–28), with Edviro Energy.

## How it works

Three layers, each with one job (the full reasoning is in
[`context-v/decisions/2026-10-25_Three-Layers-and-an-Agnostic-CRM-for-Event-Hog.md`](context-v/decisions/2026-10-25_Three-Layers-and-an-Agnostic-CRM-for-Event-Hog.md)):

| Layer | What | Job |
|---|---|---|
| **Cloudflare Artifacts** | One git repo per event (`event-hog/<yyyy-mm-slug>`), plus `event-hog-kit` | The shared, human-readable record: prep, contacts, notes, slides, drafts. Git history gives attribution and undo |
| **D1 `agnostic-crm`** | SQLite, bound as `CRM` | A structured model of people, organizations, event series and instances, observations, interactions, affiliations and nested locations. Rebuildable from the files |
| **The client's CRM** | HubSpot today | A projection: contacts are proposed, approved, then created through the person's own HubSpot connector |

Plus an R2 bucket, `event-hog-media`, for images and PDFs, served at
`/media/<key>`. Repos hold text and the image's URL, never image bytes.

On every tool call the Worker clones the event repo into memory
(isomorphic-git), changes files, commits as the caller, and pushes. If a
teammate's push lands first, it retries from a fresh clone (up to 5 times).
Writes add files or append to them, so a retry never clobbers anything.

### Routes

| Path | What |
|---|---|
| `POST /mcp/<key>` | The MCP endpoint (JSON-RPC over HTTP). The key identifies the person |
| `GET /media/<key>` | Public files from the bucket. HTML is served with a CSP sandbox: no scripts, no forms |
| `/capture/<token>` | A person's camera page for slide photos. The token is derived from their key |
| `PUT /upload/<ticket>` | A one-time, 15-minute upload link minted by `upload_link` |

### The kit

[`kit/`](kit/) is what goes into the `event-hog-kit` Artifacts repo: the
skills the server serves (`list_skills`, `get_skill`), the template a new
event starts from (`new_event`), and per-deployment settings
(`config/skills.json`, served by `get_config`). Skills are read from the kit
first, then from the CRM deployment's brain repo (`BRAIN_NAMESPACE/SKILLS_REPO`).

## Tools

**Workspace:** `event_brief` (start here), `list_events`, `new_event`,
`whoami`, `list_files`, `read_file`, `search`, `recent_activity`,
`append_to_file`, `add_note`.

**Contacts and CRM:** `log_contact` (appends to an existing contact matched by
email, then name and company), `contacts_csv`, `query_crm`, `relate_orgs`,
`define_location`, `link_location`, `who_is_in`, `crm_queue`,
`mark_crm_synced`, `export_hubspot_csv`.

**Skills:** `list_skills`, `get_skill`, `get_config`, `set_my_research_tools`,
`save_speaker_profile`.

**Slides and files:** `slide_capture_link`, `upload_link`, `slides`,
`view_slide`, `save_slide_notes`, `add_field_note`.

**Brand:** `get_design_system`, `extract_brand`, `save_design_system`,
`save_recreated_slide`.

**Starters:** `save_flash_cards`, `flash_cards`, `save_draft`,
`add_to_draft`, `drafts`.

## What the server guarantees, and what it only asks Claude to do

This is the line to check in review. Some behavior is enforced in code;
some is an instruction to the model (the server's `instructions` and the
skills), which a model can fail to follow.

**Enforced in code:**
- Every write is a commit authored as the caller (`PEOPLE` maps key → name and email).
- Contact and note writes add or append; existing contact fields are filled
  when blank, never overwritten. Slide notes that already exist get "another
  take", not a replacement.
- `mark_crm_synced` records whatever HubSpot ID it's given. It does **not**
  check HubSpot.
- Recreated slides are rejected if they contain `<script>` or lack a credit
  line. The credit check is loose: the words "source", "adapted from" or
  "via" anywhere in the text pass it. All HTML under `/media/` is served
  sandboxed.
- Upload links: signed (HMAC keyed by the person's connector key), expire in
  15 minutes, single use, and the file's first bytes must match its type.

**Asked of the model, not enforced:**
- Search before logging a contact; never invent fields.
- Propose CRM records and create them only after the person approves. The
  server never calls HubSpot; Claude does, through the person's own HubSpot
  connector.
- Nothing is ever posted publicly: drafts only.
- Discretion rules for posts (hallway conversations stay private, and so on).

## Security model, plainly

- **The connector URL is the credential.** Anyone with `…/mcp/<key>` acts as
  that person. There is no sign-in yet. Treat the URL like a password.
- **`/media/` is public.** Anyone with a file's URL can open it. Keys the server writes
  include random parts, so its URLs can't be guessed, but don't put anything there you
  wouldn't share by link.
- **`config/skills.json` is served to every connector user.** Settings only,
  never credentials.

## Known gaps (for 0.1.0)

- `npx wrangler dev` fails locally: `src/index.ts` exports plain constants
  (`DIR`, `CONTACTS_CSV`), which the local runtime treats as handlers.
  Production accepts them.
- "CRM-agnostic" is half true: the database model is ours, but the sync step
  (`hubspot_status`, `crm_queue`, `export_hubspot_csv`) only knows HubSpot.
- Every call clones the whole event repo. Fine for one event's worth of
  text; slower as repos grow.
- The used-upload-link marker is check-then-write, not atomic.
- Not yet verified end to end: a slide sent with `upload_link` from Claude's
  sandbox, which also needs the Claude org admin to allow this Worker's host
  for code execution.

## Deploy your own

You need a Cloudflare account with Artifacts, D1 and R2.

```bash
npm install
npx wrangler d1 create agnostic-crm          # put its id in wrangler.jsonc
npx wrangler r2 bucket create event-hog-media
npx wrangler d1 migrations apply agnostic-crm --remote
```

1. Fill in the `<...>` values in `wrangler.jsonc`, including `PUBLIC_URL`.
2. Create the `event-hog-kit` repo in your Artifacts namespace and push
   `kit/` into it. Copy `kit/config/skills.example.json` to
   `config/skills.json` and fill it in.
3. Set the people: `npx wrangler secret put PEOPLE`, a JSON map of connector
   key → `{ "name", "email", "emails"?, "crm_email"? }`. Generate each key
   with `openssl rand -hex 24`.
4. `npx wrangler deploy`.
5. Each person adds `https://<your worker>/mcp/<their key>` in Claude as a
   custom connector. Then ask Claude to start a new event (`new_event`).

`seeds/` has the 7x24 Exchange Fall 2026 instance as an example seed.

## Developing

```bash
npm run check    # tsc --noEmit
```

Commit messages follow the
[Lossless git conventions](https://github.com/lossless-group/lossless-agent-skills/tree/main/git-conventions).

## License

Apache-2.0. See [LICENSE](LICENSE). Keep [NOTICE](NOTICE) in any copy or fork:
it credits The Lossless Group.
