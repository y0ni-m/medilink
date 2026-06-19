import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import ResourceBrowser from '@/components/ResourceBrowser';
import { CATEGORIES, sortedPosts } from '@/lib/resources';

export const metadata: Metadata = {
  title: 'MediLink — Resources',
  description:
    'Guides and playbooks on personal injury referrals, LOPs and patient financial responsibility, clinic growth, and compliance.',
};

export default function ResourcesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  return (
    <div className="page">
      <Nav />
      <main className="res">
        <section className="res-hero">
          <div className="res-hero-inner">
            <span className="sol-eyebrow">
              <span className="sol-eyebrow-dot" />
              Resources
            </span>
            <h1 className="res-hero-title">
              Playbooks for the <em>PI referral</em> network.
            </h1>
            <p className="res-hero-sub">
              Practical guidance for attorneys and clinics — on referrals, LOPs and patient
              financial responsibility, growing a caseload, and staying compliant.
            </p>
          </div>
        </section>

        <section className="res-body">
          <div className="res-body-inner">
            <ResourceBrowser
              posts={sortedPosts()}
              categories={CATEGORIES}
              initialCategory={searchParams?.category}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
