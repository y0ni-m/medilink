import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  lastUpdated: string;
  children: ReactNode;
};

export default function LegalDoc({ eyebrow, title, intro, lastUpdated, children }: Props) {
  return (
    <section className="legal">
      <div className="legal-inner">
        <header className="legal-header">
          <span className="legal-eyebrow">
            <span className="legal-eyebrow-dot"></span>
            {eyebrow}
          </span>
          <h1 className="legal-title">{title}</h1>
          {intro && <p className="legal-intro">{intro}</p>}
          <p className="legal-updated">Last updated: {lastUpdated}</p>
        </header>
        <div className="legal-body">{children}</div>
      </div>
    </section>
  );
}
