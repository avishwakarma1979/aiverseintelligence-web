import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aiverseintelligence.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
