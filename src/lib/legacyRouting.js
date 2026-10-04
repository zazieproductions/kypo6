/**
 * KYPO6 — LEGACY ROUTE MATCHER
 * =============================================================================
 * Pure functions. No DOM, no network. Works in the browser and in Node.
 *
 *   resolveLegacyPath(pathname, search?) → Resolution
 *
 * Match order (first hit wins):
 *   1. canonical path of a record / site page            → matchType 'canonical'
 *   2. exact alias of a record / site page               → matchType 'alias'
 *   3. record.matchTerms satisfied by the path's tokens  → matchType 'terms'
 *   4. legacyFamilies (exact / prefix / pattern)         → matchType 'family'
 *   5. nothing                                           → matchType 'none'
 *
 * Every Resolution preserves the exact incoming pathname (`requestedPath`) so
 * it can be displayed, logged, or used by later ARG logic.
 */

import {
  archiveRecords,
  sitePages,
  legacyFamilies,
  reservedPrefixes,
  PROVENANCE,
  ARCHIVE_META,
} from '../data/legacyRoutes.js';

/* ----------------------------------------------------------------------------
 * Normalisation helpers
 * ------------------------------------------------------------------------- */

export function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/** Lower-case, decoded, collapsed slashes, no trailing slash (except root),
 *  and with trailing WordPress-isms removed (/amp, /feed, index.php, .html…). */
