'use client';

import { useEffect, useRef, useState } from 'react';

// The patient's intake form on their phone: fields the clinic's template
// asks for, a real signature pad (draw with a mouse or finger), then the
// signed PDF with its audit trail, filed on the visit. Mirrors form signing.

export default function SignDemo() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [inked, setInked] = useState(false);
  const [done, setDone] = useState<null | { at: string; hash: string }>(null);
  const [consent, setConsent] = useState(true);
  const [pain, setPain] = useState(6);

  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1; const r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    const x = c.getContext('2d')!; x.scale(dpr, dpr); x.lineWidth = 2.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#0B0B14';
  }, []);
  const pos = (e: React.PointerEvent) => { const r = canvas.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  const down = (e: React.PointerEvent) => { if (done) return; drawing.current = true; const x = canvas.current!.getContext('2d')!; const [px, py] = pos(e); x.beginPath(); x.moveTo(px, py); canvas.current!.setPointerCapture(e.pointerId); };
  const move = (e: React.PointerEvent) => { if (!drawing.current) return; const x = canvas.current!.getContext('2d')!; const [px, py] = pos(e); x.lineTo(px, py); x.stroke(); setInked(true); };
  const up = () => { drawing.current = false; };
  const clear = () => { const c = canvas.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); setInked(false); };
  const sign = () => {
    const h = Array.from({ length: 16 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setDone({ at: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), hash: h });
  };

  return (
    <div className="lf-demo lf-demo-sign">
      <div className="lf-demo-bar"><span className="lf-demo-title">Forms · New patient intake</span><span className="lf-demo-hint">{done ? 'Signed and filed' : 'Sign with your mouse or finger'}</span></div>
      <div className="lf-sg-grid">
        <div className="lf-phone lf-phone-form">
          <div className="lf-phone-notch" />
          <b className="lf-sg-title">Bayside Spine &amp; Injury · New patient intake</b>
          <span className="lf-sg-sub">Appointment Wed, Nov 12 · 2:15 PM · auto-filled</span>
          <label>Full name<input readOnly value="Camila Restrepo" /></label>
          <label>Date of injury<input readOnly value="11/03/2026" /></label>
          <label>Pain today · <b>{pain}/10</b><input type="range" min={0} max={10} value={pain} onChange={(e) => setPain(+e.target.value)} disabled={!!done} /></label>
          <label className="lf-sg-check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={!!done} />I consent to treatment and to sharing records with my attorney.</label>
          <span className="lf-sg-label">Signature</span>
          <div className={`lf-sg-pad ${done ? 'is-done' : ''}`}>
            <canvas ref={canvas} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} aria-label="Signature pad" />
            {!inked && !done && <span className="lf-sg-hint">Sign here</span>}
            {done && <span className="lf-sg-stamp">✓ Signed {done.at}</span>}
          </div>
          {!done ? (
            <div className="lf-sg-actions">
              <button type="button" className="lf-btn-mini lf-btn-ghost" onClick={clear} disabled={!inked}>Clear</button>
              <button type="button" className="lf-btn-mini" onClick={sign} disabled={!inked || !consent}>Sign and submit</button>
            </div>
          ) : (
            <button type="button" className="lf-phone-reset" onClick={() => { setDone(null); clear(); }}>Start over</button>
          )}
        </div>
        <aside className="lf-sg-side">
          <b>What the clinic gets</b>
          {done ? (
            <div className="lf-sg-doc">
              <span className="lf-file">PDF</span>
              <div><b>New patient intake · Camila Restrepo</b><small>Signed {done.at} · 3 pages · filed on the Nov 12 visit</small><small>Audit: IP, device, time, SHA-256 {done.hash}…</small></div>
            </div>
          ) : (
            <p className="lf-msg-note">The signed PDF, with the appointment date filled in and a tamper-evident hash, lands under Completed and on the visit. The firm can open it from the case.</p>
          )}
          <ul className="lf-sg-list">
            <li>Upload your own intake PDFs as e-sign templates</li>
            <li>Or build questionnaires in the form builder</li>
            <li>Patients sign from the text link, no app, no login</li>
            <li>Completed forms file themselves on the visit</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
