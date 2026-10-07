/**
 * KYPO6 — FRONT-PAGE NEWSROOM ENGINE
 * =============================================================================
 * Turns every link, card, button and section of index.html into working,
 * pre-populated news-site functionality. Loaded as a module by index.html:
 *
 *   <script type="module" src="/src/lib/newsroom.js"></script>
 *
 * WHAT IT DOES
 *   • Deep links      /?story=<key>  /?desk=<id>  /?feature=<id>
 *                     — real URLs, pushState + popstate, open on load, shareable
 *   • Story reader    full dispatch modal: dateline, live updates, tags,
 *                     related coverage, author dossiers, permalinks, comments
 *                     (user comments persist in localStorage)
 *   • Feature panels  weather bureau, Spleen Exchange, warnings register,
 *                     mandate #409-B, bell belfry (audible toll), almanac,
 *                     poll archive, 34 whispers, full horoscope, radio
 *                     dossier + schedule, historical editions, submissions
 *                     desk (4 forms), 2 advertisement order forms, occult
 *                     cookie policy with real stored consent
 *   • Desks           nav buttons filter the feed AND show a desk masthead
 *   • Search          live feed filter + dropdown searching the WHOLE newsroom
 *                     (stories, authors, desks, editions, whispers, signs,
 *                     services) with a jump-link into /archive/?q=
 *   • Poll            structured tallies, animated bars, one sovereign vote
 *                     per browser, past polls
 *   • Ticker          every scrolling panic is an anchor to its dispatch
 *   • No alerts       every former alert()/javascript:void(0) is now a panel,
 *                     a form, a receipt or a toast
 *
 * Everything user-generated is escaped before it touches the DOM. Story bodies
 * in src/data/newsroom.js are trusted editorial HTML written by this project.
 */

import {
  desks, authors, stories, ticker, flash, dispatchStrip, weather, markets,
  warnings, mandate, bell, almanac, poll, horoscope, whispers, radio,
  ads, editions, submissions, cookieHex, featureIds,
  getDesk, getStory, getAuthor, storiesByDesk, storiesByAuthor,
} from '../data/newsroom.js';
import { editorialPages } from '../data/editorialPages.js';

/* ---------------------------------------------------------------------------
 * Small utilities
 * ------------------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmt(n) { return Number(n).toLocaleString('en-US'); }
function pct(part, total) { return total ? Math.round((part / total) * 100) : 0; }
function ref(prefix) { return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`; }
function nowStamp() { return new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'; }

/* ---------------------------------------------------------------------------
 * Persistent local state (votes, comments, orders, slips, tolls, consent)
 * One key, whole newsroom. Storage failures are swallowed (private mode).
 * ------------------------------------------------------------------------- */
const STORAGE_KEY = 'kypo6.newsroom.v1';
const state = {
  pollVote: null,          // { option, at }
  comments: {},            // storyKey → [ {author, badge, text, when, mine:true} ]
  orders: [],              // [ {ref, product, tier, at} ]
  slips: [],               // [ {ref, type, at} ]
  tolls: 0,                // local toll count
  tollLog: [],             // [ {at} ]
  consent: null,           // ISO string when hex accepted
};
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch { /* no storage — fine */ }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* fine */ }
}

/* ---------------------------------------------------------------------------
 * Toasts — replaces every alert() on the page
 * ------------------------------------------------------------------------- */
function toast(title, text, tone = 'ink') {
  const stack = $('#toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  const colors = {
    ink: 'bg-black text-white border-black',
    red: 'bg-tabloidRed text-white border-black',
    yellow: 'bg-tabloidYellow text-black border-black',
    green: 'bg-cursedGreen text-white border-black',
  };
  el.className = `pointer-events-auto border-2 ${colors[tone] || colors.ink} shadow-[4px_4px_0px_#000] p-2.5 font-mono text-[11px] leading-snug cursor-pointer`;
  el.innerHTML = `<div class="font-bold uppercase tracking-wider text-[10px] mb-0.5">${esc(title)}</div><div>${esc(text)}</div>`;
  el.addEventListener('click', () => el.remove());
  stack.appendChild(el);
  setTimeout(() => el.remove(), 5200);
  while (stack.children.length > 4) stack.firstChild.remove();
}

/* ---------------------------------------------------------------------------
 * Modal plumbing — story reader (#articleModal) + feature panel (#featureModal)
 * ------------------------------------------------------------------------- */
const DEFAULT_TITLE = document.title;
let activeStoryKey = null;
let activeFeatureId = null;

function syncScrollLock() {
  document.body.style.overflow = (activeStoryKey || activeFeatureId) ? 'hidden' : '';
}
function closeStoryModal() {
  $('#articleModal')?.classList.add('hidden');
  activeStoryKey = null;
  document.title = DEFAULT_TITLE;
  syncScrollLock();
}
function closeFeatureModal() {
  $('#featureModal')?.classList.add('hidden');
  activeFeatureId = null;
  syncScrollLock();
}

/* Deep links: /?story= /?desk= /?feature= ---------------------------------- */
let currentDesk = 'all';

function paramsToQuery(params) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null && v !== '' && !(k === 'desk' && v === 'all')) qs.set(k, v);
  const s = qs.toString();
  return s ? `/?${s}` : '/';
}
function goto(params, { replace = false } = {}) {
  const url = paramsToQuery(params);
  if (location.pathname + location.search === url) { applyParams(); return; }
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
  applyParams();
}
function currentParams() {
  const p = new URLSearchParams(location.search);
  return {
    story: p.get('story'),
    desk: p.get('desk') || 'all',
    feature: p.get('feature'),
  };
}
function applyParams() {
  const { story, desk, feature } = currentParams();

  // Desk filter (applyDesk itself never pushes when called from here)
  applyDesk(desk, { push: false });

  // Feature panel
  if (feature && featureIds.includes(feature)) showFeatureModal(feature);
  else if (!story) closeFeatureModal(); // story may open from inside a feature

  // Story reader wins over feature
  if (story && getStory(story)) { closeFeatureModal(); showStoryModal(story); }
  else closeStoryModal();
}
window.addEventListener('popstate', applyParams);

/* ---------------------------------------------------------------------------
 * STORY READER
 * ------------------------------------------------------------------------- */
function showStoryModal(key) {
  const s = getStory(key);
  if (!s) return;
  activeStoryKey = key;
  const desk = getDesk(s.desk);

  $('#modalTag').textContent = s.tag;
  $('#modalCycle').textContent = `CYCLE ${s.cycle}`;
  $('#modalTitle').textContent = s.title;
  $('#modalSubhead').textContent = s.subhead;
  $('#modalAuthor').textContent = (getAuthor(s.authorId)?.name) || 'STAFF';
  $('#modalAuthorBtn').dataset.authorId = s.authorId;
  $('#modalRole').textContent = `(${s.authorRole})`;
  $('#modalWeight').textContent = s.readWeight;
  $('#modalDateline').innerHTML = `
    <span class="bg-black text-tabloidYellow px-1.5 py-0.5 font-bold uppercase">${esc(desk ? desk.name : s.desk)}</span>
    <span><i class="fa-solid fa-location-dot text-tabloidRed"></i> ${esc(s.dateline)}</span>
    <span>FILED: ${esc(s.filed)}</span>
    <span class="hidden sm:inline">PUBLISHED: ${esc(s.published.slice(0, 10).toUpperCase())}</span>
    <span>${esc(String(s.readMinutes))} MIN SCREAM</span>`;

  const img = $('#modalImage');
  img.src = s.image;
  img.alt = s.title;
  img.classList.toggle('bone-story-image-natural', key === 'story-bone');
  $('#modalCaption').textContent = s.caption;
  if (s.credit) $('#modalCredit') && ($('#modalCredit').textContent = s.credit);

  $('#modalBody').innerHTML = s.body;

  // Live updates timeline
  const upd = $('#modalUpdates');
  if (upd) {
    if (s.updates && s.updates.length) {
      upd.classList.remove('hidden');
      upd.innerHTML = `<div class="font-headline text-lg uppercase text-tabloidRed mb-1.5">LIVE UPDATES</div>` +
        s.updates.map((u) => `
          <div class="flex gap-2 border-l-2 border-tabloidRed pl-2 py-1">
            <span class="font-mono text-xs font-bold text-black shrink-0">${esc(u.time)}</span>
            <span class="font-bodyText text-sm">${esc(u.text)}</span>
          </div>`).join('');
    } else upd.classList.add('hidden');
  }

  // Tags
  const tags = $('#modalTags');
  if (tags) {
    tags.innerHTML = `<span class="font-mono text-[10px] text-gray-500 uppercase font-bold mr-1">Filed under:</span>` +
      (s.tags || []).map((t) => `<button type="button" data-action="tag-search" data-tag="${esc(t)}" class="bg-white border border-black px-1.5 py-0.5 font-mono text-[10px] uppercase hover:bg-tabloidYellow transition">${esc(t)}</button>`).join(' ');
  }

  // Related coverage
  const rel = $('#modalRelated');
  if (rel) {
    const items = (s.related || []).map(getStory).filter(Boolean);
    if (items.length) {
      rel.classList.remove('hidden');
      rel.innerHTML = `<div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">MORE FROM THE PERPETUAL DISHONOR ROLL</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">` +
        items.map((r) => {
          const rk = Object.keys(stories).find((k) => stories[k] === r);
          return `<button type="button" data-open-story="${esc(rk)}" class="text-left bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000] hover:border-tabloidRed transition">
            <span class="font-mono text-[9px] text-tabloidRed font-bold uppercase">${esc(r.tag)}</span>
            <span class="block font-headline text-sm leading-tight text-black uppercase mt-0.5">${esc(r.title.slice(0, 90))}${r.title.length > 90 ? '…' : ''}</span>
          </button>`;
        }).join('') + `</div>`;
    } else rel.classList.add('hidden');
  }

  // Permalink for share row
  const link = $('#shareLink');
  if (link) link.value = `${location.origin}/?story=${encodeURIComponent(key)}`;

  renderComments(key);
  $('#articleModal').classList.remove('hidden');
  $('#articleModal').scrollTop = 0;
  const sheet = $('#articleModal .relative'); if (sheet) sheet.scrollTop = 0;

  document.title = `${s.title} — KYPO6`;
  syncScrollLock();
}

