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

// ---------- Heart: a lit 3D heart surface ----------
// Implicit surface (x² + 9/4·y² + z² − 1)³ − x²·z³ − 9/80·y²·z³ = 0, with z as "up".
const heartF = (x, y, z) => {
  const a = x * x + 2.25 * y * y + z * z - 1;
  return a * a * a - x * x * z * z * z - 0.1125 * y * y * z * z * z;
};
function heart(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const light = [0.45, 0.55, 0.7]; // from upper-left-front
  const ll = Math.hypot(...light); light.forEach((v, i) => (light[i] = v / ll));
  const S = 1.12;
  for (let i = 0; i < n; i++) {
    // random direction from the center, binary-search the surface along it
    let dx = gauss(), dy = gauss(), dz = gauss();
    const l = Math.hypot(dx, dy, dz) || 1; dx /= l; dy /= l; dz /= l;
    let lo = 0, hi = 1.6;
    for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; heartF(dx * m, dy * m, dz * m) < 0 ? (lo = m) : (hi = m); }
    const surface = rnd() < 0.88;
    const r = surface ? lo : lo * Math.cbrt(rnd()) * 0.95;
    const x = dx * r, y = dy * r, z = dz * r;
    // screen space: X = x, Y = z (up), Z = y (depth)
    pos.set([x * S, (z - 0.1) * S, y * S * 0.9], i * 3);
    let c;
    if (surface) {
      const e = 1e-3;
      const nx = heartF(x + e, y, z) - heartF(x - e, y, z);
      const ny = heartF(x, y, z + e) - heartF(x, y, z - e);
      const nz = heartF(x, y + e, z) - heartF(x, y - e, z);
      const nl = Math.hypot(nx, ny, nz) || 1;
      const N = [nx / nl, ny / nl, nz / nl];
      const diff = Math.max(0, N[0] * light[0] + N[1] * light[1] + N[2] * light[2]);
      // Blinn-Phong highlight (viewer looks down -Z) + soft pink rim light
      const H = [light[0], light[1], light[2] + 1], hl = Math.hypot(...H);
      const spec = Math.pow(Math.max(0, (N[0] * H[0] + N[1] * H[1] + N[2] * H[2]) / hl), 40);
      const rim = Math.pow(1 - Math.max(0, N[2]), 2.5);
      const base = hsl(330 + 10 * (z + 1) / 2, 0.9, 0.52 + 0.1 * (z + 1) / 2);
      c = base.map((v, k) => Math.min(1, v * (0.45 + 0.85 * diff) + spec * 0.9 + rim * [1, 0.55, 0.7][k] * 0.35));
    } else {
      c = hsl(328, 0.85, 0.44); // inner glow
    }
    col.set(c, i * 3);
  }
  return { pos, col };
}

