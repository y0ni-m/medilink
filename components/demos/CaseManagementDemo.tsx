'use client';

import { useState } from 'react';

// Mirrors the real Cases workspace: the same statuses, tabs and coverage
// objects the app uses (src/components/cases). Three sample clients; the
// visitor opens one, moves it through the pipeline, works the coverage, and
// sees the documents and visits that flow in from the clinic.

const STATUSES = ['intake', 'treatment', 'demand', 'negotiation', 'litigation', 'settled'] as const;
type Status = (typeof STATUSES)[number];
const LABEL: Record<Status, string> = { intake: 'Intake', treatment: 'In treatment', demand: 'Demand', negotiation: 'Negotiation', litigation: 'In litigation', settled: 'Settled' };

type Doc = { name: string; from: string; pages: number; day: string; signed?: boolean };
type Visit = { day: string; what: string; attended: boolean; bill: number };
type Case = {
  id: string; name: string; initials: string; dob: string; doi: string; type: string; status: Status;
  clinic: string; pipLimit: number; pipUsed: number; emc: 'determined' | 'pending' | 'n/a'; lop: 'signed' | 'on exhaust' | 'none';
  visits: Visit[]; docs: Doc[]; alerts: string[];
};

const CASES: Case[] = [
  {
    id: 'PI-0010405', name: 'Rosa Delgado', initials: 'RD', dob: '09/03/1978', doi: '06/03/2026', type: 'Premises', status: 'negotiation',
    clinic: 'Summit Spine & Rehab', pipLimit: 0, pipUsed: 0, emc: 'n/a', lop: 'signed',
    visits: [
      { day: 'Jun 5', what: 'Initial evaluation', attended: true, bill: 420 }, { day: 'Jun 12', what: 'MRI · lumbar', attended: true, bill: 1450 },
      { day: 'Jun 19', what: 'Ortho consult', attended: true, bill: 650 }, { day: 'Jul 3', what: 'Injection · L4-L5', attended: true, bill: 2200 },
      { day: 'Jul 24', what: 'Follow-up', attended: true, bill: 260 }, { day: 'Aug 14', what: 'Re-evaluation', attended: false, bill: 0 },
    ],
    docs: [
      { name: 'Initial evaluation', from: 'Summit Spine & Rehab', pages: 6, day: 'Jun 6', signed: true }, { name: 'MRI report · lumbar', from: 'Advanced Imaging of Tampa', pages: 4, day: 'Jun 13' },
      { name: 'Ortho consult note', from: 'Summit Spine & Rehab', pages: 5, day: 'Jun 20', signed: true }, { name: 'Procedure note · ESI', from: 'Summit Spine & Rehab', pages: 3, day: 'Jul 3', signed: true },
      { name: 'Itemized bill · to date', from: 'Summit Spine & Rehab', pages: 2, day: 'Aug 1' }, { name: 'Demand package', from: 'Your office', pages: 48, day: 'Aug 20' },
    ],
    alerts: ['Missed re-evaluation on Aug 14 · clinic re-offered times'],
  },
  {
    id: 'PI-0010404', name: 'Jordan Smith', initials: 'JS', dob: '04/11/1991', doi: '10/11/2026', type: 'MVA', status: 'treatment',
    clinic: 'Bayside Spine & Injury', pipLimit: 10000, pipUsed: 4120, emc: 'determined', lop: 'on exhaust',
    visits: [
      { day: 'Oct 13', what: 'Initial evaluation', attended: true, bill: 420 }, { day: 'Oct 16', what: 'Adjustment · therapy', attended: true, bill: 180 },
      { day: 'Oct 20', what: 'Adjustment · therapy', attended: true, bill: 180 }, { day: 'Oct 23', what: 'MD evaluation · EMC', attended: true, bill: 310 },
      { day: 'Oct 27', what: 'MRI · cervical', attended: true, bill: 1450 }, { day: 'Nov 3', what: 'Adjustment · therapy', attended: true, bill: 180 },
      { day: 'Nov 6', what: 'Adjustment · therapy', attended: true, bill: 180 }, { day: 'Nov 11', what: 'Adjustment · therapy', attended: false, bill: 0 },
    ],
    docs: [
      { name: 'Initial evaluation', from: 'Bayside Spine & Injury', pages: 6, day: 'Oct 14', signed: true }, { name: 'EMC determination', from: 'Bayside Spine & Injury', pages: 2, day: 'Oct 23', signed: true },
      { name: 'MRI report · cervical', from: 'Advanced Imaging of Tampa', pages: 4, day: 'Oct 28' }, { name: 'PIP log · $4,120 billed', from: 'MediLink', pages: 1, day: 'Nov 6' },
    ],
    alerts: ['PIP · $5,880 left · LOP takes over on exhaust'],
  },
  {
    id: 'PI-0010406', name: 'Devon Brooks', initials: 'DB', dob: '01/27/1996', doi: '10/29/2026', type: 'MVA', status: 'intake',
    clinic: 'Bayside Spine & Injury', pipLimit: 10000, pipUsed: 840, emc: 'pending', lop: 'none',
    visits: [{ day: 'Nov 1', what: 'Initial evaluation', attended: true, bill: 420 }, { day: 'Nov 4', what: 'Adjustment · therapy', attended: true, bill: 180 }, { day: 'Nov 7', what: 'Adjustment · therapy', attended: true, bill: 240 }],
    docs: [{ name: 'Initial evaluation', from: 'Bayside Spine & Injury', pages: 6, day: 'Nov 2', signed: true }, { name: 'PIP dec page', from: 'Your office', pages: 1, day: 'Oct 30' }],
    alerts: ['Emergency Medical Condition not yet determined · only $2,500 of PIP available until an MD/DO decides'],
  },
];

