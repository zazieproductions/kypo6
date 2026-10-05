#!/usr/bin/env node
/**
 * KYPO6 — LEGACY ROUTE TESTS
 * =============================================================================
 *   npm test                       → unit tests against the matcher + registry
 *   npm test -- --server URL       → ALSO hit a running host (dev-server, or the
 *                                    deployed site) and assert HTTP statuses:
 *                                    e.g. node scripts/check-legacy-routes.mjs --server http://localhost:8080
 *                                         node scripts/check-legacy-routes.mjs --server https://kypo6.com
 * Zero dependencies.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { archiveRecords, sitePages, legacyFamilies } from '../src/data/legacyRoutes.js';
import { resolveLegacyPath, listKnownPaths, normalizePath } from '../src/lib/legacyRouting.js';
import { renderArchivePage, metaFor } from '../src/lib/archiveRender.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
let passes = 0;

function ok(cond, msg) {
  if (cond) passes++;
  else {
    failures++;
    console.error('  ✗', msg);
  }
}
function eq(actual, expected, msg) {
  ok(actual === expected, `${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/* ----------------------------------------------------------------------------
 * 1. Registry integrity
 * ------------------------------------------------------------------------- */
console.log('• registry integrity');
{
  const ids = new Set();
  for (const e of [...archiveRecords, ...sitePages]) {
    ok(!ids.has(e.id), `duplicate id ${e.id}`);
    ids.add(e.id);
    ok(e.canonicalPath.startsWith('/') && e.canonicalPath.endsWith('/'), `${e.id} canonicalPath must start+end with "/"`);
    ok(e.seo?.title && e.seo?.description, `${e.id} needs seo.title + seo.description`);
    for (const a of e.aliases || []) {
      ok(['VERIFIED', 'LIKELY', 'COMPAT'].includes(a.provenance), `${e.id} alias ${a.path} has invalid provenance ${a.provenance}`);
      ok(a.provenance !== 'VERIFIED' || a.source, `${e.id} VERIFIED alias ${a.path} must cite a source`);
    }
  }
  // No alias may point at two different entries
  const seen = new Map();
  for (const p of listKnownPaths()) {
    const key = normalizePath(p.path).normalized;
    ok(!seen.has(key) || seen.get(key) === p.id, `alias collision: ${p.path} claimed by ${seen.get(key)} and ${p.id}`);
    seen.set(key, p.id);
  }
  for (const f of legacyFamilies) ok(f.id && f.experienceType && f.label && f.match, `family ${f.id} incomplete`);
}

/* ----------------------------------------------------------------------------
 * 2. Every known path resolves to its own record
 * ------------------------------------------------------------------------- */
console.log('• known paths resolve to their record');
for (const p of listKnownPaths()) {
  const r = resolveLegacyPath(p.path);
  eq(r.archiveRecordId, p.id, `${p.path}`);
  eq(r.canonicalPath, p.canonicalPath, `${p.path} canonical`);
  if (p.provenance !== 'CANONICAL') eq(r.matchType, 'alias', `${p.path} matchType`);
  // refresh / trailing-slash / case variants
  const noSlash = p.path.replace(/\/$/, '');
  eq(resolveLegacyPath(noSlash).archiveRecordId, p.id, `${noSlash} (no trailing slash)`);
  eq(resolveLegacyPath(p.path.toUpperCase()).archiveRecordId, p.id, `${p.path} (upper-case)`);
  eq(resolveLegacyPath(p.path + 'amp/').archiveRecordId, p.id, `${p.path}amp/`);
  eq(resolveLegacyPath(p.path + 'feed/').archiveRecordId, p.id, `${p.path}feed/`);
}

/* ----------------------------------------------------------------------------
 * 3. Fixtures — behaviour contract
 * ------------------------------------------------------------------------- */
