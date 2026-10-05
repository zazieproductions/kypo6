# kypo6

KYPO6.com — an independent experimental web project on a domain that, in 2016, hosted a
now-defunct imitation local-TV "news" site. Old hyperlinks to that site still exist across
fact-checks, articles, papers and media-literacy resources. This repo keeps every one of
them working as an honest, playful archival entrance instead of a dead end — and never
republishes what used to be there.

> The present operator is not affiliated with the former operators of KYPO6. See `/about/`.

## Layout

```
index.html                  ← the front page: tabloid fiction + the Automatic Dish (see below)
404.html                    ← GENERATED catch-all legacy router shell (host serves it w/ 404)
about/index.html            ← GENERATED disclosure page
archive/index.html          ← GENERATED archive register (+ ?q= search)
archive/<record-slug>/      ← GENERATED one canonical page per historical record
_redirects                  ← GENERATED 200 rewrites: legacy URL → canonical page (URL preserved)
_headers, robots.txt, sitemap.xml   ← GENERATED
src/data/legacyRoutes.js    ← ★ THE REGISTRY — records, aliases, match terms, families
src/data/disclosure.js      ← disclosure paragraphs
src/lib/legacyRouting.js    ← pure matcher: pathname → Resolution
src/lib/archiveRender.js    ← pure renderer: Resolution → HTML + metadata
src/lib/archiveShell.js     ← browser bootstrap for archive pages / 404.html
src/lib/arrival.js          ← analytics-readiness beacon (no third parties)
src/lib/frontPage.js        ← tiny homepage hooks (legacy ?p= shortlinks, inbound strip)
src/lib/tailwind.config.js  ← mirror of index.html's Tailwind theme
src/styles/archive.css      ← mirror of index.html's styles + archive extensions
scripts/build-legacy-artifacts.mjs  ← regenerates every GENERATED file from the registry
scripts/check-legacy-routes.mjs     ← tests (unit + optional live HTTP)
scripts/dev-server.mjs              ← local host emulator (404.html + _redirects semantics)
```

There is **no build step for deployment**. Everything is static. Node (≥18, no npm deps) is
only needed to run the optional scripts.

## The front page: tabloid fiction and the Automatic Dish

`index.html` is a work of fiction — an impression of the world's most prolific content farm, set as a
damp county broadsheet. It is **not** part of the archival system: no generator writes into it, and no
dispatch in it is presented as a historical record (that is what `/archive/` and the registry are for).

- **`const STORIES`** — the hand-typed dispatches (`title`, `subhead`, byline, `category`, `body` HTML,
  `comments`). Any element can open one with `onclick="openStory('story-…')"`. Putting `data-category`
  on a `.feed-item` is what the desk buttons filter by and what the search box reads.
- **The Automatic Dish** — the second `<script>` at the end of `index.html`: a deterministic grammar
  machine that keeps filing. `POOL` holds the nouns, towns, authorities and insults; `HEADS` holds ten
  screamer templates; `bodyFor()` writes four paragraphs of boilerplate. Each result is registered into
  `STORIES`, so machine copy behaves exactly like human copy.
- **Wrappers** — the engine wraps `openStory` (adds the auto-filed stamp, the reading weight and the
  "READ NEXT: YOU WILL NOT ESCAPE" cross-links) and `filterFeed` (late-arriving dispatches respect the
  active desk). The masthead and breaking strips rotate from `MANDATES` / `FLASHES`; the ticker track is
  duplicated once at boot so the marquee loops seamlessly.

**Adding a dispatch:** append an entry to the engine's `Object.assign(STORIES, { … })` block and give it
a `.feed-item` card that calls `openStory()`. Keep it plainly fictional — never attribute a claim to a
real person, and never add a fake historical URL here; invented history belongs in
`src/data/legacyRoutes.js`, with provenance.

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
