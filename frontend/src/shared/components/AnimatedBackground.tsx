import { useEffect, useRef } from 'react';

const MAX_DPR = 2;
const TWO_PI = Math.PI * 2;

interface Palette {
  nebula: [string, string];
  nebulaAlpha: [number, number];
  dust: [string, string];
  wire: string;
  ring: string;
  core: [string, string];
  glowScale: number;
}

interface Dust {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  tw: number;
  layer: number;
  color: number;
}

interface OrbitPoint {
  x: number;
  y: number;
  front: boolean;
}

interface SpherePlanet {
  fx: number;
  fy: number;
  parallaxX: number;
  parallaxY: number;
  r: number;
  spin: number;
  drift: number;
}

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    nebula: ['56,189,248', '139,92,246'],
    nebulaAlpha: [0.11, 0.1],
    dust: ['190,227,248', '196,181,253'],
    wire: '56,189,248',
    ring: '129,140,248',
    core: ['30,58,138', '6,8,20'],
    glowScale: 1,
  },
  light: {
    nebula: ['56,189,248', '139,92,246'],
    nebulaAlpha: [0.07, 0.06],
    dust: ['2,132,199', '109,40,217'],
    wire: '2,132,199',
    ring: '79,70,229',
    core: ['37,99,235', '30,41,92'],
    glowScale: 0.72,
  },
};

function alphaColor(rgb: string, a: number): string {
  return `rgba(${rgb},${a})`;
}

const SPRITE = 128;

function makeSprite(rgb: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const half = SPRITE / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, alphaColor(rgb, 0.9));
  grad.addColorStop(0.3, alphaColor(rgb, 0.34));
  grad.addColorStop(0.65, alphaColor(rgb, 0.1));
  grad.addColorStop(1, alphaColor(rgb, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const step = (a: number, b: number) => ((a % b) + b) % b;

function buildPlanetTexture(): HTMLCanvasElement {
  const W = 512;
  const H = 256;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, W, H);
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#101b3d');
  base.addColorStop(0.5, '#0a1128');
  base.addColorStop(1, '#060a18');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const hue = ['125,211,252', '147,197,253', '196,181,253', '103,232,249'];
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < 22; i += 1) {
    const rgb = hue[i % hue.length] ?? '125,211,252';
    const yy = Math.random() * H;
    const hh = 4 + Math.random() * 15;
    ctx.shadowColor = alphaColor(rgb, 1);
    ctx.shadowBlur = 22;
    ctx.globalAlpha = 0.32 + Math.random() * 0.22;
    for (let x = 0; x < W; x += 8) {
      const wob = Math.sin((i * 13 + x) / 31) * H * 0.02;
      ctx.fillStyle = alphaColor(rgb, 1);
      ctx.fillRect(x, yy + wob, 10, hh);
    }
  }

  for (let i = 0; i < 9; i += 1) {
    const bx = Math.random() * W;
    const by = Math.random() * H;
    const br = 26 + Math.random() * 48;
    const rgb = i % 3 === 0 ? '34,211,238' : i % 2 === 0 ? '37,99,235' : '124,58,237';
    const rg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    rg.addColorStop(0, alphaColor(rgb, 1));
    rg.addColorStop(1, alphaColor(rgb, 0));
    ctx.fillStyle = rg;
    ctx.shadowColor = alphaColor(rgb, 1);
    ctx.shadowBlur = 34;
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, TWO_PI);
    ctx.fill();
  }

  for (let i = 0; i < 26; i += 1) {
    const bx = Math.random() * W;
    const by = Math.random() * H;
    const br = 10 + Math.random() * 20;
    const rg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    rg.addColorStop(0, 'rgba(224,242,254,0.65)');
    rg.addColorStop(1, 'rgba(224,242,254,0)');
    ctx.fillStyle = rg;
    ctx.shadowColor = 'rgba(125,211,252,1)';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, TWO_PI);
    ctx.fill();
  }

  ctx.shadowBlur = 12;
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 46; i += 1) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(125,211,252,0.75)' : 'rgba(196,181,253,0.75)';
    ctx.beginPath();
    let px = Math.random() * W;
    let py = Math.random() * H;
    ctx.moveTo(px, py);
    const segs = 2 + Math.floor(Math.random() * 3);
    for (let s = 0; s < segs; s += 1) {
      px += (Math.random() - 0.5) * 120;
      py += (Math.random() - 0.5) * 120;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.75;
  for (let i = 0; i < 320; i += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? '#a5f3fc' : '#ddd6fe';
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }

  ctx.fillStyle = 'rgba(2,132,199,0.04)';
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillRect(0, 0, W, H);
  return c;
}

