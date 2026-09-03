'use client';

/**
 * MediLink cookie / tracking consent engine.
 *
 * Design goals (in priority order):
 *  1. Nothing non-essential runs before an affirmative, informed opt-in (GDPR Art. 6/7,
 *     ePrivacy Art. 5(3)). Scripts are gated at render time, not just "asked about".
 *  2. Refusing is exactly as easy as accepting — one click, first layer, equal prominence.
 *  3. Withdrawal is as easy as granting (GDPR Art. 7(3)) — persistent footer entry point,
 *     plus a best-effort cookie sweep and reload so revoked tags actually stop running.
 *  4. Universal opt-out signals (Global Privacy Control) are honoured automatically, which is
 *     mandatory under CPRA/CCPA, Colorado, and Connecticut.
 *  5. Every decision is recorded with an id, timestamp, method, and policy version so the
 *     business can evidence consent if a regulator asks (GDPR Art. 7(1)).
 *
 * The record is stored in a first-party cookie (readable by tag managers and the server) and
 * mirrored into localStorage for resilience. No personal data — no IP, no user agent, no
 * fingerprint — is stored in the record itself.
 */

import { currentRegime } from '@/lib/regime';
import {
  ALL_CATEGORIES,
  CONSENT_TTL_DAYS,
  CONSENT_VERSION,
  DEFAULT_CATEGORIES,
  type Categories,
  type CategoryId,
} from '@/lib/cookie-catalog';

export {
  ALL_CATEGORIES,
  CATEGORY_META,
  CONSENT_TTL_DAYS,
  CONSENT_VERSION,
  DEFAULT_CATEGORIES,
} from '@/lib/cookie-catalog';
export type { Categories, CategoryId, CategoryMeta, CookieRow } from '@/lib/cookie-catalog';

/** How the decision was made — kept for audit purposes. */
export type ConsentMethod = 'accept_all' | 'reject_all' | 'custom' | 'signal';

export type ConsentRecord = {
  /** Policy version the user agreed to. Bumping CONSENT_VERSION re-prompts everyone. */
  v: number;
  /** Opaque random id so a decision can be referenced in an audit log. */
  id: string;
  /** Epoch milliseconds of the decision. */
  ts: number;
  method: ConsentMethod;
  categories: Categories;
  /** True when a Global Privacy Control / Do Not Track signal was present at decision time. */
  gpc: boolean;
};

/* ------------------------------------------------------------------ *
 * Storage keys and events
 * ------------------------------------------------------------------ */

export const CONSENT_COOKIE = 'ml_consent';
export const CONSENT_STORAGE_KEY = 'medilink.consent';

/** Fired on window whenever the stored decision changes. */
export const CONSENT_EVENT = 'medilink:consentchange';
/** Fired on window to open the preferences dialog from anywhere in the app. */
export const OPEN_PREFS_EVENT = 'medilink:openpreferences';

/* ------------------------------------------------------------------ *
 * Environment helpers
 * ------------------------------------------------------------------ */

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Global Privacy Control is a legally recognised universal opt-out signal in California,
 * Colorado, Connecticut, and a growing list of states — we must honour it without asking.
 * Legacy Do Not Track is treated the same way; it costs us nothing to respect it.
 */
export function hasOptOutSignal(): boolean {
  if (!isBrowser()) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl === true) return true;
  return nav.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1';
}

