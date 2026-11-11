'use client';

import { useEffect, useRef, useState } from 'react';

const WINDOW = 60 * 60; // the clinic's one-hour window, in seconds

/**
 * The clinic's side of the hour. A text and a call go out the moment the
 * referral is sent; the window counts down for real. The visitor accepts the
 * way a clinic does: press 1 on the call, reply to the text, or tap in the app.
 */
export default function AcceptDemo({ active = true }: { active?: boolean }) {
  const [left, setLeft] = useState(WINDOW);
  const [accepted, setAccepted] = useState<null | 'call' | 'text' | 'app'>(null);
  const [ringing, setRinging] = useState(false);
  const t = useRef<number>(0);

  useEffect(() => {
    if (!active || accepted) return;
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    t.current = window.setTimeout(() => setRinging(true), 1800);
    return () => { window.clearInterval(id); window.clearTimeout(t.current); };
  }, [active, accepted]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const reset = () => { setAccepted(null); setLeft(WINDOW); setRinging(false); };

  return (
    <div className="lf-demo lf-demo-accept">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Bayside Spine &amp; Injury · front desk</span>
        <span className="lf-demo-hint">{accepted ? 'Accepted' : 'Accept on the call, by text, or in the app'}</span>
      </div>
      <div className="lf-ac-grid">
        <div className="lf-phone lf-phone-clinic">
          <div className="lf-phone-notch" />
          <div className="lf-sms lf-sms-in is-in">
            <b>MediLink</b> · New referral from Harbor &amp; Stone Injury Law<br />
            Camila R. · rear-end MVA 11/03 · PIP on file · Spanish-speaking<br />
            Reply <b>1</b> to accept. Packet: medilink.vip/r/4m8k · <b>{mm}:{ss}</b> left
          </div>
          {accepted === 'text' && <div className="lf-sms lf-sms-out is-in">1</div>}
          {ringing && !accepted && (
            <div className="lf-incoming is-in">
              <span className="lf-call-ring">
                <i /><i />
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5.2 2.3 3.4 2c-.5-.1-1 .2-1.2.7-.3 1-.4 2 .1 3.5.9 2.9 3.6 5.6 6.5 6.5 1.5.5 2.5.4 3.5.1.5-.2.8-.7.7-1.2l-.3-1.8c-.1-.4-.4-.7-.8-.8l-1.9-.4c-.4-.1-.8.1-1 .4l-.4.6C7.9 8.7 7.3 8.1 6.4 6.5l.6-.4c.3-.2.5-.6.4-1l-.4-1.9c-.1-.4-.4-.7-.8-.8Z" fill="#fff" stroke="#fff" strokeWidth="0.6" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="lf-call-body">
                <b>Incoming call · MediLink</b>
                <span>“A new referral from Harbor &amp; Stone. Press 1 to accept.”</span>
              </div>
              <button type="button" className="lf-call-key" onClick={() => setAccepted('call')}>1</button>
            </div>
          )}
          {accepted && (
            <div className="lf-sms lf-sms-in lf-sms-confirm is-in">
              ✓ Accepted {accepted === 'call' ? 'on the call' : accepted === 'text' ? 'by text' : 'in the app'}. Offer Camila up to three first-visit times.
            </div>
          )}
          <div className="lf-phone-keys">
            {!accepted ? (
              <div className="lf-phone-quick">
                <button type="button" onClick={() => setAccepted('text')}>1</button>
                <span className="lf-phone-quick-note">reply to the text</span>
                <button type="button" className="lf-phone-link" onClick={() => setAccepted('app')}>accept in the app</button>
              </div>
            ) : (
              <button type="button" className="lf-phone-reset" onClick={reset}>Run it again</button>
            )}
          </div>
        </div>

        <div className="lf-ac-side">
          <div className={`lf-ac-timer ${accepted ? 'is-done' : ''}`}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="52" className="lf-ac-track" />
              <circle cx="60" cy="60" r="52" className="lf-ac-arc" style={{ strokeDashoffset: 327 * (1 - left / WINDOW) }} />
            </svg>
            <div className="lf-ac-timer-text">
              {accepted ? <><b>✓</b><span>accepted</span></> : <><b>{mm}:{ss}</b><span>to accept</span></>}
            </div>
          </div>
          <ul className="lf-ac-steps">
            <li className="is-on"><i />Text sent to the clinic’s referral line</li>
            <li className={ringing || accepted ? 'is-on' : ''}><i />Phone call · press 1 accepts</li>
            <li className={accepted ? 'is-on' : ''}><i />Packet opened: intake, dec page, ER note</li>
            <li className={accepted ? 'is-on' : ''}><i />Your firm is notified the second it’s accepted</li>
          </ul>
          <p className="lf-ac-note">If nobody accepts inside the hour, the referral moves to the next verified match. Nothing waits on a callback.</p>
        </div>
      </div>
    </div>
  );
}
