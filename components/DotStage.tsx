'use client';

import { useEffect, useState } from 'react';

/* ============ ICONS ============ */
const Icon = {
  Dashboard: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  ),
  Contacts: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5" />
      <path d="M2 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <circle cx="11.5" cy="5.5" r="2" />
      <path d="M11 9.5c1.8 0 3.5 1 3.5 3" />
    </svg>
  ),
  Scheduling: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12" />
      <path d="M5 1.5v3M11 1.5v3" />
    </svg>
  ),
  Directory: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="6.5" r="2" />
      <path d="M8 1.5c-3 0-5 2.2-5 5 0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2-5-5-5z" />
    </svg>
  ),
  Documents: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2h6l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M9 2v4h4" />
    </svg>
  ),
  Billing: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 1.5h10v13l-2-1.2-2 1.2-1.5-1.2L6 14.5l-1.5-1.2L3 14.5z" />
      <path d="M5 5h6M5 8h6M5 11h4" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11h9c-1-1-1-1.5-1-4 0-2.2-1.6-4-3.5-4S4.5 4.8 4.5 7c0 2.5 0 3-1 4z" />
      <path d="M6.5 13c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 105.5 7.5c.3-.1.7-.4 1-1z" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 2v8M2 6h8" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="3.5" width="13" height="12" rx="1.5" />
      <path d="M2.5 7h13" />
      <path d="M6 1.5v3M12 1.5v3" />
      <circle cx="6" cy="11" r="0.7" fill="currentColor" />
      <circle cx="9" cy="11" r="0.7" fill="currentColor" />
      <circle cx="12" cy="11" r="0.7" fill="currentColor" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.5" />
      <path d="M6 9.2l2.2 2.2L12 7.4" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.5" />
      <path d="M9 5v4l2.5 1.5" />
    </svg>
  ),
  People: () => (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M2.5 14.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
      <circle cx="13" cy="6.5" r="2" />
      <path d="M12.5 10.5c2 0 3.5 1.3 3.5 3.5" />
    </svg>
  ),
  Stack: () => (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2.5l6 3-6 3-6-3 6-3z" />
      <path d="M3 9l6 3 6-3" />
      <path d="M3 12.5l6 3 6-3" />
    </svg>
  ),
  Burger: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 5h10M3 8h10M3 11h10" />
    </svg>
  ),
  ChevLeft: () => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 3L4 6l3.5 3" />
    </svg>
  ),
  ChevRight: () => (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 3L8 6l-3.5 3" />
    </svg>
  ),
};

/* ============ DATA ============ */
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

  const findAppt = (d: number | string, idx: number): Appt | undefined => {
    if (typeof d === 'string') return undefined;
    if (d === 31 && idx === 1) return APPTS.find((a) => a.day === -1);
    if (idx >= 2 && idx <= 32) return APPTS.find((a) => a.day === d);
    return undefined;
  };

  const isMutedDay = (d: number | string, idx: number) => {
    if (typeof d === 'string') return true;
    if (idx < 2) return true;
    if (idx >= 33) return true;
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
                <span className="ml-nav-item"><Icon.Dashboard />Dashboard</span>
                <span className="ml-nav-item"><Icon.Contacts />Contacts</span>
                <span className="ml-nav-item is-active"><Icon.Scheduling />Scheduling</span>
                <span className="ml-nav-item"><Icon.Directory />Directory</span>
                <span className="ml-nav-item"><Icon.Documents />Documents</span>
                <span className="ml-nav-item"><Icon.Billing />Billing</span>
              </div>
              <div className="ml-userbar">
                <span className="ml-iconbtn"><Icon.Bell /></span>
                <span className="ml-iconbtn"><Icon.Moon /></span>
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
                      <span className="ml-types-check"><Icon.Check /></span>
                      <span className="ml-types-dot" style={{ background: t.color }} />
                      {t.label}
                    </li>
                  ))}
                  <li className="ml-types-add"><Icon.Plus /> Add Appointment Type</li>
                </ul>
              </aside>

              <div className="ml-main">
                <div className="ml-stats">
                  <div className="ml-stat">
                    <span className="ml-stat-ico ml-stat-ico-cal"><Icon.Calendar /></span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Today&apos;s</div>
                    </div>
                  </div>
                  <div className={`ml-stat ${pulseConfirm ? 'is-pulse' : ''}`}>
                    <span className="ml-stat-ico ml-stat-ico-ok"><Icon.Check /></span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Confirmed</div>
                    </div>
                  </div>
                  <div className="ml-stat">
                    <span className="ml-stat-ico ml-stat-ico-pen"><Icon.Clock /></span>
                    <div>
                      <div className="ml-stat-num">0</div>
                      <div className="ml-stat-lbl">Pending</div>
                    </div>
                  </div>
                  <button className="ml-new"><Icon.Plus /> New Appointment</button>
                </div>

                <div className="ml-cal-head">
                  <div className="ml-cal-nav">
                    <span className="ml-arrow"><Icon.ChevLeft /></span>
                    <span className="ml-today">Today</span>
                    <span className="ml-arrow"><Icon.ChevRight /></span>
                    <span className="ml-cal-month">April 2026</span>
                  </div>
                  <div className="ml-cal-toggle">
                    <span>Day</span>
                    <span>Week</span>
                    <span className="is-active">Month</span>
                  </div>
                </div>

                <div className="ml-cal-dayhead">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>

                <div className={`ml-cal-grid ${animate ? 'is-in' : ''}`}>
                  {CALENDAR_DAYS.map((d, i) => {
                    const appt = findAppt(d, i);
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
              <span className="ml-ph-status-r">
                <span className="ml-ph-bars" />
                <span className="ml-ph-wifi" />
                <span className="ml-ph-batt" />
              </span>
            </div>
            <div className="ml-ph-bar">
              <span className="ml-ph-iconbtn"><Icon.Burger /></span>
              <img src="/medilink_color_vertical.svg" alt="" className="ml-ph-logo" />
              <span className="ml-ph-iconbtn"><Icon.Bell /></span>
              <span className="ml-ph-iconbtn"><Icon.Moon /></span>
              <span className="ml-ph-avatar">JD</span>
            </div>
            <div className="ml-ph-h1">Dashboard</div>
            <div className="ml-ph-sub">Dr. Doe Center</div>

            <div className="ml-ph-stats">
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-cal"><Icon.Calendar /></span>
                <div className="ml-ph-stat-lbl">TODAY&apos;S<br />APPOINTMENTS</div>
                <div className="ml-ph-stat-num">0</div>
                <div className="ml-ph-stat-foot ml-ph-stat-foot-ok">0 confirmed</div>
              </div>
              <div className={`ml-ph-stat ${pulseConfirm ? 'is-pulse' : ''}`}>
                <span className="ml-ph-stat-ico ml-ph-stat-ico-pen"><Icon.Clock /></span>
                <div className="ml-ph-stat-lbl">AWAITING<br />CONFIRMATION</div>
                <div className="ml-ph-stat-num is-warn">15</div>
                <div className="ml-ph-stat-foot">need review</div>
              </div>
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-people"><Icon.People /></span>
                <div className="ml-ph-stat-lbl">ACTIVE<br />CLIENTS</div>
                <div className="ml-ph-stat-num">14</div>
                <div className="ml-ph-stat-foot">in your practice</div>
              </div>
              <div className="ml-ph-stat">
                <span className="ml-ph-stat-ico ml-ph-stat-ico-stack"><Icon.Stack /></span>
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
