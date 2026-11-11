'use client';

import { useEffect, useRef, useState } from 'react';

// Mirrors the real Messages tab: a thread list, a thread pinned to a record
// (referral, case, contact), teammates and partner practices in one place,
// and firms introducing themselves to a practice. The other side answers with
// scripted replies so a visitor can hold a short conversation.

type Who = 'me' | 'them' | 'system';
type Msg = { who: Who; name?: string; org?: string; text: string; file?: string; at: string };
type Thread = {
  id: string; title: string; sub: string; context?: string; kind: 'context' | 'team' | 'intro' | 'dm';
  unread?: number; msgs: Msg[]; replies: string[]; introState?: 'pending' | 'accepted' | 'declined';
};

const FIRM = 'Harbor & Stone Injury Law';
const CLINIC = 'Bayside Spine & Injury';

function seed(role: 'firm' | 'clinic'): Thread[] {
  const me = role === 'firm' ? FIRM : CLINIC;
  const them = role === 'firm' ? CLINIC : FIRM;
  const meName = role === 'firm' ? 'Alex Harper' : 'Maya Reyes';
  const themName = role === 'firm' ? 'Maya Reyes' : 'Alex Harper';
  return [
    {
      id: 'camila', title: 'Camila Restrepo · referral', sub: `${themName} · ${them}`, context: 'Pinned to the referral', kind: 'context', unread: 1,
      msgs: [
        { who: 'system', text: 'This conversation is pinned to Camila Restrepo’s referral. Anyone on it can open the record.', at: 'Mon' },
        { who: role === 'firm' ? 'them' : 'me', name: role === 'firm' ? themName : meName, org: role === 'firm' ? them : me, text: 'Camila came in for visit 1 today. Neck and low back, X-ray ordered. Initial eval is attached.', file: 'Initial evaluation · 6 pages', at: '2:40 PM' },
        { who: role === 'firm' ? 'me' : 'them', name: role === 'firm' ? meName : themName, org: role === 'firm' ? me : them, text: 'Thanks. Can you flag when the MD sees her for the EMC determination? PIP is capped at $2,500 until then.', at: '2:52 PM' },
      ],
      replies: role === 'firm'
        ? ['Of course. The MD evaluation is set for Thursday the 23rd, I will post the determination here the same day.', 'Will do. Her next adjustment is Monday at 10:30 and she confirmed by text.', 'Records go out five business days after each visit, through the referral so you get the notification.']
        : ['Perfect, thank you. The adjuster has already asked twice.', 'Great. Please attach the determination to the case when it is signed.', 'That works. I will stop calling the office line for status.'],
    },
    {
      id: 'team', title: 'Records turnaround for Harbor referrals', sub: 'Alex Harper, Priya Patel, Marcus Lee', kind: 'team',
      msgs: [
        { who: 'them', name: 'Alex Harper', org: FIRM, text: 'Team, can we agree on a records turnaround for Harbor referrals? We are getting asked by carriers within 10 days of the first visit.', at: 'Nov 4' },
        { who: 'them', name: 'Marcus Lee', org: CLINIC, text: 'Confirmed. Five business days, delivered through the referral in MediLink so you get the notification.', at: 'Nov 5' },
        { who: 'them', name: 'Priya Patel', org: FIRM, text: 'That works for us. I will stop emailing the office line for status then.', at: 'Nov 5' },
      ],
      replies: ['Noted, thanks.', 'Marcus here: Rosa Delgado’s records from last week are going out today, a day early.'],
    },
    {
      id: 'intro', title: role === 'firm' ? 'Introduction · Summit Spine & Rehab' : `Introduction · ${FIRM}`, sub: role === 'firm' ? 'You introduced your firm' : 'A firm wants to refer to you', kind: 'intro', introState: role === 'firm' ? 'accepted' : 'pending', unread: role === 'clinic' ? 1 : 0,
      msgs: role === 'firm'
        ? [{ who: 'me', name: meName, org: me, text: 'Hi, we are a PI firm in Orlando with about 40 active MVA clients. We would like to refer patients who need ortho follow-ups. Do you accept LOPs?', at: 'Nov 3' }, { who: 'them', name: 'Dr. Elena Vasquez', org: 'Summit Spine & Rehab', text: 'Welcome. We do, and we offer first-visit times within the week. Send the first one whenever you are ready.', at: 'Nov 3' }]
        : [{ who: 'them', name: 'Alex Harper', org: FIRM, text: 'Hi, we are a PI firm in Orlando with about 40 active MVA clients. We would like to refer patients who need chiropractic care in Kissimmee. Do you accept PIP and LOPs?', at: 'Today' }],
      replies: role === 'firm' ? ['Great, the first referral is on its way through the concierge.'] : ['Thank you. Our first referral will come through the concierge this week.'],
    },
  ];
}

