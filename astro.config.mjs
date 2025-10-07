// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
	output: 'static',
  integrations: [tailwind()],

  devToolbar: {
    enabled: false,
  },
});
