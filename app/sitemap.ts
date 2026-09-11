import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { SPECIALTIES } from '@/lib/specialties';
import { STATES, placesIn } from '@/lib/locations';
import { audienceSlugs } from '@/lib/audiences';
import { POSTS } from '@/lib/resources';

/**
 * A sitemap is not optional at this scale — location pages are only reachable through hub
 * links, and without an explicit sitemap most of them would sit undiscovered.
 *
 * Priorities are deliberately tiered so crawl budget goes to the pages that matter: core pages
 * and specialty hubs first, then state hubs, then counties, then cities.
 *
 * lastModified is set only where we have a real date (post publish dates) — a sitemap that
 * stamps every URL with the build time trains Google to ignore its lastmod entirely.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: 'weekly' | 'monthly',
    lastModified?: string
  ) => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
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

  // No category entries: /resources#slug fragments are invalid in sitemaps (Google strips
  // the fragment, leaving duplicate /resources URLs), and ?category= views are filtered
  // duplicates of the same content.
  const resources = POSTS.map((p) => entry(`/resources/${p.slug}`, 0.6, 'monthly', p.date));

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
