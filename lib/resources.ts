// Resources / blog content.
// Static for now. The shapes here are intentionally CMS-friendly:
//  - a Post maps to one CMS entry keyed by `slug`
//  - `body` is an ordered list of typed blocks, which most headless CMSes
//    (Sanity, Contentful, Hygraph, Payload) can emit directly.
// When we wire up a CMS, replace the arrays below with a fetch and keep the types.

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string; // Category.slug
  author: { name: string; role: string };
  /** ISO date — published date */
  date: string;
  readMinutes: number;
  tags: string[];
  /** Whether to highlight on the resources index */
  featured?: boolean;
  body: Block[];
};

export type OnboardingVideo = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  vimeoId: string;
  /** padding-top percentage for the responsive embed (aspect ratio) */
  aspect: string;
};

export const ONBOARDING_VIDEOS: OnboardingVideo[] = [
  {
    slug: 'medical-providers',
    title: 'Medical Provider Onboarding',
    audience: 'For clinics & providers',
    description:
      'From profile setup to your first matched referral — how clinics get verified and live on MediLink.',
    vimeoId: '1206840423',
    aspect: '56.25%',
  },
  {
    slug: 'law-firms',
    title: 'Law Firm Onboarding',
    audience: 'For attorneys & firms',
    description:
      'How firms send their first referral, track treatment, and follow every case to settlement.',
    vimeoId: '1206853322',
    aspect: '56.25%',
  },
];

export const CATEGORIES: Category[] = [
  {
    slug: 'attorney-playbook',
    name: 'Attorney Playbook',
    description: 'Tactics for placing referrals and building durable provider relationships.',
  },
  {
    slug: 'clinic-growth',
    name: 'Clinic Growth',
    description: 'How medical providers build a steady, qualified personal injury caseload.',
  },
  {
    slug: 'lops-billing',
    name: 'LOPs & Billing',
    description: 'Letters of protection, patient financial responsibility, and getting paid at settlement.',
  },
  {
    slug: 'compliance',
    name: 'Compliance & Regulation',
    description: 'HIPAA, state referral rules, and keeping PI workflows on the right side of the line.',
  },
];

