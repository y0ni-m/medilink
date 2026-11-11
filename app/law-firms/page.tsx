import type { Metadata } from 'next';
import 'mapbox-gl/dist/mapbox-gl.css';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import LawFirmsPage from '@/components/lawfirms/LawFirmsPage';

export const metadata: Metadata = {
  title: 'MediLink for Law Firms — refer clients to verified clinics, free',
  description:
    'Personal injury firms use MediLink free: an AI concierge that reads the case file, a map of verified clinics, text-message scheduling for clients, and one case timeline from referral to settlement.',
};

export default function Page() {
  return (
    <div className="page">
      <Nav />
      <LawFirmsPage />
      <Footer />
    </div>
  );
}
