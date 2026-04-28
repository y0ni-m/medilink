/* global React */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH, useMemo: useMemoH } = React;

// ============ HEART NETWORK STAGE ============
function HeartStage({ tweaks }) {
  // Center: 50, 50. Arteries radiate out at varied angles + lengths.
  // Each artery has a clinic node at the end + a curve for organic feel.
  const arteries = [
    { id: "a1", angle: -90, len: 32, clinic: { code: "GS", name: "Greenway Spine" }, curve: 0.15 },
    { id: "a2", angle: -50, len: 36, clinic: { code: "TB", name: "Tampa Bay Ortho" }, curve: -0.12 },
    { id: "a3", angle: -10, len: 38, clinic: { code: "PS", name: "Peachtree Spine" }, curve: 0.18 },
    { id: "a4", angle: 30, len: 34, clinic: { code: "OI", name: "Orlando Injury" }, curve: -0.16 },
    { id: "a5", angle: 70, len: 36, clinic: { code: "DD", name: "Dr. Doe Center" }, curve: 0.14 },
    { id: "a6", angle: 130, len: 35, clinic: { code: "GM", name: "General Medical" }, curve: -0.18 },
    { id: "a7", angle: 170, len: 38, clinic: { code: "LS", name: "Lone Star Injury" }, curve: 0.16 },
    { id: "a8", angle: 210, len: 32, clinic: { code: "NY", name: "NY PI Medical" }, curve: -0.14 },
    { id: "a9", angle: 250, len: 34, clinic: { code: "JR", name: "J Rod Practice" }, curve: 0.18 },
  ];

  // Compute geometry for each artery
  const geometry = useMemoH(() => arteries.map(a => {
    const rad = (a.angle * Math.PI) / 180;
    const x2 = 50 + Math.cos(rad) * a.len;
    const y2 = 50 + Math.sin(rad) * a.len;
    // Control point perpendicular to the line for a curve
    const mx = (50 + x2) / 2;
    const my = (50 + y2) / 2;
    const perpX = -Math.sin(rad);
    const perpY = Math.cos(rad);
    const cx = mx + perpX * a.curve * a.len;
    const cy = my + perpY * a.curve * a.len;
    return { ...a, x2, y2, cx, cy, path: `M 50 50 Q ${cx} ${cy} ${x2} ${y2}` };
  }), []);

  const [beat, setBeat] = useStateH(0);
  const [activeArteries, setActiveArteries] = useStateH(new Set());
  const [activeClinic, setActiveClinic] = useStateH(null);
  const [pulses, setPulses] = useStateH([]); // {id, arteryId}
  const [matchToast, setMatchToast] = useStateH(null);

  useEffectH(() => {
    let counter = 0;
    let beatCount = 0;

    const beatInterval = setInterval(() => {
      beatCount++;
      setBeat(b => b + 1);

      // Each beat: fire 1-2 random pulses
      const fireCount = beatCount % 2 === 0 ? 2 : 1;
      const newActive = new Set();
      for (let k = 0; k < fireCount; k++) {
        const artery = arteries[(beatCount * 2 + k) % arteries.length];
        counter++;
        const pulseId = `p-${counter}`;
        newActive.add(artery.id);

        setPulses(prev => [...prev, { id: pulseId, arteryId: artery.id }]);

        // Light up clinic at end of pulse
        setTimeout(() => {
          setActiveClinic(artery.id);
          setMatchToast({
            id: `m-${counter}`,
            clinic: artery.clinic.name,
          });
        }, 900);

        setTimeout(() => {
          setPulses(prev => prev.filter(p => p.id !== pulseId));
        }, 1100);
      }
      setActiveArteries(newActive);

      setTimeout(() => setActiveArteries(new Set()), 1400);
      setTimeout(() => setActiveClinic(null), 1600);
      setTimeout(() => setMatchToast(null), 2200);
    }, 1400); // Heart rate ~ 43bpm — calm, premium

    return () => clearInterval(beatInterval);
  }, []);

  return (
    <div className="stage stage-heart">
      <div className="heart-glow"></div>
      <div className="heart-glow heart-glow-2"></div>

      {/* Floating peripheral cards removed — sphere stands alone */}

      <div className="heart-canvas">
        {/* Animated sphere/globe background */}
        <Sphere />

        {/* Concentric pulse rings emanating from center on each beat */}
        <div className="heart-rings" key={beat}>
          <span className="heart-ring r1"></span>
          <span className="heart-ring r2"></span>
          <span className="heart-ring r3"></span>
        </div>

        {/* Arteries (SVG paths) */}
        <svg className="heart-arteries" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="arteryGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0da7ca" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#0da7ca" stopOpacity="0.15"/>
            </linearGradient>
            <filter id="arteryGlow">
              <feGaussianBlur stdDeviation="0.6"/>
            </filter>
          </defs>

          {/* Artery base lines */}
          {geometry.map(g => (
            <path
              key={`base-${g.id}`}
              d={g.path}
              className={`heart-artery ${activeArteries.has(g.id) ? 'is-active' : ''}`}
              fill="none"
            />
          ))}

          {/* Active arteries glow overlay */}
          {geometry.map(g => activeArteries.has(g.id) && (
            <path
              key={`glow-${g.id}`}
              d={g.path}
              className="heart-artery-glow"
              fill="none"
            />
          ))}

          {/* Pulse dots traveling */}
          {pulses.map(p => {
            const g = geometry.find(x => x.id === p.arteryId);
            if (!g) return null;
            return (
              <circle
                key={p.id}
                r="1.4"
                fill="#fff"
                className="heart-pulse"
                style={{ offsetPath: `path('${g.path}')` }}
              >
                <animateMotion
                  dur="0.9s"
                  fill="freeze"
                  path={g.path}
                  rotate="auto"
                />
              </circle>
            );
          })}
        </svg>

        {/* Clinic nodes at end of each artery */}
        {geometry.map(g => (
          <div
            key={g.id}
            className={`heart-clinic ${activeClinic === g.id ? 'is-active' : ''}`}
            style={{ left: `${g.x2}%`, top: `${g.y2}%` }}
          >
            <span className="heart-clinic-ring"></span>
            <span className="heart-clinic-bubble">{g.clinic.code}</span>
            <span className="heart-clinic-label">{g.clinic.name}</span>
          </div>
        ))}

        {/* Center heart */}
        <div className="heart-core">
          <div className="heart-core-shell">
            <div className="heart-core-inner" key={`inner-${beat}`}>
              <HeartShape />
            </div>
            <div className="heart-core-pulse"></div>
          </div>
          <div className="heart-core-stats">
            <div className="heart-core-bpm">
              <span className="heart-core-bpm-num">42</span>
              <span className="heart-core-bpm-unit">referrals / min</span>
            </div>
          </div>
        </div>

        {/* Match toast */}
        {matchToast && (
          <div key={matchToast.id} className="heart-toast">
            <span className="heart-toast-pulse"></span>
            <div>
              <div className="heart-toast-title">Referral routed</div>
              <div className="heart-toast-sub">{matchToast.clinic}</div>
            </div>
          </div>
        )}

        {/* ECG line at the bottom */}
        <ECGLine beat={beat} />
      </div>

      <div className="heart-footer">
        <span className="heart-footer-item">
          <span className="heart-footer-dot"></span>
          Live network · 1,847 active clinics
        </span>
        <span className="heart-footer-stat">
          <b>3.2M+</b> referrals routed
        </span>
      </div>
    </div>
  );
}

