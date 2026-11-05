import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — Business Associate Agreement',
  description:
    'The HIPAA Business Associate Agreement between MediLink LLC and the clinics and firms that use the platform.',
};

// Version 2026-10-23 (replaces 2026-07-24). Public copy of the agreement
// presented at onboarding. The same version is served in-app at
// app.medilink.vip/legal/baa and its source of record is PI-Portal
// public/legal/baa-2026-10-23.md (mirrored at server/src/assets/ for the signed
// PDF). Change the wording there first and bump the version everywhere — an
// acceptance record is only meaningful if the exact text it names can still be
// produced. The prior version stays reachable at /baa/2026-07-24.
export default function BaaPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="Business Associate Agreement"
        title="How MediLink handles protected health information."
        intro="This agreement is presented and accepted when a clinic or firm creates a MediLink organization. Version 2026-10-23 replaces version 2026-07-24 and takes effect for existing customers thirty days after notice. We are also glad to execute it by signature, or to review your own BAA form, on request."
        lastUpdated="October 23, 2026"
      >
        <p><strong>Version 2026-10-23</strong> · Replaces version 2026-07-24</p>
        <p>This Business Associate Agreement (&quot;BAA&quot;) is entered into between the customer organization accepting it (&quot;Covered Entity&quot; or &quot;Customer&quot;) and <strong>MediLink LLC</strong> (&quot;Business Associate&quot; or &quot;MediLink&quot;), and is incorporated into and made part of the MediLink Terms of Service. It is effective as of the date the Customer creates a MediLink organization account (&quot;Effective Date&quot;), or, for Customers who accepted an earlier version, thirty (30) days after MediLink gives notice of this version under Section 11(a). In the event of a conflict between this BAA and the Terms of Service with respect to Protected Health Information (&quot;PHI&quot;), this BAA controls.</p>
        <h2>1. Definitions</h2>
        <p>Capitalized terms used but not defined here have the meanings given in the Health Insurance Portability and Accountability Act of 1996 (&quot;HIPAA&quot;), the Health Information Technology for Economic and Clinical Health Act (&quot;HITECH&quot;), and their implementing regulations at 45 C.F.R. Parts 160 and 164 (collectively, the &quot;HIPAA Rules&quot;), including: Breach, Data Aggregation, Designated Record Set, Electronic PHI (&quot;ePHI&quot;), Individual, Protected Health Information, Required by Law, Secretary, Security Incident, Subcontractor, and Unsecured PHI. &quot;PHI&quot; here means only the PHI MediLink creates, receives, maintains, or transmits on behalf of Customer.</p>
        <h2>2. Permitted uses and disclosures</h2>
        <p>MediLink may use or disclose PHI only:</p>
        <ol>
        <li>to provide, maintain, and support the MediLink services for Customer as described in the Terms of Service and Customer&apos;s configuration of the platform (including disclosures Customer directs through platform features, such as sharing records with a partnered organization or a patient&apos;s legal representative). MediLink will not use identifiable PHI to improve or develop its products; any such use is made only with data de-identified under paragraph 5;</li>
        <li>as Required by Law;</li>
        <li>for MediLink&apos;s proper management and administration, or to carry out its legal responsibilities, provided any third-party recipient gives reasonable written assurances of confidentiality and breach notification;</li>
        <li>to provide Data Aggregation services relating to Customer&apos;s health care operations, if requested; and</li>
        <li>to de-identify PHI in accordance with 45 C.F.R. § 164.514(b). De-identified data is no longer PHI and may be used by MediLink to operate and improve the services, subject to the following restrictions: (i) MediLink will not sell or license de-identified data derived from Customer&apos;s patient records; (ii) MediLink will not use such data to train artificial intelligence or machine-learning models without Customer&apos;s prior written consent; and (iii) neither MediLink nor its Subcontractors will attempt to re-identify such data or contact the Individuals to whom it relates.</li>
        </ol>
        <p>MediLink will not use or disclose PHI in any manner that would violate the HIPAA Rules if done by Customer, and will limit uses, disclosures, and requests to the minimum necessary. Where the services use artificial-intelligence features to process PHI on Customer&apos;s behalf (for example, reading a referral case file), that processing is performed under this BAA within MediLink&apos;s own hosted environment and is not used to train models.</p>
        <h2>3. Safeguards</h2>
        <p>MediLink will: (a) implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of ePHI as required by the Security Rule (45 C.F.R. Part 164, Subpart C), including encryption of ePHI in transit and at rest, role-based access controls, tenant isolation, and audit logging; (b) maintain written information security policies; (c) train workforce members with access to PHI; and (d) store and process all PHI exclusively within the United States.</p>
        <h2>4. Reporting</h2>
        <p>MediLink will report to Customer: (a) any use or disclosure of PHI not permitted by this BAA of which it becomes aware; (b) any Security Incident of which it becomes aware, except that this section serves as notice — no further reporting required — of routine unsuccessful attempts (e.g., pings, port scans, denied login attempts) that do not result in unauthorized access; and (c) any Breach of Unsecured PHI <strong>without unreasonable delay, and in no event later than ten (10) business days after discovery</strong>, including (to the extent known) the identities of affected Individuals and the information described in 45 C.F.R. § 164.404(c) so that Customer can meet its own notification obligations.</p>
        <h2>5. Subcontractors</h2>
        <p>MediLink will ensure that any Subcontractor that creates, receives, maintains, or transmits PHI on its behalf agrees in writing to restrictions and conditions at least as protective as those in this BAA. MediLink&apos;s current subprocessors are listed at <strong>medilink.vip/subprocessors</strong>. Before any new Subcontractor begins handling PHI, MediLink will (a) update that list and (b) give Customer at least thirty (30) days&apos; notice by email to the Customer&apos;s organization contact address. If Customer reasonably objects within that period and the parties cannot resolve the objection, Customer may terminate the services without penalty before the Subcontractor begins handling Customer&apos;s PHI. All Subcontractors that handle PHI store and process it exclusively within the United States.</p>
        <h2>6. Individual rights</h2>
        <p>To the extent MediLink holds PHI in a Designated Record Set, MediLink will, within five (5) business days of Customer&apos;s written request, make PHI available to Customer as needed to satisfy an Individual&apos;s rights of access (§ 164.524) and amendment (§ 164.526), and will incorporate amendments Customer directs. Independently of any request, Customer may retrieve and export the records it holds in the platform at any time through the platform&apos;s export features. MediLink will document disclosures and provide the information Customer needs to respond to a request for an accounting of disclosures (§ 164.528). If an Individual contacts MediLink directly, MediLink will forward the request to Customer rather than respond directly.</p>
        <h2>7. Access by the Secretary</h2>
        <p>MediLink will make its internal practices, books, and records relating to the use and disclosure of PHI available to the Secretary of Health and Human Services for purposes of determining compliance with the HIPAA Rules.</p>
        <h2>8. Customer obligations</h2>
        <p>Customer will: (a) not request or configure any use or disclosure that would violate the HIPAA Rules; (b) notify MediLink of any restriction on use or disclosure of PHI that Customer has agreed to or any change in, or revocation of, an Individual&apos;s permission, to the extent it affects MediLink&apos;s permitted uses; and (c) obtain any authorizations or consents required for disclosures Customer directs through the platform (including sharing with partnered organizations or a patient&apos;s legal representative).</p>
        <h2>9. Term and termination</h2>
        <p>This BAA is effective for as long as MediLink holds PHI on Customer&apos;s behalf. Either party may terminate this BAA (and the underlying services with respect to PHI) if the other materially breaches it and fails to cure within thirty (30) days of written notice.</p>
        <p>Upon termination of the services, Customer may, within sixty (60) days, elect to have its PHI returned or destroyed. Return is made as a complete export in portable formats (PDF for documents and signed forms; CSV for structured records), available through the platform&apos;s export features and, on request, delivered by MediLink. Following return, or if Customer elects destruction, MediLink will destroy the PHI it maintains and provide written certification of destruction. If Customer makes no election within the sixty (60) days, MediLink will retain the PHI under the protections of this BAA for a further thirty (30) days, after which it will destroy the PHI and provide written certification. If return or destruction is infeasible, MediLink will extend the protections of this BAA to the retained PHI and limit further use or disclosure to the purposes that make return or destruction infeasible.</p>
        <h2>10. Breach costs</h2>
        <p>If a Breach of Unsecured PHI is caused by MediLink or by a Subcontractor acting on its behalf, MediLink will reimburse Customer for (a) the reasonable, documented cost of notifications to affected Individuals, regulators, and media that the HIPAA Rules or applicable state law require Customer to make as a result of that Breach; (b) twelve (12) months of credit monitoring for affected Individuals where such monitoring is required by law or is reasonably provided in response to that Breach; and (c) civil monetary penalties assessed against Customer by a regulator to the extent attributable to that Breach. MediLink&apos;s total liability under this Section 10 for all Breaches in any twelve-month period is limited to the greater of the fees Customer paid to MediLink in the twelve (12) months preceding the first such Breach or twenty-five thousand U.S. dollars (US $25,000). Any limitation of liability in the Terms of Service does not reduce MediLink&apos;s obligations under this Section 10; this Section 10 states Customer&apos;s exclusive remedy for the costs it describes.</p>
        <h2>11. General</h2>
        <p>(a) <strong>Changes to this BAA.</strong> The parties will amend this BAA as necessary to comply with changes in the HIPAA Rules. MediLink may otherwise update this BAA by posting a new version with a new version date and giving Customer at least thirty (30) days&apos; written notice by email to the Customer&apos;s organization contact address before the new version takes effect. If Customer does not accept the new version, Customer may terminate the services without penalty at any time before it takes effect; continued use of the services after the effective date constitutes acceptance. A change required by law may take effect sooner, as the law requires. (b) Nothing in this BAA confers rights on any third party. (c) Any ambiguity will be interpreted to permit compliance with the HIPAA Rules. (d) This BAA does not apply to customer organizations that are not Covered Entities or Business Associates under HIPAA (e.g., law firms acting on a patient&apos;s authorization).</p>
        <hr />
        <p><em>Accepted electronically at organization creation. MediLink records the acceptance timestamp and BAA version on the organization record. A copy of this document is available at medilink.vip/baa, and prior versions remain available by version date.</em></p>
        <p className="legal-note">Prior version: <a href="/baa/2026-07-24">2026-07-24</a>.</p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
