/**
 * KYPO6 — ARCHIVE RENDERER
 * =============================================================================
 * Pure functions that turn a Resolution (from legacyRouting.js) into HTML
 * strings. No DOM access, so the same code pre-renders canonical pages in Node
 * (scripts/build-legacy-artifacts.mjs) and re-renders in the browser
 * (archiveShell.js) when the incoming pathname is a legacy alias.
 *
 *   renderArchivePage(resolution)  → full page body (frame + experience)
 *   metaFor(resolution)            → { title, description, canonical, robots }
 *
 * Adding a new experienceType = adding one entry to `presenters`.
 * All dynamic values go through esc(). The incoming pathname is attacker-
 * controlled; never interpolate it unescaped.
 */

import { ARCHIVE_META, DISCLOSURE_SHORT, archiveRecords } from '../data/legacyRoutes.js';
import { disclosureParagraphs } from '../data/disclosure.js';

/* ----------------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------------- */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clampPath(path, max = 220) {
  const p = String(path);
  return p.length > max ? p.slice(0, max - 1) + '…' : p;
}

function chipClass(provenance) {
  if (/CANONICAL/.test(provenance)) return 'chip--canonical';
  if (/VERIFIED/.test(provenance)) return 'chip--verified';
  if (/LIKELY/.test(provenance)) return 'chip--likely';
  if (/UNRECOVERED/.test(provenance)) return 'chip--unrecovered';
  return 'chip--compat';
}

function chip(label) {
  return `<span class="chip ${chipClass(label)}">${esc(label)}</span>`;
}

function termLine(key, val, tone = '') {
  return `<div class="terminal-line py-0.5"><span class="terminal-key">${esc(key)}</span><span class="terminal-val ${tone}">${val}</span></div>`;
}

function terminal(lines, { title = 'RECOVERED TRANSMISSION', flicker = true } = {}) {
  return `
  <div class="terminal ${flicker ? 'terminal-flicker' : ''} font-mono text-xs md:text-[13px] p-4 md:p-5 mt-3" role="group" aria-label="${esc(title)}">
    <div class="relative z-10">
      <div class="flex flex-wrap justify-between items-center gap-2 border-b border-newsprint/20 pb-2 mb-3 text-[10px] tracking-widest uppercase">
        <span class="font-bold text-tabloidYellow">▮ ${esc(title)}</span>
        <span class="text-newsprint/60">CH 6 · ARCHIVE BAND</span>
      </div>
      ${lines.join('')}
    </div>
  </div>`;
}

function noSignalStill(label, sub) {
  return `
  <figure class="border border-ink p-1 bg-white mt-4">
    <div class="halftone-box static-noise aspect-[16/7] w-full flex items-center justify-center relative">
      <div class="text-center font-mono text-newsprint/90 px-4">
        <div class="text-[10px] tracking-[0.3em] uppercase opacity-70">${esc(sub)}</div>
        <div class="font-headline text-2xl md:text-4xl font-bold tracking-widest uppercase mt-1">${esc(label)}</div>
      </div>
      <div class="absolute bottom-2 left-2 bg-ink/90 text-newsprint text-[10px] font-mono px-2 py-1">FRAME NOT RECOVERED</div>
      <div class="absolute top-2 right-2 text-newsprint/70 text-[10px] font-mono">REC ●</div>
    </div>
    <figcaption class="text-[11px] font-serif text-ink-faded italic px-1 pt-1.5 flex justify-between">
      <span>Staff Photographer: none assigned</span>
      <span>NEGATIVE IDENTIFIER: NOT ISSUED</span>
    </figcaption>
  </figure>`;
}

function requestedBlock(res, label = 'RECOVERED REQUEST') {
  return `
  <div class="border border-ink/40 bg-white/50 p-3 mt-4">
    <div class="font-mono text-[10px] uppercase tracking-widest text-ink-faded">${esc(label)}:</div>
    <code class="path-display block text-sm md:text-base font-bold text-ink mt-1" data-requested-path>${esc(clampPath(res.displayPath))}</code>
    ${res.displayPath !== res.requestedPath ? `<div class="font-mono text-[10px] text-ink-faded mt-1">RAW: <span class="path-display">${esc(clampPath(res.requestedPath))}</span></div>` : ''}
  </div>`;
}

function fragments(words, label = 'FRAGMENTS PARSED FROM HYPERLINK') {
  if (!words || !words.length) return '';
  return `
  <div class="mt-3">
    <div class="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-1">${esc(label)}</div>
    <div class="flex flex-wrap gap-1">${words
      .slice(0, 24)
      .map((w) => `<span class="font-mono text-[11px] border border-ink/30 bg-newsprint-dark/40 px-1.5 py-0.5">${esc(w)}</span>`)
      .join('')}</div>
  </div>`;
}

function actionBar(res, actions) {
  return `
  <nav aria-label="Archive actions" class="mt-5 border-t border-b border-ink/40 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs bg-tabloidYellow/10 px-2">
    ${actions
      .map((a) =>
        a.href
          ? `<a href="${esc(a.href)}" class="font-bold text-tabloidRed underline hover:bg-ink hover:text-newsprint px-1" ${a.attrs || ''}>${esc(a.label)}</a>`
          : `<button type="button" data-action="${esc(a.action)}" class="font-bold text-tabloidRed underline hover:bg-ink hover:text-newsprint px-1">${esc(a.label)}</button>`,
      )
      .join('<span class="text-ink/30">|</span>')}
  </nav>`;
}

function searchHref(words) {
  const q = (words || []).filter((w) => w.length > 2).slice(0, 6).join(' ');
  return q ? `/archive/?q=${encodeURIComponent(q)}` : '/archive/';
}