// ---------- Tool badges: rounded tiles with a large tool name and a simple generic icon ----------
// Tool names are shown as text (no brand logos), in the site palette.
function badgeCanvas(size = 640) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.scale(size / 640, size / 640);
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 640);
  g.lineCap = 'round'; g.lineJoin = 'round';
  return [c, g];
}
const PAL = { cy: '#5fd4ff', pu: '#b98cff', am: '#ffb86b', wh: '#eef6ff', te: '#3ddcb4', pk: '#ff7ab8' };
// generic icons (not brand marks)
function toolIcon(g, kind, x, y, s, col) {
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 0.09 * s;
  if (kind === 'code') { // </>
    g.beginPath(); g.moveTo(x - 0.15 * s, y - 0.25 * s); g.lineTo(x - 0.4 * s, y); g.lineTo(x - 0.15 * s, y + 0.25 * s); g.stroke();
    g.beginPath(); g.moveTo(x + 0.15 * s, y - 0.25 * s); g.lineTo(x + 0.4 * s, y); g.lineTo(x + 0.15 * s, y + 0.25 * s); g.stroke();
    g.beginPath(); g.moveTo(x + 0.07 * s, y - 0.32 * s); g.lineTo(x - 0.07 * s, y + 0.32 * s); g.stroke();
  } else if (kind === 'window') { // site builder / CMS
    g.strokeRect(x - 0.4 * s, y - 0.3 * s, 0.8 * s, 0.6 * s);
    g.beginPath(); g.moveTo(x - 0.4 * s, y - 0.12 * s); g.lineTo(x + 0.4 * s, y - 0.12 * s); g.stroke();
    g.fillRect(x - 0.3 * s, y - 0.02 * s, 0.26 * s, 0.22 * s);
    g.beginPath(); g.moveTo(x + 0.04 * s, y + 0.02 * s); g.lineTo(x + 0.3 * s, y + 0.02 * s); g.moveTo(x + 0.04 * s, y + 0.16 * s); g.lineTo(x + 0.24 * s, y + 0.16 * s); g.stroke();
  } else if (kind === 'cart') { // online store
    g.beginPath(); g.moveTo(x - 0.42 * s, y - 0.28 * s); g.lineTo(x - 0.28 * s, y - 0.28 * s); g.lineTo(x - 0.16 * s, y + 0.14 * s); g.lineTo(x + 0.3 * s, y + 0.14 * s); g.lineTo(x + 0.38 * s, y - 0.16 * s); g.lineTo(x - 0.22 * s, y - 0.16 * s); g.stroke();
    for (const dx of [-0.1, 0.24]) { g.beginPath(); g.arc(x + dx * s, y + 0.3 * s, 0.06 * s, 0, Math.PI * 2); g.fill(); }
  } else if (kind === 'pen') { // vector pen tool + bezier curve with anchor points
    g.beginPath(); g.moveTo(x - 0.42 * s, y + 0.2 * s); g.bezierCurveTo(x - 0.2 * s, y - 0.45 * s, x + 0.2 * s, y + 0.45 * s, x + 0.42 * s, y - 0.2 * s); g.stroke();
    for (const [ax, ay] of [[-0.42, 0.2], [0.42, -0.2]]) g.fillRect(x + ax * s - 0.07 * s, y + ay * s - 0.07 * s, 0.14 * s, 0.14 * s);
    g.beginPath(); g.moveTo(x - 0.05 * s, y - 0.42 * s); g.lineTo(x + 0.1 * s, y - 0.12 * s); g.lineTo(x - 0.05 * s, y - 0.02 * s); g.lineTo(x - 0.2 * s, y - 0.12 * s); g.closePath(); g.stroke();
  } else if (kind === 'layers') { // stacked layers (photo editing)
    for (const dy of [0.2, 0, -0.2]) {
      g.beginPath(); g.moveTo(x, y + dy * s - 0.16 * s); g.lineTo(x + 0.4 * s, y + dy * s); g.lineTo(x, y + dy * s + 0.16 * s); g.lineTo(x - 0.4 * s, y + dy * s); g.closePath();
      if (dy < 0) g.fill(); else g.stroke();
    }
  }
}
function badge(g, x, y, w, h, name, icon, col, fontPx) {
  g.strokeStyle = col; g.lineWidth = 6;
  g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 22); g.stroke();
  const iconS = Math.min(w, h) * 0.42;
  toolIcon(g, icon, x, y - h * 0.16, iconS, col);
  g.fillStyle = PAL.wh; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `800 ${fontPx}px 'Space Grotesk', system-ui, sans-serif`;
  let size = fontPx;
  while (g.measureText(name).width > w - 24 && size > 14) { size -= 2; g.font = `800 ${size}px 'Space Grotesk', system-ui, sans-serif`; }
  g.fillText(name, x, y + h * 0.28);
}

