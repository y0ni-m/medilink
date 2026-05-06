'use client';

import { useEffect, useState } from 'react';

type Appt = { day: number; chips: { time: string; name: string; color: string }[] };

const APPTS: Appt[] = [
  { day: -1, chips: [{ time: '1:00', name: 'Angela', color: 'lt-green' }, { time: '1:00', name: 'Carlos', color: 'lt-green' }] },
  { day: 1, chips: [{ time: '1:00', name: 'Patricia', color: 'green' }] },
  { day: 4, chips: [{ time: '1:00', name: 'David', color: 'teal' }] },
  { day: 5, chips: [{ time: '12:30', name: 'Lenoy', color: 'red' }, { time: '4:00', name: 'James', color: 'orange' }] },
  { day: 6, chips: [{ time: '10:00', name: 'Maria', color: 'orange' }, { time: '12:00', name: 'Maria', color: 'blue' }, { time: '1:00', name: 'Maria', color: 'teal' }] },
  { day: 7, chips: [{ time: '9:30', name: 'Lenoy', color: 'grey' }] },
  { day: 8, chips: [{ time: '12:30', name: 'Lenoy', color: 'grey' }, { time: '4:00', name: 'Lenoy', color: 'grey' }, { time: '5:30', name: 'Lenoy', color: 'red' }] },
  { day: 11, chips: [{ time: '4:30', name: 'Lenoy', color: 'red' }] },
  { day: 13, chips: [{ time: '5:00', name: 'Lenoy', color: 'red' }] },
  { day: 15, chips: [{ time: '5:00', name: 'Joel', color: 'red' }] },
  { day: 16, chips: [{ time: '10:00', name: 'Tati', color: 'grey' }, { time: '3:30', name: 'Tati', color: 'grey' }] },
  { day: 17, chips: [{ time: '3:30', name: 'Lenoy', color: 'grey' }] },
  { day: 20, chips: [{ time: '9:30', name: 'Tati', color: 'grey' }] },
  { day: 22, chips: [{ time: '2:30', name: 'Lenoy', color: 'grey' }] },
  { day: 24, chips: [{ time: '5:00', name: 'Lenoy', color: 'red' }] },
  { day: 26, chips: [{ time: '2:00', name: 'Joel', color: 'red' }] },
];

const APPT_TYPES = [
  { label: 'Orthopedic & Neuro', color: '#e74c3c' },
  { label: 'TBI Consultation', color: '#9b59b6' },
  { label: 'Neurology', color: '#0da7ca' },
  { label: 'Physical Therapy', color: '#27ae60' },
  { label: 'Follow-Up', color: '#2ecc71' },
  { label: 'MRI', color: '#3D5AFE' },
  { label: 'X-Ray', color: '#e91e63' },
];

// Build a 5x7 grid of day numbers for April 2026 (April 1 = Wed)
// Mon-row: 30, 31, 1, 2, 3, 4, 5  (week 1, with 30/31 from March)
// Then 6-12, 13-19, 20-26, 27-30 + 1-3
const CALENDAR_DAYS: (number | string)[] = [
  30, 31, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, '1', '2', '3',
];

