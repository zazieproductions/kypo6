/**
 * KYPO6 — LEGACY ROUTE REGISTRY
 * =============================================================================
 * Single source of truth for every historical / legacy URL the site knows how
 * to receive. Nothing in here is "routing logic" — it is DATA. The matcher
 * lives in ../lib/legacyRouting.js and the presenters in ../lib/archiveRender.js.
 *
 * TO ADD A NEWLY DISCOVERED HISTORICAL URL:
 *   1. Find (or add) the record below.
 *   2. Append an alias object:  { path: '/old/path/', provenance: 'VERIFIED', source: '…' }
 *   3. (Optional) run `npm run build:legacy` to regenerate _redirects / sitemap /
 *      canonical record shells. Even if you skip this step, 404.html resolves the
 *      alias client-side — the build step only upgrades it from a 404 to a 200.
 *
 * TO UPGRADE A GUESSED PATH ONCE THE EXACT ARCHIVED URL IS FOUND:
 *   Change its `provenance` from 'LIKELY' / 'COMPAT' to 'VERIFIED' and add a
 *   `source` note. Nothing else needs to change.
 *
 * PROVENANCE VOCABULARY (surfaced in the UI, so be honest):
 *   VERIFIED — an exact URL seen in a surviving third-party citation / archive
 *   LIKELY   — a plausible variant of a verified URL (not independently seen)
 *   COMPAT   — a compatibility route we chose to accept; no historical claim
 *
 * This file is plain ESM so it loads in the browser AND in Node (scripts/).
 * Keep it dependency-free.
 */

export const PROVENANCE = Object.freeze({
  VERIFIED: 'VERIFIED HISTORICAL REFERENCE',
  LIKELY: 'LIKELY LEGACY VARIANT',
  COMPAT: 'COMPATIBILITY ROUTE',
  CANONICAL: 'CANONICAL ADDRESS',
  UNRECOVERED: 'UNRECOVERED',
});

/** Shared disclosure sentence reused across metadata. Keep factual. */
export const DISCLOSURE_SHORT =
  'KYPO6 is now an unrelated independent experimental web project. The present operator is not affiliated with the former operators of this domain.';

/** Site-wide archive constants (ARG surface — adjust with care). */
export const ARCHIVE_META = Object.freeze({
  recoveredYear: 2026,
  legacyNetworkStatus: 'DECOMMISSIONED',
  currentOperator: 'UNRELATED',
  legacyPlatform: 'WordPress-era CMS (inferred from surviving URL structure)',
  /* Hidden cross-project hooks. Intentionally null. Renderers only print
     these when non-null, so they can be lit up later without touching UI. */
  sourceAuthority: null,
  recoveryAgency: null,
  archiveOrigin: null,
});

/* -----------------------------------------------------------------------------
 * HISTORICAL ARCHIVE RECORDS
 * One entry per *story* that once lived on the old site. Many URLs → one record.
 * -------------------------------------------------------------------------- */
