import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — Subprocessors',
  description:
    'The third-party service providers MediLink uses to deliver the platform, what each one does, and which of them handle protected health information.',
};

// Referenced by section 5 of the BAA (/baa), so this page has to exist and
// stay current. Source of record is PI-Portal compliance/legal/subprocessors.md,
// which is kept in step with compliance/vendors/baa-tracker.md.
//
// Deliberately no per-vendor "BAA in place" column. The internal tracker is the
// place to assert execution status per vendor; a public page that claims it for
// every row is a claim we would have to keep true on every row, and getting one
// wrong is how the compliance page ended up overstating things in the first
// place. The written-agreement commitment lives in the BAA, where it belongs.
export default function SubprocessorsPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Subprocessors"
        title="Who else touches your data, and why."
        intro="MediLink uses the third-party providers below to deliver the platform. We update this list before engaging any new subprocessor that will handle protected health information."
        lastUpdated="September 10, 2026"
      >
        <h2>Providers that handle PHI</h2>
        <p>
          These providers create, receive, maintain, or transmit protected health information on
          MediLink&apos;s behalf. We require a written agreement carrying protections consistent
          with our <a href="/baa">Business Associate Agreement</a> from every provider in this
          category.
        </p>
        <ul>
          <li>
            <strong>Amazon Web Services</strong> — application hosting, file storage, secrets
            management, and logging. United States (us-east-1).
          </li>
          <li>
            <strong>Supabase</strong> — database, authentication, and document storage. United
            States.
          </li>
        </ul>

        <h2>Providers that do not handle PHI</h2>
        <p>
          These providers support the service without access to protected health information.
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> — subscription billing. Receives billing contact and
            subscription data only; no clinical information is sent to Stripe. United States.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery for invitations, password
            resets, and account notifications. Message content carries no clinical detail. United
            States.
          </li>
          <li>
            <strong>Vercel</strong> — hosting for the static web frontend. Protected health
            information is fetched by the browser directly from our application servers and is
            never stored or processed on Vercel infrastructure. United States.
          </li>
          <li>
            <strong>Cloudflare</strong> — DNS resolution only; traffic is not proxied. Global.
          </li>
          <li>
            <strong>GitHub</strong> — source code hosting and deployment automation. No access to
            production data. United States.
          </li>
        </ul>

        <h2>Changes to this list</h2>
        <p>
          We update this page before engaging a new subprocessor that will handle protected health
          information. If you would like to be notified of changes, or have questions about any
          provider listed here, contact us through the{' '}
          <a href="/compliance">Compliance</a> page.
        </p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
