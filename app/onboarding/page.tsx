import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Onboarding from '@/components/Onboarding';

export const metadata: Metadata = {
  title: 'MediLink — Onboarding',
  description: 'From signup to first referral in under 48 hours. Four guided steps.',
};

export default function OnboardingPage() {
  return (
    <div className="page">
      <Nav />
      <Onboarding />
      <Footer />
    </div>
  );
}
