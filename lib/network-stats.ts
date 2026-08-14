// Live network counts for a market — the strongest differentiator a location page can carry.
//
// ─────────────────────────────────────────────────────────────────────────────
//  INTEGRATION POINT — currently returns null everywhere.
//
//  Wire this to the MediLink app (an API endpoint or a build-time export keyed by
//  state + place slug) and every location page will start showing real verified
//  provider and firm counts for its market.
//
//  Until that exists this returns null and the pages omit the section entirely.
//  Do NOT return estimated, projected, or placeholder numbers: a healthcare
//  referral network claiming provider counts it cannot substantiate is a
//  deceptive-advertising problem, not a copy problem.
// ─────────────────────────────────────────────────────────────────────────────

import type { Place } from '@/lib/locations';

export type NetworkStats = {
  /** Verified providers of this specialty serving the market. */
  providers: number;
  /** Firms actively placing referrals into the market. */
  firms: number;
  /** ISO date the counts were generated. */
  asOf: string;
};

/**
 * Returns null when no substantiated data exists for the market, which is the current
 * state for every market. Callers must handle null by omitting the claim.
 */
export function getNetworkStats(_specialty: string, _place: Place): NetworkStats | null {
  return null;
}

export const hasNetworkData = (stats: NetworkStats | null): stats is NetworkStats =>
  stats !== null && stats.providers > 0;