function HeartShape() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <path
        d="M16 27.5s-10-6.5-10-14.2c0-3.5 2.8-6.3 6.3-6.3 2 0 3.7 1 4.7 2.5 1-1.5 2.7-2.5 4.7-2.5 3.5 0 6.3 2.8 6.3 6.3 0 7.7-12 14.2-12 14.2z"
        fill="url(#heartFill)"
        stroke="#fff"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="heartFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B8A"/>
          <stop offset="100%" stopColor="#E5446D"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function ECGLine({ beat }) {
  // Generate an ECG-style trace path
  return (
    <div className="heart-ecg">
      <svg viewBox="0 0 600 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ecgFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0da7ca" stopOpacity="0"/>
            <stop offset="20%" stopColor="#0da7ca" stopOpacity="0.8"/>
            <stop offset="80%" stopColor="#0da7ca" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#0da7ca" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path
          d="M0,30 L80,30 L90,30 L95,15 L100,45 L105,5 L110,55 L115,25 L120,30 L200,30 L210,30 L215,15 L220,45 L225,5 L230,55 L235,25 L240,30 L320,30 L330,30 L335,15 L340,45 L345,5 L350,55 L355,25 L360,30 L440,30 L450,30 L455,15 L460,45 L465,5 L470,55 L475,25 L480,30 L600,30"
          stroke="url(#ecgFade)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Moving dot on ECG */}
        <circle r="2" fill="#fff" className="heart-ecg-dot">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M0,30 L600,30"
          />
        </circle>
      </svg>
    </div>
  );
}

