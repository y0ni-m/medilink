import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — Compliance',
  description:
    'MediLink is built around HIPAA and the regulatory requirements that govern personal injury referrals.',
};

export default function CompliancePage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Compliance"
        title="Built for the rules that govern PI referrals."
        intro="MediLink handles protected health information and case data. We treat compliance as a baseline requirement, not an afterthought."
        lastUpdated="May 19, 2026"
      >
        <div className="legal-grid">
          <div className="legal-grid-item">
            <b>HIPAA</b>
            <span>Administrative, physical, and technical safeguards across the platform.</span>
          </div>
          <div className="legal-grid-item">
            <b>Encryption</b>
            <span>PHI encrypted in transit (TLS 1.2+) and at rest (AES-256).</span>
          </div>
          <div className="legal-grid-item">
            <b>BAA available</b>
            <span>Business Associate Agreement signed with every clinic and firm at onboarding.</span>
          </div>
          <div className="legal-grid-item">
            <b>State licensing</b>
            <span>Provider credentials verified against NPI, state license, and malpractice records.</span>
          </div>
        </div>

        <h2>HIPAA</h2>
        <p>
          MediLink is a covered entity&apos;s business associate when it processes protected health
          information (PHI) on behalf of medical providers and law firms. We maintain administrative,
          physical, and technical safeguards consistent with the HIPAA Privacy and Security Rules,
          including:
        </p>
        <ul>
          <li>Access controls with role-based permissions and least-privilege defaults</li>
          <li>Encryption of PHI in transit (TLS 1.2+) and at rest (AES-256)</li>
          <li>Audit logging on all PHI access, with tamper-evident retention</li>
          <li>Workforce training on HIPAA and incident response</li>
          <li>Documented breach notification procedures consistent with 45 CFR §164.400</li>
        </ul>
        <p>
          We sign a Business Associate Agreement (BAA) with every clinic, firm, and downstream
          subcontractor that touches PHI. A standard BAA is provided during onboarding and can be
          reviewed in advance on request.
        </p>

        <h2>Data security</h2>
        <ul>
          <li>Hosted on U.S. cloud infrastructure</li>
          <li>Multi-factor authentication required for all staff and admin accounts</li>
          <li>Production access restricted to a small, audited group of engineers</li>
          <li>Continuous vulnerability scanning and periodic third-party penetration testing</li>
          <li>Backups encrypted and geographically replicated; documented recovery objectives</li>
        </ul>

        <h2>Provider verification</h2>
        <p>
          Before a clinic is matched with referrals, we verify:
        </p>
        <ul>
          <li>National Provider Identifier (NPI) and provider taxonomy</li>
          <li>State medical license status with the applicable licensing board</li>
          <li>Active malpractice coverage with sufficient limits</li>
          <li>Sanction screening against OIG-LEIE and SAM exclusion lists</li>
        </ul>

        <h2>State law &amp; PI-specific rules</h2>
        <p>
          Personal injury referrals are governed by overlapping state rules — including
          fee-splitting, anti-kickback, and physician self-referral restrictions. MediLink&apos;s
          operating model is designed so that attorneys and clinics each contract directly with
          MediLink for software and verification services, not for case-by-case referral payments.
          Availability and pricing of certain features may vary by state.
        </p>
        <div className="legal-callout">
          MediLink does not provide legal advice. Each user is responsible for confirming that its
          use of the platform complies with the bar rules and medical practice regulations of the
          jurisdictions in which it operates.
        </div>

        <h2>Reporting a security issue</h2>
        <p>
          If you believe you&apos;ve found a security vulnerability or a privacy incident affecting
          MediLink, please call us at
          <a href="tel:+18334071005"> +1 (833) 407-1005</a>. We acknowledge reports
          within one business day and respond on a coordinated-disclosure basis.
        </p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