function drawTexturedSphere(
  ctx: CanvasRenderingContext2D,
  tex: HTMLCanvasElement,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
) {
  const TW = tex.width;
  const TH = tex.height;
  const strip = Math.max(2, Math.round(r / 104));
  const span = TWO_PI;
  for (let dx = -r + 0.001; dx <= r; dx += strip) {
    const h2 = r * r - dx * dx;
    if (h2 <= 0) continue;
    const half = Math.sqrt(h2);
    const as = Math.asin(clamp(dx / r, -1, 1));
    let u = (0.5 + (rotation + as) / span) * TW;
    u = step(u, TW);
    ctx.drawImage(tex, Math.floor(u), 0, 1, TH, cx + dx - strip / 2, cy - half, strip + 1, half * 2);
  }
}

function drawWireframe(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rotation: number,
  wire: string,
  glow: number,
) {
  const scale = glow;
  ctx.lineWidth = 1;
  ctx.strokeStyle = alphaColor(wire, 0.4 * scale);
  ctx.beginPath();
  for (let k = 0; k < 12; k += 1) {
    const lam = rotation + (k * TWO_PI) / 12;
    const rx = r * Math.abs(Math.sin(lam));
    if (rx < 1) continue;
    ctx.moveTo(cx + rx, cy);
    ctx.ellipse(cx, cy, rx, r, 0, 0, TWO_PI);
  }
  ctx.stroke();

  ctx.strokeStyle = alphaColor(wire, 0.26 * scale);
  ctx.beginPath();
  for (let i = 1; i <= 7; i += 1) {
    const th = (i * Math.PI) / 8;
    const s = r * Math.sin(th);
    ctx.moveTo(cx + s, cy - r * Math.cos(th) + s);
    ctx.ellipse(cx, cy - r * Math.cos(th), s, s, 0, 0, TWO_PI);
  }
  ctx.stroke();

  ctx.strokeStyle = alphaColor(wire, 0.85 * scale);
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy + r);
  ctx.stroke();
}

