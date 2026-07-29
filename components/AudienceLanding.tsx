import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import type { Audience } from '@/lib/audiences';
import { CATEGORIES, postsByCategory } from '@/lib/resources';
import ReferralTicket from '@/components/ReferralTicket';
import BrainExplorer from '@/components/BrainExplorer';
import SpineExplorer from '@/components/SpineExplorer';
import Polaroid from '@/components/Polaroid';

const GLYPHS: Record<Audience['design']['glyph'], ReactNode> = {
  legal: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M16 4v24M8 28h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 7l-9 3 9 3 9-3-9-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 13l-2.5 6a4 4 0 008 0L8 13M24 13l-2.5 6a4 4 0 008 0L27 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  imaging: (
    <svg viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 17c3 0 4-5 7-5s3 7 6 7 3-6 6-6 2 2 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  neuro: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M16 6c-4 0-6 2.5-6 5 0 1-1.5 1.5-1.5 3.5S10 19 10 21s2 5 6 5 6-3 6-5 1.5-4.5 1.5-6.5S20 13 20 11c0-2.5-2-5-4-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 6v20M12 12h3M17 16h3M13 20h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  rehab: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M13 5c0 2 6 2 6 0M12.5 9c0 2.5 7 2.5 7 0M12 14c0 3 8 3 8 0M12.5 19c0 2.5 7 2.5 7 0M13 24c0 2 6 2 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

function SectionIndex({ n, label, accent }: { n: string; label: string; accent?: boolean }) {
  return (
    <div className={`sol-index ${accent ? 'is-accent' : ''}`}>
      <span className="sol-index-n">{n}</span>
      <span className="sol-index-rule" />
      <span className="sol-index-label">{label}</span>
    </div>
  );
}

export default function AudienceLanding({ audience }: { audience: Audience }) {
  const related = CATEGORIES.filter((c) => audience.resourceCategories.includes(c.slug));
  const { design } = audience;
  const rootStyle = { '--accent': design.accent } as CSSProperties;

  return (
    <main className="sol" style={rootStyle}>
      {/* ---------- Hero ---------- */}
      <section className="sol-hero">
        <span className="sol-ghost" aria-hidden="true">{design.ghost}</span>
        <div className="sol-hero-inner">
          <div className="sol-hero-left">
            <div className="sol-dossier">
              <span className="sol-dossier-index">{design.index}</span>
              <span className="sol-dossier-glyph">{GLYPHS[design.glyph]}</span>
              <span className="sol-dossier-ref">{design.fileRef}</span>
              <span className="sol-dossier-live">
                <span className="sol-dossier-live-dot" />
                Live network
              </span>
            </div>

            <h1 className="sol-hero-title">
              {audience.hero.titleLead}{' '}
              <em>{audience.hero.titleEm}</em>
            </h1>
            <p className="sol-hero-sub">{audience.hero.sub}</p>

            <div className="sol-hero-cta">
              <a className="sol-btn sol-btn-primary" href={audience.hero.primaryCta.href}>
                {audience.hero.primaryCta.label}
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="sol-btn sol-btn-ghost" href={audience.hero.secondaryCta.href}>
                {audience.hero.secondaryCta.label}
              </a>
            </div>

            <div className="sol-stats">
              {audience.stats.map((s) => (
                <div className="sol-stat" key={s.label}>
                  <span className="sol-stat-value">{s.value}</span>
                  <span className="sol-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sol-hero-right">
            <ReferralTicket ticket={audience.ticket} accent={design.accent} fileRef={design.fileRef} />
          </div>
        </div>
      </section>

      {/* ---------- Interactive 3D anatomy (audience-specific) ---------- */}
      {design.glyph === 'neuro' && <BrainExplorer />}
      {design.glyph === 'rehab' && <SpineExplorer />}

      {/* ---------- Problem ---------- */}
      <section className="sol-problem">
        <div className="sol-section-inner">
          <SectionIndex n="02" label={audience.problem.eyebrow} />
          <h2 className="sol-section-title">{audience.problem.title}</h2>
          <div className="sol-problem-grid">
            {audience.problem.points.map((p, i) => (
              <div className="sol-problem-card" key={p.title}>
                <span className="sol-problem-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="sol-problem-strike" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="sol-benefits">
        <Polaroid
          className="sol-photo"
          src={audience.photo.src}
          alt={audience.photo.alt}
          caption={audience.photo.caption}
          rotate={audience.photo.rotate}
          aspect={audience.photo.aspect}
          tape="top-right"
          width={audience.photo.aspect ? 300 : 252}
        />
        <div className="sol-section-inner">
          <SectionIndex n="03" label={audience.benefits.eyebrow} accent />
          <h2 className="sol-section-title">{audience.benefits.title}</h2>
          <ol className="sol-benefits-list">
            {audience.benefits.items.map((b, i) => (
              <li className="sol-benefit" key={b.title}>
                <span className="sol-benefit-idx">{String(i + 1).padStart(2, '0')}</span>
                <div className="sol-benefit-body">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
                <span className="sol-benefit-check" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="sol-steps">
        <div className="sol-section-inner">
          <SectionIndex n="04" label="Workflow" />
          <h2 className="sol-section-title">From first contact to settlement.</h2>
          <ol className="sol-steps-grid">
            <span className="sol-steps-line" aria-hidden="true" />
            {audience.steps.map((s) => (
              <li className="sol-step" key={s.n}>
                <span className="sol-step-node" aria-hidden="true" />
                <span className="sol-step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sol-faq">
        <div className="sol-section-inner">
          <SectionIndex n="05" label="FAQ" />
          <h2 className="sol-section-title">Common questions.</h2>
          <div className="sol-faq-list">
            {audience.faqs.map((f) => (
              <details className="sol-faq-item" key={f.q}>
                <summary>
                  {f.q}
                  <span className="sol-faq-icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Related resources ---------- */}
      {related.length > 0 && (
        <section className="sol-related">
          <div className="sol-section-inner">
            <SectionIndex n="06" label="Keep reading" />
            <h2 className="sol-section-title">Resources for {audience.name}.</h2>
            <div className="sol-related-grid">
              {related.map((c) => {
                const count = postsByCategory(c.slug).length;
                return (
                  <Link className="sol-related-card" href={`/resources?category=${c.slug}`} key={c.slug}>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    <span className="sol-related-meta">
                      {count} {count === 1 ? 'article' : 'articles'}
                      <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
