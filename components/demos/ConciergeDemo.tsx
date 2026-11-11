'use client';

import { useEffect, useRef, useState } from 'react';
import { matchPractices, parsePrompt, type Parsed, type Practice } from './practices';

const PRESETS = [
  'Spanish-speaking chiro near Kissimmee, rear-end MVA last Tuesday, PIP on file, first visit this week',
  'MRI of the neck near Tampa this week, client is on a LOP',
  'Client in Fort Lauderdale needs an ortho follow-up but can’t travel',
];

type Stage = 'idle' | 'typing' | 'reading' | 'results';
type SendState = { id: string; at: number; accepted: boolean } | null;

function chipsFor(p: Parsed) {
  const chips: string[] = [];
  chips.push(p.type || 'Chiropractic');
  chips.push(`Near ${p.city || 'Kissimmee'}`);
  if (p.language) chips.push(`${p.language}-speaking`);
  for (const c of p.coverage || []) chips.push(c);
  if (p.soon) chips.push('This week');
  return chips;
}

/**
 * A working miniature of the referral concierge. Pick a prompt or type your
 * own; the sentence is parsed into filters, the sample network is searched
 * (distances are real geometry), and you can send a referral and watch the
 * clinic accept inside its one-hour window.
 */
export default function ConciergeDemo({ autoplay = true, onBooked }: { autoplay?: boolean; onBooked?: () => void }) {
  const [text, setText] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [results, setResults] = useState<{ practice: Practice; miles: number }[]>([]);
  const [sent, setSent] = useState<SendState>(null);
  const [touched, setTouched] = useState(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const run = (prompt: string) => {
    clear();
    setSent(null); setResults([]); setParsed(null);
    const p = parsePrompt(prompt);
    setStage('reading');
    later(() => setParsed(p), 700);
    later(() => { setResults(matchPractices(p)); setStage('results'); }, 1500);
  };

  // Types a preset into the box character by character, then runs it.
  const typeIn = (prompt: string) => {
    clear();
    setStage('typing'); setText(''); setResults([]); setParsed(null); setSent(null);
    let i = 0;
    const tick = () => {
      i += 4;
      setText(prompt.slice(0, i));
      if (i < prompt.length) timers.current.push(window.setTimeout(tick, 36)); // ~28 renders/s, not 55
      else later(() => run(prompt), 250);
    };
    tick();
  };

  // Auto-run the first sample once the demo is active and the visitor has not
  // touched it. Keyed on state, not a ref, so React's dev double-mount cannot
  // swallow the kick-off.
  useEffect(() => {
    if (!autoplay || touched || stage !== 'idle') return;
    const t = window.setTimeout(() => typeIn(PRESETS[0]), 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, touched, stage]);
  useEffect(() => clear, []);

  const send = (id: string) => {
    setSent({ id, at: Date.now(), accepted: false });
    later(() => { setSent((s) => (s && s.id === id ? { ...s, accepted: true } : s)); }, 2600);
  };

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim()) { setTouched(true); run(text.trim()); } };

  return (
    <div className="lf-demo lf-demo-concierge">
      <div className="lf-demo-bar">
        <span className="lf-demo-title"><i className="lf-spark" />Referral concierge</span>
        <span className="lf-demo-hint">Try it: pick a prompt or type your own</span>
      </div>

      <form className="lf-cg-form" onSubmit={submit}>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setTouched(true); }}
          onFocus={() => { clear(); if (stage === 'typing') setStage('idle'); }}
          placeholder="I need a chiro near Little Havana who speaks Spanish, this week…"
          rows={2}
          aria-label="Describe what your client needs"
        />
        <button type="submit" className="lf-cg-go" disabled={!text.trim() || stage === 'reading'}>
          {stage === 'reading' ? 'Reading…' : 'Find providers'}
        </button>
      </form>

      <div className="lf-cg-presets">
        {PRESETS.map((p, i) => (
          <button type="button" key={i} onClick={() => { setTouched(true); typeIn(p); }} className={text === p ? 'is-on' : ''}>
            {p.length > 54 ? p.slice(0, 52) + '…' : p}
          </button>
        ))}
      </div>

      {stage !== 'idle' && stage !== 'typing' && (
        <div className="lf-cg-body">
          <div className="lf-cg-reading">
            <span className="lf-progress"><i className={stage === 'results' ? 'is-done' : ''} /></span>
            <span>{stage === 'results' ? 'Understood, matched against the network' : 'Reading the request and the case file…'}</span>
          </div>

          {parsed && (
            <div className="lf-chips">
              {chipsFor(parsed).map((c) => <span key={c}>{c}</span>)}
            </div>
          )}

          {stage === 'results' && (
            <div className="lf-cg-results">
              <p className="lf-cg-count">{results.length} provider{results.length === 1 ? '' : 's'} from the sample network, closest first.</p>
              {results.map(({ practice: r, miles }, i) => {
                const isSent = sent?.id === r.id;
                return (
                  <div className={`lf-cg-row ${isSent ? 'is-sent' : ''}`} key={r.id} style={{ animationDelay: `${i * 120}ms` }}>
                    <span className="lf-cg-avatar">{r.name[0]}</span>
                    <div className="lf-cg-info">
                      <b>{r.name} <span className="lf-pill lf-pill-soft">Accepts {r.accepts.join(' · ')}</span></b>
                      <span>{r.type}{r.statewide ? ' · video visits anywhere in FL' : ` · ${r.city}, FL · ${miles < 1 ? 'under 1' : miles.toFixed(1)} mi`} · {r.languages.join(' · ')}</span>
                      <span className="lf-cg-open"><i className="lf-dot lf-dot-green" />Next opening {r.nextOpening}</span>
                    </div>
                    {!isSent ? (
                      <button type="button" className="lf-btn-mini" onClick={() => send(r.id)} disabled={!!sent}>Send referral</button>
                    ) : sent?.accepted ? (
                      <span className="lf-cg-accepted">✓ Accepted in 6 min</span>
                    ) : (
                      <span className="lf-cg-sent"><span className="lf-ring"><i /></span>Sent · 1 hour to accept</span>
                    )}
                  </div>
                );
              })}
              {sent?.accepted && (
                <div className="lf-cg-next">
                  <span>The clinic is offering first-visit times. Your client books by text.</span>
                  {onBooked && <button type="button" onClick={onBooked}>Watch the booking →</button>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {!touched && stage === 'typing' && <p className="lf-demo-foot">Typing a sample request…</p>}
    </div>
  );
}