export const POSTS: Post[] = [
  {
    slug: 'two-worlds-one-case-fax-machines',
    title: 'Two Worlds, One Case: Why Personal Injury Still Runs on Fax Machines',
    excerpt:
      'Two professionals work the same case for the same person — with no shared system between them. In personal injury, that disconnect is the default, and it’s expensive.',
    category: 'attorney-playbook',
    author: { name: 'MediLink Team', role: 'Editorial' },
    date: '2026-08-06',
    readMinutes: 5,
    tags: ['coordination', 'legal tech', 'referrals', 'workflow'],
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Walk into almost any personal injury law firm and you’ll find someone on hold. On the other end is a medical clinic’s front desk, and the question is always some version of the same thing: can you tell me the status of my client’s treatment, or have those records gone out yet?',
      },
      {
        type: 'p',
        text: 'Now walk into the clinic. Someone there is feeding a document into a fax machine — in 2026 — because that’s still how a lot of treatment updates and records move between a provider and the attorney representing the patient.',
      },
      {
        type: 'p',
        text: 'Two professionals, working the exact same case, for the exact same person, with no shared system between them. That’s not an edge case. In personal injury, it’s the default.',
      },
      { type: 'h2', text: 'The case lives in two worlds' },
      {
        type: 'p',
        text: 'Every personal injury matter has two sides that have to move together: the law firm, building the case and gathering the documentation that determines the outcome, and the medical practice, treating the patient and producing the records the case rests on. The patient sits in the middle — often signing paper forms in a waiting room and answering the same questions for the third time.',
      },
      {
        type: 'p',
        text: 'These two worlds are deeply dependent on each other, yet they almost never share infrastructure. The firm has its case management software. The clinic has its scheduling and charting. Between them? Phone calls, faxes, and a lot of “let me check and get back to you.”',
      },
      { type: 'h2', text: 'Why the disconnect is expensive' },
      {
        type: 'p',
        text: 'It’s easy to write this off as annoying but harmless. It isn’t. The gap between the legal and medical sides of a case creates real, compounding costs:',
      },
      {
        type: 'ul',
        items: [
          'Time bleeds out of every case — status calls and records requests are never billable, never clinical, and never end.',
          'Documentation gaps weaken cases — when updates travel by fax and memory, a missing baseline or an unlogged visit quietly erodes the record.',
          'The patient experience suffers — the injured person re-signs forms and repeats their history, wondering why their lawyer and doctor aren’t talking.',
          'Referrals stay fragile — a trusted relationship lives in one paralegal’s contacts, one staffing change away from breaking.',
        ],
      },
      { type: 'h2', text: 'What “connected” actually looks like' },
      {
        type: 'p',
        text: 'The fix isn’t a better fax machine. It’s a shared workspace where the firm and the clinic see the same case at the same time.',
      },
      {
        type: 'ul',
        items: [
          'Appointments visible the moment they’re booked — the firm doesn’t call to ask; it just sees.',
          'Records that flow to the right partner automatically, with an audit trail, instead of a records-request queue.',
          'Forms and e-signatures the patient completes from their phone, before they reach the waiting room.',
          'Referrals that become trackable relationships in a directory, not sticky notes.',
        ],
      },
      {
        type: 'p',
        text: 'None of this replaces the lawyer’s judgment or the doctor’s care. It removes the busywork around them — the coordination tax that neither side signed up to pay.',
      },
      { type: 'h2', text: 'The quiet shift already underway' },
      {
        type: 'p',
        text: 'The firms and practices pulling ahead aren’t necessarily better at law or medicine than their peers. They’ve just stopped treating coordination as a manual chore and started treating it as infrastructure.',
      },
      {
        type: 'p',
        text: 'That’s the idea behind MediLink — one HIPAA-built platform where personal injury law firms and medical practices work the same cases together: shared scheduling, records, document exchange, and e-signatures, instead of phone tag and fax machines. Law firms use it free; practices start with a 30-day trial.',
      },
      { type: 'quote', text: 'Two worlds. One case. It’s time they shared a page.' },
    ],
  },
  {
    slug: 'attorney-guide-coordinating-medical-care',
    title: 'A Personal Injury Attorney’s Guide to Coordinating Medical Care',
    excerpt:
      'The law is the law — but the treatment record is the evidence. A practical framework for managing the medical side of a personal injury case.',
    category: 'attorney-playbook',
    author: { name: 'MediLink Team', role: 'Attorney Success' },
    date: '2026-08-05',
    readMinutes: 6,
    tags: ['attorneys', 'medical records', 'case management', 'referrals'],
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Ask a seasoned personal injury attorney what separates a strong case from a weak one, and medical coordination will come up fast. The law is the law — but the treatment record is the evidence. How well you manage the medical side of a case often decides how well the case ends.',
      },
      {
        type: 'p',
        text: 'Most of that coordination happens outside the courtroom, in the unglamorous world of scheduling, records, and follow-up. Here’s a practical framework for doing it well.',
      },
      { type: 'h2', text: '1. Get the client to the right provider — quickly' },
      {
        type: 'p',
        text: 'Two things matter most in the first weeks: specialty fit and speed. A suspected traumatic brain injury doesn’t belong at a general clinic, and soft-tissue rehab doesn’t belong at an imaging center — matching the injury to the right provider produces better care and a cleaner record. And a provider who can’t see your client for six weeks isn’t really available; gaps in early treatment are one of the first things scrutinized.',
      },
      {
        type: 'p',
        text: 'Before you refer, confirm the basics: active NPI and appropriate taxonomy, current state license, malpractice coverage, and no exclusions on the OIG or SAM lists. Credentialing is the floor, not the ceiling — but skipping it is how cases get exposed.',
      },
      { type: 'h2', text: '2. Treat documentation as evidence from day one' },
      {
        type: 'p',
        text: 'When a case is evaluated, the medical record carries the weight. Providers who keep consistent, structured notes — clear baselines, objective findings, a coherent treatment arc — give you far more to work with. You can’t dictate another professional’s charting, but you can:',
      },
      {
        type: 'ul',
        items: [
          'Refer to providers with documentation discipline — it’s a real differentiator; treat it like one.',
          'Establish clear baselines early, especially for injuries (TBI, spinal) where the finding is the case.',
          'Watch for continuity — scattered notes and missing visits read as a scattered injury.',
        ],
      },
      { type: 'h2', text: '3. Sort out the financial arrangement before treatment starts' },
      {
        type: 'p',
        text: 'Who pays, and when, is rarely as simple as a standard insurance claim. Depending on your state, treatment may proceed on a letter of protection (LOP) — payment deferred until settlement — or on the basis of the patient’s own financial responsibility. States differ on disclosure, fee-splitting, and anti-kickback rules, so don’t let the paperwork trail the treatment: the right agreement, signed up front, keeps the financial picture clean all the way to settlement.',
      },
      {
        type: 'p',
        text: 'This is general information, not legal advice — confirm the rules that apply in your jurisdiction.',
      },
      { type: 'h2', text: '4. Kill the status-call habit' },
      {
        type: 'p',
        text: 'The quiet productivity drain in most firms is chasing the medical side by phone — calling for appointment status, for records, to confirm a client actually showed up. Every one of those calls is time that isn’t legal work. The fix isn’t to call more efficiently; it’s to not have to call at all. When you can see a client’s appointments as they’re scheduled and watch records flow back automatically, the whole category of “checking in” disappears.',
      },
      { type: 'h2', text: '5. Make the referral relationship durable' },
      {
        type: 'p',
        text: 'When you find a clinic that treats your clients well and documents cleanly, that relationship is worth protecting. Too often it lives in one paralegal’s head. Put it on a system instead:',
      },
      {
        type: 'ul',
        items: [
          'Track which providers you work with, by location and specialty.',
          'Make partnership and referral a repeatable process, not a favor.',
          'Keep the case timeline in one shared place, so context survives staff changes.',
        ],
      },
      { type: 'h2', text: 'The takeaway' },
      {
        type: 'p',
        text: 'Coordinating medical care is a legal skill, even though none of it happens in front of a judge. The attorneys who do it well refer thoughtfully, insist on documentation, settle the financials early, and stop drowning in status calls — increasingly on shared infrastructure that puts the firm and the clinic on the same page.',
      },
      { type: 'quote', text: 'Your client’s treatment record is your case. Manage it like it.' },
    ],
  },
  {
    slug: 'providers-playbook-personal-injury',
    title: 'Should Your Practice Take More Personal Injury Cases? A Provider’s Playbook',
    excerpt:
      'Most practices already take personal injury cases. The better question is how to take them in a way that’s actually good for the practice.',
    category: 'clinic-growth',
    author: { name: 'MediLink Team', role: 'Provider Growth' },
    date: '2026-08-04',
    readMinutes: 6,
    tags: ['clinics', 'growth', 'LOP', 'intake'],
    body: [
      {
        type: 'p',
        text: 'For a lot of medical practices — orthopedics, chiropractic, imaging, pain management, surgery centers — personal injury patients are a meaningful part of the business. And for just as many, they’re a source of quiet frustration: unpredictable volume, murky payment, and a mountain of coordination with law firms.',
      },
      {
        type: 'p',
        text: 'The question isn’t really whether to take personal injury cases — most practices already do. The better question is how to take them in a way that’s actually good for the practice. Here’s a playbook.',
      },
      { type: 'h2', text: 'Start with the honest math' },
      {
        type: 'p',
        text: 'Personal injury cases have a different economic profile than standard insurance visits. Three things make them harder to run:',
      },
      {
        type: 'ul',
        items: [
          'Unpredictable flow — case volume swings month to month, making staffing and scheduling a guessing game.',
          'Slow, uncertain payment — treating on a lien means getting paid at settlement, sometimes much later, and only if the arrangement is documented and tracked.',
          'Coordination overhead — every case comes with a law firm that needs records, updates, and confirmations, and that’s real staff time.',
        ],
      },
      {
        type: 'p',
        text: 'None of these are reasons to avoid the work. They’re reasons to be deliberate about it.',
      },
      { type: 'h2', text: 'Fix the intake, not the marketing' },
      {
        type: 'p',
        text: 'Most practices try to grow volume by spending more on marketing. But the bigger lever is usually intake quality — making sure the cases you already accept arrive complete. The fastest way to lose money on a personal injury case is to accept one that’s missing pieces: no valid script, no attorney details, no signed agreement. Then your staff spends the week on phone tag instead of patients. A clean case arrives with:',
      },
      {
        type: 'ul',
        items: [
          'Verified attorney information — you know exactly who’s representing the patient and how to reach them.',
          'A signed agreement up front — a letter of protection and/or patient financial responsibility, depending on your state.',
          'The clinical context you need to schedule and treat without chasing.',
        ],
      },
      { type: 'h2', text: 'Protect yourself on the money' },
      {
        type: 'p',
        text: 'If you’re treating on a lien, the agreement is the asset. A few disciplines make settlement reconciliation a confirmation instead of an investigation:',
      },
      {
        type: 'ul',
        items: [
          'Get the signed LOP or financial-responsibility form before treatment, not after.',
          'Track the running balance alongside the treatment record, so nothing is a surprise at settlement.',
          'Know your state’s rules — LOPs aren’t treated the same everywhere; where they’re restricted, direct patient financial responsibility may be the right path.',
        ],
      },
      { type: 'h2', text: 'Make documentation a system, not a habit' },
      {
        type: 'p',
        text: 'For personal injury patients, your notes may be read closely long after the visit. Structured intake and consistent treatment notes — clear baselines, objective findings, a coherent arc — protect the patient’s case and your bill. Build it into your templates so it happens by default, not by discipline.',
      },
      { type: 'h2', text: 'Stop absorbing the coordination tax' },
      {
        type: 'p',
        text: 'Most practices just accept the endless back-and-forth with law firms — faxing updates, fielding records requests, confirming appointments by phone. It doesn’t have to work that way. When the referring firm can see appointments the moment they’re booked, and records flow to them automatically with an audit trail, your staff stops being a switchboard. Patients can even book and complete intake forms from their own phone, so pending requests land ready for your front desk to confirm.',
      },
      { type: 'h2', text: 'The takeaway' },
      {
        type: 'p',
        text: 'Taking more personal injury cases is only worth it if each case is clean, documented, and paid. That comes down to four things: better intake, protected financials, systematic documentation, and killing the coordination tax. Do those well, and personal injury stops being the frustrating corner of the schedule — and starts being a steady, predictable part of the practice.',
      },
    ],
  },
  {
    slug: 'lop-vs-patient-financial-responsibility',
    title: 'LOPs vs. patient financial responsibility: what changes by state',
    excerpt:
      'Letters of protection aren’t available everywhere. Here’s how to think about LOPs and patient financial responsibility depending on where you operate.',
    category: 'lops-billing',
    author: { name: 'MediLink Team', role: 'Network Operations' },
    date: '2026-05-28',
    readMinutes: 6,
    tags: ['LOP', 'billing', 'state law', 'settlement'],
    featured: true,
    body: [
      {
        type: 'p',
        text: 'In personal injury treatment, the question of who pays — and when — is rarely as simple as a standard insurance claim. Two mechanisms dominate the conversation: the letter of protection (LOP) and direct patient financial responsibility. Which one applies depends heavily on the state you operate in.',
      },
      { type: 'h2', text: 'What a letter of protection actually is' },
      {
        type: 'p',
        text: 'A letter of protection is an agreement, typically signed by the patient and acknowledged by their attorney, that directs payment for medical treatment to come out of the eventual settlement or judgment. It lets an injured person get care now and defers payment until the case resolves.',
      },
      {
        type: 'p',
        text: 'For the provider, an LOP is a promise of payment tied to the outcome of the legal case rather than to an insurer. That makes documentation and a clear paper trail essential — the value of the LOP is only as strong as the records behind it.',
      },
      { type: 'h2', text: 'Why state rules matter' },
      {
        type: 'p',
        text: 'States differ on how LOPs are treated, how medical bills are presented at trial, and how referral relationships between attorneys and providers may be structured. Some states have introduced disclosure requirements for LOPs; others limit or scrutinize arrangements that look like fee-splitting or improper solicitation.',
      },
      {
        type: 'ul',
        items: [
          'Some states require LOPs and related financial arrangements to be disclosed during litigation.',
          'Anti-kickback and fee-splitting rules shape how attorneys and clinics can work together.',
          'Where LOPs are restricted, direct patient financial responsibility — with the patient as the responsible party — may be the appropriate path.',
        ],
      },
      {
        type: 'quote',
        text: 'The practical takeaway: the right instrument depends on the jurisdiction. Build your workflow so the correct paperwork follows automatically from where the case lives.',
      },
      { type: 'h2', text: 'Patient financial responsibility as the alternative' },
      {
        type: 'p',
        text: 'When an LOP isn’t the right fit, treatment can proceed on the basis of the patient’s own financial responsibility. The patient remains the responsible party for the balance, which may still be satisfied from a settlement, but the legal framing is different and the documentation requirements shift accordingly.',
      },
      { type: 'h2', text: 'How MediLink handles the difference' },
      {
        type: 'p',
        text: 'Rather than asking every clinic and firm to memorize the rules of each state, MediLink supports LOPs and/or patient financial responsibility depending on what state you are operating in, and pre-fills the appropriate agreement for each referral. The signed instrument and the running balance live in the same shared timeline as the treatment record — so when the case settles, reconciliation is straightforward.',
      },
      {
        type: 'p',
        text: 'This article is general information, not legal advice. Confirm the requirements that apply to your jurisdiction with qualified counsel.',
      },
    ],
  },
  {
    slug: 'choosing-medical-providers-for-pi-cases',
    title: 'How attorneys should vet medical providers for PI cases',
    excerpt:
      'The provider you refer to shapes both your client’s recovery and your case. A practical checklist for choosing well.',
    category: 'attorney-playbook',
    author: { name: 'MediLink Team', role: 'Attorney Success' },
    date: '2026-05-15',
    readMinutes: 5,
    tags: ['referrals', 'vetting', 'attorneys', 'providers'],
    featured: true,
    body: [
      {
        type: 'p',
        text: 'For a personal injury attorney, the choice of medical provider is one of the highest-leverage decisions in a case. The right provider gives your client appropriate care and produces a clean, defensible record. The wrong one can undermine both. Here’s how to vet before you refer.',
      },
      { type: 'h2', text: 'Start with credentials' },
      {
        type: 'p',
        text: 'Credentialing is the floor, not the ceiling — but skipping it is how cases get exposed. At minimum, confirm the basics before a client ever walks in the door.',
      },
      {
        type: 'ul',
        items: [
          'Active NPI and a provider taxonomy that matches the treatment.',
          'Current, unrestricted state license with the relevant board.',
          'Active malpractice coverage with adequate limits.',
          'No exclusions on the OIG-LEIE or SAM lists.',
        ],
      },
      { type: 'h2', text: 'Match the specialty to the injury' },
      {
        type: 'p',
        text: 'A general clinic is not the right destination for a suspected traumatic brain injury, and an imaging center is not where soft-tissue rehab belongs. Referring to a provider whose specialty fits the injury produces better outcomes and documentation that withstands scrutiny.',
      },
      { type: 'h2', text: 'Look at documentation discipline' },
      {
        type: 'p',
        text: 'When a case is evaluated, the medical record carries the weight. Providers who keep consistent, structured notes — clear baselines, objective findings, and a coherent treatment arc — give you far more to work with than providers who don’t.',
      },
      {
        type: 'quote',
        text: 'A referral is a clinical decision and an evidentiary one at the same time. Treat it that way.',
      },
      { type: 'h2', text: 'Confirm capacity before you promise care' },
      {
        type: 'p',
        text: 'A provider who can’t see your client for six weeks isn’t actually available. Capacity and geography matter as much as credentials when a client needs care now.',
      },
      { type: 'h2', text: 'Let the network do the legwork' },
      {
        type: 'p',
        text: 'MediLink verifies every clinic against NPI, license, and malpractice coverage before it can receive a referral, and matches cases by specialty, geography, and current capacity. Instead of maintaining your own provider rolodex and re-checking it by hand, you refer into a network that has already done the vetting — and you keep visibility on the case the whole way through.',
      },
    ],
  },
  {
    slug: 'building-steady-pi-referral-pipeline',
    title: 'Building a steady PI referral pipeline for your clinic',
    excerpt:
      'Word-of-mouth and ad spend are unpredictable. Here’s how clinics build a reliable flow of qualified personal injury referrals.',
    category: 'clinic-growth',
    author: { name: 'MediLink Team', role: 'Provider Growth' },
    date: '2026-04-30',
    readMinutes: 5,
    tags: ['growth', 'referrals', 'clinics', 'pipeline'],
    body: [
      {
        type: 'p',
        text: 'Most clinics grow their personal injury caseload through some mix of word-of-mouth, attorney relationships, and paid marketing. All three work — and all three are unpredictable. A pipeline you can plan around looks different.',
      },
      { type: 'h2', text: 'Why the usual playbook stalls' },
      {
        type: 'ul',
        items: [
          'Word-of-mouth is real but slow, and impossible to forecast month to month.',
          'Paid acquisition is expensive and brings unqualified leads alongside the good ones.',
          'One-off attorney relationships concentrate risk — lose a referrer and volume drops.',
        ],
      },
      { type: 'h2', text: 'What a real pipeline requires' },
      {
        type: 'p',
        text: 'A dependable referral pipeline has three properties: the cases match what you actually treat, the financial arrangement is clear before treatment begins, and you can adjust the flow as your capacity changes.',
      },
      {
        type: 'quote',
        text: 'Predictable beats high-volume. A clinic that can plan its week schedules better, treats better, and gets paid more cleanly.',
      },
      { type: 'h2', text: 'Make every referral arrive complete' },
      {
        type: 'p',
        text: 'The fastest way to lose time is to receive a referral missing the script, the attorney details, or a signed agreement. When cases arrive complete — verified counsel, a signed LOP and/or patient financial responsibility, and the clinical context — your front desk spends its time on patients instead of phone tag.',
      },
      { type: 'h2', text: 'Track to settlement so reconciliation is clean' },
      {
        type: 'p',
        text: 'Growth isn’t only about getting cases in the door; it’s about getting paid at the end. Tracking the running balance and the signed agreement alongside the treatment record means settlement reconciliation is a confirmation, not an investigation.',
      },
      { type: 'h2', text: 'How MediLink fits in' },
      {
        type: 'p',
        text: 'MediLink routes PI cases to your clinic based on geography, specialty, and current capacity — with no upfront fees or long-term contracts. Each referral arrives with verified attorney information and a signed agreement, and every case is tracked through settlement in one shared timeline. The result is a pipeline you can actually plan around.',
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function postsByCategory(slug: string): Post[] {
  return POSTS.filter((p) => p.category === slug);
}

export function postSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

/** Most recent first */
export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(iso: string): string {
  // Deterministic, locale-stable formatting (avoids hydration mismatch).
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
