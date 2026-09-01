import Audiences from '@/components/Audiences';
import BrainExplorer from '@/components/BrainExplorer';
import Footer from '@/components/Footer';
import HeroCards from '@/components/HeroCards';
import HeroLeft from '@/components/HeroLeft';
import HowItWorks from '@/components/HowItWorks';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';
import VientaBooking from '@/components/VientaBooking';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <section className="hero">
        <span className="hero-ghost" aria-hidden="true">REFERRALS</span>
        <HeroLeft />
        <div className="sol-hero-right hcards-stack">
          <HeroCards />
          <a className="btn btn-cta hcards-cta" href="#book">
            Book a demo
            <span className="arrow">→</span>
          </a>
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