// ---------- Design: Figma + Photoshop ----------
export function drawDesignTools(size = 640) {
  const [c, g] = badgeCanvas(size);
  // connecting dashed arc: idea -> design
  g.strokeStyle = PAL.pu; g.lineWidth = 4; g.setLineDash([12, 10]);
  g.beginPath(); g.moveTo(196, 400); g.quadraticCurveTo(320, 470, 444, 400); g.stroke(); g.setLineDash([]);
  badge(g, 180, 290, 220, 240, 'Figma', 'pen', PAL.cy, 54);
  badge(g, 460, 290, 220, 240, 'Photoshop', 'layers', PAL.pu, 48);
  // small sparkles in the warm accent
  g.fillStyle = PAL.am;
  for (const [x, y, r] of [[320, 180, 14], [92, 140, 9], [560, 450, 10]]) {
    g.beginPath(); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.3 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill();
  }
  return c;
}

// ---------- Web & system development: the tools I build with ----------
export function drawTechStack(size = 640) {
  const [c, g] = badgeCanvas(size);
  const CX = 320, CY = 320;
  const tools = [
    ['Python', 'code', PAL.cy], ['Node.js', 'code', PAL.te], ['PHP', 'code', PAL.pu],
    ['STUDIO', 'window', PAL.cy], ['WordPress', 'window', PAL.pu], ['Wix', 'window', PAL.te], ['Shopify', 'cart', PAL.am],
  ];
  const R = 215;
  const pts = tools.map((_, i) => { const a = -Math.PI / 2 + (i / tools.length) * Math.PI * 2; return [CX + Math.cos(a) * R, CY + Math.sin(a) * R]; });
  // spokes to the center
  g.strokeStyle = 'rgba(95,212,255,.8)'; g.lineWidth = 3; g.setLineDash([10, 8]);
  for (const [x, y] of pts) { g.beginPath(); g.moveTo(CX, CY); g.lineTo(x, y); g.stroke(); }
  g.setLineDash([]);
  // center: your build
  g.strokeStyle = PAL.wh; g.lineWidth = 6; g.beginPath(); g.arc(CX, CY, 62, 0, Math.PI * 2); g.stroke();
  toolIcon(g, 'code', CX, CY, 92, PAL.wh);
  tools.forEach(([name, icon, col], i) => badge(g, pts[i][0], pts[i][1], 168, 116, name, icon, col, 32));
  return c;
}

