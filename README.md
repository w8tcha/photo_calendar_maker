# Photo Calendar Maker

A browser-based tool for generating printable photo calendars. Pick a start year, first month, font and paper format, drop in a photo per month, and export the result as a PDF or JPG — all rendered client-side, no server or account required.

## Features

- **Single-page or multi-page layouts** — one page with all 12 months, or one page per month.
- **A2–A6 portrait/landscape output** at print resolution.
- **English, German or Russian** UI and calendar text (month and weekday names), switchable at any time.
- **Multiple projects** — create, open, edit, and delete saved calendars from the project picker.
- **Three built-in fonts** (EB Garamond, Montserrat, Caveat), embedded into the SVG/PDF output.
- **Per-month photo upload and cropping** ([`@hungrysamurai/cropper`](https://www.npmjs.com/package/@hungrysamurai/cropper)), with automatic centering/scaling into the page layout.
- **Export** the current month or the whole calendar as PDF (`jsPDF` + `svg2pdf.js`) or a single month as JPG.
- **Local persistence** — all projects (settings + uploaded images) are saved to IndexedDB and the last opened one is restored on reload.

## Getting started

Requires Node ≥ 20 and [pnpm](https://pnpm.io/) ≥ 10 (this project enforces pnpm — `npm install` will refuse to run).

```bash
pnpm install
pnpm dev       # start the Vite dev server
```

Other scripts:

```bash
pnpm build          # production build -> ./build
pnpm build:pages    # production build for GitHub Pages -> ./build
pnpm test           # run tests in watch mode (vitest)
pnpm test:run       # run tests once
pnpm test:coverage  # run tests with coverage report
pnpm lint           # eslint
pnpm format:check   # prettier check
pnpm format:fix     # prettier write
```

`pnpm deploy` builds into `./deploy` with the `/projects/photo_calendar_maker/` base path — intended for deployment alongside a sibling `server` project, not for standalone use.

The crop tool's package is bundled into the build output, so the output is self-contained and can be uploaded as is.

## How it works

- The UI (`index.html` + `src/lib/main.ts`) collects project settings through a small dropdown-based form, then hands them to a `DataController`, which owns font loading, format/mockup options, and IndexedDB persistence.
- `ViewController` builds each month as an SVG "mockup": month/year titles, weekday headers and day numbers are SVG text in the embedded font, laid out with the day grid and photo placeholder.
- `DownloadManager` clones the rendered SVG mockup(s), embeds the actual photo, and rasterizes to JPG (canvas) or vectorizes to PDF.

## Tech stack

TypeScript, Vite, SCSS, `@hungrysamurai/cropper`, `jsPDF` + `svg2pdf.js`, GSAP, IndexedDB, Vitest.
