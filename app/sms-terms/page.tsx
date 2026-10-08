import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import LegalDoc from '@/components/LegalDoc';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'MediLink — SMS Terms',
  description:
    'How MediLink text message notifications work: what you receive, how you opt in, and how to stop at any time.',
};

export default function SmsTermsPage() {
  return (
    <div className="page">
      <Nav />
      <LegalDoc
        eyebrow="SMS Terms"
        title="Text message notifications."
        intro="These terms describe the MediLink Appointment, Referral & Account Notifications program: what you'll receive, how you opted in, and how to stop."
        lastUpdated="October 8, 2026"
      >
        <h2>1. Program name</h2>
        <p>MediLink Appointment, Referral &amp; Account Notifications.</p>

        <h2>2. Who sends them</h2>
        <p>
          MediLink LLC (&quot;MediLink&quot;), on behalf of the law firm or medical practice you
          work with through the MediLink platform.
        </p>

        <h2>3. What you&apos;ll receive</h2>
        <p>
          Transactional notifications about your MediLink account, appointments, and referrals —
          appointment confirmations, reminders and changes, referral updates such as a clinic
          accepting your referral with a link to choose your visit time, and account notices
          such as password or sign-in help. Messages never include
          medical details. Message frequency varies with your appointments; typically 1&ndash;4
          messages per appointment. We do not send marketing messages.
        </p>

        <h2>4. How you opt in</h2>
        <p>
          You enter your mobile number and check the box &quot;Text me appointment &amp;
          referral notifications&quot; on the My Profile page of your MediLink portal, or you reply YES to a
          message inviting you to receive texts. Consent is recorded with a timestamp. Consent is
          not a condition of receiving care or legal services.
        </p>

        <h2>5. How to stop</h2>
        <p>
          Reply <strong>STOP</strong> to any message to unsubscribe at any time. You&apos;ll
          receive one confirmation text and nothing further. You can also turn texts off under My
          Profile in the MediLink portal.
        </p>

        <h2>6. Help</h2>
        <p>
          Reply <strong>HELP</strong> to any message, or call us at{' '}
          <a href="tel:+18334071005">+1 (833) 407-1005</a>.
        </p>

        <h2>7. Cost</h2>
        <p>
          Message and data rates may apply according to your mobile plan. Carriers are not liable
          for delayed or undelivered messages.
        </p>

        <h2>8. Privacy</h2>
        <p>
          Your mobile number is used only to send the notifications described above. We do not
          sell or share your mobile number or SMS opt-in consent with third parties or affiliates
          for marketing purposes. See our <a href="/privacy">Privacy Policy</a>.
        </p>
      </LegalDoc>
      <Footer />
    </div>
  );
}
