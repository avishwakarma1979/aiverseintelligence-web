# AiVerse Intelligence — Web

> Live at **https://aiverseintelligence.com**

Single-page marketing site for the **AiVerse Intelligence** lab brand,
promoting [stockaiverse.com](https://stockaiverse.com) as Product 01.

Astro 5 static site → Cloudflare Pages → **$0/mo**.

---

## Stack

- **Astro 5** — zero-JS static site generator
- Vanilla CSS, design tokens in `src/styles/global.css`
- Google Fonts: Inter + JetBrains Mono
- No client JS, no analytics, no tracking

---

## Local development

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # builds to ./dist
npm run preview      # preview the production build
```

---

## Deploying changes

```bash
git add -A
git commit -m "describe change"
git push
```

That's it. Cloudflare Pages auto-rebuilds on every push to `master` and the new
version is live in ~60 seconds. Watch progress at:

**Cloudflare dashboard → Workers & Pages → `aiverseintelligence-web` → Deployments**

For full one-time setup (DNS migration, Cloudflare Pages config, troubleshooting):
→ **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)**

---

## Editing copy

All page copy lives in `src/pages/index.astro` frontmatter:

- `products[]` — the 3 LIVE tiles in the Product section
- `thesis[]` — the 3 numbered statements
- `upcoming[]` — the 2 R&D cards in the NEXT section

Hero copy (H1, sub, eyebrow), section titles, and footer are inline in the JSX.

---

## Editing design

All design tokens live in `src/styles/global.css` `:root`. The single accent is
controlled in one place:

```css
--accent: #C9F564;   /* lab green */
```

Section-level styles are scoped inside `src/pages/index.astro`'s `<style>` block.
Global base styles + tokens live in `global.css`.

---

## Project structure

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── README.md                     # this file
├── docs/
│   └── DEPLOYMENT.md             # full deploy + DNS migration guide
├── public/
│   ├── favicon.svg               # primary favicon (lab-green AV mark)
│   ├── aiverse-logo-removebg-preview.png   # nav + footer logo (transparent)
│   └── aiverse-logo.jpeg         # OG image + apple-touch-icon (white-bg, universal)
└── src/
    ├── layouts/
    │   └── Layout.astro          # HTML shell, fonts, OG/Twitter meta
    ├── pages/
    │   └── index.astro           # the entire 1-pager (sections inline)
    └── styles/
        └── global.css            # design tokens + base styles
```

---

## Brand & copy conventions

- Casing: **`AiVerse Intelligence`** (lowercase `i`, matches the logo). Never `AIVerse`.
- Product name: **`StockAiVerse`**. Never `StockAIVerse`.
- URLs / domains stay lowercase as standard (`stockaiverse.com`,
  `aiverseintelligence.com`, `hello@aiverseintelligence.com`).
- Visual: dark `#0A0A0B` bg, single lab-green `#C9F564` accent, hairline borders,
  mono labels and numbers.
- No emoji in code or copy.
- No chatbot — email-only contact (`hello@aiverseintelligence.com`) is on-brand
  for a lab/research page.

---

## Logo

- **`public/aiverse-logo-removebg-preview.png`** — transparent PNG, used in nav
  and footer.
- **`public/aiverse-logo.jpeg`** — white-bg version, used as Open Graph / Twitter
  preview image and `apple-touch-icon` (where a solid square works better than
  transparency).
- **`public/favicon.svg`** — lab-green `AV` mark on dark, primary favicon.

---

## Infra summary

| | |
|---|---|
| **Domain** | aiverseintelligence.com (registered at GoDaddy) |
| **DNS** | Cloudflare nameservers |
| **Hosting** | Cloudflare Pages (free tier) |
| **Email** | Mailgun (MX/SPF/DKIM via Cloudflare DNS) |
| **Source** | https://github.com/avishwakarma1979/aiverseintelligence-web |
| **Recurring cost** | $0/mo |

---

## License

Proprietary — © AiVerse Intelligence.
