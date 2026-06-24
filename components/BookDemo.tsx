'use client';

import { useState, type KeyboardEvent } from 'react';

// Simplest possible "send to email": FormSubmit.co — no backend, no API key.
// You POST the fields and it emails them. NOTE: the very first submission
// triggers a one-time activation email to this address; click it once and all
// future submissions land in the inbox.
const ENDPOINT = 'https://formsubmit.co/ajax/info@medilink.vip';

type Field = {
  key: 'role' | 'name' | 'email' | 'org';
  q: string;
  type: 'choice' | 'text' | 'email';
  placeholder?: string;
  choices?: string[];
};

const STEPS: Field[] = [
  { key: 'role', q: 'First — who are you?', type: 'choice', choices: ['Attorney / Law firm', 'Clinic / Provider', 'Something else'] },
  { key: 'name', q: 'Nice to meet you. What’s your name?', type: 'text', placeholder: 'Jane Doe' },
  { key: 'email', q: 'Where should we send your demo invite?', type: 'email', placeholder: 'you@firm.com' },
  { key: 'org', q: 'Last one — your firm or clinic name?', type: 'text', placeholder: 'Acme Injury Law' },
];

type Answers = Record<Field['key'], string>;

export default function BookDemo() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ role: '', name: '', email: '', org: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const cur = STEPS[step];
  const total = STEPS.length;
  const value = a[cur.key];

  const valid = (() => {
    const v = value.trim();
    if (!v) return false;
    if (cur.type === 'email') return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    return true;
  })();

  const set = (val: string) => setA((p) => ({ ...p, [cur.key]: val }));

  const submit = async (answers: Answers) => {
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Demo request — ${answers.role}: ${answers.org}`,
          _template: 'table',
          _captcha: 'false',
          _honey: '',
          Role: answers.role,
          Name: answers.name,
          Email: answers.email,
          Organization: answers.org,
        }),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const advance = (answers: Answers) => {
    if (step < total - 1) setStep(step + 1);
    else submit(answers);
  };

  const next = () => {
    if (!valid) return;
    advance(a);
  };

  const choose = (val: string) => {
    const answers = { ...a, [cur.key]: val };
    setA(answers);
    advance(answers);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      next();
    }
  };

  if (status === 'done') {
    return (
      <div className="demo demo-final" aria-live="polite">
        <span className="demo-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3>You’re on the list, {a.name.split(' ')[0] || 'there'}.</h3>
        <p>We’ll reach out at <strong>{a.email}</strong> to set up your MediLink demo.</p>
      </div>
    );
  }

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-eyebrow">
          <span className="demo-eyebrow-dot" />
          Book a demo
        </span>
        <div className="demo-progress" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`demo-dot ${i <= step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="demo-body">
        <span className="demo-count">{String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <h3 className="demo-q">{cur.q}</h3>

        {cur.type === 'choice' ? (
          <div className="demo-choices">
            {cur.choices!.map((c) => (
              <button key={c} type="button" className={`demo-choice ${value === c ? 'is-active' : ''}`} onClick={() => choose(c)}>
                {c}
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            ))}
          </div>
        ) : (
          <input
            className="demo-input"
            type={cur.type === 'email' ? 'email' : 'text'}
            inputMode={cur.type === 'email' ? 'email' : 'text'}
            placeholder={cur.placeholder}
            value={value}
            onChange={(e) => set(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            autoComplete={cur.key === 'email' ? 'email' : cur.key === 'name' ? 'name' : 'organization'}
          />
        )}
      </div>

      {cur.type !== 'choice' && (
        <div className="demo-actions">
          {step > 0 ? (
            <button type="button" className="demo-back" onClick={() => setStep((s) => Math.max(0, s - 1))}>← Back</button>
          ) : <span />}
          <button type="button" className="demo-next" onClick={next} disabled={!valid || status === 'sending'}>
            {status === 'sending' ? 'Sending…' : step === total - 1 ? 'Book my demo' : 'Continue'}
            {status !== 'sending' && <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="demo-error">Couldn’t send — email <a href="mailto:info@medilink.vip">info@medilink.vip</a> and we’ll set it up.</p>
      )}
    </div>
  );
}
