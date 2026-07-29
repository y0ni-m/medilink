import Link from 'next/link';
import Audiences from '@/components/Audiences';
import BrainExplorer from '@/components/BrainExplorer';
import Footer from '@/components/Footer';
import HeroLeft from '@/components/HeroLeft';
import HowItWorks from '@/components/HowItWorks';
import Nav from '@/components/Nav';
import Polaroid from '@/components/Polaroid';
import Pricing from '@/components/Pricing';
import VientaBooking from '@/components/VientaBooking';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <section className="hero">
        <span className="hero-ghost" aria-hidden="true">REFERRALS</span>
        <HeroLeft />
        <div className="sol-hero-right">
          <div className="hero-demo">
            <Polaroid
              className="hero-demo-photo"
              src="/photos/sharma.jpg"
              alt="A MediLink provider ready to walk you through the platform"
              caption="See it live"
              rotate={-2.5}
              tape="top"
              width={300}
            />
            <Link className="hero-demo-cta" href="/demo">
              <span className="hero-demo-cta-lead">See MediLink in action</span>
              <span className="hero-demo-cta-btn">
                Request a demo
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <BrainExplorer />
      <HowItWorks />
      <Audiences />
      <Pricing />

      <section className="book" id="book">
        <div className="book-inner">
          <header className="book-head">
            <span className="book-eyebrow">
              <span className="book-eyebrow-dot" />
              Book a demo
            </span>
            <h2 className="book-title">
              Pick a time that <em>works for you</em>.
            </h2>
            <p className="book-sub">
              Grab a slot and we’ll walk your team through MediLink live — referrals, LOPs and
              patient financial responsibility, and case tracking end to end.
            </p>
          </header>
          <VientaBooking />
        </div>
      </section>

      <Footer />
    </div>
  );
}
