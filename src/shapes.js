// Shape generators. Each returns { pos: Float32Array(n*3), col: Float32Array(n*3) }.
// Two kinds: glyphs sampled from an offscreen 2D canvas, and parametric 3D forms.

export const rnd = Math.random;
export function gauss() {
  let u = 0, v = 0;
  while (!u) u = rnd();
  while (!v) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

// Sample filled pixels of text drawn on a hidden canvas.
function glyph(text, n, { font = '900 220px system-ui, sans-serif', width = 4.2, depth = 0.35, hue = [200, 260] } = {}) {
  const c = document.createElement('canvas');
  const W = 1024, H = 384;
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = font;
  // shrink font until it fits
  let size = parseInt(font.match(/(\d+)px/)[1], 10);
  while (g.measureText(text).width > W * 0.92 && size > 20) {
    size -= 8;
    g.font = font.replace(/\d+px/, size + 'px');
  }
  g.fillText(text, W / 2, H / 2);
  const data = g.getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2)
      if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);

  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const scale = width / W;
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const k = (rnd() * count | 0) * 2;
    const x = (pts[k] + rnd() * 2 - W / 2) * scale;
    const y = -(pts[k + 1] + rnd() * 2 - H / 2) * scale;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = gauss() * depth * 0.4;
    const t = (x / width) + 0.5;
    const [r, gg, b] = hsl(hue[0] + (hue[1] - hue[0]) * t, 0.85, 0.55 + 0.2 * rnd());
    col.set([r, gg, b], i * 3);
  }
  return { pos, col };
}

function globe(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x, y, z, c;
    if (rnd() < 0.7) {
      // latitude / longitude lines
      const onLat = rnd() < 0.5;
      const a = rnd() * Math.PI * 2;
      if (onLat) {
        const lat = ((rnd() * 9 | 0) - 4) * (Math.PI / 10);
        x = Math.cos(lat) * Math.cos(a); y = Math.sin(lat); z = Math.cos(lat) * Math.sin(a);
      } else {
        const lon = (rnd() * 12 | 0) * (Math.PI / 12);
        x = Math.cos(a) * Math.cos(lon); y = Math.sin(a); z = Math.cos(a) * Math.sin(lon);
      }
      c = hsl(190 + 30 * y, 0.9, 0.6);
    } else {
      // orbit ring
      const a = rnd() * Math.PI * 2, r = 1.45 + gauss() * 0.02;
      x = Math.cos(a) * r; y = Math.sin(a) * r * 0.25; z = Math.sin(a) * r;
      c = hsl(40, 0.95, 0.65);
    }
    const R = 1.4;
    pos.set([x * R, y * R, z * R], i * 3);
    col.set(c, i * 3);
  }
  return { pos, col };
}

function knot(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const p = 2, q = 3;
  for (let i = 0; i < n; i++) {
    const t = rnd() * Math.PI * 2;
    const r = 0.9 + 0.38 * Math.cos(q * t);
    const cx = r * Math.cos(p * t), cy = r * Math.sin(p * t), cz = 0.38 * Math.sin(q * t);
    // tube around the curve
    const a = rnd() * Math.PI * 2, rr = 0.16 * Math.sqrt(rnd());
    pos.set([(cx + Math.cos(a) * rr) * 1.35, (cy + Math.sin(a) * rr) * 1.35, (cz + Math.sin(a + 1) * rr) * 1.35], i * 3);
    col.set(hsl(290 + 70 * Math.sin(t), 0.85, 0.6), i * 3);
  }
  return { pos, col };
}

function helix(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = rnd() * 4 - 2;
    const a = y * 2.4;
    let x, z, c;
    if (rnd() < 0.8) {
      const s = rnd() < 0.5 ? 0 : Math.PI;
      x = Math.cos(a + s) * 0.75; z = Math.sin(a + s) * 0.75;
      x += gauss() * 0.03; z += gauss() * 0.03;
      c = s ? hsl(160, 0.8, 0.55) : hsl(200, 0.9, 0.6);
    } else {
      // rungs
      const yy = Math.round(y * 4) / 4, aa = yy * 2.4, t = rnd() * 2 - 1;
      x = Math.cos(aa) * 0.75 * t; z = Math.sin(aa) * 0.75 * t;
      pos.set([x, yy * 0.85, z], i * 3);
      col.set(hsl(50, 0.9, 0.7), i * 3);
      continue;
    }
    pos.set([x, y * 0.85, z], i * 3);
    col.set(c, i * 3);
  }
  return { pos, col };
}

