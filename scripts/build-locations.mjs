#!/usr/bin/env node
/**
 * Builds the multi-state location dataset used by the /for/[specialty]/[state]/[place]
 * landing pages. States are listed in STATES below.
 *
 *   node scripts/build-locations.mjs [--min-population 25000]
 *
 * Sources (all U.S. Census Bureau, public domain — no attribution or licence obligation):
 *   sub-est2023.csv          population for counties (SUMLEV 050), incorporated places (162),
 *                            and the place-within-county rows (157) that give us the
 *                            city -> county mapping.
 *   2023_gaz_place_XX.txt    place centroid lat/long and land area.
 *   2023_Gaz_counties        county centroid lat/long and land area.
 *
 * The output is committed to lib/data/locations.json so that production builds are
 * reproducible and never depend on Census being reachable. Re-run this script only when you
 * want to refresh the vintage or change the population floor.
 */

import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.census-cache');
const OUT = path.join(ROOT, 'lib', 'data', 'locations.json');

/**
 * `municipalityLevel` is the Census summary level that actually holds this state's
 * municipalities:
 *   162 = incorporated place — the norm in most states.
 *   061 = minor civil division — New York and New Jersey, where towns and townships are the
 *         real municipalities. Using places there would drop Hempstead NY (785k residents),
 *         Brookhaven, Islip, and every New Jersey township including Lakewood and Edison.
 */
const STATES = [
  { fips: '12', abbr: 'FL', slug: 'florida', name: 'Florida', municipalityLevel: '162' },
  { fips: '48', abbr: 'TX', slug: 'texas', name: 'Texas', municipalityLevel: '162' },
  { fips: '13', abbr: 'GA', slug: 'georgia', name: 'Georgia', municipalityLevel: '162' },
  { fips: '06', abbr: 'CA', slug: 'california', name: 'California', municipalityLevel: '162' },
  { fips: '36', abbr: 'NY', slug: 'new-york', name: 'New York', municipalityLevel: '061' },
  { fips: '34', abbr: 'NJ', slug: 'new-jersey', name: 'New Jersey', municipalityLevel: '061' },
  { fips: '04', abbr: 'AZ', slug: 'arizona', name: 'Arizona', municipalityLevel: '162' },
];

const argMin = process.argv.indexOf('--min-population');
/** Cities below this 2023 population estimate are skipped. Counties are always included. */
const MIN_POPULATION = argMin > -1 ? Number(process.argv[argMin + 1]) : 25000;

/* ------------------------------------------------------------------ */

async function download(url, file) {
  const dest = path.join(CACHE, file);
  if (existsSync(dest)) return dest;
  await mkdir(CACHE, { recursive: true });
  process.stdout.write(`  fetching ${file} … `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  process.stdout.write('ok\n');
  return dest;
}

/** Census ships the county and county-subdivision gazetteers as zips. */
async function downloadZippedGazetteer(name) {
  const zip = await download(
    `https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer/${name}.zip`,
    `${name}.zip`
  );
  const txt = path.join(CACHE, `${name}.txt`);
  if (!existsSync(txt)) execFileSync('unzip', ['-o', '-q', zip, '-d', CACHE]);
  return txt;
}

const readTsv = async (file) => {
  const text = await readFile(file, 'latin1');
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split('\t').map((c) => c.trim());
  return lines.map((line) => {
    const cells = line.split('\t');
    return Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? '').trim()]));
  });
};

const readCsv = async (file) => {
  const text = await readFile(file, 'latin1');
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(',');
  return lines.map((line) => {
    // The Census subcounty file quotes any name containing a comma.
    const cells = [];
    let cur = '';
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) {
        cells.push(cur);
        cur = '';
      } else cur += ch;
    }
    cells.push(cur);
    return Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? '').trim()]));
  });
};

/* ------------------------------------------------------------------ */

