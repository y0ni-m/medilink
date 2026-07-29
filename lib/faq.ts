// FAQ content — sourced from FAQ.md (verified 2026-07-29).
// Grouped by section; rendered as accordions on /faq.

export type FaqItem = { q: string; a: string };
export type FaqSection = { id: string; title: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 'basics',
    title: 'The basics',
    items: [
      {
        q: 'What is MediLink?',
        a: 'MediLink is a HIPAA-conscious platform where personal injury law firms and medical practices work the same cases together — shared scheduling, patient records, document exchange, and e-signatures in one place, instead of phone tag and fax machines.',
      },
      {
        q: 'Who is it for?',
        a: 'Three sides of the same case: medical practices that treat personal injury patients (ortho, chiro, MRI/imaging, surgery centers, pain management), the law firms that represent those patients, and the patients themselves — each gets their own view of the platform.',
      },
      {
        q: 'What problem does it solve?',
        a: 'A law firm calling three clinics for records status, a clinic faxing appointment updates, a patient signing paper forms in a waiting room. On MediLink the firm sees appointments as they’re booked, records flow to the right partner automatically, and forms get signed from a phone.',
      },
    ],
  },
  {
    id: 'law-firms',
    title: 'For law firms',
    items: [
      {
        q: 'What does MediLink cost a law firm?',
        a: 'Nothing. Law firms are free, forever. Practices pay; firms collaborate at no cost.',
      },
      {
        q: 'What can my firm actually see?',
        a: 'Your clients only. For each client you represent, you see their appointments at partnered practices as they’re scheduled, treatment-related documents the practice attaches to their file, and case status — without calling anyone.',
      },
      {
        q: 'How do we get a client onto MediLink?',
        a: 'Add them under Contacts and click “Invite to portal.” They get a secure email link, set a password, and have their own patient portal. Takes under a minute.',
      },
      {
        q: 'Can we send clients to a specific provider?',
        a: 'Yes — the directory maps every practice on the platform by location and specialty, and partnership requests are built in. Referrals become trackable relationships, not sticky notes.',
      },
    ],
  },
  {
    id: 'practices',
    title: 'For medical practices',
    items: [
      {
        q: 'What does it cost?',
        a: 'Pricing is per location, per month, and varies by provider type — chiropractic practices outside no-fault (PIP) states are priced lower. Multi-location groups pay per active location, and every account starts with a 30-day free trial. Talk to our team for a quote tailored to your practice.',
      },
      {
        q: 'Do you need my credit card for the trial?',
        a: 'No. Trials start without a payment method. When the trial ends, the account simply pauses until you decide to subscribe — no surprise charges, ever.',
      },
      {
        q: 'How does scheduling work?',
        a: 'Full scheduling with configurable appointment types (MRI, ortho exam, PT, deposition…), per-location calendars, staff availability, and automated email confirmations and reminders to patients. Patients can also request appointments themselves from their portal, which arrive as pending requests your front desk confirms.',
      },
      {
        q: 'Can patients fill out forms before they arrive?',
        a: 'Yes, two ways: upload your existing PDF forms and place signature fields (patients sign on the actual document, like DocuSign), or build native questionnaires in the form builder (no PDF needed) — answers land in the patient’s chart. Both have a full audit trail.',
      },
      {
        q: 'We already use DocuSign / PandaDoc. Do we have to rebuild everything?',
        a: 'No — export your forms as PDFs and upload them into MediLink’s e-sign templates; placing the signature fields takes a few minutes per form. Direct integrations with third-party e-sign tools are on the roadmap.',
      },
      {
        q: 'Does MediLink integrate with our EHR?',
        a: 'Not yet — EHR/practice-management sync is on the roadmap and will be prioritized by customer demand. What eliminates most double entry today: partnered law firms see your bookings automatically, patients self-book, and reminders go out without staff touching anything.',
      },
    ],
  },
  {
    id: 'patients',
    title: 'Patients',
    items: [
      {
        q: 'What do patients get?',
        a: 'Their own portal: upcoming appointments (with confirm / reschedule-request / cancel), forms waiting for signature, their documents, and a provider directory. Booking a visit with their own practice takes four taps.',
      },
      {
        q: 'Do patients pay anything?',
        a: 'Never.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & compliance',
    items: [
      {
        q: 'Is MediLink HIPAA compliant?',
        a: 'MediLink is built for HIPAA: encryption in transit and at rest, role-based access control, per-organization data isolation enforced at the API and database layers, and audit logging on record access, document activity, and sign-ins. We operate as a Business Associate to our practice customers and sign a BAA at onboarding. Our infrastructure providers that handle PHI are under signed BAAs with us.',
      },
      {
        q: 'Who can see a patient’s data?',
        a: 'Only the organizations treating or representing that patient. Two organizations see shared information about a patient only when both have an accepted partnership AND both have that patient — and then only that patient’s shared items. Practices never see each other’s operations, and patients only ever see their own records.',
      },
      {
        q: 'Where is data hosted?',
        a: 'In the United States, on enterprise cloud infrastructure (AWS and Supabase) under Business Associate Agreements.',
      },
      {
        q: 'Does MediLink sell or share data?',
        a: 'No. Patient data is never sold, never used for advertising, and never shared with any third party outside the subprocessors required to run the service.',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & trials',
    items: [
      {
        q: 'How does the free trial work?',
        a: '30 days, full product, no card. At the end, the account pauses until you subscribe — your data is kept, nothing is charged.',
      },
      {
        q: 'How does multi-location billing work?',
        a: 'The subscription quantity equals your active locations — add a location and billing adjusts; archive one and it drops. One invoice for the whole group.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes, in-app (Settings → Billing → Cancel). Cancellation takes effect at the end of the paid period, and you can resume before it lapses with one click.',
      },
      {
        q: 'Do you accept promo codes?',
        a: 'Yes — there’s a promotion-code field at checkout.',
      },
    ],
  },
];