// ============ 3D WIREFRAME SPHERE BACKGROUND ============
function Sphere() {
  const wrapRef = useRefH(null);
  const [tilt, setTilt] = useStateH({ x: 0, y: 0 });
  const [scroll, setScroll] = useStateH(0);

  useEffectH(() => {
    const onMouseMove = (e) => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const ccx = r.left + r.width / 2;
      const ccy = r.top + r.height / 2;
      const dx = (e.clientX - ccx) / (window.innerWidth / 2);
      const dy = (e.clientY - ccy) / (window.innerHeight / 2);
      setTilt({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
    };
    const onScroll = () => setScroll(window.scrollY || window.pageYOffset || 0);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Tilt the entire 3D scene with mouse, parallax with scroll
  const tiltX = -tilt.y * 14; // pitch
  const tiltY = tilt.x * 14;  // yaw — additive on top of continuous spin
  const parallaxY = -scroll * 0.18;

  // 12 longitude rings (every 15°), 9 latitude rings
  const longCount = 12;
  const latCount = 9; // odd so equator is centered
  const longs = Array.from({ length: longCount }, (_, i) => (180 / longCount) * i);
  const lats = Array.from({ length: latCount }, (_, i) => -75 + (150 / (latCount - 1)) * i);

  return (
    <div
      ref={wrapRef}
      className="heart-sphere"
      style={{
        '--userTiltX': `${tiltX}deg`,
        '--userTiltY': `${tiltY}deg`,
        '--parallaxY': `${parallaxY}px`,
      }}
    >
      <div className="sphere3d-scene">
        <div className="sphere3d-spin">
          <div className="sphere3d">
            {/* Longitude rings: vertical great circles, rotated around Y */}
            {longs.map((deg, i) => (
              <div
                key={`lng-${i}`}
                className={`sphere3d-ring sphere3d-long ${i % 2 === 0 ? 'is-cyan' : 'is-gray'}`}
                style={{
                  transform: `rotateY(${deg}deg)`,
                  animationDelay: `${(i / longCount) * -8}s`,
                }}
              />
            ))}

            {/* Latitude rings: horizontal circles at varying Y heights */}
            {lats.map((latDeg, i) => {
              const rad = (latDeg * Math.PI) / 180;
              const y = Math.sin(rad);     // -1..1
              const r = Math.cos(rad);     // 0..1 (relative radius at this latitude)
              const isEquator = Math.abs(latDeg) < 0.01;
              return (
                <div
                  key={`lat-${i}`}
                  className={`sphere3d-ring sphere3d-lat ${isEquator ? 'is-equator' : (i % 2 === 0 ? 'is-cyan' : 'is-gray')}`}
                  style={{
                    width: `${r * 100}%`,
                    height: `${r * 100}%`,
                    transform: `translateY(${y * 50}%) rotateX(90deg)`,
                  }}
                />
              );
            })}

            {/* Glowing nodes at lat/long intersections — 3 of them for life */}
            {[
              { lat: 30, lng: -45 },
              { lat: -20, lng: 80 },
              { lat: 60, lng: 130 },
              { lat: -50, lng: -110 },
              { lat: 10, lng: 0 },
            ].map((p, i) => {
              const latRad = (p.lat * Math.PI) / 180;
              const lngRad = (p.lng * Math.PI) / 180;
              // Position in unit sphere
              const x = Math.cos(latRad) * Math.sin(lngRad);
              const y = Math.sin(latRad);
              const z = Math.cos(latRad) * Math.cos(lngRad);
              return (
                <div
                  key={`node-${i}`}
                  className="sphere3d-node"
                  style={{
                    transform: `translate3d(${x * 50}%, ${-y * 50}%, ${z * 50 * 4}px)`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Soft outer glow */}
      <div className="sphere3d-aura"></div>
    </div>
  );
}


function FloatCaseCard() {
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
}
function FloatClinicBadge() {
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
}
function FloatStatPill() {
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
}

Object.assign(window, { HeartStage, FloatCaseCard, FloatClinicBadge, FloatStatPill });
