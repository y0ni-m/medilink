import Audiences from '@/components/Audiences';
import BrainExplorer from '@/components/BrainExplorer';
import Footer from '@/components/Footer';
import HeroLeft from '@/components/HeroLeft';
import HowItWorks from '@/components/HowItWorks';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';
import ReferralTicket from '@/components/ReferralTicket';

const HERO_TICKET = {
  ref: 'REF-1042',
  status: 'Matched',
  rows: [
    { k: 'Case type', v: 'Auto · MVA' },
    { k: 'Provider', v: 'Verified clinic', check: true },
    { k: 'LOP', v: 'Signed', check: true },
    { k: 'Status', v: 'In treatment' },
  ],
  stages: ['Referred', 'Matched', 'Treating', 'Settled'],
  activeStage: 1,
};

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <section className="hero">
        <span className="hero-ghost" aria-hidden="true">REFERRALS</span>
        <HeroLeft />
        <div className="sol-hero-right">
          <ReferralTicket ticket={HERO_TICKET} accent="#0da7ca" fileRef="CASE · PI" />
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
