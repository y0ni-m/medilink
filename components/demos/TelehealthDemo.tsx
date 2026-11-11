'use client';

import { useEffect, useRef, useState } from 'react';

// A playable video visit: live captions in the language each side picks,
// a guest invite by email or text, and the record (transcript + recording)
// that lands on the visit when it ends. Mirrors VideoVisitPage.

const LANGS = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Español' }, { code: 'pt', label: 'Português' }, { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' }, { code: 'it', label: 'Italiano' }, { code: 'hi', label: 'हिन्दी' }, { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' }, { code: 'zh', label: '中文' },
];

type Line = { who: 'dr' | 'pt'; en: string; es: string; pt: string; fr: string };
const SCRIPT: Line[] = [
  { who: 'dr', en: 'Good afternoon, Camila. How has the neck pain been since Monday?', es: 'Buenas tardes, Camila. ¿Cómo ha estado el dolor de cuello desde el lunes?', pt: 'Boa tarde, Camila. Como está a dor no pescoço desde segunda?', fr: 'Bonjour Camila. Comment va la douleur au cou depuis lundi ?' },
  { who: 'pt', en: 'Better in the morning, but it comes back after work. Maybe a six out of ten.', es: 'Mejor por la mañana, pero vuelve después del trabajo. Quizás un seis de diez.', pt: 'Melhor de manhã, mas volta depois do trabalho. Talvez seis de dez.', fr: 'Mieux le matin, mais ça revient après le travail. Peut-être six sur dix.' },
  { who: 'dr', en: 'Any numbness or tingling down the arm?', es: '¿Algún entumecimiento u hormigueo en el brazo?', pt: 'Alguma dormência ou formigamento no braço?', fr: 'Des engourdissements ou des picotements dans le bras ?' },
  { who: 'pt', en: 'No, just the stiffness.', es: 'No, solo la rigidez.', pt: 'Não, só a rigidez.', fr: 'Non, juste la raideur.' },
  { who: 'dr', en: 'Good. We will keep the therapy twice a week and I am ordering the cervical MRI the attorney asked about.', es: 'Bien. Seguiremos con la terapia dos veces por semana y voy a pedir la resonancia cervical que preguntó el abogado.', pt: 'Ótimo. Manteremos a terapia duas vezes por semana e vou pedir a ressonância cervical que o advogado perguntou.', fr: 'Bien. On garde la thérapie deux fois par semaine et je prescris l’IRM cervicale demandée par l’avocat.' },
];
const text = (l: Line, lang: string) => (lang === 'es' ? l.es : lang === 'pt' ? l.pt : lang === 'fr' ? l.fr : l.en);

