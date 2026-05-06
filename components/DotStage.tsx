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
  alpha: number;
  isCity: boolean;
  cityIdx: number;
  pulse: number;
};

// Approximate US city anchors as (lng, lat) — denser regions get more clinics.
// weight = relative dot density at this city.
const CITIES: { name: string; lng: number; lat: number; weight: number }[] = [
  { name: 'NYC', lng: -74.0, lat: 40.7, weight: 1.5 },
  { name: 'Boston', lng: -71.06, lat: 42.36, weight: 0.8 },
  { name: 'Philadelphia', lng: -75.16, lat: 39.95, weight: 0.9 },
  { name: 'DC', lng: -77.04, lat: 38.9, weight: 1.0 },
  { name: 'Atlanta', lng: -84.39, lat: 33.75, weight: 1.1 },
  { name: 'Miami', lng: -80.19, lat: 25.76, weight: 1.4 },
  { name: 'Tampa', lng: -82.46, lat: 27.95, weight: 0.9 },
  { name: 'Orlando', lng: -81.38, lat: 28.54, weight: 0.9 },
  { name: 'Charlotte', lng: -80.84, lat: 35.23, weight: 0.7 },
  { name: 'Nashville', lng: -86.78, lat: 36.16, weight: 0.6 },
  { name: 'Houston', lng: -95.37, lat: 29.76, weight: 1.3 },
  { name: 'Dallas', lng: -96.8, lat: 32.78, weight: 1.2 },
  { name: 'Austin', lng: -97.74, lat: 30.27, weight: 0.7 },
  { name: 'Chicago', lng: -87.65, lat: 41.85, weight: 1.2 },
  { name: 'Detroit', lng: -83.05, lat: 42.33, weight: 0.7 },
  { name: 'Minneapolis', lng: -93.27, lat: 44.98, weight: 0.6 },
  { name: 'Denver', lng: -104.99, lat: 39.74, weight: 0.7 },
  { name: 'Phoenix', lng: -112.07, lat: 33.45, weight: 0.9 },
  { name: 'Las Vegas', lng: -115.14, lat: 36.17, weight: 0.6 },
  { name: 'Salt Lake', lng: -111.89, lat: 40.76, weight: 0.5 },
  { name: 'LA', lng: -118.24, lat: 34.05, weight: 1.4 },
  { name: 'San Diego', lng: -117.16, lat: 32.72, weight: 0.7 },
  { name: 'San Francisco', lng: -122.42, lat: 37.77, weight: 0.9 },
  { name: 'Sacramento', lng: -121.49, lat: 38.58, weight: 0.5 },
  { name: 'Portland', lng: -122.68, lat: 45.52, weight: 0.6 },
  { name: 'Seattle', lng: -122.33, lat: 47.6, weight: 0.8 },
  { name: 'St Louis', lng: -90.2, lat: 38.63, weight: 0.5 },
  { name: 'Kansas City', lng: -94.58, lat: 39.1, weight: 0.5 },
  { name: 'New Orleans', lng: -90.07, lat: 29.95, weight: 0.6 },
  { name: 'Memphis', lng: -90.05, lat: 35.15, weight: 0.5 },
];

// US bounding box for the projection
const LNG_MIN = -125;
const LNG_MAX = -66;
const LAT_MIN = 24.5;
const LAT_MAX = 49.5;