export default function MessagingDemo({ role = 'firm' }: { role?: 'firm' | 'clinic' }) {
  const [threads, setThreads] = useState<Thread[]>(() => seed(role));
  const [openId, setOpenId] = useState('camila');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const replyIdx = useRef<Record<string, number>>({});
  const timers = useRef<number[]>([]);
  const pane = useRef<HTMLDivElement>(null);
  const t = threads.find((x) => x.id === openId)!;
  const meName = role === 'firm' ? 'Alex Harper' : 'Maya Reyes';
  const meOrg = role === 'firm' ? FIRM : CLINIC;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { pane.current?.scrollTo({ top: pane.current.scrollHeight, behavior: 'smooth' }); }, [t.msgs.length, typing, openId]);

  const open = (id: string) => { setOpenId(id); setThreads((all) => all.map((x) => (x.id === id ? { ...x, unread: 0 } : x))); };
  const push = (id: string, m: Msg) => setThreads((all) => all.map((x) => (x.id === id ? { ...x, msgs: [...x.msgs, m] } : x)));
  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim(); if (!text) return;
    push(t.id, { who: 'me', name: meName, org: meOrg, text, at: 'now' }); setDraft('');
    const n = replyIdx.current[t.id] || 0;
    const reply = t.replies[n % t.replies.length]; replyIdx.current[t.id] = n + 1;
    const id = t.id; const themName = t.kind === 'team' ? 'Marcus Lee' : role === 'firm' ? (t.kind === 'intro' ? 'Dr. Elena Vasquez' : 'Maya Reyes') : 'Alex Harper';
    const themOrg = t.kind === 'team' ? CLINIC : role === 'firm' ? (t.kind === 'intro' ? 'Summit Spine & Rehab' : CLINIC) : FIRM;
    timers.current.push(window.setTimeout(() => setTyping(true), 500));
    timers.current.push(window.setTimeout(() => { setTyping(false); push(id, { who: 'them', name: themName, org: themOrg, text: reply, at: 'now' }); }, 1900 + Math.min(1800, reply.length * 12)));
  };
  const decide = (state: 'accepted' | 'declined') => setThreads((all) => all.map((x) => (x.id === 'intro' ? { ...x, introState: state, msgs: [...x.msgs, { who: 'system', text: state === 'accepted' ? `You accepted. ${FIRM} can now message your practice and refer through the concierge.` : 'You declined. The firm cannot message this practice unless an admin reopens it.', at: 'now' }] } : x)));

  return (
    <div className="lf-demo lf-demo-msg">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Messages</span>
        <span className="lf-demo-hint">Reply in the thread. The other side answers.</span>
      </div>
      <div className="lf-msg-grid">
        <aside className="lf-msg-list">
          <div className="lf-msg-list-head"><b>Messages</b><span className="lf-btn-mini">+ New</span></div>
          <input readOnly placeholder="Search people, subjects, cases" />
          {threads.map((x) => (
            <button type="button" key={x.id} className={x.id === openId ? 'is-on' : ''} onClick={() => open(x.id)}>
              <span className={`lf-msg-av lf-msg-av-${x.kind}`}>{x.kind === 'team' ? '👥' : x.kind === 'intro' ? '✦' : x.title[0]}</span>
              <span className="lf-msg-list-body"><b>{x.title}</b><small>{x.msgs[x.msgs.length - 1].text}</small></span>
              {x.unread ? <i className="lf-msg-unread">{x.unread}</i> : null}
            </button>
          ))}
          <p className="lf-msg-note">Messages stay inside MediLink. Teammates and partner practices get an email nudge if they have not read a message within a few minutes.</p>
        </aside>
        <section className="lf-msg-thread">
          <header>
            <div><b>{t.title}</b><span>{t.sub}</span></div>
            {t.context && <span className="lf-pill lf-pill-verified">{t.context} · Open record</span>}
          </header>
          <div className="lf-msg-pane" ref={pane}>
            {t.msgs.map((m, i) => m.who === 'system' ? (
              <p key={i} className="lf-msg-sys">{m.text}</p>
            ) : (
              <div key={i} className={`lf-msg-row ${m.who === 'me' ? 'is-me' : ''}`}>
                {m.who !== 'me' && <span className="lf-msg-who">{m.name} · {m.org}</span>}
                <span className="lf-msg-bubble">{m.text}{m.file && <span className="lf-msg-file"><span className="lf-file">PDF</span>{m.file}</span>}</span>
                <span className="lf-msg-at">{m.at}</span>
              </div>
            ))}
            {typing && <div className="lf-msg-row"><span className="lf-msg-bubble lf-msg-typing"><i /><i /><i /></span></div>}
          </div>
          {t.kind === 'intro' && t.introState === 'pending' ? (
            <div className="lf-msg-decide">
              <span>{FIRM} wants to refer patients to your practice.</span>
              <button type="button" className="lf-btn-mini" onClick={() => decide('accepted')}>Accept introduction</button>
              <button type="button" className="lf-btn-mini lf-btn-ghost" onClick={() => decide('declined')}>Decline</button>
            </div>
          ) : (
            <form className="lf-msg-compose" onSubmit={send}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message. Enter sends." aria-label="Message" disabled={t.introState === 'declined'} />
              <button type="submit" className="lf-btn-mini" disabled={!draft.trim() || t.introState === 'declined'}>Send</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
