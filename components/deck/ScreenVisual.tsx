'use client';

import { useEffect, useRef, useState } from 'react';

type Card = { eyebrow: string; title: string; sub: string; green?: boolean; spark?: boolean };

/**
 * A real app screen in a browser frame that leans with the cursor and
 * flattens as the page scrolls, with status cards drifting over its edge.
 */
export default function ScreenVisual({ src, url, cards }: { src: string; url: string; cards: Card[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flat, setFlat] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setFlat(Math.min(1, window.scrollY / 460)); }); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const onMove = (e: React.MouseEvent) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -7, y: ((e.clientX - r.left) / r.width - 0.5) * 9 }); };
  const k = 1 - flat;
  const screen = { transform: `perspective(1600px) rotateY(${-7 * k + tilt.y * k}deg) rotateX(${1.5 * k + tilt.x * k}deg) translateY(${flat * -14}px)` };
  const card = (speed: number) => ({ transform: `translate3d(${tilt.y * -speed * 0.6}px, ${flat * -speed * 40 + tilt.x * speed * 0.6}px, 0)` });
  return (
    <div className="lf-hero-visual" ref={ref} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="lf-hero-screen" style={screen} aria-hidden="true">
        <div className="lf-hero-screen-bar"><span /><span /><span /><em>{url}</em></div>
        <img src={src} alt="" decoding="async" />
      </div>
      <div className="lf-feed" aria-hidden="true">
        {cards.map((c, i) => (
          <div key={c.title} className={`lf-feed-card lf-feed-c${i + 1}`} style={card(1.4 - i * 0.4)}>
            <span className="lf-feed-eyebrow">{c.spark ? <i className="lf-spark" /> : <i className={`lf-dot ${c.green ? 'lf-dot-green' : ''}`} />}{c.eyebrow}</span>
            <b>{c.title}</b>
            <span>{c.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
