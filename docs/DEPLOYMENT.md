# Deployment Guide

End-to-end deployment process for **aiverseintelligence.com**, captured for future reference.
Ran on 2026-05-08 to migrate from GoDaddy Website Builder → Astro + Cloudflare Pages.

---

## TL;DR — Day-to-Day Workflow (after initial setup)

```bash
cd D:\aiverseintelligence-web
# edit src/pages/index.astro, src/styles/global.css, etc.
npm run dev          # local preview at http://localhost:4321
npm run build        # sanity-check the build before pushing
git add -A
git commit -m "your change description"
git push
```

That's it. Cloudflare Pages auto-rebuilds on every push to `master` and the new version is live in ~60 seconds.

---

## Stack Summary

| Component | Choice | Cost |
|---|---|---|
| Static site generator | Astro 5 | free |
| Hosting + CDN + SSL | Cloudflare Pages | $0/mo |
| DNS | Cloudflare (nameservers) | $0/mo |
| Domain registration | GoDaddy (unchanged) | annual renewal |
| Email | Mailgun (unchanged) | per Mailgun plan |
| Source control | GitHub (public repo) | free |
| **Total recurring** | | **$0/mo** |

---

## Initial Setup — Step-by-Step (one-time)

### 1. Local repo + Astro scaffold

```bash
mkdir D:\aiverseintelligence-web
cd D:\aiverseintelligence-web

# Files created manually (not via `npm create astro`):
#   package.json, astro.config.mjs, tsconfig.json, .gitignore, README.md
#   src/layouts/Layout.astro, src/pages/index.astro, src/styles/global.css
#   public/aiverse-logo-removebg-preview.png  (transparent logo PNG)
#   public/aiverse-logo.jpeg                   (white-bg, used for OG image + apple-touch-icon)
#   public/favicon.svg                         (lab-green AV mark)

npm install
npm run build         # verify build is clean before pushing
```

### 2. GitHub repo

```bash
# gh CLI was authed as `avishwakarma1979` with `repo` scope
gh repo create avishwakarma1979/aiverseintelligence-web \
  --public \
  --description "Marketing site for aiverseintelligence.com — Astro static site, deployed via Cloudflare Pages" \
  --source=. \
  --push
```

If repo already exists empty (manual pre-creation in GitHub UI), instead:

```bash
git remote add origin https://github.com/avishwakarma1979/aiverseintelligence-web.git
git push -u origin master
```

Branch is `master` (not `main`) — matches the rest of the user's git config.

### 3. Cloudflare Pages — Connect GitHub

Browser UI only (no CLI):

1. Go to https://dash.cloudflare.com → sign up (free) or log in.
2. Sidebar → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize GitHub OAuth. Choose **Only select repositories** → pick `aiverseintelligence-web`.
4. Build settings (Cloudflare auto-detects Astro and may collapse most fields):

| Field | Value |
|---|---|
| Project name | `aiverseintelligence-web` |
| Production branch | `master` |
| Framework preset | Astro (auto-detected) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | leave blank |
| Environment variable | `NODE_VERSION=20` |

5. **Save and Deploy.** First build ~60-90s.
6. Cloudflare gives a temporary URL like `aiverseintelligence-web.pages.dev`. Open it — site should be live.

### 4. DNS migration — GoDaddy → Cloudflare

**This is the most delicate step. Email runs through Mailgun on this domain — breaking DNS breaks email.**

Background: the apex domain (`aiverseintelligence.com` without `www`) cannot use a CNAME by DNS spec. To make the bare domain point at Cloudflare Pages, Cloudflare needs full DNS control via nameservers (they fake apex CNAMEs via "CNAME flattening").

#### 4a. Pages → Custom domains → Add domain

1. In your Pages project → **Custom domains** tab → **Set up a custom domain** → enter `aiverseintelligence.com`.
2. Cloudflare detects the domain isn't on Cloudflare DNS and prompts: **"Transfer DNS management"** (NOT a domain registration transfer — domain stays at GoDaddy).
3. Click **Get started**.

#### 4b. Cloudflare scans existing GoDaddy DNS