function references(list) {
  if (!list || !list.length) return '';
  return `
  <section class="mt-5 border border-ink/30 p-3 bg-white/40">
    <h3 class="font-mono text-xs font-bold uppercase border-b border-ink/20 pb-1 mb-2">CONTEXT — SURVIVING THIRD-PARTY RECORDS</h3>
    <ul class="font-serif text-sm space-y-1">
      ${list.map((r) => `<li>→ <a class="underline hover:text-tabloidRed" href="${esc(r.url)}" rel="noopener external" target="_blank">${esc(r.label)}</a></li>`).join('')}
    </ul>
    <p class="font-mono text-[10px] text-ink-faded mt-2">External. Not operated by this site.</p>
  </section>`;
}

function provenanceNote(res) {
  const prov = res.provenance;
  let text;
  if (/VERIFIED/.test(prov)) text = `This exact address appears in a surviving third-party citation. ${res.provenanceSource ? esc(res.provenanceSource) : ''}`;
  else if (/LIKELY/.test(prov)) text = 'This address is a plausible variant of a verified historical URL. It has not been independently confirmed. If you hold an archived copy, the registry can be corrected.';
  else if (/UNRECOVERED/.test(prov)) text = 'No registry entry matches this address. It is preserved here exactly as received.';
  else if (res.matchType === 'terms') text = 'This address was matched by subject terms rather than by an exact historical URL. It is routed to the canonical record for that subject.';
  else if (res.matchType === 'canonical') text = 'This is the canonical address for the record.';
  else text = 'Accepted as a compatibility route. No claim is made that this exact address existed historically.';
  return `
  <div class="mt-4 flex flex-wrap items-start gap-2 font-mono text-[11px] text-ink-faded">
    ${chip(prov)}${res.familyProvenance && res.familyProvenance !== prov ? `<span class="opacity-70">prefix:</span>${chip(res.familyProvenance)}` : ''}
    <span class="basis-full md:basis-auto md:flex-1 leading-snug">${text}</span>
  </div>`;
}

/* ----------------------------------------------------------------------------
 * Presenters — one per experienceType
 * Each returns { eyebrow, headline, dek, html, actions }.
 * ------------------------------------------------------------------------- */