export function normalizePath(pathname) {
  let p = safeDecode(String(pathname || '/')).trim();
  if (!p.startsWith('/')) p = '/' + p;
  p = p.toLowerCase();
  p = p.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  p = p.replace(/[?#].*$/, '');

  const flags = { feedRequested: false, ampRequested: false, indexFileStripped: false, extensionStripped: null };

  // /slug/feed/ , /slug/feed  → per-post syndication feed
  if (/\/(feed|comments\/feed)\/?$/.test(p) && p !== '/feed' && p !== '/feed/' && !/^\/comments\/feed\/?$/.test(p)) {
    p = p.replace(/\/(feed|comments\/feed)\/?$/, '/');
    flags.feedRequested = true;
  }
  // /slug/amp/ → AMP variant
  if (/\/amp\/?$/.test(p) && p !== '/amp' && p !== '/amp/') {
    p = p.replace(/\/amp\/?$/, '/');
    flags.ampRequested = true;
  }
  // /index.php , /index.html
  if (/\/index\.(php|html?)$/.test(p)) {
    p = p.replace(/\/index\.(php|html?)$/, '/');
    flags.indexFileStripped = true;
  }
  // .html / .htm / .php on a leaf (never for the CMS artifacts we match exactly)
  const extMatch = p.match(/\.(html?|php)$/);
  if (extMatch && !/^\/(xmlrpc|wp-login)\.php$/.test(p) && !p.startsWith('/wp-')) {
    p = p.replace(/\.(html?|php)$/, '');
    flags.extensionStripped = extMatch[1];
  }
  // trailing slash
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return { normalized: p, flags };
}

/** Compare two paths ignoring trailing slash + case. */
function samePath(a, b) {
  return normalizePath(a).normalized === normalizePath(b).normalized;
}

/** Split a path into lower-case word tokens. */
export function tokenize(normalizedPath) {
  return normalizedPath
    .split(/[\/\-_.+~%:,;!()\[\]\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** A term matches a token exactly, or as a prefix when the term ends in `*`. */
function termHits(term, tokens) {
  if (term.endsWith('*')) {
    const stem = term.slice(0, -1);
    return tokens.some((t) => t.startsWith(stem));
  }
  return tokens.includes(term);
}

/** All groups must be satisfied by at least one term each. */
export function termsSatisfied(groups, tokens) {
  if (!Array.isArray(groups) || groups.length === 0) return false;
  return groups.every((group) => group.some((term) => termHits(term, tokens)));
}

/* ----------------------------------------------------------------------------
 * ARG-flavoured deterministic identifiers
 * ------------------------------------------------------------------------- */

/** FNV-1a 32-bit → "XXXX-XXXX". Deterministic per path; purely cosmetic. */
export function checksumFor(input) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const hex = h.toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

/** A tiny, stable "corruption state" derived from the checksum. */
export function integrityFor(checksum) {
  const n = parseInt(checksum.replace('-', ''), 16);
  const states = ['STABLE', 'STABLE', 'PARTIAL', 'STABLE', 'DEGRADED', 'PARTIAL', 'STABLE'];
  return states[n % states.length];
}

/** Derived record id for things that have no registry entry: UNR-XXXX. */
function derivedRecordId(prefix, checksum) {
  return `${prefix}-${checksum.slice(0, 4)}`;
}

/* ----------------------------------------------------------------------------
 * Lookup helpers
 * ------------------------------------------------------------------------- */

function findAlias(entry, normalized) {
  return (entry.aliases || []).find((a) => samePath(a.path, normalized)) || null;
}

function familyMatches(family, normalized, raw) {
  const m = family.match || {};
  if (m.exact && m.exact.some((e) => samePath(e, normalized))) return { via: 'exact' };
  if (m.prefix) {
    const pre = normalizePath(m.prefix).normalized; // "/breaking"
    if (normalized === pre || normalized.startsWith(pre + '/')) return { via: 'prefix' };
  }
  if (m.pattern && (m.pattern.test(normalized) || m.pattern.test(raw))) return { via: 'pattern' };
  return null;
}

/** Remainder of the path after a family prefix, split into segments. */
function remainderAfter(prefix, normalized) {
  const pre = normalizePath(prefix).normalized;
  const rest = normalized === pre ? '' : normalized.slice(pre.length + 1);
  return rest.split('/').filter(Boolean);
}

/* ----------------------------------------------------------------------------
 * Main resolver
 * ------------------------------------------------------------------------- */

/**
 * @param {string} pathname  exact incoming pathname (location.pathname)
 * @param {string} [search]  optional query string
 * @returns {Resolution}
 */
export function resolveLegacyPath(pathname, search = '') {
  const requestedPath = String(pathname || '/');
  const { normalized, flags } = normalizePath(requestedPath);
  const tokens = tokenize(normalized);
  const checksum = checksumFor(normalized);
  const params = parseSearch(search);

  const base = {
    requestedPath,
    displayPath: safeDecode(requestedPath),
    normalizedPath: normalized,
    tokens,
    flags,
    params,
    checksum,
    integrity: integrityFor(checksum),
    meta: ARCHIVE_META,
  };

  // Reserved current-site asset prefixes: never dress these up.
  if (reservedPrefixes.some((p) => normalized.startsWith(normalizePath(p).normalized))) {
    return finish({ ...base, experienceType: 'asset-missing', matchType: 'none', provenance: PROVENANCE.UNRECOVERED, arrival: 'asset-404' });
  }

  // Homepage (only relevant if a host ever routes "/" here).
  if (normalized === '/') {
    return finish({ ...base, experienceType: 'homepage', matchType: 'canonical', provenance: PROVENANCE.COMPAT, canonicalPath: '/', arrival: 'homepage' });
  }

  // 1 + 2: records and site pages (canonical, then alias)
  for (const entry of [...archiveRecords, ...sitePages]) {
    if (samePath(entry.canonicalPath, normalized)) {
      return finish({
        ...base,
        experienceType: entry.experienceType,
        record: entry,
        matchType: 'canonical',
        provenance: PROVENANCE.CANONICAL,
        canonicalPath: entry.canonicalPath,
        archiveRecordId: entry.id,
        arrival: isHistorical(entry) ? 'archive-record' : 'site-page',
      });
    }
    const alias = findAlias(entry, normalized);
    if (alias) {
      return finish({
        ...base,
        experienceType: entry.experienceType,
        record: entry,
        alias,
        matchType: 'alias',
        provenance: PROVENANCE[alias.provenance] || PROVENANCE.COMPAT,
        provenanceSource: alias.source || null,
        canonicalPath: entry.canonicalPath,
        archiveRecordId: entry.id,
        arrival: isHistorical(entry) ? 'known-deep-link' : 'site-page-alias',
      });
    }
  }

  // 3: fuzzy term matching against historical records only
  for (const record of archiveRecords) {
    if (termsSatisfied(record.matchTerms, tokens)) {
      return finish({
        ...base,
        experienceType: record.experienceType,
        record,
        matchType: 'terms',
        provenance: PROVENANCE.COMPAT,
        canonicalPath: record.canonicalPath,
        archiveRecordId: record.id,
        arrival: 'known-deep-link',
      });
    }
  }

  // 4: families
  for (const family of legacyFamilies) {
    const hit = familyMatches(family, normalized, requestedPath);
    if (!hit) continue;
    const segments = family.match.prefix ? remainderAfter(family.match.prefix, normalized) : tokenizeSegments(normalized);
    const extra = familyExtras(family, normalized, segments);
    return finish({
      ...base,
      experienceType: family.experienceType,
      family,
      familyVia: hit.via,
      segments,
      ...extra,
      matchType: 'family',
      /* The ROUTE is a compatibility route; the PREFIX may itself be verified
         (e.g. /breaking/). Keep the two claims separate so the UI never implies
         the specific record was verified. */
      provenance: PROVENANCE.COMPAT,
      familyProvenance: PROVENANCE[family.provenance] || PROVENANCE.COMPAT,
      recordStatus: 'UNRECOVERED',
      canonicalPath: null,
      archiveRecordId: derivedRecordId(familyIdPrefix(family), checksum),
      arrival: 'unknown-legacy-link',
    });
  }

  // 5: unknown
  return finish({
    ...base,
    experienceType: 'unrecovered',
    matchType: 'none',
    provenance: PROVENANCE.UNRECOVERED,
    canonicalPath: null,
    archiveRecordId: derivedRecordId('UNR', checksum),
    arrival: 'unknown-legacy-link',
  });
}

function isHistorical(entry) {
  return archiveRecords.includes(entry);
}

function tokenizeSegments(normalized) {
  return normalized.split('/').filter(Boolean);
}

function familyIdPrefix(family) {
  return (
    {
      breaking: 'BRK',
      category: 'IDX',
      tag: 'TAG',
      author: 'PER',
      page: 'PAG',
      dated: 'DAT',
      'utica-desk': 'UTC',
    }[family.id] || (family.experienceType === 'cms-artifact' ? 'CMS' : 'LEG')
  );
}

/** Family-specific derived data (slug, page number, date, etc). */
function familyExtras(family, normalized, segments) {
  const out = {};
  switch (family.id) {
    case 'breaking':
    case 'utica-desk':
    case 'category':
    case 'tag':
    case 'author': {
      out.slug = segments[0] || null;
      out.slugWords = out.slug ? out.slug.split(/[-_]+/).filter(Boolean) : [];
      // /category/foo/page/3
      const pg = normalized.match(/\/page\/(\d+)$/);
      if (pg) out.pageNumber = Number(pg[1]);
      break;
    }
    case 'page': {
      const pg = normalized.match(/\/page\/(\d+)/);
      out.pageNumber = pg ? Number(pg[1]) : null;
      break;
    }
    case 'dated': {
      const m = normalized.match(/^\/(20\d{2})\/(\d{1,2})(?:\/(\d{1,2}))?(?:\/([^/]+))?/);
      if (m) {
        out.year = m[1];
        out.month = m[2].padStart(2, '0');
        out.day = m[3] ? m[3].padStart(2, '0') : null;
        out.slug = m[4] || null;
        out.slugWords = out.slug ? out.slug.split(/[-_]+/).filter(Boolean) : [];
      }
      break;
    }
    default:
      if (family.experienceType === 'cms-artifact') {
        out.artifactKind = family.artifactKind || 'UNKNOWN RESOURCE';
        out.resourceName = segments[segments.length - 1] || null;
      }
  }
  return out;
}

function parseSearch(search) {
  const out = {};
  const s = String(search || '').replace(/^\?/, '');
  if (!s) return out;
  for (const pair of s.split('&')) {
    if (!pair) continue;
    const [k, v = ''] = pair.split('=');
    out[safeDecode(k)] = safeDecode(v.replace(/\+/g, ' '));
  }
  return out;
}

function finish(res) {
  res.record = res.record || null;
  res.family = res.family || null;
  res.alias = res.alias || null;
  res.canonicalPath = res.canonicalPath ?? null;
  res.archiveRecordId = res.archiveRecordId || null;
  res.provenanceSource = res.provenanceSource || null;
  res.familyProvenance = res.familyProvenance || null;
  res.recordStatus = res.recordStatus || (res.record && res.record.status) || (res.experienceType === 'unrecovered' ? 'UNRECOVERED' : 'N/A');
  res.isKnownRecord = Boolean(res.record && archiveRecords.includes(res.record));
  res.isCanonical = res.matchType === 'canonical';
  /* Analytics-ready identifier, e.g. "legacy:known-deep-link:071916-PF" */
  res.routeKey = `legacy:${res.arrival}:${res.archiveRecordId || res.experienceType}`;
  return res;
}

/* ----------------------------------------------------------------------------
 * Search over the registry (used by /archive/?q=…)
 * ------------------------------------------------------------------------- */
export function searchArchive(query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return [];
  const qTokens = tokenize(q.replace(/\s+/g, '/'));
  return archiveRecords
    .map((record) => {
      const hay = [
        record.id,
        record.title,
        record.historicalHeadline,
        record.summary,
        ...(record.aliases || []).map((a) => a.path),
        ...(record.matchTerms || []).flat(),
      ]
        .join(' ')
        .toLowerCase();
      const score = qTokens.reduce((acc, t) => acc + (hay.includes(t.replace(/\*$/, '')) ? 1 : 0), 0);
      return { record, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Every path the registry knows (for tests + artifact generation). */
export function listKnownPaths() {
  const out = [];
  for (const entry of [...archiveRecords, ...sitePages]) {
    out.push({ path: entry.canonicalPath, provenance: 'CANONICAL', id: entry.id, canonicalPath: entry.canonicalPath, historical: isHistorical(entry) });
    for (const a of entry.aliases || []) {
      out.push({ path: a.path, provenance: a.provenance, source: a.source || null, id: entry.id, canonicalPath: entry.canonicalPath, historical: isHistorical(entry) });
    }
  }
  return out;
}
