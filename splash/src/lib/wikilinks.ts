import { getCollection } from 'astro:content';
import type { WikilinkResolution, WikilinkResolverInput } from '@lossless-group/lfm';

// Resolves [[wikilinks]] in changelog and context-v files for LFM.
//   1. A changelog entry or context-v doc on this site → its page here.
//   2. A file in the repo the splash doesn't publish (DATA-POLICY, a kit
//      skill) → that file on GitHub.
//   3. Anything else → its name as plain text, without the brackets.

const REPO = 'https://github.com/lossless-group/event-hog-mcp/blob/main';
const ROOT_DOCS = ['DATA-POLICY', 'COLLABORATE', 'README'];
const KIT_SKILLS = [
  'augment-speakers-panelists',
  'capture-slides',
  'conference-attendee-export',
  'draft-follow-up-emails',
  'maintain-design-system',
  'parallel-content-generation-starters',
  'prioritize-attendees',
  'recreate-slides-in-brand',
];

const key = (s: string) => s.trim().toLowerCase().split('/').pop()!.replace(/\.md$/, '');
const deslug = (s: string) => s.split('/').pop()!.replace(/\.md$/, '').replace(/[-_]+/g, ' ');

type Route = { url: string; title?: string };
let routes: Promise<Map<string, Route>> | undefined;

function siteRoutes() {
  routes ??= (async () => {
    const base = import.meta.env.BASE_URL;
    const map = new Map<string, Route>();
    for (const e of await getCollection('changelog')) {
      if (e.data.publish !== false) map.set(key(e.id), { url: `${base}changelog/${e.id}/`, title: e.data.title });
    }
    for (const e of await getCollection('context-v')) {
      if (e.data.publish !== false) map.set(key(e.id), { url: `${base}context-v/${e.id}/`, title: e.data.title });
    }
    return map;
  })();
  return routes;
}

export async function wikilinkResolver() {
  const map = await siteRoutes();
  return ({ path, anchor, display }: WikilinkResolverInput): WikilinkResolution | null => {
    const k = key(path);
    const hash = anchor ? `#${anchor}` : '';
    const text = display ?? deslug(path);
    const local = map.get(k);
    if (local) return { url: local.url + hash, isLocal: true, display: display ?? local.title ?? text };
    const doc = ROOT_DOCS.find((d) => d.toLowerCase() === k);
    if (doc) return { url: `${REPO}/${doc}.md${hash}`, isLocal: false, display: display ?? doc };
    if (KIT_SKILLS.includes(k)) {
      return { url: `${REPO}/kit/skills/${k}/SKILL.md${hash}`, isLocal: false, display: display ?? k };
    }
    return null;
  };
}
