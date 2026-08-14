// Per-state personal injury framework shown on the location landing pages.
//
// ─────────────────────────────────────────────────────────────────────────────
//  REQUIRES LEGAL REVIEW BEFORE THESE PAGES GO LIVE.
//
//  This file is the single source for every legal statement rendered across all
//  location pages, so counsel reviews two state blocks here rather than thousands
//  of pages. Statute citations are included so each claim can be checked directly.
//  Laws change: re-verify at least annually and after each legislative session.
//  Nothing here is legal advice, and the pages say so.
// ─────────────────────────────────────────────────────────────────────────────

import type { StateAbbr, StateSlug } from '@/lib/locations';

export type LawFact = {
  label: string;
  value: string;
  /** Statute or case citation a reviewer can check the claim against. */
  cite: string;
};

export type StateLaw = {
  slug: StateSlug;
  abbr: StateAbbr;
  name: string;
  /** One-line characterisation of the liability system. */
  system: string;
  /** Two or three sentences a provider or attorney would actually find useful. */
  summary: string;
  facts: LawFact[];
  /** What the framework means for a treating clinic. */
  providerPoints: { title: string; desc: string }[];
  /** What it means for the referring firm. */
  attorneyPoints: { title: string; desc: string }[];
  /**
   * Indexes into `facts` worth surfacing on a city page, by audience side. City pages carry a
   * short subset and link up to the state hub for the full framework — duplicating the entire
   * statute table onto hundreds of city pages is what turns them into near-identical documents.
   */
  keyFacts: { legal: number[]; provider: number[] };
  /** Verification date for the block, surfaced on the page. */
  reviewed: string;
};

