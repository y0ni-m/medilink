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


  georgia: {
    slug: 'georgia',
    abbr: 'GA',
    name: 'Georgia',
    system: 'At-fault (tort), with a strict 50% bar on recovery',
    summary:
      'Georgia is an at-fault state with no mandatory first-party medical coverage, so treatment is usually funded by a letter of protection or a statutory lien while liability is worked out. Georgia also bars recovery at 50% fault rather than 51%, which makes it less forgiving than most comparative-negligence states.',
    facts: [
      { label: 'Insurance system', value: 'At-fault — the responsible driver\u2019s liability coverage pays', cite: 'O.C.G.A. \u00a7 40-9-37' },
      { label: 'First-party medical coverage', value: 'No PIP mandate; MedPay is optional', cite: 'O.C.G.A. \u00a7 33-34-4' },
      { label: 'Comparative negligence', value: 'Modified — recovery barred at 50% fault or more', cite: 'O.C.G.A. \u00a7 51-12-33(g)' },
      { label: 'Deadline to file suit', value: '2 years from the date of injury', cite: 'O.C.G.A. \u00a7 9-3-33' },
      { label: 'Provider liens', value: 'Hospital and provider liens available, with strict filing requirements', cite: 'O.C.G.A. \u00a7 44-14-470 et seq.' },
    ],
    providerPoints: [
      { title: 'No first-party payer to fall back on', desc: 'Without a PIP mandate, a treating practice in Georgia usually has no immediate payer. Whether care happens turns on how quickly a letter of protection or a properly perfected lien is in place.' },
      { title: 'The lien statute is unforgiving on process', desc: 'Georgia provider liens carry filing deadlines and recording requirements, and a lien that is not perfected correctly is simply lost. Getting the paperwork right at intake matters more than chasing it at settlement.' },
      { title: 'Contested liability is payment risk', desc: 'Because recovery disappears entirely at 50% fault, a genuinely disputed case carries more downside on a lien in Georgia than in a 51% state.' },
    ],
    attorneyPoints: [
      { title: 'The bar is 50%, not 51%', desc: 'An even split defeats the claim outright in Georgia. That makes early, well-documented treatment records more valuable to the liability picture than they are in neighbouring states.' },
      { title: 'Funding the treatment comes first', desc: 'With no mandatory PIP, the practical question in most Georgia cases is which credentialed providers will treat on a letter of protection and on what terms.' },
      { title: 'Two years, and liens run on their own clock', desc: 'The limitations period is two years, but provider liens carry separate and shorter filing requirements that can be missed while the claim itself is still healthy.' },
    ],
    keyFacts: { legal: [2, 3, 1], provider: [1, 4, 0] },
    reviewed: 'Pending counsel review',
  },

  california: {
    slug: 'california',
    abbr: 'CA',
    name: 'California',
    system: 'At-fault (tort), with pure comparative negligence',
    summary:
      'California is an at-fault state with no mandatory first-party medical coverage. Its defining feature is pure comparative negligence: a claimant who is mostly at fault still recovers, reduced by their share. That keeps cases alive that would be barred outright in most other states.',
    facts: [
      { label: 'Insurance system', value: 'At-fault — the responsible driver\u2019s liability coverage pays', cite: 'Cal. Veh. Code \u00a7 16056' },
      { label: 'First-party medical coverage', value: 'No PIP mandate; MedPay is optional', cite: 'Cal. Ins. Code \u00a7 11580.2 (UM/UIM offer)' },
      { label: 'Comparative negligence', value: 'Pure — recovery is reduced by fault, never barred', cite: 'Li v. Yellow Cab Co., 13 Cal. 3d 804 (1975)' },
      { label: 'Deadline to file suit', value: '2 years from the date of injury', cite: 'Cal. Code Civ. Proc. \u00a7 335.1' },
      { label: 'Recoverable medical expenses', value: 'Limited to amounts actually paid or accepted, not amounts billed', cite: 'Howell v. Hamilton Meats, 52 Cal. 4th 541 (2011)' },
    ],
    providerPoints: [
      { title: 'Pure comparative keeps cases viable', desc: 'A claimant found substantially at fault still recovers a reduced share, so a case that would be worthless in a 51%-bar state can still fund treatment in California.' },
      { title: 'Howell makes your billing record the ceiling', desc: 'Recovery is limited to what is actually paid or accepted rather than what is billed, so the gap between charge and accepted amount is litigated. Consistent, defensible billing protects the recovery.' },
      { title: 'No first-party payer by default', desc: 'With no PIP mandate, most treatment runs on a letter of protection or a clear patient financial responsibility arrangement agreed before care starts.' },
    ],
    attorneyPoints: [
      { title: 'Fault reduces, it does not bar', desc: 'Pure comparative negligence means a difficult liability picture changes the value of a case rather than ending it — which affects which cases are worth placing with a treating provider.' },
      { title: 'Build the record for paid-or-accepted', desc: 'Because Howell caps medical damages at amounts actually paid or accepted, provider billing needs to be clean from the first visit rather than reconstructed at settlement.' },
      { title: 'Two years from injury', desc: 'The limitations period runs from the date of injury, and early treatment gaps are what defence counsel uses to argue the injuries were not caused by the incident.' },
    ],
    keyFacts: { legal: [2, 4, 3], provider: [4, 1, 2] },
    reviewed: 'Pending counsel review',
  },

  'new-york': {
    slug: 'new-york',
    abbr: 'NY',
    name: 'New York',
    system: 'No-fault (PIP), with a 30-day filing deadline and a serious-injury threshold',
    summary:
      'New York is a no-fault state: a crash victim\u2019s own coverage pays the first $50,000 of medical expense and lost earnings regardless of fault. Two deadlines drive every referral — the 30-day window to file the no-fault application, and the 45-day window for submitting bills. Suing for pain and suffering additionally requires meeting a statutory serious-injury threshold.',
    facts: [
      { label: 'Insurance system', value: 'No-fault — $50,000 basic economic loss per person', cite: 'N.Y. Ins. Law \u00a7\u00a7 5102(a), 5103' },
      { label: 'Deadline to file the claim', value: '30 days from the accident to submit the no-fault application', cite: '11 NYCRR \u00a7 65-1.1' },
      { label: 'Deadline to submit bills', value: '45 days from the date of service', cite: '11 NYCRR \u00a7 65-1.1' },
      { label: 'Threshold to sue for pain and suffering', value: 'Statutory serious-injury threshold must be met', cite: 'N.Y. Ins. Law \u00a7 5102(d)' },
      { label: 'Comparative negligence', value: 'Pure — recovery is reduced by fault, never barred', cite: 'N.Y. C.P.L.R. \u00a7 1411' },
      { label: 'Deadline to file suit', value: '3 years from the date of injury', cite: 'N.Y. C.P.L.R. \u00a7 214(5)' },
    ],
    providerPoints: [
      { title: 'Two clocks, both short', desc: 'The no-fault application is due within 30 days of the accident and bills within 45 days of service. Miss either and the benefit is contested or lost — this is the most common way New York treatment goes unpaid.' },
      { title: 'Documentation decides the threshold', desc: 'Whether the claimant can pursue non-economic damages depends on meeting the statutory serious-injury threshold, and that determination is built out of the treating records.' },
      { title: '$50,000 goes further, but not far enough', desc: 'Basic economic loss covers considerably more than most no-fault states, though surgical cases still exceed it — at which point liability coverage and letters of protection take over.' },
    ],
    attorneyPoints: [
      { title: 'The 30-day application is the first thing to confirm', desc: 'A client who has not filed the no-fault application within 30 days has a funding problem before they have a liability problem. Confirming it is filed matters more than choosing the closest clinic.' },
      { title: 'The serious-injury threshold is proved with records', desc: 'Non-economic damages depend on the statutory threshold, which is met or missed on the strength of the treating documentation — not on the severity described at intake.' },
      { title: 'Three years, unusually', desc: 'New York allows three years for negligence claims where most states allow two, but the no-fault deadlines run in days and are the ones that actually bite.' },
    ],
    keyFacts: { legal: [1, 3, 5], provider: [1, 2, 0] },
    reviewed: 'Pending counsel review',
  },

  'new-jersey': {
    slug: 'new-jersey',
    abbr: 'NJ',
    name: 'New Jersey',
    system: 'No-fault (PIP), with precertification and a lawsuit-threshold election',
    summary:
      'New Jersey is a no-fault state where the insured chooses both their PIP limit and whether they retain the right to sue for pain and suffering. For treating practices the defining feature is Decision Point Review: most care beyond the initial period must be precertified with the insurer before it is provided, or it will not be paid.',
    facts: [
      { label: 'Insurance system', value: 'No-fault — PIP required, $15,000 standard, selectable to $250,000', cite: 'N.J.S.A. 39:6A-4' },
      { label: 'Precertification', value: 'Decision Point Review and precertification required for much ongoing care', cite: 'N.J.A.C. 11:3-4' },
      { label: 'Right to sue', value: 'Limitation on lawsuit option elected by the insured', cite: 'N.J.S.A. 39:6A-8' },
      { label: 'Comparative negligence', value: 'Modified — recovery barred above 51% fault', cite: 'N.J.S.A. 2A:15-5.1' },
      { label: 'Deadline to file suit', value: '2 years from the date of injury', cite: 'N.J.S.A. 2A:14-2' },
    ],
    providerPoints: [
      { title: 'Decision Point Review governs whether you get paid', desc: 'Much ongoing treatment must be precertified with the PIP carrier before it is provided. Care delivered outside that process is routinely denied regardless of medical necessity, which makes administrative timing as important as clinical judgement.' },
      { title: 'The PIP limit is a choice, so it varies', desc: 'Standard PIP is $15,000 but the insured may have selected up to $250,000. Knowing which applies before treatment planning changes what a course of care can realistically cover.' },
      { title: 'The lawsuit election shapes the case behind you', desc: 'If the claimant elected the limitation on lawsuit option, non-economic recovery requires clearing a statutory threshold — and that determination rests on the treating records.' },
    ],
    attorneyPoints: [
      { title: 'Confirm the PIP election early', desc: 'The insured\u2019s selected limit and lawsuit option are the two facts that determine what the case can fund and what it can recover. Both are knowable at intake and expensive to discover late.' },
      { title: 'Precertification failures look like treatment gaps', desc: 'When a provider misses Decision Point Review, care stops. On paper that reads as a gap in treatment, and defence counsel will argue it as evidence the injuries resolved.' },
      { title: 'Two years, with a threshold to clear', desc: 'The limitations period is two years, but where the limitation on lawsuit option applies the real constraint is whether the records establish a qualifying injury.' },
    ],
    keyFacts: { legal: [2, 3, 4], provider: [1, 0, 2] },
    reviewed: 'Pending counsel review',
  },

  arizona: {
    slug: 'arizona',
    abbr: 'AZ',
    name: 'Arizona',
    system: 'At-fault (tort), with pure comparative negligence',
    summary:
      'Arizona is an at-fault state with no mandatory first-party medical coverage, so treatment is generally funded by a letter of protection or a recorded medical lien. Like California, Arizona applies pure comparative negligence, so a claimant\u2019s own fault reduces recovery without eliminating it.',
    facts: [
      { label: 'Insurance system', value: 'At-fault — the responsible driver\u2019s liability coverage pays', cite: 'A.R.S. \u00a7 28-4009' },
      { label: 'First-party medical coverage', value: 'No PIP mandate; MedPay is optional', cite: 'A.R.S. \u00a7 20-259.01 (UM/UIM offer)' },
      { label: 'Comparative negligence', value: 'Pure — recovery is reduced by fault, never barred', cite: 'A.R.S. \u00a7 12-2505' },
      { label: 'Deadline to file suit', value: '2 years from the date of injury', cite: 'A.R.S. \u00a7 12-542' },
      { label: 'Provider liens', value: 'Medical liens available if recorded before or shortly after treatment', cite: 'A.R.S. \u00a7 33-931 et seq.' },
    ],
    providerPoints: [
      { title: 'The lien must be recorded, and recorded in time', desc: 'Arizona medical liens are perfected by recording, and the window is narrow. A lien recorded late secures nothing, which makes intake administration the point where payment is won or lost.' },
      { title: 'No first-party payer by default', desc: 'Without a PIP mandate, most injury treatment runs on a letter of protection or a clear patient financial responsibility arrangement agreed before care starts.' },
      { title: 'Contested fault does not end the case', desc: 'Pure comparative negligence means a claimant who bears substantial fault still recovers a reduced share, so a difficult liability picture is a discount rather than a dead case.' },
    ],
    attorneyPoints: [
      { title: 'Fault reduces, it does not bar', desc: 'Arizona\u2019s pure comparative standard keeps cases alive that a 51%-bar state would defeat outright, which widens the set of cases worth placing with a treating provider.' },
      { title: 'Provider liens run on their own clock', desc: 'Medical liens must be recorded within a short window to attach. A provider who misses it has no security, which changes their willingness to take the next case.' },
      { title: 'Two years from injury', desc: 'The limitations period runs from the date of injury, and gaps early in treatment are the argument defence counsel makes about causation.' },
    ],
    keyFacts: { legal: [2, 4, 3], provider: [4, 1, 0] },
    reviewed: 'Pending counsel review',
  },
};

export function getStateLaw(slug: StateSlug): StateLaw {
  return STATE_LAW[slug];
}

/** Rendered on every page carrying legal content. */
export const LEGAL_DISCLAIMER =
  'This page describes general aspects of state law for informational purposes only. It is not legal advice, does not create an attorney-client relationship, and should not be relied on in any particular case. Statutes change — confirm current law with a licensed attorney in your state.';
