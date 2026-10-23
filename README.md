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