export const STATE_LAW: Record<StateSlug, StateLaw> = {
  florida: {
    slug: 'florida',
    abbr: 'FL',
    name: 'Florida',
    system: 'No-fault (PIP), with a 14-day treatment deadline',
    summary:
      'Florida is a no-fault state: a crash victim’s own Personal Injury Protection coverage pays first, regardless of who caused the collision. Two rules drive almost every referral decision — the 14-day deadline to begin care, and whether a qualifying provider has documented an emergency medical condition.',
    facts: [
      {
        label: 'Insurance system',
        value: 'No-fault — $10,000 minimum PIP',
        cite: 'Fla. Stat. § 627.736',
      },
      {
        label: 'Deadline to begin treatment',
        value: '14 days from the crash, or PIP benefits are lost',
        cite: 'Fla. Stat. § 627.736(1)(a)',
      },
      {
        label: 'Benefit cap without an EMC finding',
        value: '$2,500 instead of the full $10,000',
        cite: 'Fla. Stat. § 627.736(1)(a)(3)–(4)',
      },
      {
        label: 'Comparative negligence',
        value: 'Modified — recovery barred above 50% fault',
        cite: 'Fla. Stat. § 768.81, as amended by HB 837 (2023)',
      },
      {
        label: 'Deadline to file suit',
        value: '2 years for negligence claims arising on or after March 24, 2023',
        cite: 'Fla. Stat. § 95.11(4)(a), as amended by HB 837',
      },
      {
        label: 'Letters of protection',
        value: 'Subject to statutory disclosure requirements in litigation',
        cite: 'Fla. Stat. § 768.0427',
      },
    ],
    providerPoints: [
      {
        title: 'The 14-day clock is the whole game',
        desc: 'A patient who does not receive initial services within 14 days of the crash forfeits PIP entirely. Referrals that sit in an inbox for a week are the single most common way a case loses its funding before treatment even starts.',
      },
      {
        title: 'Only certain providers can determine an EMC',
        desc: 'A physician, osteopathic physician, dentist, physician assistant, or advanced practice registered nurse can document an emergency medical condition. Chiropractic physicians may treat the patient but cannot make that determination — which is why chiropractic-first cases so often need a same-week MD or DO evaluation to unlock the full $10,000.',
      },
      {
        title: 'Documentation carries the claim',
        desc: 'Because PIP pays 80% of reasonable and necessary medical expenses, the quality of the initial evaluation and the EMC record determines whether the rest of the treatment plan gets paid.',
      },
    ],
    attorneyPoints: [
      {
        title: 'Place the referral in days, not weeks',
        desc: 'The 14-day rule means a client who has not been seen is a client whose PIP is evaporating. Knowing which nearby clinics have genuine capacity this week is worth more than a longer list of clinics that do not.',
      },
      {
        title: 'The 51% bar changed the calculus',
        desc: 'Since HB 837, a claimant found more than 50% at fault recovers nothing, where Florida previously used pure comparative negligence. Early, well-documented treatment records matter more to the liability picture than they used to.',
      },
      {
        title: 'Shorter window to file',
        desc: 'Negligence claims arising on or after March 24, 2023 carry a two-year limitations period rather than the previous four. Treatment timelines and case timelines are tighter on both ends.',
      },
    ],
    keyFacts: { legal: [3, 4, 5], provider: [1, 2, 0] },
    reviewed: 'Pending counsel review',
  },

  texas: {
    slug: 'texas',
    abbr: 'TX',
    name: 'Texas',
    system: 'At-fault (tort), with no mandatory no-fault coverage',
    summary:
      'Texas is an at-fault state: the driver responsible for a crash — through their liability insurer — pays for the harm caused. There is no mandatory PIP, so a large share of injured patients arrive with no immediate way to pay for care, which makes letters of protection and clear billing practice central to whether treatment happens at all.',
    facts: [
      {
        label: 'Insurance system',
        value: 'At-fault — liability coverage of the responsible driver pays',
        cite: 'Tex. Transp. Code § 601.072 (minimum limits)',
      },
      {
        label: 'PIP',
        value: 'Must be offered at $2,500 minimum, but may be rejected in writing',
        cite: 'Tex. Ins. Code § 1952.152',
      },
      {
        label: 'Comparative responsibility',
        value: 'Modified — recovery barred above 50% responsibility',
        cite: 'Tex. Civ. Prac. & Rem. Code § 33.001',
      },
      {
        label: 'Deadline to file suit',
        value: '2 years from the date of injury',
        cite: 'Tex. Civ. Prac. & Rem. Code § 16.003',
      },
      {
        label: 'Recoverable medical expenses',
        value: 'Limited to amounts actually paid or incurred',
        cite: 'Tex. Civ. Prac. & Rem. Code § 41.0105; Haygood v. De Escabedo, 356 S.W.3d 390 (Tex. 2011)',
      },
    ],
    providerPoints: [
      {
        title: 'Most patients arrive without first-party coverage',
        desc: 'Because PIP can be rejected in writing and frequently is, a treating clinic often has no immediate payer. Whether care happens comes down to how quickly a letter of protection or a clear patient financial responsibility arrangement can be put in place.',
      },
      {
        title: 'Paid-or-incurred shapes your billing',
        desc: 'Texas limits recovery to medical expenses actually paid or incurred, so billed-versus-accepted differences matter. Consistent, defensible billing practice protects both the patient’s recovery and the clinic’s.',
      },
      {
        title: 'Attribution of responsibility affects payment',
        desc: 'With a 51% bar on recovery, a case where responsibility is genuinely contested carries real payment risk on a lien. Knowing that early changes whether and how a clinic takes the case.',
      },
    ],
    attorneyPoints: [
      {
        title: 'Funding the treatment is the first problem',
        desc: 'Without mandatory PIP, the practical question in most Texas cases is which credentialed providers will treat on a letter of protection, and on what terms — not simply who is nearby.',
      },
      {
        title: 'Build the record with paid-or-incurred in mind',
        desc: 'Because recoverable medical expenses are capped at amounts actually paid or incurred, provider billing records need to be clean from the first visit rather than reconstructed at settlement.',
      },
      {
        title: 'Two years, from the date of injury',
        desc: 'The limitations period runs from injury, and treatment gaps early in a case are exactly what defence counsel uses to argue the injuries were not caused by the crash.',
      },
    ],
    keyFacts: { legal: [2, 3, 4], provider: [1, 4, 0] },
    reviewed: 'Pending counsel review',
  },
};

export function getStateLaw(slug: StateSlug): StateLaw {
  return STATE_LAW[slug];
}

/** Rendered on every page carrying legal content. */
export const LEGAL_DISCLAIMER =
  'This page describes general aspects of state law for informational purposes only. It is not legal advice, does not create an attorney-client relationship, and should not be relied on in any particular case. Statutes change — confirm current law with a licensed attorney in your state.';
