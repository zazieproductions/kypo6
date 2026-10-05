# kypo6

KYPO6.com — an independent experimental web project on a domain that, in 2016, hosted a
now-defunct imitation local-TV "news" site. Old hyperlinks to that site still exist across
fact-checks, articles, papers and media-literacy resources. This repo keeps every one of
them working as an honest, playful archival entrance instead of a dead end — and never
republishes what used to be there.

> The present operator is not affiliated with the former operators of KYPO6. See `/about/`.

## Layout

```
index.html                  ← the front page (authoritative design; markup hand-written,
                                behaviour driven by the two modules below)
404.html                    ← GENERATED catch-all legacy router shell (host serves it w/ 404)
about/index.html            ← GENERATED disclosure page
archive/index.html          ← GENERATED archive register (+ ?q= search)
archive/<record-slug>/      ← GENERATED one canonical page per historical record
_redirects                  ← GENERATED 200 rewrites: legacy URL → canonical page (URL preserved)
_headers, robots.txt, sitemap.xml   ← GENERATED
src/data/legacyRoutes.js    ← ★ THE REGISTRY — records, aliases, match terms, families
src/data/disclosure.js      ← disclosure paragraphs
src/data/newsroom.js        ← ★ THE NEWSROOM — front-page content database (pure data):
                                desks, 19 dispatches, 10 personnel dossiers, weather,
                                markets, warnings, mandate, bell, almanac, poll (+archive),
                                12-sign horoscope, 34 whispers, radio schedule, 4 historical
                                editions, 4 submission forms, 2 ad order desks, cookie hex
src/lib/legacyRouting.js    ← pure matcher: pathname → Resolution
src/lib/archiveRender.js    ← pure renderer: Resolution → HTML + metadata
src/lib/archiveShell.js     ← browser bootstrap for archive pages / 404.html
src/lib/arrival.js          ← analytics-readiness beacon (no third parties)
src/lib/frontPage.js        ← tiny homepage hooks (legacy ?p= shortlinks, inbound strip)
src/lib/newsroom.js         ← front-page engine: deep links, story reader, feature panels,
                                desks, search, poll, comments, forms, receipts, toasts
src/lib/tailwind.config.js  ← mirror of index.html's Tailwind theme
src/styles/archive.css      ← mirror of index.html's styles + archive extensions
scripts/build-legacy-artifacts.mjs  ← regenerates every GENERATED file from the registry
scripts/check-legacy-routes.mjs     ← tests (unit + optional live HTTP)
scripts/dev-server.mjs              ← local host emulator (404.html + _redirects semantics)
```

There is **no build step for deployment**. Everything is static. Node (≥18, no npm deps) is
only needed to run the optional scripts.

## How a legacy URL is resolved

`resolveLegacyPath(pathname)` in `src/lib/legacyRouting.js`, first hit wins:

1. **canonical** — path is a record/site-page `canonicalPath`
2. **alias** — path is in a record's `aliases[]` (case/trailing-slash/`.html`/`/amp/`/`/feed/` tolerant)
3. **terms** — every `matchTerms` group of a record is satisfied by a token in the path
   (the Pope/Clinton record requires a subject token, `hillary|clinton`, and `endorse*`;
   `*` is a prefix match, so `endorse`, `endorses`, `endorsed`, and `endorsement` work)
4. **family** — `legacyFamilies` prefix/exact/pattern: `/breaking/`, `/utica-new-york/`,
   `/category/`, `/tag/`, `/author/`, `/page/`, `/YYYY/MM/DD/`, `/wp-*`, feeds, `xmlrpc.php`
5. **none** — `404 // ARCHIVE RECORD UNAVAILABLE`

Every Resolution keeps `requestedPath` verbatim, plus `archiveRecordId`, `canonicalPath`,
`provenance` (VERIFIED / LIKELY / COMPAT / CANONICAL / UNRECOVERED), a deterministic
`checksum`, `integrity`, `routeKey`, and `arrival` class. Exact registry aliases are emitted
as host-level 200 rewrites. Flexible term/family matches are resolved by the fallback
`404.html` shell: the original URL stays intact and the browser gets the route-specific
archival presentation; the host's HTTP status remains 404 until an exact URL is promoted
into `aliases[]`. Truly unmatched paths stay as an unrecovered, noindex 404.

## Adding a newly discovered historical URL

1. Open `src/data/legacyRoutes.js`.
2. Add to the record's `aliases`:
   ```js
   { path: '/old/path/', provenance: 'VERIFIED', source: 'where you saw it' }
   ```
   (Use `'LIKELY'` for plausible-but-unseen variants, `'COMPAT'` for routes you just want to accept.)
