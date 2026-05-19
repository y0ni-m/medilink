import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — Terms of Service',
  description:
    'The terms that govern use of the MediLink platform by attorneys, clinics, and their authorized users.',
};

export default function TermsPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Terms of Service"
        title="The agreement between you and MediLink."
        intro="By creating a MediLink account or using the platform, you agree to these Terms on behalf of yourself and the organization you represent."
        lastUpdated="May 19, 2026"
      >
        <h2>1. The service</h2>
        <p>
          MediLink provides software that helps personal injury attorneys and medical clinics
          coordinate referrals, letters of protection (LOPs), case status, and related
          communications. MediLink is a neutral platform: it does not provide legal advice, medical
          advice, or representation, and it does not direct or control how attorneys or clinics
          handle a particular case.
        </p>

        <h2>2. Eligibility &amp; accounts</h2>
        <ul>
          <li>You must be a licensed attorney, an authorized representative of a law firm, or an authorized representative of a medical clinic or health system.</li>
          <li>You must provide accurate registration information and keep it current.</li>
          <li>You are responsible for activity that occurs under your account credentials.</li>
          <li>MediLink may verify credentials and deny or suspend access if verification fails or for suspected misuse.</li>
        </ul>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service in violation of law, bar rules, or medical practice regulations</li>
          <li>Pay or accept anything of value for the act of referring a specific case in violation of applicable anti-kickback or fee-splitting rules</li>
          <li>Misrepresent credentials, licensing, or coverage</li>
          <li>Upload malware, scrape the platform, or interfere with other users</li>
          <li>Share PHI outside of the channels MediLink provides for that purpose</li>
        </ul>

        <h2>4. Fees</h2>
        <p>
          Attorney accounts are free. Clinic accounts are billed at the rate shown on our
          <a href="/pricing"> Pricing</a> page or in your order form. Prices may vary by state.
          Fees are billed in advance, are non-refundable except as required by law, and may change
          on 30 days&apos; notice for renewal terms.
        </p>

        <h2>5. Your content &amp; data</h2>
        <p>
          You retain ownership of the information your organization submits. You grant MediLink a
          limited license to host, process, and display that information solely as needed to
          operate the service for you. PHI is governed by the Business Associate Agreement (BAA)
          signed at onboarding, which controls in the event of any conflict with these Terms.
        </p>

        <h2>6. No professional advice</h2>
        <p>
          MediLink does not endorse any clinic or attorney listed on the platform and does not
          guarantee outcomes. Attorneys remain solely responsible for legal representation,
          including independent judgment about which providers their clients use. Clinics remain
          solely responsible for clinical care.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          The service is provided &quot;as is.&quot; To the maximum extent permitted by law,
          MediLink disclaims all warranties, express or implied, including merchantability, fitness
          for a particular purpose, and non-infringement.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, MediLink&apos;s aggregate liability arising from
          or related to the service will not exceed the greater of (a) the fees you paid to
          MediLink in the twelve months before the event giving rise to the claim, or (b) one
          hundred U.S. dollars. MediLink will not be liable for any indirect, incidental, special,
          consequential, or punitive damages.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold MediLink harmless from claims arising from your
          breach of these Terms, your violation of law, or your provision of legal or medical
          services to a client or patient.
        </p>

        <h2>10. Termination</h2>
        <p>
          Either party may terminate for material breach if the breach is not cured within 30 days
          of written notice. MediLink may suspend access immediately for security reasons or
          suspected misuse. On termination, your right to use the service ends; export your data
          before that date.
        </p>

        <h2>11. Governing law &amp; disputes</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, without regard to
          conflict-of-laws principles. Any dispute will be resolved exclusively in the state or
          federal courts located in Delaware, and the parties consent to personal jurisdiction
          there.
        </p>

        <h2>12. Changes</h2>
        <p>
          We may update these Terms from time to time. Material changes will be announced through
          the application or by email at least 30 days before they take effect. Continued use after
          the effective date constitutes acceptance.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions? Email
          <a href="mailto:legal@medilink.vip"> legal@medilink.vip</a>.
        </p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
