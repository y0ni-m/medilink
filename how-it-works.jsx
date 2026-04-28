/* global React */
const { useState: useStateHW, useEffect: useEffectHW, useRef: useRefHW } = React;

function HowItWorks() {
  const sectionRef = useRefHW(null);
  const [activeStep, setActiveStep] = useStateHW(0);
  const [inView, setInView] = useStateHW(false);

  // Auto-cycle the active step
  useEffectHW(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [inView]);

  // Fade-in on scroll into view
  useEffectHW(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.2 });
    obs.observe(el);
    // Fallback: ensure visibility even if IO never fires (prerender, etc.)
    const fallback = setTimeout(() => setInView(true), 1500);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  const steps = [
    {
      n: '01',
      label: 'Connect',
      title: 'Set up your clinic profile',
      desc: 'Add your specialties, accepted case types, and coverage area. Verified in 24 hours.',
      meta: 'Avg setup: 8 min',
    },
    {
      n: '02',
      label: 'Match',
      title: 'Receive vetted referrals',
      desc: 'Our network routes injury cases to your clinic based on geography, specialty, and capacity.',
      meta: 'Avg match: 4 min',
    },
    {
      n: '03',
      label: 'Treat',
      title: 'Track every case to settlement',
      desc: 'See attorney status, send LOPs, log treatment notes — all in one shared timeline.',
      meta: 'Avg case: 8 mo',
    },
  ];

  return (
    <section className={`hiw ${inView ? 'is-in' : ''}`} ref={sectionRef}>
      <div className="hiw-inner">
        <header className="hiw-header">
          <span className="hiw-eyebrow">
            <span className="hiw-eyebrow-dot"></span>
            How it works
          </span>
          <h2 className="hiw-title">
            From <em>intake</em> to <em>settlement</em>,
            <br /> in three connected steps.
          </h2>
        </header>

        <div className="hiw-steps">
          {/* Connector rail */}
          <div className="hiw-rail">
            <div
              className="hiw-rail-fill"
              style={{ width: `${((activeStep + 0.5) / 3) * 100}%` }}
            ></div>
            <div
              className="hiw-rail-pulse"
              style={{ left: `${((activeStep + 0.5) / 3) * 100}%` }}
            ></div>
          </div>

          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`hiw-step ${activeStep === i ? 'is-active' : ''} ${activeStep > i ? 'is-past' : ''}`}
              onMouseEnter={() => setActiveStep(i)}
            >
              <div className="hiw-step-marker">
                <span className="hiw-step-num">{s.n}</span>
                <span className="hiw-step-ring"></span>
                <span className="hiw-step-dot"></span>
              </div>
              <div className="hiw-step-body">
                <div className="hiw-step-label">{s.label}</div>
                <h3 className="hiw-step-title">{s.title}</h3>
                <p className="hiw-step-desc">{s.desc}</p>
                <div className="hiw-step-meta">
                  <svg viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3.5V6l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {s.meta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-footer">
          <span className="hiw-footer-stat">
            <b>1,847</b> active clinics
          </span>
          <span className="hiw-footer-divider"></span>
          <span className="hiw-footer-stat">
            <b>512</b> partner firms
          </span>
          <span className="hiw-footer-divider"></span>
          <span className="hiw-footer-stat">
            <b>3.2M+</b> referrals routed
          </span>
        </div>
      </div>
    </section>
  );
}

window.HowItWorks = HowItWorks;