function drawRings(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  tilt: number,
  ring: string,
  glow: number,
  half: 'back' | 'front',
) {
  const baseAlpha = half === 'front' ? 0.38 : 0.16;
  const alpha = baseAlpha * glow;
  const bands: Array<[number, number]> = [
    [1.42, 0.055],
    [1.85, 0.032],
  ];
  for (const [scaleR, width] of bands) {
    const a = r * scaleR;
    const b = r * scaleR * 0.36;
    const lw = r * width;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.lineCap = 'round';
    ctx.strokeStyle = alphaColor(ring, alpha);
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.ellipse(0, 0, a, b, 0, half === 'back' ? Math.PI : 0, half === 'back' ? TWO_PI : Math.PI);
    ctx.stroke();
    ctx.strokeStyle = alphaColor(ring, alpha * 0.45);
    ctx.lineWidth = lw * 2.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, a, b, 0, half === 'back' ? Math.PI : 0, half === 'back' ? TWO_PI : Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let disposed = false;
    let palette = PALETTES[currentTheme()];
    let sprites = [makeSprite(palette.nebula[0]), makeSprite(palette.nebula[1])];
    let planetTex = buildPlanetTexture();
    let dust: Dust[] = [];
    let main: SpherePlanet | null = null;
    let moon: SpherePlanet | null = null;
    let mainRot = 0.6;
    let moonRot = 0.2;
    let last = performance.now();

    const mouse = { active: false, x: 0, y: 0, tx: 0, ty: 0 };

    const rebuild = () => {
      const next = PALETTES[currentTheme()];
      if (next !== palette) {
        palette = next;
        sprites = [makeSprite(palette.nebula[0]), makeSprite(palette.nebula[1])];
        planetTex = buildPlanetTexture();
      }
      const baseR = clamp(Math.min(w, h) * 0.26, 118, 250);
      main = {
        fx: 0.63,
        fy: 0.56,
        parallaxX: 40,
        parallaxY: 26,
        r: baseR,
        spin: 0.12,
        drift: 0.14,
      };
      moon = {
        fx: 0.16,
        fy: 0.22,
        parallaxX: -34,
        parallaxY: -14,
        r: baseR * 0.34,
        spin: 0.05,
        drift: 0.1,
      };

      const target = Math.round(clamp((w * h) / 16000, 40, 85));
      dust.length = target;
      for (let i = 0; i < target; i += 1) {
        const d = dust[i];
        const layer = Math.random() < 0.5 ? 0 : 1;
        dust[i] = d ?? {
          x: Math.random() * w,
          y: Math.random() * h,
          r: layer === 0 ? 0.6 + Math.random() * 0.9 : 1.4 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -0.05 - Math.random() * 0.16,
          tw: Math.random() * TWO_PI,
          layer,
          color: Math.floor(Math.random() * 2),
        };
      }
      if (reduced) draw(performance.now());
    };

    const orbitPoints = (
      cx: number,
      cy: number,
      a: number,
      b: number,
      t: number,
      tilt: number,
      speed: number,
      count: number,
      phase: number,
    ): OrbitPoint[] => {
      const out: OrbitPoint[] = [];
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      for (let i = 0; i < count; i += 1) {
        const ang = t * speed + phase + (i * TWO_PI) / count;
        const lx = Math.cos(ang) * a;
        const ly = Math.sin(ang) * b;
        const x = cx + lx * ct - ly * st;
        const y = cy + lx * st + ly * ct;
        out.push({ x, y, front: y >= cy });
      }
      return out;
    };

    const drawSphereBody = (
      cx: number,
      cy: number,
      r: number,
      rotation: number,
      core: [string, string],
      wire: string,
      glow: number,
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.clip();

      ctx.fillStyle = alphaColor(core[0], 1);
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      drawTexturedSphere(ctx, planetTex, cx, cy, r, rotation);

      const innerLight = ctx.createRadialGradient(cx - r * 0.5, cy - r * 0.55, r * 0.05, cx - r * 0.5, cy - r * 0.55, r * 1.2);
      innerLight.addColorStop(0, alphaColor('186,230,253', 0.36 * glow));
      innerLight.addColorStop(0.35, alphaColor(palette.nebula[0], 0.14 * glow));
      innerLight.addColorStop(1, alphaColor(palette.nebula[0], 0));
      ctx.fillStyle = innerLight;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const rim = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r * 1.04);
      rim.addColorStop(0, alphaColor(palette.nebula[0], 0));
      rim.addColorStop(0.82, alphaColor('125,211,252', 0.12 * glow));
      rim.addColorStop(1, alphaColor('125,211,252', 0.42 * glow));
      ctx.fillStyle = rim;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const term = ctx.createRadialGradient(cx - r * 0.5, cy - r * 0.55, r * 0.12, cx, cy, r * 1.02);
      term.addColorStop(0, alphaColor(core[1], 0));
      term.addColorStop(0.5, alphaColor(core[1], 0));
      term.addColorStop(0.82, alphaColor(core[1], 0.14));
      term.addColorStop(1, alphaColor(core[1], 0.46));
      ctx.fillStyle = term;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const edgeGlow = ctx.createRadialGradient(cx, cy, r * 1.02, cx, cy, r * 1.18);
      edgeGlow.addColorStop(0, alphaColor('103,232,249', 0.16 * glow));
      edgeGlow.addColorStop(1, alphaColor('103,232,249', 0));
      ctx.fillStyle = edgeGlow;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      drawWireframe(ctx, cx, cy, r, rotation, wire, glow);
      drawWireframe(ctx, cx, cy, r, rotation, '186,230,253', glow * 0.26);

      ctx.restore();
    };

    const drawMoon = (cx: number, cy: number, r: number, rotation: number) => {
      const spec = palette.core;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.clip();
      const grad = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.08, cx, cy, r);
      grad.addColorStop(0, alphaColor('125,211,252', 1));
      grad.addColorStop(0.55, alphaColor(spec[0], 1));
      grad.addColorStop(1, alphaColor(palette.nebula[1], 0.4));
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      drawWireframe(ctx, cx, cy, r, rotation, palette.wire, palette.glowScale * 0.7);
      ctx.restore();
    };

    const draw = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      if (!reduced) {
        mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt / 80);
        mainRot += (dt / 1000) * 0.13;
        moonRot += (dt / 1000) * 0.05;
      }

      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      const px = mouse.active ? (mouse.x - w / 2) / w : 0;
      const py = mouse.active ? (mouse.y - h / 2) / h : 0;
      const glow = palette.glowScale;

      for (let s = 0; s < 2; s += 1) {
        const sprite = sprites[s];
        if (!sprite) continue;
        const fx = s === 0 ? 0.14 : 0.88;
        const fy = s === 0 ? 0.72 : 0.28;
        const r = Math.max(260, Math.min(w, h) * (s === 0 ? 0.42 : 0.34));
        const ox = fx * w + Math.sin(t * 0.16 + s * 2) * 24 + px * (s === 0 ? -26 : 24);
        const oy = fy * h + Math.cos(t * 0.13 + s * 2) * 20 + py * (s === 0 ? -16 : 16);
        ctx.globalAlpha = (palette.nebulaAlpha[s] ?? 0.1) * glow;
        ctx.drawImage(sprite, ox - r, oy - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      for (let i = 0; i < dust.length; i += 1) {
        const d = dust[i];
        if (!d) continue;
        d.x += d.vx * (dt / 16.6);
        d.y += d.vy * (dt / 16.6);
        if (d.x < -10) d.x = w + 10;
        else if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        else if (d.y > h + 10) d.y = -10;
        const depth = d.layer === 0 ? 0.35 : 0.85;
        const sx = d.x + px * (d.layer === 0 ? -40 : -90);
        const sy = d.y + py * (d.layer === 0 ? -20 : -50);
        ctx.globalAlpha = (d.layer === 0 ? 0.28 : 0.6) * glow * (0.6 + 0.4 * Math.sin(t * 0.8 + d.tw));
        const rgb = palette.dust[d.color] ?? palette.dust[0];
        ctx.fillStyle = alphaColor(rgb, 1);
        ctx.beginPath();
        ctx.arc(sx, sy, d.r, 0, TWO_PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const mainP = main;
      const moonP = moon;
      if (!mainP || !moonP) return;

      const cx = mainP.fx * w + Math.sin(t * mainP.drift) * 18 + px * mainP.parallaxX;
      const cy = mainP.fy * h + Math.cos(t * mainP.drift * 0.9) * 14 + py * mainP.parallaxY;
      const mcx = moonP.fx * w + Math.sin(t * moonP.drift) * 10 - px * moonP.parallaxX;
      const mcy = moonP.fy * h + Math.cos(t * moonP.drift * 0.8) * 8 - py * moonP.parallaxY;
      const r = mainP.r;

      const mx = cx - mouse.x;
      const my = cy - mouse.y;
      const prox = mouse.active ? Math.max(0, 1 - Math.sqrt(mx * mx + my * my) / (r * 2.4)) : 0;
      if (!reduced) mainRot += (dt / 1000) * 0.13 * prox * 0.6;

      const ringTilt = 0.44 + Math.sin(t * 0.06) * 0.02;
      const pathTilt = 0.32 + Math.sin(t * 0.05) * 0.02;

      const orbitA = r * 1.72;
      const orbitB = r * 1.72 * 0.36;
      const orbitA2 = r * 2.25;
      const orbitB2 = r * 2.25 * 0.28;

      const part1 = orbitPoints(cx, cy, orbitA, orbitB, t, pathTilt, -0.34, 6, 0);
      const part2 = orbitPoints(cx, cy, orbitA2, orbitB2, t, pathTilt, 0.2, 4, Math.PI * 0.4);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(pathTilt);
      ctx.strokeStyle = alphaColor(palette.ring, 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitA, orbitB, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitA2, orbitB2, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.restore();

      for (const p of part1) if (!p.front) drawGlint(p, orbitA);
      for (const p of part2) if (!p.front) drawGlint(p, orbitA2);
      ctx.globalAlpha = 1;

      drawRings(ctx, mcx, mcy, moonP.r, 0.3, palette.ring, glow * 0.6, 'back');
      drawMoon(mcx, mcy, moonP.r, moonRot);
      drawRings(ctx, mcx, mcy, moonP.r, 0.3, palette.ring, glow * 0.6, 'front');

      const halo = sprites[0];
      if (halo) {
        ctx.globalAlpha = 0.3 * glow;
        ctx.drawImage(halo, cx - r * 2, cy - r * 2, r * 4, r * 4);
      }
      const haloV = sprites[1];
      if (haloV) {
        ctx.globalAlpha = 0.2 * glow;
        ctx.drawImage(haloV, cx - r * 2.6, cy - r * 2.6, r * 5.2, r * 5.2);
      }
      ctx.globalAlpha = 1;

      drawRings(ctx, cx, cy, r, ringTilt, palette.ring, glow, 'back');
      drawSphereBody(cx, cy, r, mainRot + prox * 0.4, palette.core, palette.wire, glow);
      drawRings(ctx, cx, cy, r, ringTilt, palette.ring, glow, 'front');

      const specGlow = sprites[0];
      if (specGlow) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.55 * glow;
        ctx.drawImage(specGlow, cx - r * 0.6, cy - r * 0.66, r * 1.2, r * 1.2);
        ctx.globalAlpha = 0.26 * glow;
        ctx.drawImage(specGlow, cx - r * 0.95, cy - r * 1.1, r * 1.9, r * 1.9);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;

      for (const p of part1) if (p.front) drawGlint(p, orbitA);
      for (const p of part2) if (p.front) drawGlint(p, orbitA2);
      ctx.globalAlpha = 1;

      if (mouse.active && !reduced) {
        const cg = sprites[0];
        if (cg) {
          ctx.globalAlpha = 0.14 * glow;
          ctx.drawImage(cg, mouse.x - 140, mouse.y - 140, 280, 280);
        }
        ctx.globalAlpha = 1;
      }
    };

    const drawGlint = (p: OrbitPoint, orbitR: number) => {
      const sprite = sprites[0];
      if (!sprite) return;
      const size = Math.max(3, orbitR * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(sprite, p.x - size, p.y - size, size * 2, size * 2);
      ctx.globalCompositeOperation = 'source-over';
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuild();
    };

    const onMove = (e: PointerEvent) => {
      mouse.active = true;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const onLeave = () => {
      mouse.active = false;
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const loop = (now: number) => {
      if (disposed) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (reduced) {
        draw(performance.now());
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    const themeObserver = new MutationObserver(rebuild);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (!reduced && !document.hidden) {
      running = true;
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="o-bg-canvas" aria-hidden="true" />;
}