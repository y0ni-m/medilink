'use client';

import { useState } from 'react';

// Today's list at the clinic. Marking a visit attended or a no-show is what
// posts to the firm's case timeline and to the per-visit bill. Nothing to fax.

type V = { id: string; time: string; name: string; type: string; firm: string; bill: number; state: 'due' | 'attended' | 'noshow' | 'resched' };
const START: V[] = [
  { id: '1', time: '9:00', name: 'Grace Okafor', type: 'Adjustment · therapy', firm: 'Reyes Law Firm', bill: 180, state: 'attended' },
  { id: '2', time: '10:15', name: 'Keisha Willis', type: 'Re-evaluation', firm: 'Harbor & Stone', bill: 260, state: 'attended' },
  { id: '3', time: '12:00', name: 'Sofia Marino', type: 'Adjustment · therapy', firm: 'Reyes Law Firm', bill: 180, state: 'due' },
  { id: '4', time: '2:00', name: 'Jordan Smith', type: 'MD evaluation · EMC', firm: 'Harbor & Stone', bill: 310, state: 'due' },
  { id: '5', time: '3:15', name: 'Luis Fuentes', type: 'Adjustment · therapy', firm: 'Coastal Legal', bill: 180, state: 'due' },
  { id: '6', time: '4:00', name: 'Rosa Delgado', type: 'Follow-up', firm: 'Harbor & Stone', bill: 260, state: 'due' },
];

export default function AttendanceDemo() {
  const [v, setV] = useState(START);
  const [feed, setFeed] = useState<string[]>(['Keisha Willis · attended 10:15 · $260 posted to Harbor & Stone', 'Grace Okafor · attended 9:00 · $180 posted to Reyes Law Firm']);
  const set = (id: string, state: V['state']) => {
    const x = v.find((a) => a.id === id)!;
    setV((all) => all.map((a) => (a.id === id ? { ...a, state } : a)));
    setFeed((f) => [state === 'attended' ? `${x.name} · attended ${x.time} · $${x.bill} posted to ${x.firm}` : state === 'noshow' ? `${x.name} · no-show ${x.time} · ${x.firm} notified, re-offer sent by text` : `${x.name} · rescheduled · new times texted`, ...f].slice(0, 5));
  };
  const attended = v.filter((a) => a.state === 'attended'); const billed = attended.reduce((s, a) => s + a.bill, 0);
  return (
    <div className="lf-demo lf-demo-att">
      <div className="lf-demo-bar"><span className="lf-demo-title">Today · Mon Nov 10</span><span className="lf-demo-hint">Mark each visit. The firm sees it.</span></div>
      <div className="lf-at-grid">
        <ul className="lf-at-list">
          {v.map((a) => (
            <li key={a.id} className={`is-${a.state}`}>
              <span className="lf-at-time">{a.time}</span>
              <span className="lf-at-body"><b>{a.name}</b><small>{a.type} · {a.firm}</small></span>
              {a.state === 'due' ? (
                <span className="lf-at-btns">
                  <button type="button" onClick={() => set(a.id, 'attended')}>Attended</button>
                  <button type="button" className="is-warn" onClick={() => set(a.id, 'noshow')}>No-show</button>
                  <button type="button" className="is-ghost" onClick={() => set(a.id, 'resched')}>Reschedule</button>
                </span>
              ) : (
                <span className={`lf-pill ${a.state === 'attended' ? 'lf-pill-soft' : 'lf-pill-warn'}`}>{a.state === 'attended' ? `Attended · $${a.bill}` : a.state === 'noshow' ? 'No-show' : 'Rescheduled'}</span>
              )}
            </li>
          ))}
        </ul>
        <aside className="lf-at-side">
          <div className="lf-cd-stats"><span><b>{attended.length}</b>attended</span><span><b>${billed.toLocaleString()}</b>billed today</span><span><b>{v.filter((a) => a.state === 'noshow').length}</b>no-shows</span></div>
          <b className="lf-at-feed-title">What the firms see</b>
          <ul className="lf-at-feed">{feed.map((f, i) => <li key={i}><i className="lf-dot lf-dot-green" />{f}</li>)}</ul>
          <p className="lf-msg-note">Attendance, bills and notes post to the case the moment you mark them. Offices are billed by MediLink only once they receive a case.</p>
        </aside>
      </div>
    </div>
  );
}
