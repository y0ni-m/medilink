/* global React */
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// ============ ANIMATED PHONE ============
function PhoneStage({ tweaks }) {
  return (
    <div className="stage">
      <div className="stage-glow"></div>

      {/* Floating elements */}
      <FloatCaseCard />
      <FloatClinicBadge />
      <FloatMatchNotif />
      <FloatStatPill />
      <FloatCaseCard2 />

      {/* Phone */}
      <div className="phone-wrap">
        <div className="phone">
          <div className="phone-screen">
            <div className="phone-notch"></div>
            <PhoneApp tweaks={tweaks} />
          </div>
        </div>
      </div>
    </div>);

}

function PhoneApp({ tweaks }) {
  return (
    <div className="app">
      <div className="app-header">
        <div className="app-greet">
          <span className="app-greet-hi">Good afternoon</span>
          <span className="app-greet-name">Westside PT &amp; Spine</span>
        </div>
        <div className="app-avatar">WP</div>
      </div>

      <MapCard />
      <FeedCard />
    </div>);

}

// ============ MAP CARD ============
function MapCard() {
  // pin positions in % within the map canvas
  const pins = [
  { id: 1, top: 28, left: 28, color: "" },
  { id: 2, top: 62, left: 70, color: "teal" },
  { id: 3, top: 38, left: 78, color: "amber" },
  { id: 4, top: 70, left: 22, color: "" }];

  const me = { top: 50, left: 50 };

  return (
    <div className="map-card">
      <div className="map-card-head">
        <div className="map-card-title">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 14s5-4.5 5-8.5A5 5 0 003 5.5C3 9.5 8 14 8 14z" stroke="#0B0B14" strokeWidth="1.5" />
            <circle cx="8" cy="5.5" r="1.8" fill="#0B0B14" />
          </svg>
          Medical Providers near you
        </div>
        <span className="map-card-live">Live</span>
      </div>
      <div className="map-canvas">
        {/* Faux roads */}
        <svg className="roads" viewBox="0 0 200 170" preserveAspectRatio="none">
          <path d="M0,80 Q60,60 100,90 T200,70" stroke="#fff" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M40,0 Q50,80 80,120 T120,170" stroke="#fff" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M0,30 L200,50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M150,0 L130,170" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />
        </svg>

        {/* Connection lines from me to pins */}
        <svg className="map-line" viewBox="0 0 200 170" preserveAspectRatio="none">
          <path d={`M ${me.left * 2} ${me.top * 1.7} L ${pins[0].left * 2} ${pins[0].top * 1.7}`} />
          <path className="teal" d={`M ${me.left * 2} ${me.top * 1.7} L ${pins[1].left * 2} ${pins[1].top * 1.7}`} />
          <path className="amber" d={`M ${me.left * 2} ${me.top * 1.7} L ${pins[2].left * 2} ${pins[2].top * 1.7}`} />
          <path d={`M ${me.left * 2} ${me.top * 1.7} L ${pins[3].left * 2} ${pins[3].top * 1.7}`} />
        </svg>

        {/* Pins */}
        {pins.map((p, i) =>
        <span
          key={p.id}
          className={`map-pin ${p.color} delay-${i}`}
          style={{ top: `${p.top}%`, left: `${p.left}%` }}>
        </span>
        )}

        {/* Me marker */}
        <span className="map-me" style={{ top: `${me.top}%`, left: `${me.left}%` }}></span>
      </div>
    </div>);

}

// ============ FEED CARD (animated) ============
function FeedCard() {
  const allItems = [
  { id: "a", initials: "MR", bg: "bg1", name: "Maria R.", meta: "Whiplash · MVA", status: "new", label: "New" },
  { id: "b", initials: "JT", bg: "bg2", name: "James T.", meta: "Back injury · Slip", status: "matched", label: "Matched" },
  { id: "c", initials: "SK", bg: "bg3", name: "Sarah K.", meta: "Soft tissue · MVA", status: "treating", label: "Treating" },
  { id: "d", initials: "DL", bg: "bg1", name: "Derek L.", meta: "Concussion · MVA", status: "new", label: "New" },
  { id: "e", initials: "AN", bg: "bg2", name: "Aisha N.", meta: "Lumbar · Workplace", status: "matched", label: "Matched" }];


  const [visibleIdx, setVisibleIdx] = useStateP([0, 1, 2]);
  const [highlightId, setHighlightId] = useStateP(null);

  useEffectP(() => {
    let i = 3;
    const interval = setInterval(() => {
      const newIdx = i % allItems.length;
      setVisibleIdx((prev) => {
        const next = [newIdx, prev[0], prev[1]];
        return next;
      });
      setHighlightId(allItems[newIdx].id);
      setTimeout(() => setHighlightId(null), 1400);
      i++;
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feed">
      <div className="feed-head">
        <span className="feed-title">Incoming referrals</span>
        <span className="feed-count">12 today</span>
      </div>
      <div className="feed-list">
        {visibleIdx.map((idx, pos) => {
          const item = allItems[idx];
          const isHighlight = item.id === highlightId;
          return (
            <div
              key={`${item.id}-${pos}`}
              className={`feed-item ${isHighlight ? item.status : ''}`}
              style={{
                animation: isHighlight && pos === 0 ? "slideIn 0.5s cubic-bezier(0.4,0,0.2,1)" : "none"
              }}>
              
              <div className={`feed-avatar ${item.bg}`}>{item.initials}</div>
              <div className="feed-body">
                <div className="feed-name">{item.name}</div>
                <div className="feed-meta">
                  <span>{item.meta}</span>
                  <span className="feed-meta-dot"></span>
                  <span>{0.4 + pos * 0.3}mi</span>
                </div>
              </div>
              <span className={`feed-status ${item.status}`}>{item.label}</span>
            </div>);

        })}
      </div>
    </div>);

}

// ============ FLOATING ELEMENTS ============
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
            <path d="M6 11s4-3.5 4-6.5A4 4 0 002 4.5C2 7.5 6 11 6 11z" stroke="#6B6B7B" strokeWidth="1.2" />
          </svg>
          Austin, TX · 2.1mi
        </div>
      </div>
    </div>);

}

function FloatCaseCard2() {
  return (
    <div className="float f3">
      <div className="case-card">
        <div className="case-card-head">
          <span className="case-card-id">CASE #4827</span>
          <span className="case-card-tag matched">Matched</span>
        </div>
        <div className="case-card-title">Slip &amp; fall · Lumbar</div>
        <div className="case-card-meta">
          <svg viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#6B6B7B" strokeWidth="1.2" />
            <path d="M6 3.5V6l1.5 1.5" stroke="#6B6B7B" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Routed in 8 min
        </div>
      </div>
    </div>);

}

function FloatClinicBadge() {
  return (
    <div className="float f2">
      <div className="clinic-badge">
        <div className="clinic-icon">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="clinic-name">Greenway Spine Center</div>
          <div className="clinic-meta">
            <span className="star">★</span> 4.9 · 312 referrals
          </div>
        </div>
      </div>
    </div>);

}

function FloatMatchNotif() {
  return (
    <div className="float f4">
      <div className="match-notif">
        <div className="match-notif-icon">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M3 7.5L5.5 10L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="match-notif-title">New attorney match</div>
          <div className="match-notif-sub">Henderson Law · 0.6mi away</div>
        </div>
      </div>
    </div>);

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
    </div>);

}

Object.assign(window, { PhoneStage });