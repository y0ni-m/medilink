import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — Privacy Policy',
  description:
    'How MediLink collects, uses, and protects information about clinics, attorneys, and the cases routed through the network.',
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Privacy Policy"
        title="How we handle your information."
        intro="This policy explains what MediLink collects, how we use it, and the rights you have over your data."
        lastUpdated="May 19, 2026"
      >
        <h2>1. Who we are</h2>
        <p>
          MediLink Health, Inc. (&quot;MediLink&quot;, &quot;we&quot;, &quot;us&quot;) operates a
          referral and case-management platform that connects personal injury attorneys with vetted
          medical clinics. This policy covers our website, marketing pages, and the MediLink
          application.
        </p>

        <h2>2. Information we collect</h2>
        <h3>Information you provide</h3>
        <ul>
          <li>Account details — name, work email, role, organization, and credentials</li>
          <li>Clinic or firm profile data — specialties, locations, licensing, coverage</li>
          <li>Case data submitted by attorneys and clinics through the platform</li>
          <li>Communications you send to us (support, sales, security disclosures)</li>
        </ul>
        <h3>Information we collect automatically</h3>
        <ul>
          <li>Device, browser, and usage data (IP, pages viewed, timestamps)</li>
          <li>Cookies and similar technologies used to keep you signed in and measure performance</li>
        </ul>
        <h3>Protected Health Information (PHI)</h3>
        <p>
          When clinics and firms upload PHI to coordinate a case, MediLink processes that data as a
          Business Associate under HIPAA. PHI is handled under the BAA you sign at onboarding and
          described further in our <a href="/compliance">Compliance</a> overview.
        </p>

        <h2>3. How we use information</h2>
        <ul>
          <li>To provide, secure, and improve the MediLink platform</li>
          <li>To match referrals between attorneys and clinics</li>
          <li>To verify provider credentials and screen for sanctions</li>
          <li>To send service notifications and respond to support requests</li>
          <li>To comply with legal obligations and enforce our Terms</li>
        </ul>
        <p>
          We do not sell personal information, and we do not use PHI for advertising.
        </p>

        <h2>4. How we share information</h2>
        <p>We share information only as needed to run the service:</p>
        <ul>
          <li>
            <strong>With the other side of a referral</strong> — clinic information is shared with
            attorneys reviewing matches, and vice versa, as needed to evaluate and accept a case.
          </li>
          <li>
            <strong>With service providers</strong> — cloud hosting, identity, analytics, and
            credentialing partners that operate under contractual confidentiality and security
            obligations.
          </li>
          <li>
            <strong>For legal reasons</strong> — to comply with valid legal process or to protect
            the rights, safety, and property of MediLink or its users.
          </li>
          <li>
            <strong>In a corporate transaction</strong> — in the event of a merger, acquisition, or
            sale of assets, subject to continued protection of your information.
          </li>
        </ul>

        <h2>5. Data retention</h2>
        <p>
          We retain account and case data for as long as your organization has an active MediLink
          account, plus the period required to satisfy contractual, audit, and legal obligations
          (typically 6&ndash;7 years for healthcare records, longer where state law requires it).
          Data is then deleted or de-identified.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or export
          your personal information, or to object to certain processing. To exercise these rights,
          call us at <a href="tel:+18334071005">+1 (833) 407-1005</a>. If you are a
          patient and your information was uploaded by a clinic or firm, please contact that
          provider first — they are the covered entity that controls your record.
        </p>

        <h2>7. Security</h2>
        <p>
          MediLink uses encryption in transit and at rest, role-based access controls, and continuous
          monitoring. Details are available on our
          <a href="/compliance"> Compliance</a> page. No system is perfectly secure; if you believe
          your account has been compromised, call us at
          <a href="tel:+18334071005"> +1 (833) 407-1005</a> immediately.
        </p>

        <h2>8. International users</h2>
        <p>
          MediLink is operated from the United States and serves U.S. attorneys and clinics. If you
          access the service from outside the U.S., you understand that your information will be
          processed in the U.S. under U.S. law.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be announced through
          the application or by email at least 30 days before they take effect. The
          &quot;Last updated&quot; date at the top of this page always reflects the current version.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about this policy? Call us at
          <a href="tel:+18334071005"> +1 (833) 407-1005</a>.
        </p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