export default function TelehealthDemo({ active = true }: { active?: boolean }) {
  const [state, setState] = useState<'lobby' | 'live' | 'ended'>('lobby');
  const [lang, setLang] = useState('en');
  const [n, setN] = useState(0);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cam, setCam] = useState(true);
  const [guest, setGuest] = useState('');
  const [invited, setInvited] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (active && state === 'lobby') timers.current.push(window.setTimeout(() => setState('live'), 900)); }, [active, state]);
  useEffect(() => {
    if (state !== 'live') return;
    const tick = window.setInterval(() => setSecs((s) => s + 1), 1000);
    const lines = window.setInterval(() => setN((k) => (k < SCRIPT.length ? k + 1 : k)), 2600);
    return () => { window.clearInterval(tick); window.clearInterval(lines); };
  }, [state]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'); const ss = String(secs % 60).padStart(2, '0');
  const shown = SCRIPT.slice(Math.max(0, n - 2), n);
  const supported = ['en', 'es', 'pt', 'fr'].includes(lang);

  return (
    <div className="lf-demo lf-demo-tele">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Telehealth · Camila Restrepo · follow-up</span>
        <span className="lf-demo-hint">{state === 'live' ? `Live · ${mm}:${ss}` : state === 'ended' ? 'Visit saved' : 'Connecting…'}</span>
      </div>
      {state !== 'ended' ? (
        <div className="lf-tv-grid">
          <div className="lf-tv-stage">
            <div className={`lf-tv-tile lf-tv-main ${!cam ? 'is-off' : ''}`}>
              <img src="/photos/maya_patient.jpg" alt="" />
              <span className="lf-tv-name">Camila Restrepo</span>
              {!cam && <span className="lf-tv-off">Camera off</span>}
            </div>
            <div className="lf-tv-tile lf-tv-self"><img src="/photos/doctor.jpg" alt="" /><span className="lf-tv-name">Dr. Reyes {muted ? '· muted' : ''}</span></div>
            <div className="lf-tv-caps" aria-live="polite">
              {shown.map((l, i) => <p key={i} className={l.who === 'dr' ? 'is-dr' : ''}><b>{l.who === 'dr' ? 'Dr. Reyes' : 'Camila'}</b>{supported ? text(l, lang) : l.en}</p>)}
              {!shown.length && <p className="is-wait">Captions start as soon as someone speaks…</p>}
            </div>
            <div className="lf-tv-bar">
              <button type="button" className={muted ? 'is-off' : ''} onClick={() => setMuted((m) => !m)}>{muted ? 'Unmute' : 'Mute'}</button>
              <button type="button" className={!cam ? 'is-off' : ''} onClick={() => setCam((c) => !c)}>{cam ? 'Camera off' : 'Camera on'}</button>
              <label className="lf-tv-lang">Captions in
                <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Caption language">
                  {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>
              <button type="button" className="is-end" onClick={() => setState('ended')}>End visit</button>
            </div>
          </div>
          <aside className="lf-tv-side">
            <b>Each side picks a language</b>
            <p>Dr. Reyes hears English. Camila reads {LANGS.find((l) => l.code === lang)?.label}. Live captions and translation run for both, in the browser, no app.</p>
            {!supported && <p className="lf-tv-note">The sample script is written in four languages. In the product, captions translate into all ten.</p>}
            <b>Invite anyone to the visit</b>
            <form className="lf-tv-invite" onSubmit={(e) => { e.preventDefault(); if (guest.trim()) { setInvited(guest.trim()); setGuest(''); } }}>
              <input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Email or mobile number" aria-label="Guest email or phone" />
              <button type="submit" className="lf-btn-mini" disabled={!guest.trim()}>Send link</button>
            </form>
            {invited && <p className="lf-tv-sent">✓ Visit link sent to {invited}. It opens in their browser, no account needed. The attorney, an interpreter or a family member can join the same way.</p>}
            <b>What is saved</b>
            <ul>
              <li>Transcript, with each speaker labeled</li>
              <li>Recording, with the patient’s consent</li>
              <li>Both filed on the appointment and the case</li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="lf-tv-done">
          <div className="lf-tv-done-card">
            <span className="lf-pill lf-pill-soft">✓ Visit saved</span>
            <b>Camila Restrepo · follow-up · {mm}:{ss}</b>
            <span>Dr. Maya Reyes · captions English / {LANGS.find((l) => l.code === lang)?.label}</span>
            <div className="lf-tv-files">
              <span><span className="lf-file">TXT</span>Transcript · {Math.max(1, n)} lines, speakers labeled</span>
              <span><span className="lf-file">MP4</span>Recording · {mm}:{ss}</span>
              <span><span className="lf-file">PDF</span>Visit note · MRI cervical ordered</span>
            </div>
            <p>Filed on the Nov 12 appointment and on Camila’s case. The firm sees it on the timeline the moment it lands.</p>
            <button type="button" className="lf-btn-mini" onClick={() => { setState('lobby'); setN(0); setSecs(0); setInvited(null); }}>Run it again</button>
          </div>
        </div>
      )}
    </div>
  );
}
