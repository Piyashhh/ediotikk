import React, { useId } from 'react';

/*
  Glow: the Photoshop recipe, in code.
  1. Draw shapes with the Pen Tool      -> blob() / shape()
  2. Fill them with different colours   -> the [fill, points] layers
  3. Apply Gaussian Blur                -> feGaussianBlur (blur = sigma, in artboard units)

  Edit a scene like you would an artboard: move a layer's centre/size, change its colour,
  or raise `blur` for a softer wash. Layers paint bottom -> top.
*/

// A closed, smooth curve through the points (Catmull-Rom converted to cubic Béziers).
const shape = pts => {
  const n = pts.length, r = v => +v.toFixed(1);
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i + n - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + 'Z';
};

// An irregular blob: centre, radii, a wobble per anchor point (k), and a rotation.
const blob = (cx, cy, rx, ry, k = [1, .86, 1.12, .92, 1.08, .8], rot = 0) =>
  k.map((m, i) => {
    const a = rot + (i / k.length) * Math.PI * 2;
    return [cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m];
  });

const SCENES = {
  // Hero: warm ember core, amber + rose lift, one cool periwinkle to make the orange sing.
  hero: {
    w: 1200, h: 800, bg: '#f3f0e9', blur: 58,
    layers: [
      ['#ffd8bb', blob(600, 430, 430, 300, [1, .9, 1.1, .95, 1.05, .88, 1.02], .3)],
      ['#c9b6ff', blob(110, 130, 130, 120, [1, .9, 1.1, .85, 1.1, .95], 1)],
      ['#92a8ff', blob(300, 215, 175, 135, [1, .9, 1.1, .85, 1.12, .95], 2)],
      ['#f15a24', blob(430, 520, 250, 200, [1, .8, 1.15, .9, 1.1, .78, 1.05], .6)],
      ['#f15a24', blob(70, 650, 150, 130, [1, .85, 1.1, .9, 1.1, .8], 1.4)],
      ['#ffb23e', blob(745, 470, 205, 170, [1, 1.1, .85, 1.12, .9, 1.05], 1.1)],
      ['#ff6f91', blob(885, 250, 190, 150, [1, .85, 1.1, .9, 1.15, .8], .2)],
      ['#ff6f91', blob(1140, 570, 150, 140, [1, .9, 1.1, .85, 1.1, .9], .8)],
      ['#ffb23e', blob(1110, 120, 140, 110, [1, .85, 1.1, .9, 1.12, .88], 2.4)],
    ],
  },
  // Pujodex: marigold, sindoor and a little river teal.
  pujo: {
    w: 800, h: 600, bg: '#f4e6cd', blur: 52,
    layers: [
      ['#fff3dc', blob(400, 170, 230, 130, [1, .9, 1.1, .9, 1.1, .9], .3)],
      ['#ffb000', blob(240, 340, 270, 230, [1, .85, 1.12, .9, 1.1, .8], .4)],
      ['#37a3a0', blob(95, 520, 130, 110, [1, .9, 1.1, .85, 1.12, .9], 1.2)],
      ['#ee3b22', blob(540, 330, 230, 210, [1, .82, 1.14, .9, 1.1, .8], 1.3)],
      ['#c2185b', blob(700, 500, 150, 130, [1, .9, 1.1, .85, 1.12, .9], .6)],
    ],
  },
  // WedMemories: blush, rose, gold, a touch of sage.
  wedding: {
    w: 800, h: 600, bg: '#f4e0d4', blur: 52,
    layers: [
      ['#ffe3da', blob(400, 160, 240, 130, [1, .9, 1.1, .9, 1.1, .9], .3)],
      ['#f2a1b0', blob(240, 320, 260, 220, [1, .85, 1.12, .9, 1.1, .8], .5)],
      ['#b9ccaa', blob(115, 520, 130, 105, [1, .9, 1.1, .85, 1.12, .9], 1.1)],
      ['#f6c977', blob(570, 330, 235, 200, [1, .84, 1.14, .9, 1.1, .8], 1.2)],
      ['#d9879f', blob(690, 510, 150, 125, [1, .9, 1.1, .85, 1.12, .9], .7)],
    ],
  },
  // Personal homepage: the brand orange, pushed warmer and cooler.
  personal: {
    w: 1200, h: 500, bg: '#f15a24', blur: 54,
    layers: [
      ['#e0301e', blob(300, 330, 300, 200, [1, .85, 1.12, .9, 1.1, .8], .3)],
      ['#ffb23e', blob(640, 220, 260, 160, [1, .86, 1.12, .9, 1.1, .8], 1)],
      ['#ff7a9a', blob(980, 330, 250, 170, [1, .86, 1.12, .9, 1.1, .8], .6)],
      ['#ffd0a8', blob(820, 90, 200, 100, [1, .9, 1.1, .9, 1.1, .9], 0)],
    ],
  },
  // Contact: night with an ember glow rising from the bottom.
  contact: {
    w: 1200, h: 900, bg: '#242321', blur: 85, fit: 'xMidYMax slice',
    layers: [
      ['#4a3cf0', blob(880, 560, 210, 170, [1, .85, 1.12, .9, 1.1, .8], .4)],
      ['#c2185b', blob(560, 800, 290, 170, [1, .86, 1.12, .9, 1.1, .8], .2)],
      ['#f15a24', blob(720, 780, 300, 190, [1, .85, 1.12, .9, 1.1, .8], .9)],
      ['#ff9a3c', blob(800, 830, 130, 90, [1, .9, 1.1, .9, 1.1, .9], 0)],
    ],
  },
  // Reel cards without a thumbnail.
  reel: {
    w: 400, h: 711, bg: '#242321', blur: 42,
    layers: [
      ['#4a3cf0', blob(90, 170, 140, 120, [1, .85, 1.12, .9, 1.1, .8], .4)],
      ['#f15a24', blob(300, 250, 170, 150, [1, .85, 1.12, .9, 1.1, .8], .9)],
      ['#c2185b', blob(110, 520, 170, 140, [1, .86, 1.12, .9, 1.1, .8], .2)],
      ['#ffb23e', blob(310, 600, 120, 100, [1, .9, 1.1, .9, 1.1, .9], 1.4)],
    ],
  },
  // Viewer backdrop for reels without a thumbnail: full-strength colour on near-black.
  viewer: {
    w: 1200, h: 900, bg: '#141413', blur: 90,
    layers: [
      ['#5a49ff', blob(250, 230, 300, 230, [1, .85, 1.12, .9, 1.1, .8], .4)],
      ['#ff6a2b', blob(940, 340, 320, 240, [1, .85, 1.12, .9, 1.1, .8], .9)],
      ['#e0246f', blob(640, 770, 360, 210, [1, .86, 1.12, .9, 1.1, .8], .2)],
      ['#ffb23e', blob(980, 600, 150, 120, [1, .9, 1.1, .9, 1.1, .9], 1.4)],
    ],
  },
};

export function Glow({ scene, grain = true }) {
  const s = SCENES[scene];
  const id = 'glow-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const m = s.blur * 3; // filter region margin, so the blur never clips at the edges
  return <>
    <svg className="glow" viewBox={`0 0 ${s.w} ${s.h}`} preserveAspectRatio={s.fit || 'xMidYMid slice'} aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} filterUnits="userSpaceOnUse" x={-m} y={-m} width={s.w + m * 2} height={s.h + m * 2} colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={s.blur} />
        </filter>
      </defs>
      <rect width={s.w} height={s.h} fill={s.bg} />
      <g filter={`url(#${id})`}>
        {s.layers.map(([fill, pts], i) => <path key={i} d={shape(pts)} fill={fill} />)}
      </g>
    </svg>
    {grain && <i className="grain" aria-hidden="true" />}
  </>;
}
