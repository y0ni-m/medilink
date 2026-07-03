import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import ResourceBrowser from '@/components/ResourceBrowser';
import { CATEGORIES, ONBOARDING_VIDEOS, sortedPosts } from '@/lib/resources';

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

        <section className="res-onb" id="onboarding">
          <div className="res-body-inner">
            <div className="res-onb-head">
              <span className="res-onb-eyebrow">Onboarding</span>
              <h2 className="res-onb-title">Get live on MediLink.</h2>
              <p className="res-onb-sub">
                Two short walkthroughs — one for providers, one for firms — covering everything from
                signup to your first case.
              </p>
            </div>
            <div className="res-onb-grid">
              {ONBOARDING_VIDEOS.map((v) => (
                <article className="res-onb-card" key={v.slug}>
                  <div className="res-onb-frame" style={{ paddingTop: v.aspect }}>
                    <iframe
                      src={`https://player.vimeo.com/video/${v.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={v.title}
                    />
                  </div>
                  <div className="res-onb-body">
                    <span className="res-onb-tag">{v.audience}</span>
                    <h3>{v.title}</h3>
                    <p>{v.description}</p>
                  </div>
                </article>
              ))}
            </div>
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