function cubeGrid(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const S = 1.05;
  for (let i = 0; i < n; i++) {
    // points on cube edges + inner lattice lines
    const axis = rnd() * 3 | 0;
    const g = () => ((rnd() * 4 | 0) / 3) * 2 - 1;
    const v = [g(), g(), g()];
    v[axis] = rnd() * 2 - 1;
    const onEdge = Math.abs(v[(axis + 1) % 3]) === 1 && Math.abs(v[(axis + 2) % 3]) === 1;
    pos.set([v[0] * S, v[1] * S, v[2] * S], i * 3);
    col.set(onEdge ? hsl(180, 0.9, 0.7) : hsl(220, 0.7, 0.45), i * 3);
  }
  return { pos, col };
}

// Sample bright pixels of an image, keeping their colors. Dark background is skipped.
import avatarUrl from './avatar-sample.png';
async function image(url, n, { width = 3.4, depth = 0.5, threshold = 0.42 } = {}) {
  const img = new Image();
  img.src = url;
  await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
      const lum = 0.3 * r + 0.55 * gg + 0.15 * b;
      const sat = Math.max(r, gg, b) - Math.min(r, gg, b);
      if (lum > threshold || (sat > 0.5 && Math.max(r, gg, b) > 0.6)) pts.push(x, y, r, gg, b, lum);
    }
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const count = pts.length / 6, s = width / W;
  for (let i = 0; i < n; i++) {
    const k = (rnd() * count | 0) * 6;
    pos[i * 3] = (pts[k] + rnd() - W / 2) * s;
    pos[i * 3 + 1] = -(pts[k + 1] + rnd() - H / 2) * s;
    pos[i * 3 + 2] = (pts[k + 5] - 0.5) * depth + gauss() * 0.04; // brighter = closer
    col.set([pts[k + 2], pts[k + 3], pts[k + 4]], i * 3);
  }
  return { pos, col };
}

// ---------- Intro: a white crane in flight (side view, heading -x) + a blue "AI" ----------
// wing[i] = distance along the wing span (0 for non-wing points); the shader flaps by it.
function flyingCrane(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), wing = new Float32Array(n);
  const S = 0.85;
  const white = (k = 0) => { const l = 0.88 + 0.12 * rnd() - k; return [l, l + 0.02, Math.min(1, l + 0.06)]; };
  for (let i = 0; i < n; i++) {
    const r = rnd();
    let p, c, w = 0;
    if (r < 0.56) {
      // wings: near (z+) and far (z-), span u along +y and depth, chord v back along -x
      const side = rnd() < 0.5 ? 1 : -1;
      const u = Math.pow(rnd(), 0.8);
      let v = rnd();
      // broad inner wing tapering to the tip; leading edge sweeps back
      const chord = 0.7 * (1 - u * 0.5);
      const lead = 0.2 - u * u * 0.55;
      let len = chord;
      if (u > 0.72) {
        // separated primary feathers ("fingers") at the tip
        const f = (v * 6) | 0, fv = v * 6 - f;
        if (fv > 0.6) v = f / 6 + rnd() * 0.1;
        len = chord * (1 + (u - 0.72) * 1.4 * (1 - f / 6));
      }
      p = [lead - v * len, 0.08 + u * 0.22 - v * 0.06 + Math.sin(v * Math.PI) * 0.05, side * (0.14 + u * 1.35)];
      w = u * 1.4;
      c = v > 0.7 ? [0.78, 0.88, 1] : white(v * 0.06); // icy trailing edge
    } else if (r < 0.71) {
      // body: ellipsoid surface
      const a = gauss(), b = gauss(), d = gauss(), L = Math.hypot(a, b, d) || 1;
      p = [a / L * 0.46, b / L * 0.15, d / L * 0.17];
      c = white();
    } else if (r < 0.81) {
      // neck reaching forward
      const t = rnd();
      p = [0.36 + 0.95 * t + gauss() * 0.02, 0.04 + 0.12 * t + gauss() * 0.03, gauss() * 0.03];
      c = white();
    } else if (r < 0.85) {
      // head with red crown
      const a = gauss(), b = gauss(), d = gauss(), L = Math.hypot(a, b, d) || 1;
      p = [1.33 + a / L * 0.07, 0.16 + b / L * 0.06, d / L * 0.06];
      c = b / L > 0.35 ? [1, 0.18, 0.15] : white();
    } else if (r < 0.88) {
      // beak
      const t = rnd();
      p = [1.39 + 0.3 * t, 0.15 - 0.03 * t + gauss() * 0.01 * (1 - t), gauss() * 0.008];
      c = [0.85, 0.82, 0.62];
    } else if (r < 0.94) {
      // legs trailing behind
      const t = rnd(), side = rnd() < 0.5 ? 1 : -1;
      p = [-0.35 - 1.0 * t, -0.07 - 0.08 * t + gauss() * 0.008, side * 0.04];
      c = [0.45, 0.5, 0.58];
    } else {
      // tail feathers
      const t = rnd();
      p = [-0.45 - 0.3 * t, 0.02 + gauss() * 0.05 * t, gauss() * 0.08 * t];
      c = white(0.15);
    }
    pos.set([-p[0] * S, p[1] * S, p[2] * S], i * 3); // mirrored: flies right-to-left
    col.set(c, i * 3);
    wing[i] = w * S;
  }
  return { pos, col, wing };
}

