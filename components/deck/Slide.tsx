'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { stackProps, useDeck } from './Deck';

type Props = {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  lede: string;
  tryIt?: string;
  ghost: string;
  children: React.ReactNode;
  size?: 'wide' | 'normal';
  /** position in the stack (0-based) */
  i: number;
};

/**
 * One chapter as a stacked card (after olivierlarose/cards-parallax). Sticky
 * full-viewport container; the card scales toward its resting size as the
 * following chapters slide over it, offset a few pixels per index so the pile
 * stays visible. While it enters, the demo settles and the ghost word drifts.
 */
export default function Slide({ id, index, label, title, lede, tryIt, ghost, children, size = 'normal', i }: Props) {
  const deck = useDeck();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const { range, targetScale } = stackProps(i, deck?.count ?? 6);
  const fallback = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const scale = useTransform(deck?.progress ?? fallback, range, reduce ? [1, 1] : [1, targetScale]);
  const demoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1]);
  const ghostY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, 0]);
  const copyO = useTransform(scrollYProgress, [0.05, 0.5], [0, 1]);

  // Phones: the card is taller than the screen, so it pins by its bottom edge
  // (top = 100svh - height) once fully read, and the next card slides over it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => el.style.setProperty('--slide-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`lf-slide lf-slide-${size}`} data-slide={id}>
      <motion.div className="lf-slide-card" style={{ scale, ['--stack-top' as string]: `calc(-4vh + ${i * 22}px)` }}>
        <motion.span className="lf-slide-ghost" aria-hidden="true" style={{ y: ghostY }}>{ghost}</motion.span>
        <div className="lf-slide-inner">
          <motion.header className="lf-slide-head" style={{ y: copyY, opacity: copyO }}>
            <span className="lf-slide-label"><b>{index}</b>{label}</span>
            <h2 className="lf-slide-title">{title}</h2>
            <p className="lf-slide-lede">{lede}</p>
            {tryIt && <span className="lf-slide-try"><i className="lf-dot" />{tryIt}</span>}
          </motion.header>
          <div className="lf-slide-demo-clip">
            <motion.div className="lf-slide-demo" style={{ scale: demoScale }}>
              {children}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
