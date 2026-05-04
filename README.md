# Meridian Studio — Squarespace 7.0 Template

A premium Squarespace 7.0 template (Wright/Brine-family) with full local development support.

## Features

- Dark editorial design (Meridian Studio creative agency)
- **Lenis** smooth scrolling — `/assets/vendor/lenis/`
- **GSAP + ScrollTrigger** animations — `/assets/vendor/gsap/`
- **Swiper** carousels (Portfolio + Testimonials) — `/assets/vendor/swiper/`
- All libraries bundled locally — **no CDN dependencies**
- LESS 1.7.x compatible (all `calc`/`clamp`/`aspect-ratio` values properly escaped)

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **10.x** (required by `@squarespace/server`) |
| nvm | any |
| Git | ≥ 2.x |
| Squarespace plan | Personal / Business / Commerce (paid, not trial) |
| Squarespace version | **7.0 only** (7.1 does not support Developer Mode) |

## Local Development Setup

### 1 — Install Node 10

```bash
nvm install 10
nvm use 10
node -v   # should print v10.x.x
```

### 2 — Install the Squarespace local dev server

```bash
npm install -g @squarespace/server --unsafe-perm
squarespace-server --help
```

### 3 — Enable Developer Mode on your Squarespace site

1. Log in → **Settings → Advanced → Developer Mode → ON**
2. Note your site's Git remote: `https://yoursite.squarespace.com/template.git`

### 4 — Configure local settings

```bash
cp .local.settings.json.example .local.settings.json
# Edit .local.settings.json and set your siteUrl
```

`.local.settings.json` is in `.gitignore` — it will never be committed.

### 5 — Start the local server

```bash
squarespace-server
# or explicitly:
squarespace-server --siteUrl=https://yoursite.squarespace.com
```

Visit [http://localhost:9000](http://localhost:9000).

> **Tip:** If you get a blank page, check that `<squarespace-headers>` is present in `site.region` and that Developer Mode is enabled.

## Deploy to Squarespace

```bash
git add .
git commit -m "Update Meridian template"
git push origin master
```

Changes go live immediately — Squarespace has no staging.

## Connect this repo to GitHub

If not yet connected, add GitHub as a second remote:

```bash
git remote add github https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push github master
```

Then deploy to Squarespace by pushing to the `origin` remote (your Squarespace Git URL).

## Project Structure

```
.
├── site.region               ← Full HTML shell (header, hero, sections, footer)
├── template.conf             ← Template metadata + navigation + stylesheet list
├── blocks/
│   ├── header-nav.block      ← Desktop nav markup
│   ├── mobile-nav.block      ← Mobile overlay nav markup
│   ├── footer-nav.block      ← Footer nav markup
│   └── ...                   ← Other Squarespace blocks
├── styles/
│   ├── site.less             ← Entry point (imports _meridian.less)
│   ├── _meridian.less        ← Meridian Studio design system
│   └── ...                   ← Wright template base styles
├── scripts/
│   ├── meridian-app.js       ← Main JS: Lenis, GSAP, ScrollTrigger, Swiper
│   └── site-bundle.js        ← Wright template JS
└── assets/
    └── vendor/
        ├── gsap/
        │   ├── gsap.min.js
        │   └── ScrollTrigger.min.js
        ├── swiper/
        │   ├── swiper-bundle.min.js
        │   └── swiper-bundle.min.css
        └── lenis/
            ├── lenis.min.js
            └── lenis.css
```

## Vendor Library Versions

| Library | Version | Local path |
|---------|---------|-----------|
| GSAP | 3.x | `assets/vendor/gsap/` |
| ScrollTrigger (GSAP plugin) | 3.x | `assets/vendor/gsap/` |
| Swiper | 11.x | `assets/vendor/swiper/` |
| Lenis | 1.x | `assets/vendor/lenis/` |

To update a library, re-run the install script:

```bash
mkdir -p /tmp/sq-vendor && cd /tmp/sq-vendor && npm init -y
npm install gsap@latest swiper@latest lenis@latest
cp node_modules/gsap/dist/gsap.min.js /path/to/project/assets/vendor/gsap/
cp node_modules/gsap/dist/ScrollTrigger.min.js /path/to/project/assets/vendor/gsap/
cp node_modules/swiper/swiper-bundle.min.js /path/to/project/assets/vendor/swiper/
cp node_modules/swiper/swiper-bundle.min.css /path/to/project/assets/vendor/swiper/
cp node_modules/lenis/dist/lenis.min.js /path/to/project/assets/vendor/lenis/
cp node_modules/lenis/dist/lenis.css /path/to/project/assets/vendor/lenis/
```

## Common Issues

| Symptom | Fix |
|---------|-----|
| Blank page | Add `{squarespace-headers}` to `site.region` `<head>` |
| No styles | Confirm `site.less` imports `_meridian` and Node is 10.x |
| `url-for` 500 error | Replace `{@\|url-for}` with `#` in all blocks |
| LESS layout broken | Wrap `calc()`/`clamp()`/`aspect-ratio` values in `~"..."` |
| Auth loop on boot | Clear cookies for `*.squarespace.com` and retry |
