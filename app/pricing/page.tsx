import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Pricing from '@/components/Pricing';

export const metadata: Metadata = {
  title: 'MediLink — Pricing',
  description: 'Attorneys join free. Clinics pay one flat monthly rate per location.',
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
