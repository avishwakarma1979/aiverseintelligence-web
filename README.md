# AIVerse Intelligence — Web

Static marketing site for [aiverseintelligence.com](https://aiverseintelligence.com).
Single-page lab/holding-company site that promotes [stockaiverse.com](https://stockaiverse.com).

Built with Astro 5. Designed for $0/mo hosting on Cloudflare Pages.

## Stack

- **Astro 5** — zero-JS static site generator
- Vanilla CSS with design tokens (`src/styles/global.css`)
- Google Fonts: Inter + JetBrains Mono
- No client-side JS, no analytics, no tracking (yet)

## Local development

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # builds to ./dist
npm run preview      # preview the production build
```

## Deploy — Cloudflare Pages (free)

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repo. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `20` (set under env vars: `NODE_VERSION=20`)
4. Save and deploy. First build takes ~60s.
5. **Custom domain:** Pages project → **Custom domains** → add `aiverseintelligence.com` and `www.aiverseintelligence.com`. Cloudflare auto-issues SSL. Update your registrar's nameservers to Cloudflare's (or, if domain is already on Cloudflare DNS, the CNAME is added automatically).

That's it. Free CDN, free HTTPS, free preview deploys per branch, unlimited bandwidth.

## Editing copy

All page copy lives in `src/pages/index.astro` frontmatter — the `products`, `thesis`, `upcoming` arrays, and the hero block. Push a commit → Cloudflare auto-rebuilds.

## Editing design

Design tokens in `src/styles/global.css` `:root`. Change the accent in one place:

```css
--accent: #C9F564;   /* lab green — change here */
```

Recommended alternates if you change your mind:
- Amber: `#F5B454`
- Cool blue: `#7AA2FF`
- Coral: `#FF7A66`

## Logo

`public/aiverse-logo.jpeg` is your existing AIVerse logo (gradient A + wordmark on white). It's currently used as:

- Open Graph image (social link previews)
- `apple-touch-icon`
- Fallback favicon

The nav uses a typographic mark `[ AV ]` in lab-green mono — because the JPEG has a white background that would look like a foreign object on the dark page. To use the actual logo in the nav:

1. Drop a transparent SVG/PNG at `public/aiverse-logo.svg` (or `.png`).
2. In `src/pages/index.astro`, replace the `.brand` block with:
   ```astro
   <a href="#top" class="brand">
     <img src="/aiverse-logo.svg" alt="AIVerse Intelligence" height="28" />
   </a>
   ```

## Project structure

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── aiverse-logo.jpeg     # OG image + fallback favicon
│   └── favicon.svg           # primary favicon (lab-green AV mark)
└── src/
    ├── layouts/
    │   └── Layout.astro      # HTML shell, meta, fonts
    ├── pages/
    │   └── index.astro       # the entire one-pager (sections inline)
    └── styles/
        └── global.css        # design tokens + base styles
```

Page-section styles are scoped inside `index.astro`'s `<style>` block. Global tokens live in `global.css`.

## License

Proprietary — © AIVerse Intelligence.
