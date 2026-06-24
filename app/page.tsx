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
      <Footer />
    </div>
  );
}