3. `npm run build:legacy` — regenerates `_redirects`, sitemap, shells. Commit the output.
4. `npm test`.

Even if step 3 is skipped, `404.html` resolves the new alias client-side immediately; the
build step only upgrades it from a 404 to a 200 on hosts that honour `_redirects`.

New story → add a record object (copy an existing one). New URL family → add to
`legacyFamilies` and a presenter in `archiveRender.js`.

## Front-page newsroom (everything is clickable)

The front page is a fully wired, pre-populated news site of original fiction. Every link,
card, ticker line, widget, ad and footer entry does real work — there are no dead ends
(`alert()` stubs and `javascript:void(0)` links are gone), and every view is deep-linkable:

```
/?story=<key>        opens a dispatch in the reader modal (dateline, live updates, tags,
                     related coverage, personnel dossier, permalink copy, persisted comments)
/?desk=<id>          filters the front page to one desk and shows its masthead banner
                     (calcium · royals · voids · synthetic · hexes · domestic)
/?feature=<id>       opens a structured feature panel — weather, markets, warnings,
                     mandate, almanac, bell (audible toll), polls, whispers, horoscope,
                     radio, editions, edition-<year>, submissions, submit-<type>,
                     ad-grandfather, ad-syrup, cookie-hex, author-<id>
```

Deep links use `history.pushState`/`popstate`, so the browser Back button walks the reader
history, and any modal state can be shared as a URL. The three parameters are deliberately
disjoint from the WordPress-era keys (`?p=`, `?s=`, …) that `src/lib/frontPage.js` recognises
as legacy arrivals.

Content lives in `src/data/newsroom.js` (data only — importable in Node); behaviour lives in
`src/lib/newsroom.js` (DOM only). Interactive state — poll vote, comments, order/slip
receipts, bell tolls, hex consent — persists in `localStorage` under `kypo6.newsroom.v1` and
is never transmitted. All user input is escaped before rendering. The story reader and every
feature panel carry a standing note that the dispatches are original fiction of the present
operator, with links to `/archive/` and `/about/`; nothing from the former 2016 site is
republished. The homepage `<head>` carries honest `schema.org/WebSite` JSON-LD and the
System Archival Bar links the front page to the archive register and disclosure.

To add a dispatch: add a story object to `stories`, reference its key from the markup
(`data-open-story` / `?story=`), and `npm test` — the suite verifies field completeness,
desk/author/related integrity, and that every dispatch is reachable from the front page.

## Local preview / tests

```
npm run dev                  # http://localhost:8080 — emulates Cloudflare Pages semantics
npm test                     # unit tests against matcher, registry, renderer, artifacts
node scripts/check-legacy-routes.mjs --server http://localhost:8080   # + live HTTP checks
node scripts/check-legacy-routes.mjs --server https://kypo6.com       # post-deploy smoke test
```

## Deployment requirements

| Host | Unknown paths | Known legacy aliases |
|---|---|---|
| **Cloudflare Pages** (no build command, output dir `/`) | `404.html` served automatically with status 404 | `_redirects` 200 proxy → canonical page, URL preserved |
| Netlify | same | same (`_redirects` compatible) |
| GitHub Pages | `404.html` automatic | no rewrites → alias renders correctly but with status 404 |
| Vercel | needs `vercel.json` rewrites | needs `vercel.json` rewrites |
| nginx | `error_page 404 /404.html;` | `location = /old/path/ { try_files /archive/x/index.html =404; }` |

Important: **without `404.html`, Cloudflare Pages treats the project as an SPA and serves the
homepage with a 200 for every path** — exactly the silent-redirect behaviour this system
replaces. Keep `404.html` at the root.

## Analytics readiness (no tracking added)

Every page sets `window.KYPO6.arrival`, `<html data-kypo6-arrival="…">`, dispatches
`kypo6:arrival`, pushes to `window.dataLayer` **only if it already exists**, and stores the
first arrival of the session in `sessionStorage['kypo6.entry']`. Arrival classes:
`homepage`, `legacy-query`, `archive-record`, `site-page`, `site-page-alias`,
`known-deep-link`, `unknown-legacy-link`, `asset-404`.

## ARG hooks

Records and `ARCHIVE_META` carry `sourceAuthority`, `recoveryAgency`, `archiveOrigin`
(null; rendered only when set) and `anomalies[]`. The front page exposes the session's
entry path at `window.KYPO6.entry`.
