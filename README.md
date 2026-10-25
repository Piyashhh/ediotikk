# Ediotikk portfolio starter

A React + Vite portfolio. Media is kept in the separate `media/` directory. Vite discovers the media files at build time and fingerprints them for production. The media stays in its own root-level directory, separate from the React source.

## Media folders

- `media/photography/` — numbered photos (`1.jpg`, `2.jpg`, `3.webp`, etc.). Files are ordered numerically, including filenames such as `photo-2.jpg` and `photo-10.jpg`.
- `media/videos/reel-01.mp4`
- `media/videos/reel-02.mp4`
- `media/videos/bts-01.mp4`
- `media/videos/pujodex-promo.mp4` — optional personal project reel
- `media/thumbnails/reel-01.jpg`, `reel-02.jpg`, `bts-01.jpg` — optional; fallback artwork appears if missing.
- `media/graphic-design/` — design images; a placeholder remains until files are added.

## Run locally

Install Node.js, unzip the project, open a terminal in this folder, then run:

```sh
npm install
npm run dev
```

Build for deployment:

```sh
npm run build
```

## Before publishing

1. Add your videos using the exact filenames above, or update the `videos` array in `src/main.jsx`.
2. Add photos to `media/photography/`.
3. Add design experiments to `media/graphic-design/` whenever ready.
4. The current video files may be 50–100 MB each. Replace with web-ready MP4 files before public launch; otherwise the page may load slowly and the Git repository will grow quickly.
5. GitHub Pages requires a deployment workflow for Vite's `dist/` output; it does not serve this source folder directly as a built React site.

## Design notes

- **Wordmark / display font:** Geom (OFL), self-hosted from `src/fonts/` — no Google Fonts request. Body is Manrope, labels are DM Mono (both via `@fontsource`).
- **Blurred colour backgrounds:** `src/glow.jsx`. Each scene is a list of `[colour, shape]` layers — the Pen Tool → fill → Gaussian Blur workflow. Move a blob by changing its centre/radii in `blob(cx, cy, rx, ry)`, recolour it with the hex value, soften the whole scene with `blur`. Scenes: `hero`, `pujo`, `wedding`, `personal`, `contact`, `reel`, `viewer`.
- **Photography:** justified rows (every row fills the width at one height, nothing cropped). Photo sizes are read at build time by `vite.config.js` (`virtual:media-sizes`), so the layout is ready before images load. Tune row height / photos per row in `justify()` in `src/main.jsx`.
- **Graphic design:** one poster per row on phones, 2–3 masonry columns on wider screens.
- **Viewer:** tap a photo, design or reel to open it. Swipe or use the arrows to step through; `Esc` closes. The backdrop is a blurred, full-strength copy of the work itself (reels use their thumbnail; reels with no thumbnail fall back to the `viewer` glow). Videos get a 1px cream border.
