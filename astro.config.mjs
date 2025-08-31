// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';

export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    partytown({
      config: {
        // GTM / GA4 イベント用
        forward: ['dataLayer.push'],
      },
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
