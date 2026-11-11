'use client';

import { MotionConfig } from 'framer-motion';
import { Deck, Live, DISCLAIMER } from '@/components/deck/Deck';
import Slide from '@/components/deck/Slide';
import PageHero from '@/components/deck/PageHero';
import ScreenVisual from '@/components/deck/ScreenVisual';
import Filmstrip from '@/components/deck/Filmstrip';
import Closing from '@/components/deck/Closing';
import InboxDemo from '@/components/demos/InboxDemo';
import AttendanceDemo from '@/components/demos/AttendanceDemo';
import SignDemo from '@/components/demos/SignDemo';
import MessagingDemo from '@/components/demos/MessagingDemo';
import TelehealthDemo from '@/components/demos/TelehealthDemo';
import MapDemo from '@/components/demos/MapDemo';
import PricingDemo from '@/components/demos/PricingDemo';

const REGISTER = 'https://app.medilink.vip/register?type=medical_practice';

export default function ProvidersPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="lf lf-deck">
        <PageHero
          eyebrow="For medical practices · 14-day free trial, no card"
          lines={['Attorney referrals', 'in your inbox.']} emLines={['Records, bills and', 'attendance, out.']}
          lede="Personal injury firms refer through MediLink because the clinic answers in an hour and the file comes back clean. Scheduling, intake forms, messaging and telehealth are built in. Try each one below."
          ctas={[{ label: 'Start your free trial', href: REGISTER, primary: true }, { label: 'See how it works ↓', href: '#inbox' }]}
          ghost="CLINIC" disclaimer={DISCLAIMER} scrollTo="inbox"
          visual={<ScreenVisual src="/screens/scheduling.jpg" url="app.medilink.vip/app/scheduling" cards={[
            { eyebrow: 'New referral', title: 'Harbor & Stone · Camila R.', sub: 'Rear-end MVA · PIP $10k · packet attached', spark: true },
            { eyebrow: 'Patient booked by text', title: 'First visit Wed, 2:15 PM', sub: 'Replied “2” · on your calendar', green: true },
            { eyebrow: 'Records delivered', title: 'Initial eval · signed PDF', sub: 'Filed on the case · firm notified', green: true },
          ]} />}
        />

        <Deck count={7}>
          <Slide i={0} id="inbox" index="01" label="Referrals arrive" ghost="NEW" title={<>A referral lands with its packet. <em>You have an hour.</em></>}
            lede="Intake, dec page and ER note come with it. Your front desk gets a text and a call. Accept, offer up to three first-visit times, and the patient books by replying 1, 2 or 3. No phone tag, no faxed intake."
            tryIt="Accept Camila’s referral and offer her times.">
            <Live>{(on) => <InboxDemo active={on} />}</Live>
          </Slide>
          <Slide i={1} id="attendance" index="02" label="Visits and bills" ghost="SEEN" title={<>Mark the visit. <em>The firm already knows.</em></>}
            lede="Attendance, no-shows and the per-visit bill post to the attorney’s case timeline the moment you mark them. The clinic’s calendar shows every referred patient by appointment type, and no-shows get a re-offer by text."
            tryIt="Mark today’s visits attended or no-show.">
            <AttendanceDemo />
          </Slide>
          <Slide i={2} id="forms" index="03" label="Intake and e-sign" ghost="SIGN" title={<>Patients sign on their phone, <em>from the text.</em></>}
            lede="Upload your own intake forms as e-sign templates or build questionnaires in the form builder. The appointment date fills itself in. The signed PDF lands on the visit with a tamper-evident audit trail, and the firm can open it from the case."
            tryIt="Fill the form and sign with your mouse or finger.">
            <SignDemo />
          </Slide>
          <Slide i={3} id="messages" index="04" label="Talk to the firm" ghost="MSG" title={<>One inbox for firms, <em>teammates and partners.</em></>}
            lede="Every referral has its own thread, pinned to the record, so status questions stop coming through the office line. Firms introduce themselves before they refer. You accept or decline the introduction."
            tryIt="Accept the introduction, then reply on Camila’s thread.">
            <MessagingDemo role="clinic" />
          </Slide>
          <Slide i={4} id="telehealth" index="05" label="Telehealth" ghost="LIVE" title={<>Video visits with captions <em>in ten languages.</em></>}
            lede="HIPAA video in the browser, no app. Live captions and translation run for both sides, the attorney or an interpreter can join from a link, and the transcript and recording file themselves on the visit and the case."
            tryIt="Pick a caption language, invite a guest, end the visit.">
            <Live>{(on) => <TelehealthDemo active={on} />}</Live>
          </Slide>
          <Slide i={5} id="map" index="06" label="Get found" ghost="MAP" size="wide" title={<>Be on the map <em>every PI firm searches.</em></>}
            lede="Firms search by specialty, language, distance and what you accept. Your practice is listed once NPI, license and identity checks pass. Statewide telehealth practices show up wherever the client is.">
            <MapDemo gated />
          </Slide>
          <Slide i={6} id="pricing" index="07" label="What it costs" ghost="$" title={<>Per location, <em>and only once it has a case.</em></>}
            lede="Fourteen days free, no card. After that, each office bills monthly from the first case it receives. Everything is included: unlimited users, referrals, forms, messages and telehealth. Law firms use MediLink free, so referrals never cost them anything."
            tryIt="Pick your state, type and offices.">
            <PricingDemo />
          </Slide>
        </Deck>

        <Filmstrip index="08" register={REGISTER} shots={[
          { src: '/screens/scheduling.jpg', title: 'Scheduling', sub: 'Your week by appointment type, pending visits in amber.' },
          { src: '/screens/clinic-dashboard.jpg', title: 'Dashboard', sub: 'Today’s visits, confirmations, your team.' },
          { src: '/screens/messages.jpg', title: 'Messages', sub: 'Firms, teammates and partners in one inbox.' },
          { src: '/screens/directory-blur.jpg', title: 'Directory', sub: 'Where firms find you. Members see all of it.', gated: true },
        ]} />

        <Closing index="09" label="Start your trial" title={<>Put your practice <em>where the referrals are.</em></>}
          sub="Fourteen days free, no card. Add your offices, your appointment types and your intake forms, and the first referral can arrive the same day."
          cta={{ label: 'Start your free trial →', href: REGISTER }} secondary={{ label: 'Or book a 20-minute walkthrough', href: '/#book' }}
          stats={[['1 hr', 'to accept a referral before it moves on'], ['3', 'first-visit times you offer by text'], ['10', 'caption languages on every video visit'], ['$0', 'until an office receives its first case']]}
          trust={['HIPAA · BAA signed at onboarding', 'NPI + state license + ID verified', 'Stripe billing · cancel any time']} />
      </main>
    </MotionConfig>
  );
}
