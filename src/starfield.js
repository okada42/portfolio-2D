// Site-wide background: a 3D starfield drifting toward the viewer, a faint nebula,
// gentle scroll parallax, and occasional shooting stars. Sits behind all content;
// the hero's own opaque canvas covers it at the top of the homepage.
export function initStarfield() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c = document.createElement('canvas');
  c.className = 'starfield';
  c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const g = c.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const small = Math.min(innerWidth, innerHeight) < 700;
  const TINTS = ['255,255,255', '255,255,255', '159,216,255', '200,180,255', '255,214,170'];
  const stars = Array.from({ length: small ? 160 : 320 }, () => spawn(Math.random()));
  function spawn(z = 1) {
    return { x: (Math.random() * 2 - 1) * 1.4, y: (Math.random() * 2 - 1) * 1.4, z, tint: TINTS[(Math.random() * TINTS.length) | 0], tw: Math.random() * 6.28 };
  }
  const shooting = [];
  let nextShot = 1.5;

  let last = performance.now(), raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    g.clearRect(0, 0, W, H);

    // faint nebula clouds in the site palette
    const neb = (x, y, r, col) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
    neb(W * (0.2 + 0.03 * Math.sin(t * 0.05)), H * 0.3, Math.max(W, H) * 0.45, 'rgba(95,212,255,0.05)');
    neb(W * 0.85, H * (0.75 + 0.03 * Math.cos(t * 0.04)), Math.max(W, H) * 0.5, 'rgba(185,140,255,0.05)');

    // stars: perspective projection; nearer stars are bigger, brighter and shift more on scroll
    const cx = W / 2, cy = H / 2, fov = Math.min(W, H) * 0.6, scroll = scrollY;
    for (const s of stars) {
      if (!reduce) s.z -= dt * 0.035;
      if (s.z <= 0.05) Object.assign(s, spawn(1));
      const k = fov / s.z;
      const px = cx + s.x * k;
      let py = cy + s.y * k - (scroll * 0.12 * (1 - s.z)) % (H * 1.5);
      if (py < -20) py += H * 1.5;
      if (px < -10 || px > W + 10 || py > H + 10) continue;
      const near = 1 - s.z;
      const size = 0.4 + near * 1.9;
      const a = Math.min(1, 0.25 + near * 0.9) * (0.75 + 0.25 * Math.sin(t * 2 + s.tw));
      g.fillStyle = `rgba(${s.tint},${a})`;
      g.beginPath(); g.arc(px, py, size, 0, Math.PI * 2); g.fill();
    }

    // shooting stars: falling diagonally with a fading tail
    if (!reduce) {
      nextShot -= dt;
      if (nextShot <= 0) {
        const fromLeft = Math.random() < 0.5;
        const ang = (fromLeft ? 1 : -1) * (0.45 + Math.random() * 0.35);
        shooting.push({ x: fromLeft ? Math.random() * W * 0.6 : W * 0.4 + Math.random() * W * 0.6, y: -20 + Math.random() * H * 0.35,
          vx: Math.sin(ang) * 900, vy: Math.cos(ang) * 900 * 0.75, life: 0, max: 0.9 + Math.random() * 0.6, len: 140 + Math.random() * 120 });
        nextShot = 2.5 + Math.random() * 4;
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.life > s.max) { shooting.splice(i, 1); continue; }
        const fade = Math.sin((s.life / s.max) * Math.PI);
        const sp = Math.hypot(s.vx, s.vy), tx = s.x - (s.vx / sp) * s.len, ty = s.y - (s.vy / sp) * s.len;
        const gr = g.createLinearGradient(s.x, s.y, tx, ty);
        gr.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        gr.addColorStop(0.3, `rgba(159,216,255,${0.5 * fade})`);
        gr.addColorStop(1, 'rgba(159,216,255,0)');
        g.strokeStyle = gr; g.lineWidth = 2; g.lineCap = 'round';
        g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(tx, ty); g.stroke();
        g.fillStyle = `rgba(255,255,255,${fade})`; g.beginPath(); g.arc(s.x, s.y, 1.8, 0, Math.PI * 2); g.fill();
      }
    }
    if (!reduce && !heroCovers) raf = requestAnimationFrame(frame);
  }
  // while the hero fills the screen the starfield is fully hidden behind it, so pause drawing
  let heroCovers = false;
  const hero = document.querySelector('.hero');
  if (hero) new IntersectionObserver(([e]) => {
    const was = heroCovers; heroCovers = e.intersectionRatio > 0.98;
    if (was && !heroCovers && !document.hidden) start();
  }, { threshold: [0.98, 1] }).observe(hero);
  const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', () => (document.hidden ? cancelAnimationFrame(raf) : start()));
  if (reduce) addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
  start();
}