export default function DotStage() {
  const [animate, setAnimate] = useState(false);
  const [pulseConfirm, setPulseConfirm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 120);
    const interval = setInterval(() => {
      setPulseConfirm((v) => !v);
    }, 2200);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const findAppt = (d: number | string): Appt | undefined => {
    if (typeof d === 'string') return undefined;
    if (d === 31 && CALENDAR_DAYS.indexOf(d) === 1) return APPTS.find((a) => a.day === -1);
    return APPTS.find((a) => a.day === d);
  };

  const isMutedDay = (d: number | string, idx: number) => {
    if (typeof d === 'string') return true;
    if (idx < 2) return true; // 30, 31 from March
    if (idx >= 33) return true; // 1, 2, 3 from May (only 33-34 are strings; idx 32 is May 1)
    return false;
  };

  return (
    <div className="stage stage-laptop">
      {/* LAPTOP */}
      <div className="laptop">
        <div className="laptop-screen">
          <div className="ml-app">
            {/* TOP NAV BAR */}
            <div className="ml-topbar">
              <div className="ml-brand">
                <img src="/medilink_color_vertical.svg" alt="" />
              </div>
              <div className="ml-nav">
                <span className="ml-nav-item">
                  <span className="ml-nav-ico">▦</span>Dashboard
                </span>
                <span className="ml-nav-item">
                  <span className="ml-nav-ico">◐</span>Contacts
                </span>
                <span className="ml-nav-item is-active">
                  <span className="ml-nav-ico">▤</span>Scheduling
                </span>
                <span className="ml-nav-item">
                  <span className="ml-nav-ico">◉</span>Directory
                </span>
                <span className="ml-nav-item">
                  <span className="ml-nav-ico">▢</span>Documents
                </span>
                <span className="ml-nav-item">
                  <span className="ml-nav-ico">◇</span>Billing
                </span>
              </div>
              <div className="ml-userbar">
                <span className="ml-bell">🔔</span>
                <span className="ml-moon">◐</span>
                <span className="ml-avatar">JD</span>
                <span className="ml-name">Jane Doe</span>
              </div>
            </div>

            {/* SCHEDULING BODY */}
            <div className="ml-body">
              <aside className="ml-side">
                <div className="ml-side-h">APRIL 2026</div>
                <div className="ml-mini-cal">
                  <div className="ml-mini-cal-h">
                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                  </div>
                  <div className="ml-mini-cal-grid">
                    {CALENDAR_DAYS.map((d, i) => (
                      <span
                        key={i}
                        className={`ml-mini-day ${i === 7 ? 'is-today' : ''} ${isMutedDay(d, i) ? 'is-muted' : ''}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-side-h ml-side-h-sp">APPOINTMENT TYPES</div>
                <ul className="ml-types">
                  {APPT_TYPES.map((t) => (
                    <li key={t.label}>
                      <span className="ml-types-check">✓</span>
                      <span className="ml-types-dot" style={{ background: t.color }} />
                      {t.label}
                    </li>
                  ))}
                  <li className="ml-types-add">＋ Add Appointment Type</li>
                </ul>
              </aside>

              <div className="ml-main">
                {/* STAT ROW */}
                <div className="ml-stats">
                  <div className="ml-stat">
                    <span className="ml-stat-ico ml-stat-ico-cal">📅</span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Today&apos;s</div>
                    </div>
                  </div>
                  <div className={`ml-stat ${pulseConfirm ? 'is-pulse' : ''}`}>
                    <span className="ml-stat-ico ml-stat-ico-ok">✓</span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Confirmed</div>
                    </div>
                  </div>
                  <div className="ml-stat">
                    <span className="ml-stat-ico ml-stat-ico-pen">⏱</span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Pending</div>
                    </div>
                  </div>
                  <button className="ml-new">＋ New Appointment</button>
                </div>

                {/* CAL HEAD */}
                <div className="ml-cal-head">
                  <div className="ml-cal-nav">
                    <span className="ml-arrow">‹</span>
                    <span className="ml-today">Today</span>
                    <span className="ml-arrow">›</span>
                    <span className="ml-cal-month">April 2026</span>
                  </div>
                  <div className="ml-cal-toggle">
                    <span>Day</span>
                    <span>Week</span>
                    <span className="is-active">Month</span>
                  </div>
                </div>

                {/* CAL DAY HEADERS */}
                <div className="ml-cal-dayhead">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>

                {/* CAL GRID */}
                <div className={`ml-cal-grid ${animate ? 'is-in' : ''}`}>
                  {CALENDAR_DAYS.map((d, i) => {
                    const appt = findAppt(d);
                    const muted = isMutedDay(d, i);
                    return (
                      <div key={i} className={`ml-cal-cell ${muted ? 'is-muted' : ''}`}>
                        <span className="ml-cal-day">{d}</span>
                        {appt &&
                          appt.chips.slice(0, 3).map((c, j) => (
                            <span key={j} className={`ml-chip ml-chip-${c.color}`}>
                              {c.time} {c.name}
                            </span>
                          ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="laptop-notch" />
        <div className="laptop-hinge" />
      </div>

      {/* PHONE */}
      <div className="phone">
        <div className="phone-screen">
          <div className="ml-ph">
            <div className="ml-ph-status">
              <span>8:41</span>
              <span>•••• ＝</span>
            </div>
            <div className="ml-ph-bar">
              <span className="ml-ph-burger">≡</span>
              <img src="/medilink_color_vertical.svg" alt="" className="ml-ph-logo" />
              <span className="ml-ph-icons">🔔 ◐</span>
              <span className="ml-ph-avatar">JD</span>
            </div>
            <div className="ml-ph-h1">Dashboard</div>
            <div className="ml-ph-sub">Dr. Doe Center</div>

            <div className="ml-ph-stats">
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-cal">📅</span>
                <div className="ml-ph-stat-lbl">TODAY&apos;S<br />APPOINTMENTS</div>
                <div className="ml-ph-stat-num">0</div>
                <div className="ml-ph-stat-foot ml-ph-stat-foot-ok">0 confirmed</div>
              </div>
              <div className={`ml-ph-stat ${pulseConfirm ? 'is-pulse' : ''}`}>
                <span className="ml-ph-stat-ico ml-ph-stat-ico-pen">⏱</span>
                <div className="ml-ph-stat-lbl">AWAITING<br />CONFIRMATION</div>
                <div className="ml-ph-stat-num is-warn">15</div>
                <div className="ml-ph-stat-foot">need review</div>
              </div>
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-people">👥</span>
                <div className="ml-ph-stat-lbl">ACTIVE<br />CLIENTS</div>
                <div className="ml-ph-stat-num">14</div>
                <div className="ml-ph-stat-foot">in your practice</div>
              </div>
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-stack">▣</span>
                <div className="ml-ph-stat-lbl">TEAM<br />MEMBERS</div>
                <div className="ml-ph-stat-num">6</div>
                <div className="ml-ph-stat-foot">providers & staff</div>
              </div>
            </div>

            <div className="ml-ph-card">
              <div className="ml-ph-card-h">
                <span>Upcoming Appointments</span>
                <span className="ml-ph-link">View calendar</span>
              </div>
              <div className="ml-ph-empty">No upcoming appointments</div>
            </div>
          </div>
        </div>
        <div className="phone-notch" />
      </div>
    </div>
  );
}
