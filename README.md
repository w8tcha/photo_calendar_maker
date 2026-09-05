# Photo Calendar Maker

A browser-based tool for generating printable photo calendars. Pick a start year, first month, language, font and paper format, drop in a photo per month, and export the result as a PDF or JPG — all rendered client-side, no server or account required.

## Features

- **Single-page or multi-page layouts** — one page with all 12 months, or one page per month.
- **A4 portrait/landscape output** at print resolution (2480×3508 px @ A4).
- **English or Russian** calendar text (month and weekday names).
- **Three built-in fonts** (EB Garamond, Montserrat, Caveat) — glyph outlines are rendered directly to SVG paths via `opentype.js`, not loaded as web fonts.
- **Per-month photo upload and cropping** (`cropperjs`), with automatic centering/scaling into the page layout.
- **Export** the current month or the whole calendar as PDF (`jsPDF` + `svg2pdf.js`) or a single month as JPG.
- **Local persistence** — the current project (settings + uploaded images) is saved to IndexedDB and restored on reload.

## Getting started

Requires Node ≥ 20 and [pnpm](https://pnpm.io/) ≥ 10 (this project enforces pnpm — `npm install` will refuse to run).

```bash
pnpm install
pnpm dev       # start the Vite dev server
```

Other scripts:

```bash
pnpm build          # production build -> ./build
pnpm test           # run tests in watch mode (vitest)
pnpm test:run       # run tests once
pnpm test:coverage  # run tests with coverage report
pnpm lint           # eslint
pnpm format:check   # prettier check
pnpm format:fix     # prettier write
```

`pnpm deploy` builds into `../../server/dist/public/projects/photo_calendar_maker` — intended for deployment alongside a sibling `server` project, not for standalone use.

## How it works

- The UI (`index.html` + `src/lib/main.ts`) collects project settings through a small dropdown-based form, then hands them to a `DataController`, which owns font loading, format/mockup options, and IndexedDB persistence.
- `ViewController` builds each month as an SVG "mockup": it loads a `.ttf` font with `opentype.js`, converts glyph outlines to SVG `<path>` data for all text (month/year titles, weekday headers, day numbers), and lays out the day grid and photo placeholder.
- `DownloadManager` clones the rendered SVG mockup(s), embeds the actual photo, and rasterizes to JPG (canvas) or vectorizes to PDF.

### Note on `patches/opentype.js.patch`

This project patches `opentype.js` (via `pnpm patch`) to fix two upstream bugs in its SVG path serialization that otherwise corrupt or crash glyph rendering for certain text/font combinations:

1. A missing separator when a rounded coordinate collapses to a bare `"0"` right after another positive number, silently merging two numbers into one (e.g. `"0.04"` + `"0"` → `"0.040"`).
2. A `NaN` produced by `roundDecimal()`'s exponential-string rounding trick when a coordinate's fractional part is a very small number that JavaScript stringifies in scientific notation (e.g. `4.4e-16`).

The patch is applied automatically by `pnpm install` via `patchedDependencies` in `pnpm-workspace.yaml`; no manual steps are needed.

## Tech stack

TypeScript, Vite, SCSS, `opentype.js`, `cropperjs`, `jsPDF` + `svg2pdf.js`, GSAP, IndexedDB, Vitest.
