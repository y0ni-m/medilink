// Sample network used by the interactive demos on the law-firm page.
// These are the demo environment's sample practices (not real businesses),
// placed at their cities. Distances are computed, not typed in.

export type PracticeType = 'Chiropractic' | 'MRI / Imaging' | 'Orthopedics' | 'Telehealth' | 'Surgery center';

export type Practice = {
  id: string;
  name: string;
  city: string;
  type: PracticeType;
  lat: number;
  lng: number;
  languages: string[];
  accepts: ('PIP' | 'LOP')[];
  nextOpening: string;
  statewide?: boolean;
};

export const PRACTICES: Practice[] = [
  { id: 'bayside', name: 'Bayside Spine & Injury', city: 'Kissimmee', type: 'Chiropractic', lat: 28.292, lng: -81.408, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 10:30 AM' },
  { id: 'orlando-chiro', name: 'Orlando Chiropractic & Injury Center', city: 'Orlando', type: 'Chiropractic', lat: 28.538, lng: -81.379, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Wed 9:00 AM' },
  { id: 'sanford', name: 'Sanford Chiropractic & Injury Center', city: 'Sanford', type: 'Chiropractic', lat: 28.8, lng: -81.273, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Thu 2:00 PM' },
  { id: 'summit', name: 'Summit Family Chiropractic', city: 'Lakeland', type: 'Chiropractic', lat: 28.039, lng: -81.95, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 3:15 PM' },
  { id: 'melbourne', name: 'Melbourne Auto Injury Chiropractic', city: 'Melbourne', type: 'Chiropractic', lat: 28.083, lng: -80.608, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Mon 11:00 AM' },
  { id: 'cypress', name: 'Cypress Chiropractic', city: 'Tampa', type: 'Chiropractic', lat: 27.951, lng: -82.457, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Wed 1:30 PM' },
  { id: 'stpete', name: 'St. Pete Spine & Injury', city: 'St. Petersburg', type: 'Chiropractic', lat: 27.773, lng: -82.64, languages: ['English'], accepts: ['PIP', 'LOP'], nextOpening: 'Thu 9:30 AM' },
  { id: 'bradenton', name: 'Bradenton Chiropractic', city: 'Bradenton', type: 'Chiropractic', lat: 27.499, lng: -82.575, languages: ['English', 'Spanish'], accepts: ['PIP'], nextOpening: 'Fri 10:00 AM' },
  { id: 'ocala', name: 'Ocala Injury Chiropractic', city: 'Ocala', type: 'Chiropractic', lat: 29.187, lng: -82.14, languages: ['English'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 8:30 AM' },
  { id: 'daytona', name: 'Daytona Spine & Injury', city: 'Daytona Beach', type: 'Chiropractic', lat: 29.21, lng: -81.023, languages: ['English'], accepts: ['PIP', 'LOP'], nextOpening: 'Wed 2:45 PM' },
  { id: 'gainesville', name: 'Gainesville Injury Chiropractic', city: 'Gainesville', type: 'Chiropractic', lat: 29.652, lng: -82.325, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Mon 2:00 PM' },
  { id: 'springhill', name: 'Spring Hill Chiropractic', city: 'Spring Hill', type: 'Chiropractic', lat: 28.477, lng: -82.526, languages: ['English'], accepts: ['PIP'], nextOpening: 'Thu 11:15 AM' },
  { id: 'miami-spine', name: 'Miami Spine & Injury', city: 'Miami', type: 'Chiropractic', lat: 25.762, lng: -80.192, languages: ['English', 'Spanish', 'Creole'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 9:00 AM' },
  { id: 'hialeah', name: 'Hialeah Injury Center', city: 'Hialeah', type: 'Chiropractic', lat: 25.858, lng: -80.278, languages: ['Spanish', 'English'], accepts: ['PIP', 'LOP'], nextOpening: 'Mon 4:00 PM' },
  { id: 'homestead', name: 'Homestead Chiropractic', city: 'Homestead', type: 'Chiropractic', lat: 25.469, lng: -80.478, languages: ['English', 'Spanish'], accepts: ['PIP'], nextOpening: 'Wed 10:00 AM' },
  { id: 'fortmyers', name: 'Fort Myers Spine Center', city: 'Fort Myers', type: 'Chiropractic', lat: 26.64, lng: -81.87, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Fri 9:00 AM' },
  { id: 'naples', name: 'Naples Injury Care', city: 'Naples', type: 'Chiropractic', lat: 26.142, lng: -81.795, languages: ['English'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 1:00 PM' },
  { id: 'jax', name: 'First Coast Spine', city: 'Jacksonville', type: 'Orthopedics', lat: 30.332, lng: -81.656, languages: ['English'], accepts: ['LOP'], nextOpening: 'Thu 8:00 AM' },
  { id: 'gulf-ortho', name: 'Gulf Coast Orthopedics', city: 'Sarasota', type: 'Orthopedics', lat: 27.337, lng: -82.531, languages: ['English', 'Spanish'], accepts: ['LOP'], nextOpening: 'Wed 11:00 AM' },
  { id: 'pb-ortho', name: 'Palm Beach Ortho & Spine', city: 'West Palm Beach', type: 'Orthopedics', lat: 26.715, lng: -80.053, languages: ['English', 'Spanish'], accepts: ['LOP'], nextOpening: 'Mon 9:30 AM' },
  { id: 'coastal-ortho', name: 'Coastal Ortho Partners', city: 'Fort Lauderdale', type: 'Orthopedics', lat: 26.122, lng: -80.137, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Tue 2:30 PM' },
  { id: 'img-tampa', name: 'Advanced Imaging of Tampa', city: 'Tampa', type: 'MRI / Imaging', lat: 27.96, lng: -82.49, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Today 4:00 PM' },
  { id: 'img-boca', name: 'Advanced Imaging of Boca Raton', city: 'Boca Raton', type: 'MRI / Imaging', lat: 26.368, lng: -80.129, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Tomorrow 8:30 AM' },
  { id: 'img-tally', name: 'Advanced Imaging of Tallahassee', city: 'Tallahassee', type: 'MRI / Imaging', lat: 30.438, lng: -84.281, languages: ['English'], accepts: ['PIP', 'LOP'], nextOpening: 'Thu 10:00 AM' },
  { id: 'img-tc', name: 'Treasure Coast Imaging', city: 'Port St. Lucie', type: 'MRI / Imaging', lat: 27.273, lng: -80.358, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Wed 7:30 AM' },
  { id: 'sunshine', name: 'Sunshine Injury Telehealth', city: 'Davie', type: 'Telehealth', lat: 26.063, lng: -80.233, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Today 5:15 PM', statewide: true },
  { id: 'summit-spine', name: 'Summit Spine & Rehab', city: 'Orlando', type: 'Orthopedics', lat: 28.47, lng: -81.3, languages: ['English', 'Spanish'], accepts: ['PIP', 'LOP'], nextOpening: 'Fri 1:00 PM' },
  { id: 'city-surgery', name: 'City Surgery Center', city: 'Miami', type: 'Surgery center', lat: 25.79, lng: -80.21, languages: ['English', 'Spanish'], accepts: ['LOP'], nextOpening: 'Next Mon' },
];

export const CITIES: Record<string, { lat: number; lng: number }> = {
  Kissimmee: { lat: 28.292, lng: -81.408 }, Orlando: { lat: 28.538, lng: -81.379 }, Sanford: { lat: 28.8, lng: -81.273 },
  Lakeland: { lat: 28.039, lng: -81.95 }, Melbourne: { lat: 28.083, lng: -80.608 }, Tampa: { lat: 27.951, lng: -82.457 },
  'St. Petersburg': { lat: 27.773, lng: -82.64 }, Bradenton: { lat: 27.499, lng: -82.575 }, Sarasota: { lat: 27.337, lng: -82.531 },
  'Fort Myers': { lat: 26.64, lng: -81.87 }, Naples: { lat: 26.142, lng: -81.795 }, Jacksonville: { lat: 30.332, lng: -81.656 },
  Gainesville: { lat: 29.652, lng: -82.325 }, Ocala: { lat: 29.187, lng: -82.14 }, 'Daytona Beach': { lat: 29.21, lng: -81.023 },
  Tallahassee: { lat: 30.438, lng: -84.281 }, 'Port St. Lucie': { lat: 27.273, lng: -80.358 }, 'West Palm Beach': { lat: 26.715, lng: -80.053 },
  'Boca Raton': { lat: 26.368, lng: -80.129 }, 'Fort Lauderdale': { lat: 26.122, lng: -80.137 }, Davie: { lat: 26.063, lng: -80.233 },
  Miami: { lat: 25.762, lng: -80.192 }, Hialeah: { lat: 25.858, lng: -80.278 }, Homestead: { lat: 25.469, lng: -80.478 },
};

/** Great-circle distance in miles. */
export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type Parsed = { type?: PracticeType; city?: string; language?: string; coverage?: ('PIP' | 'LOP')[]; soon: boolean };

/** Tiny keyword parser so a visitor's own sentence still produces sensible chips and results. */
export function parsePrompt(text: string): Parsed {
  const t = text.toLowerCase();
  const out: Parsed = { soon: /this week|today|tomorrow|asap|soon/.test(t) };
  if (/chiro/.test(t)) out.type = 'Chiropractic';
  else if (/mri|imaging|x-?ray|ct scan/.test(t)) out.type = 'MRI / Imaging';
  else if (/ortho|surgeon|spine specialist/.test(t)) out.type = 'Orthopedics';
  else if (/surgery center|surgical/.test(t)) out.type = 'Surgery center';
  if (/telehealth|video|virtual|can'?t travel|cannot travel|remote/.test(t)) out.type = 'Telehealth';
  for (const c of Object.keys(CITIES)) if (t.includes(c.toLowerCase())) { out.city = c; break; }
  if (/spanish|español|habla/.test(t)) out.language = 'Spanish';
  else if (/creole|kreyol/.test(t)) out.language = 'Creole';
  const cov: ('PIP' | 'LOP')[] = [];
  if (/\bpip\b|no-?fault/.test(t)) cov.push('PIP');
  if (/\blop\b|letter of protection|lien/.test(t)) cov.push('LOP');
  if (cov.length) out.coverage = cov;
  return out;
}

export function matchPractices(p: Parsed, limit = 3): { practice: Practice; miles: number }[] {
  const origin = CITIES[p.city || 'Kissimmee'];
  const type = p.type || 'Chiropractic';
  let pool = PRACTICES.filter((x) => (type === 'Telehealth' ? x.statewide : x.type === type));
  if (p.language) pool = pool.filter((x) => x.languages.includes(p.language!));
  if (p.coverage?.length) pool = pool.filter((x) => p.coverage!.every((c) => x.accepts.includes(c)));
  if (!pool.length) pool = PRACTICES.filter((x) => x.type === type);
  if (!pool.length) pool = PRACTICES.filter((x) => x.type === 'Chiropractic');
  return pool
    .map((practice) => ({ practice, miles: practice.statewide ? 0 : milesBetween(origin, practice) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, limit);
}
