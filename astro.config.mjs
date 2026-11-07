// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://charlielinville.me',
  trailingSlash: 'never',
  build: {
    // Emit `about.html` rather than `about/index.html`. Combined with
    // `cleanUrls` in vercel.json this serves /about with no trailing slash
    // and no redirect hop.
    format: 'file',
  },
  integrations: [sitemap({
    // Keep the standalone Dutch lesson and its documents out of public discovery.
    filter: (page) => !new URL(page).pathname.startsWith('/dutch-game-modeling'),
  })],
});
