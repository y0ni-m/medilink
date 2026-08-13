/**
 * The cookie catalogue — the single source of truth behind the consent banner, the preferences
 * dialog, and the public Cookie Policy page. Deliberately free of browser code so server
 * components can render the same disclosure the dialog shows.
 *
 * Adding a vendor is a three-step job: add its row here, gate its script in
 * components/ConsentScripts.tsx, and bump CONSENT_VERSION so every visitor is asked again.
 */

export type CategoryId = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type Categories = Record<CategoryId, boolean>;

/**
 * Bump whenever the policy materially changes (new vendor, new purpose). Existing consent is
 * treated as invalid and every visitor is asked again — silently inheriting old consent for a
 * new purpose is exactly what regulators treat as no consent at all.
 */
export const CONSENT_VERSION = 1;

/** Consent expires after 12 months, per CNIL/EDPB guidance. Refusals last just as long — no nagging. */
export const CONSENT_TTL_DAYS = 365;

/** Shown on the policy page; keep in step with CONSENT_VERSION. */
export const POLICY_LAST_UPDATED = 'August 12, 2026';

export const DEFAULT_CATEGORIES: Categories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_CATEGORIES: Categories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

export type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  /** first-party = set by medilink.vip, third-party = set by a vendor domain. */
  party: 'First-party' | 'Third-party';
};

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  /** One line, shown next to the toggle. */
  summary: string;
  /** Full explanation, shown in the expanded row and on the policy page. */
  detail: string;
  /** Necessary cookies cannot be switched off — the toggle renders locked. */
  required: boolean;
  cookies: CookieRow[];
};

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: 'necessary',
    label: 'Strictly necessary',
    summary: 'Required for the site to work. Always on.',
    detail:
      'These cookies keep the site secure and usable — they remember your privacy choice, balance traffic, and protect forms against abuse. They are set only in response to actions you take, such as submitting a demo request. Because the site cannot function without them they do not require consent and cannot be switched off here. You can still block them in your browser, but parts of the site will stop working.',
    required: true,
    cookies: [
      {
        name: 'ml_consent',
        provider: 'MediLink',
        purpose:
          'Stores your cookie choices, the policy version you saw, and when you chose, so we do not ask again and can evidence your decision if asked.',
        duration: '12 months',
        party: 'First-party',
      },
    ],
  },
  {
    id: 'functional',
    label: 'Functional',
    summary: 'Remembers your preferences, like saved forms and region.',
    detail:
      'Functional cookies let the site remember choices you make — a partially completed demo request, your preferred contact method, or content tailored to your role. Turning them off will not break the site, but you may have to re-enter information.',
    required: false,
    cookies: [],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    summary: 'Aggregate statistics that show us which pages are useful.',
    detail:
      'Analytics cookies tell us which pages are read, which are ignored, and where people get stuck, so we can improve the site. We use this only in aggregate — we do not use analytics to build advertising profiles, and analytics is never applied to Protected Health Information.',
    required: false,
    cookies: [],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    summary: 'Identifies visiting businesses and measures our campaigns.',
    detail:
      'Marketing technologies help us understand which organizations are researching MediLink and measure whether our campaigns reach the right clinics and firms. Our visitor-identification vendor may infer a company from your network address. This is the only category that could be treated as “sharing” personal information for cross-context behavioural advertising under U.S. state privacy laws — leaving it off opts you out entirely.',
    required: false,
    cookies: [
      {
        name: 'vtag / leadsy.ai',
        provider: 'Leadsy (r2.leadsy.ai)',
        purpose:
          'Business-visitor identification and campaign attribution. The script is not loaded at all until you consent to marketing.',
        duration: 'Up to 12 months',
        party: 'Third-party',
      },
    ],
  },
];