Cloudflare auto-imports public DNS records from GoDaddy. It usually catches:

- A records (current website IPs)
- MX records
- TXT records (SPF, often DKIM)
- CNAMEs

**Verify these 4 email records made it into Cloudflare's DNS panel before proceeding:**

| Type | Name | Value |
|---|---|---|
| MX | `@` | `mxa.mailgun.org` (priority 10 or 60) |
| MX | `@` | `mxb.mailgun.org` (priority 10 or 60) |
| TXT | `@` | `v=spf1 include:mailgun.org ~all` |
| TXT | `*._domainkey` (e.g. `pic._domainkey`) | long string starting `k=rsa; p=MIG...` (DKIM) |

The DKIM TXT (4th row) is the one most likely to be missed by the scan. **If missing**, look it up in Mailgun's dashboard: **Sending → Domains → click your domain → DNS Records tab**. Copy the DKIM TXT entry into Cloudflare manually.

A records and `www` CNAME pointing to the GoDaddy website do not need to be copied — they will be replaced when Pages takes over.

#### 4c. Switch nameservers at GoDaddy

Cloudflare displays the 2 nameservers it assigned to your domain (e.g., `trevor.ns.cloudflare.com`, `adaline.ns.cloudflare.com`). Then:

1. GoDaddy → **My Domains** → `aiverseintelligence.com` → **DNS** tab.
2. Scroll to **Nameservers** → **Change**.
3. Select **"I'll use my own nameservers"**.
4. Paste both Cloudflare nameservers. Save.

Propagation: usually 1-4 hours, max 24h. Cloudflare emails when it detects the change. Check propagation manually:

```powershell
Resolve-DnsName aiverseintelligence.com -Type NS    # should show *.ns.cloudflare.com
Resolve-DnsName aiverseintelligence.com -Type MX    # should still show mxa/mxb.mailgun.org
```

The old GoDaddy-builder website goes offline at this point — that is intentional.

#### 4d. Activate Pages custom domain

Once DNS resolves through Cloudflare:

1. Pages project → **Custom domains** → **Activate domain**. Cloudflare auto-creates the necessary CNAME-flattening records and provisions an SSL cert (~2-5 min).
2. Repeat for `www.aiverseintelligence.com`.
3. Both domains should show green **Active** status.

#### 4e. Verify

```powershell
Invoke-WebRequest https://aiverseintelligence.com -UseBasicParsing | Select StatusCode, Headers
```

Expect `200 OK` with `Server: cloudflare` and a `CF-Ray` header. The old GoDaddy site should be gone, replaced by the Astro lab site.

**Send a test email TO `hello@aiverseintelligence.com` from gmail** — confirm it lands in Mailgun. That validates the DNS migration didn't break email.

---

## Cutover Downtime Budget

| Service | Downtime |
|---|---|
| Email (Mailgun) | **0 minutes** if all 4 email records are in Cloudflare before nameserver switch |
| Old GoDaddy website | **goes down at nameserver switch** (intentional) |
| New Astro site | **live within 30 min** of Cloudflare confirming DNS, after Pages custom domain activation |

---

## Day-to-Day Operations

### Editing copy

Page copy lives in frontmatter arrays at the top of `src/pages/index.astro`:

- `products[]` — the 3 LIVE tiles (StockAiVerse capabilities)
- `thesis[]` — the 3 numbered statements
- `upcoming[]` — the 2 R&D cards in the NEXT section

Hero copy (H1, sub, eyebrow), section titles, and the footer are inline in the JSX.

### Editing design

All design tokens live in `src/styles/global.css` `:root`:

```css
--accent: #C9F564;   /* lab green — single accent for the whole site */
--bg: #0A0A0B;
/* ...etc */
```

Section-level styles are in the `<style>` block at the bottom of `src/pages/index.astro`.

### Deploying changes

```bash
cd D:\aiverseintelligence-web
git add -A
git commit -m "describe change"
git push
```

Cloudflare Pages auto-rebuilds within ~60s. Watch progress at:
**Cloudflare dashboard → Workers & Pages → `aiverseintelligence-web` → Deployments tab.**

### Preview deploys

