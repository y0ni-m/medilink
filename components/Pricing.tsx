'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Plan = {
  id: string;
  name: string;
  tag: string;
  price: string;
  priceSub: string;
  note: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'attorneys',
    name: 'Attorneys',
    tag: 'For personal injury law firms',
    price: 'Free',
    priceSub: 'Always. No card required.',
    note: 'Funded by clinic partners',
    features: [
      'Unlimited case referrals',
      'Verified clinic network',
      'Auto-generated LOPs & intake packets',
      'Live status from intake to release',
      'Attorney CRM with case timeline',
      'Standard email + SMS notifications',
    ],
    cta: 'Sign up free',
    href: 'https://app.medilink.vip/register',
    featured: false,
  },
  {
    id: 'clinics',
    name: 'Clinics',
    tag: 'For medical providers',
    price: 'Custom',
    priceSub: 'Built for your state and locations.',
    note: 'No setup fees.',
    features: [
      'Unlimited active referrals',
      'Priority placement in attorney searches',
      'Custom LOP + intake form templates',
      'Multi-location dashboard',
      'LOP tracking through settlement',
      'Dedicated success manager',
    ],
    cta: 'Talk to our team',
    href: 'mailto:info@medilink.vip',
    featured: true,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    const fb = setTimeout(() => setInView(true), 1200);
    return () => {
      obs.disconnect();
      clearTimeout(fb);
    };
  }, []);

  return (
    <section id="pricing" className={`pr ${inView ? 'is-in' : ''}`} ref={sectionRef}>
      <div className="pr-inner">
        <header className="pr-header">
          <span className="pr-eyebrow">
            <span className="pr-eyebrow-dot"></span>
            Pricing
          </span>
          <h1 className="pr-title">
            Built for <em>both sides</em>.
          </h1>
          <p className="pr-sub">
            Attorneys join free. Clinics get a plan tailored to their state, locations, and case mix.
          </p>
        </header>

        <div className="pr-grid pr-grid-2">
          {PLANS.map((p, i) => (
            <article
              key={p.id}
              className={`pr-card ${p.featured ? 'is-featured' : ''}`}
              style={{ '--idx': i } as CSSProperties}
            >
              {p.featured && <span className="pr-badge">Most popular</span>}
              <header className="pr-card-head">
                <h3 className="pr-card-name">{p.name}</h3>
                <span className="pr-card-tag">{p.tag}</span>
              </header>
              <div className="pr-card-price">
                <span className="pr-card-price-val">{p.price}</span>
                <span className="pr-card-price-sub">{p.priceSub}</span>
                <span className="pr-card-price-note">{p.note}</span>
              </div>
              <ul className="pr-card-features">
                {p.features.map((f, j) => (
                  <li key={j}>
                    <span className="pr-card-check">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a className="pr-card-cta" href={p.href}>
                {p.cta}
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </article>
          ))}
        </div>

        <p className="pr-footnote">
          Multi-location health system or MSO? <a href="mailto:info@medilink.vip">Talk to our team →</a>
        </p>
      </div>
    </section>
  );
}
