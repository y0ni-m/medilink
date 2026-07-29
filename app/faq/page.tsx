import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { FAQ_SECTIONS } from '@/lib/faq';

export const metadata: Metadata = {
  title: 'MediLink — FAQ',
  description:
    'Answers about MediLink for law firms, medical practices, and patients — pricing, scheduling, security, HIPAA, and trials.',
};

export default function FaqPage() {
  return (
    <div className="page">
      <Nav />
      <main className="faq">
        <section className="faq-hero">
          <div className="faq-inner">
            <span className="faq-eyebrow">
              <span className="faq-eyebrow-dot" />
              FAQ
            </span>
            <h1 className="faq-title">
              Questions, <em>answered</em>.
            </h1>
            <p className="faq-sub">
              How MediLink works for law firms, medical practices, and patients. Still curious?{' '}
              <Link href="/demo">Request a demo</Link> or call{' '}
              <a href="tel:+18334071005">+1 (833) 407-1005</a>.
            </p>
          </div>
        </section>

        <section className="faq-body">
          <div className="faq-inner">
            {FAQ_SECTIONS.map((section) => (
              <div className="faq-section" key={section.id} id={section.id}>
                <h2 className="faq-section-title">
                  <span className="faq-section-rule" />
                  {section.title}
                </h2>
                <div className="faq-list">
                  {section.items.map((item) => (
                    <details className="faq-item" key={item.q}>
                      <summary>
                        {item.q}
                        <span className="faq-icon" aria-hidden="true" />
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="faq-cta">
              <h3>Still have questions?</h3>
              <p>Book a 30-minute demo and we’ll walk your team through it live.</p>
              <div className="faq-cta-actions">
                <Link className="faq-cta-btn" href="/demo">
                  Request a demo
                  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <a className="faq-cta-call" href="tel:+18334071005">Call +1 (833) 407-1005</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
