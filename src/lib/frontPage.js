/**
 * KYPO6 — FRONT PAGE LEGACY HOOKS
 * =============================================================================
 * Loaded by index.html. Deliberately small. It does three things:
 *
 *  1. Classifies the homepage arrival (homepage | legacy-query) and announces
 *     it via the same beacon the archive pages use (window.KYPO6.arrival,
 *     'kypo6:arrival' event, data attributes, sessionStorage).
 *  2. Recognises WordPress-era query shortlinks that land on "/" — ?p=123,
 *     ?page_id=, ?s=, ?cat=, ?feed= — and shows a slim strip pointing at the
 *     archive instead of silently swallowing them. No redirect.
 *  3. If this session ENTERED through a legacy hyperlink (an archive page set
 *     sessionStorage 'kypo6.entry'), shows a slim strip acknowledging it. This
 *     is the hook future ARG logic can build on: window.KYPO6.entry holds the
 *     original pathname, record id and checksum.
 *
 * It never changes existing homepage content.
 */
import { announceArrival, sessionEntry } from './arrival.js';
import { resolveLegacyPath, checksumFor } from './legacyRouting.js';

const LEGACY_QUERY_KEYS = ['p', 'page_id', 'cat', 'tag', 'feed', 's', 'attachment_id', 'author'];

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function strip({ label, text, href, linkText, tone = 'ink' }) {
  const bar = document.querySelector('aside[aria-label="System Archival Bar"]');
  if (!bar) return;
  const el = document.createElement('section');
  el.setAttribute('aria-label', 'Legacy Arrival Notice');
  el.className = `border border-dashed ${tone === 'red' ? 'border-tabloidRed bg-tabloidRed/5' : 'border-ink/40 bg-newsprint-dark/40'} px-3 py-1.5 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-ink`;
  el.innerHTML = `
    <span class="bg-ink text-newsprint px-1.5 py-0.5 font-bold text-[10px] tracking-wide">${esc(label)}</span>
    <span class="flex-1 min-w-0 break-all">${esc(text)}</span>
    ${href ? `<a href="${esc(href)}" class="font-bold text-tabloidRed underline shrink-0">${esc(linkText)} →</a>` : ''}
  `;
  bar.insertAdjacentElement('afterend', el);
}

function run() {
  const params = new URLSearchParams(location.search);
  const legacyKey = LEGACY_QUERY_KEYS.find((k) => params.has(k));
  const resolution = resolveLegacyPath(location.pathname, location.search);

  if (legacyKey) {
    const raw = `?${legacyKey}=${params.get(legacyKey)}`;
    const checksum = checksumFor(raw.toLowerCase());
    announceArrival(
      { ...resolution, arrival: 'legacy-query', routeKey: `legacy:legacy-query:${legacyKey}`, archiveRecordId: `QRY-${checksum.slice(0, 4)}`, checksum },
      { shell: 'front-page', legacyQuery: raw },
    );
    const searchHref = legacyKey === 's' ? `/archive/?q=${encodeURIComponent(params.get('s'))}` : '/archive/';
    strip({
      label: 'LEGACY QUERY',
      text: `${raw} — a shortlink format from the former 2016 website. The record it pointed at no longer exists.`,
      href: searchHref,
      linkText: 'ARCHIVE REGISTER',
      tone: 'red',
    });
    return;
  }

  announceArrival(resolution, { shell: 'front-page' });

  const entry = sessionEntry();
  if (entry && entry.arrival !== 'homepage' && entry.requestedPath && entry.requestedPath !== '/') {
    window.KYPO6.entry = entry;
    document.documentElement.dataset.kypo6Entry = entry.arrival;
    strip({
      label: 'INBOUND VIA LEGACY HYPERLINK',
      text: `${entry.requestedPath}  ·  ${entry.archiveRecordId || 'UNREGISTERED'}  ·  CHECKSUM ${entry.checksum}`,
      href: entry.canonicalPath || '/archive/',
      linkText: 'BACK TO RECORD',
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
}
