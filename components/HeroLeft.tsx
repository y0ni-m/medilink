import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/site';

export default function HeroLeft() {
  return (
    <div className="hero-left">
      <div className="hero-dossier">
        <span className="hero-dossier-rule" />
        <span className="hero-dossier-dot" />
        Live referral network · MEDILINK
      </div>
      <h1 className="headline">
        Personal injury referrals,
        <br />
        <em style={{ color: 'rgb(13, 167, 202)' }}>in one shared workspace.</em>
      </h1>
      <p className="subhead">
        MediLink gives personal injury clinics and attorneys a single place to send referrals, manage LOP and/or Patient financial responsibility depending on what state you are operating in, and follow every case from intake to settlement.
      </p>
      <div className="cta-row">
        <a className="btn btn-cta" href="https://app.medilink.vip/register">
          Join the clinic network
          <span className="arrow">→</span>
        </a>
        <a className="btn btn-secondary-cta" href="https://app.medilink.vip/register">
          For attorneys →
        </a>
      </div>
      <a className="hero-call" href={PHONE_HREF}>
        <span className="hero-call-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M5.2 2.3 3.4 2c-.5-.1-1 .2-1.2.7-.3 1-.4 2 .1 3.5.9 2.9 3.6 5.6 6.5 6.5 1.5.5 2.5.4 3.5.1.5-.2.8-.7.7-1.2l-.3-1.8c-.1-.4-.4-.7-.8-.8l-1.9-.4c-.4-.1-.8.1-1 .4l-.4.6C7.9 8.7 7.3 8.1 6.4 6.5l.6-.4c.3-.2.5-.6.4-1l-.4-1.9c-.1-.4-.4-.7-.8-.8Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Prefer to talk? Call <strong>{PHONE_DISPLAY}</strong>
      </a>
      <div className="trust">
        <div className="trust-badge">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L2 3.5v4.2C2 11.4 4.6 14.4 8 15c3.4-.6 6-3.6 6-7.3V3.5L8 1z"
              stroke="#6B6B7B"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 8l2 2 3.5-4"
              stroke="#0BB5A3"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          HIPAA compliant
        </div>
      </div>
    </div>
  );
}
