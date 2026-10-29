/**
 * Static SEO copy for the event-hog splash. Centralized so MetaTags, the
 * index hero and the share image all read from one source of truth.
 */

/**
 * Share image: the hero badge, rasterized to JPEG (JPEG, not WebP: several
 * unfurlers still drop WebP). Lives in public/, so the path is base-relative.
 */
export const OG_IMAGES = {
  banner: {
    url: 'og/event-hog__Share-Banner.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: 'event-hog: a conference badge reading "Hello, we are event-hog. Your team\'s memory at the show."',
  },
} as const;

export const DEFAULT_OG = OG_IMAGES.banner;

export const REPO_URL = 'https://github.com/lossless-group/event-hog-mcp';

export const STATIC_SEO = {
  brand: 'event-hog',
  titleSuffix: ' · event-hog',
  siteName: 'event-hog',

  root: {
    title: 'event-hog: work the room, keep everything',
    description:
      "A shared workspace for a team working a conference, inside Claude or Codex. Prep before, contacts, notes and slides during, follow-ups after. Plain markdown files first; Cloudflare and your CRM when you want them. Open source.",
  },

  changelog: {
    title: 'Changelog',
    description: 'What shipped in event-hog, when, and why.',
  },

  contextV: {
    title: 'Context',
    description:
      'The decisions, specs and plans behind event-hog, written down so anyone can check our reasoning.',
  },
} as const;
