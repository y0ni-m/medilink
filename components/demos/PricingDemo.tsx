'use client';

import { useState } from 'react';

// Per-location pricing, the rule the app bills by: $2,500 per location per
// month for every practice, $1,000 for chiropractic outside the 12 PIP /
// no-fault states. 14-day trial, no card. Extra offices bill only once they
// receive a case. Law firms are free.

const PIP = new Set(['FL', 'HI', 'KS', 'MA', 'MI', 'MN', 'NJ', 'NY', 'ND', 'UT', 'DE', 'OR']);
const STATES = ['FL', 'TX', 'GA', 'NY', 'NJ', 'CA', 'MI', 'LA', 'NC', 'AZ', 'NV', 'MN', 'IL', 'PA', 'OH'];
const TYPES = [['chiropractic', 'Chiropractic'], ['ortho', 'Orthopedics'], ['mri_imaging', 'MRI / Imaging'], ['surgery_center', 'Surgery center'], ['hospital', 'Hospital'], ['plastic_surgery', 'Plastic surgery'], ['other', 'Pain management / other']] as const;
const money = (n: number) => `$${n.toLocaleString()}`;

export default function PricingDemo() {
  const [state, setState] = useState('FL');
  const [type, setType] = useState<(typeof TYPES)[number][0]>('chiropractic');
  const [locs, setLocs] = useState(2);
  const [withCase, setWithCase] = useState(1);
  const rate = type === 'chiropractic' && !PIP.has(state) ? 1000 : 2500;
  const billed = Math.min(withCase, locs);
  const monthly = rate * billed;
  return (
    <div className="lf-demo lf-demo-price">
      <div className="lf-demo-bar"><span className="lf-demo-title">What would it cost?</span><span className="lf-demo-hint">Per location · billed only once a location has a case</span></div>
      <div className="lf-pr-grid">
        <div className="lf-pr-form">
          <label>State<select value={state} onChange={(e) => setState(e.target.value)}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label>Practice type<select value={type} onChange={(e) => setType(e.target.value as typeof type)}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label>Offices · <b>{locs}</b><input type="range" min={1} max={8} value={locs} onChange={(e) => { const n = +e.target.value; setLocs(n); setWithCase((w) => Math.min(w, n)); }} /></label>
          <label>Offices that have received a case · <b>{withCase}</b><input type="range" min={0} max={locs} value={withCase} onChange={(e) => setWithCase(+e.target.value)} /></label>
        </div>
        <div className="lf-pr-out">
          <span className="lf-pr-rate"><b>{money(rate)}</b>per location / month</span>
          <span className="lf-pr-why">{rate === 1000 ? `Chiropractic outside the PIP / no-fault states bills the standard rate.` : PIP.has(state) ? `${state} is a PIP / no-fault state.` : 'Every specialty other than chiropractic bills the same rate in every state.'}</span>
          <div className="lf-pr-lines">
            <span><small>{billed} office{billed === 1 ? '' : 's'} with a case × {money(rate)}</small><b>{money(monthly)}/mo</b></span>
            <span><small>{locs - billed} office{locs - billed === 1 ? '' : 's'} waiting for a first case</small><b>$0</b></span>
            <span><small>Law firms that refer to you</small><b>Free</b></span>
          </div>
          <span className="lf-pr-total"><small>After your 14-day trial</small><b>{money(monthly)}<i>/month</i></b></span>
          <span className="lf-pr-note">No card to start. Cancel any time from Billing. Unlimited users, referrals, forms, messages and telehealth visits.</span>
        </div>
      </div>
    </div>
  );
}
