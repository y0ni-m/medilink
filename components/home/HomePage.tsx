'use client';

import Link from 'next/link';
import { MotionConfig } from 'framer-motion';
import { Deck, Live, DISCLAIMER, scrollToChapter } from '@/components/deck/Deck';
import Slide from '@/components/deck/Slide';
import Filmstrip from '@/components/deck/Filmstrip';
import ConciergeDemo from '@/components/demos/ConciergeDemo';
import AcceptDemo from '@/components/demos/AcceptDemo';
import ScheduleDemo from '@/components/demos/ScheduleDemo';
import MessagingDemo from '@/components/demos/MessagingDemo';
import TelehealthDemo from '@/components/demos/TelehealthDemo';
import CaseDemo from '@/components/demos/CaseDemo';
import Pricing from '@/components/Pricing';
import VientaBooking from '@/components/VientaBooking';

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="lf lf-deck">
        <div className="lf-inner"><p className="lf-disclaimer lf-disclaimer-hero">{DISCLAIMER}</p></div>

        <Deck count={6}>
          <Slide i={0} id="ask" index="01" label="The firm asks" ghost="ASK" title={<>A paralegal types one sentence. <em>The concierge does the rest.</em></>}
            lede="It reads the intake, the ER note and the dec page, cites what it found, and matches a verified clinic by injury, language, distance and coverage. Firms use MediLink free."
            tryIt="Type a request or pick one, then send the referral.">
            <Live>{(on) => <ConciergeDemo autoplay={on} onBooked={() => scrollToChapter('accept')} />}</Live>
          </Slide>
          <Slide i={1} id="accept" index="02" label="The clinic answers" ghost="1 HR" title={<>The clinic has one hour. <em>It takes six minutes.</em></>}
            lede="A text and a call reach the front desk with the packet. Press 1, reply, or tap in the app. If nobody answers, the referral moves to the next verified match."
            tryIt="Accept it the way a clinic would.">
            <Live>{(on) => <AcceptDemo active={on} />}</Live>
          </Slide>
          <Slide i={2} id="book" index="03" label="The patient books" ghost="2:15" title={<>The patient replies <em>1, 2 or 3.</em></>}
            lede="The clinic offers up to three first-visit times. The patient books by text or one tap, with no app and no password. The visit lands on both calendars."
            tryIt="Answer the text as the patient would.">
            <ScheduleDemo />
          </Slide>
          <Slide i={3} id="talk" index="04" label="They talk" ghost="MSG" title={<>Firm and clinic talk <em>inside the referral.</em></>}
            lede="Every referral carries its own thread, pinned to the record. Records, questions and heads-ups stay with the case instead of in someone’s email."
            tryIt="Reply in the thread.">
            <MessagingDemo role="firm" />
          </Slide>
          <Slide i={4} id="visit" index="05" label="The visit" ghost="LIVE" size="wide" title={<>In person or on video, <em>with captions in ten languages.</em></>}
            lede="Telehealth is built in: browser video, live translated captions for each side, guests by link, transcript and recording filed on the visit."
            tryIt="Change the caption language, invite a guest, end the visit.">
            <Live>{(on) => <TelehealthDemo active={on} />}</Live>
          </Slide>
          <Slide i={5} id="case" index="06" label="The case" ghost="PIP" title={<>One timeline, <em>from first visit to demand.</em></>}
            lede="Visits, bills and records post as they happen. The coverage path, PIP to EMC to LOP, tracks itself. When the firm is ready to demand, the file is already built."
            tryIt="Scrub the timeline.">
            <Live>{(on) => <CaseDemo autoplay={on} />}</Live>
          </Slide>
        </Deck>

        <Filmstrip index="07" shots={[
          { src: '/screens/concierge.jpg', title: 'Referral concierge', sub: 'One sentence in, verified matches out, closest first.' },
          { src: '/screens/scheduling.jpg', title: 'Scheduling', sub: 'The clinic’s week, with the referred patient on it.' },
          { src: '/screens/messages.jpg', title: 'Messages', sub: 'Threads pinned to the referral.' },
          { src: '/screens/directory-blur.jpg', title: 'Directory', sub: 'Every verified practice in the state. Members see all of it.', gated: true },
          { src: '/screens/cases.jpg', title: 'Cases', sub: 'Status, visits, documents and the PIP balance per client.' },
        ]} />

        <section className="lf-who" id="who">
          <div className="lf-inner">
            <div className="lf-index"><span className="lf-index-n">08</span><span className="lf-index-rule" /><span className="lf-index-label">Who it’s for</span></div>
            <h2 className="lf-h2">Two sides of the same case. <em>Pick yours.</em></h2>
            <div className="lf-who-grid">
              <Link href="/law-firms" className="lf-who-card">
                <span className="lf-slide-label"><b>Free</b>For personal injury law firms</span>
                <b>Refer in two minutes, follow the care to settlement.</b>
                <ul><li>AI concierge reads the file</li><li>Verified clinics, one-hour accept</li><li>Booking by text, messaging, case timeline</li></ul>
                <span className="lf-who-cta">See the law-firm walkthrough →</span>
              </Link>
              <Link href="/providers" className="lf-who-card is-alt">
                <span className="lf-slide-label"><b>14 days free</b>For medical practices</span>
                <b>Attorney referrals in, clean files out.</b>
                <ul><li>Referral inbox with packets</li><li>Scheduling, intake e-sign, attendance</li><li>Messaging and telehealth built in</li></ul>
                <span className="lf-who-cta">See the provider walkthrough →</span>
              </Link>
            </div>
            <Link href="/telehealth" className="lf-who-strip"><span className="lf-pill lf-pill-teal">New</span>Telehealth with captions in ten languages, built in. <b>See it →</b></Link>
          </div>
        </section>

        <Pricing />

        <section className="book" id="book-demo">
          <div className="book-inner" id="book">
            <header className="book-head">
              <span className="book-eyebrow"><span className="book-eyebrow-dot" />Book a demo</span>
              <h2 className="book-title">Pick a time that <em>works for you</em>.</h2>
              <p className="book-sub">Grab a slot and we’ll walk your team through MediLink live: referrals, scheduling, messaging, telehealth and case tracking end to end.</p>
            </header>
            <VientaBooking />
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
