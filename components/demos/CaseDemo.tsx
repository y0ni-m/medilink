'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const DAYS = 60;
const PIP_LIMIT = 10000;

type Ev = { day: number; title: string; sub: string; bill?: number; pages?: number; kind: 'referral' | 'visit' | 'records' | 'coverage' | 'milestone' };

const EVENTS: Ev[] = [
  { day: 0, title: 'Referred by your office', sub: 'Packet sent with the PIP dec page · concierge match', kind: 'referral' },
  { day: 0, title: 'Bayside Spine & Injury accepted', sub: '6 minutes later · three first-visit times offered', kind: 'referral' },
  { day: 2, title: 'Visit 1 attended', sub: 'Exam · X-ray ordered', bill: 420, kind: 'visit' },
  { day: 5, title: 'Visit 2 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 6, title: 'Records received', sub: 'Initial evaluation · signed', pages: 6, kind: 'records' },
  { day: 9, title: 'Visit 3 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 12, title: 'Visit 4 attended', sub: 'MD evaluation', bill: 310, kind: 'visit' },
  { day: 13, title: 'EMC determined', sub: 'Emergency Medical Condition on file · full PIP limit available', kind: 'coverage' },
  { day: 16, title: 'Visit 5 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 19, title: 'Visit 6 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 20, title: 'Records received', sub: 'MD evaluation · X-ray report', pages: 9, kind: 'records' },
  { day: 23, title: 'MRI completed', sub: 'Advanced Imaging of Tampa · cervical spine', bill: 1450, kind: 'visit' },
  { day: 26, title: 'Visit 7 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 30, title: 'Visit 8 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 31, title: 'Records received', sub: 'MRI report', pages: 4, kind: 'records' },
  { day: 34, title: 'Visit 9 attended', sub: 'Re-evaluation', bill: 260, kind: 'visit' },
  { day: 38, title: 'Ortho consult', sub: 'Summit Spine & Rehab · referred from the file', bill: 650, kind: 'visit' },
  { day: 42, title: 'Visit 10 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 45, title: 'Visit 11 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 47, title: 'Records received', sub: 'Ortho consult note · 5 pages', pages: 5, kind: 'records' },
  { day: 49, title: 'Visit 12 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 52, title: 'Visit 13 attended', sub: 'Adjustment · therapy', bill: 180, kind: 'visit' },
  { day: 55, title: 'Treatment plan complete', sub: 'Discharge summary requested', kind: 'milestone' },
  { day: 58, title: 'Records received', sub: 'Discharge summary · final bill', pages: 7, kind: 'records' },
  { day: 60, title: 'Demand-ready file', sub: 'Bills, records and the coverage path in one export', kind: 'milestone' },
];

/**
 * A case timeline you can scrub. Drag the day slider (it plays by itself
 * first) and watch visits, bills and records accrue, PIP drain, the EMC
 * determination land, and the file become demand-ready.
 */
export default function CaseDemo({ autoplay = true }: { autoplay?: boolean }) {
  const [day, setDay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);
  const started = useRef(false);
  useEffect(() => {
    if (autoplay && !started.current) { started.current = true; setPlaying(true); }
  }, [autoplay]);

  useEffect(() => {
    if (!playing) return;
    const step = (t: number) => {
      if (!last.current) last.current = t;
      const dt = (t - last.current) / 1000;
      if (dt < 0.08) { raf.current = requestAnimationFrame(step); return; } // ~12 updates/s is plenty for a day counter
      last.current = t;
      setDay((d) => {
        const n = Math.min(DAYS, d + dt * 7); // 7 case-days per second
        if (n >= DAYS) setPlaying(false);
        return n;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf.current); last.current = 0; };
  }, [playing]);

  const d = Math.floor(day);
  const seen = useMemo(() => EVENTS.filter((e) => e.day <= d), [d]);
  const billed = seen.reduce((s, e) => s + (e.bill || 0), 0);
  const pages = seen.reduce((s, e) => s + (e.pages || 0), 0);
  const visits = seen.filter((e) => e.kind === 'visit').length;
  const emc = seen.some((e) => e.kind === 'coverage');
  const pipUsed = Math.min(PIP_LIMIT, billed);
  const pipLeft = PIP_LIMIT - pipUsed;
  const lopActive = billed > PIP_LIMIT;
  const lopAmount = Math.max(0, billed - PIP_LIMIT);
  const status = d >= 60 ? 'Demand' : d >= 55 ? 'Discharged' : visits ? 'In treatment' : 'Accepted';
  const latest = seen[seen.length - 1];

  return (
    <div className="lf-demo lf-demo-case">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Case · Camila Restrepo</span>
        <span className="lf-demo-actions">
          <span className="lf-demo-hint">Drag the timeline</span>
          {!playing && d < DAYS && <button type="button" className="lf-cd-play" onClick={() => setPlaying(true)}>Play</button>}
          {playing && <button type="button" className="lf-cd-play" onClick={() => setPlaying(false)}>Pause</button>}
          {d >= DAYS && <button type="button" className="lf-cd-play" onClick={() => { setDay(0); setPlaying(true); }}>Replay</button>}
        </span>
      </div>

      <div className="lf-cd-head">
        <div>
          <span className="lf-cd-name">Camila Restrepo <span className={`lf-pill ${d >= 60 ? 'lf-pill-ink' : 'lf-pill-teal'}`}>{status}</span></span>
          <span className="lf-cd-meta">Rear-end MVA · DOL 11/03 · Bayside Spine &amp; Injury</span>
        </div>
        <div className="lf-cd-stats">
          <span><b>{visits}</b>visits</span>
          <span><b>${billed.toLocaleString()}</b>billed</span>
          <span><b>{pages}</b>record pages</span>
        </div>
      </div>

      <div className="lf-cd-scrub">
        <input type="range" min={0} max={DAYS} step={0.5} value={day} aria-label="Day of the case"
          onChange={(e) => { setPlaying(false); setDay(Number(e.target.value)); }} />
        <div className="lf-cd-scrub-labels">
          <span>Referred</span><span className="lf-cd-day">Day {d}</span><span>Demand</span>
        </div>
      </div>

      <div className="lf-cov">
        <span className={`lf-cov-step ${pipLeft === 0 ? 'is-done' : 'is-now'}`}>
          PIP <small>${pipLeft.toLocaleString()} left</small>
          <i className="lf-cov-bar"><b style={{ width: `${(pipUsed / PIP_LIMIT) * 100}%` }} /></i>
        </span>
        <i className="lf-cov-line" />
        <span className={`lf-cov-step ${emc ? 'is-done' : ''}`}>EMC <small>{emc ? 'determined day 13' : 'pending'}</small></span>
        <i className="lf-cov-line" />
        <span className={`lf-cov-step ${lopActive ? 'is-now' : ''}`}>LOP <small>{lopActive ? `$${lopAmount.toLocaleString()} on protection` : 'on exhaust'}</small></span>
      </div>

      <ol className="lf-cd-events" aria-live="polite">
        {[...seen].reverse().slice(0, 5).map((e, i) => (
          <li key={`${e.day}-${e.title}`} className={`is-${e.kind} ${i === 0 && e === latest ? 'is-latest' : ''}`}>
            <span className="lf-cd-ev-day">D{e.day}</span>
            <div>
              <b>{e.title}</b>
              <span>{e.sub}{e.bill ? ` · $${e.bill.toLocaleString()}` : ''}{e.pages ? ` · ${e.pages} pages` : ''}</span>
            </div>
            {e.kind === 'records' && <span className="lf-file">PDF</span>}
          </li>
        ))}
        {!seen.length && <li className="is-empty"><div><b>Nothing yet</b><span>Drag the slider or press play.</span></div></li>}
      </ol>
    </div>
  );
}