// ---------- Automation & AI: input -> AI gear -> chat / booking / report, with data flowing along ----------
// Site palette: cyan + purple base, warm amber accent.
export function drawAutomation(size = 640) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.scale(size / 640, size / 640);
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 640);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const CY = '#5fd4ff', PU = '#b98cff', WH = '#eef6ff', AM = '#ffb86b', TEAL = '#3ddcb4';
  const GX = 320, GY = 300;

  // flow arrows (drawn first, behind the nodes): dashed line + arrowhead + amber data packets
  const arrow = (pts, packets) => {
    g.strokeStyle = CY; g.lineWidth = 4; g.setLineDash([14, 10]);
    g.beginPath(); pts.forEach((q, i) => (i ? g.lineTo(...q) : g.moveTo(...q))); g.stroke();
    g.setLineDash([]);
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1], a = Math.atan2(y2 - y1, x2 - x1);
    g.fillStyle = CY; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - Math.cos(a - 0.45) * 18, y2 - Math.sin(a - 0.45) * 18); g.lineTo(x2 - Math.cos(a + 0.45) * 18, y2 - Math.sin(a + 0.45) * 18); g.closePath(); g.fill();
    g.fillStyle = AM;
    for (const t of packets) {
      const seg = t * (pts.length - 1), i = Math.min(pts.length - 2, seg | 0), f = seg - i;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      g.beginPath(); g.arc(x, y, 7, 0, Math.PI * 2); g.fill();
    }
  };
  arrow([[180, GY], [238, GY]], [0.45]);
  arrow([[402, GY - 30], [450, GY - 30], [450, 150], [478, 150]], [0.3, 0.75]);
  arrow([[404, GY], [478, GY]], [0.5]);
  arrow([[402, GY + 30], [450, GY + 30], [450, 450], [478, 450]], [0.35, 0.8]);

  // input: a form / document card
  g.strokeStyle = CY; g.lineWidth = 6; g.beginPath(); g.roundRect(48, 205, 128, 190, 14); g.stroke();
  g.strokeStyle = WH; g.lineWidth = 5;
  g.beginPath(); g.moveTo(72, 240); g.lineTo(150, 240); g.stroke();
  for (const y of [282, 322]) { g.strokeRect(72, y - 12, 24, 24); g.beginPath(); g.moveTo(108, y); g.lineTo(152, y); g.stroke(); }
  g.strokeStyle = AM; g.beginPath(); g.moveTo(77, 282); g.lineTo(83, 289); g.lineTo(92, 275); g.stroke(); // ticked box
  g.strokeStyle = PU; g.lineWidth = 6; g.beginPath(); g.roundRect(72, 352, 80, 22, 11); g.stroke();      // submit button

  // AI gear in the middle with a spark
  const teeth = 12, rO = 86, rI = 70;
  g.beginPath();
  for (let i = 0; i < teeth * 2; i++) { const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2; g.arc(GX, GY, i % 2 ? rI : rO, a0 + 0.03, a1 - 0.03); }
  g.closePath(); g.strokeStyle = CY; g.lineWidth = 7; g.stroke();
  g.strokeStyle = PU; g.lineWidth = 6; g.beginPath(); g.arc(GX, GY, 50, 0, Math.PI * 2); g.stroke();
  const spark = (x, y, r, col) => {
    g.fillStyle = col; g.beginPath();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    g.closePath(); g.fill();
  };
  spark(GX - 6, GY + 4, 32, WH); spark(GX + 22, GY - 22, 12, AM);
  // circular "runs by itself" arrow under the gear
  g.strokeStyle = PU; g.lineWidth = 5; g.beginPath(); g.arc(GX, GY, 118, Math.PI * 0.25, Math.PI * 0.75); g.stroke();
  const ex = GX + Math.cos(Math.PI * 0.75) * 118, ey = GY + Math.sin(Math.PI * 0.75) * 118;
  g.fillStyle = PU; g.beginPath(); g.moveTo(ex - 4, ey + 14); g.lineTo(ex - 14, ey - 8); g.lineTo(ex + 12, ey - 4); g.closePath(); g.fill();

  // outputs: chat message, calendar booking, report
  const card = (x, y) => { g.strokeStyle = CY; g.lineWidth = 6; g.beginPath(); g.roundRect(x, y - 56, 112, 112, 18); g.stroke(); };
  card(484, 150); card(484, 300); card(484, 450);
  // chat bubble with three dots
  g.fillStyle = TEAL; g.beginPath(); g.roundRect(504, 118, 72, 50, 14); g.fill();
  g.beginPath(); g.moveTo(520, 166); g.lineTo(514, 184); g.lineTo(536, 166); g.closePath(); g.fill();
  g.fillStyle = '#000'; for (const dx of [-16, 0, 16]) { g.beginPath(); g.arc(540 + dx, 143, 5, 0, Math.PI * 2); g.fill(); }
  // calendar with a check
  g.strokeStyle = WH; g.lineWidth = 5; g.strokeRect(508, 274, 64, 56);
  g.beginPath(); g.moveTo(508, 290); g.lineTo(572, 290); g.moveTo(524, 266); g.lineTo(524, 280); g.moveTo(556, 266); g.lineTo(556, 280); g.stroke();
  g.strokeStyle = AM; g.lineWidth = 6; g.beginPath(); g.moveTo(524, 310); g.lineTo(536, 321); g.lineTo(558, 300); g.stroke();
  // bar chart report
  g.fillStyle = PU; [[512, 30], [532, 46], [552, 22], [572, 58]].forEach(([x, h]) => g.fillRect(x - 7, 478 - h, 14, h));
  g.strokeStyle = WH; g.lineWidth = 4; g.beginPath(); g.moveTo(500, 480); g.lineTo(584, 480); g.stroke();
  g.strokeStyle = AM; g.lineWidth = 4; g.beginPath(); g.moveTo(508, 440); g.lineTo(530, 428); g.lineTo(552, 446); g.lineTo(578, 418); g.stroke();
  return c;
}

