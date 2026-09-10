'use client';

import { useState } from 'react';
import { trackMeta } from '@/lib/track';

/**
 * Inline capture for the /for/* landing pages.
 *
 * These pages sent paid traffic straight to app.medilink.vip/register, an
 * offsite jump that leaves no trace when someone doesn't complete it — the
 * /demo page lost 636 visitors that way before it had a form. Signing up is
 * still the goal, so the register link is what the success state offers; the
 * difference is that an abandoned signup is now a lead worth calling.
 */
export default function AudienceSignup({
  slug,
  label,
  isLegal,
  compact = false,
  callHref,
}: {
  slug: string;
  label: string;
  isLegal: boolean;
  /** Hero placement: three fields inline, no panel chrome. */
  compact?: boolean;
  callHref?: string;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', state: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  /** The ads are UTM-tagged; without reading them back a signup is only
   *  attributable to a page, never to the creative that paid for it. */
  const attribution = () => {
    if (typeof window === 'undefined') return {};
    const q = new URLSearchParams(window.location.search);
    const pick = (k: string) => q.get(k) || undefined;
    return {
      page: window.location.pathname,
      utm_source: pick('utm_source'),
      utm_medium: pick('utm_medium'),
      utm_campaign: pick('utm_campaign'),
      utm_content: pick('utm_content'),
      fbclid: pick('fbclid'),
      referrer: document.referrer || undefined,
    };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // honeypot
    setError('');
    setStatus('saving');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          practice_type: slug,
          notes: `${isLegal ? 'Firm' : 'Practice'}: ${form.org} · State: ${form.state}`,
          website: form.website,
          attribution: attribution(),
        }),
      });
      if (!res.ok) {
        setError('Could not save your details — please try again.');
        setStatus('idle');
        return;
      }
      trackMeta('Lead', { content_name: `${slug}_signup`, content_category: slug });
      setStatus('done');
    } catch {
      setError('Network error — please try again.');
      setStatus('idle');
    }
  };

  if (compact) {
    if (status === 'done') {
      return (
        <div className="aus-hero aus-hero-done">
          <p>Thanks — you&apos;re on the list.</p>
          <a className="aus-submit" href="https://app.medilink.vip/register">
            Create your free account
          </a>
        </div>
      );
    }
    return (
      <form className="aus-hero" onSubmit={submit}>
        <div className="aus-hero-row">
          <input className="aus-input" placeholder="Full name" required autoComplete="name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="aus-input" type="email" placeholder="Work email" required autoComplete="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="aus-input" type="tel" placeholder="Phone" required autoComplete="tel"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button className="aus-submit" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : isLegal ? 'Get matched' : 'Get referrals'}
          </button>
        </div>
        <input type="text" name="website" tabIndex={-1} aria-hidden="true" autoComplete="off"
          value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
          style={{ position: 'absolute', left: '-9999px' }} />
        {error && <p className="aus-error">{error}</p>}
        <p className="aus-fine aus-fine-left">
          {isLegal ? 'Free for law firms. No card required.' : 'Free to join. Takes 30 seconds.'}
          {callHref && <> · <a href={callHref}>or call our team</a></>}
        </p>
      </form>
    );
  }

  if (status === 'done') {
    return (
      <section className="aus">
        <div className="aus-inner aus-done">
          <h2>Thanks, {form.name.split(' ')[0] || 'there'} — you&apos;re on the list.</h2>
          <p>Create your account now and you can {isLegal ? 'refer your first case' : 'take your first referral'} today.</p>
          <a className="aus-submit" href="https://app.medilink.vip/register">
            Create your free account
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="aus">
      <div className="aus-inner">
        <div className="aus-copy">
          <span className="aus-eyebrow">{isLegal ? 'Free for law firms' : `For ${label.toLowerCase()}`}</span>
          <h2>{isLegal ? 'Start referring cases.' : 'Start receiving referrals.'}</h2>
          <p>
            {isLegal
              ? 'No card required — MediLink is funded by its clinic partners. Tell us where you practise and we will match you to verified clinics that accept LOP.'
              : 'Tell us where you are and what you treat. We will match accident cases to your capacity and coverage area.'}
          </p>
        </div>
        <form className="aus-form" onSubmit={submit}>
          <input className="aus-input" placeholder="Full name" required autoComplete="name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="aus-input" type="email" placeholder="Work email" required autoComplete="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="aus-input" type="tel" placeholder="Phone" required autoComplete="tel"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="aus-input" placeholder={isLegal ? 'Firm name' : 'Practice name'} required
            value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
          <select className="aus-input" required value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}>
            <option value="" disabled>State</option>
            <option value="Florida">Florida</option>
            <option value="Texas">Texas</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="website" tabIndex={-1} aria-hidden="true" autoComplete="off"
            value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
            style={{ position: 'absolute', left: '-9999px' }} />
          {error && <p className="aus-error">{error}</p>}
          <button className="aus-submit" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : isLegal ? 'Get matched — free' : 'Get referrals'}
          </button>
          <p className="aus-fine">Takes 30 seconds. No card required.</p>
        </form>
      </div>
    </section>
  );
}
