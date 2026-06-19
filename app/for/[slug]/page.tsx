import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AudienceLanding from '@/components/AudienceLanding';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { audienceSlugs, getAudience } from '@/lib/audiences';

export function generateStaticParams() {
  return audienceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const audience = getAudience(params.slug);
  if (!audience) return { title: 'MediLink' };
  return {
    title: audience.metaTitle,
    description: audience.metaDescription,
  };
}

export default function AudiencePage({ params }: { params: { slug: string } }) {
  const audience = getAudience(params.slug);
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