export const archiveRecords = [
  {
    id: '071916-PF',
    canonicalPath: '/archive/071916-pf/',
    experienceType: 'fabricated-broadcast',
    title: 'Pope Francis / Clinton Endorsement Story',
    /* Historical headline is shown ONLY to explain which link the visitor
       followed. It is never presented as a claim. */
    historicalHeadline:
      'Pope Francis Shocks World, Endorses Hillary Clinton for President, Releases Statement',
    status: 'FABRICATED',
    originalDate: '2016-07-19',
    dateConfidence: 'reported by BuzzFeed News (Dec 2016)',
    summary:
      'A fabricated political story that circulated from this domain in July 2016, claiming a papal endorsement that never happened. It was one of several near-identical "papal endorsement" hoaxes produced by a network of fake local-TV news websites. No such endorsement was ever made.',
    seo: {
      title: 'Archived KYPO6 Record: Pope Francis / Clinton Story (2016)',
      description:
        'Historical archive entry for a fabricated story previously published at this URL in 2016. KYPO6 is now an unrelated independent experimental web project.',
    },
    aliases: [
      {
        path: '/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/',
        provenance: 'VERIFIED',
        source: 'Cited verbatim as the source URL by a third-party article (VietPress USA, Oct 2016).',
      },
      { path: '/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president/', provenance: 'LIKELY' },
      { path: '/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/', provenance: 'LIKELY' },
      { path: '/pope-francis-shocks-world-endorses-hillary-clinton-for-president/', provenance: 'LIKELY' },
    ],
    /* Fuzzy fallback: EVERY group must be satisfied by at least one path token.
       A trailing `*` makes a term a prefix (endors* → endorse/endorses/endorsed). */
    matchTerms: [
      ['pope', 'francis', 'pontiff'],
      ['hillary', 'clinton'],
    ],
    references: [
      {
        label: 'Snopes fact-check — "Pope Francis Shocks World, Endorses Hillary Clinton for President" (July 24, 2016)',
        url: 'https://www.snopes.com/fact-check/pope-francis-shocks-world-endorses-hillary-clinton-for-president/',
      },
      {
        label: 'BuzzFeed News — "The True Story Behind The Biggest Fake News Hit Of The Election" (Dec 16, 2016)',
        url: 'https://www.buzzfeednews.com/article/craigsilverman/the-strangest-fake-news-empire',
      },
    ],
    /* ARG hooks — null by default, rendered only when set. */
    hooks: { sourceAuthority: null, recoveryAgency: null, archiveOrigin: null },
    anomalies: [],
  },

  {
    id: '0716-UTICA-FOB3',
    canonicalPath: '/archive/0716-utica-fob3/',
    experienceType: 'production-file',
    title: 'Father of the Bride III / Utica Production Claim',
    historicalHeadline: 'Father of the Bride III to Be Filmed in Utica, New York — Find Out Plot Details',
    status: 'FILM NEVER ARRIVED',
    originalDate: '2016-07',
    dateConfidence: 'approximate — month inferred from the earliest surviving third-party citation',
    summary:
      'A fabricated local-interest story claiming a major film sequel would shoot in Utica, New York. It belonged to a mass-produced template ("[famous film] to be filmed in [your town]") that the same network ran across hundreds of locations. No production ever came.',
    seo: {
      title: 'Archived KYPO6 Record: Father of the Bride III / Utica Story (2016)',
      description:
        'Historical archive entry for a fabricated local-news story previously published at this URL in 2016. The film never arrived. KYPO6 is now an unrelated independent experimental web project.',
    },
    aliases: [
      {
        path: '/utica-new-york/father-of-the-bride-iii-to-be-filmed-in-utica-new-york-find-out-plot-details/',
        provenance: 'VERIFIED',
        source: 'Hyperlinked directly by Lite 98.7 (Utica, NY) in its 2016 debunking post.',
      },
      { path: '/father-of-the-bride-iii-to-begin-filming-in-utica-new-york/', provenance: 'LIKELY' },
      { path: '/breaking/father-of-the-bride-iii-to-begin-filming-in-utica-new-york/', provenance: 'LIKELY' },
      { path: '/father-of-the-bride-iii-filming-in-utica/', provenance: 'LIKELY' },
      { path: '/breaking/father-of-the-bride-iii-filming-in-utica/', provenance: 'LIKELY' },
      { path: '/father-of-the-bride-iii-to-be-filmed-in-utica-new-york-find-out-plot-details/', provenance: 'LIKELY' },
      { path: '/breaking/father-of-the-bride-iii-to-be-filmed-in-utica-new-york-find-out-plot-details/', provenance: 'LIKELY' },
    ],
    matchTerms: [
      ['father', 'bride', 'fotb'],
      ['utica'],
    ],
    references: [
      {
        label: 'Lite 98.7 — "\u2018Father of the Bride III\u2019 Rumored to Be Filming in Utica" (2016)',
        url: 'https://lite987.com/father-of-the-bride-iii-rumored-to-be-filming-in-utica/',
      },
      {
        label: 'BuzzFeed News — on the "film sequel filming in your town" hoax template (Dec 16, 2016)',
        url: 'https://www.buzzfeednews.com/article/craigsilverman/the-strangest-fake-news-empire',
      },
    ],
    hooks: { sourceAuthority: null, recoveryAgency: null, archiveOrigin: null },
    anomalies: [],
  },
];

/* -----------------------------------------------------------------------------
 * SITE PAGES THAT ALSO ACCEPT LEGACY ALIASES
 * (Current-project pages, not historical stories.)
 * -------------------------------------------------------------------------- */
export const sitePages = [
  {
    id: 'ARCHIVE-INDEX',
    canonicalPath: '/archive/',
    experienceType: 'archive-home',
    title: 'Archive Register',
    seo: {
      title: 'Archive Register — KYPO6',
      description:
        'Index of historical records recovered from legacy kypo6.com hyperlinks. KYPO6 is an unrelated independent experimental web project.',
    },
    aliases: [
      { path: '/archives/', provenance: 'COMPAT' },
      { path: '/archive/index/', provenance: 'COMPAT' },
      { path: '/sitemap/', provenance: 'COMPAT' },
    ],
  },
  {
    id: 'DISCLOSURE',
    canonicalPath: '/about/',
    experienceType: 'disclosure',
    title: 'About This Site',
    seo: {
      title: 'About This Site — KYPO6',
      description:
        'KYPO6.com is an independent experimental web project using a previously abandoned domain. The present operator is not affiliated with the former operators of KYPO6.',
    },
    aliases: [
      {
        path: '/about-us/',
        provenance: 'VERIFIED',
        source: 'The former site\u2019s "About Us" page at this path was hyperlinked by Lite 98.7 in 2016.',
      },
      { path: '/about-this-site/', provenance: 'COMPAT' },
      { path: '/archive/about/', provenance: 'COMPAT' },
      { path: '/disclosure/', provenance: 'COMPAT' },
      { path: '/disclaimer/', provenance: 'LIKELY' },
      { path: '/contact/', provenance: 'LIKELY' },
      { path: '/contact-us/', provenance: 'LIKELY' },
      { path: '/privacy-policy/', provenance: 'LIKELY' },
      { path: '/terms/', provenance: 'LIKELY' },
    ],
  },
];