function openStory(key) { goto({ story: key, desk: currentDesk !== 'all' ? currentDesk : null }); }
function closeStory() { goto({ desk: currentDesk !== 'all' ? currentDesk : null }); }

/* Comments: seeded (data) + user (localStorage), newest user comments first -- */
function allComments(key) {
  const mine = state.comments[key] || [];
  const seeded = (getStory(key)?.comments) || [];
  return [...mine, ...seeded];
}
function renderComments(key) {
  const container = $('#commentsList');
  const countLabel = $('#commentCount');
  if (!container) return;
  const list = allComments(key);
  if (countLabel) countLabel.textContent = list.length;
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = `<div class="text-gray-500 italic p-2 bg-neutral-100 border border-gray-300">No registered squawks yet. The Parish Clerk listens in silence.</div>`;
    return;
  }
  list.forEach((c) => {
    const item = document.createElement('div');
    item.className = 'bg-white p-2.5 border border-black shadow-[2px_2px_0px_#000]';
    item.innerHTML = `
      <div class="flex justify-between items-center mb-1 gap-2">
        <span class="font-bold text-black uppercase tracking-tight text-[11px]">${esc(c.author)}${c.mine ? ' <span class="text-tabloidRed">(YOU)</span>' : ''}</span>
        <span class="bg-tabloidYellow text-black text-[9px] px-1 border border-black font-semibold whitespace-nowrap">${esc(c.badge)}${c.when ? ` · ${esc(c.when)}` : ''}</span>
      </div>
      <p class="font-bodyText text-xs text-gray-800 leading-tight">${esc(c.text)}</p>`;
    container.appendChild(item);
  });
}
function submitComment(e) {
  e.preventDefault();
  if (!activeStoryKey) return;
  const author = $('#commentAuthorInput').value.trim();
  const badge = $('#commentSpleenSelect').value;
  const text = $('#commentTextInput').value.trim();
  if (!author || !text) return;
  if (!state.comments[activeStoryKey]) state.comments[activeStoryKey] = [];
  state.comments[activeStoryKey].unshift({ author, badge, text, when: 'JUST NOW', mine: true });
  saveState();
  renderComments(activeStoryKey);
  $('#commentAuthorInput').value = '';
  $('#commentTextInput').value = '';
  toast('TESTIMONY LOGGED', 'Your remark has been transcribed onto salt pork and dispatched down the sewer. It persists in this browser’s ledger.', 'green');
}

/* Share: real permalink copy + the traditional telepathy ------------------- */
function copyPermalink() {
  const link = $('#shareLink');
  const url = link ? link.value : `${location.origin}/?story=${encodeURIComponent(activeStoryKey || '')}`;
  const done = () => toast('PERMALINK COPIED', url, 'yellow');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(link, done));
  } else fallbackCopy(link, done);
}
function fallbackCopy(input, done) {
  try {
    input.classList.remove('hidden');
    input.select();
    document.execCommand('copy');
    input.classList.add('hidden');
    done();
  } catch {
    input?.classList.add('hidden');
    toast('COPY FAILED', 'Transcribe the permalink by hand, as in 1894.', 'red');
  }
}
function shareTelepathy() {
  const targets = [
    "your cousin's pantry in Leeds", 'a stray sheep outside Aberdeen',
    'the Royal Gristle Registry', 'an iron kettle in Doncaster',
    'the awake 2% of suburban lawns', 'a hat containing 611 wafers',
  ];
  const target = targets[Math.floor(Math.random() * targets.length)];
  toast('TELEPATHIC TRANSMISSION SENT', `This dispatch is now vibrating gently inside ${target}.`, 'red');
}

/* ---------------------------------------------------------------------------
 * AUTHOR DOSSIERS
 * ------------------------------------------------------------------------- */
function showAuthor(id) { openFeature(`author-${id}`); }

function renderAuthor(id) {
  const a = getAuthor(id);
  if (!a) return null;
  const desk = getDesk(a.desk);
  const dispatchKeys = storiesByAuthor(id);
  return {
    tag: 'PERSONNEL RECORD',
    title: a.name.toUpperCase(),
    body: `
      <div class="flex flex-col sm:flex-row gap-4 items-start border-b-2 border-black pb-4 mb-4">
        <img src="${esc(a.avatar)}" alt="Portrait of ${esc(a.name)}" class="w-28 h-28 object-cover border-2 border-black shadow-[3px_3px_0px_#000] tabloid-img-flash shrink-0">
        <div class="font-mono text-xs space-y-1">
          <div class="font-headline text-xl uppercase text-tabloidRed leading-none">${esc(a.role)}</div>
          <div><span class="text-gray-500">DESK:</span> <strong>${esc(desk ? desk.name : a.desk)}</strong></div>
          <div><span class="text-gray-500">BEAT:</span> ${esc(a.beat)}</div>
          <div><span class="text-gray-500">JOINED:</span> ${esc(a.joined)}</div>
          <div><span class="text-gray-500">DISPATCHES FILED:</span> ${esc(String(a.dispatches))}</div>
          <div><span class="text-gray-500">CONTACT:</span> ${esc(a.contact)}</div>
        </div>
      </div>
      ${a.bio.split('\n').filter(Boolean).map((p) => `<p class="font-bodyText text-sm sm:text-base leading-relaxed mb-2">${esc(p.trim())}</p>`).join('')}
      <div class="mt-3 bg-white border-2 border-black p-2 font-mono text-[11px]">
        <div class="font-bold uppercase text-tabloidRed text-[10px] mb-1">Known quirks</div>
        <ul class="list-disc list-inside space-y-0.5">${a.quirks.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
      </div>
      <div class="mt-4">
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">DISPATCHES BY ${esc(a.name.toUpperCase())} (${dispatchKeys.length})</div>
        <div class="space-y-1.5">
          ${dispatchKeys.map((k) => `
            <button type="button" data-open-story="${esc(k)}" class="w-full text-left bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000] hover:border-tabloidRed transition">
              <span class="font-mono text-[9px] text-tabloidRed font-bold uppercase">${esc(stories[k].tag)}</span>
              <span class="block font-headline text-sm uppercase leading-tight text-black">${esc(stories[k].title)}</span>
              <span class="block font-mono text-[10px] text-gray-500 mt-0.5">${esc(stories[k].dateline)} · ${esc(stories[k].filed)}</span>
            </button>`).join('')}
        </div>
      </div>`,
  };
}

/* ---------------------------------------------------------------------------
 * FEATURE PANELS — every header box, sidebar widget, ad and footer link
 * ------------------------------------------------------------------------- */
function showFeatureModal(id) {
  const f = renderFeature(id);
  if (!f) return;
  activeFeatureId = id;
  $('#featureTag').textContent = f.tag;
  $('#featureTitle').innerHTML = f.title;
  $('#featureBody').innerHTML = f.body;
  $('#featureModal').classList.remove('hidden');
  const sheet = $('#featureModal .relative'); if (sheet) sheet.scrollTop = 0;
  document.title = `${f.plainTitle || f.tag} — KYPO6`;
  syncScrollLock();
}
function openFeature(id) { goto({ feature: id, desk: currentDesk !== 'all' ? currentDesk : null }); }
function closeFeature() { goto({ desk: currentDesk !== 'all' ? currentDesk : null }); }

const TREND = { up: '<i class="fa-solid fa-arrow-trend-up text-green-700"></i>', down: '<i class="fa-solid fa-arrow-trend-down text-red-600"></i>', flat: '<span class="text-gray-500 font-bold">— STABLE</span>' };
function kv(k, v) { return `<div class="flex justify-between gap-3 border-b border-gray-300 py-1"><span class="text-gray-500 uppercase">${esc(k)}</span><span class="font-bold text-right">${esc(v)}</span></div>`; }

