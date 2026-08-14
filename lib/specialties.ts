// Location-page metadata for each specialty MediLink targets.
//
// The /for/[specialty] hub pages are driven by lib/audiences.ts. This file adds the fields the
// *location* pages need: noun forms for templating, the role the specialty plays in a personal
// injury case, and how each state's framework specifically lands on that specialty.
//
// Page content varies along four axes — specialty (7) x state (2) x market tier (3) x place
// facts (549). That crossing is what keeps a Harris County orthopedics page from reading like a
// Miami-Dade chiropractic page.

import type { StateSlug } from '@/lib/locations';

export type SpecialtySide = 'provider' | 'legal';

export type Specialty = {
  /** Matches an Audience slug in lib/audiences.ts — the hub page for this specialty. */
  slug: string;
  /** "chiropractor" / "personal injury attorney" */
  singular: string;
  /** "chiropractors" / "personal injury attorneys" */
  plural: string;
  /** How the practice itself is named: "chiropractic clinics", "surgery centers". */
  practiceNoun: string;
  /** Whether this audience receives referrals (provider) or sends them (legal). */
  side: SpecialtySide;
  /** Search-facing label used in titles: "Personal Injury Chiropractors". */
  titleNoun: string;
  /** One sentence on what this specialty does in a personal injury case. */
  role: string;
  /** Concrete services — used to make each page's copy specific rather than generic. */
  services: string[];
  /** What verification means for this specialty. */
  credentialing: string;
  /** Emphasis by market size. */
  tierAngle: {
    metro: string;
    mid: string;
    small: string;
  };
  /** How each state's framework specifically affects this specialty. */
  stateAngle: Record<StateSlug, string>;
};

