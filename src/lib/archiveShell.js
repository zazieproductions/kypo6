/**
 * KYPO6 — ARCHIVE SHELL (browser bootstrap)
 * =============================================================================
 * Loaded by 404.html and by every generated archive/about page.
 *
 *   1. Resolve location.pathname against the legacy route registry.
 *   2. Render the matching experience into #archiveRoot.
 *   3. Apply document metadata (title / description / canonical / robots).
 *   4. Bind the few interactive bits (microfiche, inspect, search).
 *   5. Announce the arrival class for future analytics / ARG logic.
 *
 * Canonical pages are already pre-rendered by scripts/build-legacy-artifacts.mjs;
 * re-rendering here is idempotent and only changes output when the visitor
 * arrived through a legacy alias (e.g. a _redirects 200 rewrite), in which case
 * the page gains the "YOU FOLLOWED /old/path/" context.
 */

import { resolveLegacyPath } from './legacyRouting.js';
import { renderArchivePage, renderRecordList, metaFor } from './archiveRender.js';
import { announceArrival } from './arrival.js';
import { archiveRecords } from '../data/legacyRoutes.js';

function applyMeta(meta) {
  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'robots', meta.robots);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:type', meta.ogType || 'website');
  setMeta('property', 'og:url', location.origin + (meta.canonical || location.pathname));
  setMeta('property', 'og:site_name', 'KYPO6');
  setMeta('name', 'twitter:card', 'summary');

  let link = document.querySelector('link[rel="canonical"]');
  if (meta.canonical) {
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = location.origin + meta.canonical;
  } else if (link) {
    link.remove();
  }
}

function setMeta(attr, key, value) {
  if (value == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function bind(root, resolution) {
  // Microfiche invert — same behaviour as the front page.
  const toggle = root.querySelector('#toggleMicrofiche');
  const canvas = root.querySelector('#paperCanvas');
  if (toggle && canvas) {
    let on = false;
    toggle.addEventListener('click', () => {
      on = !on;
      document.body.classList.toggle('bg-black', on);
      canvas.classList.toggle('microfiche', on);
      toggle.textContent = on ? 'RESTORE PRINT' : 'MICROFICHE INVERT';
    });
  }

  // "INSPECT ARCHIVE METADATA" → reveal + scroll to manifest.
  root.querySelectorAll('[data-action="inspect"]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const manifest = root.querySelector('#archive-manifest');
      if (!manifest) return;
      const details = manifest.querySelector('details');
      if (details) details.open = true;
      manifest.scrollIntoView({ behavior: 'smooth', block: 'start' });
      manifest.classList.add('ring-2', 'ring-tabloidRed');
      setTimeout(() => manifest.classList.remove('ring-2', 'ring-tabloidRed'), 1800);
    }),
  );

  // Archive search — progressive enhancement; the form works without JS too.
  const form = root.querySelector('[data-archive-search]');
  const results = root.querySelector('[data-archive-results]');
  if (form && results) {
    const input = form.querySelector('input[name="q"]');
    const run = () => {
      results.innerHTML = renderRecordList(archiveRecords, input.value);
      const url = new URL(location.href);
      if (input.value) url.searchParams.set('q', input.value);
      else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      run();
    });
    input.addEventListener('input', run);
  }
}

export function boot({ mountId = 'archiveRoot' } = {}) {
  const root = document.getElementById(mountId);
  if (!root) return null;

  const resolution = resolveLegacyPath(location.pathname, location.search);
  root.innerHTML = renderArchivePage(resolution);
  root.classList.remove('archive-skeleton');
  applyMeta(metaFor(resolution));
  bind(root, resolution);
  announceArrival(resolution, { shell: 'archive' });
  return resolution;
}

if (typeof document !== 'undefined') boot();
