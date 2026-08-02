/**
 * Single source of truth for site-wide metadata.
 *
 * Before the Astro migration this lived in four hand-synced copies inside
 * index.html (meta description, Open Graph, Twitter card, JSON-LD). Editing
 * one and forgetting the others was the main way the site drifted.
 */

export const SITE = {
  url: 'https://charlielinville.me',
  name: 'Charlie Linville',
  title: 'Charlie Linville — AI Engineer, Founder & Quantitative Systems Builder',
  description:
    'Charlie Linville is a founder, AI engineer, and applied math student at UW-Madison building AI agents, quantitative trading systems, and production software for real clients.',
  shortDescription:
    'Founder, AI engineer, and applied math student building AI agents, quantitative trading systems, and production software for real clients.',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/assets/og-image.png',
  email: 'charlie@benlaura.com',
  location: { city: 'Denver', region: 'CO', country: 'US' },
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
] as const;

export const SOCIALS = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/charlie-linville' },
  { name: 'GitHub', href: 'https://github.com/linville-charlie' },
  { name: 'Substack', href: 'https://clinville.substack.com/' },
  { name: 'X', href: 'https://x.com/CharlieLinvill2' },
] as const;

/** Wikidata item for this Charlie Linville — not the Everest mountaineer. */
export const WIKIDATA_ID = 'Q139267651';

/**
 * The shared `Person` node. Every page references this by @id so the whole
 * site describes one entity rather than several unrelated ones — which is
 * what lets Google separate this Charlie Linville from the namesakes.
 */
export const PERSON_ID = `${SITE.url}/#person`;

export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Charlie Linville',
  url: SITE.url,
  jobTitle: 'Co-Founder & AI Engineer',
  description: SITE.description,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.country,
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Wisconsin-Madison',
  },
  worksFor: [
    { '@type': 'Organization', name: 'Updraft Consulting' },
    { '@type': 'Organization', name: 'Guleki', url: 'https://guleki.com' },
  ],
  sameAs: [
    `https://www.wikidata.org/wiki/${WIKIDATA_ID}`,
    ...SOCIALS.map((s) => s.href),
  ],
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Wikidata',
    value: WIKIDATA_ID,
    url: `https://www.wikidata.org/wiki/${WIKIDATA_ID}`,
  },
  knowsAbout: [
    'Artificial Intelligence',
    'AI Consulting',
    'Agentic AI Systems',
    'Quantitative Trading',
    'Machine Learning',
    'Quantum Computing',
    'Systems Architecture',
  ],
};
