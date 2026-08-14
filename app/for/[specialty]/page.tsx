import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AudienceLanding from '@/components/AudienceLanding';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { audienceSlugs, getAudience } from '@/lib/audiences';

export function generateStaticParams() {
  return audienceSlugs().map((specialty) => ({ specialty }));
}

export function generateMetadata({ params }: { params: { specialty: string } }): Metadata {
  const audience = getAudience(params.specialty);
  if (!audience) return { title: 'MediLink' };
  return {
    title: audience.metaTitle,
    description: audience.metaDescription,
  };
}

export default function AudiencePage({ params }: { params: { specialty: string } }) {
  const audience = getAudience(params.specialty);
  if (!audience) notFound();

  return (
    <div className="page">
      <Nav />
      <AudienceLanding audience={audience} />
      <Footer />
    </div>
  );
}

// All audiences are known at build time — 404 anything else.
export const dynamicParams = false;
