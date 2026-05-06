'use client';

import { useEffect, useState } from 'react';

const COMPLIANCE = [
  { week: '02/23', value: 20 },
  { week: '03/02', value: 21 },
  { week: '03/09', value: 22 },
  { week: '03/16', value: 20 },
  { week: '03/23', value: 20 },
  { week: '03/30', value: 21 },
  { week: '04/06', value: 18 },
  { week: '04/13', value: 22 },
  { week: '04/20', value: 17 },
  { week: '04/27', value: 16 },
  { week: '05/04', value: 15 },
];

const SERVICES = [
  { w: 1, base: 5, top: 0.4 },
  { w: 2, base: 4, top: 0.4 },
  { w: 3, base: 15.5, top: 1.2 },
  { w: 4, base: 5, top: 0.6 },
  { w: 5, base: 4.2, top: 0.4 },
  { w: 6, base: 9, top: 0.6 },
  { w: 7, base: 4, top: 0.6 },
  { w: 8, base: 5, top: 0.4 },
  { w: 9, base: 3, top: 0.3 },
  { w: 10, base: 5, top: 0.6 },
];

export default function DotStage() {
  const [animate, setAnimate] = useState(false);
  const [highlightWeek, setHighlightWeek] = useState(2);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    const interval = setInterval(() => {
      setHighlightWeek((w) => (w + 1) % COMPLIANCE.length);
    }, 1800);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const maxService = Math.max(...SERVICES.map((s) => s.base + s.top));

  return (
    <div className="stage stage-laptop">
      {/* LAPTOP */}
      <div className="laptop">
        <div className="laptop-screen">
          <div className="dash">
            <div className="dash-tabbar">
              <span className="dash-tab is-active">1D</span>
              <span className="dash-tab">1W</span>
              <span className="dash-tab is-active">1M</span>
              <span className="dash-tab">3M</span>
              <span className="dash-tab">6M</span>
              <span className="dash-tab">1Y</span>
              <span className="dash-tab">Custom</span>
            </div>

            <div className="dash-row dash-row-top">
              <div className="dash-card dash-sessions">
                <div className="dash-card-title">Referrals</div>
                <div className="dash-progress">
                  <div className="dash-progress-fill" style={{ width: animate ? '64%' : '0%' }} />
                  <div className="dash-progress-fill is-warn" style={{ width: animate ? '22%' : '0%' }} />
                </div>
                <div className="dash-progress-legend">
                  <span><i className="d-dot d-dot-blue" /> Placed (124)</span>
                  <span><i className="d-dot d-dot-red" /> Pending LOP (42)</span>
                  <span><i className="d-dot d-dot-grey" /> Unmatched (28)</span>
                </div>
              </div>
              <div className="dash-card dash-notes">
                <div className="dash-notes-num">23</div>
                <div className="dash-notes-label">Notes due</div>
              </div>
            </div>

            <div className="dash-row">
              <div className="dash-auth">
                <div className="dash-card-title">Expiring Active Authorizations</div>
                <div className="dash-auth-tabs">
                  <span>30 Days</span>
                  <span>60 Days</span>
                  <span className="is-active">90 Days</span>
                </div>
                <div className="dash-auth-row">
                  <div className="dash-auth-col">
                    <div className="dash-auth-label">Client</div>
                    <div className="dash-auth-value">
                      <span className="dash-auth-avatar">DC</span>
                      Dorsey Hester
                    </div>
                  </div>
                  <div className="dash-auth-col">
                    <div className="dash-auth-label">Expiration</div>
                    <div className="dash-auth-value dash-auth-date">12/31/2025</div>
                  </div>
                </div>
              </div>
              <div className="dash-statcard">
                <div className="dash-statcard-num">4</div>
                <div className="dash-statcard-label">
                  <span className="dash-statcard-icon">●</span> Active Clinics
                </div>
              </div>
              <div className="dash-statcard">
                <div className="dash-statcard-num">17</div>
                <div className="dash-statcard-label">
                  <span className="dash-statcard-icon">●●</span> Active Staff
                </div>
              </div>
            </div>

            <div className="dash-card dash-chart">
              <div className="dash-chart-head">
                <div className="dash-card-title">Supervision Compliance</div>
                <div className="dash-chart-sub">Weekly Compliance Rate</div>
              </div>
              <div className="dash-chart-grid">
                <div className="dash-chart-axis">
                  <span>40%</span>
                  <span>30%</span>
                  <span>20%</span>
                  <span>10%</span>
                  <span>0%</span>
                </div>
                <div className="dash-chart-bars">
                  {COMPLIANCE.map((c, i) => (
                    <div key={c.week} className={`dash-bar ${highlightWeek === i ? 'is-hot' : ''}`}>
                      <span className="dash-bar-val">{c.value}%</span>
                      <span
                        className="dash-bar-fill"
                        style={{ height: animate ? `${(c.value / 40) * 100}%` : '0%' }}
                      />
                      <span className="dash-bar-week">{c.week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dash-card dash-services">
              <div className="dash-card-title">Weekly Service Hours</div>
              <div className="dash-services-bars">
                {SERVICES.map((s) => {
                  const totalH = ((s.base + s.top) / maxService) * 100;
                  const baseH = (s.base / (s.base + s.top)) * 100;
                  return (
                    <div key={s.w} className="dash-svc-bar">
                      <span className="dash-svc-stack" style={{ height: animate ? `${totalH}%` : '0%' }}>
                        <span className="dash-svc-base" style={{ height: `${baseH}%` }} />
                        <span className="dash-svc-top" style={{ height: `${100 - baseH}%` }} />
                      </span>
                    </div>
                  );
                })}
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
          <div className="ph">
            <div className="ph-status">
              <span>2:23</span>
              <span>•••• LTE</span>
            </div>
            <div className="ph-brand">
              <span className="ph-brand-mark">▲</span>
              raven
              <span className="ph-bell">🔔</span>
            </div>
            <div className="ph-hello">Hello.</div>
            <div className="ph-date">May 5th, 2026</div>

            <div className="ph-card">
              <div className="ph-card-h">You have 4 referrals today</div>
              <div className="ph-card-sub">Today&apos;s Referral Progress</div>
              <div className="ph-bar">
                <span className="ph-bar-fill" style={{ width: animate ? '25%' : '0%' }} />
              </div>
              <ul className="ph-legend">
                <li><i className="d-dot d-dot-blue" /> Completed (1)</li>
                <li><i className="d-dot d-dot-red" /> LOPs Due (0)</li>
                <li><i className="d-dot d-dot-grey" /> Not Started (3)</li>
              </ul>
              <button className="ph-btn">CREATE NEW REFERRAL</button>
            </div>

            <div className="ph-mini">
              <div className="ph-mini-h">Referrals since April 6th, 2026</div>
              <ul className="ph-mini-list">
                <li>
                  <span className="ph-mini-icon ph-mini-icon-warn">⏱</span>
                  <span className="ph-mini-num">12</span>
                  <span className="ph-mini-lbl">Not Started</span>
                </li>
                <li>
                  <span className="ph-mini-icon">⌛</span>
                  <span className="ph-mini-num">0</span>
                  <span className="ph-mini-lbl">In Progress</span>
                </li>
                <li>
                  <span className="ph-mini-icon ph-mini-icon-red">📋</span>
                  <span className="ph-mini-num">0</span>
                  <span className="ph-mini-lbl">Missing LOPs</span>
                </li>
                <li>
                  <span className="ph-mini-icon ph-mini-icon-good">✓</span>
                  <span className="ph-mini-num">10</span>
                  <span className="ph-mini-lbl">Completed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="phone-notch" />
      </div>
    </div>
  );
}