function renderFeature(id) {
  if (id.startsWith('author-')) return renderAuthor(id.slice(7));
  if (id.startsWith('edition-') && id !== 'editions') {
    const ed = editions.entries.find((e) => e.id === id);
    if (!ed) return null;
    return {
      tag: `ARCHIVAL BASEMENT · ${ed.year}`,
      title: esc(ed.title.toUpperCase()),
      plainTitle: ed.title,
      body: `
        <div class="font-mono text-[11px] bg-black text-tabloidYellow px-2 py-1 mb-3 flex justify-between">
          <span>EDITION ${esc(ed.year)} · SALT-CURED 1977</span>
          <button type="button" data-open-feature="editions" class="underline hover:text-white">FULL REGISTER →</button>
        </div>
        <div class="font-headline text-xl sm:text-2xl uppercase text-black leading-tight border-b-4 border-black pb-2 mb-2">${esc(ed.headline)}</div>
        <p class="font-bodyText text-sm italic text-gray-700 mb-3">${esc(ed.summary)}</p>
        <p class="font-mono text-[10px] text-gray-500 uppercase mb-4">${esc(ed.curator)}</p>
        <div class="space-y-2">
          ${ed.contents.map((c) => `
            <details class="bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
              <summary class="cursor-pointer p-2 font-mono text-[11px] flex justify-between items-center gap-2 hover:bg-tabloidYellow transition">
                <span class="bg-tabloidRed text-white px-1.5 py-0.5 text-[9px] font-bold uppercase shrink-0">${esc(c.tag)}</span>
                <span class="font-headline text-sm uppercase text-black flex-1">${esc(c.headline)}</span>
                <span class="text-gray-500 text-[9px] uppercase shrink-0">Read surviving text ▾</span>
              </summary>
              <div class="p-2.5 border-t-2 border-black font-bodyText text-sm leading-relaxed bg-newsprint">${esc(c.text)}</div>
            </details>`).join('')}
        </div>`,
    };
  }
  if (id.startsWith('submit-') && id !== 'submissions') {
    const t = submissions.types.find((x) => x.id === id);
    if (!t) return null;
    const recent = state.slips.filter((s) => s.type === t.id);
    return {
      tag: 'SUBMISSIONS OF PANIC',
      title: esc(t.formTitle),
      plainTitle: t.formTitle,
      body: `
        <p class="font-bodyText text-sm italic text-gray-800 border-l-4 border-tabloidRed pl-3 mb-4">${esc(t.blurb)}</p>
        <form data-form="submission" data-form-id="${esc(t.id)}" class="bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#000] space-y-2">
          ${t.fields.map((f) => renderField(f)).join('')}
          <button type="submit" class="bg-tabloidRed hover:bg-black text-white font-headline text-sm uppercase px-4 py-1.5 tracking-wider transition w-full">FILE WITH THE DESK</button>
        </form>
        <div data-receipt class="hidden mt-3"></div>
        ${recent.length ? `<div class="mt-4 font-mono text-[10px]"><div class="font-bold uppercase text-gray-600 mb-1">Recent slips from this browser</div>${recent.slice(0, 5).map((s) => `<div>${esc(s.ref)} · ${esc(s.at)}</div>`).join('')}</div>` : ''}
        <div class="mt-4 border-t border-black/20 pt-2 font-mono text-[10px] flex justify-between">
          <button type="button" data-open-feature="submissions" class="text-tabloidRed font-bold underline uppercase hover:text-black">← All submission desks</button>
        </div>`,
    };
  }
  if (id.startsWith('ad-')) {
    const key = id.slice(3);
    const ad = ads[key];
    if (!ad) return null;
    const mine = state.orders.filter((o) => o.product === key);
    return {
      tag: 'CLASSIFIED ADVERTISEMENT',
      title: esc(ad.name),
      plainTitle: ad.name,
      body: `
        <div class="font-headline text-xl uppercase text-tabloidRed leading-none mb-2">${esc(ad.headline)}</div>
        <p class="font-bodyText text-sm italic text-gray-800 mb-3">${esc(ad.pitch)}</p>
        <div class="bg-black text-tabloidYellow font-mono text-xs font-bold px-2 py-1 mb-3">${esc(ad.price)}</div>
        <div class="bg-white border-2 border-black p-2 font-mono text-[11px] mb-4">
          <div class="font-bold uppercase text-tabloidRed text-[10px] mb-1">Full specifications</div>
          <ul class="list-disc list-inside space-y-0.5">${ad.specs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>
        <form data-form="ad" data-form-id="${esc(key)}" class="space-y-3">
          <div>
            <div class="font-headline text-sm uppercase text-black border-b border-black pb-0.5 mb-1.5">Choose your tier</div>
            <div class="space-y-1">
              ${ad.tiers.map((t, i) => `
                <label class="flex items-start gap-2 bg-white border-2 border-black p-2 cursor-pointer hover:border-tabloidRed transition">
                  <input type="radio" name="tier" value="${esc(t.id)}" data-price="${esc(t.price)}" ${i === (ad.tiers.length > 1 ? 1 : 0) ? 'checked' : ''} class="mt-1 accent-tabloidRed">
                  <span class="font-mono text-[11px]"><strong class="uppercase">${esc(t.label)} — ${esc(String(t.price))} ${esc(t.unit)}</strong><br>${esc(t.note)}</span>
                </label>`).join('')}
            </div>
          </div>
          <div class="bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#000] space-y-2">
            ${ad.fields.map((f) => renderField(f)).join('')}
            <button type="submit" class="bg-tabloidRed hover:bg-black text-white font-headline text-sm uppercase px-4 py-1.5 tracking-wider transition w-full">SUBMIT PETITION</button>
          </div>
        </form>
        <div data-receipt class="hidden mt-3"></div>
        ${mine.length ? `<div class="mt-4 font-mono text-[10px]"><div class="font-bold uppercase text-gray-600 mb-1">Your petitions (this browser)</div>${mine.slice(0, 5).map((o) => `<div>${esc(o.ref)} · ${esc(o.tier)} · ${esc(o.at)}</div>`).join('')}</div>` : ''}
        <p class="mt-4 font-mono text-[9px] text-gray-500 leading-relaxed border-t border-black/20 pt-2">${esc(ad.terms)}</p>`,
    };
  }

  switch (id) {
    case 'weather': return {
      tag: 'BASIN METEOROLOGICAL OFFICE', title: 'THE FISCAL & FISCAL-ADJACENT WEATHER', plainTitle: 'Basin Weather',
      body: `
        <div class="font-mono text-[10px] uppercase text-gray-500 mb-2">${esc(weather.bureau)} · ${esc(weather.region)}</div>
        <div class="bg-black text-white border-2 border-black p-3 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div><span class="font-headline text-5xl text-tabloidYellow">${esc(weather.observed.temp)}</span> <span class="font-mono text-xs uppercase">${esc(weather.observed.condition)}</span></div>
          <div class="font-mono text-[11px] space-y-0.5 flex-1 min-w-[220px]">
            ${kv('HUMIDITY', weather.observed.humidity)}${kv('WIND', weather.observed.wind)}${kv('VISIBILITY', weather.observed.visibility)}${kv('PRESSURE', weather.observed.pressure)}${kv('TIDE OF LARD', weather.observed.tideOfLard)}${kv('SUNSET', weather.observed.sunset)}
          </div>
        </div>
        <div class="font-headline text-xl uppercase text-black border-b-2 border-black pb-1 mb-2">SEVEN-CYCLE OUTLOOK</div>
        <table class="w-full font-mono text-[11px] border-collapse mb-4">
          <thead><tr class="bg-tabloidRed text-white uppercase text-[10px]"><th class="p-1 text-left border border-black">DAY</th><th class="p-1 border border-black">HIGH/LOW</th><th class="p-1 text-left border border-black">CONDITIONS</th><th class="p-1 border border-black">PRECIP</th><th class="p-1 text-left border border-black">ADVISORY</th></tr></thead>
          <tbody>${weather.forecast.map((f, i) => `<tr class="${i % 2 ? 'bg-white' : 'bg-neutral-100'}"><td class="p-1.5 border border-black font-bold">${esc(f.day)}</td><td class="p-1.5 border border-black text-center whitespace-nowrap">${esc(f.high)} / ${esc(f.low)}</td><td class="p-1.5 border border-black">${esc(f.condition)}</td><td class="p-1.5 border border-black text-center">${esc(f.precip)}</td><td class="p-1.5 border border-black text-gray-700">${esc(f.advisory)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">ALMANAC</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">${weather.almanac.map((a) => `<div class="bg-white border-2 border-black p-2 font-mono text-[10px]"><div class="text-gray-500 uppercase">${esc(a.phenomenon)}</div><div class="font-headline text-base text-tabloidRed">${esc(a.state)}</div><div class="mt-1">${esc(a.note)}</div></div>`).join('')}</div>
        ${weather.notes.map((n) => `<p class="font-bodyText text-xs text-gray-600 italic border-l-2 border-gray-400 pl-2 mb-1">${esc(n)}</p>`).join('')}`,
    };
    case 'markets': return {
      tag: 'THE SPLEEN EXCHANGE', title: 'MARKET BOARD — FULL SESSION', plainTitle: 'Spleen Exchange',
      body: `
        <div class="bg-black text-tabloidYellow font-mono text-[11px] px-2 py-1 mb-3 uppercase">${esc(markets.session)}</div>
        <table class="w-full font-mono text-[11px] border-collapse mb-4">
          <thead><tr class="bg-tabloidRed text-white uppercase text-[10px]"><th class="p-1 text-left border border-black">COMMODITY</th><th class="p-1 border border-black">MOVE</th><th class="p-1 text-left border border-black">UNIT</th><th class="p-1 text-left border border-black">DESK NOTE</th></tr></thead>
          <tbody>${markets.commodities.map((c, i) => `<tr class="${i % 2 ? 'bg-white' : 'bg-neutral-100'}"><td class="p-1.5 border border-black font-bold">${esc(c.symbol)}</td><td class="p-1.5 border border-black whitespace-nowrap">${esc(c.price)} ${TREND[c.trend] || ''}</td><td class="p-1.5 border border-black">${esc(c.unit)}</td><td class="p-1.5 border border-black text-gray-700">${esc(c.note)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">INDICES</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">${markets.indices.map((x) => `<div class="bg-white border-2 border-black p-2 font-mono text-[10px]"><div class="text-gray-500 uppercase leading-tight">${esc(x.name)}</div><div class="font-headline text-xl text-black">${esc(x.value)}</div><div>${esc(x.change)} ${TREND[x.trend] || ''}</div></div>`).join('')}</div>
        <p class="font-bodyText text-xs text-gray-700 italic mb-2">${esc(markets.hours)}</p>
        <p class="font-mono text-[9px] text-gray-500 leading-relaxed border-t border-black/20 pt-2">${esc(markets.disclaimer)}</p>`,
    };
    case 'warnings': return {
      tag: 'BUREAU OF WARNINGS', title: 'ACTIVE REGISTER', plainTitle: 'Warnings Register',
      body: `
        <div class="font-mono text-[10px] uppercase text-gray-500 mb-3">${esc(warnings.bureau)} · ${warnings.active.length} ACTIVE</div>
        <div class="space-y-2">
          ${warnings.active.map((w) => `
            <div class="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span class="font-mono text-[10px] font-bold ${w.severity.startsWith('RED') ? 'bg-tabloidRed text-white' : w.severity.startsWith('AMBER') ? 'bg-tabloidYellow text-black' : 'bg-black text-white'} px-1.5 py-0.5 uppercase">${esc(w.severity)}</span>
                <span class="font-mono text-[9px] text-gray-500">${esc(w.id)}</span>
              </div>
              <div class="font-headline text-base uppercase text-black leading-tight">${esc(w.headline)}</div>
              <div class="font-bodyText text-xs text-gray-700 mt-1"><strong class="font-mono text-[10px] uppercase text-tabloidRed">Guidance:</strong> ${esc(w.guidance)}</div>
              ${w.story ? `<button type="button" data-open-story="${esc(w.story)}" class="mt-1.5 font-mono text-[10px] font-bold text-tabloidRed uppercase underline hover:text-black">Read the dispatch →</button>` : ''}
            </div>`).join('')}
        </div>`,
    };
    case 'mandate': return {
      tag: 'INSTRUMENT IN FORCE', title: esc(mandate.title), plainTitle: mandate.title,
      body: `
        <div class="bg-tabloidRed text-white font-mono text-[11px] px-2 py-1 mb-3 uppercase flex justify-between"><span>${esc(mandate.status)}</span><span>#${esc(mandate.id)}</span></div>
        <p class="font-bodyText text-sm text-gray-800 italic mb-3">${esc(mandate.summary)}</p>
        <div class="font-mono text-[11px] bg-white border-2 border-black p-2 mb-4">${kv('ISSUED', mandate.issued)}${kv('ISSUER', mandate.issuer)}${kv('ENFORCEMENT', mandate.enforcement)}</div>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">CLAUSES</div>
        <ol class="space-y-1.5 font-bodyText text-sm mb-4">${mandate.clauses.map((c) => `<li class="bg-white border-l-4 border-tabloidRed p-2">${esc(c)}</li>`).join('')}</ol>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">LEGISLATIVE HISTORY</div>
        <div class="space-y-1 mb-4">${mandate.history.map((h) => `<div class="flex gap-2 font-mono text-[11px]"><span class="font-bold text-tabloidRed shrink-0">CYCLE ${esc(h.cycle)}</span><span>${esc(h.text)}</span></div>`).join('')}</div>
        <button type="button" data-open-story="${esc(mandate.story)}" class="bg-black hover:bg-tabloidRed text-white font-headline text-sm uppercase px-4 py-1.5 tracking-wider transition">READ THE RECEIPT DISPATCH →</button>`,
    };
    case 'almanac': return {
      tag: 'BASIN ALMANAC', title: `CYCLE ${esc(almanac.cycle)} — DOSSIER`, plainTitle: 'Basin Almanac',
      body: `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <div class="bg-black text-tabloidYellow border-2 border-black p-3 text-center"><div class="font-mono text-[10px] uppercase">Current cycle</div><div class="font-headline text-4xl">${esc(almanac.cycle)}</div><div class="font-mono text-[10px]">${esc(almanac.name)}</div></div>
          <div class="bg-tabloidYellow border-2 border-black p-3 text-center"><div class="font-mono text-[10px] uppercase">Tide</div><div class="font-headline text-2xl">${esc(almanac.tide)}</div></div>
          <div class="bg-white border-2 border-black p-3 text-center"><div class="font-mono text-[10px] uppercase">Moon</div><div class="font-headline text-2xl">${esc(almanac.moon)}</div></div>
        </div>
        <div class="space-y-1.5 mb-4">${almanac.curiosities.map((c) => `<p class="font-bodyText text-sm border-l-4 border-tabloidRed bg-white p-2">${esc(c)}</p>`).join('')}</div>
        <div class="font-mono text-[11px] text-gray-600 uppercase">Available editions: ${almanac.editions.map(esc).join(' · ')} (switch via the Edition selector, top of page)</div>`,
    };
    case 'bell': return {
      tag: 'THE BELFRY', title: esc(bell.name), plainTitle: 'Basin Bell',
      body: `
        <div class="text-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000] mb-4">
          <button type="button" data-action="toll" class="bg-tabloidRed hover:bg-black text-white font-headline text-2xl uppercase px-8 py-3 tracking-widest transition border-2 border-black animate-pulse hover:animate-none">
            <i class="fa-solid fa-bell"></i> TOLL THE BELL
          </button>
          <div class="font-mono text-xs mt-3">LOCAL TOLLS THIS LEDGER: <strong id="bellCount" class="text-tabloidRed text-base">${state.tolls}</strong> · ${esc(bell.tollsTo)}</div>
        </div>
        <div class="font-mono text-[11px] bg-white border-2 border-black p-2 mb-4">${kv('CAST', bell.cast)}${kv('WEIGHT', bell.weight)}</div>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">STANDING INSTRUCTIONS</div>
        <ul class="list-disc list-inside font-bodyText text-sm space-y-1 mb-4">${bell.instructions.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">DAILY TOLL SCHEDULE</div>
        <table class="w-full font-mono text-[11px] border-collapse mb-4"><tbody>${bell.schedule.map((s, i) => `<tr class="${i % 2 ? 'bg-white' : 'bg-neutral-100'}"><td class="p-1.5 border border-black font-bold w-28">${esc(s.time)}</td><td class="p-1.5 border border-black">${esc(s.event)}</td></tr>`).join('')}</tbody></table>
        <div id="bellLog" class="font-mono text-[10px] text-gray-600">${(state.tollLog || []).slice(-4).reverse().map((l) => `<div>TOLLED · ${esc(l.at)}</div>`).join('') || '<div>No tolls recorded in this browser yet. The bell is patient.</div>'}</div>`,
    };
    case 'polls': {
      const totals = pollTotals();
      return {
        tag: 'BASIN LEDGER #4', title: 'HOURLY CITIZEN VOTE — FULL RESULTS & ARCHIVE', plainTitle: 'Poll Archive',
        body: `
          <div class="bg-white border-2 border-black p-3 mb-4">
            <div class="font-headline text-base uppercase text-black mb-1">${esc(poll.question)}</div>
            <div class="font-mono text-[10px] text-gray-500 uppercase mb-2">${esc(poll.askedAt)} · ${fmt(totals.total)} SOVEREIGN VOTES CAST${state.pollVote ? ' · YOUR VOTE IS RECORDED' : ''}</div>
            ${pollOptionsHtml(totals, { readOnly: true })}
          </div>
          <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">PAST POLLS</div>
          <div class="space-y-2">
            ${poll.archive.map((p) => `
              <div class="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
                <div class="font-mono text-[10px] text-tabloidRed font-bold uppercase">CYCLE ${esc(p.cycle)}</div>
                <div class="font-headline text-sm uppercase text-black leading-tight mt-0.5">${esc(p.question)}</div>
                <div class="font-mono text-[11px] mt-1"><span class="bg-tabloidYellow border border-black px-1 font-bold">OUTCOME: ${esc(p.winner)}</span></div>
                <div class="font-bodyText text-xs text-gray-700 mt-1">${esc(p.result)}</div>
              </div>`).join('')}
          </div>`,
      };
    }
    case 'whispers': return {
      tag: 'THE SPITE FLUTE', title: `${whispers.count} WHISPERS OVERHEARD`, plainTitle: 'Whispers Overheard',
      body: `
        <div class="flex items-center gap-2 mb-3">
          <img src="${esc(authors['lady-hiss'].avatar)}" alt="Lady Hiss" class="w-10 h-10 rounded-full object-cover border-2 border-tabloidRed">
          <div class="font-mono text-[11px]">With <button type="button" data-open-feature="author-lady-hiss" class="font-bold text-tabloidRed underline uppercase hover:text-black">Lady Hiss, Countess of Damp</button> · filed by carrier snail</div>
        </div>
        <div class="flex flex-wrap gap-1 mb-3" id="whisperFilters">
          ${['ALL', ...whispers.categories].map((c, i) => `<button type="button" data-action="whisper-filter" data-cat="${esc(c)}" class="font-mono text-[10px] uppercase px-2 py-0.5 border-2 border-black ${i === 0 ? 'bg-tabloidYellow' : 'bg-white hover:bg-tabloidYellow'} transition">${esc(c)}</button>`).join('')}
        </div>
        <ol class="space-y-1.5" id="whisperList">
          ${whispers.items.map((w) => `
            <li data-whisper-desk="${esc(w.desk)}" class="bg-white border-2 border-black p-2 font-bodyText text-sm leading-snug shadow-[2px_2px_0px_#000]">
              <span class="font-mono text-[9px] font-bold text-tabloidRed uppercase mr-1">№${w.n} · ${esc(w.desk)}</span>${esc(w.text)}
            </li>`).join('')}
        </ol>`,
    };
    case 'horoscope': {
      const today = todaysSign();
      return {
        tag: 'DEPARTMENT OF DAMP', title: 'FULL CHART OF CALAMITY', plainTitle: 'Horoscope of Calamity',
        body: `
          <p class="font-bodyText text-xs italic text-gray-600 mb-3">${esc(horoscope.source)}</p>
          ${today ? `<div class="bg-tabloidYellow border-2 border-black p-2 font-mono text-[11px] font-bold uppercase mb-3">☉ Reading today under: ${esc(today.name)} (${esc(today.dates)})</div>` : ''}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${horoscope.signs.map((s) => `
              <details class="bg-white border-2 border-black shadow-[2px_2px_0px_#000]" ${today && s.name === today.name ? 'open' : ''}>
                <summary class="cursor-pointer p-2 flex items-center gap-2 hover:bg-tabloidYellow transition">
                  <span class="text-xl">${s.symbol}</span>
                  <span class="font-headline text-base uppercase text-black flex-1">${esc(s.name)}</span>
                  <span class="font-mono text-[9px] text-gray-500">${esc(s.dates)}</span>
                </summary>
                <div class="p-2.5 border-t-2 border-black font-mono text-[11px] space-y-1 bg-newsprint">
                  <div class="font-bodyText text-sm">${esc(s.reading)}</div>
                  ${kv('ELEMENT', s.element)}${kv('MOOD', s.mood)}${kv('NUMBERS', s.numbers)}${kv('WARNING', s.warning)}${kv('AFFINITY', s.affinity)}
                </div>
              </details>`).join('')}
          </div>`,
      };
    }
    case 'radio': return {
      tag: `${radio.station} ${radio.freq}`, title: 'STATION DOSSIER & FULL SCHEDULE', plainTitle: 'KYPO-FM Dossier',
      body: `
        <div class="bg-black text-white border-2 border-black p-3 mb-4 font-mono text-[11px]">
          <div class="text-tabloidYellow font-bold uppercase text-[10px] mb-1"><i class="fa-solid fa-radio text-tabloidRed"></i> Now transmitting</div>
          <div class="font-bodyText text-sm italic">"${esc(radio.nowPlaying.title)}" (Loop ${esc(radio.nowPlaying.loop)}) — since ${esc(radio.nowPlaying.since)}</div>
          <button type="button" data-action="radio-toggle" class="mt-2 bg-tabloidRed hover:bg-white hover:text-black text-white text-[10px] font-bold px-3 py-1 uppercase transition"><i class="fa-solid fa-play"></i> START / STOP THE DRONE</button>
        </div>
        <div class="font-headline text-lg uppercase text-black border-b-2 border-black pb-1 mb-2">SCHEDULE (ALL HOURS DAMP)</div>
        <table class="w-full font-mono text-[11px] border-collapse mb-4">
          <tbody>${radio.schedule.map((s, i) => `<tr class="${i % 2 ? 'bg-white' : 'bg-neutral-100'}"><td class="p-1.5 border border-black font-bold w-16">${esc(s.time)}</td><td class="p-1.5 border border-black"><strong class="uppercase">${esc(s.program)}</strong> <span class="text-gray-500">— ${esc(s.host)}</span><div class="text-gray-700 mt-0.5">${esc(s.desc)}</div></td></tr>`).join('')}</tbody>
        </table>
        <div class="font-mono text-[11px] bg-white border-2 border-black p-2 mb-2">${kv('TRANSMITTER', radio.transmitter)}</div>
        ${radio.technical.map((t) => `<p class="font-bodyText text-xs text-gray-600 italic border-l-2 border-gray-400 pl-2 mb-1">${esc(t)}</p>`).join('')}`,
    };
    case 'editions': return {
      tag: 'ARCHIVAL BASEMENTS', title: 'REGISTER OF SURVIVING EDITIONS', plainTitle: 'Edition Register',
      body: `
        <p class="font-bodyText text-sm italic text-gray-700 mb-3">${esc(editions.registerNote)}</p>
        <div class="space-y-2">
          ${editions.entries.map((ed) => `
            <button type="button" data-open-feature="${esc(ed.id)}" class="w-full text-left bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:border-tabloidRed transition">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-headline text-3xl text-tabloidRed leading-none">${esc(ed.year)}</span>
                <span class="font-mono text-[9px] text-gray-500 uppercase">${ed.contents.length} surviving items</span>
              </div>
              <div class="font-headline text-lg uppercase text-black leading-tight mt-1">${esc(ed.title)}</div>
              <div class="font-bodyText text-xs text-gray-700 mt-1">${esc(ed.summary)}</div>
            </button>`).join('')}
        </div>`,
    };
    case 'submissions': return {
      tag: 'THE TIP DESK', title: esc(submissions.desk), plainTitle: 'Submissions of Panic',
      body: `
        <p class="font-bodyText text-sm italic text-gray-700 mb-3">${esc(submissions.note)}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          ${submissions.types.map((t) => `
            <button type="button" data-open-feature="${esc(t.id)}" class="text-left bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:border-tabloidRed transition">
              <div class="font-headline text-base uppercase text-black leading-tight">${esc(t.label)}</div>
              <div class="font-bodyText text-xs text-gray-700 mt-1">${esc(t.blurb)}</div>
              <div class="font-mono text-[10px] text-tabloidRed font-bold uppercase mt-1.5">Open form →</div>
            </button>`).join('')}
        </div>
        ${state.slips.length ? `<div class="font-mono text-[10px] border-t border-black/20 pt-2"><div class="font-bold uppercase text-gray-600 mb-1">All slips retained in this browser (${state.slips.length})</div>${state.slips.slice(-6).reverse().map((s) => `<div>${esc(s.ref)} · ${esc(s.type.replace('submit-', '').toUpperCase())} · ${esc(s.at)}</div>`).join('')}</div>` : ''}`,
    };
    case 'cookie-hex': {
      const accepted = !!state.consent;
      return {
        tag: 'HEXAGONAL TERMS', title: esc(cookieHex.title), plainTitle: 'Occult Cookie Policy',
        body: `
          <p class="font-bodyText text-sm text-gray-800 italic border-l-4 border-tabloidRed pl-3 mb-3">${esc(cookieHex.summary)}</p>
          <ol class="space-y-1.5 font-bodyText text-sm mb-4">${cookieHex.clauses.map((c) => `<li class="bg-white border-l-4 border-black p-2">${esc(c)}</li>`).join('')}</ol>
          <div id="consentStatus" class="font-mono text-[11px] mb-3 ${accepted ? 'bg-cursedGreen text-white' : 'bg-neutral-200 text-gray-700'} border-2 border-black p-2">
            ${accepted ? `HEX ACCEPTED · SHADOW LEASED TO A FOUNDRY IN LEEDS · ${esc(state.consent)}` : 'STATUS: NO CONVERGENCE RECORDED IN THIS BROWSER. Your shadow remains flat, for now.'}
          </div>
          <div class="flex flex-wrap gap-2">
            ${accepted
              ? `<button type="button" data-action="consent-withdraw" class="bg-black hover:bg-tabloidRed text-white font-headline text-sm uppercase px-4 py-1.5 tracking-wider transition">WITHDRAW CONSENT (CLAUSE IV)</button>`
              : `<button type="button" data-action="consent-accept" class="bg-tabloidRed hover:bg-black text-white font-headline text-sm uppercase px-4 py-1.5 tracking-wider transition">ACCEPT HEXAGONAL TERMS</button>`}
          </div>`,
      };
    }
    default: return null;
  }
}

/* ---------------------------------------------------------------------------
 * Form field renderer (ads + submissions share it)
 * ------------------------------------------------------------------------- */
function renderField(f) {
  const req = f.required ? 'required' : '';
  const cls = 'p-1.5 border border-black text-xs font-mono bg-white focus:bg-yellow-50 focus:outline-none w-full';
  let control;
  if (f.type === 'select') {
    control = `<select name="${esc(f.name)}" ${req} class="${cls}">${f.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    control = `<textarea name="${esc(f.name)}" ${req} rows="2" placeholder="${esc(f.placeholder || '')}" class="${cls}"></textarea>`;
  } else {
    control = `<input name="${esc(f.name)}" ${req} type="text" placeholder="${esc(f.placeholder || '')}" class="${cls}">`;
  }
  return `<label class="block"><span class="font-mono text-[10px] font-bold uppercase text-gray-700">${esc(f.label)}${f.required ? ' *' : ''}</span>${control}</label>`;
}

/* Form submissions → structured receipts ---------------------------------- */
function handleFormSubmit(form) {
  const kind = form.dataset.form;
  const id = form.dataset.formId;
  const receiptBox = $('[data-receipt]', form.parentElement) || $('[data-receipt]');
  if (kind === 'submission') {
    const t = submissions.types.find((x) => x.id === id);
    const slip = { ref: ref('SLIP'), type: id, at: nowStamp() };
    state.slips.push(slip); saveState();
    if (receiptBox) {
      receiptBox.classList.remove('hidden');
      receiptBox.innerHTML = `<div class="bg-cursedGreen text-white border-2 border-black p-3 font-mono text-xs shadow-[3px_3px_0px_#000]">
        <div class="font-headline text-base uppercase mb-1"><i class="fa-solid fa-receipt"></i> ${esc(t.label)} — RECEIPTED</div>
        <div>${esc(t.receipt)}</div>
        <div class="mt-2 bg-black/30 px-2 py-1 inline-block font-bold">SLIP ${esc(slip.ref)} · ${esc(slip.at)}</div>
      </div>`;
    }
    toast('SUBMISSION RECEIPTED', `Filed under ${t.label}. Slip ${slip.ref} retained in this browser.`, 'green');
    form.reset();
  } else if (kind === 'ad') {
    const ad = ads[id];
    const tierId = form.querySelector('input[name="tier"]:checked')?.value;
    const tier = ad.tiers.find((x) => x.id === tierId) || ad.tiers[0];
    const order = { ref: ref(id === 'syrup' ? 'FLAGON' : 'GRANDF'), product: id, tier: tier.label, at: nowStamp() };
    state.orders.push(order); saveState();
    if (receiptBox) {
      receiptBox.classList.remove('hidden');
      receiptBox.innerHTML = `<div class="bg-black text-tabloidYellow border-2 border-black p-3 font-mono text-xs shadow-[3px_3px_0px_#d0021b]">
        <div class="font-headline text-base uppercase mb-1 text-white"><i class="fa-solid fa-stamp"></i> PETITION GRANTED — ${esc(ad.name)}</div>
        <div>${esc(ad.receipt)}</div>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="bg-tabloidRed text-white px-2 py-0.5 font-bold">ORDER ${esc(order.ref)}</span>
          <span class="bg-tabloidYellow text-black px-2 py-0.5 font-bold">${esc(tier.label)} · ${esc(String(tier.price))} ${esc(tier.unit)}</span>
          <span class="bg-white text-black px-2 py-0.5 font-bold">${esc(order.at)}</span>
        </div>
      </div>`;
    }
    toast('DISPENSATION GRANTED', `${ad.name}: ${tier.label}. Order ${order.ref} logged in this browser.`, 'yellow');
    form.reset();
  }
}

/* ---------------------------------------------------------------------------
 * DESKS — nav filtering + desk masthead banner
 * ------------------------------------------------------------------------- */
function applyDesk(deskId, { push = true } = {}) {
  currentDesk = deskId;
  const desk = getDesk(deskId);

  // Nav active states
  $$('.cat-btn[data-desk]').forEach((btn) => {
    const active = btn.dataset.desk === deskId;
    btn.classList.toggle('bg-tabloidRed', active && deskId === 'all');
    btn.classList.toggle('bg-tabloidYellow', active && deskId !== 'all');
    btn.classList.toggle('text-black', active && deskId !== 'all');
    btn.classList.toggle('text-white', !active || deskId === 'all');
    btn.classList.toggle('font-bold', active);
  });

  // Feed visibility
  let visible = 0;
  $$('.feed-item').forEach((item) => {
    const show = deskId === 'all' || item.dataset.category === deskId;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Desk masthead banner
  const banner = $('#deskBanner');
  if (banner) {
    if (desk) {
      const editor = getAuthor(desk.editor);
      banner.classList.remove('hidden');
      $('#deskName').textContent = desk.name;
      $('#deskMotto').textContent = `“${desk.motto}”`;
      $('#deskAbout').textContent = desk.about;
      $('#deskEditorBtn').innerHTML = `DESK EDITOR: <span class="underline decoration-dotted">${esc(editor ? editor.name : desk.editor)}</span> <i class="fa-solid fa-id-card text-[9px]"></i>`;
      $('#deskEditorBtn').dataset.openFeature = `author-${desk.editor}`;
      $('#deskCount').textContent = `${visible} DISPATCH${visible === 1 ? '' : 'ES'} FILED THIS CYCLE`;
    } else {
      banner.classList.add('hidden');
    }
  }

  // Empty-feed notice
  const empty = $('#feedEmpty');
  if (empty) empty.classList.toggle('hidden', visible > 0);

  // Clear any search state when switching desks deliberately
  if (push) {
    const input = $('#searchInput');
    if (input) input.value = '';
    $('#searchResults')?.classList.add('hidden');
  } else if ($('#searchInput')?.value.trim()) {
    // Back/forward navigation restored a desk while a query is active:
    // re-apply the combined desk+query filter so feed and dropdown agree.
    searchArticles();
  }
  if (push) goto({ desk: deskId === 'all' ? null : deskId });
}
function filterFeed(deskId) { applyDesk(deskId, { push: true }); }

/* ---------------------------------------------------------------------------
 * SEARCH — live feed filter + whole-newsroom dropdown
 * ------------------------------------------------------------------------- */
let searchIndex = null;
function buildSearchIndex() {
  const idx = [];
  const strip = (html) => html.replace(/<[^>]*>/g, ' ');
  for (const [key, s] of Object.entries(stories)) {
    idx.push({ type: 'DISPATCH', kind: 'story', key, title: s.title, sub: `${s.tag} · ${getDesk(s.desk)?.name || s.desk} · ${s.dateline}`, text: `${s.title} ${s.subhead} ${strip(s.body)} ${(s.tags || []).join(' ')} ${getAuthor(s.authorId)?.name || ''}`.toLowerCase() });
  }
  for (const [id, a] of Object.entries(authors)) {
    idx.push({ type: 'PERSONNEL', kind: 'feature', key: `author-${id}`, title: a.name, sub: `${a.role} · ${getDesk(a.desk)?.name || a.desk}`, text: `${a.name} ${a.role} ${a.beat} ${a.bio} ${a.quirks.join(' ')}`.toLowerCase() });
  }
  for (const d of desks) {
    idx.push({ type: 'DESK', kind: 'desk', key: d.id, title: d.name, sub: d.motto, text: `${d.name} ${d.short} ${d.motto} ${d.about}`.toLowerCase() });
  }
  for (const ed of editions.entries) {
    idx.push({ type: 'EDITION', kind: 'feature', key: ed.id, title: `Edition ${ed.year}: ${ed.title}`, sub: ed.headline, text: `${ed.year} ${ed.title} ${ed.headline} ${ed.summary} ${ed.contents.map((c) => c.headline + ' ' + c.text).join(' ')}`.toLowerCase() });
  }
  for (const w of whispers.items) {
    idx.push({ type: 'WHISPER', kind: 'feature', key: 'whispers', title: `Whisper №${w.n}`, sub: w.text.slice(0, 90) + (w.text.length > 90 ? '…' : ''), text: `whisper ${w.desk} ${w.text}`.toLowerCase() });
  }
  for (const s of horoscope.signs) {
    idx.push({ type: 'HOROSCOPE', kind: 'feature', key: 'horoscope', title: `${s.name} (${s.dates})`, sub: s.reading.slice(0, 90) + '…', text: `horoscope sign ${s.name} ${s.dates} ${s.element} ${s.reading} ${s.warning} ${s.affinity}`.toLowerCase() });
  }
  // Hand-authored current editorial pages (registered in src/data/editorialPages.js)
  for (const e of editorialPages) {
    idx.push({ type: 'FEATURE PAGE', kind: 'external', key: e.canonicalPath, title: e.title.replace(/\s*\|\s*KYPO6$/, ''), sub: e.description.slice(0, 110) + '…', text: `${e.title} ${e.description} dispatch satire feature`.toLowerCase() });
  }
  const services = [
    ['weather', 'WEATHER', 'Basin Meteorological Office — Tulsa Annex', 'weather forecast tulsa oily mist humidity tide lard seven cycle barometer'],
    ['markets', 'MARKETS', 'The Spleen Exchange — full market board', 'markets spleen exchange pork bone mud lard dripping turnip futures indices guineas'],
    ['warnings', 'WARNINGS', 'Bureau of Warnings — active register', 'warnings bureau register second drawer amber red advisory mandate'],
    ['mandate', 'MANDATE', 'Mandate #409-B — conduct of Tuesday paper', 'mandate 409-b receipt tuesday fold paper conduct court marrow'],
    ['almanac', 'ALMANAC', 'Cycle dossier — tides, moon, curiosities', 'almanac cycle 91,204 tide lard moon waning gravy'],
    ['bell', 'BELL', 'The Basin Bell — belfry panel, audible toll', 'bell belfry toll basin st luke mayor breakfast tea elbow'],
    ['polls', 'POLLS', 'Hourly Citizen Vote — results and archive', 'poll vote mirror tap water mutton dripping brick ledger'],
    ['whispers', 'GOSSIP', 'The Spite Flute — 34 whispers overheard', 'whispers gossip spite flute lady hiss otter passport'],
    ['horoscope', 'HOROSCOPE', 'Horoscope of Calamity — full chart, 12 signs', 'horoscope signs taurus virgo pisces calamity brick flannel vinegar puddles'],
    ['radio', 'RADIO', 'KYPO-FM 40.2 — station dossier and schedule', 'radio kypo-fm turnip drone schedule mirror hours static'],
    ['editions', 'EDITIONS', 'Archival Basements — register of surviving editions', 'editions archival basements 1904 1933 1968 2011 turnip panic letter m gills cistern boiled wool'],
    ['submissions', 'SUBMISSIONS', 'Submissions of Panic — the tip desk (4 forms)', 'submissions tip desk confess ceiling bone complaints aunt porridge owl slip'],
    ['ad-grandfather', 'ADVERTISEMENT', 'Rent a Chilled Grandfather — order desk', 'grandfather rent vestibule peat guineas nod'],
    ['ad-syrup', 'ADVERTISEMENT', 'Dr. Vandermeer’s Liquid Asbestos Syrup — order desk', 'syrup asbestos vandermeer bones loud flagon oilskins'],
    ['cookie-hex', 'POLICY', 'Occult Cookie Policy — the hexagonal terms', 'cookie policy hex sigils cod melancholy shadow foundry leeds consent'],
  ];
  for (const [key, type, title, text] of services) {
    idx.push({ type, kind: 'feature', key, title, sub: title, text: `${title} ${text}`.toLowerCase() });
  }
  return idx;
}
function searchAll(q) {
  if (!searchIndex) searchIndex = buildSearchIndex();
  const query = q.toLowerCase().trim();
  if (!query) return [];
  const terms = query.split(/\s+/);
  const scored = [];
  for (const entry of searchIndex) {
    let score = 0;
    const title = entry.title.toLowerCase();
    for (const t of terms) {
      if (title.includes(t)) score += 10;
      if (entry.sub && entry.sub.toLowerCase().includes(t)) score += 4;
      if (entry.text.includes(t)) score += 2;
    }
    if (score >= 2 * terms.length) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  // de-duplicate repeated feature targets (e.g. many whispers → one panel)
  const seen = new Set(); const out = [];
  for (const s of scored) {
    const dedupe = s.entry.kind === 'feature' && s.entry.type === 'WHISPER' ? 'whispers' : s.entry.key;
    if (seen.has(dedupe) && s.entry.type === 'WHISPER') continue;
    seen.add(dedupe); out.push(s.entry);
    if (out.length >= 9) break;
  }
  return out;
}
function searchArticles() {
  const input = $('#searchInput');
  const q = (input?.value || '').toLowerCase().trim();
  const dropdown = $('#searchResults');

  // 1) live feed filter (front-page cards)
  let visible = 0;
  $$('.feed-item').forEach((item) => {
    const matchesDesk = currentDesk === 'all' || item.dataset.category === currentDesk;
    const matchesQuery = !q || item.innerText.toLowerCase().includes(q);
    const show = matchesDesk && matchesQuery;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = $('#feedEmpty');
  if (empty && !activeStoryKey && !activeFeatureId) {
    empty.classList.toggle('hidden', visible > 0);
    if (visible === 0 && q) $('#feedEmptyText').textContent = `NO DISPATCH MATCHES “${q.toUpperCase()}” ON THIS DESK. Try the whole-newsroom results above, or the archive register.`;
    else if (visible === 0) $('#feedEmptyText').textContent = 'NO DISPATCHES FILED ON THIS DESK THIS CYCLE.';
  }

  // 2) whole-newsroom dropdown
  if (!dropdown) return;
  if (!q) { dropdown.classList.add('hidden'); return; }
  const results = searchAll(q);
  dropdown.innerHTML = results.length
    ? results.map((r) => {
        const inner = `
          <span class="font-mono text-[9px] font-bold text-tabloidRed uppercase">${esc(r.type)}</span>
          <span class="block font-headline text-xs uppercase text-black leading-tight">${esc(r.title.slice(0, 110))}</span>
          <span class="block font-mono text-[10px] text-gray-500 truncate">${esc(r.sub || '')}</span>`;
        const cls = 'w-full text-left px-2.5 py-1.5 border-b border-gray-300 hover:bg-tabloidYellow transition block';
        if (r.kind === 'external') return `<a href="${esc(r.key)}" class="${cls}">${inner}</a>`;
        const attrs = r.kind === 'story' ? `data-open-story="${esc(r.key)}"` : r.kind === 'desk' ? `data-desk="${esc(r.key)}"` : `data-open-feature="${esc(r.key)}"`;
        return `<button type="button" ${attrs} class="${cls}">${inner}</button>`;
      }).join('') + `<a href="/archive/?q=${encodeURIComponent(q)}" class="block px-2.5 py-1.5 bg-black text-tabloidYellow font-mono text-[10px] uppercase font-bold hover:bg-tabloidRed hover:text-white transition">Search the 2016 archive register for “${esc(q)}” →</a>`
    : `<div class="px-2.5 py-2 font-mono text-[11px] text-gray-600">Nothing in the newsroom matches.</div>
       <a href="/archive/?q=${encodeURIComponent(q)}" class="block px-2.5 py-1.5 bg-black text-tabloidYellow font-mono text-[10px] uppercase font-bold hover:bg-tabloidRed hover:text-white transition">Search the 2016 archive register for “${esc(q)}” →</a>`;
  dropdown.classList.remove('hidden');
}

/* ---------------------------------------------------------------------------
 * POLL — structured tallies, bars, one vote per browser
 * ------------------------------------------------------------------------- */
function pollTotals() {
  const counts = poll.options.map((o) => o.votes + (state.pollVote && state.pollVote.option === o.id ? 1 : 0));
  return { counts, total: counts.reduce((a, b) => a + b, 0) };
}
function pollOptionsHtml({ counts, total }, { readOnly = false } = {}) {
  return poll.options.map((o, i) => {
    const p = pct(counts[i], total);
    const voted = state.pollVote && state.pollVote.option === o.id;
    return `
      <div class="relative">
        <button type="button" ${readOnly || state.pollVote ? 'disabled' : ''} data-action="vote" data-vote-id="${o.id}"
          class="w-full text-left p-1.5 border border-gray-400 ${state.pollVote ? (voted ? 'bg-tabloidYellow' : 'bg-neutral-100') : 'hover:bg-tabloidYellow'} transition flex justify-between items-center gap-2 font-mono text-xs ${state.pollVote ? 'cursor-default' : ''}">
          <span>${esc(o.letter)}) ${esc(o.text)}${voted ? ' <span class="text-cursedGreen font-bold">(YOUR VOTE)</span>' : ''}</span>
          <span class="font-bold text-tabloidRed whitespace-nowrap" id="poll-v${o.id}">${p}%</span>
        </button>
        <div class="h-1.5 bg-neutral-200 border border-gray-400 border-t-0 overflow-hidden">
          <div class="h-full ${voted ? 'bg-cursedGreen' : 'bg-tabloidRed'} transition-all duration-700" style="width:${p}%"></div>
        </div>
        <div class="font-mono text-[9px] text-gray-500 text-right">${fmt(counts[i])} votes</div>
      </div>`;
  }).join('');
}
function renderPoll() {
  const box = $('#pollOptions');
  if (!box) return;
  const totals = pollTotals();
  box.innerHTML = pollOptionsHtml(totals);
  const q = $('#pollQuestion'); if (q) q.textContent = poll.question;
  const t = $('#pollTotal'); if (t) t.textContent = `${fmt(totals.total)} SOVEREIGN VOTES CAST`;
  const msg = $('#pollMessage');
  if (msg) msg.classList.toggle('hidden', !state.pollVote);
}
function votePoll(optionId) {
  if (state.pollVote) {
    toast('VOTE ALREADY CAST', 'You have exhausted your sovereign spiritual vote for this moon phase. Past polls remain open for inspection.', 'red');
    return;
  }
  state.pollVote = { option: Number(optionId), at: nowStamp() };
  saveState();
  renderPoll();
  toast('VOTE RECORDED', `Entered in ${poll.ledger} against cycle ${almanac.cycle}. The mirror thanks you, thirstily.`, 'green');
}

/* ---------------------------------------------------------------------------
 * SIDEBAR WIDGETS — horoscope rail, radio schedule + drone, ticker
 * ------------------------------------------------------------------------- */
function todaysSign() {
  const now = new Date();
  const byMonth = [
    [20, 'CAPRICORN', 'AQUARIUS'], [19, 'AQUARIUS', 'PISCES'], [21, 'PISCES', 'ARIES'],
    [20, 'ARIES', 'TAURUS'], [21, 'TAURUS', 'GEMINI'], [21, 'GEMINI', 'CANCER'],
    [22, 'CANCER', 'LEO'], [23, 'LEO', 'VIRGO'], [23, 'VIRGO', 'LIBRA'],
    [23, 'LIBRA', 'SCORPIO'], [22, 'SCORPIO', 'SAGITTARIUS'], [22, 'SAGITTARIUS', 'CAPRICORN'],
  ];
  const [cut, before, after] = byMonth[now.getMonth()];
  const name = now.getDate() < cut ? before : after;
  return horoscope.signs.find((s) => s.name === name) || null;
}
function renderHoroscopeRail() {
  const rail = $('#horoscopeRail');
  const detail = $('#horoscopeDetail');
  if (!rail || !detail) return;
  const today = todaysSign();
  rail.innerHTML = horoscope.signs.map((s) => `
    <button type="button" data-action="horo-sign" data-sign="${esc(s.name)}"
      class="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-neutral-600 hover:bg-tabloidYellow hover:text-black transition ${today && s.name === today.name ? 'bg-tabloidYellow text-black font-bold' : 'text-gray-300'}">
      ${s.symbol} ${esc(s.name.slice(0, 3))}
    </button>`).join('');
  showHoroSign(today ? today.name : horoscope.signs[0].name);
}
function showHoroSign(name) {
  const s = horoscope.signs.find((x) => x.name === name);
  const detail = $('#horoscopeDetail');
  if (!s || !detail) return;
  $$('#horoscopeRail button').forEach((b) => {
    const on = b.dataset.sign === s.name;
    b.classList.toggle('bg-tabloidYellow', on);
    b.classList.toggle('text-black', on);
    b.classList.toggle('font-bold', on);
    b.classList.toggle('text-gray-300', !on);
  });
  detail.innerHTML = `
    <div class="border-b border-neutral-700 pb-1 mb-1">
      <strong class="text-tabloidYellow font-mono text-xs uppercase">${s.symbol} ${esc(s.name)} (${esc(s.dates)})</strong>
      <span class="text-gray-500 font-mono text-[9px] uppercase"> · ${esc(s.element)}</span>
    </div>
    <p class="text-gray-300 font-bodyText text-xs leading-snug">${esc(s.reading)}</p>
    <div class="font-mono text-[9px] text-gray-400 mt-1">MOOD: <span class="text-tabloidYellow">${esc(s.mood)}</span> · NUMBERS: <span class="text-tabloidYellow">${esc(s.numbers)}</span></div>
    <div class="font-mono text-[9px] text-red-400 mt-0.5">⚠ ${esc(s.warning)}</div>`;
}

let radioPlaying = false;
let radioAudioContext = null;
let radioInterval = null;
function toggleRadio() {
  const btnLabel = $('#radioLabel');
  const btnIcon = $('#radioIcon');
  const bar = $('#radioBar');
  if (!radioPlaying) {
    radioPlaying = true;
    if (btnLabel) btnLabel.textContent = 'Mute Drone';
    if (btnIcon) btnIcon.className = 'fa-solid fa-volume-high';
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      radioAudioContext = new AudioContext();
      const osc1 = radioAudioContext.createOscillator();
      const osc2 = radioAudioContext.createOscillator();
      const gain = radioAudioContext.createGain();
      osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(65.4, radioAudioContext.currentTime);
      osc2.type = 'sine'; osc2.frequency.setValueAtTime(130.8, radioAudioContext.currentTime);
      gain.gain.setValueAtTime(0.04, radioAudioContext.currentTime);
      osc1.connect(gain); osc2.connect(gain); gain.connect(radioAudioContext.destination);
      osc1.start(); osc2.start();
    } catch { /* audio unavailable */ }
    let width = 10;
    radioInterval = setInterval(() => { width = (width + 12) % 100; if (bar) bar.style.width = width + '%'; }, 400);
    toast('KYPO-FM 40.2', 'The drone is synthesized locally in your browser. Nothing is transmitted; the turnip is never clean.', 'yellow');
  } else {
    radioPlaying = false;
    if (btnLabel) btnLabel.textContent = 'Listen';
    if (btnIcon) btnIcon.className = 'fa-solid fa-play';
    if (bar) bar.style.width = '0%';
    clearInterval(radioInterval);
    if (radioAudioContext) { try { radioAudioContext.close(); } catch { /* fine */ } radioAudioContext = null; }
  }
}
function renderRadioSchedule() {
  const box = $('#radioSchedule');
  if (!box) return;
  box.innerHTML = `<div class="font-bold text-black uppercase text-[9px] mb-0.5">Next on ${esc(radio.station)}:</div>` +
    radio.schedule.slice(1, 4).map((s) => `
      <button type="button" data-action="radio-program" data-program="${esc(s.program)}" class="w-full text-left hover:text-tabloidRed transition flex gap-1.5">
        <span class="text-tabloidRed font-bold shrink-0">${esc(s.time)}</span><span class="truncate">${esc(s.program)}</span>
      </button>`).join('') +
    `<a href="/?feature=radio" class="block text-tabloidRed font-bold uppercase hover:underline mt-0.5">Station dossier & full schedule →</a>`;
}

function renderTicker() {
  const track = $('#tickerTrack');
  if (!track) return;
  const sep = '<span class="mx-2 text-gray-600">✦</span>';
  // One seamless loop: build a single run (trailing separator included), then
  // duplicate it exactly, so the -50% marquee translate wraps without a jump.
  const run = ticker.map((t) => `
    <a href="/?story=${esc(t.story)}" title="Read the full dispatch" class="mx-4 ${t.tone === 'red' ? 'text-tabloidRed' : 'text-black'} hover:underline uppercase">◆ ${esc(t.text)} ◆</a>`).join(sep) + sep;
  track.innerHTML = run + run;
}

/* ---------------------------------------------------------------------------
 * BELL — audible toll (Web Audio), local ledger
 * ------------------------------------------------------------------------- */
function tollBell() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const partials = [
      { f: 440, g: 0.22 }, { f: 663, g: 0.12 }, { f: 884, g: 0.08 }, { f: 1320, g: 0.04 },
    ];
    for (const p of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(p.f, ctx.currentTime);
      gain.gain.setValueAtTime(p.g, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 2.4);
    }
    setTimeout(() => { try { ctx.close(); } catch { /* fine */ } }, 2600);
  } catch { /* audio unavailable */ }
  state.tolls += 1;
  state.tollLog = (state.tollLog || []).concat([{ at: nowStamp() }]).slice(-8);
  saveState();
  const count = $('#bellCount'); if (count) count.textContent = state.tolls;
  const log = $('#bellLog');
  if (log) log.innerHTML = state.tollLog.slice(-4).reverse().map((l) => `<div>TOLLED · ${esc(l.at)}</div>`).join('');
  toast('DING! DONG!', 'The Basin Bell has tolled. All citizens must submerge their left elbow in tea until the Mayor completes his breakfast.', 'red');
}

/* ---------------------------------------------------------------------------
 * EDITIONS SWITCHER (moisture / 1977 microfiche) — toasts, not alerts
 * ------------------------------------------------------------------------- */
function switchEdition(edition) {
  document.body.classList.remove('moisture-mode', 'archival-1977');
  if (edition === 'moisture') {
    document.body.classList.add('moisture-mode');
    toast('MOISTURE MODE ACTIVATED', 'Screen moisture levels set to maximum. Beware of condensation forming around your ankles.', 'green');
  } else if (edition === 'archival') {
    document.body.classList.add('archival-1977');
    toast('ARCHIVE RETRIEVAL (1977)', 'Loading salt-cured microfiche from the under-cellar. Everything reads sepia and slightly resigned.', 'yellow');
  } else {
    toast('STANDARD AGITATION RESTORED', 'Cycle ' + almanac.cycle + '. Tide of lard: high. Agitation: hourly.', 'ink');
  }
}

/* ---------------------------------------------------------------------------
 * CONSENT (occult cookie policy)
 * ------------------------------------------------------------------------- */
function acceptConsent() {
  state.consent = nowStamp(); saveState();
  refreshConsentUI();
  toast('CONVERGENCE CONFIRMED', 'Your shadow has been leased to a foundry in Leeds. Consent stored locally, per Clause III.', 'red');
  showFeatureModal('cookie-hex'); // re-render panel with accepted state
}
function withdrawConsent() {
  state.consent = null; saveState();
  refreshConsentUI();
  toast('CONSENT WITHDRAWN', 'The foundry has been notified and will stop writing. Your shadow remains warmer and slightly heavier.', 'green');
  showFeatureModal('cookie-hex');
}
function refreshConsentUI() {
  const btn = $('#cookieConsentBtn');
  if (btn) btn.textContent = state.consent ? 'HEX ACCEPTED · SHADOW LEASED' : 'Accept Hexagonal Terms';
}

/* ---------------------------------------------------------------------------
 * GLOBAL EVENT DELEGATION — anchors, cards, buttons, forms
 * ------------------------------------------------------------------------- */
document.addEventListener('click', (e) => {
  // 1) real anchors into the deep-link space
  const anchor = e.target.closest('a[href^="/?"]');
  if (anchor) {
    e.preventDefault();
    $('#searchResults')?.classList.add('hidden');
    const p = new URLSearchParams(anchor.getAttribute('href').slice(2));
    goto({ story: p.get('story'), desk: p.get('desk') || (currentDesk !== 'all' ? currentDesk : null), feature: p.get('feature') });
    return;
  }
  // 2) nearest interactive element wins (an author button inside a story card
  //    must open the dossier, not the card's story)
  const hit = e.target.closest('[data-open-story],[data-open-feature],[data-desk],[data-action]');
  if (hit && hit.dataset.openStory) { $('#searchResults')?.classList.add('hidden'); openStory(hit.dataset.openStory); return; }
  if (hit && hit.dataset.openFeature) { $('#searchResults')?.classList.add('hidden'); openFeature(hit.dataset.openFeature); return; }
  if (hit && hit.dataset.desk) { $('#searchResults')?.classList.add('hidden'); filterFeed(hit.dataset.desk); return; }
  const actionEl = hit;
  if (actionEl) {
    const a = actionEl.dataset.action;
    if (a === 'vote') votePoll(actionEl.dataset.voteId);
    else if (a === 'toll') tollBell();
    else if (a === 'horo-sign') showHoroSign(actionEl.dataset.sign);
    else if (a === 'radio-toggle') toggleRadio();
    else if (a === 'radio-program') {
      if (!radioPlaying) toggleRadio();
      toast('RETUNED', `The valve transmitter acknowledges “${actionEl.dataset.program}”. The static is filling in, greedily.`, 'yellow');
    }
    else if (a === 'copy-link') copyPermalink();
    else if (a === 'telepathy') shareTelepathy();
    else if (a === 'author') showAuthor(actionEl.dataset.authorId);
    else if (a === 'consent-accept') acceptConsent();
    else if (a === 'consent-withdraw') withdrawConsent();
    else if (a === 'tag-search') {
      const input = $('#searchInput');
      closeStory();
      if (input) { input.value = actionEl.dataset.tag; searchArticles(); input.focus(); }
      toast('FILED UNDER', `The front page now shows everything tagged “${actionEl.dataset.tag.toUpperCase()}”.`, 'ink');
    }
    else if (a === 'whisper-filter') {
      const cat = actionEl.dataset.cat;
      $$('#whisperFilters button').forEach((b) => {
        const on = b.dataset.cat === cat;
        b.classList.toggle('bg-tabloidYellow', on);
        b.classList.toggle('bg-white', !on);
      });
      $$('#whisperList li').forEach((li) => {
        li.style.display = (cat === 'ALL' || li.dataset.whisperDesk === cat) ? '' : 'none';
      });
    }
    return;
  }
  // 6) dismiss search dropdown when clicking elsewhere
  if (!e.target.closest('#searchResults') && !e.target.closest('#searchInput')) $('#searchResults')?.classList.add('hidden');
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  if (form.dataset.form === 'comment') { submitComment(e); return; }
  handleFormSubmit(form);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (activeFeatureId) closeFeature();
    else if (activeStoryKey) closeStory();
    $('#searchResults')?.classList.add('hidden');
  }
});

/* ---------------------------------------------------------------------------
 * INIT
 * ------------------------------------------------------------------------- */
function init() {
  loadState();
  renderTicker();
  renderPoll();
  renderHoroscopeRail();
  renderRadioSchedule();
  refreshConsentUI();

  // Flash strip + mandate strip content from the registry (keeps HTML and data in sync)
  const flashText = $('#flashText');
  if (flashText) flashText.textContent = flash.text;
  const stripText = $('#stripText');
  if (stripText) stripText.textContent = dispatchStrip.text;
  const stripLabel = $('#stripLabel');
  if (stripLabel) stripLabel.textContent = dispatchStrip.label;

  // Search box: Enter opens the best result
  const input = $('#searchInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const results = searchAll(input.value);
        const first = results[0];
        if (first) {
          if (first.kind === 'story') openStory(first.key);
          else if (first.kind === 'desk') filterFeed(first.key);
          else if (first.kind === 'external') location.href = first.key;
          else openFeature(first.key);
        } else if (input.value.trim()) {
          location.href = `/archive/?q=${encodeURIComponent(input.value.trim())}`;
        }
        $('#searchResults')?.classList.add('hidden');
      }
      if (e.key === 'Escape') { input.value = ''; searchArticles(); $('#searchResults')?.classList.add('hidden'); }
    });
  }

  // Honor deep links on arrival
  applyParams();

  // Expose the newsroom for ARG hooks / console archaeology (window.KYPO6 is
  // shared with the arrival beacon from src/lib/frontPage.js)
  window.KYPO6 = Object.assign(window.KYPO6 || {}, {
    newsroom: { state, stories, desks, authors, openStory, openFeature, filterFeed, searchAll },
  });
}

// Globals for the few inline handlers retained in index.html
window.openStory = openStory;
window.closeStory = closeStory;
window.openFeature = openFeature;
window.closeFeature = closeFeature;
window.openAuthor = showAuthor;
window.filterFeed = filterFeed;
window.searchArticles = searchArticles;
window.votePoll = votePoll;
window.toggleRadio = toggleRadio;
window.triggerAlarm = () => openFeature('bell');
window.switchEdition = switchEdition;
window.submitComment = submitComment;
window.shareTelepathy = shareTelepathy;
window.orderSyrup = () => openFeature('ad-syrup');
window.rentGrandfather = () => openFeature('ad-grandfather');
window.toast = toast;

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
