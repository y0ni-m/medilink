'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { DISCLAIMER } from './Deck';

type Props = {
  id?: string; index: string; label: string; title: React.ReactNode; sub: string;
  cta: { label: string; href: string }; secondary?: { label: string; href: string };
  stats: [string, string][]; trust: string[];
};

export default function Closing({ id = 'close', index, label, title, sub, cta, secondary, stats, trust }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, 0]);
  const o = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  return (
    <section ref={ref} className="lf-close" id={id}>
      <motion.div className="lf-inner lf-close-inner" style={{ y, opacity: o }}>
        <span className="lf-slide-label lf-slide-label-light"><b>{index}</b>{label}</span>
        <h2 className="lf-close-title">{title}</h2>
        <p className="lf-close-sub">{sub}</p>
        <div className="lf-close-ctas">
          <a className="btn lf-btn-light" href={cta.href}>{cta.label}</a>
          {secondary && <a className="lf-close-call" href={secondary.href}>{secondary.label}</a>}
        </div>
        <div className="lf-close-stats">
          {stats.map(([n, t], i) => (
            <motion.div key={n + t} className="lf-close-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}>
              <b>{n}</b><span>{t}</span>
            </motion.div>
          ))}
        </div>
        <div className="lf-close-trust">{trust.map((t) => <span key={t}>{t}</span>)}</div>
        <p className="lf-disclaimer lf-disclaimer-light">{DISCLAIMER}</p>
      </motion.div>
    </section>
  );
}
