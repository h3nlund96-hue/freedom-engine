"use client";

import { useEffect, useRef } from "react";

/**
 * Ember's glyph — a small reactive core with a ring of radial ticks, drawn
 * on canvas so it can scale from an inline icon up to a full-screen presence
 * without going soft. Idles as a slow amber-to-cyan breathing ring; while
 * `speaking` is true the ring reacts like an audio equalizer — the seam
 * voice output will eventually drive for real.
 *
 * Sized entirely by `className` (e.g. "h-8 w-8" or "h-[min(58vw,58vh)]
 * w-[min(58vw,58vh)]") rather than a fixed pixel prop, so callers can grow
 * it responsively — the canvas fills whatever box it's given and redraws
 * at the right resolution as that box changes, including mid-transition.
 *
 * Reused everywhere Ember shows up (Hall of Embers, the front-page greeting,
 * the floating widget) so she reads as one consistent presence.
 */

const TICK_COUNT = 48;
const AMBER: [number, number, number] = [255, 171, 74];
const CYAN: [number, number, number] = [77, 216, 255];

function lerpColor(a: [number, number, number], b: [number, number, number], f: number) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * f));
}

interface EmberGlyphProps {
  /** Tailwind sizing classes for the canvas box, e.g. "h-8 w-8". Defaults to a small inline icon size. */
  className?: string;
  /** Reactive "equalizer" mode instead of the calm idle breathing. */
  speaking?: boolean;
}

export function EmberGlyph({ className, speaking = false }: EmberGlyphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speakingRef = useRef(speaking);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let glyphSize = 32;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === 0) return;
      glyphSize = rect.width;
      canvas!.width = Math.round(glyphSize * dpr);
      canvas!.height = Math.round(glyphSize * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const ticks = Array.from({ length: TICK_COUNT }, (_, i) => ({
      current: 0.12,
      target: 0.12,
      phase: (i / TICK_COUNT) * Math.PI * 2,
    }));

    let t = 0;
    let lastRetarget = 0;

    function draw(now: number) {
      t += 0.02;
      const w = glyphSize;
      const cx = w / 2;
      const cy = w / 2;
      const scale = w / 64; // 64px is the baseline everything else is proportioned against
      ctx!.clearRect(0, 0, w, w);

      if (speakingRef.current && now - lastRetarget > 100) {
        ticks.forEach((tick) => { tick.target = 0.25 + Math.random() * 0.85; });
        lastRetarget = now;
      } else if (!speakingRef.current) {
        ticks.forEach((tick) => { tick.target = 0.1 + 0.06 * Math.sin(tick.phase * 3 + t * 0.6); });
      }

      // breathing core
      const coreR = (9 + Math.sin(t * (speakingRef.current ? 3 : 1.1)) * (speakingRef.current ? 1.5 : 0.8)) * scale;
      const coreGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 1.8);
      coreGrad.addColorStop(0, "rgba(255,235,210,0.95)");
      coreGrad.addColorStop(0.4, `rgba(255,171,74,${speakingRef.current ? 0.85 : 0.7})`);
      coreGrad.addColorStop(1, "rgba(77,216,255,0)");
      ctx!.beginPath();
      ctx!.fillStyle = coreGrad;
      ctx!.arc(cx, cy, coreR * 1.8, 0, Math.PI * 2);
      ctx!.fill();

      // tick ring
      const innerR = 17 * scale;
      const maxLen = 10 * scale;
      ticks.forEach((tick, i) => {
        tick.current += (tick.target - tick.current) * 0.22;
        const len = maxLen * tick.current;
        const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * (innerR + len);
        const y2 = cy + Math.sin(angle) * (innerR + len);
        const col = lerpColor(AMBER, CYAN, Math.min(tick.current, 1));
        ctx!.strokeStyle = `rgba(${col.join(",")},${0.35 + tick.current * 0.55})`;
        ctx!.lineWidth = Math.max(1.1 * scale, 0.75);
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
      });

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    draw(0);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block shrink-0 transition-[width,height] duration-700 ease-out ${className ?? "h-8 w-8"}`}
      aria-hidden
    />
  );
}
