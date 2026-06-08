'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Footer() {
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
    const fb = setTimeout(() => setInView(true), 1500);
    return () => {
      obs.disconnect();
      clearTimeout(fb);
    };
  }, []);

  return (
    <footer className={`ft ${inView ? 'is-in' : ''}`} ref={sectionRef}>
      <div className="ft-cta">
        <div className="ft-cta-inner">
          <div className="ft-cta-body">
            <span className="ft-cta-eyebrow">
              <span className="ft-cta-dot"></span>
              Live network
            </span>
            <h2 className="ft-cta-title">
              Start matching cases <em>today</em>.
            </h2>
            <p className="ft-cta-sub">
              Connect personal injury attorneys with vetted medical clinics — referrals, Patient financial responsibility, and case tracking in one place.
            </p>
          </div>
          <div className="ft-cta-actions">
            <a className="ft-cta-primary" href="https://app.medilink.vip/register">
              Sign up
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="ft-cta-secondary" href="mailto:info@medilink.vip">Talk to sales</a>
          </div>
        </div>
      </div>

      <div className="ft-main">
        <div className="ft-main-inner">
          <div className="ft-brand">
            <div className="ft-logo">
              <img src="/medilink_color_vertical.svg" alt="MediLink" className="ft-logo-img" />
            </div>
            <p className="ft-tagline">
              The trusted network connecting personal injury attorneys with vetted medical clinics.
            </p>
            <div className="ft-badges">
              <span className="ft-badge">HIPAA Compliant</span>
              <span className="ft-badge">SOC 2 Type II</span>
            </div>
          </div>

          <div className="ft-cols">
            <div className="ft-col">
              <h4>Product</h4>
              <Link href="/#audiences">For Attorneys</Link>
              <Link href="/#audiences">For Clinics</Link>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/onboarding">Onboarding</Link>
            </div>
            <div className="ft-col">
              <h4>Company</h4>
              <a href="mailto:info@medilink.vip">Contact</a>
              <a href="mailto:info@medilink.vip">Sales</a>
            </div>
            <div className="ft-col">
              <h4>Trust</h4>
              <Link href="/compliance">Compliance</Link>
              <a href="mailto:security@medilink.vip">Security</a>
            </div>
            <div className="ft-col">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>

        <div className="ft-bar">
          <div className="ft-bar-inner">
            <span className="ft-copy">© 2026 MediLink Health, Inc. All rights reserved.</span>
            <div className="ft-contact">
              <a href="mailto:info@medilink.vip">info@medilink.vip</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