// group: 1 = crane, 2 = AI. Crane particles get a delay near 0, AI appears later.
export function buildIntro(n) {
  const nC = Math.floor(n * 0.45);
  const crane = flyingCrane(nC);
  const ai = glyph('AI', n - nC, { font: '900 300px system-ui, sans-serif', width: 2.6, depth: 0.5, hue: [195, 228] });
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const group = new Float32Array(n), wing = new Float32Array(n), delay = new Float32Array(n);
  pos.set(crane.pos); col.set(crane.col);
  pos.set(ai.pos, nC * 3); col.set(ai.col, nC * 3);
  wing.set(crane.wing);
  for (let i = 0; i < n; i++) {
    group[i] = i < nC ? 1 : 2;
    delay[i] = i < nC ? rnd() * 0.3 : rnd();
  }
  return { pos, col, group, wing, delay, nCrane: nC };
}

// ---------- "Care": two hands lifting up a glowing creation ----------
// Drawn with 2D canvas paths (original artwork), then sampled into particles with its colors.
export function drawCare(size = 600) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const k = size / 600;
  g.scale(k, k);
  g.fillStyle = '#000';
  g.fillRect(0, 0, 600, 600);
  g.lineCap = 'round';

  // light rays + halo behind the creation
  const cx = 300, cy = 200;
  const halo = g.createRadialGradient(cx, cy, 10, cx, cy, 150);
  halo.addColorStop(0, 'rgba(140,220,255,.55)');
  halo.addColorStop(1, 'rgba(140,220,255,0)');
  g.fillStyle = halo;
  g.beginPath(); g.arc(cx, cy, 150, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.1;
    if (Math.sin(a) > 0.55) continue; // no rays down into the hands
    const r0 = 72, r1 = i % 2 ? 150 : 190;
    const gr = g.createLinearGradient(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    gr.addColorStop(0, 'rgba(170,230,255,.95)');
    gr.addColorStop(1, 'rgba(170,230,255,0)');
    g.strokeStyle = gr; g.lineWidth = i % 2 ? 3 : 5;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke();
  }

  // the creation: a faceted gem
  const top = cy - 70, girdle = cy - 16, tip = cy + 74, w = 86, tw = 42;
  const facets = [
    [[cx - w, girdle], [cx - tw, top], [cx - 12, girdle], '#bdf0ff'],
    [[cx - tw, top], [cx + tw, top], [cx, girdle], '#e9fbff'],
    [[cx - 12, girdle], [cx - tw, top], [cx, girdle], '#a6e6ff'],
    [[cx + 12, girdle], [cx + tw, top], [cx, girdle], '#8fdcff'],
    [[cx + w, girdle], [cx + tw, top], [cx + 12, girdle], '#6ccaf7'],
    [[cx - w, girdle], [cx - 12, girdle], [cx, tip], '#5cc0f5'],
    [[cx - 12, girdle], [cx + 12, girdle], [cx, tip], '#8ad8ff'],
    [[cx + 12, girdle], [cx + w, girdle], [cx, tip], '#2f9ae6'],
  ];
  for (const [a, b, d, col] of facets) {
    g.fillStyle = col;
    g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...d); g.closePath(); g.fill();
  }
  g.strokeStyle = '#000'; g.lineWidth = 4; // facet edges read as fine gaps between particles
  for (const [a, b, d] of facets) { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...d); g.closePath(); g.stroke(); }
  // sparkles
  g.fillStyle = '#ffffff';
  for (const [x, y, r] of [[cx - 95, cy - 70, 5], [cx + 105, cy - 40, 4], [cx + 60, cy - 105, 3.5], [cx - 60, cy + 30, 3]]) {
    g.beginPath(); g.moveTo(x, y - r * 3); g.lineTo(x + r, y); g.lineTo(x, y + r * 3); g.lineTo(x - r, y); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x - r * 3, y); g.lineTo(x, y + r); g.lineTo(x + r * 3, y); g.lineTo(x, y - r); g.closePath(); g.fill();
  }

  // two open hands rising from wrists that touch at the bottom center, opening up and outward in a V,
  // palms up, fingers gently spread and curving upward, thumbs on the inner side
  const skin = (y0, y1) => {
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, '#fff3ea'); gr.addColorStop(1, '#d7b6a2');
    return gr;
  };
  // finger = black outline first, then skin on top, so neighbours stay visibly separated
  const digit = (x1, y1, cx1, cy1, x2, y2, r) => {
    g.strokeStyle = '#000'; g.lineWidth = r * 2 + 7;
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(cx1, cy1, x2, y2); g.stroke();
    g.strokeStyle = skin(y2 - 20, y1 + 30); g.lineWidth = r * 2;
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(cx1, cy1, x2, y2); g.stroke();
  };
  const hand = (side) => {
    g.save();
    g.translate(300, 0);
    g.scale(side, 1);
    // forearm, nearly vertical, touching the other one at the center
    g.fillStyle = skin(470, 600);
    g.beginPath();
    g.moveTo(3, 600); g.lineTo(6, 500); g.quadraticCurveTo(10, 470, 22, 455);
    g.lineTo(92, 470); g.quadraticCurveTo(76, 520, 70, 600); g.closePath(); g.fill();
    // fingers fan up and outward from the knuckles, tips curling slightly inward (cupped)
    digit(186, 372, 212, 342, 226, 306, 12.5);  // little finger
    digit(160, 356, 186, 312, 192, 268, 15);    // ring
    digit(132, 346, 150, 296, 150, 248, 16.5);  // middle
    digit(104, 350, 112, 304, 106, 262, 15.5);  // index
    // thumb on the inner side, pointing up and slightly out
    digit(56, 408, 38, 372, 44, 322, 15);
    // palm drawn last so it covers the finger roots cleanly
    g.fillStyle = skin(330, 480);
    g.beginPath();
    g.moveTo(20, 458);
    g.quadraticCurveTo(14, 410, 58, 372);
    g.lineTo(100, 344);
    g.quadraticCurveTo(150, 336, 190, 372);
    g.quadraticCurveTo(170, 440, 94, 470);
    g.closePath(); g.fill();
    // palm creases
    g.strokeStyle = '#000'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(66, 392); g.quadraticCurveTo(120, 372, 176, 388); g.stroke();
    g.beginPath(); g.moveTo(58, 420); g.quadraticCurveTo(80, 440, 70, 456); g.stroke();
    g.restore();
  };
  hand(-1); hand(1);
  // where the two wrists meet
  g.strokeStyle = '#000'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(300, 470); g.lineTo(300, 600); g.stroke();
  return c;
}