/* -----------------------------------------------------------------------------
 * LEGACY ROUTE FAMILIES
 * Prefix / pattern based. Ordered: first match wins (after records & pages).
 * `label` is the archival concept the visitor sees. `provenance` describes the
 * PREFIX itself (e.g. `/breaking/` is verified as the old permalink category).
 * -------------------------------------------------------------------------- */
export const legacyFamilies = [
  /* --- Old CMS infrastructure (must come first so e.g. /wp-json/… never
         falls into a content family) ----------------------------------- */
  {
    id: 'wp-xmlrpc',
    match: { exact: ['/xmlrpc.php'] },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'XML-RPC ENDPOINT',
    provenance: 'COMPAT',
  },
  {
    id: 'wp-login',
    match: { exact: ['/wp-login.php', '/wp-admin', '/wp-admin/'] , prefix: '/wp-admin/' },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'ADMINISTRATIVE CONSOLE',
    provenance: 'COMPAT',
  },
  {
    id: 'wp-content',
    match: { prefix: '/wp-content/' },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'UPLOADED MEDIA / THEME RESOURCE',
    provenance: 'COMPAT',
  },
  {
    id: 'wp-includes',
    match: { prefix: '/wp-includes/' },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'CORE LIBRARY RESOURCE',
    provenance: 'COMPAT',
  },
  {
    id: 'wp-json',
    match: { prefix: '/wp-json/', exact: ['/wp-json'] },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'REST API ENDPOINT',
    provenance: 'COMPAT',
  },
  {
    id: 'feed',
    match: { exact: ['/feed', '/feed/', '/comments/feed', '/comments/feed/', '/rss', '/rss/', '/atom', '/atom/'], pattern: /^\/feed\/(rss|rss2|atom|rdf)\/?$/ },
    experienceType: 'cms-artifact',
    label: 'LEGACY CMS ARTIFACT',
    artifactKind: 'SYNDICATION FEED',
    provenance: 'COMPAT',
  },

  /* --- Content families ------------------------------------------------- */
  {
    id: 'breaking',
    match: { prefix: '/breaking/' },
    experienceType: 'breaking-archive',
    label: 'RECOVERED BREAKING NEWS ARCHIVE',
    provenance: 'VERIFIED',
    note: '/breaking/ is verified as a permalink category of the former site.',
  },
  {
    id: 'utica-desk',
    match: { prefix: '/utica-new-york/' },
    experienceType: 'regional-desk',
    label: 'REGIONAL DESK // UTICA-NEW-YORK',
    region: 'Utica, New York',
    provenance: 'VERIFIED',
    note: '/utica-new-york/ is verified as a permalink category of the former site.',
  },
  {
    id: 'category',
    match: { prefix: '/category/' },
    experienceType: 'archive-index',
    label: 'ARCHIVE INDEX',
    provenance: 'COMPAT',
  },
  {
    id: 'tag',
    match: { prefix: '/tag/' },
    experienceType: 'transmission-tag',
    label: 'INDEXED TRANSMISSION TAG',
    provenance: 'COMPAT',
  },
  {
    id: 'author',
    match: { prefix: '/author/' },
    experienceType: 'personnel-record',
    label: 'PERSONNEL RECORD',
    provenance: 'COMPAT',
  },
  {
    id: 'page',
    match: { prefix: '/page/', pattern: /\/page\/\d+\/?$/ },
    experienceType: 'paginated-recovery',
    label: 'PAGINATED ARCHIVE RECOVERY',
    provenance: 'COMPAT',
  },
  {
    id: 'dated',
    /* WordPress date permalinks: /2016/07/19/slug/ */
    match: { pattern: /^\/(20\d{2})\/(\d{1,2})(?:\/(\d{1,2}))?(?:\/|$)/ },
    experienceType: 'dated-record',
    label: 'DATED ARCHIVE RECORD',
    provenance: 'COMPAT',
  },
];

/* -----------------------------------------------------------------------------
 * CURRENT-SITE PATHS THAT MUST NEVER BE TREATED AS LEGACY.
 * (Only consulted by the client-side resolver when something odd happens, e.g.
 * a host serving 404.html for an asset path. Real assets are served by the host
 * before any of this runs.)
 * -------------------------------------------------------------------------- */
export const reservedPrefixes = ['/src/', '/scripts/', '/assets/'];
