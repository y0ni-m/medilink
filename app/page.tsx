import Audiences from '@/components/Audiences';
import DotStage from '@/components/DotStage';
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
        <HeroLeft />
        <DotStage />
      </section>
      <HowItWorks />
      <Audiences />
      <Pricing />
      <Footer />
    </div>
  );
}
