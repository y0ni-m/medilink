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
              Join 1,800+ clinics and 2,400+ attorneys already routing personal injury cases through MediLink.
            </p>
          </div>
          <div className="ft-cta-actions">
            <a className="ft-cta-primary" href="https://app.medilink.vip/register">
              Request demo
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="ft-cta-secondary" href="#">Talk to sales</a>
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
              <a href="#">Security</a>
            </div>
            <div className="ft-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Customers</a>
              <a href="#">Press</a>
              <a href="#">Careers <span className="ft-pip">3</span></a>
              <a href="#">Contact</a>
            </div>
            <div className="ft-col">
              <h4>Resources</h4>
              <a href="#">Help center</a>
              <a href="#">LOP guide</a>
              <a href="#">Compliance</a>
              <a href="#">API docs</a>
              <a href="#">Status</a>
            </div>
            <div className="ft-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">BAA</a>
              <a href="#">Cookie policy</a>
            </div>
          </div>
        </div>

        <div className="ft-bar">
          <div className="ft-bar-inner">
            <span className="ft-copy">© 2026 MediLink Health, Inc. All rights reserved.</span>
            <div className="ft-social">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.5 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM2 6.5h3v8H2v-8zm4.5 0H9v1.2c.4-.7 1.3-1.4 2.7-1.4 2 0 2.8 1.2 2.8 3.4v4.8h-3v-4.3c0-1-.4-1.6-1.3-1.6-1 0-1.3.7-1.3 1.6v4.3h-3v-8z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.5 2h2.4l-5.3 6 6.2 8h-4.9l-3.8-5L1.7 16H-.6l5.6-6.4L-1 2h5l3.5 4.6L11.5 2zm-.9 12.5h1.3L4.5 3.4H3l7.6 11.1z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .5C3.6.5 0 4.1 0 8.5c0 3.5 2.3 6.5 5.5 7.5.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.7-.2-3.5-.9-3.5-3.9 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 014 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.5 3.9.3.2.5.7.5 1.4v2c0 .2.1.5.5.4 3.2-1.1 5.5-4 5.5-7.5C16 4.1 12.4.5 8 .5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
