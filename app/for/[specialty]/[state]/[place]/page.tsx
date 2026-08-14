import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import LocationLanding from '@/components/LocationLanding';
import { SPECIALTIES, getSpecialty } from '@/lib/specialties';
import { STATES, getPlace, placesIn } from '@/lib/locations';
import { buildLocationCopy } from '@/lib/location-content';
import { SITE_URL } from '@/lib/site';

type Params = { specialty: string; state: string; place: string };

/**
 * specialties (7) x places (549) = 3,843 statically generated pages.
 * The place count is governed by the population floor in scripts/build-locations.mjs.
 */
export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const specialty of SPECIALTIES) {
    for (const state of STATES) {
      for (const place of placesIn(state.slug)) {
        params.push({ specialty: specialty.slug, state: state.slug, place: place.slug });
      }
    }
  }
  return params;
}

function resolve(params: Params) {
  const specialty = getSpecialty(params.specialty);
  const place = getPlace(params.state, params.place);
  return specialty && place ? { specialty, place } : null;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const found = resolve(params);
  if (!found) return { title: 'MediLink' };
  const copy = buildLocationCopy(found.specialty, found.place);
  const path = `/for/${params.specialty}/${params.state}/${params.place}`;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: `${SITE_URL}${path}`,
      type: 'website',
    },
  };
}

export default function LocationPage({ params }: { params: Params }) {
  const found = resolve(params);
  if (!found) notFound();

  return (
    <div className="page">
      <Nav />
      <LocationLanding specialty={found.specialty} place={found.place} />
      <Footer />
    </div>
  );
}

// Every specialty/state/place combination is known at build time — 404 anything else.
export const dynamicParams = false;