/* ------------------------------------------------------------------ *
 * Storage
 * ------------------------------------------------------------------ */

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  const host = location.hostname;
  // Clear on the exact host and on each parent domain, since vendors vary in how they scope.
  const domains = [undefined as string | undefined, host, `.${host}`];
  const parts = host.split('.');
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);
  for (const domain of domains) {
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${
      domain ? `; Domain=${domain}` : ''
    }`;
  }
}

function normalizeCategories(input: unknown): Categories | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  return {
    necessary: true,
    functional: raw.functional === true,
    analytics: raw.analytics === true,
    marketing: raw.marketing === true,
  };
}

function parseRecord(value: string | null): ConsentRecord | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<ConsentRecord>;
    const categories = normalizeCategories(parsed.categories);
    if (!categories || typeof parsed.ts !== 'number' || typeof parsed.v !== 'number') return null;
    return {
      v: parsed.v,
      id: typeof parsed.id === 'string' ? parsed.id : 'unknown',
      ts: parsed.ts,
      method: (parsed.method as ConsentMethod) ?? 'custom',
      categories,
      gpc: parsed.gpc === true,
    };
  } catch {
    return null;
  }
}

function isExpired(record: ConsentRecord): boolean {
  return Date.now() - record.ts > CONSENT_TTL_DAYS * 864e5;
}

/**
 * Returns the stored decision, or null when there is none, when it was made against an older
 * policy version, or when it has aged out. Null always means "ask again, run nothing".
 */
export function readConsent(): ConsentRecord | null {
  if (!isBrowser()) return null;
  let record = parseRecord(readCookie(CONSENT_COOKIE));
  if (!record) {
    try {
      record = parseRecord(window.localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      record = null;
    }
  }
  if (!record) return null;
  if (record.v !== CONSENT_VERSION || isExpired(record)) return null;
  return record;
}

/** Current permissions. Absent or stale consent means everything optional is off. */
/**
 * What applies before the visitor has decided anything.
 *
 * Opt-in jurisdictions get everything denied, as before. Opt-out jurisdictions
 * get the non-essential categories granted, which is what their law actually
 * permits — but a Global Privacy Control signal outranks the regime everywhere,
 * because GPC *is* the opt-out those states require us to honour.
 */
export function defaultCategories(): Categories {
  if (hasOptOutSignal()) return { ...DEFAULT_CATEGORIES };
  if (currentRegime() === 'opt-out') return { ...ALL_CATEGORIES };
  return { ...DEFAULT_CATEGORIES };
}

export function getCategories(): Categories {
  return readConsent()?.categories ?? defaultCategories();
}

export function hasConsent(category: CategoryId): boolean {
  return getCategories()[category];
}

function newId(): string {
  if (isBrowser() && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `c_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Persists a decision and broadcasts it. Returns the stored record.
 * When a previously granted category is withdrawn we sweep known vendor cookies and ask the
 * caller to reload, because a script that is already executing cannot be un-executed.
 */
export function writeConsent(
  categories: Partial<Categories>,
  method: ConsentMethod
): { record: ConsentRecord; needsReload: boolean } {
  const previous = readConsent();
  const next: Categories = {
    necessary: true,
    functional: categories.functional === true,
    analytics: categories.analytics === true,
    marketing: categories.marketing === true,
  };

  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    id: previous?.id ?? newId(),
    ts: Date.now(),
    method,
    categories: next,
    gpc: hasOptOutSignal(),
  };

  const serialized = JSON.stringify(record);
  writeCookie(CONSENT_COOKIE, serialized, CONSENT_TTL_DAYS);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  } catch {
    /* Storage can be blocked in private mode — the cookie is the source of truth. */
  }

  const withdrawn = (Object.keys(next) as CategoryId[]).filter(
    (id) => previous?.categories[id] === true && next[id] === false
  );
  if (withdrawn.length) sweepVendorCookies();

  broadcast(record);
  return { record, needsReload: withdrawn.length > 0 };
}

/** Wipes the decision entirely so the banner returns on the next load. */
export function revokeConsent() {
  if (!isBrowser()) return;
  deleteCookie(CONSENT_COOKIE);
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  sweepVendorCookies();
  // Tell every listener we are back to necessary-only, even if the caller does not reload.
  broadcast(null);
}

/**
 * Best-effort removal of cookies set by tags we may have loaded. Scoped to a known prefix list
 * so we never delete something a future authenticated area depends on.
 */
const VENDOR_COOKIE_PREFIXES = [
  '_ga',
  '_gid',
  '_gac',
  '_gcl',
  '_fbp',
  '_fbc',
  '_hj',
  '_uet',
  '_clck',
  '_clsk',
  '_pin_',
  '_ttp',
  'vtag',
  'leadsy',
  'li_',
  'lidc',
  'bcookie',
  'IDE',
  'NID',
  'MUID',
];

export function sweepVendorCookies() {
  if (!isBrowser()) return;
  const names = document.cookie
    .split(';')
    .map((chunk) => chunk.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name));

  for (const name of names) {
    if (name === CONSENT_COOKIE) continue;
    // Case-sensitive on purpose: a loose match would also catch first-party names such as
    // `identity_*` (via the Google `IDE` prefix) and log people out of a future app area.
    if (VENDOR_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      deleteCookie(name);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Broadcasting
 * ------------------------------------------------------------------ */

type Listener = (record: ConsentRecord | null) => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Maps our categories onto Google Consent Mode v2 signals. Harmless when no Google tag is
 * present, and means any tag added later inherits the user's choice automatically instead of
 * silently defaulting to "granted".
 */
function pushConsentMode(categories: Categories) {
  if (!isBrowser()) return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag.js and GTM only parse a real `arguments` object here — an array is silently ignored.
  const dataLayer = w.dataLayer;
  function gtagFn(this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  }
  const gtag = gtagFn as unknown as (...args: unknown[]) => void;
  const grant = (allowed: boolean) => (allowed ? 'granted' : 'denied');
  gtag('consent', 'update', {
    ad_storage: grant(categories.marketing),
    ad_user_data: grant(categories.marketing),
    ad_personalization: grant(categories.marketing),
    analytics_storage: grant(categories.analytics),
    functionality_storage: grant(categories.functional),
    personalization_storage: grant(categories.functional),
    security_storage: 'granted',
  });
}

function broadcast(record: ConsentRecord | null) {
  const categories = record?.categories ?? { ...DEFAULT_CATEGORIES };
  pushConsentMode(categories);
  listeners.forEach((listener) => listener(record));
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  }
}

/** Opens the preferences dialog from anywhere — footer link, policy page, support scripts. */
export function openPreferences() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFS_EVENT));
}

/** Formats a stored timestamp for the "you chose X on Y" line in the dialog. */
export function formatDecisionDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