function sampleCanvas(c, n, { width = 3.6, depth = 0.3, threshold = 0.25, ySquash = 1, skinKeep = 1 } = {}) {
  const W = c.width, H = c.height;
  const d = c.getContext('2d').getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * 4;
      const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
      const lum = 0.3 * r + 0.55 * gg + 0.15 * b;
      // keep faint halo pixels only sometimes, so the glow reads as soft dust
      if (!(lum > threshold || (lum > 0.08 && rnd() < lum * 1.5))) continue;
      // skin (warm, r > b) is a big area: thin it out so the glowing creation gets more particles
      if (r > b + 0.06 && rnd() > skinKeep) continue;
      pts.push(x, y, r, gg, b, lum);
    }
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const count = pts.length / 6, s = width / W;
  for (let i = 0; i < n; i++) {
    const k = (rnd() * count | 0) * 6;
    pos[i * 3] = (pts[k] + rnd() * 2 - W / 2) * s;
    pos[i * 3 + 1] = -(pts[k + 1] + rnd() * 2 - H / 2) * s * ySquash;
    pos[i * 3 + 2] = (pts[k + 5] - 0.5) * depth + gauss() * 0.03;
    col.set([pts[k + 2], pts[k + 3], pts[k + 4]], i * 3);
  }
  return { pos, col };
}

// Edit this list to make the hero about you. build() may return a Promise.
export const SHAPES = [
// Captions come from i18n.js (DICT[lang].shapes[key]).
  { key: 'crane', build: (n) => image(avatarUrl, n, { width: 3.7, depth: 0.22, threshold: 0.5 }) },
  { key: 'care', build: (n) => sampleCanvas(drawCare(600), n, { width: 3.8, skinKeep: 0.42 }) },
  { key: 'auto', build: knot },
  { key: 'data', build: helix },
  { key: 'web', build: globe },
  { key: 'system', build: cubeGrid },
];
