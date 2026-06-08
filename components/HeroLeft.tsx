export default function HeroLeft() {
  return (
    <div className="hero-left">
      <h1 className="headline">
        Personal injury referrals,
        <br />
        <em style={{ color: 'rgb(13, 167, 202)' }}>in one shared workspace.</em>
      </h1>
      <p className="subhead">
        MediLink gives personal injury clinics and attorneys a single place to send referrals, manage Patient financial responsibility, and follow every case from intake to settlement.
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
        <div className="trust-badge">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="6" width="12" height="8" rx="1.5" stroke="#6B6B7B" strokeWidth="1.4" />
            <path d="M5 6V4a3 3 0 116 0v2" stroke="#6B6B7B" strokeWidth="1.4" />
          </svg>
          SOC 2 Type II
        </div>
      </div>
    </div>
  );
}