export const SPECIALTIES: Specialty[] = [
  {
    slug: 'lawyers',
    singular: 'personal injury attorney',
    plural: 'personal injury attorneys',
    practiceNoun: 'personal injury firms',
    side: 'legal',
    titleNoun: 'Personal Injury Attorneys',
    role: 'Firms that represent injured claimants and need credentialed treating providers with genuine capacity.',
    services: [
      'Motor vehicle and trucking claims',
      'Premises liability',
      'Slip and fall',
      'Wrongful death',
      'Uninsured and underinsured motorist claims',
    ],
    credentialing: 'State bar standing and active malpractice coverage are checked before a firm can place referrals.',
    tierAngle: {
      metro: 'A dense market means more clinics, but also more competition for the ones with real capacity this week.',
      mid: 'There is enough provider depth to have a choice, but the same handful of clinics absorb most of the volume.',
      small: 'Provider options are limited, so knowing which clinics accept letters of protection matters more than proximity.',
    },
    stateAngle: {
      florida:
        'With PIP forfeited if care does not begin within 14 days, the practical question is which clinic can see the client this week — not which clinic is closest.',
      texas:
        'With no mandatory PIP, the first question in most cases is which credentialed providers will treat on a letter of protection and on what terms.',
    },
  },
  {
    slug: 'chiropractors',
    singular: 'chiropractor',
    plural: 'chiropractors',
    practiceNoun: 'chiropractic and rehab clinics',
    side: 'provider',
    titleNoun: 'Personal Injury Chiropractors',
    role: 'Usually the first treating provider after a crash, handling soft-tissue injury, spinal rehabilitation, and the documentation the rest of the case is built on.',
    services: [
      'Spinal adjustment and manipulation',
      'Soft-tissue and whiplash rehabilitation',
      'Therapeutic exercise and modalities',
      'Range-of-motion and impairment documentation',
      'Referral for advanced imaging',
    ],
    credentialing: 'License status, NPI, and active malpractice coverage are verified before any case is routed.',
    tierAngle: {
      metro: 'Crash volume is high and case flow is steady, and attorneys here expect same-week availability.',
      mid: 'Referral volume is consistent and comes from a manageable number of firms, so reputation travels quickly.',
      small: 'A clinic here is often the only injury care within a reasonable drive, which makes coverage radius the deciding factor.',
    },
    stateAngle: {
      florida:
        'A chiropractic physician can begin care inside the 14-day PIP window but cannot make the emergency medical condition determination — so cases that start in a chiropractic clinic frequently need a same-week MD or DO evaluation to unlock the full $10,000 in benefits.',
      texas:
        'With no mandatory first-party coverage, most chiropractic care in Texas injury cases runs on a letter of protection, which makes attorney verification and clean billing records essential from the first visit.',
    },
  },
  {
    slug: 'mri-clinics',
    singular: 'MRI clinic',
    plural: 'MRI clinics',
    practiceNoun: 'diagnostic imaging centers',
    side: 'provider',
    titleNoun: 'Personal Injury MRI & Imaging Centers',
    role: 'Provides the objective imaging that turns a soft-tissue complaint into documented, demonstrable injury.',
    services: [
      'MRI of the cervical, thoracic, and lumbar spine',
      'Extremity and joint MRI',
      'CT and digital X-ray',
      'Radiologist interpretation and report turnaround',
      'Prior-image comparison',
    ],
    credentialing: 'Facility accreditation, radiologist credentials, and malpractice coverage are verified before scheduling.',
    tierAngle: {
      metro: 'Several facilities compete on turnaround, and report speed is the real differentiator.',
      mid: 'A small number of centers absorb the regional referral volume, often with next-day availability.',
      small: 'Patients frequently travel for imaging here, so scheduling coordination matters as much as the scan itself.',
    },
    stateAngle: {
      florida:
        'Imaging often determines whether an emergency medical condition can be documented, which is the difference between $2,500 and the full $10,000 in PIP benefits on a case.',
      texas:
        'Because recovery is limited to medical expenses actually paid or incurred, imaging billing needs to be clean and defensible from the outset rather than reconstructed at settlement.',
    },
  },
  {
    slug: 'tbi-doctors',
    singular: 'TBI specialist',
    plural: 'TBI specialists',
    practiceNoun: 'neurology and TBI practices',
    side: 'provider',
    titleNoun: 'Traumatic Brain Injury Specialists',
    role: 'Evaluates and treats concussion and traumatic brain injury — the injuries most often missed at the emergency department and hardest to document later.',
    services: [
      'Concussion and mild TBI evaluation',
      'Neurocognitive and neuropsychological testing',
      'Post-concussion syndrome management',
      'Vestibular and balance assessment',
      'Neuroimaging interpretation and referral',
    ],
    credentialing: 'Board certification, license status, and malpractice coverage are verified before a case is routed.',
    tierAngle: {
      metro: 'Subspecialty depth is available, but wait times for neuropsychological testing are usually the bottleneck.',
      mid: 'Qualified evaluators are limited in number, which makes scheduling visibility genuinely valuable.',
      small: 'Specialist care usually requires travel, so a referral has to be worth the drive and coordinated properly.',
    },
    stateAngle: {
      florida:
        'A physician or osteopathic physician can document an emergency medical condition, so a neurological evaluation inside the 14-day window can be what preserves the full PIP benefit on a head-injury case.',
      texas:
        'Head injuries frequently surface after the initial treatment decisions are made, and with a two-year limitations period running from the date of injury, late-emerging cognitive symptoms compress the timeline on both diagnosis and the claim.',
    },
  },
  {
    slug: 'orthopedics',
    singular: 'orthopedic surgeon',
    plural: 'orthopedic surgeons',
    practiceNoun: 'orthopedic practices',
    side: 'provider',
    titleNoun: 'Personal Injury Orthopedic Surgeons',
    role: 'Manages fractures, joint injuries, and the surgical decisions that define the value and duration of a serious injury case.',
    services: [
      'Fracture care and fixation',
      'Spine consultation and surgical evaluation',
      'Shoulder, knee, and joint injury treatment',
      'Injection therapy and conservative management',
      'Impairment rating and future-care opinions',
    ],
    credentialing: 'Board certification, hospital privileges, license status, and malpractice coverage are verified.',
    tierAngle: {
      metro: 'Subspecialty coverage runs deep, so the constraint is surgical scheduling rather than finding a surgeon.',
      mid: 'A handful of practices handle most of the regional injury volume, often under real capacity constraints.',
      small: 'Surgical care typically means referral to a larger market, so coordination and records transfer matter most here.',
    },
    stateAngle: {
      florida:
        'Orthopedic evaluation frequently produces the emergency medical condition determination that unlocks full PIP benefits, and impairment findings carry more weight now that a claimant above 50% fault recovers nothing.',
      texas:
        'Surgical cases are where letters of protection are largest and most scrutinised, and the paid-or-incurred rule means the billing record has to hold up alongside the clinical one.',
    },
  },
  {
    slug: 'plastic-surgeons',
    singular: 'plastic surgeon',
    plural: 'plastic surgeons',
    practiceNoun: 'plastic and reconstructive surgery practices',
    side: 'provider',
    titleNoun: 'Personal Injury Plastic & Reconstructive Surgeons',
    role: 'Treats lacerations, facial trauma, and scarring — the visible, permanent injuries that carry disfigurement damages.',
    services: [
      'Laceration repair and revision',
      'Facial trauma and fracture reconstruction',
      'Scar revision and management',
      'Burn and soft-tissue reconstruction',
      'Permanence and disfigurement opinions',
    ],
    credentialing: 'Board certification, hospital privileges, license status, and malpractice coverage are verified.',
    tierAngle: {
      metro: 'Reconstructive capability is available locally, though most practices weight elective work above injury cases.',
      mid: 'Few practices take injury work on a lien, so the ones that do carry most of the regional volume.',
      small: 'Reconstructive care almost always means travel to a larger market, planned around the surgical timeline.',
    },
    stateAngle: {
      florida:
        'Scarring and disfigurement can support a claim beyond the no-fault threshold, and documenting permanence early — while the injury is still visible — materially affects the case.',
      texas:
        'Reconstructive work is expensive and usually runs on a letter of protection, so the paid-or-incurred rule makes the difference between billed and accepted amounts a live issue at settlement.',
    },
  },
  {
    slug: 'surgery-centers',
    singular: 'surgery center',
    plural: 'surgery centers',
    practiceNoun: 'ambulatory surgery centers',
    side: 'provider',
    titleNoun: 'Personal Injury Surgery Centers',
    role: 'Provides the facility, anaesthesia, and scheduling for outpatient procedures in injury cases, usually on a letter of protection.',
    services: [
      'Outpatient orthopedic procedures',
      'Spinal injections and pain procedures',
      'Anaesthesia and recovery',
      'Facility and implant billing',
      'Surgical scheduling coordination',
    ],
    credentialing: 'Facility licensure, accreditation, and coverage are verified before cases are routed.',
    tierAngle: {
      metro: 'Several centers compete for injury volume, and scheduling turnaround is what wins the referral.',
      mid: 'Only a small number of centers take lien work, which makes terms the deciding factor.',
      small: 'Procedures generally route to a larger market, so travel and follow-up coordination are the practical constraints.',
    },
    stateAngle: {
      florida:
        'Facility charges quickly exceed the $10,000 PIP ceiling, so surgical cases in Florida turn on liability coverage and letters of protection rather than first-party benefits.',
      texas:
        'Facility and implant billing is exactly where the paid-or-incurred rule bites hardest, making transparent, consistent charges essential to what the case can actually recover.',
    },
  },
];

export const SPECIALTY_SLUGS = SPECIALTIES.map((s) => s.slug);

export function getSpecialty(slug: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.slug === slug);
}

export const providerSpecialties = () => SPECIALTIES.filter((s) => s.side === 'provider');