const TABS = ['Overview', 'Treatment', 'Documents', 'Timeline'] as const;
const money = (n: number) => `$${n.toLocaleString()}`;

export default function CaseManagementDemo() {
  const [cases, setCases] = useState<Case[]>(CASES);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const [filter, setFilter] = useState<'open' | 'closed'>('open');
  const c = cases.find((x) => x.id === openId) || null;

  const patch = (id: string, fn: (x: Case) => Case) => setCases((all) => all.map((x) => (x.id === id ? fn(x) : x)));
  const setStatus = (id: string, status: Status) => patch(id, (x) => ({ ...x, status }));
  const determineEmc = (id: string) => patch(id, (x) => ({ ...x, emc: 'determined', alerts: x.alerts.filter((a) => !/Emergency Medical/.test(a)), docs: [{ name: 'EMC determination', from: x.clinic, pages: 2, day: 'Today', signed: true }, ...x.docs] }));
  const signLop = (id: string) => patch(id, (x) => ({ ...x, lop: 'signed', docs: [{ name: 'Letter of protection · signed', from: 'Your office', pages: 2, day: 'Today', signed: true }, ...x.docs] }));

  return (
    <div className="lf-demo lf-demo-cm">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">{c ? <><button type="button" className="lf-cm-back" onClick={() => setOpenId(null)}>← Cases</button> {c.name}</> : 'Cases'}</span>
        <span className="lf-demo-hint">{c ? 'Change the status, work the coverage' : 'Open a client'}</span>
      </div>

      {!c ? (
        <div className="lf-cm-list">
          <div className="lf-cm-list-head">
            <div>
              <b>Cases</b>
              <span>Every matter and where it stands. PIP, MVA, premises or any PI case. One client can have more than one.</span>
            </div>
            <span className="lf-btn-mini">+ New case</span>
          </div>
          <div className="lf-cm-filters">
            <button type="button" className={filter === 'open' ? 'is-on' : ''} onClick={() => setFilter('open')}>Open cases</button>
            <button type="button" className={filter === 'closed' ? 'is-on' : ''} onClick={() => setFilter('closed')}>Closed</button>
            <input readOnly placeholder="Search by client or case number…" />
          </div>
          <table className="lf-cm-table">
            <thead><tr><th>Client</th><th>Status</th><th>Quick links</th><th>Date of injury</th><th>Case</th><th /></tr></thead>
            <tbody>
              {filter === 'open' ? cases.map((x) => {
                const billed = x.visits.reduce((s, v) => s + v.bill, 0);
                const attended = x.visits.filter((v) => v.attended).length;
                const next = x.visits.find((v) => !v.attended);
                return (
                  <tr key={x.id} onClick={() => { setOpenId(x.id); setTab('Overview'); }}>
                    <td><span className="lf-cm-avatar">{x.initials}</span><div><b>{x.name}</b><small>{x.id}</small></div></td>
                    <td>
                      <span className={`lf-cm-status is-${x.status}`}>{LABEL[x.status]}</span>
                      <small>{attended} visits · {money(billed)} billed{next ? ` · next ${next.day}` : ''}</small>
                      {x.alerts[0] && <small className="lf-cm-alert">{x.alerts[0]}</small>}
                      <small className="lf-cm-newdoc">↓ New documents loaded</small>
                    </td>
                    <td><span className="lf-cm-link">Find a provider</span></td>
                    <td>{x.doi}</td>
                    <td><span className="lf-cm-type">{x.type}</span><small>{x.pipLimit ? `PIP · ${money(x.pipLimit - x.pipUsed)} left` : 'LOP'}</small></td>
                    <td className="lf-cm-actions"><span>Open</span></td>
                  </tr>
                );
              }) : <tr><td colSpan={6} className="lf-cm-empty">No closed cases yet. Settled matters land here.</td></tr>}
            </tbody>
          </table>
          <span className="lf-cm-count">{filter === 'open' ? cases.length : 0} cases total</span>
        </div>
      ) : (
        <div className="lf-cm-detail">
          <div className="lf-cm-detail-head">
            <div>
              <span className="lf-cm-detail-name">{c.name} <span className={`lf-cm-status is-${c.status}`}>{LABEL[c.status]}</span></span>
              <span className="lf-cm-detail-meta">{c.id} · {c.type} · DOI {c.doi} · DOB {c.dob} · {c.clinic}</span>
            </div>
            <div className="lf-cm-detail-actions">
              <span className="lf-btn-mini lf-btn-ghost">Message</span>
              <span className="lf-btn-mini">Find a provider</span>
            </div>
          </div>

          <ol className="lf-cm-pipe" aria-label="Case status">
            {STATUSES.map((s, i) => {
              const cur = STATUSES.indexOf(c.status);
              return (
                <li key={s} className={i < cur ? 'is-done' : i === cur ? 'is-now' : ''}>
                  <button type="button" onClick={() => setStatus(c.id, s)}><i />{LABEL[s]}</button>
                </li>
              );
            })}
          </ol>

          <div className="lf-cm-tabs" role="tablist">
            {TABS.map((t) => <button type="button" role="tab" aria-selected={tab === t} key={t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>{t}{t === 'Documents' ? ` · ${c.docs.length}` : ''}</button>)}
          </div>

          {tab === 'Overview' && (
            <div className="lf-cm-grid">
              <div className="lf-cm-card">
                <b>Coverage path</b>
                {c.pipLimit ? (
                  <>
                    <div className="lf-cov-step is-now">PIP <small>{money(c.pipLimit - c.pipUsed)} of {money(c.pipLimit)} left</small><i className="lf-cov-bar"><b style={{ width: `${(c.pipUsed / c.pipLimit) * 100}%` }} /></i></div>
                    <div className={`lf-cov-step ${c.emc === 'determined' ? 'is-done' : ''}`}>EMC <small>{c.emc === 'determined' ? 'determined · full $10,000 available' : 'pending · capped at $2,500 until determined'}</small></div>
                    <div className={`lf-cov-step ${c.lop === 'signed' ? 'is-done' : ''}`}>LOP <small>{c.lop === 'signed' ? 'signed · covers what PIP will not' : c.lop === 'on exhaust' ? 'takes over on exhaust' : 'not yet'}</small></div>
                    <div className="lf-cm-card-actions">
                      {c.emc !== 'determined' && <button type="button" className="lf-btn-mini" onClick={() => determineEmc(c.id)}>Record EMC determination</button>}
                      {c.lop !== 'signed' && <button type="button" className="lf-btn-mini lf-btn-ghost" onClick={() => signLop(c.id)}>Send LOP for signature</button>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lf-cov-step is-done">LOP <small>signed · clinic treats on protection</small></div>
                    <div className="lf-cov-step">Health <small>none on file</small></div>
                    <span className="lf-cm-note">Premises case: no PIP, treatment runs on the letter of protection from day one.</span>
                  </>
                )}
              </div>
              <div className="lf-cm-card">
                <b>Alerts</b>
                {c.alerts.length ? c.alerts.map((a) => <span key={a} className="lf-cm-alert-row">{a}</span>) : <span className="lf-cm-note">Nothing needs your attention.</span>}
                <b className="lf-cm-sub">Totals</b>
                <div className="lf-cm-totals">
                  <span><strong>{c.visits.filter((v) => v.attended).length}</strong>visits attended</span>
                  <span><strong>{money(c.visits.reduce((s, v) => s + v.bill, 0))}</strong>billed to date</span>
                  <span><strong>{c.docs.reduce((s, d) => s + d.pages, 0)}</strong>record pages</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'Treatment' && (
            <ul className="lf-cm-visits">
              {c.visits.map((v) => (
                <li key={v.day + v.what} className={v.attended ? 'is-done' : 'is-missed'}>
                  <span className="lf-cm-visit-day">{v.day}</span>
                  <span className="lf-cm-visit-what">{v.what}</span>
                  <span className={`lf-pill ${v.attended ? 'lf-pill-soft' : 'lf-pill-warn'}`}>{v.attended ? 'Attended' : 'No-show'}</span>
                  <span className="lf-cm-visit-bill">{v.bill ? money(v.bill) : '—'}</span>
                </li>
              ))}
              <li className="lf-cm-visits-foot">Attendance and bills post from the clinic’s calendar. Nothing to request.</li>
            </ul>
          )}

          {tab === 'Documents' && (
            <ul className="lf-cm-docs">
              {c.docs.map((d) => (
                <li key={d.name + d.day}>
                  <span className="lf-file">PDF</span>
                  <span className="lf-cm-doc-name">{d.name}<small>{d.from} · {d.pages} pages · {d.day}</small></span>
                  {d.signed && <span className="lf-pill lf-pill-verified">✓ Signed</span>}
                  <span className="lf-cm-doc-open">Open</span>
                </li>
              ))}
              <li className="lf-cm-visits-foot">Export everything as one demand-ready package.</li>
            </ul>
          )}

          {tab === 'Timeline' && (
            <ol className="lf-cm-tl">
              {[...c.docs.map((d) => ({ day: d.day, text: `${d.name} received from ${d.from}` })), ...c.visits.map((v) => ({ day: v.day, text: `${v.what} · ${v.attended ? 'attended' : 'no-show'}` }))]
                .slice(0, 8)
                .map((e, i) => <li key={i}><span>{e.day}</span>{e.text}</li>)}
              <li><span>{c.doi}</span>Referred from your office · packet sent</li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
