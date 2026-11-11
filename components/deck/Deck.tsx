'use client';

import { useScroll, type MotionValue } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

export type Chapter = { id: string; label: string };

type DeckCtx = { progress: MotionValue<number>; count: number };
const Ctx = createContext<DeckCtx | null>(null);
export const useDeck = () => useContext(Ctx);

/** Props a Slide needs to take its place in the stack. */
export function stackProps(i: number, count: number) {
  return { i, range: [i / count, 1] as [number, number], targetScale: 1 - (count - i) * 0.035 };
}

/**
 * The card stack: wraps a run of <Slide>s, measures its own scroll progress
 * and hands it down so each card scales as the next one covers it.
 */
export function Deck({ count, children }: { count: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <Ctx.Provider value={{ progress: scrollYProgress, count }}>
      <div className="lf-stack" ref={ref}>{children}</div>
    </Ctx.Provider>
  );
}

export function scrollToChapter(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/** Presentation rail: one dot per chapter; the active one is the last whose top passed mid-viewport. */
export function Rail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let cur = chapters[0]?.id;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= mid) cur = c.id;
      }
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
  }, [chapters]);
  return (
    <nav className="lf-rail" aria-label="Chapters">
      {chapters.map((c, i) => (
        <a key={c.id} href={`#${c.id}`} className={active === c.id ? 'is-on' : ''} aria-label={c.label} onClick={(e) => { e.preventDefault(); scrollToChapter(c.id); }}>
          <i /><span aria-hidden="true">{String(i).padStart(2, '0')} · {c.label}</span>
        </a>
      ))}
    </nav>
  );
}

/** Demo helper: `children(active)` once the block is on screen; state survives after. */
export function Live({ children }: { children: (active: boolean) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{children(on)}</div>;
}

export const DISCLAIMER = 'Demo data. Every patient, client, case and law firm shown on this page is sample data for illustration. No real patient, client or firm appears here.';
