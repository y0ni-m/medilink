'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/site';

type Cta = { label: string; href: string; primary?: boolean };
type Props = {
  id?: string;
  eyebrow: string;
  lines: string[];        // plain lines
  emLines: string[];      // teal lines
  lede: string;
  ctas: Cta[];
  ghost: string;
  visual: React.ReactNode;
  disclaimer?: string;
  scrollTo?: string;
};

/**
 * Full-viewport opening chapter. The entrance is pure CSS (lfHeroRise / lfHeroFade in
 * lawfirms.css) so the headline is visible in the server HTML and paints at once —
 * no waiting for hydration, nothing hidden from the Largest Contentful Paint. Framer
 * only drives the scroll-linked fade-out and the ghost drift.
 */
export default function PageHero({ id = 'top', eyebrow, lines, emLines, lede, ctas, ghost, visual, disclaimer, scrollTo }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const copyO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);
  return (
    <section ref={ref} className="lf-hero" id={id}>
      <motion.span className="lf-ghost" aria-hidden="true" style={{ y: ghostY }}>{ghost}</motion.span>
      <div className="lf-inner lf-hero-grid">
        <motion.div className="lf-hero-copy" style={{ y: copyY, opacity: copyO }}>
          <span className="lf-eyebrow"><i className="lf-dot" />{eyebrow}</span>
          <h1 className="lf-h1">
            {lines.map((l) => <span key={l} className="lf-h1-line">{l}</span>)}
            {emLines.map((l) => <em key={l} className="lf-h1-line">{l}</em>)}
          </h1>
          <p className="lf-lede">{lede}</p>
          <div className="lf-ctas">
            {ctas.map((c) => <a key={c.label} className={`btn ${c.primary ? 'btn-cta' : 'btn-secondary-cta'}`} href={c.href}>{c.label}{c.primary && <span className="arrow">→</span>}</a>)}
          </div>
          <a className="lf-call" href={PHONE_HREF}>Prefer to talk? <strong>{PHONE_DISPLAY}</strong></a>
        </motion.div>
        {visual}
      </div>
      {disclaimer && <div className="lf-inner"><p className="lf-disclaimer lf-disclaimer-hero">{disclaimer}</p></div>}
      {scrollTo && (
        <motion.a href={`#${scrollTo}`} className="lf-scroll-cue" aria-label="Scroll" style={{ opacity: copyO }}><span /><span /></motion.a>
      )}
    </section>
  );
}
