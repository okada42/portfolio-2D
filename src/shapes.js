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
      const base = hsl(348 + 10 * (z + 1) / 2, 0.95, 0.5 + 0.1 * (z + 1) / 2);
      c = base.map((v, k) => Math.min(1, v * (0.45 + 0.85 * diff) + spec * 0.9 + rim * [1, 0.55, 0.7][k] * 0.35));
    } else {
      c = hsl(345, 0.9, 0.42); // inner glow
    }
    col.set(c, i * 3);
  }
  return { pos, col };
}

// ---------- Web development: hexagon nodes with web icons on a circuit network ----------
// Original drawing (2D canvas), sampled into particles with its colors. No text.
export function drawWebDev(size = 640) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const k = size / 640;
  g.scale(k, k);
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 640);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const CYAN = '#5fd4ff', WHITE = '#eaf8ff', HUB = [320, 330];

  const nodes = [
    { x: 320, y: 120, icon: 'code' }, { x: 505, y: 215, icon: 'cloud' }, { x: 505, y: 440, icon: 'db' },
    { x: 320, y: 545, icon: 'laptop' }, { x: 135, y: 440, icon: 'phone' }, { x: 135, y: 215, icon: 'browser' },
  ];
  // circuit traces: hub -> each node with an elbow, plus a ring between neighbours
  g.strokeStyle = 'rgba(95,212,255,.75)'; g.lineWidth = 3;
  for (const n of nodes) {
    const mx = (HUB[0] + n.x) / 2;
    g.beginPath(); g.moveTo(...HUB); g.lineTo(mx, HUB[1]); g.lineTo(mx, n.y); g.lineTo(n.x, n.y); g.stroke();
  }
  g.strokeStyle = 'rgba(95,212,255,.35)'; g.lineWidth = 2;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i], b = nodes[(i + 1) % nodes.length];
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  }
  // short branch traces ending in dots (the "circuit" texture)
  const rand = (() => { let t = 7; return () => ((t = (t * 9301 + 49297) % 233280) / 233280); })();
  g.fillStyle = WHITE;
  for (let i = 0; i < 26; i++) {
    const n = nodes[i % nodes.length], ang = rand() * Math.PI * 2, r0 = 62, r1 = 90 + rand() * 60;
    const x0 = n.x + Math.cos(ang) * r0, y0 = n.y + Math.sin(ang) * r0, x1 = n.x + Math.cos(ang) * r1, y1 = n.y + Math.sin(ang) * r1;
    if (x1 < 20 || x1 > 620 || y1 < 20 || y1 > 620) continue;
    g.strokeStyle = 'rgba(95,212,255,.5)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.beginPath(); g.arc(x1, y1, 4, 0, Math.PI * 2); g.fill();
  }

  const hex = (x, y, r) => { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); };
  const icon = (n) => {
    const { x, y } = n;
    g.strokeStyle = WHITE; g.fillStyle = WHITE; g.lineWidth = 5;
    if (n.icon === 'code') { // </>
      g.beginPath(); g.moveTo(x - 12, y - 16); g.lineTo(x - 28, y); g.lineTo(x - 12, y + 16); g.stroke();
      g.beginPath(); g.moveTo(x + 12, y - 16); g.lineTo(x + 28, y); g.lineTo(x + 12, y + 16); g.stroke();
      g.beginPath(); g.moveTo(x + 6, y - 20); g.lineTo(x - 6, y + 20); g.stroke();
    } else if (n.icon === 'cloud') {
      g.beginPath(); g.arc(x - 12, y + 4, 13, Math.PI * 0.5, Math.PI * 1.5); g.arc(x + 2, y - 8, 17, Math.PI, Math.PI * 1.95); g.arc(x + 16, y + 4, 12, Math.PI * 1.5, Math.PI * 0.5); g.closePath(); g.fill();
    } else if (n.icon === 'db') {
      for (const dy of [-14, 0, 14]) { g.beginPath(); g.ellipse(x, y + dy, 22, 7, 0, 0, Math.PI * 2); g.stroke(); }
      g.beginPath(); g.moveTo(x - 22, y - 14); g.lineTo(x - 22, y + 14); g.moveTo(x + 22, y - 14); g.lineTo(x + 22, y + 14); g.stroke();
    } else if (n.icon === 'laptop') {
      g.strokeRect(x - 22, y - 18, 44, 28);
      g.beginPath(); g.moveTo(x - 32, y + 18); g.lineTo(x + 32, y + 18); g.stroke();
    } else if (n.icon === 'phone') {
      g.beginPath(); g.roundRect(x - 13, y - 24, 26, 48, 5); g.stroke();
      g.beginPath(); g.arc(x, y + 16, 2.5, 0, Math.PI * 2); g.fill();
    } else if (n.icon === 'browser') {
      g.strokeRect(x - 26, y - 18, 52, 36);
      g.beginPath(); g.moveTo(x - 26, y - 8); g.lineTo(x + 26, y - 8); g.stroke();
      for (const dx of [-20, -13, -6]) { g.beginPath(); g.arc(x + dx, y - 13, 1.8, 0, Math.PI * 2); g.fill(); }
    }
  };
  for (const n of nodes) {
    // soft glow behind each hexagon
    const glow = g.createRadialGradient(n.x, n.y, 10, n.x, n.y, 80);
    glow.addColorStop(0, 'rgba(60,160,255,.35)'); glow.addColorStop(1, 'rgba(60,160,255,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(n.x, n.y, 80, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#000'; hex(n.x, n.y, 58); g.fill();
    g.strokeStyle = CYAN; g.lineWidth = 5; hex(n.x, n.y, 58); g.stroke();
    g.strokeStyle = 'rgba(95,212,255,.45)'; g.lineWidth = 2; hex(n.x, n.y, 68); g.stroke();
    icon(n);
  }
  // central hub: glowing core with rings (no text)
  const core = g.createRadialGradient(...HUB, 4, ...HUB, 70);
  core.addColorStop(0, 'rgba(230,248,255,1)'); core.addColorStop(0.35, 'rgba(95,212,255,.8)'); core.addColorStop(1, 'rgba(95,212,255,0)');
  g.fillStyle = core; g.beginPath(); g.arc(...HUB, 70, 0, Math.PI * 2); g.fill();
  g.strokeStyle = CYAN; g.lineWidth = 3;
  for (const r of [34, 48]) { g.beginPath(); g.arc(...HUB, r, 0, Math.PI * 2); g.stroke(); }
  return c;
}
// ---------- System development: gear + </> core, orbiting service icons, wireframe open hand ----------
export function drawSysDev(size = 640) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.scale(size / 640, size / 640);
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 640);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const CY = '#5fd4ff', WH = '#eaf8ff', CX = 320, CYY = 250;

  // HUD rings with tick marks
  g.strokeStyle = 'rgba(95,212,255,.35)'; g.lineWidth = 2;
  g.beginPath(); g.arc(CX, CYY, 210, Math.PI * 0.95, Math.PI * 2.05); g.stroke();
  for (let i = 0; i < 72; i++) {
    const a = Math.PI * 0.95 + (i / 72) * Math.PI * 1.1, r0 = 214, r1 = i % 6 ? 222 : 232;
    g.beginPath(); g.moveTo(CX + Math.cos(a) * r0, CYY + Math.sin(a) * r0); g.lineTo(CX + Math.cos(a) * r1, CYY + Math.sin(a) * r1); g.stroke();
  }
  g.strokeStyle = 'rgba(95,212,255,.55)'; g.lineWidth = 3;
  g.beginPath(); g.arc(CX, CYY, 150, Math.PI * 0.85, Math.PI * 2.15); g.stroke();

  // core glow
  const glow = g.createRadialGradient(CX, CYY, 20, CX, CYY, 130);
  glow.addColorStop(0, 'rgba(95,212,255,.55)'); glow.addColorStop(1, 'rgba(95,212,255,0)');
  g.fillStyle = glow; g.beginPath(); g.arc(CX, CYY, 130, 0, Math.PI * 2); g.fill();
  g.strokeStyle = CY; g.lineWidth = 4; g.beginPath(); g.arc(CX, CYY, 104, 0, Math.PI * 2); g.stroke();

  // gear
  const teeth = 10, rO = 82, rI = 66;
  g.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2, r = i % 2 ? rI : rO;
    g.arc(CX, CYY, r, a0 + 0.04, a1 - 0.04);
  }
  g.closePath(); g.fillStyle = WH; g.fill();
  g.fillStyle = '#000'; g.beginPath(); g.arc(CX, CYY, 50, 0, Math.PI * 2); g.fill();
  // </> inside the gear
  g.strokeStyle = WH; g.lineWidth = 7;
  g.beginPath(); g.moveTo(CX - 14, CYY - 20); g.lineTo(CX - 32, CYY); g.lineTo(CX - 14, CYY + 20); g.stroke();
  g.beginPath(); g.moveTo(CX + 14, CYY - 20); g.lineTo(CX + 32, CYY); g.lineTo(CX + 14, CYY + 20); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.moveTo(CX + 6, CYY - 24); g.lineTo(CX - 6, CYY + 24); g.stroke();

  // orbiting icon circles on the 150px arc
  const icons = ['loop', 'shield', 'globe', 'list', 'cloud'];
  icons.forEach((name, i) => {
    const a = Math.PI * 0.95 + (i / (icons.length - 1)) * Math.PI * 1.1;
    const x = CX + Math.cos(a) * 170, y = CYY + Math.sin(a) * 170;
    g.fillStyle = '#000'; g.beginPath(); g.arc(x, y, 34, 0, Math.PI * 2); g.fill();
    g.strokeStyle = CY; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 34, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = WH; g.fillStyle = WH; g.lineWidth = 4;
    if (name === 'loop') { // infinity
      g.beginPath(); for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.1) { const d = 1 + Math.sin(t) ** 2; g[t ? 'lineTo' : 'moveTo'](x + 17 * Math.cos(t) / d, y + 17 * Math.sin(t) * Math.cos(t) / d); } g.stroke();
    } else if (name === 'shield') {
      g.beginPath(); g.moveTo(x, y - 18); g.lineTo(x + 14, y - 12); g.lineTo(x + 13, y + 2); g.quadraticCurveTo(x + 10, y + 13, x, y + 18); g.quadraticCurveTo(x - 10, y + 13, x - 13, y + 2); g.lineTo(x - 14, y - 12); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x - 1, y + 5); g.lineTo(x + 7, y - 5); g.stroke();
    } else if (name === 'globe') {
      g.beginPath(); g.arc(x, y, 16, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.ellipse(x, y, 7, 16, 0, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x + 16, y); g.stroke();
    } else if (name === 'list') {
      g.strokeRect(x - 12, y - 16, 24, 32);
      for (const dy of [-7, 1, 9]) { g.beginPath(); g.moveTo(x - 6, y + dy); g.lineTo(x + 7, y + dy); g.stroke(); }
    } else if (name === 'cloud') {
      g.beginPath(); g.arc(x - 8, y + 3, 9, Math.PI * 0.5, Math.PI * 1.5); g.arc(x + 1, y - 5, 11, Math.PI, Math.PI * 1.95); g.arc(x + 10, y + 3, 8, Math.PI * 1.5, Math.PI * 0.5); g.closePath(); g.stroke();
    }
  });

  // wireframe open hand, side view: palm up, fingers pointing left and curling up slightly, thumb raised,
  // wrist at the right. Parts are drawn into a mask, then filled with a mesh and outlined.
  const taper = (x1, y1, qx, qy, x2, y2, r0, r1) => {
    const p = new Path2D(), L = [], R = [], N = 24;
    for (let i = 0; i <= N; i++) {
      const t = i / N, u = 1 - t;
      const x = u * u * x1 + 2 * u * t * qx + t * t * x2, y = u * u * y1 + 2 * u * t * qy + t * t * y2;
      const dx = 2 * u * (qx - x1) + 2 * t * (x2 - qx), dy = 2 * u * (qy - y1) + 2 * t * (y2 - qy);
      const l = Math.hypot(dx, dy) || 1, r = r0 + (r1 - r0) * t;
      L.push([x - dy / l * r, y + dx / l * r]); R.push([x + dy / l * r, y - dx / l * r]);
    }
    p.moveTo(...L[0]); L.forEach((q) => p.lineTo(...q));
    p.arc(x2, y2, r1, Math.atan2(L[N][1] - y2, L[N][0] - x2), Math.atan2(R[N][1] - y2, R[N][0] - x2), false);
    for (let i = N; i >= 0; i--) p.lineTo(...R[i]);
    p.closePath();
    return p;
  };
  const forearm = new Path2D();
  forearm.moveTo(640, 446); forearm.bezierCurveTo(580, 446, 520, 440, 468, 432);
  forearm.lineTo(474, 486); forearm.bezierCurveTo(530, 500, 590, 512, 640, 516); forearm.closePath();
  const palm = new Path2D();
  palm.moveTo(476, 430);
  palm.bezierCurveTo(440, 424, 400, 420, 372, 412);   // cupped top edge
  palm.bezierCurveTo(350, 408, 334, 418, 336, 436);   // toward finger roots
  palm.bezierCurveTo(338, 456, 360, 468, 392, 474);   // underside
  palm.bezierCurveTo(420, 480, 452, 488, 478, 490);
  palm.closePath();
  // fingers stacked in depth (index on top), rear ones a little shorter
  const fingers = [
    taper(354, 414, 278, 418, 214, 380, 11, 8),     // index: highest, tip curls up
    taper(350, 428, 262, 436, 194, 404, 11.5, 8.5), // middle (longest)
    taper(352, 442, 268, 452, 206, 426, 11, 8),     // ring
    taper(356, 456, 290, 466, 232, 450, 9.5, 7),    // little
  ];
  const thumb = taper(404, 420, 392, 388, 372, 352, 12.5, 9);
  const parts = [forearm, palm, ...fingers.slice().reverse(), thumb];

  const mesh = document.createElement('canvas'); mesh.width = mesh.height = 640;
  const m = mesh.getContext('2d');
  const hg = m.createLinearGradient(180, 0, 640, 0);
  hg.addColorStop(0, 'rgba(130,210,255,.32)'); hg.addColorStop(1, 'rgba(130,210,255,.12)');
  m.fillStyle = hg; m.fillRect(0, 0, 640, 640);
  m.strokeStyle = 'rgba(160,225,255,.9)'; m.lineWidth = 1.4;
  for (let i = -6; i < 22; i++) { const y0 = 360 + i * 8; m.beginPath(); m.moveTo(180, y0 + 30); m.bezierCurveTo(320, y0 + 34, 470, y0 + 8, 640, y0 + 52); m.stroke(); }
  for (let x = 180; x < 640; x += 12) { m.beginPath(); m.moveTo(x, 340); m.lineTo(x - 10, 540); m.stroke(); }
  // one combined mask (union of all parts), then keep the mesh only inside it
  const mask = document.createElement('canvas'); mask.width = mask.height = 640;
  const mk = mask.getContext('2d'); mk.fillStyle = '#fff'; parts.forEach((q) => mk.fill(q));
  m.globalCompositeOperation = 'destination-in';
  m.drawImage(mask, 0, 0);
  g.drawImage(mesh, 0, 0);
  // outlines: drawn back-to-front so each finger edge stays visible over the one behind
  g.lineWidth = 2.6;
  for (const q of parts) { g.strokeStyle = CY; g.stroke(q); }
  // light beam from palm to core
  const beam = g.createLinearGradient(0, 400, 0, 330);
  beam.addColorStop(0, 'rgba(95,212,255,.0)'); beam.addColorStop(1, 'rgba(95,212,255,.35)');
  g.fillStyle = beam; g.beginPath(); g.moveTo(250, 405); g.lineTo(380, 405); g.lineTo(358, 330); g.lineTo(282, 330); g.closePath(); g.fill();
  return c;
}

