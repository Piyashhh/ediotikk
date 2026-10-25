import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imageSize } from 'image-size';

const root = path.dirname(fileURLToPath(import.meta.url));

// Reads every photo/design's pixel size at build time, so the page can lay images out
// (justified rows, no layout jump) before a single image has downloaded.
// Exposed as `import sizes from 'virtual:media-sizes'` -> { 'photography/1.jpg': [w, h], ... }
function mediaSizes() {
  const id = 'virtual:media-sizes';
  return {
    name: 'media-sizes',
    resolveId(source) { return source === id ? '\0' + id : null; },
    load(resolved) {
      if (resolved !== '\0' + id) return null;
      const sizes = {};
      for (const dir of ['photography', 'graphic-design']) {
        const folder = path.join(root, 'media', dir);
        if (!fs.existsSync(folder)) continue;
        for (const file of fs.readdirSync(folder)) {
          this.addWatchFile(path.join(folder, file));
          try {
            const { width, height, orientation } = imageSize(fs.readFileSync(path.join(folder, file)));
            // EXIF orientation 5-8 means the browser shows the photo rotated 90°
            sizes[`${dir}/${file}`] = orientation >= 5 ? [height, width] : [width, height];
          } catch { /* not an image we can read: layout falls back to 3:2 */ }
        }
      }
      return `export default ${JSON.stringify(sizes)}`;
    },
  };
}

export default defineConfig({
  plugins: [react(), mediaSizes()],
  base: '/ediotikk/',
});
