import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import TelehealthPage from '@/components/telehealth/TelehealthPage';

export const metadata: Metadata = {
  title: 'MediLink Telehealth — video visits with captions in ten languages',
  description:
    'HIPAA video in the browser with live translated captions for each side, guest invites for attorneys and interpreters, and transcripts and recordings filed on the case. Built into MediLink.',
};

export default function Page() {
  return (
    <div className="page">
      <Nav />
      <TelehealthPage />
      <Footer />
    </div>
  );
}
