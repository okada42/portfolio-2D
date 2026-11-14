import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gauss, rnd } from './shapes.js';

const vert = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aColFrom;
attribute vec3 aColTo;
attribute float aDelay;
attribute float aRand;
attribute float aGroup;
attribute float aWing;
uniform vec3 uOff;
uniform float uFlap;
uniform float uAIGlow;
uniform float uT;
uniform float uTime;
uniform float uSize;
uniform float uPR;
uniform float uChaos;
uniform vec3 uMouse;
uniform float uMouseOn;
varying vec3 vCol;
varying float vAlpha;

float ease(float t){ return t<.5 ? 4.*t*t*t : 1.-pow(-2.*t+2.,3.)/2.; }

void main(){
  // stagger each particle by its delay so shapes build up in a sweep
  float t = ease(clamp((uT - aDelay*.45) / .55, 0., 1.));
  vec3 p = mix(aFrom, aTo, t);
  // intro crane: flap wings by span distance and carry along the flight path
  float isCrane = step(.5, aGroup) * step(aGroup, 1.5);
  float f = sin(uTime * 7.);
  p.y += isCrane * aWing * (f * 1.05 + .1) * uFlap;
  p.z *= 1. - isCrane * uFlap * .35 * abs(f);
  p.y -= isCrane * f * .06 * uFlap; // body bobs against the stroke
  p += isCrane * uOff;
  // swirl mid-flight, gentle breathing at rest
  float mid = sin(t*3.14159);
  float ph = aRand*6.2831 + uTime*.6;
  p += vec3(sin(ph+p.y*2.), cos(ph*1.3+p.x*2.), sin(ph*.7+p.z*2.)) * (mid*.6 + uChaos*.5 + .015);

  // cursor pushes particles away
  vec3 d = p - uMouse;
  float l = length(d.xy);
  p.xy += normalize(d.xy + 1e-4) * exp(-l*l*5.) * .55 * uMouseOn;

  vCol = mix(aColFrom, aColTo, t);
  vAlpha = mix(.35, 1., 1. - uChaos) * (.55 + .45*aRand);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  float glow = step(1.5, aGroup) * uAIGlow * (.5 + .5 * sin(uTime * 3. + aRand * 6.2831));
  vCol += glow * vec3(.15, .3, .45);
  gl_PointSize = uSize * uPR * (.6 + aRand*.8) * (6. / -mv.z) * (1. + glow * .8);
}`;

const frag = /* glsl */ `
varying vec3 vCol;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .0, d);
  gl_FragColor = vec4(vCol, a*a*vAlpha);
}`;

const dustVert = /* glsl */ `
attribute float aRand;
uniform float uTime; uniform float uPR; uniform float uSize;
varying float vA;
void main(){
  vec3 p = position;
  p.y += sin(uTime*.2 + aRand*20.)*.15;
  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPR * (6. / -mv.z) * (.5+aRand);
  vA = .25 + .75*abs(sin(uTime*.8 + aRand*40.));
}`;
const dustFrag = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity; varying float vA;
void main(){
  float d = length(gl_PointCoord-.5);
  gl_FragColor = vec4(uColor, smoothstep(.5,0.,d)*uOpacity*vA);
}`;

const TIMING = { form: 3.2, hold: 6.5, scatter: 2.6 };

