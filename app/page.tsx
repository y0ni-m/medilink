import Audiences from '@/components/Audiences';
import BookDemo from '@/components/BookDemo';
import BrainExplorer from '@/components/BrainExplorer';
import Footer from '@/components/Footer';
import HeroLeft from '@/components/HeroLeft';
import HowItWorks from '@/components/HowItWorks';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <section className="hero">
        <span className="hero-ghost" aria-hidden="true">REFERRALS</span>
        <HeroLeft />
        <div className="sol-hero-right">
          <BookDemo />
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
          <iframe
            className="book-frame"
            src="https://vienta.app/book/medilink/book-a-demo"
            title="Book a Demo"
            loading="lazy"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
