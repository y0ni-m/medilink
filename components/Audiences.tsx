'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

const CARDS = [
  {
    id: 'attorneys',
    eyebrow: 'For attorneys',
    title: 'Place referrals with vetted clinics in minutes.',
    desc: 'Match clients to specialists by geography, treatment type, and capacity — all with credentialed providers and signed Patient financial responsibility in a single timeline.',
    bullets: [
      'Verified clinics with NPI + malpractice coverage',
      'Auto-generated Patient financial responsibility and intake packets',
      'Live status from intake to release',
    ],
    cta: 'Refer a case',
    visual: 'attorney' as const,
  },
  {
    id: 'providers',
    eyebrow: 'For medical providers',
    title: 'Grow your clinic with steady, qualified referrals.',
    desc: 'Receive PI cases that match your specialty and coverage area — with transparent attorney info, automated Patient financial responsibility routing, and clean settlement payouts.',
    bullets: [
      'Curated case flow on your terms',
      'No upfront fees or contracts',
      'Patient financial responsibility tracking through settlement',
    ],
    cta: 'Join the network',
    visual: 'provider' as const,
  },
];

export default function Audiences() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    const fallback = setTimeout(() => setInView(true), 1500);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section id="audiences" className={`aud ${inView ? 'is-in' : ''}`} ref={sectionRef}>
      <div className="aud-inner">
        <header className="aud-header">
          <span className="aud-eyebrow">
            <span className="aud-eyebrow-dot"></span>
            Built for both sides
          </span>
          <h2 className="aud-title">
            One network, <em>two</em> workflows.
          </h2>
        </header>

        <div className="aud-grid">
          {CARDS.map((c, i) => (
            <article
              key={c.id}
              className={`aud-card aud-card-${c.id}`}
              style={{ '--idx': i } as CSSProperties}
            >
              <div className="aud-card-top">
                <span className="aud-card-eyebrow">{c.eyebrow}</span>
                <div className="aud-card-visual">
                  {c.visual === 'attorney' ? (
                    <svg viewBox="0 0 56 56" fill="none">
                      <rect x="14" y="20" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M22 20v-3a3 3 0 013-3h6a3 3 0 013 3v3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path d="M14 28h28" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="28" cy="32" r="1.6" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 56 56" fill="none">
                      <path d="M28 14v28M14 28h28" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 4" opacity="0.5" />
                    </svg>
                  )}
                </div>
              </div>

              <h3 className="aud-card-title">{c.title}</h3>
              <p className="aud-card-desc">{c.desc}</p>

              <ul className="aud-card-bullets">
                {c.bullets.map((b, j) => (
                  <li key={j}>
                    <span className="aud-card-check">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <footer className="aud-card-foot">
                <a className="aud-card-cta" href="https://app.medilink.vip/register">
                  {c.cta}
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
