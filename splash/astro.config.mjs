// @ts-check
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';

// Splash for event-hog-mcp.
// Hosted on GitHub Pages from lossless-group/event-hog-mcp.
// Live URL: https://lossless-group.github.io/event-hog-mcp/
//
// If a custom domain is added later, set `site` to that domain and `base` to '/'.
export default defineConfig({
  site: 'https://lossless-group.github.io',
  base: '/event-hog-mcp/',
  trailingSlash: 'ignore',

  integrations: [
    // Runs Pagefind against dist/ after `astro build`; search is static and
    // client-side. See astro-knots/context-v/explorations/Implementing-Full-Text-Search-by-Default.md.
    pagefind(),
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404'),
    }),
  ],

  build: {
    // Pagefind needs a stable per-page URL.
    format: 'directory',
  },
});
