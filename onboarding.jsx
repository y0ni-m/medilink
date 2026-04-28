/* global React */
const { useState: useStateOn, useEffect: useEffectOn, useRef: useRefOn } = React;

function Onboarding() {
  const [activeStep, setActiveStep] = useStateOn(1);
  const sectionRef = useRefOn(null);
  const [inView, setInView] = useStateOn(false);

  useEffectOn(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el);
    const fb = setTimeout(() => setInView(true), 1200);
    return () => { obs.disconnect(); clearTimeout(fb); };
  }, []);

  const steps = [
    {
      n: 1, label: 'Profile', time: '5 min',
      title: 'Set up your clinic profile',
      desc: 'Tell us about your specialties, locations, and the case types you accept. We\'ll match you with the right referrals.',
      preview: 'profile',
    },
    {
      n: 2, label: 'Verify', time: '24 hours',
      title: 'Verify credentials',
      desc: 'Upload your NPI, malpractice coverage, and state license. Our compliance team reviews within one business day.',
      preview: 'verify',
    },
    {
      n: 3, label: 'Configure', time: '10 min',
      title: 'Configure intake & LOPs',
      desc: 'Customize your intake forms, LOP templates, and notification rules. Default templates work out of the box.',
      preview: 'configure',
    },
    {
      n: 4, label: 'Go live', time: 'Same day',
      title: 'Start receiving referrals',
      desc: 'Your clinic appears in attorney searches matching your criteria. Average first referral arrives within 48 hours.',
      preview: 'live',
    },
  ];

  return (
    <section className={`ob ${inView ? 'is-in' : ''}`} ref={sectionRef}>
      <div className="ob-inner">
        <header className="ob-header">
          <span className="ob-eyebrow">
            <span className="ob-eyebrow-dot"></span>
            Onboarding
          </span>
          <h1 className="ob-title">
            From signup to <em>first referral</em><br /> in under 48 hours.
          </h1>
          <p className="ob-sub">
            Four guided steps. Most clinics finish setup in a single afternoon and receive their first matched case within two days.
          </p>
        </header>

        <div className="ob-layout">
          {/* Sidebar progress rail */}
          <aside className="ob-rail">
            <div className="ob-rail-line">
              <div
                className="ob-rail-fill"
                style={{ height: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            {steps.map(s => (
              <button
                key={s.n}
                className={`ob-rail-step ${activeStep === s.n ? 'is-active' : ''} ${activeStep > s.n ? 'is-done' : ''}`}
                onClick={() => setActiveStep(s.n)}
              >
                <span className="ob-rail-marker">
                  {activeStep > s.n ? (
                    <svg viewBox="0 0 12 12" fill="none">
                      <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="ob-rail-num">{s.n}</span>
                  )}
                </span>
                <span className="ob-rail-body">
                  <span className="ob-rail-label">{s.label}</span>
                  <span className="ob-rail-time">{s.time}</span>
                </span>
              </button>
            ))}
          </aside>

          {/* Active step body */}
          <div className="ob-main">
            {steps.map(s => (
              <div
                key={s.n}
                className={`ob-step ${activeStep === s.n ? 'is-shown' : ''}`}
              >
                <div className="ob-step-meta">
                  <span className="ob-step-num">Step {String(s.n).padStart(2, '0')} / 04</span>
                  <span className="ob-step-time">
                    <svg viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M6 3.5V6l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {s.time}
                  </span>
                </div>
                <h2 className="ob-step-title">{s.title}</h2>
                <p className="ob-step-desc">{s.desc}</p>

                <div className={`ob-preview ob-preview-${s.preview}`}>
                  <ObPreview kind={s.preview} />
                </div>

                <div className="ob-step-actions">
                  <button
                    className="ob-btn-secondary"
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={s.n === 1}
                  >Back</button>
                  <button
                    className="ob-btn-primary"
                    onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  >
                    {s.n === steps.length ? 'Finish setup' : 'Continue'}
                    <svg viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Whats next sidebar */}
          <aside className="ob-aside">
            <h3 className="ob-aside-title">What happens next</h3>
            <ul className="ob-aside-list">
              <li>
                <span className="ob-aside-dot"></span>
                <div>
                  <b>Compliance review</b>
                  <span>Our team verifies credentials within 24 hours.</span>
                </div>
              </li>
              <li>
                <span className="ob-aside-dot"></span>
                <div>
                  <b>Network introduction</b>
                  <span>You're added to attorney search results matching your criteria.</span>
                </div>
              </li>
              <li>
                <span className="ob-aside-dot"></span>
                <div>
                  <b>First referral</b>
                  <span>Average first match arrives within 48 hours of going live.</span>
                </div>
              </li>
            </ul>
            <div className="ob-aside-cta">
              <span className="ob-aside-cta-label">Need help?</span>
              <a href="#">Talk to onboarding →</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ObPreview({ kind }) {
  if (kind === 'profile') return (
    <div className="obp obp-profile">
      <div className="obp-row"><label>Clinic name</label><div className="obp-input">Greenway Spine Center</div></div>
      <div className="obp-row split">
        <div><label>Specialty</label><div className="obp-input">Chiropractic</div></div>
        <div><label>State</label><div className="obp-input">TX</div></div>
      </div>
      <div className="obp-row"><label>Case types accepted</label>
        <div className="obp-tags">
          <span className="obp-tag is-on">MVA</span>
          <span className="obp-tag is-on">Slip & fall</span>
          <span className="obp-tag is-on">Workers comp</span>
          <span className="obp-tag">Premises</span>
        </div>
      </div>
    </div>
  );
  if (kind === 'verify') return (
    <div className="obp obp-verify">
      <div className="obp-doc"><span className="obp-doc-name">NPI Certification</span><span className="obp-doc-status is-done">Verified</span></div>
      <div className="obp-doc"><span className="obp-doc-name">Malpractice Insurance</span><span className="obp-doc-status is-done">Verified</span></div>
      <div className="obp-doc"><span className="obp-doc-name">State License (TX)</span><span className="obp-doc-status is-progress">Reviewing</span></div>
      <div className="obp-doc"><span className="obp-doc-name">HIPAA BAA</span><span className="obp-doc-status">Awaiting signature</span></div>
    </div>
  );
  if (kind === 'configure') return (
    <div className="obp obp-config">
      <div className="obp-toggle"><span>Auto-accept matched referrals</span><span className="obp-switch is-on"><i/></span></div>
      <div className="obp-toggle"><span>SMS notifications for new cases</span><span className="obp-switch is-on"><i/></span></div>
      <div className="obp-toggle"><span>Custom LOP template</span><span className="obp-switch"><i/></span></div>
      <div className="obp-toggle"><span>Daily digest email</span><span className="obp-switch is-on"><i/></span></div>
    </div>
  );
  return (
    <div className="obp obp-live">
      <div className="obp-live-badge">
        <span className="obp-live-pulse"></span>
        Live in network
      </div>
      <div className="obp-live-stats">
        <div><b>0</b><span>active referrals</span></div>
        <div><b>48h</b><span>est. first match</span></div>
        <div><b>312</b><span>nearby attorneys</span></div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