const DOT_COLOR = '#0da7ca';
const CITY_COLOR = '#22346a';

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

    const seed = (W: number, H: number) => {
      const padX = W * 0.08;
      const padY = H * 0.12;
      const usableW = W - padX * 2;
      const usableH = H - padY * 2;

      const project = (lng: number, lat: number) => {
        const x = padX + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * usableW;
        const y = padY + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * usableH;
        return { x, y };
      };

      const dots: Dot[] = [];

      // 1) City marker dots — slightly larger, deeper color
      CITIES.forEach((c, i) => {
        const { x, y } = project(c.lng, c.lat);
        dots.push({
          bx: x,
          by: y,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          ampX: 0.6 + Math.random() * 1.0,
          ampY: 0.6 + Math.random() * 1.0,
          speedX: 0.3 + Math.random() * 0.4,
          speedY: 0.3 + Math.random() * 0.4,
          r: 3.0 + c.weight * 0.6,
          alpha: 0.95,
          isCity: true,
          cityIdx: i,
          pulse: 0,
        });
      });

      // 2) Clinic cluster dots scattered around each city, density ~ weight
      const dotsPerWeight = 9; // tweak for total dot count
      CITIES.forEach((c, i) => {
        const { x, y } = project(c.lng, c.lat);
        const n = Math.round(c.weight * dotsPerWeight);
        const spread = 14 + c.weight * 10; // px radius
        for (let k = 0; k < n; k++) {
          // Soft radial scatter (more density near center)
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.pow(Math.random(), 0.65) * spread;
          dots.push({
            bx: x + Math.cos(ang) * rad,
            by: y + Math.sin(ang) * rad,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            ampX: 1.2 + Math.random() * 2.4,
            ampY: 1.2 + Math.random() * 2.4,
            speedX: 0.3 + Math.random() * 0.5,
            speedY: 0.3 + Math.random() * 0.5,
            r: 1.4 + Math.random() * 1.0,
            alpha: 0.4 + Math.random() * 0.25,
            isCity: false,
            cityIdx: i,
            pulse: 0,
          });
        }
      });

      // 3) A few stray "rural" clinics filling in between cities
      for (let k = 0; k < 80; k++) {
        const lng = LNG_MIN + Math.random() * (LNG_MAX - LNG_MIN);
        const lat = LAT_MIN + Math.random() * (LAT_MAX - LAT_MIN);
        // Bias toward east half (population)
        if (lng < -100 && Math.random() < 0.55) continue;
        const { x, y } = project(lng, lat);
        dots.push({
          bx: x,
          by: y,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          ampX: 0.8 + Math.random() * 1.4,
          ampY: 0.8 + Math.random() * 1.4,
          speedX: 0.25 + Math.random() * 0.35,
          speedY: 0.25 + Math.random() * 0.35,
          r: 1.0 + Math.random() * 0.7,
          alpha: 0.22 + Math.random() * 0.18,
          isCity: false,
          cityIdx: -1,
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
      seed(rect.width, rect.height);
    };

    setSize();
    const start = performance.now();

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);

      // Occasionally pulse a random *city* dot (as if a referral fires there)
      if (Math.random() < 0.06) {
        const cityDots = dotsRef.current.filter((d) => d.isCity);
        if (cityDots.length) {
          const target = cityDots[Math.floor(Math.random() * cityDots.length)];
          target.pulse = 1;
        }
      }

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const x = d.bx + Math.sin(t * d.speedX + d.phaseX) * d.ampX;
        const y = d.by + Math.cos(t * d.speedY + d.phaseY) * d.ampY;

        if (d.pulse > 0) {
          ctx.fillStyle = CITY_COLOR;
          ctx.globalAlpha = 0.18 * d.pulse;
          ctx.beginPath();
          ctx.arc(x, y, d.r + d.pulse * 18, 0, Math.PI * 2);
          ctx.fill();
          d.pulse *= 0.93;
          if (d.pulse < 0.02) d.pulse = 0;
        }

        ctx.fillStyle = d.isCity ? CITY_COLOR : DOT_COLOR;
        ctx.globalAlpha = d.alpha;
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
      <div className="stage-dots-meta">
        <div className="stage-dots-legend">
          <span className="stage-dots-legend-dot" />
          Live network · 38 states
        </div>
        <div className="stage-dots-stats">
          <span><b>1,847</b> clinics</span>
          <span className="stage-dots-divider" />
          <span><b>512</b> firms</span>
        </div>
      </div>
    </div>
  );
}
