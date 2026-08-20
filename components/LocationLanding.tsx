import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from '@/lib/site';
import {
  type Place,
  formatPopulation,
  isCity,
  isCounty,
  getCounty,
  citiesIn,
} from '@/lib/locations';
import { SPECIALTIES, type Specialty } from '@/lib/specialties';
import { LEGAL_DISCLAIMER, getStateLaw } from '@/lib/state-law';
import { buildLocationCopy, relatedPlaces } from '@/lib/location-content';
import { getNetworkStats, hasNetworkData } from '@/lib/network-stats';

type Props = { specialty: Specialty; place: Place };

const placeHref = (specialty: string, place: Place) =>
  `/for/${specialty}/${place.stateSlug}/${place.slug}`;

export default function LocationLanding({ specialty, place }: Props) {
  const copy = buildLocationCopy(specialty, place);
  const law = getStateLaw(place.stateSlug);
  const related = relatedPlaces(place);
  const stats = getNetworkStats(specialty.slug, place);

  // County pages link down to their cities; city pages link across to their neighbours.
  const countyCities = isCounty(place)
    ? citiesIn(place.stateSlug)
        .filter((c) => c.countySlug === place.slug)
        .slice(0, 12)
    : [];
  const parentCounty = isCity(place) ? getCounty(place.stateSlug, place.countySlug) : undefined;
  const otherSpecialties = SPECIALTIES.filter((s) => s.slug !== specialty.slug);

  const crumbs = [
    { name: 'MediLink', href: '/' },
    { name: specialty.titleNoun, href: `/for/${specialty.slug}` },
    { name: place.stateName, href: `/for/${specialty.slug}/${place.stateSlug}` },
    { name: place.name, href: placeHref(specialty.slug, place) },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `${SITE_URL}${c.href}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      // Service + areaServed, deliberately not LocalBusiness: MediLink has no premises in these
      // markets, and claiming one with a fabricated address would be structured-data spam.
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: `Personal injury referral network for ${specialty.plural}`,
      provider: { '@type': 'Organization', name: 'MediLink Health, Inc.', url: SITE_URL },
      areaServed: {
        '@type': isCounty(place) ? 'AdministrativeArea' : 'City',
        name: place.name,
        containedInPlace: { '@type': 'State', name: place.stateName },
      },
      url: `${SITE_URL}${placeHref(specialty.slug, place)}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="loc">
        <nav className="loc-crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => (
              <li key={c.href}>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page">{c.name}</span>
                ) : (
                  <Link href={c.href}>{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="loc-hero">
          <span className="loc-eyebrow">
            <span className="loc-eyebrow-dot" aria-hidden="true" />
            {copy.eyebrow}
          </span>
          <h1 className="loc-title">{copy.h1}</h1>
          <p className="loc-intro">{copy.intro}</p>
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
              <dt>Population</dt>
              <dd>{formatPopulation(place.population)}</dd>
            </div>
            {isCity(place) && place.countyName && (
              <div>
                <dt>County</dt>
                <dd>
                  {parentCounty ? (
                    <Link href={placeHref(specialty.slug, parentCounty)}>{place.countyName}</Link>
                  ) : (
                    place.countyName
                  )}
                </dd>
              </div>
            )}
            {isCounty(place) && place.sqmi && (
              <div>
                <dt>Area</dt>
                <dd>{Math.round(place.sqmi).toLocaleString()} sq mi</dd>
              </div>
            )}
            <div>
              <dt>Insurance system</dt>
              <dd>{law.system.split(',')[0]}</dd>
            </div>
            {hasNetworkData(stats) && (
              <div>
                <dt>Verified providers</dt>
                <dd>{stats.providers.toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </header>

        <section className="loc-section">
          <h2>
            The {place.name} market for {specialty.plural}
          </h2>
          {copy.marketParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <p className="loc-role">
            <strong>What a {specialty.singular} does in these cases —</strong> {specialty.role}
          </p>
        </section>

        {/*
          County pages carry the full statutory framework; city pages carry a relevant subset and
          link up to the state hub. Repeating the entire table on every city page is what makes a
          set of location pages read as one document with the place name swapped out.
        */}
        <section className="loc-section">
          <h2>{copy.legalHeading}</h2>
          {/* The generic state summary lives on the county and state pages; here the specialty
              callout below carries the meaning without repeating it market by market. */}
          {isCounty(place) && <p>{copy.legalIntro}</p>}

          <div className="loc-lawgrid">
            {(isCounty(place)
              ? law.facts
              : law.keyFacts[specialty.side].map((i) => law.facts[i]).filter(Boolean)
            ).map((f) => (
              <div className="loc-lawfact" key={f.label}>
                <span className="loc-lawfact-label">{f.label}</span>
                <span className="loc-lawfact-value">{f.value}</span>
                <span className="loc-lawfact-cite">{f.cite}</span>
              </div>
            ))}
          </div>

          <div className="loc-callout">
            <span className="loc-callout-tag">
              What this means for {specialty.plural} in {place.state}
            </span>
            <p>{copy.specialtyAngle}</p>
          </div>

          {isCounty(place) ? (
            <>
              <h3>{specialty.side === 'legal' ? 'For firms' : 'For treating providers'}</h3>
              <ul className="loc-points">
                {(specialty.side === 'legal' ? law.attorneyPoints : law.providerPoints).map((p) => (
                  <li key={p.title}>
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>
              <Link href={`/for/${specialty.slug}/${place.stateSlug}`}>
                Read the full {place.stateName} framework for {specialty.plural} →
              </Link>
            </p>
          )}

          <p className="loc-disclaimer">{LEGAL_DISCLAIMER}</p>
        </section>

        <section className="loc-section">
          <h2>{copy.networkHeading}</h2>
          <div className="loc-cards">
            {copy.networkPoints.map((p) => (
              <div className="loc-card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>

          <h3>Typical services routed through MediLink</h3>
          <ul className="loc-services">
            {specialty.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="loc-credentialing">{specialty.credentialing}</p>
        </section>

        {countyCities.length > 0 && (
          <section className="loc-section">
            <h2>
              {specialty.titleNoun} by city in {place.name}
            </h2>
            <ul className="loc-links">
              {countyCities.map((c) => (
                <li key={c.slug}>
                  <Link href={placeHref(specialty.slug, c)}>
                    {c.name}
                    <span>{formatPopulation(c.population)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.places.length > 0 && (
          <section className="loc-section">
            <h2>{related.label}</h2>
            <ul className="loc-links">
              {related.places.map((p) => (
                <li key={p.slug}>
                  <Link href={placeHref(specialty.slug, p)}>
                    {p.name}
                    <span>{formatPopulation(p.population)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="loc-section">
          <h2>Other specialties in {place.name}</h2>
          <ul className="loc-links">
            {otherSpecialties.map((s) => (
              <li key={s.slug}>
                <Link href={placeHref(s.slug, place)}>
                  {s.titleNoun}
                  <span>{place.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="loc-section loc-faq">
          <h2>Questions about {specialty.plural} in {place.name}</h2>
          <dl>
            {copy.faqs.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="loc-final">
          <h2>
            {specialty.side === 'legal'
              ? `Find providers in ${place.name}`
              : `Start receiving ${place.name} referrals`}
          </h2>
          <p>
            Verification takes about 24 hours.
          </p>
          <div className="loc-cta">
            <a className="loc-btn-primary" href="https://app.medilink.vip/register">
              Get started
            </a>
            <a className="loc-btn-ghost" href={PHONE_HREF}>
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