function sampleDrawing(c, n, { width = 3.7, depth = 0.35, threshold = 0.18 } = {}) {
  const W = c.width, H = c.height;
  const d = c.getContext('2d').getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * 4, r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
      const lum = 0.3 * r + 0.55 * gg + 0.15 * b;
      if (lum > threshold || (lum > 0.06 && rnd() < lum * 2)) pts.push(x, y, r, gg, b, lum);
    }
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const count = pts.length / 6, s = width / W;
  for (let i = 0; i < n; i++) {
    const k = (rnd() * count | 0) * 6;
    pos[i * 3] = (pts[k] + rnd() * 2 - W / 2) * s;
    pos[i * 3 + 1] = -(pts[k + 1] + rnd() * 2 - H / 2) * s;
    pos[i * 3 + 2] = (pts[k + 5] - 0.5) * depth + gauss() * 0.04; // brighter = closer
    col.set([pts[k + 2], pts[k + 3], pts[k + 4]], i * 3);
  }
  return { pos, col };
}

// Edit this list to make the hero about you. build() may return a Promise.
export const SHAPES = [
// Captions come from i18n.js (DICT[lang].shapes[key]).
  { key: 'crane', build: (n) => image(avatarUrl, n, { width: 3.7, depth: 0.22, threshold: 0.5 }) },
  { key: 'heart', build: heart },
  { key: 'webdev', build: (n) => sampleDrawing(drawWebDev(640), n) },
  { key: 'sysdev', build: (n) => sampleDrawing(drawSysDev(640), n, { width: 3.8 }) },
  { key: 'web', build: globe },
  { key: 'system', build: cubeGrid },
];
