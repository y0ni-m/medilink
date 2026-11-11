'use client';

import { useState } from 'react';

const DAYS = [
  { d: 'Mon', n: 10 }, { d: 'Tue', n: 11 }, { d: 'Wed', n: 12 }, { d: 'Thu', n: 13 }, { d: 'Fri', n: 14 },
];
// Three first-visit times the clinic offered, placed on the week grid.
const OFFERS = [
  { k: 1, day: 1, row: 0, label: '10:30', text: 'Tue, Nov 11 at 10:30 AM' },
  { k: 2, day: 2, row: 1, label: '2:15', text: 'Wed, Nov 12 at 2:15 PM' },
  { k: 3, day: 3, row: 2, label: '9:00', text: 'Thu, Nov 13 at 9:00 AM' },
];
const BUSY = new Set(['0-1', '4-2', '0-2', '3-0']);

/**
 * The booking step, playable. The clinic offered three times; the visitor
 * answers the text (tap 1, 2 or 3, or type it) and sees the slot lock on the
 * clinic's week and the confirmation land on the firm's side.
 */
export default function ScheduleDemo() {
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [tapLink, setTapLink] = useState(false);

  const choose = (k: number) => { setPicked(k); setTyped(String(k)); };
  const reset = () => { setPicked(null); setTyped(''); setTapLink(false); };
  const chosen = OFFERS.find((o) => o.k === picked);

  return (
    <div className="lf-demo lf-demo-sched">
      <div className="lf-demo-bar">
        <span className="lf-demo-title">Scheduling</span>
        <span className="lf-demo-hint">{picked ? 'Booked. Try another time.' : 'Reply 1, 2 or 3 on the phone'}</span>
      </div>

      <div className="lf-sd-grid">
        <div className="lf-cal">
          <div className="lf-cal-head">
            <span>Bayside Spine &amp; Injury · first visit</span>
            <span className="lf-cal-week">Nov 10–14</span>
          </div>
          <div className="lf-cal-grid">
            {DAYS.map((day, di) => (
              <div className="lf-cal-col" key={day.d}>
                <span className="lf-cal-day">{day.d}<b>{day.n}</b></span>
                {[0, 1, 2].map((row) => {
                  const offer = OFFERS.find((o) => o.day === di && o.row === row);
                  const busy = BUSY.has(`${di}-${row}`);
                  const won = offer && picked === offer.k;
                  const lost = offer && picked && picked !== offer.k;
                  return (
                    <button
                      type="button"
                      key={row}
                      className={`lf-slot ${busy ? 'lf-slot-busy' : ''} ${offer ? 'lf-slot-offer' : ''} ${won ? 'lf-slot-won' : ''} ${lost ? 'lf-slot-lost' : ''}`}
                      onClick={() => offer && choose(offer.k)}
                      disabled={!offer}
                      aria-label={offer ? `Book ${offer.text}` : undefined}
                    >
                      {offer ? <><small>{offer.k}</small>{offer.label}</> : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="lf-phone">
          <div className="lf-phone-notch" />
          <div className="lf-sms lf-sms-in is-in">
            Bayside Spine &amp; Injury can see you this week:<br />
            {OFFERS.map((o) => <span key={o.k}><b>{o.k}</b> {o.text.replace(', Nov', '')}<br /></span>)}
            Reply 1, 2 or 3 to book, or tap medilink.vip/b/7k2q
          </div>
          {picked && <div className="lf-sms lf-sms-out is-in">{picked}</div>}
          {picked && chosen && (
            <div className="lf-sms lf-sms-in lf-sms-confirm is-in">
              ✓ Booked: {chosen.text}<br />
              <span>1024 Osceola Pkwy, Kissimmee. Bring your ID.</span>
            </div>
          )}
          <div className="lf-phone-keys">
            {!picked ? (
              <>
                <form className="lf-phone-reply" onSubmit={(e) => { e.preventDefault(); const k = Number(typed); if ([1, 2, 3].includes(k)) choose(k); }}>
                  <input value={typed} onChange={(e) => setTyped(e.target.value.replace(/[^1-3]/g, '').slice(0, 1))} inputMode="numeric" placeholder="Reply…" aria-label="Reply with 1, 2 or 3" />
                  <button type="submit" disabled={!typed}>Send</button>
                </form>
                <div className="lf-phone-quick">
                  {OFFERS.map((o) => <button type="button" key={o.k} onClick={() => choose(o.k)}>{o.k}</button>)}
                  <button type="button" className="lf-phone-link" onClick={() => { setTapLink(true); choose(2); }}>tap the link</button>
                </div>
              </>
            ) : (
              <button type="button" className="lf-phone-reset" onClick={reset}>Start over</button>
            )}
          </div>
        </div>
      </div>

      <div className={`lf-feed-row ${picked ? 'is-in' : 'is-wait'}`}>
        <span className={`lf-dot ${picked ? 'lf-dot-green' : ''}`} />
        {picked && chosen ? (
          <span><b>Camila Restrepo</b> · first visit confirmed · {chosen.text}{tapLink ? ' · booked from the link' : ' · by text'}</span>
        ) : (
          <span>Your firm’s calendar: waiting for the client to pick a time</span>
        )}
        {picked && <span className="lf-pill lf-pill-soft">On your calendar</span>}
      </div>
    </div>
  );
}
