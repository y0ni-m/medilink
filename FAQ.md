# MediLink — Frequently Asked Questions

*Source of truth: engineering repo `~/PI-Portal`, verified 2026-07-29. Safe for website FAQ page,
sales one-pagers, and social copy. Claims here are accurate to the shipped product — if you
need a claim that isn't on this list, ask the engineering agent before publishing it.*

---

## The basics

**What is MediLink?**
MediLink is a HIPAA-conscious platform where personal injury law firms and medical practices
work the same cases together — shared scheduling, patient records, document exchange, and
e-signatures in one place, instead of phone tag and fax machines.

**Who is it for?**
Three sides of the same case: medical practices that treat personal injury patients (ortho,
chiro, MRI/imaging, surgery centers, pain management), the law firms that represent those
patients, and the patients themselves — each gets their own view of the platform.

**What problem does it solve?**
A law firm calling three clinics for records status, a clinic faxing appointment updates, a
patient signing paper forms in a waiting room. On MediLink the firm sees appointments as
they're booked, records flow to the right partner automatically, and forms get signed from a
phone.

---

## For law firms

**What does MediLink cost a law firm?**
Nothing. Law firms are free, forever. Practices pay; firms collaborate at no cost.

**What can my firm actually see?**
Your clients only. For each client you represent, you see their appointments at partnered
practices as they're scheduled, treatment-related documents the practice attaches to their
file, and case status — without calling anyone.

**How do we get a client onto MediLink?**
Add them under Contacts and click "Invite to portal." They get a secure email link, set a
password, and have their own patient portal. Takes under a minute.

**Can we send clients to a specific provider?**
Yes — the directory maps every practice on the platform by location and specialty, and
partnership requests are built in. Referrals become trackable relationships, not sticky notes.

---

## For medical practices

**What does it cost?**
Per location, per month: $2,500 for most provider types, $1,000 for chiropractic practices
outside no-fault (PIP) states. Multi-location groups pay per active location. Every account
starts with a 30-day free trial.

**Do you need my credit card for the trial?**
No. Trials start without a payment method. When the trial ends, the account simply pauses
until you decide to subscribe — no surprise charges, ever.

**How does scheduling work?**
Full scheduling with configurable appointment types (MRI, ortho exam, PT, deposition…),
per-location calendars, staff availability, and automated email confirmations and reminders to
patients. Patients can also request appointments themselves from their portal, which arrive as
pending requests your front desk confirms.

**Can patients fill out forms before they arrive?**
Yes, two ways: upload your existing PDF forms and place signature fields (patients sign on the
actual document, like DocuSign), or build native questionnaires in the form builder (no PDF
needed) — answers land in the patient's chart. Both have a full audit trail.

**We already use DocuSign / PandaDoc. Do we have to rebuild everything?**
No — export your forms as PDFs and upload them into MediLink's e-sign templates; placing the
signature fields takes a few minutes per form. Direct integrations with third-party e-sign
tools are on the roadmap.

**Does MediLink integrate with our EHR?**
Not yet — EHR/practice-management sync is on the roadmap and will be prioritized by customer
demand. What eliminates most double entry today: partnered law firms see your bookings
automatically, patients self-book, and reminders go out without staff touching anything.

---

## Patients

**What do patients get?**
Their own portal: upcoming appointments (with confirm / reschedule-request / cancel), forms
waiting for signature, their documents, and a provider directory. Booking a visit with their
own practice takes four taps.

**Do patients pay anything?**
Never.

---

## Security & compliance

**Is MediLink HIPAA compliant?**
MediLink is built for HIPAA: encryption in transit and at rest, role-based access control,
per-organization data isolation enforced at the API and database layers, and audit logging on
record access, document activity, and sign-ins. We operate as a Business Associate to our
practice customers and sign a BAA at onboarding (medilink.vip/baa). Our infrastructure
providers that handle PHI are under signed BAAs with us.

**Who can see a patient's data?**
Only the organizations treating or representing that patient. Two organizations see shared
information about a patient only when both have an accepted partnership AND both have that
patient — and then only that patient's shared items. Practices never see each other's
operations, and patients only ever see their own records.

**Where is data hosted?**
In the United States, on enterprise cloud infrastructure (AWS and Supabase) under Business
Associate Agreements. Full subprocessor list: medilink.vip/subprocessors.

**Does MediLink sell or share data?**
No. Patient data is never sold, never used for advertising, and never shared with any third
party outside the subprocessors required to run the service.

---

## Billing & trials

**How does the free trial work?**
30 days, full product, no card. At the end, the account pauses until you subscribe — your data
is kept, nothing is charged.

**How does multi-location billing work?**
The subscription quantity equals your active locations — add a location and billing adjusts;
archive one and it drops. One invoice for the whole group.

**Can I cancel anytime?**
Yes, in-app (Settings → Billing → Cancel). Cancellation takes effect at the end of the paid
period, and you can resume before it lapses with one click.

**Do you accept promo codes?**
Yes — there's a promotion-code field at checkout.

---

## Quick claims for social / ads (pre-approved)

- "Law firms and doctors, finally on the same page — literally."
- "See every client appointment the moment it's booked. No calls. No faxes."
- "30-day free trial. No credit card. Nothing to cancel."
- "Law firms use MediLink free. Forever."
- "Your patients sign intake forms from their couch, not your waiting room."
- "Records flow to the right partner automatically — with an audit trail."

**Do NOT claim (not shipped / not certified):** SOC 2, text-message (SMS) notifications,
EHR integrations, AI phone answering, telehealth visits. Ask engineering before using any of
these in copy.
