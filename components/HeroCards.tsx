// Welli-inspired hero visual: floating "network" cards — a live referral match
// and a verified-provider card, with avatars and status pills. Server component,
// CSS-only motion (see hero-cards.css).

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="hcard-avatar">
      <img src={src} alt={alt} loading="lazy" />
    </span>
  );
}

export default function HeroCards() {
  return (
    <div className="hcards" aria-hidden="true">
      {/* floating status pill */}
      <span className="hcard-float hcard-float-a">
        <span className="hcard-dot hcard-dot-green" />
        Appointment confirmed
      </span>

      {/* referral match card */}
      <article className="hcard hcard-referral">
        <div className="hcard-head">
          <span className="hcard-eyebrow">
            <span className="hcard-dot" />
            New referral
          </span>
          <span className="hcard-pill hcard-pill-teal">Matched</span>
        </div>
        <div className="hcard-row">
          <Avatar src="/photos/marcus.jpg" alt="" />
          <div className="hcard-info">
            <b>Reyes Law Firm</b>
            <span>Auto · MVA</span>
          </div>
        </div>
        <div className="hcard-connector">
          <span className="hcard-line" />
          <svg viewBox="0 0 14 14" fill="none"><path d="M7 3v8M4 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="hcard-row">
          <Avatar src="/photos/sharma.jpg" alt="" />
          <div className="hcard-info">
            <b>Greenway Spine Center</b>
            <span>Verified · 2.4 mi away</span>
          </div>
        </div>
      </article>

      {/* provider card */}
      <article className="hcard hcard-provider">
        <div className="hcard-row">
          <Avatar src="/photos/doctor.jpg" alt="" />
          <div className="hcard-info hcard-grow">
            <b>Dr. A. Sharma</b>
            <span>Neurology · TBI</span>
          </div>
          <span className="hcard-pill hcard-pill-check">
            <svg viewBox="0 0 12 12" fill="none"><path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Verified
          </span>
        </div>
        <div className="hcard-foot">
          <span className="hcard-avail">
            <span className="hcard-dot hcard-dot-green" />
            Next opening — Today, 2:30 PM
          </span>
        </div>
      </article>
    </div>
  );
}
