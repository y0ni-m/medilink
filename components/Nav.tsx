'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AUDIENCES } from '@/lib/audiences';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Mobile drawer: close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const legal = AUDIENCES.filter((a) => a.group === 'legal');
  const medical = AUDIENCES.filter((a) => a.group === 'medical');
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <img src="/medilink_color_vertical.svg" alt="MediLink" className="nav-logo-img" />
      </Link>
      <div className="nav-links">
        <div
          className={`nav-dd ${open ? 'is-open' : ''}`}
          ref={menuRef}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            type="button"
            className="nav-dd-trigger"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={() => setOpen((v) => !v)}
          >
            Solutions
            <span className={`nav-dd-chev ${open ? 'is-open' : ''}`} aria-hidden="true" />
          </button>
          <div className="nav-dd-menu" role="menu">
            <div className="nav-dd-col">
              <span className="nav-dd-label">For legal teams</span>
              {legal.map((a) => (
                <Link key={a.slug} href={`/for/${a.slug}`} className="nav-dd-item" role="menuitem">
                  {a.nav.replace(/^For /, '')}
                </Link>
              ))}
            </div>
            <div className="nav-dd-col">
              <span className="nav-dd-label">For providers</span>
              {medical.map((a) => (
                <Link key={a.slug} href={`/for/${a.slug}`} className="nav-dd-item" role="menuitem">
                  {a.nav.replace(/^For /, '')}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/pricing">Pricing</Link>
      </div>
      <div className="nav-cta">
        <a className="btn btn-ghost-pill" href="https://app.medilink.vip/login">Sign in</a>
        <a
          className="btn btn-primary"
          href="https://app.medilink.vip/register"
          style={{ backgroundColor: 'rgb(13, 167, 202)' }}
        >
          Sign up
        </a>
      </div>

      {/* Hamburger — visible only below the tablet breakpoint */}
      <button
        type="button"
        className={`nav-burger ${mobileOpen ? 'is-open' : ''}`}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="nav-burger-box" aria-hidden="true">
          <span className="nav-burger-bar" />
          <span className="nav-burger-bar" />
          <span className="nav-burger-bar" />
        </span>
      </button>

      {/* Mobile drawer */}
      <div
        className={`nav-mobile ${mobileOpen ? 'is-open' : ''}`}
        id="mobile-menu"
        hidden={!mobileOpen}
      >
        <button
          type="button"
          className="nav-mobile-backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMobile}
        />
        <div className="nav-mobile-panel" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="nav-mobile-section">
            <span className="nav-mobile-label">For legal teams</span>
            {legal.map((a) => (
              <Link key={a.slug} href={`/for/${a.slug}`} className="nav-mobile-link" onClick={closeMobile}>
                {a.nav.replace(/^For /, '')}
              </Link>
            ))}
          </div>
          <div className="nav-mobile-section">
            <span className="nav-mobile-label">For providers</span>
            {medical.map((a) => (
              <Link key={a.slug} href={`/for/${a.slug}`} className="nav-mobile-link" onClick={closeMobile}>
                {a.nav.replace(/^For /, '')}
              </Link>
            ))}
          </div>
          <div className="nav-mobile-section">
            <span className="nav-mobile-label">Company</span>
            <Link href="/#how-it-works" className="nav-mobile-link" onClick={closeMobile}>How it works</Link>
            <Link href="/resources" className="nav-mobile-link" onClick={closeMobile}>Resources</Link>
            <Link href="/pricing" className="nav-mobile-link" onClick={closeMobile}>Pricing</Link>
          </div>
          <div className="nav-mobile-cta">
            <a
              className="btn btn-ghost-pill nav-mobile-signin"
              href="https://app.medilink.vip/login"
              onClick={closeMobile}
            >
              Sign in
            </a>
            <a
              className="btn btn-primary nav-mobile-signup"
              href="https://app.medilink.vip/register"
              style={{ backgroundColor: 'rgb(13, 167, 202)' }}
              onClick={closeMobile}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
