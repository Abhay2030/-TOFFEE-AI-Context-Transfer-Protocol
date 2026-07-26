"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   TOFFEE AI — Cinematic Loading Experience
   5-phase visual story: Birth → Intelligence → Transfer →
   Understanding → Reveal
   ══════════════════════════════════════════════════════════════ */

// ── Premium Color Palette ──
type RGB = { r: number; g: number; b: number };
const P = {
  bg: "#030712",
  indigo:  { r: 79, g: 70, b: 229 },
  cyan:    { r: 6, g: 182, b: 212 },
  purple:  { r: 124, g: 58, b: 237 },
  violet:  { r: 139, g: 92, b: 246 },
  emerald: { r: 16, g: 185, b: 129 },
  blue:    { r: 59, g: 130, b: 246 },
  white:   { r: 226, g: 232, b: 240 },
};

// ── Math ──
const rgba = (c: RGB, a: number) => `rgba(${c.r},${c.g},${c.b},${a})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (lo: number, hi: number, x: number) => {
  const t = clamp01((x - lo) / (hi - lo));
  return t * t * (3 - 2 * t);
};
const lerpC = (a: RGB, b: RGB, t: number): RGB => ({
  r: Math.round(lerp(a.r, b.r, t)),
  g: Math.round(lerp(a.g, b.g, t)),
  b: Math.round(lerp(a.b, b.b, t)),
});

// ── Particle ──
interface Pt {
  baseR: number;
  angle: number;
  speed: number;
  wobblePhase: number;
  wobbleAmp: number;
  size: number;
  color: RGB;
  colorAlt: RGB;
  birth: number;
  glow: number;
  x: number;
  y: number;
}

interface Stream {
  angle: number;
  speed: number;
  progress: number;
  size: number;
  color: RGB;
  trail: { x: number; y: number }[];
  birth: number;
}

const COLORS = [P.cyan, P.indigo, P.purple, P.violet, P.blue, P.emerald];
const rngColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export default function ToffeeLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);
  const [dismissing, setDismissing] = useState(false);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Phase progression — drives text reveals
  useEffect(() => {
    if (reduced) { setPhase(5); return; }
    const ts = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 5800),
      setTimeout(() => setPhase(5), 7200),
    ];
    return () => ts.forEach(clearTimeout);
  }, [reduced]);

  // ── Canvas Engine ──
  const boot = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d", { alpha: false });
    if (!ctx) return;

    let dpr = 1, w = 0, h = 0, cx = 0, cy = 0;

    const resize = () => {
      const r = cvs.parentElement?.getBoundingClientRect();
      if (!r) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cx = w / 2; cy = h / 2;
      cvs.width = w * dpr; cvs.height = h * dpr;
      cvs.style.width = `${w}px`; cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Build particles ──
    const pts: Pt[] = [];
    const mkPt = (rRange: [number, number], bRange: [number, number], sRange: [number, number]) => {
      pts.push({
        baseR: lerp(rRange[0], rRange[1], Math.random()),
        angle: Math.random() * Math.PI * 2,
        speed: lerp(0.12, 0.55, Math.random()) * (Math.random() > 0.5 ? 1 : -1),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmp: lerp(3, 10, Math.random()),
        size: lerp(sRange[0], sRange[1], Math.random()),
        color: rngColor(),
        colorAlt: rngColor(),
        birth: lerp(bRange[0], bRange[1], Math.random()),
        glow: lerp(8, 18, Math.random()),
        x: cx, y: cy,
      });
    };

    // Inner (12), Neural (55), Orbit (40), Ambient (45)
    for (let i = 0; i < 12; i++) mkPt([20, 60], [0.2, 1.2], [1.5, 3.5]);
    for (let i = 0; i < 55; i++) mkPt([55, 165], [1, 3.2], [1, 2.5]);
    for (let i = 0; i < 40; i++) mkPt([150, 290], [2, 4.2], [0.7, 2]);
    for (let i = 0; i < 45; i++) mkPt([40, 420], [0, 2.5], [0.3, 1]);

    // ── Data streams ──
    const streams: Stream[] = [];
    for (let i = 0; i < 8; i++) {
      streams.push({
        angle: (i / 8) * Math.PI * 2 + Math.random() * 0.3,
        speed: lerp(0.004, 0.011, Math.random()),
        progress: Math.random(),
        size: lerp(1.5, 3, Math.random()),
        color: [P.cyan, P.indigo, P.emerald][i % 3],
        trail: [],
        birth: lerp(2.8, 4.2, Math.random()),
      });
    }

    // ── Rings ──
    const rings = [
      { r: 50, a: 0.1, spd: 0.22, rot: 0, dl: 4, gl: 9, birth: 1.2 },
      { r: 90, a: 0.06, spd: -0.16, rot: 0, dl: 5, gl: 14, birth: 2 },
      { r: 140, a: 0.04, spd: 0.1, rot: 0, dl: 3, gl: 18, birth: 2.8 },
      { r: 210, a: 0.02, spd: -0.07, rot: 0, dl: 2, gl: 22, birth: 3.5 },
    ];

    const t0 = performance.now();

    // ── RENDER LOOP ──
    const render = () => {
      const t = (performance.now() - t0) / 1000;
      const dt = 1 / 60;
      const intensity = smoothstep(0, 5, t);

      // Background
      ctx.fillStyle = P.bg;
      ctx.fillRect(0, 0, w, h);

      // Breathing
      const breath = 0.5 + Math.sin(t * 0.4) * 0.15;
      const glowR = lerp(140, 260, intensity);

      // Primary ambient glow
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g1.addColorStop(0, rgba(P.indigo, 0.07 * breath * intensity));
      g1.addColorStop(0.35, rgba(P.purple, 0.035 * breath * intensity));
      g1.addColorStop(0.65, rgba(P.cyan, 0.015 * breath * intensity));
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Wandering secondary glow
      const wx = cx + Math.sin(t * 0.28) * 35;
      const wy = cy + Math.cos(t * 0.22) * 25;
      const g2 = ctx.createRadialGradient(wx, wy, 0, wx, wy, 180);
      g2.addColorStop(0, rgba(P.cyan, 0.03 * breath * intensity));
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Rings ──
      rings.forEach((ring) => {
        const vis = smoothstep(ring.birth, ring.birth + 1.5, t);
        if (vis < 0.002) return;
        ring.rot += ring.spd * dt;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.rot);
        ctx.strokeStyle = rgba(P.indigo, ring.a * vis + Math.sin(t * 0.5 + ring.r * 0.01) * 0.01);
        ctx.lineWidth = 0.5;
        ctx.setLineDash([ring.dl, ring.gl]);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });

      // ── Update & draw particles ──
      const visible: Pt[] = [];
      pts.forEach((p) => {
        const vis = smoothstep(p.birth, p.birth + 1, t);
        if (vis < 0.005) return;

        p.angle += p.speed * dt;
        p.x = cx + Math.cos(p.angle) * p.baseR + Math.sin(t * 1.8 + p.wobblePhase) * p.wobbleAmp;
        p.y = cy + Math.sin(p.angle) * p.baseR + Math.cos(t * 1.8 + p.wobblePhase * 1.3) * p.wobbleAmp;

        const ct = (Math.sin(t * 0.35 + p.wobblePhase) + 1) / 2;
        const col = lerpC(p.color, p.colorAlt, ct);
        const pulse = clamp01(vis * (0.6 + Math.sin(t * 2 + p.wobblePhase) * 0.25));

        // Glow
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
        gr.addColorStop(0, rgba(col, pulse * 0.2));
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fillRect(p.x - p.glow, p.y - p.glow, p.glow * 2, p.glow * 2);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * vis, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, pulse);
        ctx.fill();

        visible.push(p);
      });

      // ── Neural connections ──
      let connCount = 0;
      const maxConn = 220;
      for (let i = 0; i < visible.length && connCount < maxConn; i++) {
        for (let j = i + 1; j < visible.length && connCount < maxConn; j++) {
          const dx = visible[i].x - visible[j].x;
          const dy = visible[i].y - visible[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 10000) continue; // 100px
          const d = Math.sqrt(d2);
          const a = (1 - d / 100) * 0.1;
          const pulse = (Math.sin(t * 1.8 + i * 0.4) + 1) / 2;

          ctx.beginPath();
          ctx.moveTo(visible[i].x, visible[i].y);
          ctx.lineTo(visible[j].x, visible[j].y);
          ctx.strokeStyle = rgba(P.indigo, a * (0.4 + pulse * 0.6));
          ctx.lineWidth = 0.4;
          ctx.stroke();
          connCount++;
        }
      }

      // ── Data streams ──
      streams.forEach((s) => {
        const vis = smoothstep(s.birth, s.birth + 1.2, t);
        if (vis < 0.005) return;

        s.progress += s.speed;
        if (s.progress > 1) s.progress -= 1;

        const eased = s.progress * s.progress * (3 - 2 * s.progress);
        const sR = 45 + eased * 160;
        const sA = s.angle + eased * Math.PI * 2.5;
        const sx = cx + Math.cos(sA) * sR;
        const sy = cy + Math.sin(sA) * sR;

        s.trail.push({ x: sx, y: sy });
        if (s.trail.length > 18) s.trail.shift();

        for (let i = 1; i < s.trail.length; i++) {
          const ta = (i / s.trail.length) * 0.25 * vis;
          ctx.beginPath();
          ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
          ctx.lineTo(s.trail[i].x, s.trail[i].y);
          ctx.strokeStyle = rgba(s.color, ta);
          ctx.lineWidth = s.size * (i / s.trail.length) * vis;
          ctx.stroke();
        }

        // Head
        const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size * 4);
        hg.addColorStop(0, rgba(s.color, 0.5 * vis));
        hg.addColorStop(1, "transparent");
        ctx.fillStyle = hg;
        ctx.fillRect(sx - s.size * 4, sy - s.size * 4, s.size * 8, s.size * 8);

        ctx.beginPath();
        ctx.arc(sx, sy, s.size * vis, 0, Math.PI * 2);
        ctx.fillStyle = rgba(s.color, 0.85 * vis);
        ctx.fill();
      });

      // ── Central core ──
      const coreBirth = smoothstep(0.3, 1.5, t);
      const coreBreath = 0.85 + Math.sin(t * 1.1) * 0.15;
      const coreR = 16 * coreBreath * coreBirth;

      // Aura
      const aura = ctx.createRadialGradient(cx, cy, coreR * 0.3, cx, cy, coreR * 3.5);
      aura.addColorStop(0, rgba(P.indigo, 0.12 * coreBreath * coreBirth));
      aura.addColorStop(0.4, rgba(P.purple, 0.04 * coreBreath * coreBirth));
      aura.addColorStop(1, "transparent");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Morphing hex↔circle
      const morphT = (Math.sin(t * 0.55) + 1) / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.18);
      const cf = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      cf.addColorStop(0, rgba(P.indigo, 0.3 * coreBirth));
      cf.addColorStop(0.7, rgba(P.purple, 0.12 * coreBirth));
      cf.addColorStop(1, rgba(P.cyan, 0.04 * coreBirth));
      ctx.fillStyle = cf;
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const hexR = coreR * Math.cos(Math.PI / sides);
        const r = lerp(hexR, coreR, morphT);
        const px = Math.cos(a) * r, py = Math.sin(a) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgba(P.cyan, (0.25 + Math.sin(t * 1.4) * 0.08) * coreBirth);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // Rotating arcs
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 1.3);
      ctx.beginPath();
      ctx.arc(0, 0, 28 * coreBirth, 0, Math.PI * 0.45);
      ctx.strokeStyle = rgba(P.cyan, 0.35 * coreBirth);
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.9);
      ctx.beginPath();
      ctx.arc(0, 0, 38 * coreBirth, 0, Math.PI * 0.3);
      ctx.strokeStyle = rgba(P.violet, 0.2 * coreBirth);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    return boot();
  }, [reduced, boot]);

  // Dismiss handler
  const handleDismiss = useCallback(() => {
    if (dismissing) return;
    setDismissing(true);
    setTimeout(() => {
      onComplete?.();
    }, 1200);
  }, [dismissing, onComplete]);

  return (
    <div
      id="toffee-loader"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: P.bg,
        opacity: dismissing ? 0 : 1,
        transform: dismissing ? "scale(1.02)" : "scale(1)",
        filter: dismissing ? "blur(8px)" : "blur(0px)",
        transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1), transform 1.2s cubic-bezier(0.4,0,0.2,1), filter 1.2s cubic-bezier(0.4,0,0.2,1)",
      }}
      role="status"
      aria-label="Loading Toffee AI"
      aria-live="polite"
    >
      {/* Canvas */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
          aria-hidden="true"
        />
      )}

      {/* Reduced motion fallback */}
      {reduced && (
        <div className="relative w-12 h-12 mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(79,70,229,0.3)",
              borderTopColor: "#4f46e5",
              animation: "toffee-spin 1.2s linear infinite",
            }}
          />
        </div>
      )}

      {/* ── Text Overlay ── */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none select-none"
           style={{ marginTop: "100px" }}>

        {/* TOFFEE AI logo */}
        <div className="flex items-baseline gap-3" style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #06b6d4, #4f46e5, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            TOFFEE
          </span>
          <span style={{
            fontSize: "0.7rem",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontWeight: 500,
            letterSpacing: "0.2em",
            color: "#64748b",
            opacity: phase >= 4 ? 0.7 : 0,
            transition: "opacity 1.2s ease-out 0.3s",
          }}>
            AI
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: "#64748b",
          marginTop: "12px",
          opacity: phase >= 5 ? 0.55 : 0,
          transform: phase >= 5 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          Transfer Context. Preserve Intelligence.
        </p>

        {/* Minimal progress bar */}
        <div style={{
          width: "120px",
          height: "1px",
          background: "#1e293b",
          borderRadius: "1px",
          overflow: "hidden",
          marginTop: "20px",
          opacity: phase >= 5 ? 0.5 : 0,
          transition: "opacity 1s ease-out 0.6s",
        }}>
          <div style={{
            height: "100%",
            borderRadius: "1px",
            background: "linear-gradient(90deg, #06b6d4, #4f46e5)",
            animation: "toffee-bar 2.4s cubic-bezier(0.45,0,0.55,1) infinite",
          }} />
        </div>
      </div>

      {/* ── Credits (bottom) ── */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1 pointer-events-none select-none" style={{
        opacity: phase >= 5 ? 0.35 : 0,
        transform: phase >= 5 ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 1.5s cubic-bezier(0.16,1,0.3,1) 1s, transform 1.5s cubic-bezier(0.16,1,0.3,1) 1s",
      }}>
        <span style={{
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          color: "#475569",
        }}>
          Crafted by Abhay
        </span>
        <span style={{
          fontSize: "0.6rem",
          letterSpacing: "0.08em",
          color: "#334155",
        }}>
          © 2026 Abhay. All Rights Reserved.
        </span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes toffee-bar {
          0%   { width: 0%;  margin-left: 0; }
          50%  { width: 65%; margin-left: 17%; }
          100% { width: 0%;  margin-left: 100%; }
        }
        @keyframes toffee-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          #toffee-loader canvas { display: none !important; }
          @keyframes toffee-bar {
            0%, 100% { width: 40%; margin-left: 30%; }
          }
        }
      `}</style>

      <span className="sr-only">Loading Toffee AI — Transfer Context. Preserve Intelligence.</span>
    </div>
  );
}

export function ToffeeLoaderPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <ToffeeLoader />
    </div>
  );
}
