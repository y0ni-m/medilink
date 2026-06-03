import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';

export const metadata: Metadata = {
  title: 'MediLink — Pricing',
  description: 'Attorneys join free. Clinics get a plan tailored to their state, locations, and case mix.',
};

export default function PricingPage() {
  return (
    <div className="page">
      <Nav />
      <Pricing />
      <Footer />
    </div>
  );
}
