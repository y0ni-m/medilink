/* global React */
const { useState: useStateL, useEffect: useEffectL, useRef: useRefL } = React;

// ============ LAPTOP STAGE ============
function LaptopStage({ tweaks }) {
  const [view, setView] = useStateL("directory"); // "directory" | "scheduling"

  useEffectL(() => {
    const id = setInterval(() => {
      setView(v => (v === "directory" ? "scheduling" : "directory"));
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stage stage-laptop">
      <div className="stage-glow"></div>

      {/* Floating elements */}
      <FloatCaseCard />
      <FloatClinicBadge />
      <FloatMatchNotif />
      <FloatStatPill />

      <div className="laptop-wrap">
        <div className="laptop">
          <div className="laptop-screen">
            <AppChrome view={view} onChange={setView} />
            <div className="app-body">
              <div className={`view-layer ${view === "directory" ? "is-active" : ""}`}>
                <DirectoryView />
              </div>
              <div className={`view-layer ${view === "scheduling" ? "is-active" : ""}`}>
                <SchedulingView />
              </div>
            </div>
          </div>
          <div className="laptop-base">
            <div className="laptop-notch"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ APP CHROME (top nav) ============
function AppChrome({ view, onChange }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "contacts", label: "Contacts", icon: "◐" },
    { id: "scheduling", label: "Scheduling", icon: "▤" },
    { id: "directory", label: "Directory", icon: "◉" },
    { id: "documents", label: "Documents", icon: "▢" },
    { id: "billing", label: "Billing", icon: "◇" }
  ];
  return (
    <div className="app-chrome">
      <div className="ml-logo">
        <img src="assets/medilink_color_vertical.svg" alt="MediLink" className="ml-logo-img" />
      </div>
      <div className="chrome-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`chrome-tab ${(t.id === view || (t.id === "dashboard" && view === "dashboard")) ? "is-active" : ""}`}
            onClick={() => onChange && onChange(t.id)}
          >
            <span className="chrome-tab-ico">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <div className="chrome-right">
        <span className="chrome-bell">🔔</span>
        <span className="chrome-moon">◐</span>
        <div className="chrome-avatar">JD</div>
        <span className="chrome-name">Jane Doe</span>
      </div>
    </div>
  );
}

// ============ DIRECTORY VIEW (Map + list) ============
function DirectoryView() {
  // Pins positioned over real cities on the new map
  const pins = [
    { id: "ls", code: "LS", top: 49, left: 26 },   // Houston
    { id: "ps2", code: "PS", top: 41, left: 56 },  // Atlanta
    { id: "oi", code: "OI", top: 72, left: 65 },   // Orlando
    { id: "tb", code: "TB", top: 78, left: 64 },   // Tampa
    { id: "jr", code: "JR", top: 82, left: 70 },   // FL east coast
    { id: "gm", code: "GM", top: 86, left: 69 },   // West Palm
    { id: "dd", code: "DD", top: 90, left: 67 },   // Miami
    { id: "ny", code: "NY", top: 24, left: 78 }    // NE coast
  ];

  const list = [
    { code: "DD", name: "Dr. Doe Center", loc: "Miami, FL" },
    { code: "GM", name: "General Medical Center", loc: "West Palm Beach, FL", tag: "Connected" },
    { code: "TB", name: "Tampa Bay Spine & Orthopedics", loc: "Tampa, FL" },
    { code: "OI", name: "Orlando Injury & Rehab Center", loc: "Orlando, FL" },
    { code: "PS", name: "Peachtree Spine & Pain", loc: "Atlanta, GA" },
    { code: "LS", name: "Lone Star Injury Clinic", loc: "Houston, TX" },
    { code: "NY", name: "New York PI Medical Group", loc: "New York, NY" },
    { code: "JR", name: "J Rod Medical Practice", loc: "West Palm Beach, FL" }
  ];

  return (
    <div className="dir">
      <div className="dir-map">
        <div className="dir-map-zoom">
          <button>+</button>
          <button>−</button>
        </div>
        {/* US Southeast map — Mapbox-style */}
        <svg className="dir-map-bg" viewBox="0 0 800 440" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B8D9E8"/>
              <stop offset="50%" stopColor="#A8CFE0"/>
              <stop offset="100%" stopColor="#90C0D4"/>
            </linearGradient>
            <pattern id="waterDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="0.6" fill="#FFFFFF" opacity="0.18"/>
            </pattern>
            <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="1.2"/>
            </filter>
          </defs>

          {/* Water */}
          <rect width="800" height="440" fill="url(#water)"/>
          <rect width="800" height="440" fill="url(#waterDots)"/>

          {/* Continental US (simplified but recognizable) */}
          <g>
            {/* Mainland: west coast → north → east coast → gulf */}
            <path
              d="
                M -10,90
                L 40,85 L 90,80 L 140,72 L 200,60 L 260,50 L 320,42
                L 380,38 L 440,36 L 500,38 L 560,42 L 620,50
                L 680,62 L 730,78 L 770,98 L 800,118
                L 800,150 L 780,160 L 760,170 L 740,178 L 720,180
                L 700,176 L 680,180 L 660,190 L 645,205 L 635,225
                L 630,250 L 625,275 L 620,295 L 605,310
                L 580,318 L 545,322 L 510,318
                L 480,310 L 450,295 L 425,285 L 400,288
                L 375,300 L 350,305 L 325,300 L 300,290
                L 275,278 L 250,268 L 225,255 L 200,240
                L 175,225 L 150,210 L 125,195 L 100,178
                L 75,160 L 55,140 L 35,120 L 15,105
                L 0,98 Z
              "
              fill="#E8E2D0"
              stroke="#C9C2A9"
              strokeWidth="0.8"
            />

            {/* Florida peninsula */}
            <path
              d="
                M 510,318 L 525,330 L 540,348 L 552,370
                L 560,395 L 562,415 L 555,432
                L 545,438 L 535,434 L 528,420
                L 520,398 L 512,375 L 506,355 L 502,335
                L 504,322 Z
              "
              fill="#E8E2D0"
              stroke="#C9C2A9"
              strokeWidth="0.8"
            />

            {/* Cuba (offscreen sliver) */}
            <path
              d="M 480,425 Q 540,432 600,428 Q 660,432 720,438 L 720,440 L 480,440 Z"
              fill="#DCD5BF"
              opacity="0.85"
            />

            {/* Bahamas hint */}
            <ellipse cx="640" cy="395" rx="14" ry="6" fill="#DCD5BF" opacity="0.7"/>
            <ellipse cx="675" cy="410" rx="10" ry="4" fill="#DCD5BF" opacity="0.6"/>

            {/* State boundaries — faint */}
            <g stroke="#C2BAA0" strokeWidth="0.7" fill="none" opacity="0.65" strokeDasharray="0">
              {/* TX/LA */}
              <path d="M 220,95 L 230,250"/>
              {/* LA/MS */}
              <path d="M 305,85 L 315,295"/>
              {/* MS/AL */}
              <path d="M 360,72 L 365,310"/>
              {/* AL/GA */}
              <path d="M 415,68 L 420,318"/>
              {/* GA/FL */}
              <path d="M 415,318 L 510,322"/>
              {/* GA/SC */}
              <path d="M 470,55 L 540,160"/>
              {/* north horizontal-ish */}
              <path d="M 0,125 Q 200,105 400,108 T 800,135"/>
              <path d="M 0,170 Q 200,165 400,160 T 800,180"/>
              {/* Tennessee */}
              <path d="M 250,140 Q 380,135 480,150"/>
            </g>

            {/* Subtle terrain shading on land */}
            <g opacity="0.25">
              <ellipse cx="180" cy="150" rx="80" ry="30" fill="#D4CCB2"/>
              <ellipse cx="380" cy="160" rx="70" ry="25" fill="#D4CCB2"/>
              <ellipse cx="540" cy="180" rx="60" ry="28" fill="#D4CCB2"/>
            </g>

            {/* Roads/highways suggestion */}
            <g stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round">
              <path d="M 80,160 Q 220,180 380,200 T 600,240"/>
              <path d="M 250,80 Q 280,180 320,310"/>
              <path d="M 480,60 Q 490,200 510,310"/>
              <path d="M 540,180 Q 545,250 555,330"/>
            </g>
            <g stroke="#F0E8D0" strokeWidth="0.6" fill="none" opacity="0.7">
              <path d="M 50,200 Q 200,210 350,220 T 620,260"/>
              <path d="M 120,100 Q 200,180 280,260"/>
              <path d="M 600,120 Q 580,200 560,290"/>
            </g>

            {/* City dots */}
            <g fill="#7A7560">
              <circle cx="160" cy="170" r="1.5"/>
              <text x="166" y="173" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Dallas</text>
              <circle cx="195" cy="215" r="1.5"/>
              <text x="201" y="218" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Houston</text>
              <circle cx="350" cy="240" r="1.5"/>
              <text x="356" y="243" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">New Orleans</text>
              <circle cx="445" cy="180" r="1.5"/>
              <text x="451" y="183" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Atlanta</text>
              <circle cx="538" cy="380" r="1.5"/>
              <text x="510" y="395" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Miami</text>
              <circle cx="540" cy="340" r="1.5"/>
              <text x="546" y="343" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Tampa</text>
              <circle cx="555" cy="305" r="1.5"/>
              <text x="561" y="308" fontSize="7" fill="#7A7560" fontFamily="Inter, sans-serif">Jacksonville</text>
            </g>

            {/* Region label */}
            <text x="640" y="80" fontSize="9" fill="#9A9075" fontFamily="Inter, sans-serif" letterSpacing="2" opacity="0.7">ATLANTIC</text>
            <text x="320" y="380" fontSize="9" fill="#7FA8B8" fontFamily="Inter, sans-serif" letterSpacing="2" opacity="0.7">GULF OF MEXICO</text>
          </g>
        </svg>

        {/* Pins */}
        {pins.map((p, i) => (
          <div
            key={p.id}
            className="dir-pin"
            style={{ top: `${p.top}%`, left: `${p.left}%`, animationDelay: `${i * 0.25}s` }}
          >
            <span className="dir-pin-ring"></span>
            <span className="dir-pin-bubble">{p.code}</span>
          </div>
        ))}

        <div className="dir-map-attr">© Mapbox · OpenStreetMap</div>
      </div>

      <div className="dir-side">
        <div className="dir-tabs">
          <button className="dir-tab is-active">Map</button>
          <button className="dir-tab">Network</button>
        </div>
        <div className="dir-search">
          <input placeholder="City, state, or zip..." disabled/>
        </div>
        <div className="dir-select">Medical Practice <span className="caret">▾</span></div>
        <div className="dir-select">All locations <span className="caret">▾</span></div>
        <div className="dir-list">
          {list.map((c, i) => (
            <div key={i} className="dir-item" style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="dir-item-code">{c.code}</span>
              <div className="dir-item-body">
                <div className="dir-item-name">{c.name}</div>
                <div className="dir-item-loc">{c.loc}</div>
              </div>
              {c.tag && <span className="dir-item-tag">Connected</span>}
              <span className="dir-item-dot"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ SCHEDULING VIEW (calendar) ============
function SchedulingView() {
  // Mini month calendar (April 2026)
  const miniDays = [
    [30,31,1,2,3,4,5],
    [6,7,8,9,10,11,12],
    [13,14,15,16,17,18,19],
    [20,21,22,23,24,25,26],
    [27,28,29,30,1,2,3]
  ];

  const apptTypes = [
    { color: "#F4A23A", label: "Orthopedic & Neuro Surgical Exam" },
    { color: "#0BB5A3", label: "TBI Consultation" },
    { color: "#3D5AFE", label: "Neurology" },
    { color: "#22C8B0", label: "Physical Therapy" },
    { color: "#6B7280", label: "Follow-Up" },
    { color: "#E5446D", label: "MRI" },
    { color: "#22D3EE", label: "CT Scan" },
    { color: "#0BB5A3", label: "X-Ray" },
    { color: "#F2A23A", label: "Other Diagnostic Procedure" },
    { color: "#3D5AFE", label: "Deposition" }
  ];

  // Calendar events grid: array of {day, time, name, color}
  const events = {
    "tue1":  [{ time: "1:00", name: "Angela", color: "#A7E3CC" }, { time: "1:00", name: "Carlos", color: "#A7E3CC" }],
    "wed1":  [{ time: "9:00", name: "Patricia", color: "#22C8B0" }],
    "sat4":  [{ time: "1:00", name: "David", color: "#22D3EE" }],
    "sun5":  [{ time: "12:30", name: "Lenny", color: "#E5446D" }, { time: "4:00", name: "James", color: "#F2A23A" }],
    "mon6":  [{ time: "10:00", name: "Maria", color: "#F2A23A" }, { time: "12:00", name: "Maria", color: "#22D3EE" }, { time: "1:00", name: "Maria", color: "#E5446D" }],
    "tue7":  [{ time: "3:30", name: "Lenny", color: "#6B7280" }],
    "wed8":  [{ time: "12:30", name: "Lenny", color: "#6B7280" }, { time: "4:00", name: "Lenny", color: "#6B7280" }, { time: "5:30", name: "Lenny", color: "#E5446D" }],
    "sat11": [{ time: "4:30", name: "Lenny", color: "#E5446D" }],
    "mon13": [{ time: "5:00", name: "Lenny", color: "#E5446D" }],
    "wed15": [{ time: "5:30", name: "Joel", color: "#E5446D" }],
    "thu16": [{ time: "10:00", name: "Tati", color: "#6B7280" }, { time: "3:30", name: "Tati", color: "#6B7280" }],
    "fri17": [{ time: "2:30", name: "Lenny", color: "#6B7280" }],
    "fri24": [{ time: "1:00", name: "Lenny", color: "#E5446D" }],
    "mon20": [{ time: "8:30", name: "Tati", color: "#6B7280" }],
    "wed22": [{ time: "2:30", name: "Lenny", color: "#6B7280" }]
  };

  // Build flat 5x7 grid (35 cells)
  const dayKeys = [
    null, null, "wed1", null, null, "sat4", "sun5",
    "mon6", "tue7", "wed8", null, null, null, null,
    "mon13", null, "wed15", "thu16", "fri17", null, null,
    "mon20", null, "wed22", null, "fri24", "sat25", null,
    null, null, null, null, null, null, null
  ];
  const dayNumbers = [
    30, 31, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 1, 2, 3
  ];
  const otherMonth = [true,true,false,false,false,false,false, false,false,false,false,false,false,false, false,false,false,false,false,false,false, false,false,false,false,false,false,false, false,false,false,false,true,true,true];
  const eventsByIdx = { 2: "wed1", 5: "sat4", 6: "sun5", 7: "mon6", 8: "tue7", 9: "wed8", 12: "sat11", 14: "mon13", 16: "wed15", 17: "thu16", 18: "fri17", 21: "mon20", 23: "wed22", 25: "fri24" };

  return (
    <div className="sched">
      <div className="sched-side">
        <div className="mini-cal">
          <div className="mini-cal-head">APRIL 2026</div>
          <div className="mini-cal-grid mini-cal-dow">
            {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <span key={d}>{d}</span>)}
          </div>
          {miniDays.map((row, i) => (
            <div key={i} className="mini-cal-grid">
              {row.map((d, j) => {
                const isToday = d === 25 && i === 3;
                const dim = (i === 0 && d > 7) || (i === 4 && d < 7);
                return (
                  <span key={j} className={`mini-cal-day ${dim ? "dim" : ""} ${isToday ? "today" : ""}`}>{d}</span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="appt-types">
          <div className="appt-types-head">APPOINTMENT TYPES</div>
          {apptTypes.map((t, i) => (
            <div key={i} className="appt-type">
              <span className="appt-check">✓</span>
              <span className="appt-dot" style={{ background: t.color }}></span>
              <span className="appt-label">{t.label}</span>
            </div>
          ))}
          <div className="appt-add">+ Add Appointment Type</div>
        </div>
      </div>

      <div className="sched-main">
        <div className="sched-toolbar">
          <div className="sched-stats">
            <div className="sched-stat">
              <div className="sched-stat-num">0</div>
              <div className="sched-stat-label">📅 Today's</div>
            </div>
            <div className="sched-stat">
              <div className="sched-stat-num">0</div>
              <div className="sched-stat-label">✓ Confirmed</div>
            </div>
            <div className="sched-stat">
              <div className="sched-stat-num">0</div>
              <div className="sched-stat-label">⏱ Pending</div>
            </div>
          </div>
          <button className="sched-new">+ New Appointment</button>
        </div>
        <div className="sched-toolbar2">
          <div className="sched-nav">
            <button>Today</button>
            <button>‹</button>
            <button>›</button>
            <span className="sched-month">April 2026</span>
          </div>
          <div className="sched-view">
            <button>Day</button>
            <button>Week</button>
            <button className="is-active">Month</button>
          </div>
        </div>

        <div className="cal-dow">
          {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="cal-grid">
          {dayNumbers.map((d, i) => {
            const k = eventsByIdx[i];
            const evs = k ? events[k] : null;
            const isToday = i === 26; // 25th
            return (
              <div key={i} className={`cal-cell ${otherMonth[i] ? "dim" : ""} ${isToday ? "today" : ""}`}>
                <div className="cal-day-num">{d}</div>
                {evs && (
                  <div className="cal-events" style={{ animationDelay: `${i * 0.02}s` }}>
                    {evs.map((e, j) => (
                      <div key={j} className="cal-event" style={{ background: e.color, color: "#fff" }}>
                        {e.time} {e.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
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
function FloatMatchNotif() {
  return (
    <div className="float f4">
      <div className="match-notif">
        <div className="match-notif-icon">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M3 7.5L5.5 10L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="match-notif-title">New attorney match</div>
          <div className="match-notif-sub">Henderson Law · 0.6mi away</div>
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

Object.assign(window, { LaptopStage });
