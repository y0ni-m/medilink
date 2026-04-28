/* global React */
const { useState: useStateF, useEffect: useEffectF, useRef: useRefF, useMemo: useMemoF } = React;

// ============ FLOWMAP STAGE ============
// Top: Clinics + Lawyers (sources)
// Hub: MediLink router (animated)
// Bottom: 3 active case nodes (Intake → Referred → Treating)
function FlowStage({ tweaks }) {
  // Geometry — using a 600x640 viewBox so connectors can be SVG paths
  // Coords below are in viewBox units.
  const W = 600;
  const H = 640;

  // Source nodes (top)
  const sources = [
    { id: 's1', x: 130, y: 90,  label: 'Clinics',  sub: '1,847 active', icon: 'clinic' },
    { id: 's2', x: 470, y: 90,  label: 'Lawyers',  sub: '512 firms',    icon: 'gavel'  },
  ];

  // Hub (middle)
  const hub = { x: 300, y: 300 };

  // Output nodes (bottom)
  const outputs = [
    { id: 'o1', x: 130, y: 510, label: 'Intake',    sub: 'New case received',  status: 'new'    },
    { id: 'o2', x: 300, y: 510, label: 'Referred',  sub: 'Matched to clinic',  status: 'match' },
    { id: 'o3', x: 470, y: 510, label: 'Treating',  sub: 'Patient in care',    status: 'active' },
  ];

  // SVG paths — orthogonal "circuit-board" connectors with rounded corners,
  // similar to the reference image (down → across → down to hub; hub → down → across → down to outputs)
  const buildSourcePath = (s) => {
    // From bottom-center of source down to hub-top, with a kink halfway
    const startX = s.x;
    const startY = s.y + 40;
    const midY = (startY + hub.y) / 2 - 30;
    const endX = hub.x;
    const endY = hub.y - 40;
    return `M ${startX} ${startY}
            L ${startX} ${midY}
            Q ${startX} ${midY + 20} ${startX + Math.sign(endX - startX) * 20} ${midY + 20}
            L ${endX - Math.sign(endX - startX) * 20} ${midY + 20}
            Q ${endX} ${midY + 20} ${endX} ${midY + 40}
            L ${endX} ${endY}`;
  };

  const buildOutputPath = (o) => {
    // From hub-bottom out to top-center of output, with a kink halfway
    const startX = hub.x;
    const startY = hub.y + 40;
    const endX = o.x;
    const endY = o.y - 40;
    const midY = (startY + endY) / 2;
    if (Math.abs(endX - startX) < 2) {
      // Straight down for the center output
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }
    return `M ${startX} ${startY}
            L ${startX} ${midY - 20}
            Q ${startX} ${midY} ${startX + Math.sign(endX - startX) * 20} ${midY}
            L ${endX - Math.sign(endX - startX) * 20} ${midY}
            Q ${endX} ${midY} ${endX} ${midY + 20}
            L ${endX} ${endY}`;
  };

  const sourcePaths = useMemoF(() => sources.map(s => ({ id: s.id, d: buildSourcePath(s) })), []);
  const outputPaths = useMemoF(() => outputs.map(o => ({ id: o.id, d: buildOutputPath(o) })), []);

  // Animation state
  const [tick, setTick] = useStateF(0);
  const [activeOutput, setActiveOutput] = useStateF(null);
  const [activeSource, setActiveSource] = useStateF(null);
  const [hubPing, setHubPing] = useStateF(false);
  const [matchToast, setMatchToast] = useStateF(null);

  useEffectF(() => {
    let counter = 0;
    let beatCount = 0;

    const beatInterval = setInterval(() => {
      beatCount++;
      counter++;

      // Alternate which source fires (or both)
      const src = sources[beatCount % sources.length];
      setActiveSource(src.id);

      // After source fires, hub pulses
      setTimeout(() => {
        setHubPing(true);
        setActiveSource(null);
      }, 700);

      // After hub pulses, an output activates
      const out = outputs[beatCount % outputs.length];
      setTimeout(() => {
        setActiveOutput(out.id);
        setHubPing(false);
        setMatchToast({ id: counter, label: out.label, sub: out.sub });
      }, 1300);

      setTimeout(() => setActiveOutput(null), 2200);
      setTimeout(() => setMatchToast(null), 2400);

      setTick(t => t + 1);
    }, 2000);

    return () => clearInterval(beatInterval);
  }, []);

  // Mouse-tilt (re-using the heart-canvas mechanic for parallax feel)
  const stageRef = useRefF(null);
  const [tilt, setTilt] = useStateF({ x: 0, y: 0 });
  useEffectF(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setTilt({ x: dx * 6, y: dy * 6 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Scroll parallax
  const [scrollY, setScrollY] = useStateF(0);
  useEffectF(() => {
    const onScroll = () => setScrollY(window.scrollY * 0.08);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="stage stage-flow" ref={stageRef}>
      <div
        className="flow-canvas"
        style={{
          transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) translateY(${-scrollY}px)`,
        }}
      >
        <svg className="flow-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="flow-pulse" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(13,167,202,0)" />
              <stop offset="50%" stopColor="rgba(13,167,202,1)" />
              <stop offset="100%" stopColor="rgba(13,167,202,0)" />
            </linearGradient>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(13,167,202,0.5)" />
              <stop offset="60%" stopColor="rgba(13,167,202,0.15)" />
              <stop offset="100%" stopColor="rgba(13,167,202,0)" />
            </radialGradient>
            <filter id="flow-blur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Base connector tracks */}
          {sourcePaths.map(p => (
            <path
              key={`base-${p.id}`}
              d={p.d}
              fill="none"
              stroke="rgba(13,167,202,0.18)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
          {outputPaths.map(p => (
            <path
              key={`base-${p.id}`}
              d={p.d}
              fill="none"
              stroke="rgba(13,167,202,0.18)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}

          {/* Active source highlight strokes */}
          {sourcePaths.map(p => (
            <path
              key={`hi-${p.id}`}
              d={p.d}
              fill="none"
              stroke="rgba(13,167,202,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                opacity: activeSource === p.id ? 1 : 0,
                transition: 'opacity 0.3s ease',
                filter: 'drop-shadow(0 0 6px rgba(13,167,202,0.5))',
              }}
            />
          ))}
          {outputPaths.map(p => (
            <path
              key={`hi-${p.id}`}
              d={p.d}
              fill="none"
              stroke="rgba(13,167,202,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                opacity: activeOutput === p.id ? 1 : 0,
                transition: 'opacity 0.3s ease',
                filter: 'drop-shadow(0 0 6px rgba(13,167,202,0.5))',
              }}
            />
          ))}

          {/* Pulse dots traveling along the active paths */}
          {sourcePaths.map(p => (
            <circle key={`pulse-s-${p.id}`} r="4" fill="#fff"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(13,167,202,1))',
                opacity: activeSource === p.id ? 1 : 0,
              }}>
              <animateMotion
                key={`anim-${p.id}-${tick}`}
                dur="0.7s"
                fill="freeze"
                begin="0s"
                path={p.d}
                rotate="auto"
              />
            </circle>
          ))}
          {outputPaths.map(p => (
            <circle key={`pulse-o-${p.id}`} r="4" fill="#fff"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(13,167,202,1))',
                opacity: activeOutput === p.id ? 1 : 0,
              }}>
              <animateMotion
                key={`animo-${p.id}-${tick}`}
                dur="0.9s"
                fill="freeze"
                begin="0s"
                path={p.d}
                rotate="auto"
              />
            </circle>
          ))}

          {/* Hub glow ring */}
          <circle cx={hub.x} cy={hub.y} r="80" fill="url(#hub-glow)" opacity={hubPing ? 1 : 0.55}
            style={{ transition: 'opacity 0.3s' }} />
        </svg>

        {/* Source nodes (HTML over SVG so we can use real text/icons) */}
        {sources.map(s => (
          <div
            key={s.id}
            className={`flow-node flow-source ${activeSource === s.id ? 'is-active' : ''}`}
            style={{
              left: `${(s.x / W) * 100}%`,
              top: `${(s.y / H) * 100}%`,
            }}
          >
            <div className="flow-node-icon">
              {s.icon === 'clinic' ? (
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none">
                  {/* Briefcase glyph */}
                  <rect x="3" y="6.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M7.5 6.5V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0112.5 5v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M3 10.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="flow-node-body">
              <div className="flow-node-label">{s.label}</div>
              <div className="flow-node-sub">{s.sub}</div>
            </div>
          </div>
        ))}

        {/* Hub (center) */}
        <div
          className={`flow-hub ${hubPing ? 'is-pinging' : ''}`}
          style={{ left: `${(hub.x / W) * 100}%`, top: `${(hub.y / H) * 100}%` }}
        >
          <div className="flow-hub-rings">
            <span className="flow-hub-ring r1"></span>
            <span className="flow-hub-ring r2"></span>
            <span className="flow-hub-ring r3"></span>
          </div>
          <div className="flow-hub-core">
            <svg viewBox="0 0 24 24" fill="none">
              {/* Heart icon */}
              <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" fill="rgba(229,68,109,1)" stroke="rgba(229,68,109,1)" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flow-hub-label">MediLink</div>
        </div>

        {/* Output nodes */}
        {outputs.map((o, i) => (
          <div
            key={o.id}
            className={`flow-node flow-output ${activeOutput === o.id ? 'is-active' : ''}`}
            style={{
              left: `${(o.x / W) * 100}%`,
              top: `${(o.y / H) * 100}%`,
            }}
          >
            <div className="flow-node-check">
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M3 6.5l2 2 4-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flow-node-body">
              <div className="flow-node-label">{o.label}</div>
              <div className="flow-node-sub">{o.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating match toast — sibling of footer so it can sit below it */}
      {matchToast && (
        <div key={matchToast.id} className="flow-toast" style={{ animation: 'slideIn 0.4s ease forwards' }}>
          <div className="flow-toast-dot"></div>
          <div>
            <div className="flow-toast-title">Case routed</div>
            <div className="flow-toast-sub">{matchToast.label} · {matchToast.sub}</div>
          </div>
        </div>
      )}

      {/* Footer line, mirrors hero v1 */}
      <div className="flow-footer">
        <span className="heart-footer-item">
          <span className="heart-footer-dot"></span>
          Live network · 1,847 active clinics
        </span>
        <svg className="flow-footer-pulse" viewBox="0 0 600 40" preserveAspectRatio="none">
          <path d="M0,20 L120,20 L130,8 L138,32 L146,4 L154,32 L162,20 L260,20 L270,8 L278,32 L286,4 L294,32 L302,20 L400,20 L410,8 L418,32 L426,4 L434,32 L442,20 L600,20"
            fill="none" stroke="rgba(229,68,109,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="heart-footer-stat"><b>3.2M+</b> referrals routed</span>
      </div>

      {/* Floating elements (re-use existing components) */}
      {tweaks?.showFloats !== false && (
        <>
          {React.createElement(window.FloatCaseCard)}
          {React.createElement(window.FloatClinicBadge)}
          {React.createElement(window.FloatStatPill)}
        </>
      )}
    </div>
  );
}

window.FlowStage = FlowStage;

// ============ FLOATING ELEMENTS (re-declared so flow.jsx is self-contained) ============
if (typeof window.FloatCaseCard !== 'function') {
  window.FloatCaseCard = function FloatCaseCard() {
    return (
      <div className="float f1">
        <div className="case-card">
          <div className="case-card-head">
            <span className="case-card-id">CASE #4821</span>
            <span className="case-card-tag urgent">Urgent</span>
          </div>
          <div className="case-card-title">Rear-end MVA · Whiplash</div>
          <div className="case-card-meta">
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M6 11s4-3.5 4-6.5A4 4 0 002 4.5C2 7.5 6 11 6 11z" stroke="#6B6B7B" strokeWidth="1.2"/>
            </svg>
            Austin, TX · 2.1mi
          </div>
        </div>
      </div>
    );
  };
}
if (typeof window.FloatClinicBadge !== 'function') {
  window.FloatClinicBadge = function FloatClinicBadge() {
    return (
      <div className="float f2">
        <div className="clinic-badge">
          <div className="clinic-icon">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="clinic-name">Greenway Spine Center</div>
            <div className="clinic-meta">
              <span className="star">★</span> 4.9 · 312 referrals
            </div>
          </div>
        </div>
      </div>
    );
  };
}
if (typeof window.FloatStatPill !== 'function') {
  window.FloatStatPill = function FloatStatPill() {
    return (
      <div className="float f5">
        <div className="stat-pill">
          <div className="stat-pill-num">7</div>
          <div className="stat-pill-label">
            referrals
            <small>this week</small>
          </div>
        </div>
      </div>
    );
  };
}
