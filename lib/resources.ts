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