// ---------- Rose in full bloom (gratitude): illustrated, layered petals with bright rims ----------
export function drawRose(size = 640) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.scale(size / 640, size / 640);
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 640);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const CX = 320, CY = 225;
  const P = (r, a) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.86]; // slight top-down squash

  // stem with thorns
  g.strokeStyle = '#2a9d94'; g.lineWidth = 13;
  g.beginPath(); g.moveTo(CX, CY + 110); g.bezierCurveTo(CX + 10, 420, CX - 22, 520, CX - 6, 630); g.stroke();
  g.strokeStyle = '#9ff3e6'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(CX - 4, CY + 115); g.bezierCurveTo(CX + 6, 420, CX - 26, 520, CX - 10, 630); g.stroke();
  g.fillStyle = '#5fd4c8';
  for (const [x, y, d] of [[CX + 9, 400, 1], [CX - 16, 488, -1], [CX - 10, 575, 1]]) {
    g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + d * 16, y - 14); g.lineTo(x, y + 4); g.closePath(); g.fill();
  }
  // leaves: serrated edge, bright rim, center vein and side veins
  const leaf = (bx, by, ang, len, wid) => {
    g.save(); g.translate(bx, by); g.rotate(ang);
    const edge = (side) => { const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20, w = Math.sin(Math.PI * t) * wid * (1 + (i % 2 ? 0.12 : 0)); pts.push([t * len, side * w]); } return pts; };
    const top = edge(-1), bot = edge(1);
    g.beginPath(); g.moveTo(0, 0); top.forEach((q) => g.lineTo(...q)); bot.reverse().forEach((q) => g.lineTo(...q)); g.closePath();
    const lg = g.createLinearGradient(0, -wid, 0, wid); lg.addColorStop(0, '#34c3b0'); lg.addColorStop(1, '#1d7f86');
    g.fillStyle = lg; g.fill();
    g.strokeStyle = '#9ff3e6'; g.lineWidth = 3.5; g.stroke();
    g.save(); g.clip();
    g.strokeStyle = '#d2fbf4'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 0); g.lineTo(len - 6, 0); g.stroke();
    g.lineWidth = 2;
    for (let t = 0.2; t < 0.85; t += 0.16) { g.beginPath(); g.moveTo(t * len, 0); g.lineTo(t * len + 22, -wid * 0.62); g.moveTo(t * len, 0); g.lineTo(t * len + 22, wid * 0.62); g.stroke(); }
    g.restore();
    g.restore();
  };
  leaf(CX + 2, 455, Math.PI + 0.45, 150, 40);
  leaf(CX - 14, 530, -0.35, 140, 36);

  // one petal: rounded, slightly wavy tip, radial shading, bright rim along its outer edge
  const petal = (ang, r0, r1, halfW, dark, light) => {
    const a0 = ang - halfW, a1 = ang + halfW;
    const path = new Path2D();
    path.moveTo(...P(r0, ang - halfW * 0.5));
    path.quadraticCurveTo(...P(r1 * 0.92, a0 - 0.08), ...P(r1, ang - halfW * 0.35));
    path.quadraticCurveTo(...P(r1 * 1.07, ang), ...P(r1, ang + halfW * 0.35));
    path.quadraticCurveTo(...P(r1 * 0.92, a1 + 0.08), ...P(r0, ang + halfW * 0.5));
    path.closePath();
    const gr = g.createRadialGradient(CX, CY, r0, CX, CY, r1 * 1.05);
    gr.addColorStop(0, dark); gr.addColorStop(1, light);
    g.fillStyle = gr; g.fill(path);
    // rim: only the outer edge, so neighbouring petals stay separated
    const rim = new Path2D();
    rim.moveTo(...P(r1 * 0.8, a0 + 0.02));
    rim.quadraticCurveTo(...P(r1 * 0.92, a0 - 0.08), ...P(r1, ang - halfW * 0.35));
    rim.quadraticCurveTo(...P(r1 * 1.07, ang), ...P(r1, ang + halfW * 0.35));
    rim.quadraticCurveTo(...P(r1 * 0.92, a1 + 0.08), ...P(r1 * 0.8, a1 - 0.02));
    g.strokeStyle = '#000'; g.lineWidth = 7; g.stroke(rim);       // thin dark gap behind the rim
    g.strokeStyle = '#ffe3f2'; g.lineWidth = 4; g.stroke(rim);
  };
  // back to front: outer layers first, each layer rotated so petals overlap like a real rose
  const layers = [
    { n: 6, r0: 50, r1: 150, w: 0.62, off: 0.0, dark: '#a8246e', light: '#ff5fae' },
    { n: 5, r0: 40, r1: 120, w: 0.66, off: 0.55, dark: '#b42a78', light: '#ff70b7' },
    { n: 5, r0: 30, r1: 92, w: 0.66, off: 0.15, dark: '#c03282', light: '#ff82c0' },
    { n: 4, r0: 22, r1: 66, w: 0.78, off: 0.9, dark: '#cc3a8c', light: '#ff95ca' },
  ];
  for (const L of layers) for (let i = 0; i < L.n; i++) petal(L.off + (i / L.n) * Math.PI * 2, L.r0, L.r1, L.w, L.dark, L.light);

  // spiral center: tightly wrapped inner petals
  g.fillStyle = '#b02a78'; g.beginPath(); g.ellipse(CX, CY, 44, 38, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#ffd9ee'; g.lineWidth = 4;
  g.beginPath();
  for (let t = 0; t < Math.PI * 5; t += 0.08) { const r = 4 + t * 2.6; const q = [CX + Math.cos(t) * r, CY + Math.sin(t) * r * 0.86]; t ? g.lineTo(...q) : g.moveTo(...q); }
  g.stroke();
  return c;
}

