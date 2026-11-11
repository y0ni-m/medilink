'use client';

import { useEffect, useRef, useState } from 'react';

// The clinic's referral inbox: each referral arrives with its packet and a
// one-hour window. Accept it, offer up to three first-visit times, and watch
// the patient pick one by text. Mirrors the Referrals tab + offer-times flow.

type Ref = { id: string; name: string; firm: string; injury: string; cov: string; lang: string; left: number; state: 'new' | 'accepted' | 'offered' | 'booked' | 'expired'; picked?: string };
const SLOTS = ['Tue 10:30 AM', 'Tue 3:15 PM', 'Wed 9:00 AM', 'Wed 2:15 PM', 'Thu 9:00 AM', 'Thu 1:30 PM'];
const START: Ref[] = [
  { id: 'r1', name: 'Camila R.', firm: 'Harbor & Stone Injury Law', injury: 'Rear-end MVA · 11/03 · neck and low back', cov: 'PIP $10,000 · dec page attached', lang: 'Spanish-speaking', left: 3600, state: 'new' },
  { id: 'r2', name: 'Devon B.', firm: 'Reyes Law Firm', injury: 'Side-impact MVA · 10/29', cov: 'PIP · EMC pending', lang: 'English', left: 2210, state: 'new' },
  { id: 'r3', name: 'Rosa D.', firm: 'Harbor & Stone Injury Law', injury: 'Premises · slip and fall · 06/03', cov: 'LOP signed', lang: 'Spanish-speaking', left: 0, state: 'booked', picked: 'Mon 11/17 · 9:00 AM' },
];

export default function InboxDemo({ active = true }: { active?: boolean }) {
  const [refs, setRefs] = useState(START);
  const [openId, setOpenId] = useState('r1');
  const [chosen, setChosen] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setRefs((all) => all.map((r) => (r.state === 'new' && r.left > 0 ? { ...r, left: r.left - 1 } : r))), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  const r = refs.find((x) => x.id === openId)!;
  const patch = (id: string, p: Partial<Ref>) => setRefs((all) => all.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const mm = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const toggle = (s: string) => setChosen((c) => (c.includes(s) ? c.filter((x) => x !== s) : c.length < 3 ? [...c, s] : c));
  const offer = () => {
    patch(r.id, { state: 'offered' });
    const id = r.id; const pick = chosen[Math.min(1, chosen.length - 1)];
    timers.current.push(window.setTimeout(() => patch(id, { state: 'booked', picked: pick }), 3200));
  };

  return (
    <div className="lf-demo lf-demo-inbox">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Referrals · Bayside Spine &amp; Injury</span>
        <span className="lf-demo-hint">Accept, offer times, the patient books</span>
      </div>
      <div className="lf-ib-grid">
        <aside className="lf-ib-list">
          {refs.map((x) => (
            <button type="button" key={x.id} className={`${x.id === openId ? 'is-on' : ''} is-${x.state}`} onClick={() => { setOpenId(x.id); setChosen([]); }}>
              <span className="lf-cm-avatar">{x.name[0]}</span>
              <span className="lf-ib-body"><b>{x.name}</b><small>{x.firm}</small></span>
              <span className={`lf-ib-state is-${x.state}`}>{x.state === 'new' ? mm(x.left) : x.state === 'accepted' ? 'Offer times' : x.state === 'offered' ? 'Waiting…' : x.state === 'booked' ? 'Booked' : 'Expired'}</span>
            </button>
          ))}
          <p className="lf-msg-note">New referrals also ring the front desk and text the referral line. Press 1 on the call to accept.</p>
        </aside>
        <section className="lf-ib-detail">
          <header>
            <div><b>{r.name} <span className="lf-pill lf-pill-verified">{r.lang}</span></b><span>Referred by {r.firm}</span></div>
            {r.state === 'new' && <span className="lf-ib-timer"><span className="lf-ring"><i /></span>{mm(r.left)} to accept</span>}
          </header>
          <div className="lf-ib-facts">
            <span><small>Injury</small>{r.injury}</span>
            <span><small>Coverage</small>{r.cov}</span>
            <span><small>Packet</small><span className="lf-file">PDF</span> Intake · ER note · dec page</span>
          </div>
          {r.state === 'new' && (
            <div className="lf-ib-actions">
              <button type="button" className="lf-btn-mini" onClick={() => patch(r.id, { state: 'accepted' })}>Accept referral</button>
              <button type="button" className="lf-btn-mini lf-btn-ghost" onClick={() => patch(r.id, { state: 'expired' })}>Decline</button>
              <span>If nobody accepts in the hour, it moves to the next verified match.</span>
            </div>
          )}
          {r.state === 'accepted' && (
            <div className="lf-ib-offer">
              <b>Offer up to three first-visit times</b>
              <div className="lf-ib-slots">{SLOTS.map((s) => <button type="button" key={s} className={chosen.includes(s) ? 'is-on' : ''} onClick={() => toggle(s)}>{s}</button>)}</div>
              <button type="button" className="lf-btn-mini" disabled={!chosen.length} onClick={offer}>Text {chosen.length || ''} time{chosen.length === 1 ? '' : 's'} to {r.name}</button>
            </div>
          )}
          {r.state === 'offered' && <div className="lf-feed-row is-wait"><span className="lf-dot" /><span>Texted {chosen.join(' · ')}. Waiting for {r.name} to reply 1, 2 or 3…</span></div>}
          {r.state === 'booked' && <div className="lf-feed-row is-in"><span className="lf-dot lf-dot-green" /><span><b>{r.name}</b> booked <b>{r.picked}</b> by text. On your calendar, and on the firm’s.</span><span className="lf-pill lf-pill-soft">Confirmed</span></div>}
          {r.state === 'expired' && <div className="lf-feed-row is-wait"><span className="lf-dot" /><span>Declined. The referral moved to the next verified practice.</span><button type="button" className="lf-btn-mini lf-btn-ghost" onClick={() => patch(r.id, { state: 'new', left: 3600 })}>Undo</button></div>}
        </section>
      </div>
    </div>
  );
}
