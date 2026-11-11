import Footer from '@/components/Footer';
import HeroCards from '@/components/HeroCards';
import HeroLeft from '@/components/HeroLeft';
import Nav from '@/components/Nav';
import HomePage from '@/components/home/HomePage';

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <section className="hero" id="top">
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
      <HomePage />
      <Footer />
    </div>
  );
}
