/**
 * Which consent regime a visitor falls under.
 *
 * The EU/EEA/UK require prior opt-in: nothing non-essential may run until the
 * visitor affirmatively agrees (GDPR Art. 6, ePrivacy Art. 5(3)).
 *
 * US state law works the other way. Florida (FDBR), Texas (TDPSA), California
 * (CPRA), Colorado, Connecticut and the rest are opt-*out* regimes: processing
 * for advertising is permitted by default provided the visitor is told, can opt
 * out easily, and universal opt-out signals are honoured.
 *
 * Applying the opt-in model worldwide is not "safer" in any useful sense — it
 * simply means almost nobody is measured, because most visitors never touch the
 * banner and no-interaction reads as refusal. So the regime is chosen per
 * visitor, and anything unknown is treated as opt-in.
 */

export type Regime = 'opt-in' | 'opt-out';

/** Set by middleware from the CDN's geo lookup. Readable by the client. */
export const REGION_COOKIE = 'ml_region';

/** EU + EEA + UK. Anything not on this list still defaults to opt-in unless
 *  explicitly known to be an opt-out jurisdiction. */
const OPT_IN_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',   // EU
  'IS','LI','NO',                                                 // EEA
  'GB','CH',                                                      // UK + CH (FADP)
]);

/** Jurisdictions we affirmatively know to be opt-out. */
const OPT_OUT_COUNTRIES = new Set(['US', 'CA', 'AU', 'NZ', 'JP', 'SG', 'MX']);

export function regimeFor(country: string | null | undefined): Regime {
  if (!country) return 'opt-in';                     // unknown → the stricter rule
  const c = country.toUpperCase();
  if (OPT_IN_COUNTRIES.has(c)) return 'opt-in';
  if (OPT_OUT_COUNTRIES.has(c)) return 'opt-out';
  return 'opt-in';
}

/** Client-side read of the cookie middleware set. */
export function currentRegime(): Regime {
  if (typeof document === 'undefined') return 'opt-in';
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${REGION_COOKIE}=([^;]*)`));
  return regimeFor(m ? decodeURIComponent(m[1]) : null);
}
