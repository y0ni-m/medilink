/* global React */
const { useState, useEffect, useRef } = React;

// ============ NAV ============
function Nav({ onPrimaryClick }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src="assets/medilink_color_vertical.svg" alt="MediLink" className="nav-logo-img" />
      </div>
      <div className="nav-links">
        <a href="#">For Clinics</a>
        <a href="#">For Firms</a>
        <a href="#">Network <i className="chev"></i></a>
        <a href="#">Resources <i className="chev"></i></a>
        <a href="#">Pricing</a>
      </div>
      <div className="nav-cta">
        <button className="btn btn-ghost-pill">Sign in</button>
        <button className="btn btn-primary" onClick={onPrimaryClick} style={{ backgroundColor: "rgb(13, 167, 202)" }}>Request demo</button>
      </div>
    </nav>);

}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#0B0B14" />
      <circle cx="9" cy="14" r="3" fill="#ECEAF3" />
      <circle cx="19" cy="14" r="3" fill="#ECEAF3" />
      <rect x="11" y="13.25" width="6" height="1.5" fill="#ECEAF3" />
    </svg>);

}

// ============ HERO LEFT ============
function HeroLeft({ tweaks }) {
  const headlines = {
    "match": <>Personal injury referrals,<br /><em style={{ color: "rgb(13, 167, 202)" }}>matched in minutes.</em></>,
    "network": <><em>The network</em> for<br />injury care referrals.</>,
    "growth": <>Grow your clinic<br />on <em>case-by-case</em> trust.</>
  };
  const subheads = {
    "match": "MediLink connects personal injury clinics with vetted attorneys actively placing referrals — so your treatment rooms stay full and cases move forward.",
    "network": "Join 1,800+ clinics receiving qualified personal injury referrals from a vetted network of attorneys. No cold calls. No paid leads. Just cases.",
    "growth": "The marketplace where personal injury attorneys find treating providers — and clinics get steady, qualified referrals from firms that already trust the platform."
  };

  return (
    <div className="hero-left">
      <div className="eyebrow">
        <span className="eyebrow-tag">New</span>
        <span className="eyebrow-dot"></span>
        <span>Now live in 38 states </span>
      </div>
      <h1 className="headline">{headlines[tweaks.headline] || headlines.match}</h1>
      <p className="subhead">{subheads[tweaks.headline] || subheads.match}</p>
      <div className="cta-row">
        <button className="btn btn-cta">
          {tweaks.ctaText || "Join the clinic network"}
          <span className="arrow">→</span>
        </button>
        <button className="btn btn-secondary-cta">
          For attorneys →
        </button>
      </div>
      <div className="trust">
        <div className="trust-stat">
          <span className="trust-stat-num">1,800+</span>
          <span className="trust-stat-label">Clinics on network</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-stat">
          <span className="trust-stat-num">$240M</span>
          <span className="trust-stat-label">Cases referred '25</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-badge">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 1L2 3.5v4.2C2 11.4 4.6 14.4 8 15c3.4-.6 6-3.6 6-7.3V3.5L8 1z"
            stroke="#6B6B7B" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M5.5 8l2 2 3.5-4" stroke="#0BB5A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          HIPAA compliant
        </div>
        <div className="trust-badge">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="6" width="12" height="8" rx="1.5" stroke="#6B6B7B" strokeWidth="1.4" />
            <path d="M5 6V4a3 3 0 116 0v2" stroke="#6B6B7B" strokeWidth="1.4" />
          </svg>
          SOC 2 Type II
        </div>
      </div>
    </div>);

}

Object.assign(window, { Nav, HeroLeft, LogoMark });