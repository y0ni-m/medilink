'use client';

import { useEffect, useRef } from 'react';

type Dot = {
  bx: number;
  by: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
  speedX: number;
  speedY: number;
  r: number;
  color: string;
  pulse: number;
};

const PALETTE = ['#0da7ca', '#119dc3', '#22346a', '#3d5afe'];

export default function DotStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seedDots = (W: number, H: number) => {
      const cx = W / 2;
      const cy = H / 2;
      const N = 280;
      const dots: Dot[] = [];
      for (let i = 0; i < N; i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.pow(Math.random(), 0.55) * Math.min(W, H) * 0.46;
        dots.push({
          bx: cx + Math.cos(ang) * rad,
          by: cy + Math.sin(ang) * rad,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          ampX: 1.5 + Math.random() * 4,
          ampY: 1.5 + Math.random() * 4,
          speedX: 0.35 + Math.random() * 0.6,
          speedY: 0.35 + Math.random() * 0.6,
          r: 1.6 + Math.random() * 1.8,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          pulse: 0,
        });
      }
      dotsRef.current = dots;
    };

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDots(rect.width, rect.height);
    };

    setSize();

    const start = performance.now();

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      // occasionally pulse a random dot to evoke a referral firing
      if (Math.random() < 0.05) {
        const dots = dotsRef.current;
        const idx = Math.floor(Math.random() * dots.length);
        if (dots[idx]) dots[idx].pulse = 1;
      }

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const x = d.bx + Math.sin(t * d.speedX + d.phaseX) * d.ampX;
        const y = d.by + Math.cos(t * d.speedY + d.phaseY) * d.ampY;

        if (d.pulse > 0) {
          ctx.fillStyle = d.color;
          ctx.globalAlpha = 0.18 * d.pulse;
          ctx.beginPath();
          ctx.arc(x, y, d.r + d.pulse * 12, 0, Math.PI * 2);
          ctx.fill();
          d.pulse *= 0.92;
          if (d.pulse < 0.02) d.pulse = 0;
        }

        ctx.fillStyle = d.color;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(setSize);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="stage stage-dots">
      <canvas ref={canvasRef} className="dot-canvas" />
      <div className="stage-dots-legend">
        <span className="stage-dots-legend-dot" />
        Live · 1 dot = 6 active referrals
      </div>
    </div>
  );
}