export function createScene(canvas, shapes, { count, small, reduceMotion, onShape, intro }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  const pr = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
  renderer.setPixelRatio(pr);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0x05070d, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(canvas.clientWidth, canvas.clientHeight), small ? 0.55 : 0.75, 0.6, 0.15);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // main morphing cloud
  const from = new Float32Array(count * 3), to = new Float32Array(count * 3);
  const cFrom = new Float32Array(count * 3).fill(0.6), cTo = new Float32Array(count * 3).fill(0.6);
  const delay = new Float32Array(count), rand = new Float32Array(count);
  const cloud = new Float32Array(count * 3);
  const makeCloud = () => {
    for (let i = 0; i < count; i++) {
      cloud[i * 3] = gauss() * 2.6;
      cloud[i * 3 + 1] = gauss() * 1.6;
      cloud[i * 3 + 2] = gauss() * 2;
    }
  };
  makeCloud();
  from.set(cloud); to.set(cloud);
  for (let i = 0; i < count; i++) rand[i] = rnd();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const A = {
    aFrom: new THREE.BufferAttribute(from, 3),
    aTo: new THREE.BufferAttribute(to, 3),
    aColFrom: new THREE.BufferAttribute(cFrom, 3),
    aColTo: new THREE.BufferAttribute(cTo, 3),
    aDelay: new THREE.BufferAttribute(delay, 1),
  };
  for (const [k, a] of Object.entries(A)) { a.setUsage(THREE.DynamicDrawUsage); geo.setAttribute(k, a); }
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.setAttribute('aGroup', new THREE.BufferAttribute(intro?.group ?? new Float32Array(count), 1));
  geo.setAttribute('aWing', new THREE.BufferAttribute(intro?.wing ?? new Float32Array(count), 1));
  const touch = () => Object.values(A).forEach((a) => (a.needsUpdate = true));

  const U = {
    uOff: { value: new THREE.Vector3() }, uFlap: { value: 0 }, uAIGlow: { value: 0 },
    uT: { value: 1 }, uTime: { value: 0 }, uSize: { value: small ? 2.4 : 2.6 }, uPR: { value: pr },
    uChaos: { value: 1 }, uMouse: { value: new THREE.Vector3(99, 99, 0) }, uMouseOn: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, uniforms: U,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  // background layers: near dust + far stars
  const disposables = [geo, mat, composer, renderer];
  function layer(n, rMin, rMax, size, opacity, color) {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3), r = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(rMin + rnd() * (rMax - rMin));
      p.set([v.x, v.y * 0.7, v.z], i * 3);
      r[i] = rnd();
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: dustVert, fragmentShader: dustFrag, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: U.uTime, uPR: U.uPR, uSize: { value: size }, uOpacity: { value: opacity }, uColor: { value: new THREE.Color(color) } },
    });
    disposables.push(g, m);
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    return pts;
  }
  const dust = layer(small ? 900 : 1800, 1.8, 5, 2.2, 0.45, 0x9fd8ff);
  const stars = layer(small ? 600 : 1200, 9, 20, 2.6, 0.7, 0xffffff);
  group.add(dust);
  scene.add(stars);

  // state machine: form -> hold -> scatter -> form(next)
  const state = { idx: -1, phase: 'idle', t0: 0, next: null };
  const clock = new THREE.Clock();
  const T = reduceMotion ? { form: 1.2, hold: 12, scatter: 1 } : TIMING;

  function form(now) {
    const idx = state.next ?? (state.idx + 1) % shapes.length;
    state.next = null;
    state.idx = idx;
    const s = shapes[idx];
    from.set(cloud); cFrom.set(cTo);
    to.set(s.pos); cTo.set(s.col);
    // delay = bottom-to-top sweep with jitter
    let lo = 1e9, hi = -1e9;
    for (let i = 0; i < count; i++) { const y = s.pos[i * 3 + 1]; lo = Math.min(lo, y); hi = Math.max(hi, y); }
    for (let i = 0; i < count; i++) delay[i] = Math.min(1, ((s.pos[i * 3 + 1] - lo) / (hi - lo || 1)) * 0.8 + rnd() * 0.2);
    touch();
    U.uT.value = 0;
    state.phase = 'form'; state.t0 = now;
    onShape?.(idx);
  }
  // ---------- intro: crane forms -> flies to "AI" -> both merge into shape 0 (avatar) ----------
  const IT = { form: 2.6, fly: 4.4, merge: 3.4 };
  const START = new THREE.Vector3(4.8, -1.9, 0); // enter from bottom-right, away from the headline
  let introDone = !intro || reduceMotion;
  const flightPath = (k, out) => {
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    return out.set(START.x * (1 - e), START.y * (1 - e) + Math.sin(e * Math.PI) * 0.7, 0);
  };
  function introForm(now) {
    from.set(cloud); to.set(intro.pos);
    cTo.set(intro.col); delay.set(intro.delay);
    touch();
    U.uT.value = 0; U.uFlap.value = 1;
    flightPath(0, U.uOff.value);
    state.phase = 'intro-form'; state.t0 = now;
  }
  function introMerge(now) {
    from.set(intro.pos); cFrom.set(intro.col);
    const s = shapes[0];
    to.set(s.pos); cTo.set(s.col);
    // burst outward from the meeting point
    let hi = 0;
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) { r[i] = Math.hypot(s.pos[i * 3], s.pos[i * 3 + 1]); hi = Math.max(hi, r[i]); }
    for (let i = 0; i < count; i++) delay[i] = Math.min(1, (r[i] / (hi || 1)) * 0.7 + rnd() * 0.3);
    touch();
    U.uT.value = 0;
    U.uOff.value.set(0, 0, 0);
    state.idx = 0;
    state.phase = 'intro-merge'; state.t0 = now;
    onShape?.(0);
  }

  function scatter(now) {
    const s = shapes[state.idx];
    from.set(s.pos); cFrom.set(s.col);
    makeCloud(); to.set(cloud);
    for (let i = 0; i < count; i++) delay[i] = rnd();
    touch();
    U.uT.value = 0;
    state.phase = 'scatter'; state.t0 = now;
  }

  // input
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), ndc = new THREE.Vector2();
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.ty = -((e.clientY - r.top) / r.height) * 2 + 1;
    mouse.on = e.pointerType === 'mouse' && e.clientY < r.bottom;
  };
  const onLeave = () => (mouse.on = false);
  const onClick = () => { if (state.phase === 'hold') scatter(clock.getElapsedTime()); };
  addEventListener('pointermove', onMove);
  document.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const narrow = w < 900;
    group.position.set(narrow ? 0 : 1.3, narrow ? 0.9 : 0.1, 0);
    group.scale.setScalar(narrow ? Math.min(1, (w / h) * 1.1) : 1);
  }
  layout();
  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix(); layout();
  });
  ro.observe(canvas);

  let raf = 0, visible = true, dead = false, sway = 0;
  function tick() {
    if (dead) return;
    const now = clock.getElapsedTime();
    U.uTime.value = now;
    const e = now - state.t0;
    if (state.phase === 'intro-form') {
      U.uT.value = Math.min(1, e / IT.form);
      U.uChaos.value = 1 - U.uT.value;
      if (e >= IT.form) { state.phase = 'intro-fly'; state.t0 = now; }
    } else if (state.phase === 'intro-fly') {
      const k = Math.min(1, e / IT.fly);
      U.uChaos.value = 0;
      flightPath(k, U.uOff.value);
      U.uAIGlow.value = k;
      if (k >= 1) introMerge(now);
    } else if (state.phase === 'intro-merge') {
      U.uT.value = Math.min(1, e / IT.merge);
      U.uChaos.value = 0;
      U.uFlap.value = Math.max(0, 1 - e / 0.5);
      U.uAIGlow.value = Math.max(0, 1 - e / 0.8);
      if (e >= IT.merge) { introDone = true; state.phase = 'hold'; state.t0 = now; }
    } else if (state.phase === 'form') {
      U.uT.value = Math.min(1, e / T.form);
      U.uChaos.value = 1 - U.uT.value;
      if (e >= T.form) { state.phase = 'hold'; state.t0 = now; }
    } else if (state.phase === 'hold') {
      U.uChaos.value = 0;
      if (e >= T.hold) scatter(now);
    } else if (state.phase === 'scatter') {
      U.uT.value = Math.min(1, e / T.scatter);
      U.uChaos.value = U.uT.value;
      if (e >= T.scatter) form(now);
    }
    // hold the camera angle steady during the flight, then ease into the slow sway
    sway += ((introDone ? 1 : 0) - sway) * 0.015;
    group.rotation.y = Math.sin(now * 0.18) * 0.45 * sway;
    group.rotation.x = Math.sin(now * 0.13) * 0.08 * sway + 0.5 * (1 - sway);
    dust.rotation.y = -now * 0.02;
    stars.rotation.y = now * 0.005;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.position.x = mouse.x * 0.5;
    camera.position.y = mouse.y * 0.3;
    camera.lookAt(0, 0, 0);
    if (mouse.on) {
      ndc.set(mouse.tx, mouse.ty);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { points.worldToLocal(hit); U.uMouse.value.copy(hit); }
      U.uMouseOn.value += (1 - U.uMouseOn.value) * 0.08;
    } else U.uMouseOn.value *= 0.92;

    composer.render();
    raf = requestAnimationFrame(tick);
  }
  const resume = () => {
    cancelAnimationFrame(raf);
    if (!dead && visible && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; resume(); });
  io.observe(canvas);
  document.addEventListener('visibilitychange', resume);
  resume();

  return {
    start() {
      if (state.phase !== 'idle') return;
      if (introDone) form(clock.getElapsedTime());
      else introForm(clock.getElapsedTime());
    },
    goTo(i) {
      state.next = i;
      if (state.phase === 'hold') scatter(clock.getElapsedTime());
    },
    dispose() {
      dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', resume);
      disposables.forEach((d) => d.dispose());
    },
  };
}
