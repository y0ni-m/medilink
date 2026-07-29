// Audience landing-page content.
// Static for now — shaped so it can be swapped for a headless CMS later
// (each Audience maps cleanly to one CMS entry keyed by `slug`).

export type Audience = {
  slug: string;
  /** Short label used in nav + cards */
  nav: string;
  /** "legal" | "medical" — used to group in the Solutions menu */
  group: 'legal' | 'medical';
  eyebrow: string;
  /** Plural noun for this audience, e.g. "personal injury attorneys" */
  name: string;
  /** Editorial "dossier" metadata that gives each landing page its identity */
  design: {
    index: string; // "01".."04"
    fileRef: string; // monospace reference, e.g. "CASE · PI-LAW"
    ghost: string; // oversized background word
    accent: string; // per-audience signature hex
    glyph: 'legal' | 'imaging' | 'neuro' | 'rehab';
  };
  /** Content for the animated "live referral slip" hero object */
  ticket: {
    ref: string;
    status: string;
    rows: { k: string; v: string; check?: boolean }[];
    stages: string[];
    activeStage: number;
  };
  /** Polaroid photo shown in the problem section */
  photo: { src: string; alt: string; caption: string; rotate: number };
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  hero: {
    titleLead: string;
    titleEm: string;
    sub: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  stats: { value: string; label: string }[];
  problem: {
    eyebrow: string;
    title: string;
    points: { title: string; desc: string }[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: { title: string; desc: string }[];
  };
  steps: { n: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  /** Slugs of related resource categories shown at the bottom of the page */
  resourceCategories: string[];
};

export const AUDIENCES: Audience[] = [
  {
    slug: 'lawyers',
    nav: 'For Lawyers',
    group: 'legal',
    eyebrow: 'For personal injury attorneys',
    name: 'personal injury attorneys',
    design: { index: '01', fileRef: 'CASE · PI-LAW', ghost: 'REFER', accent: '#3D5AFE', glyph: 'legal' },
    ticket: {
      ref: 'REF-2287',
      status: 'Matched',
      rows: [
        { k: 'Case type', v: 'Auto · MVA' },
        { k: 'Provider', v: 'Verified clinic' },
        { k: 'LOP', v: 'Signed', check: true },
        { k: 'Coverage', v: '12 mi radius' },
      ],
      stages: ['Referred', 'Matched', 'Treating', 'Settled'],
      activeStage: 1,
    },
    photo: { src: '/photos/marcus.jpg', alt: 'Personal injury attorney reviewing a case file', caption: 'Signed & filed', rotate: -3.5 },
    metaTitle: 'MediLink for Personal Injury Lawyers',
    metaDescription:
      'Refer clients to vetted PI clinics with open capacity — LOPs and/or patient financial responsibility, intake packets, and live treatment status in one shared timeline.',
    hero: {
      titleLead: 'Refer clients to vetted providers,',
      titleEm: 'without the phone tag.',
      sub: 'MediLink connects your firm with credentialed personal injury clinics that have capacity today — with LOPs and/or patient financial responsibility (depending on your state), intake packets, and live treatment status in one shared timeline.',
      primaryCta: { label: 'Refer a case', href: 'https://app.medilink.vip/register' },
      secondaryCta: { label: 'Call our team', href: 'tel:+18334071005' },
    },
    stats: [
      { value: 'Free', label: 'Firms join at no cost' },
      { value: '24h', label: 'Provider verification' },
      { value: '1', label: 'Timeline per case' },
    ],
    problem: {
      eyebrow: 'The old way',
      title: 'Referrals shouldn’t live in your inbox.',
      points: [
        {
          title: 'Chasing capacity',
          desc: 'Calling around to find which clinic can actually see your client this week — and whether they take PI on a lien.',
        },
        {
          title: 'Paperwork by hand',
          desc: 'Re-keying intake forms and drafting LOPs for every provider, then hoping nothing falls through the cracks.',
        },
        {
          title: 'No visibility',
          desc: 'Once a client is referred out, you’re emailing for records and guessing where treatment stands.',
        },
      ],
    },
    benefits: {
      eyebrow: 'With MediLink',
      title: 'Everything a referral needs, in one place.',
      items: [
        {
          title: 'Vetted provider network',
          desc: 'Every clinic is checked against NPI, state license, and active malpractice coverage before they receive a case.',
        },
        {
          title: 'Auto-generated paperwork',
          desc: 'LOPs and/or patient financial responsibility forms and intake packets are pre-filled and routed for signature.',
        },
        {
          title: 'Live case tracking',
          desc: 'Watch treatment progress from first visit to discharge — no more status-request emails.',
        },
        {
          title: 'Records on demand',
          desc: 'Bills and records flow back into the shared timeline, organized and settlement-ready.',
        },
      ],
    },
    steps: [
      { n: '01', title: 'Send a referral', desc: 'Add the client, injury type, and coverage area. It takes about two minutes.' },
      { n: '02', title: 'We match a vetted clinic', desc: 'MediLink routes the case to a credentialed provider with capacity in the right geography and specialty.' },
      { n: '03', title: 'Track to settlement', desc: 'Follow treatment, collect records, and reconcile LOPs — all from one shared case timeline.' },
    ],
    faqs: [
      {
        q: 'Does it cost anything for my firm to join?',
        a: 'No. Attorneys and firms join MediLink for free. Clinics are on a plan tailored to their state and case mix.',
      },
      {
        q: 'How are providers vetted?',
        a: 'Before any clinic receives a referral we verify NPI and taxonomy, state license status, active malpractice coverage, and OIG/SAM exclusion lists.',
      },
      {
        q: 'How do LOPs work across different states?',
        a: 'MediLink supports LOPs and/or patient financial responsibility depending on what is permitted in the state you operate in, and pre-fills the appropriate paperwork for each referral.',
      },
    ],
    resourceCategories: ['attorney-playbook', 'lops-billing'],
  },
  {
    slug: 'mri-clinics',
    nav: 'For MRI Clinics',
    group: 'medical',
    eyebrow: 'For MRI & imaging centers',
    name: 'MRI and imaging centers',
    design: { index: '02', fileRef: 'IMG · REQ', ghost: 'IMAGE', accent: '#0da7ca', glyph: 'imaging' },
    ticket: {
      ref: 'IMG-1043',
      status: 'Scheduled',
      rows: [
        { k: 'Modality', v: 'MRI · 1.5T' },
        { k: 'Body part', v: 'Cervical spine' },
        { k: 'LOP', v: 'Signed', check: true },
        { k: 'Attorney', v: 'Verified' },
      ],
      stages: ['Ordered', 'Scheduled', 'Read', 'Delivered'],
      activeStage: 1,
    },
    photo: { src: '/photos/maya.jpg', alt: 'Imaging center coordinator scheduling a scan', caption: 'Scan scheduled!', rotate: 3.5 },
    metaTitle: 'MediLink for MRI & Imaging Centers',
    metaDescription:
      'Fill open imaging slots with attorney-referred PI cases. Signed LOPs, clean report delivery, and settlement tracking in one workspace.',
    hero: {
      titleLead: 'Fill open imaging slots with',
      titleEm: 'attorney-referred cases.',
      sub: 'MediLink routes personal injury imaging referrals to your center — with valid scripts, signed LOPs and/or patient financial responsibility, and report delivery handled inside one shared workspace.',
      primaryCta: { label: 'Join the network', href: 'https://app.medilink.vip/register' },
      secondaryCta: { label: 'Call our team', href: 'tel:+18334071005' },
    },
    stats: [
      { value: 'PI', label: 'Cases matched to capacity' },
      { value: '0', label: 'Upfront fees or contracts' },
      { value: 'LOP', label: 'Tracked through settlement' },
    ],
    problem: {
      eyebrow: 'The old way',
      title: 'Open scanners and slow-pay don’t mix.',
      points: [
        {
          title: 'Unused capacity',
          desc: 'High-value scanner time goes empty while referral relationships take months to build.',
        },
        {
          title: 'Incomplete orders',
          desc: 'Scripts arrive missing the body part, attorney info, or a signed agreement — and then it’s phone tag.',
        },
        {
          title: 'Lien uncertainty',
          desc: 'Reading on a lien without clear attorney commitment or a tracked LOP is a real financial risk.',
        },
      ],
    },
    benefits: {
      eyebrow: 'With MediLink',
      title: 'Imaging referrals that arrive complete.',
      items: [
        {
          title: 'Qualified PI referrals',
          desc: 'Receive imaging cases matched to your modalities, schedule, and coverage area.',
        },
        {
          title: 'Signed agreements up front',
          desc: 'Every case arrives with a signed LOP and/or patient financial responsibility and verified attorney details.',
        },
        {
          title: 'Clean report delivery',
          desc: 'Send reads and images back through the timeline so attorneys always have the latest study.',
        },
        {
          title: 'Settlement-ready billing',
          desc: 'Bills and balances are tracked alongside the case through to settlement and payout.',
        },
      ],
    },
    steps: [
      { n: '01', title: 'Set your profile', desc: 'List your modalities (MRI, CT, X-ray), schedule windows, and coverage area. Verified in about 24 hours.' },
      { n: '02', title: 'Receive matched cases', desc: 'MediLink routes attorney-referred imaging that fits your capacity and specialty.' },
      { n: '03', title: 'Read, deliver, get paid', desc: 'Upload reads, deliver reports through the timeline, and track the LOP to settlement.' },
    ],
    faqs: [
      {
        q: 'What modalities do you support?',
        a: 'MediLink routes MRI, CT, X-ray, and related imaging referrals based on the modalities and case types you configure in your profile.',
      },
      {
        q: 'How do we get paid on lien cases?',
        a: 'Each referral carries a signed LOP and/or patient financial responsibility. Balances are tracked in the shared timeline through to settlement so there are no surprises.',
      },
      {
        q: 'Is there a contract or upfront fee?',
        a: 'No long-term contracts or upfront fees — you receive case flow on terms you set and can adjust your capacity anytime.',
      },
    ],
    resourceCategories: ['clinic-growth', 'lops-billing'],
  },
  {
    slug: 'tbi-doctors',
    nav: 'For TBI Doctors',
    group: 'medical',
    eyebrow: 'For TBI & neurology specialists',
    name: 'TBI and neurology specialists',
    design: { index: '03', fileRef: 'NEU · TBI', ghost: 'NEURO', accent: '#6D5AE0', glyph: 'neuro' },
    ticket: {
      ref: 'NEU-0571',
      status: 'In treatment',
      rows: [
        { k: 'Specialty', v: 'Concussion' },
        { k: 'Findings', v: 'Documented', check: true },
        { k: 'LOP', v: 'Signed', check: true },
        { k: 'Attorney', v: 'Verified' },
      ],
      stages: ['Referred', 'Eval', 'Treating', 'Settled'],
      activeStage: 2,
    },
    photo: { src: '/photos/sharma.jpg', alt: 'Neurology specialist reviewing a patient case', caption: 'Documented ✓', rotate: -3 },
    metaTitle: 'MediLink for TBI & Neurology Specialists',
    metaDescription:
      'Connect with personal injury attorneys who need traumatic brain injury expertise. Complex-case referrals, documentation that holds up, and settlement tracking.',
    hero: {
      titleLead: 'Connect with attorneys who need',
      titleEm: 'TBI expertise.',
      sub: 'MediLink matches neurology, concussion, and traumatic brain injury specialists with personal injury attorneys handling exactly the cases you’re equipped to treat — with documentation and LOPs handled in one place.',
      primaryCta: { label: 'Join the network', href: 'https://app.medilink.vip/register' },
      secondaryCta: { label: 'Call our team', href: 'tel:+18334071005' },
    },
    stats: [
      { value: 'Neuro', label: 'Cases matched to specialty' },
      { value: '24h', label: 'Credential verification' },
      { value: '1', label: 'Shared case timeline' },
    ],
    problem: {
      eyebrow: 'The old way',
      title: 'Complex cases deserve the right specialist.',
      points: [
        {
          title: 'Mismatched referrals',
          desc: 'General networks send cases that don’t fit a neuro or TBI practice — wasting everyone’s time.',
        },
        {
          title: 'Documentation gaps',
          desc: 'TBI claims rise or fall on documentation. Loose notes and missing baselines weaken the case.',
        },
        {
          title: 'Disconnected from counsel',
          desc: 'Without a direct line to the attorney, treatment context and legal context drift apart.',
        },
      ],
    },
    benefits: {
      eyebrow: 'With MediLink',
      title: 'Referrals built around your specialty.',
      items: [
        {
          title: 'Specialty-matched cases',
          desc: 'Receive concussion, post-concussive, and TBI referrals routed specifically to your expertise.',
        },
        {
          title: 'Documentation that holds up',
          desc: 'Structured intake and treatment notes keep the clinical record consistent and settlement-ready.',
        },
        {
          title: 'Direct line to counsel',
          desc: 'Share findings and status with the referring attorney inside one secure, shared timeline.',
        },
        {
          title: 'Clean LOP handling',
          desc: 'LOPs and/or patient financial responsibility are generated, signed, and tracked through settlement.',
        },
      ],
    },
    steps: [
      { n: '01', title: 'Define your specialty', desc: 'Set your sub-specialties, the case types you accept, and your coverage area.' },
      { n: '02', title: 'Receive matched cases', desc: 'MediLink routes TBI and neurology referrals that fit your practice and capacity.' },
      { n: '03', title: 'Treat and document', desc: 'Log structured notes, share findings with counsel, and track the LOP to settlement.' },
    ],
    faqs: [
      {
        q: 'What kinds of cases will I receive?',
        a: 'You configure the sub-specialties and case types you accept — for example concussion, post-concussive syndrome, or broader neurological injury — and only matched cases are routed to you.',
      },
      {
        q: 'How does MediLink help with documentation?',
        a: 'Structured intake and treatment templates keep the clinical record consistent, which matters when TBI findings are scrutinized at settlement.',
      },
      {
        q: 'Can I coordinate directly with the attorney?',
        a: 'Yes. Each case has a shared, secure timeline where you and the referring attorney can exchange status, findings, and records.',
      },
    ],
    resourceCategories: ['clinic-growth', 'compliance'],
  },
  {
    slug: 'chiropractors',
    nav: 'For Chiropractors',
    group: 'medical',
    eyebrow: 'For chiropractic & rehab clinics',
    name: 'chiropractic and rehab clinics',
    design: { index: '04', fileRef: 'REH · CHIR', ghost: 'REHAB', accent: '#E08A3C', glyph: 'rehab' },
    ticket: {
      ref: 'REH-3390',
      status: 'Active',
      rows: [
        { k: 'Treatment', v: 'Spinal rehab' },
        { k: 'Visits', v: '6 logged' },
        { k: 'LOP', v: 'Signed', check: true },
        { k: 'Coverage', v: 'Local' },
      ],
      stages: ['Referred', 'Intake', 'Treating', 'Settled'],
      activeStage: 2,
    },
    photo: { src: '/photos/sharma.jpg', alt: 'Chiropractor in the clinic with a spine model', caption: 'Case accepted!', rotate: 3 },
    metaTitle: 'MediLink for Chiropractors & Rehab Clinics',
    metaDescription:
      'Grow your personal injury caseload with steady, qualified referrals. Signed LOPs, clean documentation, and settlement tracking in one workspace.',
    hero: {
      titleLead: 'Grow your PI caseload with',
      titleEm: 'steady, qualified referrals.',
      sub: 'MediLink sends personal injury cases that match your specialty and coverage area — with signed LOPs and/or patient financial responsibility, transparent attorney details, and clean settlement payouts.',
      primaryCta: { label: 'Join the network', href: 'https://app.medilink.vip/register' },
      secondaryCta: { label: 'Call our team', href: 'tel:+18334071005' },
    },
    stats: [
      { value: '0', label: 'Upfront fees or contracts' },
      { value: '24h', label: 'Clinic verification' },
      { value: 'LOP', label: 'Tracked through settlement' },
    ],
    problem: {
      eyebrow: 'The old way',
      title: 'Marketing for PI cases is expensive and noisy.',
      points: [
        {
          title: 'Unpredictable flow',
          desc: 'Case volume swings month to month, making it hard to staff and plan around treatment.',
        },
        {
          title: 'Unclear attorney commitment',
          desc: 'Treating on a lien without a tracked agreement or clear attorney info is a gamble.',
        },
        {
          title: 'Billing headaches',
          desc: 'Reconciling balances at settlement is manual, slow, and easy to get wrong.',
        },
      ],
    },
    benefits: {
      eyebrow: 'With MediLink',
      title: 'A steady, transparent referral pipeline.',
      items: [
        {
          title: 'Curated case flow',
          desc: 'Receive PI cases matched to your specialty, capacity, and coverage area — on your terms.',
        },
        {
          title: 'Signed LOPs up front',
          desc: 'Every case arrives with a signed LOP and/or patient financial responsibility and verified attorney details.',
        },
        {
          title: 'Transparent counsel info',
          desc: 'Know exactly which firm is on the case and reach them inside the shared timeline.',
        },
        {
          title: 'Clean settlement payouts',
          desc: 'Track treatment balances through settlement so reconciliation is simple and accurate.',
        },
      ],
    },
    steps: [
      { n: '01', title: 'Set up your clinic', desc: 'Add your specialties, accepted case types, and coverage area. Verified in about 24 hours.' },
      { n: '02', title: 'Receive vetted referrals', desc: 'MediLink routes injury cases to your clinic based on geography, specialty, and capacity.' },
      { n: '03', title: 'Treat to settlement', desc: 'Log treatment, send LOPs, and track every case to settlement in one shared timeline.' },
    ],
    faqs: [
      {
        q: 'How are referrals matched to my clinic?',
        a: 'Cases are routed by geography, your accepted case types, and current capacity — so you receive PI referrals that actually fit your practice.',
      },
      {
        q: 'Do I need a contract or pay upfront?',
        a: 'No. There are no upfront fees or long-term contracts. You receive curated case flow on terms you control.',
      },
      {
        q: 'How does settlement payout work?',
        a: 'Treatment balances and the signed LOP and/or patient financial responsibility are tracked in the shared timeline through to settlement, keeping reconciliation clean.',
      },
    ],
    resourceCategories: ['clinic-growth', 'lops-billing'],
  },
];

export function getAudience(slug: string): Audience | undefined {
  return AUDIENCES.find((a) => a.slug === slug);
}

export function audienceSlugs(): string[] {
  return AUDIENCES.map((a) => a.slug);
}
