'use client';

import { MotionConfig } from 'framer-motion';
import { Deck, Live, DISCLAIMER, scrollToChapter } from '@/components/deck/Deck';
import Slide from '@/components/deck/Slide';
import PageHero from '@/components/deck/PageHero';
import ScreenVisual from '@/components/deck/ScreenVisual';
import Filmstrip from '@/components/deck/Filmstrip';
import Closing from '@/components/deck/Closing';
import ConciergeDemo from '@/components/demos/ConciergeDemo';
import MapDemo from '@/components/demos/MapDemo';
import AcceptDemo from '@/components/demos/AcceptDemo';
import ScheduleDemo from '@/components/demos/ScheduleDemo';
import CaseManagementDemo from '@/components/demos/CaseManagementDemo';
import MessagingDemo from '@/components/demos/MessagingDemo';
import CaseDemo from '@/components/demos/CaseDemo';

const REGISTER = 'https://app.medilink.vip/register?type=law_firm';

export default function LawFirmsPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="lf lf-deck">
        <PageHero
          eyebrow="For personal injury law firms · free"
          lines={['Refer a client', 'in two minutes.']} emLines={['Follow the care', 'to settlement.']}
          lede="One workspace: verified clinics, an AI concierge that reads the case file, text-message scheduling, messaging with the clinic and a live case timeline. Scroll to walk the whole process, and use it as you go."
          ctas={[{ label: 'Create your free firm account', href: REGISTER, primary: true }, { label: 'Walk the process ↓', href: '#concierge' }]}
          ghost="FIRMS" disclaimer={DISCLAIMER} scrollTo="concierge"
          visual={<ScreenVisual src="/screens/cases.jpg" url="app.medilink.vip/app/cases" cards={[
            { eyebrow: 'Concierge', title: 'Read 3 documents · 3 findings cited', sub: 'Rear-end MVA · neck and back · PIP $10k', spark: true },
            { eyebrow: 'Clinic accepted', title: 'Bayside Spine & Injury · 6 min', sub: '1.2 mi · Spanish-speaking · verified', green: true },
            { eyebrow: 'Patient booked by text', title: 'First visit Wed, 2:15 PM', sub: 'Reply “2” · confirmed on your calendar', green: true },
          ]} />}
        />

        <Deck count={7}>
          <Slide i={0} id="concierge" index="01" label="Describe the client" ghost="ASK" title={<>Say what the client needs. <em>The concierge finds the clinic.</em></>}
            lede="Type it the way you’d say it to a paralegal. MediLink reads the case file you upload, cites what it found, and matches a verified clinic that fits the injury, the language and the coverage. The packet builds itself."
            tryIt="Type a request or pick one, then send the referral.">
            <Live>{(on) => <ConciergeDemo autoplay={on} onBooked={() => scrollToChapter('accept')} />}</Live>
          </Slide>
          <Slide i={1} id="map" index="02" label="The right clinic" ghost="NEAR" size="wide" title={<>Every verified practice in the state, <em>on one map.</em></>}
            lede="Each clinic passed NPI, state license and identity checks before it was listed. Members filter by specialty, language, distance and what the clinic accepts, draw a radius around the client, and see statewide telehealth wherever they are.">
            <MapDemo gated />
          </Slide>
          <Slide i={2} id="accept" index="03" label="Clinic accepts" ghost="1 HR" title={<>The clinic gets a text and a call. <em>It has one hour.</em></>}
            lede="No voicemail tag. The front desk presses 1 on the call, replies to the text or taps in the app. If nobody accepts in time, the referral moves to the next match. Your firm is notified the second it’s taken."
            tryIt="Accept it the way a clinic would.">
            <Live>{(on) => <AcceptDemo active={on} />}</Live>
          </Slide>
          <Slide i={3} id="scheduling" index="04" label="Client books" ghost="2:15" title={<>Your client books by text. <em>No app, no password.</em></>}
            lede="The clinic offers up to three first-visit times. The client replies 1, 2 or 3 or taps the link. The visit, every follow-up and every no-show lands on your calendar as it happens."
            tryIt="Answer the text as the client would.">
            <ScheduleDemo />
          </Slide>
          <Slide i={4} id="messages" index="05" label="Talk to the clinic" ghost="MSG" title={<>Message the clinic <em>from inside the case.</em></>}
            lede="Every referral carries its own thread between your office and the practice, pinned to the record. Teammates, partner practices and introductions to new clinics live in the same inbox. Nobody emails the office line for status."
            tryIt="Reply in the thread. The clinic answers.">
            <MessagingDemo role="firm" />
          </Slide>
          <Slide i={5} id="manage" index="06" label="Case management" ghost="CASE" title={<>Every case, <em>and where it stands.</em></>}
            lede="Intake to settlement in one pipeline. Open a client to see the coverage path, the visits the clinic logged, every record that came in, and the alerts that need a decision, like an EMC determination before the PIP cap hits."
            tryIt="Open a client. Move the status, record the EMC, send the LOP.">
            <CaseManagementDemo />
          </Slide>
          <Slide i={6} id="cases" index="07" label="Treatment to demand" ghost="PIP" title={<>One timeline, <em>from first visit to demand.</em></>}
            lede="The case carries its coverage path, PIP to EMC to LOP, with visits as they’re attended, bills as they post and records as they’re signed. When you’re ready to demand, the file is already assembled."
            tryIt="Scrub the timeline and watch PIP drain into LOP.">
            <Live>{(on) => <CaseDemo autoplay={on} />}</Live>
          </Slide>
        </Deck>

        <Filmstrip index="08" register={REGISTER} shots={[
          { src: '/screens/concierge.jpg', title: 'Referral concierge', sub: 'One sentence in, verified matches out, closest first.' },
          { src: '/screens/directory-blur.jpg', title: 'Directory', sub: 'Every verified practice in the state on one map. Members see all of it.', gated: true },
          { src: '/screens/messages.jpg', title: 'Messages', sub: 'Threads with the clinic, pinned to the referral.' },
          { src: '/screens/cases.jpg', title: 'Cases', sub: 'Status, visits, documents and the PIP balance per client.' },
        ]} />

        <Closing index="09" label="Start free" title={<>Send your next referral <em>through MediLink.</em></>}
          sub="Firms never pay. Set-up takes a few minutes, the first referral takes two, and your paralegals stop chasing records."
          cta={{ label: 'Create your free firm account →', href: REGISTER }} secondary={{ label: 'Or book a 20-minute walkthrough', href: '/#book' }}
          stats={[['2 min', 'to send a referral with the packet attached'], ['1 hr', 'for the clinic to accept, by text, call or in the app'], ['0', 'records requests. Bills and notes arrive on the timeline'], ['$0', 'for your firm, with no limit on referrals or users']]}
          trust={['HIPAA · BAA with every practice', 'NPI + state license + ID verified', 'Florida PIP rules built in']} />
      </main>
    </MotionConfig>
  );
}