function sampleDrawing(c, n, { width = 4.2, depth = 0.1, threshold = 0.3 } = {}) {
  const W = c.width, H = c.height;
  const d = c.getContext('2d').getImageData(0, 0, W, H).data;
  // candidates: every pixel bright enough to be part of a line or fill (no faint glow haze)
  const pts = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
      const lum = 0.3 * r + 0.55 * gg + 0.15 * b;
      if (lum > threshold) pts.push(x, y, r, gg, b, lum);
    }
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const count = pts.length / 6, s = width / W;
  for (let i = 0; i < n; i++) {
    // brighter pixels are picked more often, so crisp strokes get the most particles
    let k;
    do { k = (rnd() * count | 0) * 6; } while (rnd() > 0.35 + 0.65 * pts[k + 5]);
    pos[i * 3] = (pts[k] + rnd() - W / 2) * s;
    pos[i * 3 + 1] = -(pts[k + 1] + rnd() - H / 2) * s;
    pos[i * 3 + 2] = (pts[k + 5] - 0.5) * depth + gauss() * 0.01;
    col.set([pts[k + 2], pts[k + 3], pts[k + 4]], i * 3);
  }
  return { pos, col };
}

// Edit this list to make the hero about you. build() may return a Promise.
export const SHAPES = [
// Captions come from i18n.js (DICT[lang].shapes[key]).
  { key: 'crane', build: (n) => image(avatarUrl, n, { width: 3.7, depth: 0.22, threshold: 0.5 }) },
  { key: 'heart', build: heart },
  { key: 'design', build: (n) => sampleDrawing(drawDesignTools(640), n), crisp: true },
  { key: 'webdev', build: (n) => sampleDrawing(drawTechStack(640), n), crisp: true },
  { key: 'auto', build: (n) => sampleDrawing(drawAutomation(640), n), crisp: true },
  { key: 'rose', build: (n) => sampleDrawing(drawRose(640), n, { width: 4.0, threshold: 0.24 }), crisp: true },
];
