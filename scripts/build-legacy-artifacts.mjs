#!/usr/bin/env node
/**
 * KYPO6 — LEGACY ARTIFACT GENERATOR
 * =============================================================================
 * Reads src/data/legacyRoutes.js and writes the static files a dumb host needs:
 *
 *   404.html                       catch-all legacy router shell (served by the
 *                                  host with a real 404 status for unknown paths)
 *   about/index.html               disclosure page (pre-rendered)
 *   archive/index.html             archive register (pre-rendered)
 *   archive/<slug>/index.html      one canonical page per archive record
 *                                  (pre-rendered, indexable, 200)
 *   _redirects                     Cloudflare Pages / Netlify: 200 rewrites that
 *                                  serve the canonical page AT the legacy URL
 *                                  (URL preserved, 200 status, rel=canonical set)
 *   sitemap.xml, robots.txt
 *
 * Zero dependencies. Run:  npm run build:legacy   (or: node scripts/build-legacy-artifacts.mjs)
 * Output is committed; the host needs no build step. If you forget to run this
 * after editing the registry, 404.html still resolves new aliases client-side —
 * you just lose the 200 status for them until you regenerate.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { archiveRecords, sitePages, DISCLOSURE_SHORT } from '../src/data/legacyRoutes.js';
import { editorialPages } from '../src/data/editorialPages.js';
import { resolveLegacyPath, listKnownPaths } from '../src/lib/legacyRouting.js';
import { renderArchivePage, metaFor, esc } from '../src/lib/archiveRender.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://kypo6.com';

/* ----------------------------------------------------------------------------
 * HTML shell — mirrors index.html's <head> (fonts, Tailwind CDN + config).
 * All asset URLs are ABSOLUTE so nested legacy paths resolve them correctly.
 * ------------------------------------------------------------------------- */
function shell({ meta, body, pathForOg }) {
  const canonicalTag = meta.canonical ? `<link rel="canonical" href="${esc(SITE_ORIGIN + meta.canonical)}">` : '';
  const ogUrl = SITE_ORIGIN + (meta.canonical || pathForOg || '/');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}">
    <meta name="robots" content="${esc(meta.robots)}">
    ${canonicalTag}
    <meta property="og:site_name" content="KYPO6">
    <meta property="og:type" content="${esc(meta.ogType || 'website')}">
    <meta property="og:title" content="${esc(meta.title)}">
    <meta property="og:description" content="${esc(meta.description)}">
    <meta property="og:url" content="${esc(ogUrl)}">
    <meta name="twitter:card" content="summary">
    <meta name="generator" content="kypo6 legacy-artifact generator">
    <link rel="icon" href="data:,">

    <!-- Fonts (same set as index.html) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;0,6..72,800;1,6..72,400;1,6..72,600&family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (same CDN + theme as index.html) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/src/lib/tailwind.config.js"></script>
    <link rel="stylesheet" href="/src/styles/archive.css">
</head>
<body class="py-4 md:py-8 px-2 md:px-6 antialiased selection:bg-tabloidYellow selection:text-black">
    <div id="archiveRoot" class="archive-skeleton">
${body}
    </div>
    <noscript>
        <div class="newspaper-sheet max-w-3xl mx-auto mt-4 p-4 font-mono text-xs border border-ink">
            JavaScript is disabled. Static copy shown above. ${esc(DISCLOSURE_SHORT)}
        </div>
    </noscript>
    <script type="module" src="/src/lib/archiveShell.js"></script>
</body>
</html>
`;
}

function write(relPath, content) {
  const abs = join(ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log('  wrote', relPath);
}

/* ----------------------------------------------------------------------------
 * 1. Pre-rendered canonical pages
 * ------------------------------------------------------------------------- */
function buildCanonicalPages() {
  const entries = [...archiveRecords, ...sitePages];
  for (const entry of entries) {
    const res = resolveLegacyPath(entry.canonicalPath);
    if (res.record !== entry) throw new Error(`Canonical path ${entry.canonicalPath} does not resolve to ${entry.id}`);
    const html = shell({ meta: metaFor(res), body: renderArchivePage(res), pathForOg: entry.canonicalPath });
    const rel = entry.canonicalPath.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    write(rel, html);
  }
}

/* ----------------------------------------------------------------------------
 * 2. 404.html — the catch-all. Pre-render the generic "unrecovered" state for a
 *    placeholder path; the module script re-renders for the real pathname.
 * ------------------------------------------------------------------------- */
function build404() {
  const res = resolveLegacyPath('/');
  // Render the unrecovered presenter with a neutral placeholder.
  const placeholder = resolveLegacyPath('/unknown-legacy-record/');
  placeholder.displayPath = '(resolving…)';
  placeholder.requestedPath = '(resolving…)';
  const meta = metaFor(placeholder);
  write('404.html', shell({ meta: { ...meta, robots: 'noindex,follow', canonical: null }, body: renderArchivePage(placeholder), pathForOg: '/' }));
  void res;
}

/* ----------------------------------------------------------------------------
 * 3. _redirects — 200 rewrites (URL preserved) for every exact known alias.
 *    Fuzzy term matches and families are handled client-side by 404.html.
 * ------------------------------------------------------------------------- */
function buildRedirects() {
  const lines = [
    '# KYPO6 — GENERATED FILE. Do not hand-edit.',
    '# Source: src/data/legacyRoutes.js   Regenerate: npm run build:legacy',
    '#',
    '# These are 200 REWRITES (proxy), not redirects: the legacy URL stays in the',
    '# address bar, the canonical archive page is served with a 200, and the page',
    '# carries <link rel="canonical"> to avoid duplicate indexing. Unknown paths',
    '# never reach this file — the host serves /404.html for them (status 404).',
    '#',
    '# Format: [source] [destination] [code]   (Cloudflare Pages / Netlify)',
    '',
  ];
  const seen = new Set();
  for (const p of listKnownPaths()) {
    if (p.provenance === 'CANONICAL') continue;
    const variants = new Set([p.path, p.path.endsWith('/') ? p.path.slice(0, -1) : p.path + '/']);
    for (const v of variants) {
      if (!v || v === '/' || seen.has(v)) continue;
      seen.add(v);
      lines.push(`# ${p.provenance} → ${p.id}`);
      lines.push(`${v} ${p.canonicalPath} 200`);
    }
  }
  lines.push('');
  write('_redirects', lines.join('\n'));
}

/* ----------------------------------------------------------------------------
 * 4. sitemap.xml + robots.txt — canonical pages only.
 * ------------------------------------------------------------------------- */
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  // The dispatches are hand-authored current content, separate from the legacy registry.
  const urls = ['/', ...[...archiveRecords, ...sitePages].map((e) => e.canonicalPath), ...editorialPages.map((e) => e.canonicalPath)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(SITE_ORIGIN + u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
  write('sitemap.xml', xml);
  write(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`,
  );
  // Keep source modules fetchable (crawlers need them to render) but unindexed.
  write(
    '_headers',
    `# KYPO6 — GENERATED FILE (npm run build:legacy). Cloudflare Pages / Netlify header rules.
/src/*
  X-Robots-Tag: noindex
/scripts/*
  X-Robots-Tag: noindex
/package.json
  X-Robots-Tag: noindex
`,
  );
}

console.log('KYPO6 legacy artifacts →', ROOT);
buildCanonicalPages();
build404();
buildRedirects();
buildSitemap();
console.log('done.');