const presenters = {
  'fabricated-broadcast'(res) {
    const r = res.record;
    return {
      eyebrow: `ARCHIVE RECORD ${r.id}`,
      headline: 'RECOVERED HYPERLINK: PAPAL ENDORSEMENT STORY (2016)',
      dek: 'The page that lived here was fabricated. The link outlived it.',
      html: `
        ${terminal([
          termLine('ORIGINAL RECORD STATUS', esc(r.status), 'terminal-val--red'),
          termLine('LEGACY NETWORK', esc(ARCHIVE_META.legacyNetworkStatus), 'terminal-val--alert'),
          termLine('ARCHIVE RECOVERED', esc(ARCHIVE_META.recoveredYear), 'terminal-val--ok'),
          termLine('CURRENT OPERATOR', esc(ARCHIVE_META.currentOperator), 'terminal-val--ok'),
          termLine('ORIGINAL DATE', `${esc(r.originalDate)} <span class="text-newsprint/50 font-normal">(${esc(r.dateConfidence)})</span>`),
        ])}
        ${requestedBlock(res, res.isCanonical ? 'RECORD ADDRESS' : 'YOU FOLLOWED')}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p><span class="float-left text-5xl font-masthead font-black leading-none pr-2 pt-1 text-ink">I</span>n July 2016 this address carried a story headlined <em>“${esc(r.historicalHeadline)}.”</em> It was not true. No such endorsement was made, then or since. The headline is reproduced here only so you can recognise the link you followed.</p>
          <p>${esc(r.summary)}</p>
          <p>What survives: the hyperlink, the fact-checks, and a web-page-shaped hole. The present site occupies the domain, not the claim.</p>
        </div>
        ${noSignalStill('NO SIGNAL', `RECORD ${r.id} · ORIGINAL BROADCAST NOT RETAINED`)}
        ${references(r.references)}
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ABOUT THIS SITE', href: '/about/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'production-file'(res) {
    const r = res.record;
    return {
      eyebrow: 'PRODUCTION FILE // UTICA',
      headline: 'THE SEQUEL THAT NEVER SHOT HERE',
      dek: 'A 2016 web page announced a film. The film did not announce itself.',
      html: `
        <div class="mt-3 border-2 border-ink">
          <div class="clapboard-stripes h-4"></div>
          <div class="grid grid-cols-2 sm:grid-cols-4 font-mono text-xs divide-x divide-ink border-t-2 border-ink bg-white/60">
            <div class="p-2"><div class="text-[9px] text-ink-faded uppercase">Production</div><div class="font-bold">FOTB III</div></div>
            <div class="p-2"><div class="text-[9px] text-ink-faded uppercase">Location</div><div class="font-bold">UTICA, NY</div></div>
            <div class="p-2"><div class="text-[9px] text-ink-faded uppercase">Scene</div><div class="font-bold">2016</div></div>
            <div class="p-2"><div class="text-[9px] text-ink-faded uppercase">Roll / Take</div><div class="font-bold">NONE / ∞</div></div>
          </div>
        </div>
        ${terminal(
          [
            termLine('STATUS', esc(r.status), 'terminal-val--alert'),
            termLine('LEGACY RECORD', 'RECOVERED', 'terminal-val--ok'),
            termLine('CALL SHEET', 'NEVER ISSUED'),
            termLine('CRAFT SERVICES', 'NOT OBSERVED'),
            termLine('ORIGINAL DATE', `${esc(r.originalDate)} <span class="text-newsprint/50 font-normal">(${esc(r.dateConfidence)})</span>`),
            termLine('CURRENT OPERATOR', esc(ARCHIVE_META.currentOperator), 'terminal-val--ok'),
          ],
          { title: 'PRODUCTION OFFICE — LINE CLOSED' },
        )}
        ${requestedBlock(res, res.isCanonical ? 'RECORD ADDRESS' : 'YOU FOLLOWED')}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p><span class="float-left text-5xl font-masthead font-black leading-none pr-2 pt-1 text-ink">I</span>n 2016 a page at this address announced, under a headline resembling <em>“${esc(r.historicalHeadline)},”</em> that a beloved comedy sequel would shoot in Utica, New York. Residents shared it. A local radio station checked. There was no production office, no permits, no catering truck idling on Genesee Street.</p>
          <p>${esc(r.summary)}</p>
          <p>The street is still there. The film is not. This file is kept open in case it ever turns up.</p>
        </div>
        ${noSignalStill('LOCATION SCOUT: NEGATIVE', `PRODUCTION FILE ${r.id} · NO FOOTAGE EXISTS`)}
        ${references(r.references)}
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ABOUT THIS SITE', href: '/about/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'breaking-archive'(res) {
    return {
      eyebrow: 'RECOVERED BREAKING NEWS ARCHIVE',
      headline: 'NO SURVIVING COPY OF THIS RECORD HAS BEEN LOCATED',
      dek: 'The former site filed its loudest stories under /breaking/. This one did not survive the move.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('ORIGINAL RECORD STATUS', 'UNRECOVERED', 'terminal-val--alert'),
          termLine('FILED UNDER', '/breaking/ <span class="text-newsprint/50 font-normal">(verified legacy permalink category)</span>'),
          termLine('LEGACY NETWORK', esc(ARCHIVE_META.legacyNetworkStatus), 'terminal-val--alert'),
          termLine('CURRENT OPERATOR', esc(ARCHIVE_META.currentOperator), 'terminal-val--ok'),
        ])}
        ${requestedBlock(res)}
        ${fragments(res.slugWords)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>No surviving copy of this record has been located. Whatever was published at this address in 2016 belonged to a decommissioned network of imitation local-TV news websites. Content from that network was routinely fabricated; nothing from it is republished here.</p>
          <p>The hyperlink you followed has been logged as a recovered request and retained by the archive.</p>
        </div>
        ${noSignalStill('STAND BY', `${res.archiveRecordId} · SIGNAL LOST`)}
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.slugWords) },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'regional-desk'(res) {
    const region = res.family?.region || 'UNKNOWN REGION';
    const related = archiveRecords.filter((r) => (r.aliases || []).some((a) => a.path.startsWith(res.family.match.prefix)));
    return {
      eyebrow: res.family.label,
      headline: `REGIONAL DESK: ${region.toUpperCase()}`,
      dek: 'The former site filed location-targeted stories under town names. This desk is now unstaffed.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('DESK', esc(region.toUpperCase())),
          termLine('DESK STATUS', 'UNSTAFFED', 'terminal-val--alert'),
          termLine('REQUESTED ITEM', res.slug ? esc(res.slug) : '— (desk index)'),
          termLine('RECOVERED', res.slug ? 'NO' : 'N/A', 'terminal-val--red'),
        ], { title: 'REGIONAL DESK — LINE CLOSED' })}
        ${requestedBlock(res)}
        ${fragments(res.slugWords)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>The former operators published town-specific stories by swapping a place name into a template. This address was filed under <strong>${esc(region)}</strong>. The specific item requested has not been recovered.</p>
          ${related.length ? `<p>One record from this desk <em>has</em> been recovered: <a class="underline text-tabloidRed font-bold" href="${esc(related[0].canonicalPath)}">${esc(related[0].title)}</a>.</p>` : ''}
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.slugWords) },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'archive-index'(res) {
    return {
      eyebrow: 'ARCHIVE INDEX',
      headline: `INDEX HEADING: ${(res.slug || 'UNNAMED').toUpperCase()}`,
      dek: 'The index did not survive. The shelf label did.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('HEADING', esc(res.slug || '—')),
          termLine('ITEMS UNDER HEADING', '0 RECOVERED', 'terminal-val--alert'),
          res.pageNumber ? termLine('PAGE REQUESTED', esc(res.pageNumber)) : '',
        ], { title: 'CARD CATALOGUE' })}
        ${requestedBlock(res)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>The former site grouped its output under category headings like this one. The listing that once answered this address has not been recovered. The full register of what <em>has</em> been recovered is available below.</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.slugWords) },
        { label: 'FULL ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'transmission-tag'(res) {
    return {
      eyebrow: 'INDEXED TRANSMISSION TAG',
      headline: `TAG: ${(res.slug || 'UNNAMED').toUpperCase()}`,
      dek: 'Applied to zero surviving transmissions.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('TAG', esc(res.slug || '—')),
          termLine('TAGGED TRANSMISSIONS', '0 SURVIVING', 'terminal-val--alert'),
          termLine('TAG RETAINED', 'YES', 'terminal-val--ok'),
        ], { title: 'TAG INDEX' })}
        ${requestedBlock(res)}
        ${fragments(res.slugWords, 'TAG TERMS')}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>Tags on the former site pointed to lists of stories. The stories are gone; the tag has been retained as an index term so that incoming links still land somewhere honest.</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.slugWords) },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'personnel-record'(res) {
    return {
      eyebrow: 'PERSONNEL RECORD',
      headline: `DESIGNATION: ${(res.slug || 'UNNAMED').toUpperCase()}`,
      dek: 'No personnel file is held under this designation.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('DESIGNATION', esc(res.slug || '—')),
          termLine('FILE STATUS', 'NOT HELD', 'terminal-val--alert'),
          termLine('BYLINE RELIABILITY (LEGACY)', 'UNVERIFIED'),
        ], { title: 'PERSONNEL' })}
        ${requestedBlock(res)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>Author pages on the former site listed stories by byline. Bylines on that network were not reliably attached to real people, and this archive holds no personnel file under this designation. Nothing here identifies any individual.</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ABOUT THIS SITE', href: '/about/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'paginated-recovery'(res) {
    const n = res.pageNumber;
    return {
      eyebrow: 'PAGINATED ARCHIVE RECOVERY',
      headline: n ? `PAGE ${n} OF A DOCUMENT WITH NO REMAINING PAGES` : 'PAGINATION WITHOUT A DOCUMENT',
      dek: 'The listing this page belonged to no longer exists.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('PAGE REQUESTED', n ? esc(n) : '—'),
          termLine('PAGES REMAINING', '0', 'terminal-val--alert'),
          termLine('RECOVERY', 'INCOMPLETE', 'terminal-val--red'),
        ], { title: 'PAGINATION' })}
        ${requestedBlock(res)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>Pagination on the former site stepped through an ever-growing feed of fabricated local stories. The feed has been retired. ${n ? `Page ${esc(n)} has been requested from it anyway, which the archive finds touching.` : ''}</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'dated-record'(res) {
    const date = [res.year, res.month, res.day].filter(Boolean).join('-');
    return {
      eyebrow: 'DATED ARCHIVE RECORD',
      headline: `FILED ${date}. CONTENTS NOT RECOVERED.`,
      dek: 'The date survived. The record did not.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('FILED', esc(date)),
          termLine('ITEM', res.slug ? esc(res.slug) : '— (date index)'),
          termLine('RECOVERED', 'NO', 'terminal-val--red'),
        ], { title: 'DATE INDEX' })}
        ${requestedBlock(res)}
        ${fragments(res.slugWords)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>This address follows a date-based permalink pattern. The archive can confirm the date requested and nothing else about it.</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.slugWords) },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'cms-artifact'(res) {
    return {
      eyebrow: 'LEGACY CMS ARTIFACT',
      headline: 'RESOURCE NO LONGER PRESENT',
      dek: 'Reference retained by archive.',
      html: `
        ${terminal([
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('ARTIFACT KIND', esc(res.artifactKind || 'UNKNOWN')),
          termLine('RESOURCE', res.resourceName ? esc(clampPath(res.resourceName, 80)) : '—'),
          termLine('RESOURCE STATUS', 'NO LONGER PRESENT', 'terminal-val--red'),
          termLine('DISPOSITION', 'REFERENCE RETAINED BY ARCHIVE', 'terminal-val--ok'),
          termLine('CMS AT THIS ADDRESS', 'NONE'),
        ], { title: 'INFRASTRUCTURE', flicker: false })}
        ${requestedBlock(res)}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>This path belongs to the content-management system that ran the former website. No such system operates at this address. Nothing is served, exposed, or emulated here; the request has been noted as an artifact of the old infrastructure.</p>
        </div>
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ABOUT THIS SITE', href: '/about/' },
        { label: 'FRONT PAGE →', href: '/' },
      ],
    };
  },

  unrecovered(res) {
    return {
      eyebrow: '404 // ARCHIVE RECORD UNAVAILABLE',
      headline: 'YOU FOLLOWED A HYPERLINK CREATED ON AN OLDER VERSION OF THE INTERNET.',
      dek: 'The record that once occupied this address has not survived. The hyperlink has.',
      html: `
        ${terminal([
          termLine('REQUESTED RECORD', `<span class="path-display">${esc(clampPath(res.displayPath))}</span>`),
          termLine('ARCHIVE STATUS', 'UNRECOVERED', 'terminal-val--red'),
          termLine('RECORD', esc(res.archiveRecordId)),
          termLine('LEGACY NETWORK', esc(ARCHIVE_META.legacyNetworkStatus), 'terminal-val--alert'),
          termLine('CURRENT OPERATOR', esc(ARCHIVE_META.currentOperator), 'terminal-val--ok'),
        ], { title: 'RECOVERY ATTEMPT' })}
        ${requestedBlock(res, 'REQUESTED RECORD')}
        ${fragments(res.tokens.filter((t) => !/^\d+$/.test(t) || t.length === 4))}
        <div class="font-serif text-sm md:text-base leading-relaxed text-ink mt-4 space-y-3">
          <p>If the link came from an article, a fact-check, a syllabus, or a list of unreliable websites, it is probably pointing at something the previous occupants of this domain published in 2016. That material is not here and will not be restored.</p>
          <p>What is here is a different project entirely. You are welcome to come in.</p>
        </div>
        ${noSignalStill('404', `${res.archiveRecordId} · NO CARRIER`)}
        ${provenanceNote(res)}
      `,
      actions: [
        { label: 'INSPECT ARCHIVE METADATA', action: 'inspect' },
        { label: 'SEARCH RECOVERED RECORDS', href: searchHref(res.tokens) },
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  'asset-missing'(res) {
    return {
      eyebrow: '404',
      headline: 'ASSET NOT FOUND',
      dek: '',
      html: `${requestedBlock(res, 'MISSING ASSET')}<p class="font-mono text-xs text-ink-faded mt-3">This is a plain missing-file response for a current-site asset path. Nothing archival about it.</p>`,
      actions: [{ label: 'FRONT PAGE →', href: '/' }],
    };
  },

  disclosure(res) {
    const viaLegacy = res.matchType === 'alias';
    return {
      eyebrow: 'ABOUT THIS SITE',
      headline: 'DISCLOSURE',
      dek: 'Concise, factual, and unlikely to change.',
      html: `
        ${viaLegacy ? requestedBlock(res, 'YOU ARRIVED VIA LEGACY ADDRESS') : ''}
        <div class="font-serif text-base md:text-lg leading-relaxed text-ink mt-4 space-y-4 max-w-prose" data-disclosure>
          ${disclosureParagraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
        ${terminal([
          termLine('DOMAIN', 'kypo6.com'),
          termLine('FORMER USE (2016)', 'IMITATION LOCAL-TV NEWS SITE · FABRICATED CONTENT', 'terminal-val--alert'),
          termLine('LEGACY NETWORK', esc(ARCHIVE_META.legacyNetworkStatus)),
          termLine('CURRENT USE', 'INDEPENDENT EXPERIMENTAL WEB PROJECT', 'terminal-val--ok'),
          termLine('AFFILIATION WITH FORMER OPERATORS', 'NONE', 'terminal-val--ok'),
          termLine('AFFILIATION WITH ANY NEWS ORGANISATION', 'NONE', 'terminal-val--ok'),
        ], { title: 'STATEMENT OF RECORD', flicker: false })}
        ${viaLegacy ? provenanceNote(res) : ''}
      `,
      actions: [
        { label: 'ARCHIVE REGISTER', href: '/archive/' },
        { label: 'FRONT PAGE →', href: '/' },
      ],
    };
  },

  'archive-home'(res) {
    const q = res.params?.q || '';
    return {
      eyebrow: 'ARCHIVE REGISTER',
      headline: 'RECOVERED RECORDS',
      dek: 'Every surviving hyperlink to this domain is treated as an entrance. These are the ones with a name.',
      html: `
        <form method="get" action="/archive/" class="mt-4 flex gap-2 font-mono text-xs" role="search" data-archive-search>
          <label class="sr-only" for="archiveQuery">Search recovered records</label>
          <input id="archiveQuery" name="q" type="search" value="${esc(q)}" placeholder="search recovered records, e.g. pope, utica, breaking…" class="flex-1 bg-white border border-ink px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ink">
          <button type="submit" class="bg-ink hover:bg-tabloidRed text-newsprint font-bold px-3 py-1 transition-colors uppercase shrink-0">SEARCH</button>
        </form>
        <div data-archive-results class="mt-4 space-y-3">${renderRecordList(archiveRecords, q)}</div>
        ${terminal([
          termLine('RECORDS WITH NAMES', esc(archiveRecords.length)),
          termLine('RECORDS WITHOUT NAMES', 'UNCOUNTED', 'terminal-val--alert'),
          termLine('LEGACY PERMALINK FAMILIES HANDLED', '/breaking/ · /utica-new-york/ · /category/ · /tag/ · /author/ · /page/ · /YYYY/MM/ · /wp-*'),
          termLine('ARCHIVE RECOVERED', esc(ARCHIVE_META.recoveredYear), 'terminal-val--ok'),
        ], { title: 'REGISTER SUMMARY', flicker: false })}
      `,
      actions: [
        { label: 'ABOUT THIS SITE', href: '/about/' },
        { label: 'ENTER CURRENT TRANSMISSION →', href: '/' },
      ],
    };
  },

  homepage() {
    return {
      eyebrow: 'FRONT PAGE',
      headline: 'REDIRECTING TO THE CURRENT EDITION',
      dek: '',
      html: `<p class="font-mono text-xs mt-3"><a class="underline" href="/">Continue to the front page →</a></p>`,
      actions: [],
    };
  },
};

export function renderRecordList(records, query = '') {
  const q = String(query || '').toLowerCase().trim();
  const items = records.filter((r) => {
    if (!q) return true;
    const hay = [r.id, r.title, r.historicalHeadline, r.summary, ...(r.aliases || []).map((a) => a.path), ...(r.matchTerms || []).flat()].join(' ').toLowerCase();
    return q.split(/\s+/).some((t) => hay.includes(t));
  });
  if (!items.length) {
    return `<div class="border border-dashed border-tabloidRed p-3 font-mono text-xs text-tabloidRed">NO NAMED RECORD MATCHES “${esc(q)}”. The archive may still hold it without a name — most 2016 hyperlinks resolve to an unnamed recovery page.</div>`;
  }
  return items
    .map(
      (r) => `
      <article class="border border-ink/30 p-3 bg-white/40">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-[10px] font-mono bg-ink text-white px-1.5 py-0.5 uppercase font-bold">RECORD ${esc(r.id)}</span>
          <span class="font-mono text-[10px] text-ink-faded">STATUS: ${esc(r.status)} · ${esc(r.originalDate)}</span>
        </div>
        <h3 class="font-headline text-xl font-bold uppercase text-ink leading-tight mt-1"><a class="hover:underline" href="${esc(r.canonicalPath)}">${esc(r.title)}</a></h3>
        <p class="font-serif text-xs text-ink/80 leading-relaxed mt-1">${esc(r.summary)}</p>
        <div class="font-mono text-[10px] text-ink-faded mt-2">KNOWN ADDRESSES: ${(r.aliases || []).length} · ${(r.aliases || []).filter((a) => a.provenance === 'VERIFIED').length} VERIFIED</div>
        <a href="${esc(r.canonicalPath)}" class="text-[11px] font-mono text-tabloidRed font-bold underline mt-1 inline-block">OPEN RECORD →</a>
      </article>`,
    )
    .join('');
}

/* ----------------------------------------------------------------------------
 * Frame
 * ------------------------------------------------------------------------- */
function manifest(res) {
  const r = res.record;
  const hooks = { ...ARCHIVE_META, ...(r?.hooks || {}) };
  const hookLines = ['sourceAuthority', 'recoveryAgency', 'archiveOrigin']
    .filter((k) => hooks[k])
    .map((k) => `<li class="flex justify-between gap-2"><span>${esc(k.replace(/([A-Z])/g, ' $1').toUpperCase())}</span><span class="font-bold text-right">${esc(hooks[k])}</span></li>`)
    .join('');
  const anomalies = (r?.anomalies || []).map((a) => `<li class="text-tabloidRed">⚠ ${esc(a)}</li>`).join('');
  return `
  <section id="archive-manifest" aria-labelledby="heading-manifest" class="border border-ink/30 p-3 bg-white/40">
    <div class="flex items-center justify-between border-b border-ink/40 pb-1 mb-2">
      <h2 id="heading-manifest" class="font-headline text-lg tracking-wider uppercase font-bold text-ink">RECOVERY MANIFEST</h2>
      <span class="font-mono text-[10px] text-ink-faded">AUTO-GENERATED</span>
    </div>
    <ul class="font-mono text-[11px] space-y-1 text-ink/90">
      <li class="flex justify-between gap-2"><span>ARCHIVE RECORD ID</span><span class="font-bold text-right">${esc(res.archiveRecordId || '—')}</span></li>
      <li class="flex justify-between gap-2"><span>EXPERIENCE</span><span class="font-bold text-right">${esc(res.experienceType)}</span></li>
      <li class="flex justify-between gap-2"><span>MATCH</span><span class="font-bold text-right">${esc(res.matchType)}</span></li>
      <li class="flex justify-between gap-2"><span>ROUTE CLASS</span><span class="font-bold text-right">${esc(res.provenance)}</span></li>
      <li class="flex justify-between gap-2"><span>RECORD STATUS</span><span class="font-bold text-right">${esc(res.recordStatus)}</span></li>
      <li class="flex justify-between gap-2"><span>CANONICAL</span><span class="font-bold text-right path-display">${res.canonicalPath ? `<a class="underline" href="${esc(res.canonicalPath)}">${esc(res.canonicalPath)}</a>` : 'NONE'}</span></li>
      <li class="flex justify-between gap-2"><span>CHECKSUM</span><span class="font-bold text-right">${esc(res.checksum)}</span></li>
      <li class="flex justify-between gap-2"><span>INTEGRITY</span><span class="font-bold text-right ${res.integrity === 'STABLE' ? '' : 'text-tabloidRed'}">${esc(res.integrity)}</span></li>
      <li class="flex justify-between gap-2"><span>RECOVERED</span><span class="font-bold text-right">${esc(ARCHIVE_META.recoveredYear)}</span></li>
      <li class="flex justify-between gap-2"><span>LEGACY NETWORK</span><span class="font-bold text-right">${esc(ARCHIVE_META.legacyNetworkStatus)}</span></li>
      <li class="flex justify-between gap-2"><span>CURRENT OPERATOR</span><span class="font-bold text-right">${esc(ARCHIVE_META.currentOperator)}</span></li>
      ${res.flags?.feedRequested ? `<li class="flex justify-between gap-2"><span>FEED VARIANT</span><span class="font-bold text-right">REQUESTED · NOT SERVED</span></li>` : ''}
      ${res.flags?.ampRequested ? `<li class="flex justify-between gap-2"><span>AMP VARIANT</span><span class="font-bold text-right">REQUESTED · NOT SERVED</span></li>` : ''}
      ${hookLines}
      ${anomalies}
    </ul>
    <details class="mt-2 font-mono text-[10px] text-ink-faded">
      <summary class="cursor-pointer hover:text-ink">RAW RESOLUTION</summary>
      <pre class="mt-1 whitespace-pre-wrap break-all bg-newsprint-dark/40 p-2 border border-ink/20" data-raw-resolution>${esc(JSON.stringify(summarise(res), null, 1))}</pre>
    </details>
    <!-- recoveryAgency: withheld -->
  </section>`;
}

function summarise(res) {
  return {
    requestedPath: res.requestedPath,
    normalizedPath: res.normalizedPath,
    tokens: res.tokens,
    experienceType: res.experienceType,
    matchType: res.matchType,
    provenance: res.provenance,
    familyProvenance: res.familyProvenance,
    archiveRecordId: res.archiveRecordId,
    canonicalPath: res.canonicalPath,
    checksum: res.checksum,
    integrity: res.integrity,
    routeKey: res.routeKey,
    flags: res.flags,
  };
}

function continueBox() {
  return `
  <div class="bg-tabloidYellow/25 border-2 border-ink p-3 relative">
    <span class="absolute -top-2.5 left-3 bg-tabloidRed text-white font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">CONTINUE</span>
    <ul class="font-mono text-xs space-y-1.5 mt-1">
      <li><a class="font-bold underline hover:text-tabloidRed" href="/archive/">→ ARCHIVE REGISTER</a></li>
      <li><a class="font-bold underline hover:text-tabloidRed" href="/about/">→ ABOUT THIS SITE / DISCLOSURE</a></li>
      <li><a class="font-bold underline hover:text-tabloidRed" href="/">→ ENTER CURRENT TRANSMISSION</a></li>
    </ul>
    <p class="font-serif text-[11px] italic text-ink/80 mt-2 leading-snug">The current edition is fiction and knows it. The former occupant of this domain was fiction and did not say so.</p>
  </div>`;
}

function utilityBar(res) {
  return `
  <aside aria-label="System Archival Bar" class="flex flex-wrap justify-between items-center text-xs font-mono border-b border-ink/20 pb-2 mb-3 text-ink-faded gap-2">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 font-bold text-ink">
        <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
        WIRE STATE: ARCHIVAL
      </span>
      <span>•</span>
      <span>RECOVERY UNIT 6</span>
      <span class="hidden sm:inline">•</span>
      <span class="hidden sm:inline">RECORD: ${esc(res.archiveRecordId || 'NONE')}</span>
    </div>
    <div class="flex items-center gap-2">
      <a href="/" class="hover:underline">FRONT PAGE</a>
      <span>|</span>
      <button id="toggleMicrofiche" type="button" class="hover:bg-ink hover:text-newsprint px-1.5 py-0.5 rounded border border-ink/30 transition-colors">MICROFICHE INVERT</button>
      <span class="hidden sm:inline">|</span>
      <span class="hidden sm:inline bg-tabloidYellow px-1 font-bold text-ink text-[11px]">ADMISSION: FREE</span>
    </div>
  </aside>`;
}

function noticeBar() {
  return `
  <section aria-label="Archive Notice" class="bg-ink text-newsprint px-3 py-1.5 mb-4 flex flex-wrap justify-between items-center text-xs font-mono tracking-wider">
    <span class="bg-tabloidRed text-white px-2 py-0.5 font-bold mr-2 text-[10px] tracking-normal">ARCHIVE NOTICE</span>
    <span class="flex-1 truncate">THIS ADDRESS WAS INHERITED FROM A DECOMMISSIONED 2016 WEBSITE. THE CURRENT OPERATOR IS UNRELATED. NOTHING FROM THE FORMER SITE IS REPUBLISHED HERE.</span>
    <span class="text-tabloidYellow text-[11px] ml-2">STATUS: VERIFIED</span>
  </section>`;
}

function masthead() {
  return `
  <header class="text-center pt-2 pb-3">
    <div class="flex justify-between items-center text-xs uppercase tracking-widest font-mono border-b border-ink/20 pb-1 mb-2">
      <span class="hidden md:inline">Dead Hyperlink Desk</span>
      <span>"Every Old Link Is a Door"</span>
      <span class="hidden md:inline">Archive Recovery Unit</span>
    </div>
    <div class="relative py-1">
      <div class="absolute left-2 top-1 hidden lg:block">
        <div class="archive-stamp text-[11px] leading-tight">RECOVERED<br>${esc(ARCHIVE_META.recoveredYear)}<br>DO NOT MOISTEN</div>
      </div>
      <div class="absolute right-2 top-1 hidden lg:block text-right font-mono text-[11px] text-ink-faded leading-tight">
        <div>LEGACY NETWORK: ${esc(ARCHIVE_META.legacyNetworkStatus)}</div>
        <div>CURRENT OPERATOR: ${esc(ARCHIVE_META.currentOperator)}</div>
        <div class="font-bold text-ink">RECOVERY: ONGOING</div>
      </div>
      <a href="/" class="inline-block"><h1 class="font-masthead text-5xl md:text-7xl font-black tracking-tight text-ink ink-bleed">KYPO6</h1></a>
      <p class="font-mono text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-ink-faded mt-1">ARCHIVE RECOVERY UNIT · INTERNET ARCHAEOLOGY DIVISION</p>
    </div>
    <div class="rule-thick-thin my-2"></div>
    <div class="flex flex-wrap justify-between items-center text-xs font-serif font-bold uppercase tracking-wider px-2 py-1 text-ink/80">
      <span>DOMAIN FIRST OCCUPIED: 2016</span>
      <span>DOMAIN ABANDONED: THEREAFTER</span>
      <span>ARCHIVE RECOVERED: ${esc(ARCHIVE_META.recoveredYear)}</span>
      <span class="hidden md:inline">WEATHER IN THE ARCHIVE: DRY, FAINTLY HUMMING</span>
    </div>
    <div class="border-b-2 border-ink mb-4"></div>
  </header>`;
}

function ticker() {
  const items = [
    'RECOVERY UNIT REMINDS VISITORS THAT A 404 IS A ROOM, NOT A WALL',
    'LEGACY CMS ARTIFACTS CONTINUE TO REQUEST THEMSELVES; NONE HAVE BEEN SERVED',
    'FORMER OPERATORS REMAIN UNRELATED, UNREACHABLE, AND UNINVITED',
    'FACT-CHECKS FROM 2016 STILL LINK HERE; THE ARCHIVE WAVES BACK',
    'FILM CREW EXPECTED IN UTICA SINCE 2016 HAS NOT CHECKED IN',
  ];
  const span = items.map((t) => `<span>+++ ${esc(t)} +++</span>`).join('<span class="mx-6">★</span>');
  return `
  <nav aria-label="Archive Wire Feed" class="bg-newsprint-dark border border-ink/30 px-2 py-1 mb-6 flex items-center font-mono text-xs">
    <span class="bg-tabloidRed text-white font-bold px-2 py-0.5 mr-3 shrink-0 text-[10px]">ARCHIVE WIRE</span>
    <div class="ticker-wrap flex-1"><div class="ticker-move text-ink">${span}<span class="mx-6">★</span>${span}</div></div>
  </nav>`;
}

function footer() {
  return `
  <footer class="mt-8 pt-4 border-t-2 border-ink text-center space-y-2 text-xs font-mono text-ink-faded">
    <div class="flex flex-wrap justify-center gap-6 font-semibold uppercase tracking-wider text-ink text-[11px]">
      <a href="/" class="hover:underline">Front Page</a><span>•</span>
      <a href="/archive/" class="hover:underline">Archive Register</a><span>•</span>
      <a href="/about/" class="hover:underline">About This Site</a>
    </div>
    <p class="max-w-2xl mx-auto text-[10px] leading-relaxed">${esc(DISCLOSURE_SHORT)}</p>
    <div class="font-mono text-[9px] pt-1 border-t border-dotted border-ink/20">LEGACY HYPERLINKS ARE ACCEPTED AT ALL HOURS. NO RECORD WILL BE RESTORED. ALL RECORDS WILL BE ACKNOWLEDGED.</div>
  </footer>`;
}

/**
 * Full page body for a resolution.
 */
export function renderArchivePage(res) {
  const present = presenters[res.experienceType] || presenters.unrecovered;
  const view = present(res);
  const minimal = res.experienceType === 'asset-missing';

  const main = `
  <main class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <article class="lg:col-span-8 space-y-1" data-experience="${esc(res.experienceType)}">
      <div class="inline-block bg-tabloidRed text-white text-xs font-headline tracking-widest px-2 py-0.5 uppercase font-bold mb-1">${esc(view.eyebrow)}</div>
      <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-ink uppercase tracking-tight leading-[0.95] ink-bleed">${esc(view.headline)}</h2>
      ${view.dek ? `<h3 class="font-serif italic text-base sm:text-lg text-ink-faded mt-2 leading-snug">${esc(view.dek)}</h3>` : ''}
      ${view.html}
      ${view.actions?.length ? actionBar(res, view.actions) : ''}
    </article>
    <aside aria-label="Right Rail: Recovery Manifest" class="lg:col-span-4 space-y-6 lg:border-l lg:border-ink/20 lg:pl-5">
      ${continueBox()}
      ${manifest(res)}
    </aside>
  </main>`;

  if (minimal) {
    return `<div id="paperCanvas" class="newspaper-sheet max-w-3xl mx-auto p-4 md:p-8">${main}</div>`;
  }

  return `
  <div id="paperCanvas" class="newspaper-sheet max-w-7xl mx-auto p-4 md:p-8 transition-colors duration-500">
    ${utilityBar(res)}
    ${noticeBar()}
    ${masthead()}
    ${ticker()}
    ${main}
    ${footer()}
  </div>`;
}

/* ----------------------------------------------------------------------------
 * Document metadata
 * ------------------------------------------------------------------------- */
export function metaFor(res) {
  const site = 'KYPO6';
  const r = res.record;
  if (r?.seo) {
    return {
      title: r.seo.title,
      description: r.seo.description,
      canonical: r.canonicalPath,
      robots: 'index,follow',
      ogType: 'article',
    };
  }
  const shortPath = clampPath(res.displayPath, 60);
  const byType = {
    'breaking-archive': {
      title: `Archived KYPO6 Record: ${shortPath} (unrecovered)`,
      description: `Historical archive entry for a legacy /breaking/ URL from the former kypo6.com (2016). No surviving copy of this record has been located. ${DISCLOSURE_SHORT}`,
    },
    'regional-desk': {
      title: `Archived KYPO6 Regional Desk: ${res.family?.region || 'Unknown'} (unrecovered)`,
      description: `Historical archive entry for a legacy location-category URL from the former kypo6.com (2016). ${DISCLOSURE_SHORT}`,
    },
    'archive-index': { title: `Archive Index: ${res.slug || 'unnamed'} — ${site}`, description: `Legacy category URL from the former kypo6.com, translated into an archive index concept. ${DISCLOSURE_SHORT}` },
    'transmission-tag': { title: `Indexed Transmission Tag: ${res.slug || 'unnamed'} — ${site}`, description: `Legacy tag URL from the former kypo6.com. No surviving tagged records. ${DISCLOSURE_SHORT}` },
    'personnel-record': { title: `Personnel Record: ${res.slug || 'unnamed'} — ${site}`, description: `Legacy author URL from the former kypo6.com. No personnel file is held. ${DISCLOSURE_SHORT}` },
    'paginated-recovery': { title: `Paginated Archive Recovery — ${site}`, description: `Legacy pagination URL from the former kypo6.com. ${DISCLOSURE_SHORT}` },
    'dated-record': { title: `Dated Archive Record — ${site}`, description: `Legacy date-based URL from the former kypo6.com. Contents not recovered. ${DISCLOSURE_SHORT}` },
    'cms-artifact': { title: `Legacy CMS Artifact — ${site}`, description: `Resource no longer present. Reference retained by archive. ${DISCLOSURE_SHORT}` },
    'asset-missing': { title: `404 — ${site}`, description: 'Asset not found.' },
    unrecovered: {
      title: `Archive Record Unavailable — ${site}`,
      description: `The record that once occupied this address has not survived. ${DISCLOSURE_SHORT}`,
    },
  };
  const m = byType[res.experienceType] || byType.unrecovered;
  return {
    title: m.title,
    description: m.description,
    canonical: res.canonicalPath, // null for unknowns → no canonical emitted
    /* Only registry records are indexable. Everything derived from an arbitrary
       incoming path is noindex so nobody can mint indexable URLs at will. */
    robots: 'noindex,follow',
    ogType: 'website',
  };
}
