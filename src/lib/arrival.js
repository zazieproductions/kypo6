/**
 * KYPO6 — ARRIVAL BEACON (analytics-readiness, no third parties)
 * =============================================================================
 * Makes the arrival class of every page view available to future code WITHOUT
 * sending anything anywhere. Consumers can:
 *
 *   window.addEventListener('kypo6:arrival', (e) => { e.detail … });
 *   window.KYPO6.arrival            // same payload, for late subscribers
 *   document.documentElement.dataset.kypo6Arrival   // CSS/ARG hooks
 *   sessionStorage 'kypo6.entry'    // first arrival of the session (JSON)
 *   window.dataLayer                // pushed to ONLY if something else created it
 *
 * Arrival classes:
 *   homepage · legacy-query · archive-record · site-page · site-page-alias ·
 *   known-deep-link · unknown-legacy-link · asset-404
 */

const ENTRY_KEY = 'kypo6.entry';

export function announceArrival(resolution, extra = {}) {
  const payload = {
    arrival: resolution.arrival,
    routeKey: resolution.routeKey,
    experienceType: resolution.experienceType,
    archiveRecordId: resolution.archiveRecordId || null,
    requestedPath: resolution.requestedPath,
    canonicalPath: resolution.canonicalPath || null,
    matchType: resolution.matchType,
    provenance: resolution.provenance,
    checksum: resolution.checksum,
    integrity: resolution.integrity,
    referrer: safeReferrer(),
    at: new Date().toISOString(),
    ...extra,
  };

  window.KYPO6 = Object.assign(window.KYPO6 || {}, { arrival: payload, resolution });

  const root = document.documentElement;
  root.dataset.kypo6Arrival = payload.arrival;
  root.dataset.kypo6Experience = payload.experienceType;
  if (payload.archiveRecordId) root.dataset.kypo6Record = payload.archiveRecordId;

  try {
    if (!sessionStorage.getItem(ENTRY_KEY)) sessionStorage.setItem(ENTRY_KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable — fine */
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'kypo6_arrival', ...payload });
  }

  window.dispatchEvent(new CustomEvent('kypo6:arrival', { detail: payload }));
  return payload;
}

/** The first arrival recorded this session, if any (used by the front page). */
export function sessionEntry() {
  try {
    const raw = sessionStorage.getItem(ENTRY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeReferrer() {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const u = new URL(ref);
    return u.origin === location.origin ? 'internal' : u.hostname;
  } catch {
    return null;
  }
}
