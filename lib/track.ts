/**
 * Conversion reporting for ad platforms.
 *
 * Every call is a no-op unless the visitor granted the marketing category — the tag itself is
 * never rendered without consent (see components/ConsentScripts.tsx), so `window.fbq` simply
 * does not exist for anyone who declined. That means reported conversions undercount real ones
 * by design; the server-side record in the CRM remains the source of truth for lead volume.
 */

type Fbq = (action: string, event: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Report a standard Meta event. Safe to call anywhere, including before consent. */
export function trackMeta(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq('track', event, params);
  } catch {
    /* Never let a marketing tag break a booking. */
  }
}
