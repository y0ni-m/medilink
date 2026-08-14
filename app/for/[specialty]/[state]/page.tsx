import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { SPECIALTIES, getSpecialty } from '@/lib/specialties';
import {
  STATES,
  citiesIn,
  countiesIn,
  formatPopulation,
  getState,
} from '@/lib/locations';
import { LEGAL_DISCLAIMER, getStateLaw } from '@/lib/state-law';
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from '@/lib/site';

type Params = { specialty: string; state: string };

/** The state hub — the page that gives every county and city page a parent. */
export function generateStaticParams(): Params[] {
  return SPECIALTIES.flatMap((s) => STATES.map((st) => ({ specialty: s.slug, state: st.slug })));
}

function resolve(params: Params) {
  const specialty = getSpecialty(params.specialty);
  const state = getState(params.state);
  return specialty && state ? { specialty, state } : null;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const found = resolve(params);
  if (!found) return { title: 'MediLink' };
  const { specialty, state } = found;
  const title = `${specialty.titleNoun} in ${state.name} | MediLink`;
  const description =
    specialty.side === 'legal'
      ? `Connect with credentialed personal injury clinics across ${state.name} — every county and major city.`
      : `Receive personal injury referrals as a ${specialty.singular} anywhere in ${state.name} — every county and major city.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/for/${params.specialty}/${params.state}` },
  };
}

export default function StateHubPage({ params }: { params: Params }) {
  const found = resolve(params);
  if (!found) notFound();
  const { specialty, state } = found;

  const counties = countiesIn(state.slug);
  const cities = citiesIn(state.slug);
  const law = getStateLaw(state.slug);
  const base = `/for/${specialty.slug}/${state.slug}`;

  return (
    <div className="page">
      <Nav />
      <article className="loc">
        <nav className="loc-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">MediLink</Link>
            </li>
            <li>
              <Link href={`/for/${specialty.slug}`}>{specialty.titleNoun}</Link>
            </li>
            <li>
              <span aria-current="page">{state.name}</span>
            </li>
          </ol>
        </nav>

        <header className="loc-hero">
          <span className="loc-eyebrow">
            <span className="loc-eyebrow-dot" aria-hidden="true" />
            {state.name} · Statewide
          </span>
          <h1 className="loc-title">
            {specialty.titleNoun} in {state.name}
          </h1>
          <p className="loc-intro">
            {specialty.role} {specialty.stateAngle[state.slug]}
          </p>
          <div className="loc-cta">
            <a className="loc-btn-primary" href="https://app.medilink.vip/register">
              {specialty.side === 'legal' ? 'Refer a case' : 'Join the network'}
            </a>
            <a className="loc-btn-ghost" href={PHONE_HREF}>
              Call {PHONE_DISPLAY}
            </a>
          </div>

          <dl className="loc-facts">
            <div>
              <dt>Counties covered</dt>
              <dd>{counties.length}</dd>
            </div>
            <div>
              <dt>Cities listed</dt>
              <dd>{cities.length}</dd>
            </div>
            <div>
              <dt>Insurance system</dt>
              <dd>{law.system.split(',')[0]}</dd>
            </div>
          </dl>
        </header>

        <section className="loc-section">
          <h2>{state.name} injury law, in practice</h2>
          <p>{law.summary}</p>
          <div className="loc-lawgrid">
            {law.facts.map((f) => (
              <div className="loc-lawfact" key={f.label}>
                <span className="loc-lawfact-label">{f.label}</span>
                <span className="loc-lawfact-value">{f.value}</span>
                <span className="loc-lawfact-cite">{f.cite}</span>
              </div>
            ))}
          </div>
          <div className="loc-callout">
            <span className="loc-callout-tag">
              What this means for {specialty.plural} in {state.abbr}
            </span>
            <p>{specialty.stateAngle[state.slug]}</p>
          </div>
          <p className="loc-disclaimer">{LEGAL_DISCLAIMER}</p>
        </section>

        <section className="loc-section">
          <h2>
            Largest {state.name} markets for {specialty.plural}
          </h2>
          <ul className="loc-links">
            {cities.slice(0, 24).map((c) => (
              <li key={c.slug}>
                <Link href={`${base}/${c.slug}`}>
                  {c.name}
                  <span>{formatPopulation(c.population)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="loc-section">
          <h2>Every county in {state.name}</h2>
          <ul className="loc-links loc-links-dense">
            {counties.map((c) => (
              <li key={c.slug}>
                <Link href={`${base}/${c.slug}`}>
                  {c.shortName}
                  <span>{formatPopulation(c.population)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="loc-section">
          <h2>All {state.name} cities we cover</h2>
          <ul className="loc-links loc-links-dense">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`${base}/${c.slug}`}>
                  {c.name}
                  <span>{formatPopulation(c.population)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <Footer />
    </div>
  );
}

export const dynamicParams = false;
