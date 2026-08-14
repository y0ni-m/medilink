import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { SPECIALTIES } from '@/lib/specialties';
import { STATES, placesIn } from '@/lib/locations';
import { audienceSlugs } from '@/lib/audiences';
import { POSTS, CATEGORIES } from '@/lib/resources';

/**
 * A sitemap is not optional at this scale — location pages are only reachable through hub
 * links, and without an explicit sitemap most of them would sit undiscovered.
 *
 * Priorities are deliberately tiered so crawl budget goes to the pages that matter: core pages
 * and specialty hubs first, then state hubs, then counties, then cities.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly') => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const core = [
    entry('/', 1.0, 'weekly'),
    entry('/pricing', 0.8, 'monthly'),
    entry('/resources', 0.7, 'weekly'),
    entry('/faq', 0.6, 'monthly'),
    entry('/demo', 0.6, 'monthly'),
    entry('/compliance', 0.4, 'monthly'),
    entry('/privacy', 0.3, 'monthly'),
    entry('/terms', 0.3, 'monthly'),
    entry('/cookies', 0.3, 'monthly'),
  ];

  const specialtyHubs = audienceSlugs().map((slug) => entry(`/for/${slug}`, 0.9, 'weekly'));

  const resources = [
    ...CATEGORIES.map((c) => entry(`/resources#${c.slug}`, 0.5, 'monthly')),
    ...POSTS.map((p) => entry(`/resources/${p.slug}`, 0.6, 'monthly')),
  ];

  const locations: MetadataRoute.Sitemap = [];
  for (const specialty of SPECIALTIES) {
    for (const state of STATES) {
      locations.push(entry(`/for/${specialty.slug}/${state.slug}`, 0.7, 'monthly'));
      for (const place of placesIn(state.slug)) {
        locations.push(
          entry(
            `/for/${specialty.slug}/${state.slug}/${place.slug}`,
            place.kind === 'county' ? 0.5 : 0.4,
            'monthly'
          )
        );
      }
    }
  }

  return [...core, ...specialtyHubs, ...resources, ...locations];
}
