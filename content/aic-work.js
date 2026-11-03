/* AI Compliance study area: Assessment guides, Case studies, Knowledge checks, Library, What's changing, Glossary.
   Study only — nothing to fill in. Progress (what has been read, check scores) is stored with the
   academy progress (users/{uid}/grcProgress/{key}) through ctx.save, so no new Firestore rules are needed.
   Keys: gd-<guide>  cs-<case>  kc-<area>  lib  */
import { TOOLKIT } from './aic-toolkit.js';
import { CASES } from './aic-cases.js';
import { CHECK_AREAS, CHECK_EXTRA } from './aic-checks.js';
import { LIBRARY, WATCH, AI_GLOSSARY, AIC_VERIFIED, AIC_NEXT_REVIEW } from './aic-library.js';

export const AIC_WORK_V = '45';
let C = null;                       // ctx from index.html
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const st = () => C.state();
const fmtD = iso => { if (!iso) return ''; const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); return isNaN(d) ? iso : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); };
const blocks = bs => (bs || []).map(b => b.k === 'p' ? `<p>${md(b.x)}</p>` : b.k === 'ul' ? `<ul>${b.x.map(i => `<li>${md(i)}</li>`).join('')}</ul>` : b.k === 'ol' ? `<ol>${b.x.map(i => `<li>${md(i)}</li>`).join('')}</ol>` : '').join('');
const tbl = t => `<div class="aw-tscroll"><table class="aw-table"><thead><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const TABS = [['grc', 'Course'], ['aic-guides', 'Assessment guides'], ['aic-cases', 'Case studies'], ['aic-checks', 'Knowledge checks'], ['aic-library', 'Library'], ['aic-watch', 'What’s changing'], ['aic-glossary', 'Glossary']];
export function aicSubnav(active) {
  return `<nav class="aw-sub" aria-label="AI Compliance sections">${TABS.map(([h, l]) => `<a href="#${h}" class="${active === h ? 'on' : ''}" ${active === h ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
}
const head = (active, eyebrow, title, lede, side = '') => `${aicSubnav(active)}<section class="cockpit aw-head"><div class="aw-head-in"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${lede ? `<p class="lede2">${lede}</p>` : ''}</div>${side}</div></section>`;
const studied = (key, on) => `<button class="btn ${on ? 'ghost' : ''}" data-studied="${key}">${on ? '✓ Studied — mark as not studied' : 'Mark as studied'}</button>`;
function bindStudied(onChange) {
  C.app.querySelectorAll('[data-studied]').forEach(b => b.onclick = async () => { const k = b.dataset.studied, cur = st()[k] || {}, on = !cur.read; await C.save(k, { ...cur, read: on ? new Date().toISOString() : null }); onChange(); });
}

/* ---------- entry ---------- */
export function isAICRoute(h) { return /^aic-/.test(h); }
export function renderAIC(h, ctx) {
  C = ctx;
  let m;
  if (h === 'aic-guides' || h === 'aic-toolkit') return vGuides();
  if ((m = /^aic-guide-([a-z]+)$/.exec(h))) return vGuide(m[1]);
  if (h === 'aic-cases') return vCases();
  if ((m = /^aic-case-(c\d\d)$/.exec(h))) return vCase(m[1]);
  if (h === 'aic-checks') return vChecks();
  if ((m = /^aic-check-([a-z]+)$/.exec(h))) return vCheck(m[1]);
  if (h === 'aic-library') return vLibrary();
  if (h === 'aic-watch') return vWatch();
  if (h === 'aic-glossary') return vGlossary();
  location.hash = 'grc';
}
const put = html => { C.app.innerHTML = `<div class="view aw">${html}</div>`; };

/* =========================== ASSESSMENT GUIDES (read-only) =========================== */
function vGuides() {
  const n = TOOLKIT.filter(t => st()['gd-' + t.id]?.read).length;
  put(head('aic-guides', 'Assessment guides', 'How AI assessments are done', 'Learn the documents AI governance and audit teams use: what each one is for, when it is used, what it covers, and a worked example where available. For study only — there is nothing to fill in.', `<div class="aw-stat"><b>${n}/${TOOLKIT.length}</b><span>studied</span></div>`) +
    `<div class="aw-flow"><b>Usual order in practice:</b> ${['Inventory', 'Risk & impact', 'Vendor DD', 'Model card', 'Evidence', 'Findings', 'SoA', 'Incident'].map((x, i) => `<span>${i + 1}. ${x}</span>`).join('')}</div>` +
    `<div class="aw-grid">${TOOLKIT.map(t => { const on = !!st()['gd-' + t.id]?.read; return `<a class="aw-card aw-link ${on ? 'done' : ''}" href="#aic-guide-${t.id}"><div class="aw-card-h"><span class="aw-ico">${ICON[t.id] || ''}</span><div><h3>${esc(t.name)}</h3><div class="aic-tags">${t.refs.slice(0, 3).map(r => `<span>${esc(r)}</span>`).join('')}</div></div></div><p>${esc(t.purpose)}</p><div class="aw-row aw-foot"><span>${t.example ? 'Includes a worked example' : 'Structure and key questions'}</span>${on ? '<span class="aw-pill ok">Studied</span>' : ''}</div></a>`; }).join('')}</div>`);
}
function partStudy(p) {
  if (p.k === 'fields') return `<section class="aw-part"><h3>${esc(p.h)}</h3><p class="aw-muted">What is recorded:</p><ul class="aw-list">${p.f.map(f => `<li>${esc(f.label)}${f.opts ? ` <small>(${f.opts.map(esc).join(' / ')})</small>` : ''}</li>`).join('')}</ul></section>`;
  if (p.k === 'table') return `<section class="aw-part"><h3>${esc(p.h)}</h3><p class="aw-muted">One row per item, with these columns:</p><ul class="aw-list">${p.cols.map(c => `<li>${esc(c.label)}${c.opts && c.opts.length <= 8 ? ` <small>(${c.opts.map(esc).join(' / ')})</small>` : ''}${c.type === 'score' ? ' <small>(likelihood × impact)</small>' : ''}</li>`).join('')}</ul></section>`;
  if (p.k === 'check') { let lastG = null; return `<section class="aw-part"><h3>${esc(p.h)}</h3><p class="aw-muted">Each item is marked: ${p.status.map(esc).join(' · ')}</p><div class="aw-qlist">${p.items.map(it => { const g = it.g && it.g !== lastG ? `<h4>${esc(it.g)}</h4>` : ''; lastG = it.g; return `${g}<div class="aw-qi"><span>${p.id === 'ctl' ? `<b>${esc(it.id)}</b> ` : ''}${esc(it.t)}</span>${it.ref ? `<small>${esc(it.ref)}</small>` : ''}</div>`; }).join('')}</div></section>`; }
  return '';
}
function exampleStudy(t) {
  const d = t.example; if (!d) return '';
  const out = [];
  for (const p of t.parts) {
    if (p.k === 'fields') { const f = p.f.filter(x => d.f?.[x.id]); if (f.length) out.push(`<h4>${esc(p.h)}</h4><dl class="aw-dl">${f.map(x => `<dt>${esc(x.label)}</dt><dd>${esc(d.f[x.id])}</dd>`).join('')}</dl>`); }
    if (p.k === 'table' && d.t?.[p.id]?.length) out.push(`<h4>${esc(p.h)}</h4>${tbl({ head: p.cols.map(c => c.label), rows: d.t[p.id].map(r => p.cols.map(c => c.type === 'score' ? String((+r.l || 0) * (+r.i || 0) || '') : (r[c.id] || ''))) })}`);
    if (p.k === 'check' && d.c?.[p.id]) { const its = p.items.filter(it => d.c[p.id][it.id]?.s); if (its.length) out.push(`<h4>${esc(p.h)}</h4>${tbl({ head: ['Item', 'Answer', 'Note'], rows: its.map(it => [it.t, d.c[p.id][it.id].s, d.c[p.id][it.id].n || '']) })}`); }
  }
  return `<section class="aw-part aw-example"><h3>Worked example <span class="aw-pill">Fictional company</span></h3><p class="aw-muted">Read how a completed version looks. Notice how specific each entry is.</p>${out.join('')}</section>`;
}
function vGuide(id) {
  const t = TOOLKIT.find(x => x.id === id); if (!t) { location.hash = 'aic-guides'; return; }
  const on = !!st()['gd-' + id]?.read, i = TOOLKIT.indexOf(t), prev = TOOLKIT[i - 1], next = TOOLKIT[i + 1];
  put(`${aicSubnav('aic-guides')}<section class="cockpit aw-head"><div class="crumb"><a href="#aic-guides">Assessment guides</a> / ${i + 1} of ${TOOLKIT.length}</div><h1>${esc(t.name)}</h1><p class="lede2">${esc(t.purpose)}</p><div class="aic-tags">${t.refs.map(r => `<span>${esc(r)}</span>`).join('')}</div></section>
    <section class="aw-part"><h3>When it is used</h3><p>${esc(t.when)}</p></section>
    ${t.parts.map(partStudy).join('')}
    ${exampleStudy(t)}
    <div class="aw-actions aw-end">${studied('gd-' + id, on)}</div>
    <nav class="pager">${prev ? `<a class="btn" href="#aic-guide-${prev.id}">← ${esc(prev.name)}</a>` : '<span></span>'}${next ? `<a class="btn" href="#aic-guide-${next.id}">${esc(next.name)} →</a>` : ''}</nav>`);
  bindStudied(() => { const y = window.scrollY; vGuide(id); window.scrollTo(0, y); });
}

/* =========================== CASE STUDIES (read and reveal) =========================== */
const caseState = id => st()['cs-' + id] || {};
const caseProg = (c, s) => c.tasks.filter((tk, i) => s.show?.[i]).length;
function vCases() {
  put(head('aic-cases', 'Case studies', 'Learn from realistic situations', 'Each case describes a situation with evidence. Read it, think about each question, then reveal the explanation. All organisations are fictional.') +
    `<div class="aw-grid">${CASES.map(c => { const s = caseState(c.id), n = caseProg(c, s); return `<a class="aw-card aw-link" href="#aic-case-${c.id}"><div class="aw-row"><span class="aw-pill">${esc(c.level)}</span><span class="aw-muted">${esc(c.time)} · ${c.tasks.length} questions</span></div><h3>${esc(c.title)}</h3><p class="aw-muted">${esc(c.sector)} · ${esc(c.where)}</p><div class="aic-tags">${c.skills.map(k => `<span>${esc(k)}</span>`).join('')}</div><div class="aw-row aw-foot"><span>${n === c.tasks.length ? 'Studied' : n ? `${n}/${c.tasks.length} explanations read` : 'Not started'}</span><span class="aw-bar"><i style="width:${Math.round(n / c.tasks.length * 100)}%"></i></span></div></a>`; }).join('')}</div>`);
}
function vCase(id) {
  const c = CASES.find(x => x.id === id); if (!c) { location.hash = 'aic-cases'; return; }
  const s = JSON.parse(JSON.stringify(caseState(id))); s.show = s.show || {};
  const gi = CASES.indexOf(c), next = CASES[gi + 1];
  const taskHTML = (tk, i) => `<section class="aw-task" id="task-${i}"><div class="aw-task-h"><span class="aw-num">${i + 1}</span><h3>${esc(tk.q)}</h3></div>${tk.hint ? `<p class="aw-hint">Think about: ${esc(tk.hint)}</p>` : ''}
    ${s.show[i] ? `<div class="aw-model"><h4>Explanation</h4>${blocks(tk.model)}<h4>Key points to remember</h4><ul class="aw-keys">${tk.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>` : `<button class="btn" data-show="${i}">Show explanation</button>`}</section>`;
  const prog = () => `${caseProg(c, s)} of ${c.tasks.length} explanations read`;
  put(`${aicSubnav('aic-cases')}<section class="cockpit aw-head"><div class="crumb"><a href="#aic-cases">Case studies</a> / ${esc(c.level)}</div><h1>${esc(c.title)}</h1><p class="aw-muted">${esc(c.sector)} · ${esc(c.where)} · about ${esc(c.time)}</p><div class="aic-tags">${c.skills.map(k => `<span>${esc(k)}</span>`).join('')}</div><div class="aw-toolbar"><span class="aw-muted" id="csProg">${prog()}</span><span class="sp"></span>${caseProg(c, s) < c.tasks.length ? '<button class="btn ghost sm" id="csAll">Show all explanations</button>' : ''}</div></section>
    <section class="aw-part aw-brief"><h3>The situation</h3>${blocks(c.brief)}</section>
    ${c.exhibits.map(e => `<section class="aw-part aw-exhibit"><h3>${esc(e.h)}</h3>${e.table ? tbl(e.table) : blocks(e.blocks)}</section>`).join('')}
    <div id="csTasks">${c.tasks.map(taskHTML).join('')}</div>
    <nav class="pager"><a class="btn" href="#aic-cases">← All case studies</a>${next ? `<a class="btn" href="#aic-case-${next.id}">${esc(next.title)} →</a>` : ''}</nav>`);
  const root = C.app, key = 'cs-' + id;
  const persist = () => C.save(key, { show: s.show, updated: new Date().toISOString() });
  root.querySelector('#csTasks').addEventListener('click', async e => {
    const b = e.target.closest('[data-show]'); if (!b) return; const i = +b.dataset.show;
    s.show[i] = 1; root.querySelector('#task-' + i).outerHTML = taskHTML(c.tasks[i], i); root.querySelector('#csProg').textContent = prog(); await persist();
  });
  const all = root.querySelector('#csAll'); if (all) all.onclick = async () => { c.tasks.forEach((tk, i) => s.show[i] = 1); await persist(); const y = window.scrollY; vCase(id); window.scrollTo(0, y); };
}

/* =========================== KNOWLEDGE CHECKS =========================== */
const pool = area => { const A = CHECK_AREAS.find(x => x.id === area); if (!A) return []; const P = C.plus(); return [...A.mods.flatMap(m => (P[m]?.q || []).map(q => ({ ...q, src: m.toUpperCase() }))), ...(CHECK_EXTRA[area] || []).map(q => ({ ...q, src: 'Scenario' }))]; };
const ALL_AREA = { id: 'mixed', name: 'Mixed: all topics', blurb: 'Ten questions drawn from every area.' };
let session = null;
function vChecks() {
  const card = A => { const r = st()['kc-' + A.id] || {}, n = A.id === 'mixed' ? CHECK_AREAS.reduce((a, x) => a + pool(x.id).length, 0) : pool(A.id).length; return `<article class="aw-card"><h3>${esc(A.name)}</h3><p class="aw-muted">${esc(A.blurb)}</p><div class="aw-row"><span class="aw-muted">${n} questions in the pool</span>${r.best != null ? `<span class="aw-pill ${r.best >= 80 ? 'ok' : r.best >= 60 ? 'mid' : 'low'}">Best ${r.best}%</span>` : ''}</div>${r.last ? `<p class="aw-muted small">Last: ${r.lastScore}% on ${fmtD(r.last)} · ${r.n} attempt${r.n === 1 ? '' : 's'}</p>` : ''}<div class="aw-actions"><a class="btn" href="#aic-check-${A.id}">${r.n ? 'Try a new set' : 'Start'} (10 questions)</a></div></article>`; };
  put(head('aic-checks', 'Knowledge checks', 'Check what you know', 'Short, untimed sets of 10 questions with instant feedback and explanations. A new random set each time. This is for your own learning — there is no pass mark.') + `<div class="aw-grid">${[...CHECK_AREAS, ALL_AREA].map(card).join('')}</div>`);
}
function vCheck(area) {
  const A = area === 'mixed' ? ALL_AREA : CHECK_AREAS.find(x => x.id === area); if (!A) { location.hash = 'aic-checks'; return; }
  if (!session || session.area !== area || session.finished) {
    const src = area === 'mixed' ? CHECK_AREAS.flatMap(x => pool(x.id)) : pool(area);
    session = { area, qs: shuffle(src).slice(0, 10).map(q => { const order = shuffle([0, 1, 2, 3].slice(0, q.o.length)); return { ...q, o: order.map(i => q.o[i]), a: order.indexOf(q.a) }; }), ans: [], finished: false };
  }
  const S = session, right = S.qs.filter((q, j) => S.ans[j] === q.a).length, answered = S.ans.filter(x => x !== undefined).length;
  const qHTML = (q, j) => { const a = S.ans[j], dn = a !== undefined; return `<div class="q" id="kq-${j}"><p><span>Q${j + 1}</span>${esc(q.t)}</p><div class="opts">${q.o.map((o, k) => `<button class="opt ${dn && k === q.a ? 'right' : ''} ${dn && k === a && a !== q.a ? 'wrong' : ''}" data-kq="${j}" data-k="${k}" ${dn ? 'disabled' : ''}><span class="ltr">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>${dn ? `<div class="explain"><span><b>${a === q.a ? 'Correct.' : 'Not quite.'}</b> ${esc(q.x)} <small class="aw-muted">· ${esc(q.src)}</small></span></div>` : ''}</div>`; };
  const doneHTML = () => { const pct = Math.round(right / S.qs.length * 100); const weak = [...new Set(S.qs.filter((q, j) => S.ans[j] !== q.a && q.src !== 'Scenario').map(q => q.src))]; return `<section class="aw-part aw-result"><h3>${pct >= 80 ? 'Strong result' : pct >= 60 ? 'Good progress' : 'Worth revisiting'} — ${right} of ${S.qs.length} (${pct}%)</h3>${weak.length ? `<p>Modules to revisit: ${weak.map(m => `<a href="#${m.toLowerCase()}">${m}</a>`).join(', ')}</p>` : '<p>No module gaps in this set.</p>'}<div class="aw-actions"><button class="btn" id="kcAgain">New set</button><a class="btn ghost" href="#aic-checks">All knowledge checks</a></div></section>`; };
  put(`${aicSubnav('aic-checks')}<section class="cockpit aw-head"><div class="crumb"><a href="#aic-checks">Knowledge checks</a></div><h1>${esc(A.name)}</h1><p class="aw-muted" id="kcProg">${answered} of ${S.qs.length} answered · ${right} correct</p></section><section class="msect"><div id="kcQs">${S.qs.map(qHTML).join('')}</div><div id="kcDone">${S.finished ? doneHTML() : ''}</div></section>`);
  const root = C.app;
  const bindAgain = () => { const b = root.querySelector('#kcAgain'); if (b) b.onclick = () => { session = null; vCheck(area); window.scrollTo(0, 0); }; };
  bindAgain();
  root.querySelector('#kcQs').addEventListener('click', async e => {
    const b = e.target.closest('[data-kq]'); if (!b) return; const j = +b.dataset.kq; if (S.ans[j] !== undefined) return;
    S.ans[j] = +b.dataset.k; root.querySelector('#kq-' + j).outerHTML = qHTML(S.qs[j], j);
    const r2 = S.qs.filter((q, i) => S.ans[i] === q.a).length, n2 = S.ans.filter(x => x !== undefined).length;
    root.querySelector('#kcProg').textContent = `${n2} of ${S.qs.length} answered · ${r2} correct`;
    if (n2 === S.qs.length && !S.finished) {
      S.finished = true; const pct = Math.round(r2 / S.qs.length * 100), prev = st()['kc-' + area] || {};
      await C.save('kc-' + area, { best: Math.max(prev.best ?? 0, pct), last: new Date().toISOString(), lastScore: pct, n: (prev.n || 0) + 1, hist: [...(prev.hist || []), { at: new Date().toISOString(), s: pct }].slice(-20) });
      root.querySelector('#kcDone').innerHTML = doneHTML(); bindAgain(); root.querySelector('#kcDone').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* =========================== LIBRARY =========================== */
function vLibrary() {
  const s = st().lib || {}, read = s.read || {}, total = LIBRARY.reduce((a, g) => a + g.items.length, 0), n = LIBRARY.reduce((a, g) => a + g.items.filter(i => read[i[1]]).length, 0);
  put(head('aic-library', 'Library', 'Read the real sources', 'The lessons summarise; these are the originals. Each item says what to focus on. Tick items as you read them.', `<div class="aw-stat"><b>${n}/${total}</b><span>read</span></div>`) +
    LIBRARY.map(g => `<section class="aw-part"><div class="aw-part-h"><h3>${esc(g.g)}</h3><span class="aw-muted">${g.items.filter(i => read[i[1]]).length}/${g.items.length}</span></div><ul class="aw-lib">${g.items.map(([t, u, w]) => `<li class="${read[u] ? 'on' : ''}"><label class="aw-chk"><input type="checkbox" data-read="${esc(u)}" ${read[u] ? 'checked' : ''} aria-label="Mark as read"></label><div><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a><p>${esc(w)}</p></div></li>`).join('')}</ul></section>`).join(''));
  C.app.querySelectorAll('[data-read]').forEach(b => b.onchange = async () => { const cur = JSON.parse(JSON.stringify(st().lib || {})); cur.read = cur.read || {}; if (b.checked) cur.read[b.dataset.read] = new Date().toISOString(); else delete cur.read[b.dataset.read]; b.closest('li').classList.toggle('on', b.checked); await C.save('lib', cur); const nn = Object.keys(cur.read).length; const el = C.app.querySelector('.aw-stat b'); if (el) el.textContent = `${nn}/${total}`; });
}

/* =========================== WHAT'S CHANGING =========================== */
let watchF = 'All';
function vWatch() {
  const today = new Date().toISOString().slice(0, 10), yr = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);
  const items = WATCH.filter(w => watchF === 'All' || w[1] === watchF);
  const stale = today > AIC_NEXT_REVIEW;
  const row = w => { const past = w[0] <= today, soon = !past && w[0] <= yr; return `<li class="${past ? 'past' : soon ? 'soon' : 'later'}"><time>${fmtD(w[0])}</time><span class="aw-jur j-${w[1].toLowerCase()}">${w[1]}</span><p>${esc(w[2])}</p>${soon ? '<em>Coming up</em>' : ''}</li>`; };
  const past = items.filter(w => w[0] <= today), fut = items.filter(w => w[0] > today);
  put(head('aic-watch', 'What’s changing', 'Key dates for AI rules', `Dates that matter for EU, UAE and India AI compliance. Content verified on ${fmtD(AIC_VERIFIED)}; next review due ${fmtD(AIC_NEXT_REVIEW)}.`) +
    (stale ? `<div class="aw-warn">This list is past its review date. Check the official sources in the Library before relying on these dates.</div>` : '') +
    `<div class="aw-filter">${['All', 'EU', 'UAE', 'India'].map(f => `<button class="${f === watchF ? 'on' : ''}" data-wf="${f}">${f}</button>`).join('')}</div>
    <section class="aw-part"><h3>Coming next</h3><ul class="aw-time">${fut.map(row).join('') || '<li class="aw-muted">Nothing scheduled.</li>'}</ul></section>
    <section class="aw-part"><h3>Already in effect</h3><ul class="aw-time">${past.slice().reverse().map(row).join('')}</ul></section>
    <p class="aw-muted small">AI regulation changes often. Before advising anyone, confirm against the official text and your legal team.</p>`);
  C.app.querySelectorAll('[data-wf]').forEach(b => b.onclick = () => { watchF = b.dataset.wf; vWatch(); });
}

/* =========================== GLOSSARY =========================== */
let glQ = '';
function vGlossary() {
  put(head('aic-glossary', 'Glossary', 'AI and AI compliance terms', `${AI_GLOSSARY.length} terms explained in plain language. They are also in your Flashcards under the “AI Compliance” deck.`) +
    `<div class="aw-search"><input type="search" id="glQ" placeholder="Search terms…" value="${esc(glQ)}" aria-label="Search glossary"></div><div class="aw-gloss" id="glList"></div>`);
  const draw = () => { const q = glQ.toLowerCase(), list = AI_GLOSSARY.filter(([t, d]) => !q || (t + ' ' + d).toLowerCase().includes(q)); C.app.querySelector('#glList').innerHTML = list.map(([t, d]) => `<div class="aw-term"><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('') || '<p class="aw-muted">No terms match.</p>'; };
  C.app.querySelector('#glQ').addEventListener('input', e => { glQ = e.target.value; draw(); }); draw();
}

/* =========================== summaries for dashboard / admin =========================== */
export function aicWorkSummary(state) {
  const guides = TOOLKIT.filter(t => state['gd-' + t.id]?.read).length;
  const cases = {}; for (const c of CASES) { const s = state['cs-' + c.id]; const n = s ? caseProg(c, s) : 0; if (n) cases[c.id] = { t: c.title, done: n, of: c.tasks.length }; }
  const checks = {}; for (const A of [...CHECK_AREAS, ALL_AREA]) { const r = state['kc-' + A.id]; if (r && r.n) checks[A.id] = { name: A.name, best: r.best, last: r.lastScore, at: r.last, n: r.n }; }
  const lib = Object.keys((state.lib || {}).read || {}).length, libTotal = LIBRARY.reduce((a, g) => a + g.items.length, 0);
  return { guides, guidesTotal: TOOLKIT.length, cases, casesTotal: CASES.length, checks, lib, libTotal };
}
export const AIC_FLASH = AI_GLOSSARY;

const ICON = {
  inventory: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
  ria: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M12 8v5M12 16h.01"/></svg>',
  vendor: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/></svg>',
  evidence: '<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 15l2 2 4-4"/></svg>',
  modelcard: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h4M6 16h6"/></svg>',
  soa: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
  findings: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v3M11 14h.01"/></svg>',
  incident: '<svg viewBox="0 0 24 24"><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
};
