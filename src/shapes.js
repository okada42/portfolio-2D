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

  // Two realistic, slender (feminine) hands, palms up, rising from wrists that touch at the center and
  // opening outward in a V. Thumbs on the outer side. No outlines: form comes from soft shading only,
  // which the particle sampler turns into density (light = dense, shadow = sparse).
  const SKIN_HI = '#ffeee4', SKIN_MID = '#f1d0bd', SKIN_LO = '#c99a84';
  const softShade = (pathFn, { rim = 'rgba(120,70,55,.6)', rimW = 16, blur = 7, hi = 'rgba(255,248,242,.55)', hiPath = null } = {}) => {
    g.save();
    pathFn(); g.clip();
    // base fill
    pathFn(); g.fill();
    // rim shadow: blurred dark stroke along the edge, clipped inside -> rounded, volumetric look
    g.filter = `blur(${blur}px)`;
    g.strokeStyle = rim; g.lineWidth = rimW;
    pathFn(); g.stroke();
    if (hiPath) { g.strokeStyle = hi; g.lineWidth = 7; hiPath(); g.stroke(); }
    g.restore();
  };
  const quad = (x1, y1, qx, qy, x2, y2, t) => {
    const u = 1 - t;
    return [u * u * x1 + 2 * u * t * qx + t * t * x2, u * u * y1 + 2 * u * t * qy + t * t * y2];
  };
  // finger body along a gentle curve; real fingers taper only a little and end in a round pad
  const fingerPath = (f) => () => {
    const [x1, y1, qx, qy, x2, y2, r0, r1] = f;
    const N = 28, L = [], R = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, [x, y] = quad(x1, y1, qx, qy, x2, y2, t);
      const dx = 2 * (1 - t) * (qx - x1) + 2 * t * (x2 - qx), dy = 2 * (1 - t) * (qy - y1) + 2 * t * (y2 - qy);
      const len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      // slight bulge at each knuckle joint
      const r = r0 + (r1 - r0) * t + Math.sin(t * Math.PI * 3) * 0.6;
      L.push([x + nx * r, y + ny * r]); R.push([x - nx * r, y - ny * r]);
    }
    g.beginPath();
    g.moveTo(...L[0]);
    for (const p of L) g.lineTo(...p);
    g.arc(x2, y2, r1, Math.atan2(L[N][1] - y2, L[N][0] - x2), Math.atan2(R[N][1] - y2, R[N][0] - x2), true);
    for (let i = N; i >= 0; i--) g.lineTo(...R[i]);
    g.closePath();
  };
  const finger = (f) => {
    const [x1, y1, qx, qy, x2, y2] = f;
    const gr = g.createLinearGradient(x2, y2, x1, y1);
    gr.addColorStop(0, SKIN_HI); gr.addColorStop(0.7, SKIN_MID); gr.addColorStop(1, SKIN_LO);
    g.fillStyle = gr;
    softShade(fingerPath(f), {
      rimW: 12, blur: 4,
      hiPath: () => { g.beginPath(); const a = quad(...f.slice(0, 6), 0.15), b = quad(...f.slice(0, 6), 0.55), c2 = quad(...f.slice(0, 6), 0.95); g.moveTo(...a); g.quadraticCurveTo(...b, ...c2); },
    });
    // joint creases: soft, faint bands across the finger
    g.save(); fingerPath(f)(); g.clip(); g.filter = 'blur(2.5px)';
    g.strokeStyle = 'rgba(140,85,70,.45)'; g.lineWidth = 3;
    for (const t of [0.4, 0.7]) {
      const [x, y] = quad(...f.slice(0, 6), t);
      const [xa, ya] = quad(...f.slice(0, 6), t + 0.02);
      const ang = Math.atan2(ya - y, xa - x) + Math.PI / 2;
      g.beginPath(); g.moveTo(x - Math.cos(ang) * 14, y - Math.sin(ang) * 14); g.lineTo(x + Math.cos(ang) * 14, y + Math.sin(ang) * 14); g.stroke();
    }
    g.restore();
  };
  const hand = (side) => {
    g.save();
    g.translate(300, 0);
    g.scale(side, 1);
    // slender forearm
    const fa = () => { g.beginPath(); g.moveTo(2, 610); g.bezierCurveTo(4, 540, 8, 500, 18, 458); g.lineTo(82, 466); g.bezierCurveTo(70, 510, 62, 560, 60, 610); g.closePath(); };
    let gr = g.createLinearGradient(0, 460, 0, 600); gr.addColorStop(0, SKIN_MID); gr.addColorStop(1, SKIN_LO);
    g.fillStyle = gr; softShade(fa, { rimW: 18, blur: 8 });
    // fingers, inner -> outer: little, ring, middle (longest), index. [x1,y1, ctrl, x2,y2, rootR, tipR]
    const F = [
      [84, 356, 82, 320, 92, 282, 9, 7.6],
      [108, 342, 110, 296, 124, 248, 10.2, 8.4],
      [134, 336, 142, 288, 160, 236, 10.6, 8.8],
      [160, 344, 178, 302, 196, 260, 10.2, 8.4],
    ];
    for (const f of F) finger(f);
    // palm: soft rounded shape with a fleshy thumb mound (outer) and heel (inner)
    const palm = () => {
      g.beginPath();
      g.moveTo(16, 462);
      g.bezierCurveTo(18, 420, 40, 380, 76, 356);
      g.bezierCurveTo(110, 334, 150, 332, 176, 352);
      g.bezierCurveTo(196, 372, 204, 400, 192, 426);
      g.bezierCurveTo(170, 458, 130, 474, 84, 472);
      g.closePath();
    };
    gr = g.createRadialGradient(118, 405, 10, 118, 405, 95); gr.addColorStop(0, SKIN_HI); gr.addColorStop(1, SKIN_MID);
    g.fillStyle = gr; softShade(palm, { rimW: 22, blur: 9 });
    // thumb on the outer side: thicker, two segments, rising from the thumb mound
    const T = [170, 420, 214, 402, 228, 348, 13, 9.8];
    finger(T);
    // re-cover the thumb root with the mound so it grows out of the palm naturally
    g.save(); palm(); g.clip();
    gr = g.createRadialGradient(176, 410, 4, 176, 410, 42); gr.addColorStop(0, 'rgba(255,238,228,.95)'); gr.addColorStop(1, 'rgba(241,208,189,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(176, 410, 42, 0, Math.PI * 2); g.fill();
    // palm lines: very soft and faint (blurred), never hard gaps
    g.filter = 'blur(3px)'; g.strokeStyle = 'rgba(150,95,78,.4)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(80, 382); g.quadraticCurveTo(125, 366, 170, 376); g.stroke();
    g.beginPath(); g.moveTo(150, 368); g.quadraticCurveTo(128, 410, 118, 460); g.stroke();
    // soft shadow where the fingers meet the palm
    g.strokeStyle = 'rgba(150,95,78,.35)'; g.lineWidth = 8;
    g.beginPath(); g.moveTo(74, 358); g.bezierCurveTo(110, 336, 150, 334, 176, 352); g.stroke();
    g.restore();
    g.restore();
  };
  hand(-1); hand(1);
  // a soft shadow where the two wrists meet
  g.save(); g.filter = 'blur(4px)'; g.strokeStyle = 'rgba(120,70,55,.55)'; g.lineWidth = 6;
  g.beginPath(); g.moveTo(300, 470); g.lineTo(300, 600); g.stroke(); g.restore();
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
      // skin (warm, r > b): keep with probability rising with brightness, so lit areas are dense
      // and shadowed edges thin out softly -> reads as rounded form, not outlines
      if (r > b + 0.06 && rnd() > skinKeep * Math.pow(lum, 1.6) * 1.35) continue;
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
  { key: 'care', build: (n) => sampleCanvas(drawCare(600), n, { width: 3.8, skinKeep: 0.62, threshold: 0.2 }) },
  { key: 'auto', build: knot },
  { key: 'data', build: helix },
  { key: 'web', build: globe },
  { key: 'system', build: cubeGrid },
];