/** "Miami city" -> "Miami"; "St. Petersburg city" -> "St. Petersburg". */
const TYPE_SUFFIX =
  /\s+(city|town|township|village|borough|municipality|plantation|CDP|urban county|metro(politan)? government|consolidated government)(\s+\(balance\))?$/i;

function cleanPlaceName(raw) {
  return raw.replace(TYPE_SUFFIX, '').replace(/\s+\(balance\)$/i, '').trim();
}

/** "Poughkeepsie town" -> "town". Used only to disambiguate same-county name clashes. */
function municipalType(raw) {
  const m = raw.match(TYPE_SUFFIX);
  return m ? m[1].toLowerCase() : null;
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Great-circle distance in miles, used to pick each place's nearest neighbours. */
function milesBetween(a, b) {
  if (a.lat == null || b.lat == null) return Infinity;
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/* ------------------------------------------------------------------ */

async function main() {
  console.log(
    `Building ${STATES.length}-state locations (city population floor: ${MIN_POPULATION.toLocaleString()})`
  );

  const subEstFile = await download(
    'https://www2.census.gov/programs-surveys/popest/datasets/2020-2023/cities/totals/sub-est2023.csv',
    'sub-est2023.csv'
  );
  const countyGazFile = await downloadZippedGazetteer('2023_Gaz_counties_national');
  // Centroids for town/township municipalities, which the place gazetteer does not cover.
  const cousubGazFile = STATES.some((s) => s.municipalityLevel === '061')
    ? await downloadZippedGazetteer('2023_Gaz_cousubs_national')
    : null;
  const placeGazFiles = {};
  for (const st of STATES) {
    placeGazFiles[st.fips] = await download(
      `https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer/2023_gaz_place_${st.fips}.txt`,
      `2023_gaz_place_${st.fips}.txt`
    );
  }

  const subEst = await readCsv(subEstFile);
  const countyGaz = await readTsv(countyGazFile);
  const fipsOf = Object.fromEntries(STATES.map((s) => [s.fips, s]));

  // Centroids keyed by GEOID (state+county = 5 digits, state+place = 7 digits).
  const geo = new Map();
  for (const row of countyGaz) {
    geo.set(row.GEOID, { lat: toNum(row.INTPTLAT), lng: toNum(row.INTPTLONG), sqmi: toNum(row.ALAND_SQMI) });
  }
  for (const st of STATES) {
    for (const row of await readTsv(placeGazFiles[st.fips])) {
      geo.set(row.GEOID, { lat: toNum(row.INTPTLAT), lng: toNum(row.INTPTLONG), sqmi: toNum(row.ALAND_SQMI) });
    }
  }
  if (cousubGazFile) {
    for (const row of await readTsv(cousubGazFile)) {
      geo.set(row.GEOID, { lat: toNum(row.INTPTLAT), lng: toNum(row.INTPTLONG), sqmi: toNum(row.ALAND_SQMI) });
    }
  }

  const rows = subEst.filter((r) => fipsOf[r.STATE]);
  const pop = (r) => toNum(r.POPESTIMATE2023) ?? 0;

  /* ---- counties ---- */
  const counties = [];
  const countyByFips = new Map();
  for (const r of rows.filter((r) => r.SUMLEV === '050')) {
    const st = fipsOf[r.STATE];
    const name = r.NAME.trim();
    const geoid = r.STATE + r.COUNTY;
    const entry = {
      kind: 'county',
      slug: slugify(name),
      name,
      // "Miami-Dade County" -> "Miami-Dade", used in prose where "County" reads badly.
      shortName: name.replace(/\s+County$/i, ''),
      state: st.abbr,
      stateSlug: st.slug,
      stateName: st.name,
      fips: geoid,
      population: pop(r),
      ...(geo.get(geoid) ?? { lat: null, lng: null, sqmi: null }),
      cities: [],
    };
    counties.push(entry);
    countyByFips.set(geoid, entry);
  }

  /* ---- city -> county mapping from the SUMLEV 157 rows ---- */
  // A city can straddle several counties; the county holding the most residents wins.
  const primaryCounty = new Map();
  for (const r of rows.filter((r) => r.SUMLEV === '157')) {
    const key = r.STATE + r.PLACE;
    const prev = primaryCounty.get(key);
    if (!prev || pop(r) > prev.pop) primaryCounty.set(key, { fips: r.STATE + r.COUNTY, pop: pop(r) });
  }

  /* ---- cities ---- */
  const cities = [];
  const municipalRows = rows.filter((r) => r.SUMLEV === fipsOf[r.STATE].municipalityLevel);

  // MCD states: fold back any incorporated place with no same-name MCD. Without this New York
  // City (8.26m) is absent entirely, since it has no county-subdivision record.
  for (const st of STATES.filter((s) => s.municipalityLevel === '061')) {
    const mcdNames = new Set(
      rows.filter((r) => r.STATE === st.fips && r.SUMLEV === '061').map((r) => cleanPlaceName(r.NAME))
    );
    for (const r of rows) {
      if (r.STATE !== st.fips || r.SUMLEV !== '162') continue;
      if (mcdNames.has(cleanPlaceName(r.NAME))) continue;
      municipalRows.push(r);
    }
  }
  for (const r of municipalRows) {
    const population = pop(r);
    if (population < MIN_POPULATION) continue;
    const st = fipsOf[r.STATE];
    // Read the row, not the state: MCD states also carry folded-in place rows (New York City).
    const isMcd = r.SUMLEV === '061';
    const geoid = isMcd ? r.STATE + r.COUNTY + r.COUSUB : r.STATE + r.PLACE;
    const name = cleanPlaceName(r.NAME);
    if (/^County subdivisions not defined/i.test(name)) continue;
    const part = isMcd ? null : primaryCounty.get(geoid);
    const share = part && population > 0 ? part.pop / population : 1;
    const spansCounties = share < 0.6;
    const county = spansCounties
      ? undefined
      : isMcd
        ? countyByFips.get(r.STATE + r.COUNTY)
        : countyByFips.get(part?.fips);
    const centroid = geo.get(geoid) ?? { lat: null, lng: null, sqmi: null };
    const pop2020 = toNum(r.POPESTIMATE2020) ?? 0;
    cities.push({
      kind: 'city',
      slug: slugify(name),
      name,
      state: st.abbr,
      stateSlug: st.slug,
      stateName: st.name,
      fips: geoid,
      population,
      pop2020,
      // Real, place-specific figures — these are what keep two city pages from reading alike.
      growthPct: pop2020 > 0 ? Math.round(((population - pop2020) / pop2020) * 1000) / 10 : null,
      density: centroid.sqmi ? Math.round(population / centroid.sqmi) : null,
      countySlug: county?.slug ?? null,
      countyName: county?.name ?? null,
      municipalType: municipalType(r.NAME),
      spansCounties,
      ...centroid,
    });
  }

  /* ---- slug collisions ---- */
  // Names repeat within a state, and in New York a city and a town of the same name sit in the
  // same county (Poughkeepsie, Newburgh), so the county alone cannot separate them. Group by
  // base slug: different counties disambiguate by county, same county by municipality type.
  for (const st of STATES) {
    const groups = new Map();
    for (const c of cities.filter((c) => c.state === st.abbr)) {
      const base = slugify(c.name);
      if (!groups.has(base)) groups.set(base, []);
      groups.get(base).push(c);
    }
    for (const [base, group] of groups) {
      if (group.length === 1) continue;
      const countiesDiffer = new Set(group.map((c) => c.countySlug)).size === group.length;
      for (const c of group) {
        c.slug = countiesDiffer && c.countySlug
          ? `${base}-${c.countySlug.replace(/-county$/, '')}`
          : `${base}-${c.municipalType ?? 'municipality'}`;
      }
      console.warn(`  ! ${st.abbr} name clash "${group[0].name}" -> ${group.map((c) => c.slug).join(', ')}`);
    }
  }

  /* ---- attach the largest cities to their county, for hub-page linking ---- */
  for (const c of cities) {
    const county = counties.find((x) => x.state === c.state && x.slug === c.countySlug);
    if (county) county.cities.push(c.slug);
  }
  for (const county of counties) {
    county.cities.sort((a, b) => {
      const pa = cities.find((c) => c.state === county.state && c.slug === a)?.population ?? 0;
      const pb = cities.find((c) => c.state === county.state && c.slug === b)?.population ?? 0;
      return pb - pa;
    });
  }

  /* ---- nearby cities, for genuine cross-linking rather than a link farm ---- */
  for (const c of cities) {
    c.nearby = cities
      .filter((o) => o !== c && o.state === c.state)
      .map((o) => ({ slug: o.slug, miles: milesBetween(c, o) }))
      .filter((o) => Number.isFinite(o.miles) && o.miles <= 45)
      .sort((a, b) => a.miles - b.miles)
      .slice(0, 6)
      .map((o) => ({ slug: o.slug, miles: Math.round(o.miles) }));
  }

  cities.sort((a, b) => a.state.localeCompare(b.state) || b.population - a.population);
  counties.sort((a, b) => a.state.localeCompare(b.state) || b.population - a.population);

  /* ---- state rank and nearest larger market ---- */
  for (const st of STATES) {
    const inState = cities.filter((c) => c.state === st.abbr); // already population-sorted
    inState.forEach((c, i) => {
      c.stateRank = i + 1;
      c.stateCityCount = inState.length;
      // The nearest market at least 1.6x this city's size — the place patients get referred
      // to when local capacity runs out. Undefined for the largest cities, which is correct.
      const bigger = inState
        .filter((o) => o !== c && o.population >= c.population * 1.6)
        .map((o) => ({ name: o.name, slug: o.slug, miles: Math.round(milesBetween(c, o)) }))
        .filter((o) => Number.isFinite(o.miles))
        .sort((a, b) => a.miles - b.miles)[0];
      c.nearestLarger = bigger ?? null;
    });

    const cs = counties.filter((c) => c.state === st.abbr);
    cs.forEach((c, i) => {
      c.stateRank = i + 1;
      c.stateCountyCount = cs.length;
      c.density = c.sqmi ? Math.round(c.population / c.sqmi) : null;
    });
  }

  // County population change, from the same vintage as the city figures.
  const countyPop2020 = new Map();
  for (const r of rows.filter((r) => r.SUMLEV === '050')) {
    countyPop2020.set(r.STATE + r.COUNTY, toNum(r.POPESTIMATE2020) ?? 0);
  }
  for (const c of counties) {
    const base = countyPop2020.get(c.fips) ?? 0;
    c.pop2020 = base;
    c.growthPct = base > 0 ? Math.round(((c.population - base) / base) * 1000) / 10 : null;
  }

  const payload = {
    generatedFrom: 'U.S. Census Bureau — Vintage 2023 population estimates and 2023 Gazetteer (public domain)',
    vintage: 2023,
    minCityPopulation: MIN_POPULATION,
    states: STATES.map(({ fips, ...rest }) => rest),
    counties,
    cities,
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);

  for (const st of STATES) {
    const cc = counties.filter((c) => c.state === st.abbr).length;
    const ct = cities.filter((c) => c.state === st.abbr).length;
    console.log(`  ${st.name}: ${cc} counties, ${ct} cities`);
  }
  const total = counties.length + cities.length;
  console.log(`  total ${total} places -> ${OUT.replace(ROOT + '/', '')}`);
  const orphans = cities.filter((c) => !c.countySlug);
  if (orphans.length) console.warn(`  ! ${orphans.length} cities without a county: ${orphans.map((c) => c.name).join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
