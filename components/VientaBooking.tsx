'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackMeta } from '@/lib/track';

// Custom booking calendar on top of the Vienta public API (see BOOKING_API.md).
// No iframe, no SDK — just fetch calls, styled to match the site.
const BASE = 'https://crm-backend-production-b582.up.railway.app';
const HANDLE = 'medilink';
const LINK = 'book-a-demo';
const API = `${BASE}/api/public/book/${HANDLE}/${LINK}`;

type LinkDetails = {
  title: string;
  description?: string;
  duration_minutes?: number;
  location_type?: string;
  min_notice_hours?: number;
  max_days_ahead?: number;
  host_name?: string;
};

type Slot = { start: string; end: string; display: string };

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function VientaBooking() {
  const [details, setDetails] = useState<LinkDetails | null>(null);
  const today = useMemo(() => atMidnight(new Date()), []);
  const tz = useMemo(
    () => (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York'),
    []
  );

  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [date, setDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsMsg, setSlotsMsg] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'booking' | 'done'>('idle');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<{ display: string; dateLabel: string; video?: string } | null>(null);

  const maxDays = details?.max_days_ahead ?? 30;
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + maxDays);
    return d;
  }, [today, maxDays]);

  // load link details
  useEffect(() => {
    let alive = true;
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.success) setDetails(d.booking_link);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const pickDate = async (d: Date) => {
    setDate(d);
    setSlot(null);
    setSlots(null);
    setSlotsMsg('');
    setLoadingSlots(true);
    try {
      const r = await fetch(`${API}/slots?date=${ymd(d)}`).then((res) => res.json());
      if (r?.slots?.length) {
        setSlots(r.slots);
      } else {
        setSlots([]);
        setSlotsMsg(r?.message || 'No times available that day.');
      }
    } catch {
      setSlots([]);
      setSlotsMsg('Couldn’t load times — please try again.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setStatus('booking');
    setError('');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.name,
          client_email: form.email,
          client_phone: form.phone,
          client_notes: form.notes,
          website: form.website, // honeypot — stays empty for humans
          start_time: slot.start,
          timezone: tz,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setBooking({
          display: slot.display,
          dateLabel: date ? `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` : '',
          video: data.booking?.video_link,
        });
        setStatus('done');
        // Confirmed booking is the conversion Meta optimises against.
        trackMeta('Lead', { content_name: 'demo_booking', content_category: 'demo' });
      } else if (res.status === 409) {
        setError('That time was just taken — please pick another.');
        setStatus('idle');
        if (date) pickDate(date);
      } else if (res.status === 429) {
        setError('Too many requests — please try again in a little while.');
        setStatus('idle');
      } else {
        setError(data?.error || 'Something went wrong — please try again.');
        setStatus('idle');
      }
    } catch {
      setError('Network error — please try again.');
      setStatus('idle');
    }
  };

  // ----- confirmation -----
  if (status === 'done' && booking) {
    return (
      <div className="vb vb-confirm" aria-live="polite">
        <span className="vb-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3>You’re booked, {form.name.split(' ')[0] || 'there'}!</h3>
        <p className="vb-confirm-when">{booking.dateLabel} · {booking.display}</p>
        <p className="vb-confirm-sub">
          A confirmation and calendar invite are on the way to <strong>{form.email}</strong>.
        </p>
        {booking.video && (
          <a className="vb-video" href={booking.video} target="_blank" rel="noopener noreferrer">
            Join the video call
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        )}
      </div>
    );
  }

  // ----- calendar grid -----
  const first = new Date(view.y, view.m, 1);
  const lead = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const canPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());
  const canNext =
    view.y < maxDate.getFullYear() || (view.y === maxDate.getFullYear() && view.m < maxDate.getMonth());
  const shift = (n: number) => {
    const d = new Date(view.y, view.m + n, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div className="vb">
      <div className="vb-grid-layout">
        {/* Calendar */}
        <div className="vb-cal">
          <div className="vb-cal-head">
            <button className="vb-nav" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">‹</button>
            <span className="vb-month">{MONTHS[view.m]} {view.y}</span>
            <button className="vb-nav" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">›</button>
          </div>
          <div className="vb-dow">
            {DOW.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="vb-days">
            {cells.map((d, i) => {
              if (!d) return <span key={i} className="vb-day vb-day-empty" />;
              const disabled = d < today || d > maxDate;
              const isSel = date ? sameDay(d, date) : false;
              const isToday = sameDay(d, today);
              return (
                <button
                  key={i}
                  className={`vb-day ${isSel ? 'is-sel' : ''} ${isToday ? 'is-today' : ''}`}
                  disabled={disabled}
                  onClick={() => pickDate(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Times / form */}
        <div className="vb-panel">
          {!date && (
            <div className="vb-empty">
              <span className="vb-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </span>
              <p>Pick a day to see available times.</p>
              {details?.duration_minutes && <span className="vb-dur">{details.duration_minutes}-minute video call</span>}
            </div>
          )}

          {date && !slot && (
            <>
              <div className="vb-panel-head">{MONTHS[date.getMonth()]} {date.getDate()}</div>
              {loadingSlots && <p className="vb-note">Loading times…</p>}
              {!loadingSlots && slots && slots.length > 0 && (
                <div className="vb-slots">
                  {slots.map((s) => (
                    <button key={s.start} className="vb-slot" onClick={() => setSlot(s)}>{s.display}</button>
                  ))}
                </div>
              )}
              {!loadingSlots && slots && slots.length === 0 && <p className="vb-note">{slotsMsg}</p>}
            </>
          )}

          {date && slot && (
            <form className="vb-form" onSubmit={submit}>
              <div className="vb-selected">
                <span>{MONTHS[date.getMonth()]} {date.getDate()} · {slot.display}</span>
                <button type="button" className="vb-change" onClick={() => setSlot(null)}>Change</button>
              </div>
              <input className="vb-input" placeholder="Full name" value={form.name} required
                onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              <input className="vb-input" type="email" placeholder="Email" value={form.email} required
                onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              <input className="vb-input" type="tel" placeholder="Phone" value={form.phone} required
                onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
              <textarea className="vb-input vb-textarea" placeholder="Anything we should know? (optional)" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} aria-hidden="true" autoComplete="off"
                value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                style={{ position: 'absolute', left: '-9999px' }} />
              {error && <p className="vb-error">{error}</p>}
              <button className="vb-submit" type="submit" disabled={status === 'booking'}>
                {status === 'booking' ? 'Booking…' : 'Confirm booking'}
                {status !== 'booking' && <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
