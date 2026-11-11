'use client';

import { useScrollProgress } from './useScrollProgress';
import { DISCLAIMER } from './Deck';

export type Shot = { src: string; title: string; sub: string; gated?: boolean };
const REGISTER = 'https://app.medilink.vip/register';

const CARD = 58, GAP = 3, INSET = 4;

/**
 * Real screens as a horizontal strip driven by scroll: the section pins while
 * the strip glides sideways, each frame leaning toward the centre. On phones
 * it is a plain swipeable row. A gated frame carries the join card.
 */
export default function Filmstrip({ id = 'real', index, shots, register = REGISTER }: { id?: string; index: string; shots: Shot[]; register?: string }) {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const travel = shots.length * CARD + (shots.length - 1) * GAP - (100 - INSET * 2);
  return (
    <section className="lf-film" ref={ref} id={id}>
      <div className="lf-film-sticky">
        <div className="lf-inner lf-film-head">
          <div className="lf-index"><span className="lf-index-n">{index}</span><span className="lf-index-rule" /><span className="lf-index-label">The real app</span></div>
          <h2 className="lf-h2">These are screenshots of the product, <em>not a mock-up.</em></h2>
          <p className="lf-disclaimer">{DISCLAIMER}</p>
        </div>
        <div className="lf-film-viewport">
          <div className="lf-film-track" style={{ transform: `translate3d(${-progress * travel}vw, 0, 0)` }}>
            {shots.map((s, i) => {
              const lean = (i - progress * (shots.length - 1)) * 3;
              return (
                <figure className="lf-film-card" key={s.src} style={{ transform: `perspective(1800px) rotateY(${lean}deg)` }}>
                  <div className="lf-film-frame">
                    <div className="lf-hero-screen-bar"><span /><span /><span /></div>
                    <img src={s.src} alt={`${s.title} screen in MediLink`} loading="lazy" decoding="async" />
                    {s.gated && (
                      <div className="lf-film-gate">
                        <span className="lf-map-gate-eyebrow"><i className="lf-dot" />147 verified practices · members only</span>
                        <b>Join now to view the <em>full network.</em></b>
                        <a className="btn btn-cta" href={register}>Create your free account<span className="arrow">→</span></a>
                      </div>
                    )}
                  </div>
                  <figcaption><b>{s.title}</b><span>{s.sub}</span></figcaption>
                </figure>
              );
            })}
          </div>
        </div>
        <div className="lf-film-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></div>
      </div>
    </section>
  );
}
