'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { currentRegime, type Regime } from '@/lib/regime';
import {
  ALL_CATEGORIES,
  CATEGORY_META,
  CONSENT_TTL_DAYS,
  DEFAULT_CATEGORIES,
  OPEN_PREFS_EVENT,
  type Categories,
  type CategoryId,
  type ConsentRecord,
  formatDecisionDate,
  getCategories,
  defaultCategories,
  hasOptOutSignal,
  openPreferences,
  readConsent,
  revokeConsent,
  writeConsent,
} from '@/lib/consent';

const SIGNAL_SESSION_KEY = 'medilink.consent.signalNoticeShown';

/**
 * Consent banner and preferences dialog.
 *
 * Deliberate design decisions, all of them compliance-driven:
 *  - The banner has no "X" and no click-outside dismissal. A dismissal that leaves the visitor
 *    in an undefined state is the pattern regulators keep fining, so the only exits are a real
 *    choice: reject, accept, or save a custom selection.
 *  - "Reject all" and "Accept all" are the same size, weight, and visual prominence.
 *  - Every optional toggle starts off. Pre-ticked boxes are not consent (Planet49, C-673/17).
 *  - Nothing is rendered on the server, so a returning visitor never sees a flash of the banner.
 */
export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState<Categories>(DEFAULT_CATEGORIES);
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [signalDetected, setSignalDetected] = useState(false);
  // Opt-out jurisdictions see a notice, not a gate — the tags are already running.
  const [regime, setRegime] = useState<Regime>('opt-in');
  const [expanded, setExpanded] = useState<CategoryId | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const prefsTitleId = useId();

  /* ---------------- boot ---------------- */

  useEffect(() => {
    setMounted(true);
    const stored = readConsent();
    const signal = hasOptOutSignal();
    const activeRegime = currentRegime();
    setSignalDetected(signal);
    setRegime(activeRegime);

    if (stored) {
      setRecord(stored);
      setDraft(stored.categories);
      return;
    }

    setDraft(defaultCategories());

    if (signal) {
      // A Global Privacy Control header is a legally valid opt-out in several U.S. states, so we
      // honour it immediately rather than waiting for a click. The visitor can still opt in.
      const { record: applied } = writeConsent(DEFAULT_CATEGORIES, 'signal');
      setRecord(applied);
      let alreadyNotified = false;
      try {
        alreadyNotified = window.sessionStorage.getItem(SIGNAL_SESSION_KEY) === '1';
        window.sessionStorage.setItem(SIGNAL_SESSION_KEY, '1');
      } catch {
        /* private mode — showing the notice once more is harmless */
      }
      setBannerOpen(!alreadyNotified);
      return;
    }

    setBannerOpen(true);
  }, []);

  /* ---------------- public API + external triggers ---------------- */

  const openPrefs = useCallback(() => {
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    setDraft(getCategories());
    setPrefsOpen(true);
  }, []);

  const applyChoice = useCallback(
    (categories: Categories, method: Parameters<typeof writeConsent>[1]) => {
      const { record: saved, needsReload } = writeConsent(categories, method);
      setRecord(saved);
      setDraft(saved.categories);
      setBannerOpen(false);
      setPrefsOpen(false);
      // A script that has already executed cannot be unloaded — reload so withdrawal is real.
      if (needsReload) window.location.reload();
    },
    []
  );

  useEffect(() => {
    if (!mounted) return;
    const handler = () => openPrefs();
    window.addEventListener(OPEN_PREFS_EVENT, handler);

    // Small stable surface for tag managers, support staff, and future scripts.
    const w = window as typeof window & { MediLinkConsent?: unknown };
    w.MediLinkConsent = {
      get: getCategories,
      record: readConsent,
      open: openPreferences,
      accept: () => applyChoice(ALL_CATEGORIES, 'accept_all'),
      reject: () => applyChoice(DEFAULT_CATEGORIES, 'reject_all'),
      revoke: () => {
        revokeConsent();
        window.location.reload();
      },
    };

    return () => {
      window.removeEventListener(OPEN_PREFS_EVENT, handler);
      delete w.MediLinkConsent;
    };
  }, [mounted, openPrefs, applyChoice]);

  /* ---------------- decisions ---------------- */

  const acceptAll = () => applyChoice({ ...ALL_CATEGORIES }, 'accept_all');
  const rejectAll = () => applyChoice({ ...DEFAULT_CATEGORIES }, 'reject_all');
  const saveSelection = () => applyChoice(draft, 'custom');

  const closePrefs = useCallback(() => {
    setPrefsOpen(false);
    setExpanded(null);
    // Closing the dialog is not a decision — if none has been made, the banner stays up.
    if (!readConsent()) setBannerOpen(true);
    restoreFocusRef.current?.focus?.();
  }, []);

  /* ---------------- dialog behaviour: scroll lock, Escape, focus trap ---------------- */

  useEffect(() => {
    if (!prefsOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const node = dialogRef.current;
    const focusables = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePrefs();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [prefsOpen, closePrefs]);

  if (!mounted || (!bannerOpen && !prefsOpen)) return null;

  const toggle = (id: CategoryId) =>
    setDraft((prev) => ({ ...prev, [id]: !prev[id], necessary: true }));

  /* ---------------- render ---------------- */

  return (
    <>
      {bannerOpen && !prefsOpen && (
        <div className="cc-banner-wrap">
          <div
            className="cc-banner"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <div className="cc-banner-body">
              <div className="cc-banner-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12a9 9 0 1 1-9-9 4 4 0 0 0 4 4 4 4 0 0 0 4 4 9 9 0 0 1 1 1Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="13.5" r="1.15" fill="currentColor" />
                  <circle cx="14" cy="16" r="1.15" fill="currentColor" />
                  <circle cx="8.5" cy="8.5" r="1.15" fill="currentColor" />
                </svg>
              </div>
              <div className="cc-banner-text">
                <h2 className="cc-banner-title" id={titleId}>
                  {regime === 'opt-out' ? 'You control your data.' : 'We ask before we track.'}
                </h2>
                <p className="cc-banner-copy" id={descId}>
                  {regime === 'opt-out' ? (
                    <>
                      We use cookies to run this site, to see which pages help clinics and firms,
                      and to measure our campaigns. You can opt out of analytics and marketing at
                      any time — one click, and we honour Global Privacy Control automatically.{' '}
                    </>
                  ) : (
                    <>
                      We use strictly necessary cookies to run this site. With your permission we
                      would also use analytics and marketing cookies to see which pages help clinics
                      and firms, and to measure our campaigns. Nothing optional runs until you say
                      yes, and you can change your mind any time.{' '}
                    </>
                  )}
                  <Link href="/cookies">Cookie Policy</Link> ·{' '}
                  <Link href="/privacy">Privacy Policy</Link>
                </p>
                {signalDetected && (
                  <p className="cc-signal-note">
                    <span className="cc-signal-dot" aria-hidden="true" />
                    Your browser sent a Global Privacy Control (or Do Not Track) signal, so we have
                    already opted you out of analytics and marketing.
                  </p>
                )}
              </div>
            </div>

            <div className="cc-banner-actions">
              <button type="button" className="cc-btn cc-btn-link" onClick={openPrefs}>
                Manage preferences
              </button>
              <div className="cc-banner-choice">
                {/* Equal prominence is the point: same size, same weight, one click each. */}
                <button type="button" className="cc-btn cc-btn-secondary" onClick={rejectAll}>
                  {regime === 'opt-out' ? 'Opt out' : 'Reject all'}
                </button>
                <button type="button" className="cc-btn cc-btn-primary" onClick={acceptAll}>
                  {regime === 'opt-out' ? 'Got it' : 'Accept all'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {prefsOpen && (
        <div className="cc-modal-scrim" onMouseDown={(e) => e.target === e.currentTarget && closePrefs()}>
          <div
            className="cc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={prefsTitleId}
            ref={dialogRef}
          >
            <header className="cc-modal-head">
              <div>
                <span className="cc-modal-eyebrow">
                  <span className="cc-modal-eyebrow-dot" aria-hidden="true" />
                  Privacy preferences
                </span>
                <h2 className="cc-modal-title" id={prefsTitleId}>
                  Choose what MediLink may use.
                </h2>
              </div>
              <button
                type="button"
                className="cc-modal-close"
                onClick={closePrefs}
                aria-label="Close preferences without changing them"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className="cc-modal-scroll">
              <p className="cc-modal-intro">
                Each category below is off until you turn it on. Closing this panel without saving
                changes nothing. Your choice is stored for {Math.round(CONSENT_TTL_DAYS / 30)}{' '}
                months, after which we will ask again.
              </p>

              <ul className="cc-cats">
                {CATEGORY_META.map((cat) => {
                  const on = cat.required || draft[cat.id];
                  const isOpen = expanded === cat.id;
                  return (
                    <li className={`cc-cat ${isOpen ? 'is-open' : ''}`} key={cat.id}>
                      <div className="cc-cat-head">
                        <button
                          type="button"
                          className="cc-cat-expand"
                          aria-expanded={isOpen}
                          aria-controls={`cc-detail-${cat.id}`}
                          onClick={() => setExpanded(isOpen ? null : cat.id)}
                        >
                          <span className="cc-cat-chev" aria-hidden="true" />
                          <span className="cc-cat-labels">
                            <span className="cc-cat-name">{cat.label}</span>
                            <span className="cc-cat-summary">{cat.summary}</span>
                          </span>
                        </button>

                        {cat.required ? (
                          <span className="cc-locked" title="Required for the site to function">
                            Always on
                          </span>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={on}
                            aria-label={`${cat.label} cookies`}
                            className={`cc-switch ${on ? 'is-on' : ''}`}
                            onClick={() => toggle(cat.id)}
                          >
                            <span className="cc-switch-knob" aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      <div className="cc-cat-detail" id={`cc-detail-${cat.id}`} hidden={!isOpen}>
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
                          <p className="cc-empty">
                            No cookies in this category are currently in use. If that changes we
                            will update this policy and ask you again.
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="cc-record">
                {record ? (
                  <>
                    <p>
                      <strong>Your current choice</strong> was recorded on{' '}
                      {formatDecisionDate(record.ts)}
                      {record.method === 'signal' ? ' from your browser’s opt-out signal' : ''}.
                      Reference <code>{record.id.slice(0, 8)}</code>.
                    </p>
                    <button
                      type="button"
                      className="cc-btn cc-btn-link cc-btn-danger"
                      onClick={() => {
                        revokeConsent();
                        window.location.reload();
                      }}
                    >
                      Withdraw consent and delete this record
                    </button>
                  </>
                ) : (
                  <p>
                    No choice recorded yet — only strictly necessary cookies are active right now.
                  </p>
                )}
                <p className="cc-record-links">
                  Full detail in our <Link href="/cookies">Cookie Policy</Link> and{' '}
                  <Link href="/privacy">Privacy Policy</Link>. Questions about your data? Call{' '}
                  <a href="tel:+18334071005">+1 (833) 407-1005</a>.
                </p>
              </div>
            </div>

            <footer className="cc-modal-foot">
              <button type="button" className="cc-btn cc-btn-secondary" onClick={rejectAll}>
                Reject all
              </button>
              <button type="button" className="cc-btn cc-btn-secondary" onClick={acceptAll}>
                Accept all
              </button>
              <button type="button" className="cc-btn cc-btn-primary" onClick={saveSelection}>
                Save my choices
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