Push to any non-master branch — Cloudflare creates a preview URL like `<branch-hash>.aiverseintelligence-web.pages.dev`. Useful for proofing changes before merging.

---

## Troubleshooting

### Build fails on Cloudflare but works locally

Usually a Node version mismatch. Check `NODE_VERSION` env var is set to `20` in Pages project → Settings → Environment variables. Also ensure local Node is 20+ (run `node --version`).

### Site loads but custom domain shows SSL error

Cloudflare needs a few minutes after activation to provision the SSL cert. Wait 5-10 min, then hard-refresh. If still broken after 30 min, in Pages → Custom domains → click the domain → "Reconfigure SSL".

### Email stops working after nameserver switch

DKIM record was probably missed. Check Cloudflare DNS panel for a TXT record with `_domainkey` in the name. If missing:

1. Go to Mailgun dashboard → **Sending → Domains** → click your domain → **DNS Records** tab.
2. Copy the DKIM record (Type: TXT, Name: `something._domainkey`, Value: `k=rsa; p=...`).
3. Add it in Cloudflare → DNS panel → Add record.
4. Email recovery is near-immediate once added.

### "Repo already exists" on `gh repo create`

Someone (probably you) created an empty repo with that name in GitHub UI. Use the alternate flow:

```bash
git remote add origin https://github.com/avishwakarma1979/aiverseintelligence-web.git
git push -u origin master
```

### Cloudflare auto-scan misses records

Run the comparison manually:

```powershell
# Cloudflare scan only sees public records. Some hosts hide certain records.
# Mailgun's DKIM is sometimes on a long random subdomain that scanners miss.
# The fix: get records from the source (Mailgun dashboard, Google Workspace admin, etc.)
# rather than relying on the scan.
```

### Rollback a bad deploy

Pages keeps every deploy. Cloudflare → Pages project → **Deployments** tab → find a previous good deploy → **⋯ menu** → **Rollback to this deployment**. Live within seconds.

For source-level rollback: `git revert <commit>` and push. Auto-deploys.

---

## File Layout Reference

```
aiverseintelligence-web/
├── astro.config.mjs           # Astro config: static output, compress HTML
├── package.json
├── tsconfig.json
├── README.md                  # short overview
├── docs/
│   └── DEPLOYMENT.md          # this file
├── public/
│   ├── favicon.svg            # primary favicon (lab-green AV mark)
│   ├── aiverse-logo-removebg-preview.png   # nav + footer logo (transparent)
│   └── aiverse-logo.jpeg      # OG image + apple-touch-icon (white bg, universal)
└── src/
    ├── layouts/
    │   └── Layout.astro       # HTML shell, fonts, OG/Twitter meta
    ├── pages/
    │   └── index.astro        # the entire 1-pager (sections inline)
    └── styles/
        └── global.css         # design tokens + base styles
```

---

## Brand & Copy Conventions

- Casing: **`AiVerse Intelligence`** (lowercase `i`, matches logo). Never `AIVerse`.
- Product casing: **`StockAiVerse`**. Never `StockAIVerse`.
- URLs / domains: lowercase as standard (`stockaiverse.com`, `aiverseintelligence.com`, `hello@…`).
- Visual: dark `#0A0A0B` bg, single lab-green `#C9F564` accent, hairline borders, mono labels.
- No emoji in code or copy.
- No analytics by default — site is privacy-respecting. Cloudflare Web Analytics can be opt-in enabled later if needed.
- No chatbot — email-only contact (`hello@aiverseintelligence.com`) is on-brand for a lab/research page.

---

## Future Reference

- **Status page** (if needed later): use https://www.cloudflarestatus.com for hosting incidents.
- **Adding analytics**: Cloudflare → Analytics & Logs → Web Analytics → Add a site → paste their JS snippet into `src/layouts/Layout.astro` before `</body>`.
- **Custom OG image**: replace `public/aiverse-logo.jpeg` with a 1200×630 branded card (recommended size for social previews). Update `og:image` reference in `Layout.astro` if filename changes.
- **Adding a blog**: Astro supports `src/pages/blog/[slug].astro` with markdown content. Out of scope for this single-page site, but easy to add later.
