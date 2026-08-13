import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';
import CookieSettingsLink from '@/components/CookieSettingsLink';
import { CATEGORY_META, CONSENT_TTL_DAYS, POLICY_LAST_UPDATED } from '@/lib/cookie-catalog';

export const metadata: Metadata = {
  title: 'MediLink — Cookie Policy',
  description:
    'Every cookie and tracking technology MediLink uses, what it is for, how long it lasts, and how to turn it off.',
};

export default function CookiesPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Cookie Policy"
        title="Every cookie we set, and how to switch it off."
        intro="Nothing optional runs on this site until you allow it. This page lists each technology we use, why we use it, how long it lasts, and how to change your mind."
        lastUpdated={POLICY_LAST_UPDATED}
      >
        <div className="cc-policy-actions">
          <CookieSettingsLink variant="button">Manage cookie preferences</CookieSettingsLink>
        </div>

        <h2>1. Our approach</h2>
        <p>
          Cookies and similar technologies — local storage, pixels, and tags — let a site remember
          things between page loads. We treat all of them the same way: strictly necessary cookies
          run because the site cannot work without them, and{' '}
          <strong>everything else stays switched off until you turn it on</strong>. Optional scripts
          are not merely inactive before consent; they are never loaded, so no request reaches the
          vendor at all.
        </p>
        <p>
          We do not use cookies to profile patients, and we never apply advertising or analytics
          technology to Protected Health Information. PHI handling is governed by the Business
          Associate Agreement described in our <a href="/compliance">Compliance</a> overview.
        </p>

        <h2>2. Your controls</h2>
        <ul>
          <li>
            <strong>The consent banner</strong> — shown on your first visit, with a one-click
            &quot;Reject all&quot; that is exactly as prominent as &quot;Accept all&quot;.
          </li>
          <li>
            <strong>Per-category choices</strong> — open{' '}
            <CookieSettingsLink variant="inline">cookie settings</CookieSettingsLink> to switch individual categories
            on or off. Nothing is pre-ticked.
          </li>
          <li>
            <strong>Withdrawal</strong> — the same panel lets you withdraw consent entirely and
            delete the stored record. Withdrawing is one click, exactly like granting. We then clear
            the vendor cookies we can reach and reload the page so nothing keeps running.
          </li>
          <li>
            <strong>Global Privacy Control</strong> — if your browser or extension sends a GPC
            signal, we treat it as a valid opt-out and switch analytics and marketing off
            automatically, before you touch anything.
          </li>
        </ul>
        <p>
          Your choice is stored for {Math.round(CONSENT_TTL_DAYS / 30)} months and then we ask
          again. If we add a vendor or a new purpose, we reset every stored choice and ask again
          rather than assuming your earlier answer still applies.
        </p>

        <h2>3. What we use, by category</h2>
        {CATEGORY_META.map((cat) => (
          <div className="cc-policy-table" key={cat.id}>
            <h3>{cat.label}</h3>
            <span className="cc-policy-cat">
              {cat.required ? 'Always active — no consent required' : 'Off until you opt in'}
            </span>
            <p>{cat.detail}</p>
            {cat.cookies.length > 0 ? (
              <div className="cc-table-wrap">
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th scope="col">Cookie</th>
                      <th scope="col">Provider</th>
                      <th scope="col">Purpose</th>
                      <th scope="col">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.cookies.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <code>{row.name}</code>
                          <span className="cc-party">{row.party}</span>
                        </td>
                        <td>{row.provider}</td>
                        <td>{row.purpose}</td>
                        <td>{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>
                <em>
                  No cookies in this category are currently in use. If that changes we will update
                  this page and ask for your consent again.
                </em>
              </p>
            )}
          </div>
        ))}

        <h2>4. What we store about your choice</h2>
        <p>
          The <code>ml_consent</code> cookie holds only what is needed to honour and evidence your
          decision: the categories you allowed, the policy version you were shown, the time you
          decided, whether a browser opt-out signal was present, and a random reference id. It
          contains no name, no email, no IP address, and no device fingerprint.
        </p>

        <h2>5. U.S. state privacy rights</h2>
        <p>
          If you are a resident of California, Colorado, Connecticut, Virginia, or another state
          with a comprehensive privacy law, you have the right to opt out of the sale or sharing of
          personal information and of targeted advertising. MediLink does not sell personal
          information for money. Leaving the <strong>Marketing</strong> category switched off — or
          sending a Global Privacy Control signal — opts you out of everything that could be
          considered sharing for cross-context behavioural advertising.
        </p>
        <p>
          To exercise access, correction, deletion, or appeal rights, call{' '}
          <a href="tel:+18334071005">+1 (833) 407-1005</a>. We will not discriminate against you for
          exercising any privacy right.
        </p>

        <h2>6. Browser-level controls</h2>
        <p>
          Independently of the settings on this site, every major browser lets you block or delete
          cookies, and browser privacy modes limit what any site can store. Blocking strictly
          necessary cookies will prevent us from remembering your privacy choice, so the banner will
          return on each visit.
        </p>

        <h2>7. Changes and contact</h2>
        <p>
          When this policy changes materially we bump its version, which clears stored consent and
          prompts everyone again. The &quot;Last updated&quot; date above always reflects the
          current version. Questions about cookies or this policy? Call{' '}
          <a href="tel:+18334071005">+1 (833) 407-1005</a> or read the full{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <div className="cc-policy-actions">
          <CookieSettingsLink variant="button">Review my cookie choices</CookieSettingsLink>
        </div>
      </LegalDoc>
      <Footer />
    </div>
  );
}
