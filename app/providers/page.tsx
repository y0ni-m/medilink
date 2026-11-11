import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import ProvidersPage from '@/components/providers/ProvidersPage';

export const metadata: Metadata = {
  title: 'MediLink for Medical Practices — attorney referrals in, clean files out',
  description:
    'Personal injury referrals with the packet attached, a one-hour accept window, booking by text, intake e-sign, attendance that posts to the firm, messaging and telehealth. 14-day free trial, no card.',
};

export default function Page() {
  return (
    <div className="page">
      <Nav />
      <ProvidersPage />
      <Footer />
    </div>
  );
}
