'use client';

import { MotionConfig } from 'framer-motion';
import { Deck, Live, DISCLAIMER } from '@/components/deck/Deck';
import Slide from '@/components/deck/Slide';
import PageHero from '@/components/deck/PageHero';
import ScreenVisual from '@/components/deck/ScreenVisual';
import Closing from '@/components/deck/Closing';
import TelehealthDemo from '@/components/demos/TelehealthDemo';
import ScheduleDemo from '@/components/demos/ScheduleDemo';
import MessagingDemo from '@/components/demos/MessagingDemo';
import CaseDemo from '@/components/demos/CaseDemo';

const REGISTER = 'https://app.medilink.vip/register?type=medical_practice';
const FACTS = [
  ['Browser only', 'Patients and guests join from a link. Nothing to install on either side.'],
  ['10 caption languages', 'English, Spanish, Portuguese, French, German, Italian, Hindi, Japanese, Korean, Chinese. Each participant picks their own.'],
  ['Guests by link', 'The attorney, an interpreter or a family member joins the same visit from an email or text invite.'],
  ['Transcript + recording', 'Saved with speaker labels and the patient’s consent, filed on the appointment and the case.'],
  ['Statewide practices', 'A telehealth practice is listed for the whole state, so firms find it wherever the client is.'],
  ['HIPAA', 'Encrypted video on AWS Chime, BAA with every practice, no PHI in the invite text.'],
];

export default function TelehealthPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="lf lf-deck">
        <PageHero
          eyebrow="Telehealth · built into MediLink"
          lines={['Video visits', 'that speak the']} emLines={['patient’s language.']}
          lede="HIPAA video in the browser with live captions translated for each side, guest invites for the attorney or an interpreter, and a transcript and recording that file themselves on the case. Run a visit below."
          ctas={[{ label: 'Start your free trial', href: REGISTER, primary: true }, { label: 'Run a visit ↓', href: '#visit' }]}
          ghost="LIVE" disclaimer={DISCLAIMER} scrollTo="visit"
          visual={<ScreenVisual src="/screens/scheduling.jpg" url="app.medilink.vip/app/telehealth" cards={[
            { eyebrow: 'Live captions', title: 'English ⇄ Español', sub: 'Each side reads its own language', spark: true },
            { eyebrow: 'Guest joined', title: 'Alex Harper · attorney', sub: 'From the link, no account', green: true },
            { eyebrow: 'Visit saved', title: 'Transcript + recording', sub: 'Filed on the case · 14:32', green: true },
          ]} />}
        />

        <Deck count={4}>
          <Slide i={0} id="visit" index="01" label="The visit" ghost="LIVE" size="wide" title={<>Captions for both sides, <em>in their own language.</em></>}
            lede="The provider hears English. The patient reads Spanish, Portuguese or any of ten languages. Mute, camera and the caption language are the patient’s to control too. Invite anyone with an email or a number."
            tryIt="Change the caption language, invite a guest, end the visit.">
            <Live>{(on) => <TelehealthDemo active={on} />}</Live>
          </Slide>
          <Slide i={1} id="book" index="02" label="Booking" ghost="2:15" title={<>Booked by text, <em>joined by link.</em></>}
            lede="A video visit is an appointment type like any other. The clinic offers times, the patient replies 1, 2 or 3, and the join link arrives by text before the visit. No portal login, no download."
            tryIt="Answer the text as the patient would.">
            <ScheduleDemo />
          </Slide>
          <Slide i={2} id="thread" index="03" label="After the visit" ghost="MSG" title={<>The attorney asks. <em>The note is already there.</em></>}
            lede="Transcript, recording and visit note land on the referral’s thread and on the case. The firm reads them in MediLink instead of calling the office for status."
            tryIt="Reply in the thread.">
            <MessagingDemo role="clinic" />
          </Slide>
          <Slide i={3} id="case" index="04" label="On the case" ghost="PIP" title={<>Every visit, <em>video or in person, on one timeline.</em></>}
            lede="Telehealth visits count toward treatment like any other: attended, billed, documented. The firm watches PIP draw down and the file build toward demand."
            tryIt="Scrub the timeline.">
            <Live>{(on) => <CaseDemo autoplay={on} />}</Live>
          </Slide>
        </Deck>

        <section className="lf-facts" id="facts">
          <div className="lf-inner">
            <div className="lf-index"><span className="lf-index-n">05</span><span className="lf-index-rule" /><span className="lf-index-label">What’s built in</span></div>
            <h2 className="lf-h2">No add-on, no third-party app. <em>It is part of MediLink.</em></h2>
            <div className="lf-facts-grid">{FACTS.map(([k, v]) => <div key={k} className="lf-fact"><b>{k}</b><span>{v}</span></div>)}</div>
          </div>
        </section>

        <Closing index="06" label="Start free" title={<>Run your first video visit <em>this week.</em></>}
          sub="Telehealth is included in every practice plan. Fourteen days free, no card. Statewide telehealth practices are welcome."
          cta={{ label: 'Start your free trial →', href: REGISTER }} secondary={{ label: 'Or book a 20-minute walkthrough', href: '/#book' }}
          stats={[['10', 'caption languages, picked per participant'], ['0', 'apps to install, for anyone on the call'], ['1', 'link for the patient, the attorney, the interpreter'], ['100%', 'of visits saved with transcript and recording']]}
          trust={['HIPAA · AWS Chime', 'BAA with every practice', 'Consent recorded before recording']} />
      </main>
    </MotionConfig>
  );
}