console.log('• behavioural fixtures');
const fixtures = [
  // [path, experienceType, matchType, archiveRecordId|null, arrival]
  ['/', 'homepage', 'canonical', null, 'homepage'],
  ['/archive/071916-pf/', 'fabricated-broadcast', 'canonical', '071916-PF', 'archive-record'],
  ['/archive/0716-utica-fob3/', 'production-file', 'canonical', '0716-UTICA-FOB3', 'archive-record'],
  ['/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/', 'fabricated-broadcast', 'alias', '071916-PF', 'known-deep-link'],
  ['/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president/', 'fabricated-broadcast', 'alias', '071916-PF', 'known-deep-link'],
  ['/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/', 'fabricated-broadcast', 'alias', '071916-PF', 'known-deep-link'],
  ['/pope-francis-shocks-world-endorses-hillary-clinton-for-president/', 'fabricated-broadcast', 'alias', '071916-PF', 'known-deep-link'],
  // Fuzzy term matching requires a subject + Hillary/Clinton + endorse*.
  ['/breaking/pope-endorses-clinton/', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  ['/news/francis-endorsed-hillary-statement.html', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  ['/2016/07/19/pope-francis-hillary-clinton-endorsement/', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  ['/reference/pontiff-endorsed-clinton/', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  ['/news/pope-clinton-endorse.html', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  // Every fuzzy match resolves to the same canonical experience.
  ['/legacy/francis-clinton-endorsement/', 'fabricated-broadcast', 'terms', '071916-PF', 'known-deep-link'],
  // must NOT fuzzy-match without all three signal groups
  ['/breaking/pope-francis-hillary-clinton/', 'breaking-archive', 'family', null, 'unknown-legacy-link'],
  ['/breaking/hillary-clinton-endorsement/', 'breaking-archive', 'family', null, 'unknown-legacy-link'],
  ['/breaking/pope-francis-endorses-donald-trump/', 'breaking-archive', 'family', 'BRK-9F89', 'unknown-legacy-link'],
  ['/hillary-clinton-emails/', 'unrecovered', 'none', null, 'unknown-legacy-link'],

  // Utica
  ['/utica-new-york/father-of-the-bride-iii-to-be-filmed-in-utica-new-york-find-out-plot-details/', 'production-file', 'alias', '0716-UTICA-FOB3', 'known-deep-link'],
  ['/father-of-the-bride-iii-to-begin-filming-in-utica-new-york/', 'production-file', 'alias', '0716-UTICA-FOB3', 'known-deep-link'],
  ['/breaking/father-of-the-bride-iii-filming-in-utica/', 'production-file', 'alias', '0716-UTICA-FOB3', 'known-deep-link'],
  ['/breaking/father-of-the-bride-3-utica-ny/', 'production-file', 'terms', '0716-UTICA-FOB3', 'known-deep-link'],
  ['/utica-new-york/bride-sequel-utica/', 'production-file', 'terms', '0716-UTICA-FOB3', 'known-deep-link'],
  ['/utica-new-york/harry-potter-spinoff-to-film-in-utica/', 'regional-desk', 'family', null, 'unknown-legacy-link'],
  ['/utica-new-york/', 'regional-desk', 'family', null, 'unknown-legacy-link'],
  // breaking
  ['/breaking/some-forgotten-2016-headline/', 'breaking-archive', 'family', null, 'unknown-legacy-link'],
  ['/breaking/', 'breaking-archive', 'family', null, 'unknown-legacy-link'],
  ['/breaking', 'breaking-archive', 'family', null, 'unknown-legacy-link'],
  // WordPress taxonomy
  ['/category/entertainment/', 'archive-index', 'family', null, 'unknown-legacy-link'],
  ['/category/entertainment/page/3/', 'archive-index', 'family', null, 'unknown-legacy-link'],
  ['/tag/pope-francis/', 'transmission-tag', 'family', null, 'unknown-legacy-link'],
  ['/author/admin/', 'personnel-record', 'family', null, 'unknown-legacy-link'],
  ['/page/7/', 'paginated-recovery', 'family', null, 'unknown-legacy-link'],
  ['/2016/07/19/some-slug/', 'dated-record', 'family', null, 'unknown-legacy-link'],
  ['/2016/07/', 'dated-record', 'family', null, 'unknown-legacy-link'],
  // WordPress infrastructure
  ['/wp-content/uploads/2016/07/pope.jpg', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/wp-includes/js/jquery/jquery.js', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/wp-json/wp/v2/posts', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/wp-json', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/wp-admin/', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/wp-login.php', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/xmlrpc.php', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/feed/', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/feed', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/comments/feed/', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  ['/feed/rss2/', 'cms-artifact', 'family', null, 'unknown-legacy-link'],
  // about / disclosure
  ['/about/', 'disclosure', 'canonical', 'DISCLOSURE', 'site-page'],
  ['/about', 'disclosure', 'canonical', 'DISCLOSURE', 'site-page'],
  ['/about-us/', 'disclosure', 'alias', 'DISCLOSURE', 'site-page-alias'],
  ['/about-this-site/', 'disclosure', 'alias', 'DISCLOSURE', 'site-page-alias'],
  ['/archive/about/', 'disclosure', 'alias', 'DISCLOSURE', 'site-page-alias'],
  ['/archive/', 'archive-home', 'canonical', 'ARCHIVE-INDEX', 'site-page'],
  // unknown + hostile input
  ['/some/totally/unknown/thing', 'unrecovered', 'none', null, 'unknown-legacy-link'],
  ['/<script>alert(1)</script>/', 'unrecovered', 'none', null, 'unknown-legacy-link'],
  ['/%E2%9C%93/%zz', 'unrecovered', 'none', null, 'unknown-legacy-link'],
  ['/' + 'a'.repeat(3000), 'unrecovered', 'none', null, 'unknown-legacy-link'],
  // current-site assets must stay plain 404s
  ['/src/lib/nope.js', 'asset-missing', 'none', null, 'asset-404'],
];
for (const [path, type, match, id, arrival] of fixtures) {
  const r = resolveLegacyPath(path);
  eq(r.experienceType, type, `${path} experienceType`);
  eq(r.matchType, match, `${path} matchType`);
  if (id !== null) eq(r.archiveRecordId, id, `${path} archiveRecordId`);
  if (match === 'terms' && id === '071916-PF') {
    eq(r.canonicalPath, '/archive/071916-pf/', `${path} canonical experience`);
    eq(metaFor(r).canonical, '/archive/071916-pf/', `${path} canonical metadata`);
  }
  eq(r.arrival, arrival, `${path} arrival`);
  eq(r.requestedPath, path, `${path} must preserve requestedPath exactly`);
  ok(typeof r.checksum === 'string' && /^[0-9A-F]{4}-[0-9A-F]{4}$/.test(r.checksum), `${path} checksum format`);
  ok(r.routeKey.startsWith('legacy:'), `${path} routeKey`);
}

/* ----------------------------------------------------------------------------
 * 4. Rendering safety + metadata
 * ------------------------------------------------------------------------- */
console.log('• rendering + metadata');
{
  const hostile = resolveLegacyPath('/breaking/<img src=x onerror=alert(1)>/"><script>x</script>/');
  const html = renderArchivePage(hostile);
  ok(!html.includes('<img src=x'), 'pathname is escaped in breaking-archive render');
  ok(!html.includes('<script>x</script>'), 'script tags in pathname are escaped');
  ok(html.includes('&lt;img src=x'), 'escaped form present');

  const unk = renderArchivePage(resolveLegacyPath('/breaking/some-forgotten-2016-headline/'));
  ok(unk.includes('/breaking/some-forgotten-2016-headline/'), 'unknown /breaking/ page displays the incoming pathname');
  ok(unk.includes('No surviving copy of this record has been located'), 'unknown /breaking/ copy present');

  const u404 = renderArchivePage(resolveLegacyPath('/whatever/'));
  ok(u404.includes('404 // ARCHIVE RECORD UNAVAILABLE'), 'catch-all headline');
  ok(u404.includes('UNRECOVERED'), 'catch-all status');

  const pope = resolveLegacyPath('/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/');
  const popeHtml = renderArchivePage(pope);
  for (const needle of ['ORIGINAL RECORD STATUS', 'FABRICATED', 'LEGACY NETWORK', 'DECOMMISSIONED', 'ARCHIVE RECOVERED', '2026', 'CURRENT OPERATOR', 'UNRELATED', 'VERIFIED HISTORICAL REFERENCE']) {
    ok(popeHtml.includes(needle), `pope record shows "${needle}"`);
  }
  ok(!/I have been hesitant to offer any kind of support/.test(popeHtml), 'fabricated article body is NOT reproduced');
  const popeMeta = metaFor(pope);
  eq(popeMeta.title, 'Archived KYPO6 Record: Pope Francis / Clinton Story (2016)', 'pope seo title');
  eq(popeMeta.canonical, '/archive/071916-pf/', 'pope canonical');
  eq(popeMeta.robots, 'index,follow', 'pope robots');

  const flexiblePope = resolveLegacyPath('/news/pope-clinton-endorse.html');
  const flexiblePopeHtml = renderArchivePage(flexiblePope);
  ok(flexiblePopeHtml.includes('/news/pope-clinton-endorse.html'), 'term-matched record preserves/displays the incoming pathname');
  ok(flexiblePopeHtml.includes('matched by subject terms'), 'term match provenance is explained');
  ok(flexiblePopeHtml.includes('The page that lived here was fabricated'), 'term-matched record clearly labels the former story as fabricated');
  eq(metaFor(flexiblePope).canonical, '/archive/071916-pf/', 'term-matched record canonical target');

  const utica = renderArchivePage(resolveLegacyPath('/father-of-the-bride-iii-filming-in-utica/'));
  for (const needle of ['PRODUCTION FILE // UTICA', 'FILM NEVER ARRIVED', 'RECOVERED']) ok(utica.includes(needle), `utica record shows "${needle}"`);

  const cms = renderArchivePage(resolveLegacyPath('/wp-content/uploads/x.jpg'));
  for (const needle of ['LEGACY CMS ARTIFACT', 'RESOURCE NO LONGER PRESENT', 'REFERENCE RETAINED BY ARCHIVE']) ok(cms.includes(needle), `cms artifact shows "${needle}"`);

  const unknownMeta = metaFor(resolveLegacyPath('/nope/'));
  eq(unknownMeta.canonical, null, 'unknown pages emit no canonical');
  ok(/noindex/.test(unknownMeta.robots), 'unknown pages are noindex');
  ok(/noindex/.test(metaFor(resolveLegacyPath('/breaking/anything-at-all/')).robots), 'arbitrary /breaking/ pages are noindex (no mintable index space)');
  ok(/^index/.test(metaFor(resolveLegacyPath('/breaking/pope-endorses-clinton/')).robots), 'term-matched record pages are indexable with canonical');
  ok(!/Disallow:\s*\/src/.test(readFileSync(join(ROOT, 'robots.txt'), 'utf8')), 'robots.txt does not block /src/ (crawlers must fetch CSS/JS)');

  // hook fields exist and are hidden while null
  for (const r of archiveRecords) {
    ok(r.hooks && 'sourceAuthority' in r.hooks && 'recoveryAgency' in r.hooks && 'archiveOrigin' in r.hooks, `${r.id} has ARG hook fields`);
    ok(!renderArchivePage(resolveLegacyPath(r.canonicalPath)).includes('SOURCE AUTHORITY'), `${r.id} does not render null hooks`);
  }
}

/* ----------------------------------------------------------------------------
 * 5. Generated artifacts are in sync with the registry
 * ------------------------------------------------------------------------- */
console.log('• generated artifacts');
{
  for (const e of [...archiveRecords, ...sitePages]) {
    const f = join(ROOT, e.canonicalPath.replace(/^\//, ''), 'index.html');
    ok(existsSync(f), `missing generated page ${f} — run npm run build:legacy`);
    if (existsSync(f)) {
      const html = readFileSync(f, 'utf8');
      ok(html.includes(`<title>${e.seo.title.replace(/&/g, '&amp;')}`), `${e.canonicalPath} has static title`);
      ok(html.includes(`rel="canonical" href="https://kypo6.com${e.canonicalPath}"`), `${e.canonicalPath} has canonical link`);
      ok(html.includes('src="/src/lib/archiveShell.js"'), `${e.canonicalPath} loads shell with absolute path`);
    }
  }
  ok(existsSync(join(ROOT, '404.html')), '404.html exists');
  const redirects = existsSync(join(ROOT, '_redirects')) ? readFileSync(join(ROOT, '_redirects'), 'utf8') : '';
  for (const p of listKnownPaths()) {
    if (p.provenance === 'CANONICAL') continue;
    ok(redirects.includes(`${p.path} ${p.canonicalPath} 200`), `_redirects contains ${p.path} — run npm run build:legacy`);
  }
  ok(!/^\S+[ \t]+\S+[ \t]+\d+[ \t]+#/m.test(redirects), '_redirects has no inline comments (Cloudflare would drop those lines)');
  ok(existsSync(join(ROOT, 'index.html')), 'homepage still present');
}

/* ----------------------------------------------------------------------------
 * 6. Optional: live HTTP checks against a running host
 * ------------------------------------------------------------------------- */
const serverIdx = process.argv.indexOf('--server');
if (serverIdx !== -1) {
  const base = process.argv[serverIdx + 1].replace(/\/$/, '');
  console.log(`• live HTTP checks against ${base}`);
  const expect = [
    ['/', 200, "KYPO6 | The Basin's Hourly Agitator & Unlicensed Chronicle"],
    ['/about/', 200, 'DISCLOSURE'],
    ['/archive/', 200, 'RECOVERED RECORDS'],
    ['/archive/071916-pf/', 200, 'ARCHIVE RECORD 071916-PF'],
    ['/archive/0716-utica-fob3/', 200, 'PRODUCTION FILE // UTICA'],
    ['/breaking/pope-francis-shocks-world-endorses-hillary-clinton-for-president-releases-statement/', 200, 'ARCHIVE RECORD 071916-PF'],
    ['/pope-francis-shocks-world-endorses-hillary-clinton-for-president/', 200, 'ARCHIVE RECORD 071916-PF'],
    ['/utica-new-york/father-of-the-bride-iii-to-be-filmed-in-utica-new-york-find-out-plot-details/', 200, 'PRODUCTION FILE // UTICA'],
    ['/about-us/', 200, 'DISCLOSURE'],
    ['/breaking/some-forgotten-2016-headline/', 404, 'archiveShell.js'],
    ['/news/pope-clinton-endorse.html', 404, 'archiveShell.js'],
    ['/category/whatever/', 404, 'archiveShell.js'],
    ['/wp-json/wp/v2/posts', 404, 'archiveShell.js'],
    ['/xmlrpc.php', 404, 'archiveShell.js'],
    ['/totally/unknown/', 404, 'archiveShell.js'],
    ['/src/lib/archiveShell.js', 200, 'resolveLegacyPath'],
    ['/src/styles/archive.css', 200, '.terminal'],
    ['/src/data/legacyRoutes.js', 200, 'archiveRecords'],
    ['/sitemap.xml', 200, '<urlset'],
    ['/robots.txt', 200, 'Sitemap:'],
  ];
  for (const [path, status, needle] of expect) {
    try {
      const resp = await fetch(base + path, { redirect: 'manual' });
      const text = await resp.text();
      eq(resp.status, status, `GET ${path} status`);
      ok(text.includes(needle), `GET ${path} body contains "${needle}"`);
    } catch (e) {
      ok(false, `GET ${path} threw ${e.message}`);
    }
  }
}

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
