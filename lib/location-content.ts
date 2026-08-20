// Composes the copy for a single /for/[specialty]/[state]/[place] page.
//
// The point of this file is that two location pages should not read the same. Content varies
// along five real axes:
//
//   specialty (7)  x  state (2)  x  market tier (3)  x  page kind (county/city)  x  place facts
//
// Place facts — population, county, land area, named neighbours and their distances — come from
// Census data, so the local paragraphs contain statements that are true of that place and false
// of the next one. Anything that cannot be substantiated is omitted rather than invented.

import {
  type City,
  type County,
  type Place,
  formatPopulation,
  isCity,
  isCounty,
  marketTier,
  nearbyCities,
  siblingCities,
} from '@/lib/locations';
import type { Specialty } from '@/lib/specialties';
import { getStateLaw } from '@/lib/state-law';

export type LocationCopy = {
  /** <title> */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** Paragraphs describing the market itself. */
  marketParagraphs: string[];
  /** Heading + body for the state-law section. */
  legalHeading: string;
  legalIntro: string;
  /** How this state's rules land on this specialty. */
  specialtyAngle: string;
  /** Heading + items for the "what we do here" section. */
  networkHeading: string;
  networkPoints: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

const OK = (s: string) => s.replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ *
 * Deterministic phrasing variation
 *
 * Two pages that share a specialty and a state would otherwise differ only in place name.
 * Seeding a phrasing choice on the place and specialty means neighbouring markets describe the
 * same true facts in different sentence shapes, and the choice is stable across builds.
 * ------------------------------------------------------------------ */

function seedOf(...parts: string[]): number {
  let h = 0x811c9dc5;
  for (const ch of parts.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

const pick = <T,>(options: T[], seed: number, offset = 0): T =>
  options[(seed + offset * 2654435761) % options.length];

const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

/** "up 4.2%" / "down 2.1%" / "roughly flat" — reads correctly in either direction. */
function growthPhrase(pct: number | null): string | null {
  if (pct == null) return null;
  if (Math.abs(pct) < 0.5) return 'held roughly flat';
  return pct > 0 ? `grown ${pct}%` : `contracted ${Math.abs(pct)}%`;
}

/* ------------------------------------------------------------------ *
 * Market description — the genuinely local part
 * ------------------------------------------------------------------ */

function countyMarketParagraphs(county: County, specialty: Specialty): string[] {
  const tier = marketTier(county);
  const seed = seedOf(county.slug, specialty.slug, county.state);
  const out: string[] = [];
  const growth = growthPhrase(county.growthPct);
  const area = county.sqmi ? `${Math.round(county.sqmi).toLocaleString()} square miles` : null;

  const opener = pick(
    [
      OK(`${county.name} is the ${ordinal(county.stateRank)}-largest of ${county.stateCountyCount}
        ${county.stateName} counties, with about ${formatPopulation(county.population)} residents${
        area ? ` spread across ${area}` : ''
      }.`),
      OK(`With roughly ${formatPopulation(county.population)} residents${
        area ? ` across ${area}` : ''
      }, ${county.name} ranks ${ordinal(county.stateRank)} by population among ${county.stateName}'s
        ${county.stateCountyCount} counties.`),
      OK(`${county.shortName} is home to about ${formatPopulation(county.population)} people${
        county.density ? `, at roughly ${county.density.toLocaleString()} per square mile` : ''
      } — ${ordinal(county.stateRank)} among ${county.stateName} counties.`),
    ],
    seed
  );
  out.push(`${opener} ${specialty.tierAngle[tier]}`);

  if (growth) {
    out.push(
      pick(
        [
          OK(`The county has ${growth} since 2020. Injury volume tends to track population and traffic more
            closely than it tracks anything else, which is why capacity for ${specialty.plural} here moves
            with the same curve.`),
          OK(`Population has ${growth} since 2020 — a useful signal for any ${specialty.singular} deciding how
            much personal injury work a ${county.shortName} catchment can actually sustain.`),
        ],
        seed,
        1
      )
    );
  }

  if (county.cities.length > 0) {
    const names = county.cities.slice(0, 4).map((s) => s.replace(/-/g, ' ')).join(', ');
    out.push(
      OK(`Referral volume concentrates around the county's larger municipalities — ${names} — but MediLink routes
      by coverage radius rather than city limits, so a ${specialty.singular} serving the county line still
      receives cases from a few miles the other side of it.`)
    );
  } else {
    out.push(
      OK(`${county.shortName} has no municipality above the population floor we list separately, so cases here are
      routed by coverage radius from surrounding markets. For ${specialty.plural} that usually means a wider
      catchment and a longer drive for the patient — worth knowing before accepting the referral, not after.`)
    );
  }

  return out;
}

function cityMarketParagraphs(city: City, specialty: Specialty): string[] {
  const tier = marketTier(city);
  const seed = seedOf(city.slug, specialty.slug, city.state);
  const out: string[] = [];
  const growth = growthPhrase(city.growthPct);
  const county = city.countyName ? ` in ${city.countyName}` : '';

  const opener = pick(
    [
      OK(`${city.name} is the ${ordinal(city.stateRank)}-largest city MediLink covers in ${city.stateName}, with
        about ${formatPopulation(city.population)} residents${county}.`),
      OK(`With roughly ${formatPopulation(city.population)} residents, ${city.name}${county} ranks
        ${ordinal(city.stateRank)} of the ${city.stateCityCount} ${city.stateName} cities in the network.`),
      OK(`${city.name}${county} has a population of about ${formatPopulation(city.population)}${
        city.density ? `, at roughly ${city.density.toLocaleString()} people per square mile` : ''
      }.`),
      OK(`About ${formatPopulation(city.population)} people live in ${city.name}${county}${
        city.density ? `, densely enough at ${city.density.toLocaleString()} per square mile to matter for how far patients will travel` : ''
      }.`),
    ],
    seed
  );
  out.push(`${opener} ${specialty.tierAngle[tier]}`);

  if (growth) {
    out.push(
      pick(
        [
          OK(`The city has ${growth} since 2020, and referral demand for ${specialty.plural} generally follows
            population and traffic volume rather than anything more specific to the practice.`),
          OK(`${city.name} has ${growth} since 2020 — a reasonable proxy for how much personal injury work a
            ${specialty.singular} can expect to sustain here.`),
        ],
        seed,
        1
      )
    );
  }

  const near = nearbyCities(city, 4);
  if (near.length >= 2) {
    const list = near.slice(0, 3).map((n) => `${n.city.name} (${n.miles} mi)`).join(', ');
    out.push(
      pick(
        [
          OK(`The practical catchment extends well past the city line — ${list} are all within a short drive.
            MediLink matches on coverage radius rather than city name, so a patient in ${city.name} reaches
            whichever ${specialty.singular} actually has capacity.`),
          OK(`${list} all sit inside a normal driving radius, which means the real ${city.name} market for
            ${specialty.plural} is considerably larger than the city itself. Matching runs on radius, not on
            municipal boundaries.`),
        ],
        seed,
        2
      )
    );
  } else if (city.nearestLarger) {
    out.push(
      OK(`${city.name} sits ${city.nearestLarger.miles} miles from ${city.nearestLarger.name}, the nearest
      substantially larger market. Cases that exceed local capacity route there, so knowing what a
      ${specialty.singular} can handle locally matters more here than it does in a dense metro.`)
    );
  } else {
    out.push(
      OK(`${city.name} is far enough from the next sizeable market that local capacity matters more than choice.
      When no ${specialty.singular} nearby can take a case, MediLink widens the radius rather than leaving the
      referral unanswered.`)
    );
  }

  return out;
}

/* ------------------------------------------------------------------ *
 * FAQs — varied by specialty, state, and place
 * ------------------------------------------------------------------ */

function buildFaqs(specialty: Specialty, place: Place): { q: string; a: string }[] {
  const law = getStateLaw(place.stateSlug);
  const where = `${place.name}, ${place.state}`;
  const faqs: { q: string; a: string }[] = [];

  if (specialty.side === 'legal') {
    faqs.push({
      q: `How do I find personal injury clinics with capacity in ${where}?`,
      a: OK(`MediLink shows credentialed clinics serving ${where} along with the case types they accept and whether
      they have current capacity, so a referral goes to a provider who can actually see the client rather than to
      a list of phone numbers.`),
    });
  } else {
    faqs.push({
      q: `How does a ${specialty.singular} in ${where} receive personal injury referrals?`,
      a: OK(`Set your coverage area, accepted case types, and capacity, and MediLink routes matching cases from
      firms working in ${where}. ${specialty.credentialing}`),
    });
  }

  // Deliberately does not repeat the specialty/state analysis rendered above — saying the same
  // paragraph twice on one page helps nobody and inflates how alike these pages look.
  faqs.push({
    q: `What does ${place.stateName} law mean for injury cases in ${where}?`,
    a: OK(`${place.stateName} is ${law.system.toLowerCase()}, and the same rules apply in ${place.name} as
    anywhere else in the state. The practical consequences for ${specialty.plural} are set out above and in
    full on our ${place.stateName} page.`),
  });

  faqs.push({
    q: `How do medical practices get started with MediLink in ${where}?`,
    a: 'Set up your practice profile, get verified — usually within about 24 hours — and start receiving matched referrals. Pricing is tailored to your practice; reach out for a plan that fits your case mix.',
  });

  if (isCounty(place)) {
    faqs.push({
      q: `Does MediLink cover the whole of ${place.name}?`,
      a: OK(`Yes. Cases are matched by coverage radius across ${place.name}, so providers serving part of the county
      still receive cases from the surrounding area where their radius reaches.`),
    });
  } else if (place.countyName) {
    faqs.push({
      q: `Does MediLink cover areas around ${place.name}?`,
      a: OK(`Yes. ${place.name} sits in ${place.countyName}, and matching runs on coverage radius rather than city
      limits, so nearby communities are included in the same catchment.`),
    });
  }

  return faqs;
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

export function buildLocationCopy(specialty: Specialty, place: Place): LocationCopy {
  const law = getStateLaw(place.stateSlug);
  const where = `${place.name}, ${place.state}`;
  const tier = marketTier(place);

  const metaTitle = `${specialty.titleNoun} in ${where} | MediLink`;

  const metaDescription =
    specialty.side === 'legal'
      ? OK(`Connect with credentialed personal injury clinics serving ${where}. Verified providers, real capacity,
        and ${place.stateName}'s ${law.system.toLowerCase()} rules explained.`)
      : OK(`Receive personal injury referrals as a ${specialty.singular} in ${where}. Signed agreements, verified
        firms, and ${place.stateName}'s ${law.system.toLowerCase()} rules explained.`);

  const seed = seedOf(place.slug, specialty.slug, 'intro');
  const intro =
    specialty.side === 'legal'
      ? pick(
          [
            OK(`MediLink connects firms working in ${where} with credentialed medical providers who have genuine
              capacity. ${specialty.stateAngle[place.stateSlug]}`),
            OK(`If your firm places injury referrals in ${where}, the constraint is rarely the number of clinics —
              it is knowing which ones can see the client this week. ${specialty.stateAngle[place.stateSlug]}`),
          ],
          seed
        )
      : pick(
          [
            OK(`MediLink routes personal injury cases to ${specialty.plural} serving ${where}, with the agreement
              signed and the referring firm verified before the case reaches you.
              ${specialty.stateAngle[place.stateSlug]}`),
            OK(`For a ${specialty.singular} taking personal injury work in ${where}, the question is whether a case
              arrives complete or arrives as a phone call. ${specialty.stateAngle[place.stateSlug]}`),
          ],
          seed
        );

  const networkPoints =
    specialty.side === 'legal'
      ? [
          {
            title: `Providers who cover ${place.name}`,
            desc: OK(`See which credentialed clinics serve ${where}, what case types they take, and whether they have
            capacity now — before you send the client anywhere. ${
              isCity(place) && place.nearestLarger
                ? `Where local capacity is short, the radius extends toward ${place.nearestLarger.name}, ${place.nearestLarger.miles} miles away.`
                : `Matching runs on coverage radius, so the catchment is not limited to ${place.name} itself.`
            }`),
          },
          {
            title: 'Verified before they receive a case',
            desc: 'Every provider is checked against NPI, state license, and active malpractice coverage.',
          },
          {
            title: 'One timeline per case',
            desc: 'Treatment status, records, and balances stay in one shared view instead of across three inboxes.',
          },
        ]
      : [
          {
            title: `Cases from firms working in ${place.name}`,
            desc: OK(`Referrals are matched to your coverage area and capacity, so you receive ${place.stateName}
            injury cases that fit your practice rather than whatever comes through the door. ${
              isCity(place) && place.nearestLarger
                ? `Set your radius to reach toward ${place.nearestLarger.name} and the catchment widens with it.`
                : `Coverage is set by radius, so you decide how far ${place.name} cases travel to reach you.`
            }`),
          },
          {
            title: 'Agreements signed up front',
            desc: 'Each case states the LOP and/or patient financial responsibility arrangement before you accept it.',
          },
          {
            title: 'Verified counsel on every case',
            desc: 'You know which firm is on the case and can reach them inside the shared timeline.',
          },
        ];

  return {
    metaTitle,
    metaDescription,
    h1: `${specialty.titleNoun} in ${where}`,
    eyebrow: isCounty(place) ? `${place.stateName} · County` : `${place.stateName} · ${place.countyName ?? 'City'}`,
    intro,
    marketParagraphs: isCounty(place)
      ? countyMarketParagraphs(place, specialty)
      : cityMarketParagraphs(place as City, specialty),
    legalHeading: `${place.stateName} injury law, in practice`,
    legalIntro: law.summary,
    specialtyAngle: specialty.stateAngle[place.stateSlug],
    networkHeading:
      specialty.side === 'legal'
        ? `Placing referrals in ${place.name}`
        : `Receiving referrals in ${place.name}`,
    networkPoints,
    faqs: buildFaqs(specialty, place),
    ...(tier ? {} : {}),
  };
}

/** Related places for internal linking — real geographic relationships, not a link farm. */
export function relatedPlaces(place: Place): { label: string; places: Place[] } {
  if (isCity(place)) {
    const siblings = siblingCities(place, 6);
    if (siblings.length) {
      return { label: `Other cities in ${place.countyName}`, places: siblings };
    }
    return { label: `Near ${place.name}`, places: nearbyCities(place, 6).map((n) => n.city) };
  }
  return { label: `Cities in ${place.name}`, places: [] };
}
