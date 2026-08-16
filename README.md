# The Wandering Eye

A minimal editorial photography portfolio. Travel, street and portrait photography from India and beyond.

**Live site:** https://saurabhsds13.github.io/the-wandering-eye/

---

## Stack

- Pure HTML + CSS + vanilla JavaScript
- No frameworks, no build step
- Deployed via GitHub Actions to GitHub Pages on every push to `master`

---

## Project structure

```
the-wandering-eye/
├── index.html                  Homepage
├── story-mumbai.html           Story page — Mumbai After Rain
├── story-rajasthan.html        Story page — Rajasthan
├── story-between-cities.html   Story page — Between Cities
├── style.css                   All styles
├── script.js                   All interactivity
├── assets/
│   └── images/
│       ├── hero.jpg            Hero image (loads immediately — no lazy)
│       ├── *.webp / *.jpg      Current photographs
│       ├── mumbai/             → place Mumbai photographs here
│       ├── agra/               → place Agra photographs here
│       ├── rajasthan/          → place Rajasthan photographs here
│       ├── nature/             → place nature photographs here
│       ├── street/             → place street photographs here
│       ├── portraits/          → place portrait photographs here
│       ├── landscapes/         → place landscape photographs here
│       └── travel/             → place travel photographs here
└── .github/
    └── workflows/
        └── deploy.yml          GitHub Actions deploy to Pages
```

---

## How to add a photograph to the gallery

Open `index.html` and find the `<div class="gallery">` section.

Copy an existing `<figure>` block and update three things:

```html
<figure class="gallery-item" data-category="mumbai street" data-index="07">
  <button class="img-btn" data-full="assets/images/mumbai/my-photo.jpg" aria-label="View: Caption here">
    <img
      src="assets/images/mumbai/my-photo.jpg"
      alt="Descriptive alt text for screen readers"
      loading="lazy" decoding="async"
    >
  </button>
  <figcaption>
    <span class="fig-num">07</span>
    <span class="fig-title">Caption title</span>
    <span class="fig-meta">Mumbai, India</span>
  </figcaption>
</figure>
```

**Layout modifiers** (add to the `class` attribute):
- `span-full` — full-width feature image
- `span-wide` — two-thirds width (use with a `span-narrow` sibling)
- `span-narrow` — one-third width (use with a `span-wide` sibling)
- *(default)* — one of three equal columns

**`data-category`** (space-separated, used by filters):
`travel` · `street` · `nature` · `mumbai` · `moments`

---

## How to add a new story page

1. Duplicate `story-mumbai.html` and rename it (e.g. `story-agra.html`).
2. Update the `<title>`, meta description, `og:image`, and `canonical` URL.
3. Change the hero image `src` and `alt`.
4. Update the `<h1>`, location label, and photo count.
5. Update the `project-intro` text and metadata.
6. Replace the `photo-sequence` rows with your photographs.

**Row layout classes:**
```html
<div class="photo-row row-full">      <!-- single full-width image -->
<div class="photo-row row-half">      <!-- two equal images side by side -->
<div class="photo-row row-third">     <!-- three equal images -->
<div class="photo-row row-feature">   <!-- large left + small right -->
<div class="photo-row row-feature-r"> <!-- small left + large right -->
```

7. Add a card for the story in `index.html` under `<div class="stories-grid">`.

---

## Deployment

Push to `master`. GitHub Actions deploys automatically.

No build step. No dependencies to install.

---

## Typography

- **Headings:** Cormorant Garamond (Google Fonts, loaded via `<link>`)
- **Body / UI:** Inter (Google Fonts, loaded via `<link>`)

## Colour palette

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0c0b09` | Page background |
| `--text` | `#ede9e0` | Primary text |
| `--text-muted` | `#8a8780` | Secondary text, captions |
| `--text-dim` | `#57554f` | Labels, metadata |
| `--rule` | `rgba(237,233,224,.10)` | Subtle dividers |
