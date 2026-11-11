'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 0 → 1 as the element travels through the viewport.
 * For a tall "pinned" section (taller than the viewport) it is the share of
 * the pin distance already scrolled; for a short one, its journey from
 * entering at the bottom to leaving at the top.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pin = r.height - vh;
      const v = pin > 40 ? -r.top / pin : (vh - r.top) / (vh + r.height);
      setProgress(Math.min(1, Math.max(0, v)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return { ref, progress };
}
