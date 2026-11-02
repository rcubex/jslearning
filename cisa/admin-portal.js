/* JS Learning · Admin portal
   Monitoring-only view for the admin account: each learner's progress, a detailed activity log,
   weekly, 2-week and monthly reports, exam insights, study habits, coaching (popup messages,
   targets, assigned work, remote sign-out), a live chat with each learner, alerts and an audit
   trail. Reads learner data through the parent app; the admin never studies here. */
import { learnerSnapshot } from './cisa-app.js';
import { assignmentStatus, targetProgress, threadHTML } from './learner-coach.js';
import { uiConfirm, uiAlert } from './ui-dialog.js';

let root, api, learners = null, busy = false, err = '', loadedAt = null, refreshTimer = null;
let sel = 0, view = 'overview', rep = 'week', off = { week: 0, biweek: 0, month: 0 }, logRange = '7', logArea = 'all', logType = 'all', logLimit = 150;
let chats = {}, coachDocs = {}, unsubs = {}, bellOpen = false, exSel = null, exWrongOnly = true, manualList = null, assignType = 'topic', flash = '';
const banks = {};
const LOOKBACK = 150; // days of activity loaded
const WEIGHTS = { 1: 18, 2: 18, 3: 12, 4: 26, 5: 26 };

/* ---------- helpers ---------- */
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p2 = n => String(n).padStart(2, '0');
const ds = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const asDate = s => new Date(s + 'T12:00:00');
const addDays = (s, n) => { const d = asDate(s); d.setDate(d.getDate() + n); return ds(d); };
const today = () => ds(new Date());
const mondayOf = s => { const d = asDate(s), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return ds(d); };
const dayList = (from, to) => { const out = []; for (let d = from; d <= to; d = addDays(d, 1)) out.push(d); return out; };
const fmtDay = s => asDate(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtDayLong = s => asDate(s).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = s => asDate(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const fmtRange = (a, b) => `${fmtShort(a)} – ${asDate(b).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
function dur(sec) { sec = Math.round(sec || 0); if (!sec) return '0m'; if (sec < 60) return '<1m'; const m = Math.round(sec / 60); return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${p2(m % 60)}m`; }
function ago(ms) { if (!ms) return 'never'; const s = (Date.now() - ms) / 1000; if (s < 120) return 'just now'; if (s < 3600) return `${Math.round(s / 60)} min ago`; if (s < 86400) return `${Math.round(s / 3600)} h ago`; const d = Math.round(s / 86400); return d === 1 ? 'yesterday' : `${d} days ago`; }
const btn = (act, label, kind = '', extra = '') => `<button type="button" class="cisa-btn ${kind}" data-a="${act}" ${extra}>${label}</button>`;
const hmOf = iso => { const d = new Date(iso); return `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
const dOf = iso => ds(new Date(iso));
function dlFile(name, text, type) { const b = new Blob([text], { type }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1500); }
const csvCell = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

/* ---------- data ---------- */
async function load() {
  busy = true; err = ''; render();
  try {
    const list = await api.readLearners();
    const from = addDays(today(), -LOOKBACK);
    learners = await Promise.all(list.map(async L => {
      const out = { ...L, snap: null, act: { ok: false, rows: [] } };
      if (L.ok && L.data) { try { out.snap = await learnerSnapshot(L.data); } catch (e) { console.warn(e); } }
      if (L.ok && api.readActivity) { try { out.act = await api.readActivity(L.uid, from); } catch (e) { out.act = { ok: false, rows: [], error: String(e) }; } }
      if (L.ok) subscribe(L.uid);
      return out;
    }));
  } catch (e) { err = 'Could not load learners. Check your connection.'; learners = learners || []; }
  loadedAt = new Date(); busy = false; if (sel >= (learners || []).length) sel = 0; render();
}

const SKIP_EVENTS = /^(Completed mock exam|Finished quick quiz|Ended quick quiz|Finished \d+-minute focus|Logged a study session)/;
function rowsOf(L) {
  const rows = [], c = (L.data && L.data.cisa) || {}, names = (L.snap && L.snap.topicNames) || {}, titles = (L.snap && L.snap.mockTitles) || {};
  const tn = id => id ? (names[id] ? `${id} ${names[id]}` : id) : '';
  for (const r of (L.act.rows || [])) {
    if (r.k === 'e' && SKIP_EVENTS.test(r.x || '')) continue; // shown from the learner's saved results instead
    rows.push({ kind: r.k === 'e' ? 'action' : 'time', d: r.d, s: r.s || '', e: r.e || '', a: r.a || '', x: r.x || '', sec: r.k === 'e' ? 0 : (r.sec || 0), dev: r.dev || '', u: r.u || 0 });
  }
  for (const r of (c.results || [])) { if (!r.date) continue; const p = pct(r.correct, r.total); rows.push({ kind: 'action', d: dOf(r.date), s: hmOf(r.date), e: '', a: 'CISA · Mock exams', x: `Completed mock exam ${r.mockId}${titles[r.mockId] ? ' (' + titles[r.mockId] + ')' : ''}: ${r.correct}/${r.total} · ${p}%${r.attempt > 1 ? ' · retake ' + r.attempt : ' · first attempt'}`, sec: 0, dev: '', u: +new Date(r.date), score: p, mock: r.mockId, first: !(r.attempt > 1) }); }
  for (const q of (c.quizzes || [])) { if (!q.at) continue; rows.push({ kind: 'action', d: dOf(q.at), s: hmOf(q.at), e: '', a: 'CISA · Quick quiz', x: `${q.partial ? 'Ended quick quiz early' : 'Finished quick quiz'}: ${q.right}/${q.n} · ${pct(q.right, q.n)}%`, sec: 0, dev: '', u: +new Date(q.at), quiz: pct(q.right, q.n) }); }
  for (const l of (c.logs || [])) { if (!l.date) continue; const focus = l.notes === 'Focus timer session'; rows.push({ kind: 'logged', d: l.date, s: '', e: '', a: focus ? 'CISA · Focus timer' : 'CISA · Daily recorder', x: `${focus ? 'Focus timer session' : 'Logged study session'} · Domain ${l.domain}${l.topicId ? ' · ' + tn(l.topicId) : ''}${+l.questions ? ` · ${l.correct}/${l.questions} correct` : ''}${!focus && l.notes ? ' · “' + String(l.notes).slice(0, 80) + '”' : ''}`, sec: (+l.minutes || 0) * 60, dev: '', u: +asDate(l.date) + (focus ? 1 : 0) }); }
  rows.sort((a, b) => a.d !== b.d ? (a.d < b.d ? 1 : -1) : (b.s || '') !== (a.s || '') ? ((b.s || '') > (a.s || '') ? 1 : -1) : b.u - a.u);
  return rows;
}

function stats(L, from, to) {
  const all = rowsOf(L), rows = all.filter(r => r.d >= from && r.d <= to), c = (L.data && L.data.cisa) || {};
  const days = dayList(from, to).map(d => ({ d, app: 0, logged: 0, actions: 0 }));
  const di = Object.fromEntries(days.map((x, i) => [x.d, i]));
  const byArea = {}, byTopic = {}, byDev = {};
  for (const r of rows) {
    const x = days[di[r.d]]; if (!x) continue;
    if (r.kind === 'time') { x.app += r.sec; byArea[r.a] = (byArea[r.a] || 0) + r.sec; if (r.x) { const k = r.a + '|' + r.x; byTopic[k] = (byTopic[k] || 0) + r.sec; } if (r.dev) byDev[r.dev] = (byDev[r.dev] || 0) + r.sec; }
    else if (r.kind === 'logged') x.logged += r.sec; else x.actions++;
  }
  // sessions: time rows grouped with gaps under 20 minutes
  const t = rows.filter(r => r.kind === 'time' && r.u).sort((a, b) => a.u - b.u); let sessions = 0, lastEnd = 0;
  for (const r of t) { const start = r.u - r.sec * 1000; if (!lastEnd || start - lastEnd > 20 * 60e3) sessions++; lastEnd = Math.max(lastEnd, r.u); }
  const app = days.reduce((a, x) => a + x.app, 0), logged = days.reduce((a, x) => a + x.logged, 0);
  const active = days.filter(x => x.app >= 60 || x.logged > 0 || x.actions > 0).length;
  const mocks = rows.filter(r => r.mock), quizzes = rows.filter(r => r.quiz !== undefined);
  const inRange = obj => Object.entries(obj || {}).filter(([, d]) => d >= from && d <= to).map(([id]) => id);
  const manual = inRange(c.manRead), notes = inRange(c.revNotes);
  const topics = rows.filter(r => r.kind === 'action' && /^Completed topic /.test(r.x)).map(r => r.x.replace(/^Completed topic /, ''));
  const mx = rows.filter(r => /^Reviewed \d+ mistake/.test(r.x));
  const mxCount = mx.reduce((a, r) => a + (+(/Reviewed (\d+)/.exec(r.x) || [0, 0])[1]), 0);
  const signIns = rows.filter(r => r.a === 'Account' && /^Signed in/.test(r.x)).length;
  const times = rows.filter(r => r.kind === 'time');
  const earliest = times.reduce((m, r) => !m || r.s < m ? r.s : m, ''), latest = times.reduce((m, r) => !m || r.e > m ? r.e : m, '');
  return { from, to, rows, days, app, logged, active, sessions, byArea, byTopic, byDev, mocks, quizzes, manual, notes, topics, mxCount, signIns, earliest, latest, quizAvg: quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.quiz, 0) / quizzes.length) : null };
}

/* ---------- shared bits ---------- */
function nameOf(L) { return (L.act && L.act.profile && L.act.profile.email) || `Learner ${L.uid.slice(0, 6)}…`; }
function lastSeen(L) { const p = L.act && L.act.profile; return Math.max(p && p.lastSeen || 0, L.data && L.data.t || 0); }
function status(L) { const p = L.act && L.act.profile, ls = lastSeen(L), live = p && p.lastSeen && Date.now() - p.lastSeen < 3 * 60e3; return live ? `<span class="adm-dot live"></span>Active now${p.lastArea ? ' · ' + h(p.lastArea) : ''}` : `<span class="adm-dot"></span>Last active ${h(ago(ls))}`; }
function delta(cur, prev, fmt = v => v) { if (!prev && !cur) return '<span class="adm-delta">no change</span>'; if (!prev) return '<span class="adm-delta up">new</span>'; const p = Math.round((cur - prev) / prev * 100); if (p === 0) return '<span class="adm-delta">same as before</span>'; return `<span class="adm-delta ${p > 0 ? 'up' : 'down'}">${p > 0 ? '▲' : '▼'} ${Math.abs(p)}% vs previous</span>`; }
function kpi(label, value, sub = '') { return `<div class="adm-kpi"><span>${label}</span><b>${value}</b>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function bars(days, wide) {
  const max = Math.max(60, ...days.map(x => Math.max(x.app, x.logged)));
  return `<div class="adm-bars ${wide ? 'wide' : ''}">${days.map(x => `<div class="adm-bar" title="${h(fmtDay(x.d))}: app ${dur(x.app)}, logged ${dur(x.logged)}"><div class="adm-bar-col"><i class="app" style="height:${(x.app / max * 100).toFixed(1)}%"></i><i class="log" style="height:${(x.logged / max * 100).toFixed(1)}%"></i></div><b>${x.app ? dur(x.app) : '–'}</b><span>${h(asDate(x.d).toLocaleDateString('en-GB', { weekday: 'short' }))}<br>${asDate(x.d).getDate()}</span></div>`).join('')}</div><div class="adm-legend"><span><i class="app"></i>Time in the app (measured)</span><span><i class="log"></i>Study logged by the learner</span></div>`;
}
function areaList(byArea, total) {
  const e = Object.entries(byArea).sort((a, b) => b[1] - a[1]); if (!e.length) return '<p class="cisa-mini">No time recorded in this period.</p>';
  return `<div class="adm-areas">${e.map(([a, s]) => `<div class="adm-area"><span>${h(a)}</span><div class="adm-meter"><i style="width:${pct(s, e[0][1])}%"></i></div><b>${dur(s)}</b><small>${pct(s, total)}%</small></div>`).join('')}</div>`;
}
function topicList(byTopic, n = 15) {
  const e = Object.entries(byTopic).sort((a, b) => b[1] - a[1]).slice(0, n); if (!e.length) return '<p class="cisa-mini">No specific topics or sections recorded.</p>';
  return `<div class="adm-scroll plain"><table class="adm-table compact"><thead><tr><th>Area</th><th>Topic, section or page</th><th class="r">Time</th></tr></thead><tbody>${e.map(([k, s]) => { const [a, x] = k.split('|'); return `<tr><td>${h(a)}</td><td>${h(x)}</td><td class="r">${dur(s)}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function outcomes(st) {
  const items = [];
  items.push(['Mock exams', st.mocks.length ? st.mocks.map(m => `Mock ${m.mock}: <b>${m.score}%</b>${m.first ? '' : ' (retake)'}`).join(' · ') : 'None']);
  items.push(['Quick quizzes', st.quizzes.length ? `${st.quizzes.length} quiz${st.quizzes.length === 1 ? '' : 'zes'} · average <b>${st.quizAvg}%</b>` : 'None']);
  items.push(['Manual sections read', st.manual.length ? `<b>${st.manual.length}</b> · ${h(st.manual.slice(0, 12).join(', '))}${st.manual.length > 12 ? '…' : ''}` : 'None']);
  items.push(['Revision notes revised', st.notes.length ? `<b>${st.notes.length}</b>` : 'None']);
  items.push(['Topics completed', st.topics.length ? `<b>${st.topics.length}</b> · ${h(st.topics.slice(0, 6).join(' · '))}${st.topics.length > 6 ? '…' : ''}` : 'None']);
  items.push(['Mistakes reviewed', st.mxCount ? `<b>${st.mxCount}</b> questions` : 'None']);
  items.push(['Sign-ins', `<b>${st.signIns}</b>`]);
  return `<table class="adm-table kv">${items.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
}
function attention(L, st, prev) {
  const out = [], s = L.snap;
  const idle = st.days.filter(x => x.d <= today() && x.app < 60 && !x.logged && !x.actions);
  let run = 0, maxRun = 0; for (const x of st.days.filter(x => x.d <= today())) { if (x.app < 60 && !x.logged && !x.actions) { run++; maxRun = Math.max(maxRun, run); } else run = 0; }
  if (maxRun >= 3) out.push(['warn', `${maxRun} days in a row with no study activity.`]);
  if (prev && prev.app > 0 && st.app < prev.app * 0.6) out.push(['warn', `Time in the app fell by ${100 - pct(st.app, prev.app)}% compared with the previous period.`]);
  if (prev && st.app > prev.app * 1.2 && prev.app > 0) out.push(['good', `Time in the app rose by ${pct(st.app, prev.app) - 100}% compared with the previous period.`]);
  if (s && s.days <= 30 && (s.ready === null || s.ready < 65)) out.push(['warn', `Exam in ${s.days} days and readiness is ${s.ready === null ? 'not measured yet' : s.ready + '%'}.`]);
  if (s && s.mx > 15) out.push(['warn', `${s.mx} mistakes are waiting for review.`]);
  if (s && s.scores) { const weak = s.scores.filter(d => d.accuracy !== null && d.accuracy < 60); if (weak.length) out.push(['warn', `Weak domain${weak.length > 1 ? 's' : ''}: ${weak.map(d => `D${d.domain} (${d.accuracy}%)`).join(', ')}.`]); }
  if (st.mocks.some(m => m.score >= 75)) out.push(['good', 'Scored 75% or more on a mock exam.']);
  if (!out.length) out.push(['ok', idle.length ? `No concerns. ${idle.length} day${idle.length === 1 ? '' : 's'} without activity.` : 'No concerns. Studied every day.']);
  return `<ul class="adm-flags">${out.map(([k, t]) => `<li class="${k}">${h(t)}</li>`).join('')}</ul>`;
}
function summaryLine(L, st, days) {
  const top = Object.entries(st.byArea).sort((a, b) => b[1] - a[1])[0];
  const parts = [`${h(nameOf(L))} used the app for <b>${dur(st.app)}</b> on <b>${st.active} of ${days}</b> day${days === 1 ? '' : 's'}`];
  if (st.logged) parts.push(`and logged <b>${dur(st.logged)}</b> of study`);
  let s = parts.join(' ') + '.';
  if (top) s += ` Most time went to <b>${h(top[0])}</b> (${dur(top[1])}).`;
  if (st.mocks.length) s += ` Completed ${st.mocks.length} mock exam${st.mocks.length > 1 ? 's' : ''} (${st.mocks.map(m => `Mock ${m.mock}: ${m.score}%`).join(', ')}).`;
  if (st.earliest) s += ` Usually active between ${st.earliest} and ${st.latest}.`;
  return s;
}

/* ---------- views ---------- */
function overviewUI(L) {
  const s = L.snap, st = stats(L, addDays(today(), -13), today()), wk = stats(L, mondayOf(today()), addDays(mondayOf(today()), 6));
  const recent = rowsOf(L).slice(0, 10);
  return `${s ? `<section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Study progress</span><h3 class="ed-title">${s.mode === 'relaxed' ? 'Relaxed' : 'Normal'} plan ${s.locked ? '· 🔒 locked' : '· not locked'}</h3><p class="ed-sub">Exam ${h(s.exam ? fmtDayLong(s.exam) : '—')} · ${s.days} days left</p></div>${s.locked ? btn('unlock', 'Unlock plan', 'sm', `data-uid="${h(L.uid)}"`) : ''}</div>
   <div class="adm-kpis six">${kpi('Readiness', s.ready === null ? '–' : s.ready + '%', 'first mock attempts')}${kpi('Topics done', `${s.done}/${s.total}`)}${kpi('Logged study', s.hours + 'h', 'all time')}${kpi('Recent quizzes', s.quiz === null ? '–' : s.quiz + '%')}${kpi('Mistakes due', s.mx)}${kpi('Manual read', `${s.manual}/60`)}</div>
   <div class="adm-doms">${s.scores.map(d => `<div><span>D${d.domain}</span><div class="adm-meter"><i style="width:${d.accuracy ?? 0}%"></i></div><small>${d.accuracy === null ? 'no data' : d.accuracy + '%'} · ${d.coverage}% covered</small></div>`).join('')}</div>
   <p class="cisa-mini">Mock first attempts: ${s.mocks.length ? s.mocks.map(m => `Mock ${m.id} ${m.p}%`).join(' · ') : 'none yet'}</p></section>` : ''}
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">This week</span><h3 class="ed-title">${dur(wk.app)} in the app · ${wk.active} active day${wk.active === 1 ? '' : 's'}</h3><p class="ed-sub">Last 14 days below</p></div>${btn('go-week', 'Weekly report', 'sm')}</div>${bars(st.days, true)}</section>
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Recent activity</span><h3 class="ed-title">Latest 10 entries</h3></div>${btn('go-log', 'Full activity log', 'sm')}</div>${logTable(recent, false)}</section>`;
}

const KIND_LABEL = { time: 'Time', action: 'Action', logged: 'Logged' };
function logTable(rows, grouped = true) {
  if (!rows.length) return `<div class="cisa-empty">No activity recorded for this filter.</div>`;
  let html = '', curDay = null;
  const dayTot = {}; for (const r of rows) { const t = dayTot[r.d] || (dayTot[r.d] = { app: 0, logged: 0, n: 0 }); if (r.kind === 'time') t.app += r.sec; else if (r.kind === 'logged') t.logged += r.sec; t.n++; }
  for (const r of rows) {
    if (grouped && r.d !== curDay) { curDay = r.d; const t = dayTot[r.d]; html += `<tr class="adm-day"><td colspan="5"><b>${h(fmtDayLong(r.d))}</b><span>${dur(t.app)} in the app${t.logged ? ` · ${dur(t.logged)} logged` : ''} · ${t.n} entr${t.n === 1 ? 'y' : 'ies'}</span></td></tr>`; }
    const when = r.kind === 'time' ? `${h(r.s)}–${h(r.e)}` : r.s ? h(r.s) : '—';
    html += `<tr class="k-${r.kind}"><td class="adm-when">${grouped ? '' : `<small>${h(fmtShort(r.d))}</small> `}${when}</td><td>${h(r.a)}</td><td><span class="adm-kind ${r.kind}">${KIND_LABEL[r.kind]}</span> ${h(r.x || (r.kind === 'time' ? 'Browsing' : ''))}</td><td class="r">${r.sec ? dur(r.sec) : '—'}</td><td>${h(r.dev || '—')}</td></tr>`;
  }
  return `<div class="adm-scroll"><table class="adm-table log"><thead><tr><th>Time</th><th>Area</th><th>Activity</th><th class="r">Time spent</th><th>Device</th></tr></thead><tbody>${html}</tbody></table></div>`;
}
function logRows(L) {
  let rows = rowsOf(L);
  if (logRange !== 'all') { const from = logRange === 'today' ? today() : addDays(today(), -(+logRange - 1)); rows = rows.filter(r => r.d >= from); }
  if (logArea !== 'all') rows = rows.filter(r => r.a === logArea);
  if (logType !== 'all') rows = rows.filter(r => r.kind === logType);
  return rows;
}
function logUI(L) {
  const all = rowsOf(L), areas = [...new Set(all.map(r => r.a))].sort(), rows = logRows(L);
  const app = rows.filter(r => r.kind === 'time').reduce((a, r) => a + r.sec, 0), logged = rows.filter(r => r.kind === 'logged').reduce((a, r) => a + r.sec, 0);
  const opt = (v, cur, label) => `<option value="${h(v)}" ${v === cur ? 'selected' : ''}>${h(label)}</option>`;
  return `<section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Activity log</span><h3 class="ed-title">${rows.length} entr${rows.length === 1 ? 'y' : 'ies'} · ${dur(app)} in the app${logged ? ` · ${dur(logged)} logged` : ''}</h3><p class="ed-sub">Every visit, action and logged session, newest first</p></div>${btn('csv-log', 'Download CSV', 'sm')}</div>
  <div class="adm-filters"><label>Period<select data-f="range">${opt('today', logRange, 'Today')}${opt('7', logRange, 'Last 7 days')}${opt('14', logRange, 'Last 14 days')}${opt('30', logRange, 'Last 30 days')}${opt('90', logRange, 'Last 90 days')}${opt('all', logRange, 'Everything')}</select></label>
  <label>Area<select data-f="area">${opt('all', logArea, 'All areas')}${areas.map(a => opt(a, logArea, a)).join('')}</select></label>
  <label>Type<select data-f="type">${opt('all', logType, 'Everything')}${opt('time', logType, 'Time in the app')}${opt('action', logType, 'Actions and results')}${opt('logged', logType, 'Study logged by learner')}</select></label></div>
  ${logTable(rows.slice(0, logLimit))}
  ${rows.length > logLimit ? `<div class="adm-more">${btn('more', `Show more (${rows.length - logLimit} older)`, 'sm')}</div>` : ''}
  <p class="cisa-mini adm-note"><b>Time</b> is measured automatically while the app is open and in use (no mouse, keyboard or touch for 3 minutes pauses it; 9 minutes during a mock exam or focus timer). <b>Actions</b> are things the learner finished, such as mocks, quizzes and manual sections. <b>Logged</b> is study the learner recorded themselves, including time away from the app.</p></section>`;
}


/* ---------- live data: chat messages and coach document ---------- */
function subscribe(uid) {
  if (unsubs[uid] || !api.fb) return;
  const fb = api.fb, list = [];
  try {
    list.push(fb.onSnapshot(fb.query(fb.collection(fb.fdb, 'chats', uid, 'messages'), fb.orderBy('at')), snap => {
      chats[uid] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (view === 'chat' && learners && learners[sel] && learners[sel].uid === uid) markLearnerSeen(uid);
      softRender();
    }, e => { chats[uid] = chats[uid] || []; chats[uid].error = String(e && e.code || e); softRender(); }));
    list.push(fb.onSnapshot(fb.doc(fb.fdb, 'coach', uid), s => { coachDocs[uid] = s.exists() ? s.data() : {}; softRender(); }, e => { coachDocs[uid] = coachDocs[uid] || {}; }));
  } catch (e) { console.warn('admin subscribe failed', e); }
  unsubs[uid] = list;
}
function unsubscribeAll() { for (const l of Object.values(unsubs)) for (const f of l) { try { f(); } catch (e) { } } unsubs = {}; }
let softQ = 0; function softRender() { if (softQ) return; softQ = 1; requestAnimationFrame(() => { softQ = 0; render(); }); }
async function markLearnerSeen(uid) {
  const fb = api.fb; for (const m of (chats[uid] || []).filter(m => m.from === 'learner' && !m.seenAt)) { try { await fb.updateDoc(fb.doc(fb.fdb, 'chats', uid, 'messages', m.id), { seenAt: Date.now() }); } catch (e) { } }
}
async function saveCoach(uid, patch, auditText) {
  const fb = api.fb, cur = coachDocs[uid] || {};
  const body = { ...patch, updatedAt: Date.now() };
  if (auditText) body.audit = [...(cur.audit || []), { at: Date.now(), what: auditText }].slice(-400);
  coachDocs[uid] = { ...cur, ...body };
  try { await fb.setDoc(fb.doc(fb.fdb, 'coach', uid), body, { merge: true }); return true; }
  catch (e) { uiAlert('Publish the latest firestore.rules in the Firebase Console, then try again.', { title: 'Couldn’t save' }); return false; }
}
async function sendMsg(uid, text, kind, title) {
  const fb = api.fb;
  try { await fb.addDoc(fb.collection(fb.fdb, 'chats', uid, 'messages'), { from: 'admin', text: text.slice(0, 2000), kind, title: (title || '').slice(0, 80), at: Date.now(), seenAt: null }); if (kind === 'popup') saveCoach(uid, {}, `Sent popup message${title ? ' “' + title + '”' : ''}`); return true; }
  catch (e) { uiAlert('Check the connection and that the latest firestore.rules are published in the Firebase Console.', { title: 'Message not sent' }); return false; }
}
const unreadOf = uid => (chats[uid] || []).filter(m => m.from === 'learner' && !m.seenAt).length;
const actRowsRaw = L => (L.act && L.act.rows) || [];

/* ---------- alerts ---------- */
function dismissed() { try { return JSON.parse(localStorage.getItem('adm-dismiss') || '{}'); } catch (e) { return {}; } }
function alertsOf(L) {
  const out = [], s = L.snap, c = (L.data && L.data.cisa) || {}, cd = coachDocs[L.uid] || {}, who = nameOf(L);
  const un = unreadOf(L.uid); if (un) out.push({ id: 'chat-' + (chats[L.uid] || []).filter(m => m.from === 'learner').length, kind: 'info', text: `${un} new chat message${un === 1 ? '' : 's'} from ${who}`, go: 'chat' });
  const last = lastSeen(L); const idle = last ? Math.floor((Date.now() - last) / 864e5) : null;
  if (idle !== null && idle >= 3) out.push({ id: 'idle-' + today(), kind: 'warn', text: `${who} hasn’t been active for ${idle} days`, go: 'habits' });
  for (const a of cd.assignments || []) if (assignmentStatus(a, L.data) === 'overdue') out.push({ id: 'over-' + a.id, kind: 'warn', text: `Overdue: ${a.label} (due ${fmtShort(a.due)})`, go: 'coaching' });
  if (cd.targets && cd.targets.hours) { const wd = (new Date().getDay() + 6) % 7; const from = mondayOf(today()); const pr = targetProgress(L.data, actRowsRaw(L), from, addDays(from, 6)); if (wd >= 3 && pr.hours < cd.targets.hours * 0.5) out.push({ id: 'behind-' + from, kind: 'warn', text: `Behind this week’s target: ${pr.hours.toFixed(1)} of ${cd.targets.hours} hours`, go: 'coaching' }); }
  for (const m of chats[L.uid] || []) if (m.from === 'admin' && m.kind === 'popup' && !m.seenAt && Date.now() - m.at > 2 * 864e5) out.push({ id: 'pop-' + m.id, kind: 'info', text: `Popup “${m.title || m.text.slice(0, 30)}” not seen for ${Math.floor((Date.now() - m.at) / 864e5)} days`, go: 'coaching' });
  for (const r of c.results || []) { const p = pct(r.correct, r.total); if (r.date && Date.now() - new Date(r.date) < 7 * 864e5 && p < 60) out.push({ id: 'mock-' + r.id, kind: 'warn', text: `Mock ${r.mockId} score ${p}% on ${fmtShort(dOf(r.date))}`, go: 'exams' }); }
  if (s && s.days <= 30 && (s.ready === null || s.ready < 65)) out.push({ id: 'ready-' + mondayOf(today()), kind: 'warn', text: `Exam in ${s.days} days, readiness ${s.ready === null ? 'not measured' : s.ready + '%'}`, go: 'exams' });
  const dm = dismissed(); return out.filter(a => !dm[L.uid + ':' + a.id]).map(a => ({ ...a, uid: L.uid }));
}
function bellUI() {
  const all = (learners || []).flatMap(alertsOf);
  return `<div class="adm-bell-wrap"><button type="button" class="cisa-btn sm adm-bell" data-a="bell" aria-expanded="${bellOpen}" aria-label="Alerts"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2.2 2.2 0 0 0 4 0"/></svg>${all.length ? `<b>${all.length}</b>` : ''}</button>${bellOpen ? `<div class="adm-bell-panel"><div class="adm-bell-head"><b>Alerts</b>${all.length ? btn('dismiss-all', 'Clear all', 'sm') : ''}</div>${all.length ? all.map(a => `<div class="adm-alert ${a.kind}"><span class="adm-alert-ic" aria-hidden="true">${a.go === 'chat' ? '💬' : a.kind === 'warn' ? '!' : 'i'}</span><button type="button" data-a="alert-go" data-go="${a.go}" data-uid="${h(a.uid)}">${h(a.text)}</button><button type="button" class="x" data-a="dismiss" data-id="${h(a.uid + ':' + a.id)}" aria-label="Dismiss">✕</button></div>`).join('') : '<p class="cisa-mini">No alerts. Everything looks on track.</p>'}</div>` : ''}</div>`;
}

/* ---------- reports ---------- */
const REP = { week: 'Weekly report', biweek: '2-week report', month: 'Monthly report' };
function reportData(L, kind) {
  const o = off[kind] || 0; let from, to, len, prevFrom, prevTo;
  if (kind === 'month') {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - o); from = ds(d);
    const e = new Date(d); e.setMonth(e.getMonth() + 1); e.setDate(0); to = ds(e); len = e.getDate();
    const pd = new Date(d); pd.setMonth(pd.getMonth() - 1); prevFrom = ds(pd);
    const pe = new Date(d); pe.setDate(0); prevTo = ds(pe);
  } else {
    len = kind === 'week' ? 7 : 14; const thisMon = mondayOf(today()); to = addDays(thisMon, (kind === 'week' ? 6 : 6) - o * len); from = addDays(to, -(len - 1));
    prevFrom = addDays(from, -len); prevTo = addDays(from, -1);
  }
  // A period still in progress is compared with the same number of days of the previous period.
  const elapsed = to > today() ? dayList(from, today()).length : len;
  if (elapsed < len) prevTo = addDays(prevFrom, elapsed - 1);
  const st = stats(L, from, to), prev = stats(L, prevFrom, prevTo);
  return { len, off: o, from, to, st, prev, elapsed };
}
function reportBody(L, kind) {
  const { len, from, to, st, prev, elapsed } = reportData(L, kind), partial = elapsed < len, title = REP[kind], unit = kind === 'week' ? 'week' : kind === 'month' ? 'month' : '2 weeks';
  const avg = st.active ? st.app / st.active : 0;
  let weeks = '';
  if (kind !== 'week') {
    const ws = []; for (let d = mondayOf(from); d <= to; d = addDays(d, 7)) { const a = d < from ? from : d, b = addDays(d, 6) > to ? to : addDays(d, 6); ws.push(stats(L, a, b)); }
    const row = (label, f) => `<tr><td>${label}</td>${ws.map(w => `<td>${f(w)}</td>`).join('')}</tr>`;
    weeks = `<section class="adm-block"><h4>Week by week</h4><div class="adm-scroll plain"><table class="adm-table cmp"><thead><tr><th></th>${ws.map((w, i) => `<th>Week ${i + 1} · ${h(fmtShort(w.from))}–${h(fmtShort(w.to))}</th>`).join('')}</tr></thead><tbody>
      ${row('Time in the app', w => dur(w.app))}${row('Study logged', w => dur(w.logged))}${row('Active days', w => `${w.active} / ${w.days.length}`)}${row('Sessions', w => w.sessions)}${row('Quick quizzes', w => w.quizzes.length ? `${w.quizzes.length} · avg ${w.quizAvg}%` : '–')}${row('Mock exams', w => w.mocks.length ? w.mocks.map(m => `Mock ${m.mock} ${m.score}%`).join(', ') : '–')}${row('Manual sections read', w => w.manual.length)}${row('Topics completed', w => w.topics.length)}</tbody></table></div></section>`;
  }
  const cd = coachDocs[L.uid] || {};
  let tgt = '';
  if (cd.targets && kind === 'week') { const pr = targetProgress(L.data, actRowsRaw(L), from, to), t = cd.targets; const row = (l, c, g, f = v => v) => g ? `<tr><td>${l}</td><td>${f(c)} / ${f(+g)}</td><td>${progressBar(pct(c, g))}</td></tr>` : ''; tgt = `<section class="adm-block"><h4>Targets</h4><table class="adm-table kv tg">${row('Study hours', +pr.hours.toFixed(1), t.hours)}${row('Active days', pr.days, t.days)}${row('Quick quizzes', pr.quizzes, t.quizzes)}${row('Mocks in the last 2 weeks', pr.mocks, t.mocks)}</table></section>`; }
  return `<div class="adm-report-head"><div><span class="ed-kicker">${title} · ${h(nameOf(L))}</span><h3 class="ed-title">${kind === 'month' ? h(asDate(from).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })) : h(fmtRange(from, to))}</h3><p class="ed-sub">${partial ? `${elapsed} of ${len} days so far · compared with the first ${elapsed} day${elapsed === 1 ? '' : 's'} of the previous ${unit}` : `Compared with the previous ${unit}`}</p></div></div>
  <p class="adm-summary">${summaryLine(L, st, elapsed)}</p>
  <div class="adm-kpis">${kpi('Time in the app', dur(st.app), delta(st.app, prev.app))}${kpi('Study logged', dur(st.logged), delta(st.logged, prev.logged))}${kpi('Active days', `${st.active} / ${elapsed}`, delta(st.active, prev.active))}${kpi('Sessions', st.sessions, delta(st.sessions, prev.sessions))}${kpi('Average per active day', dur(avg))}${kpi('Quiz average', st.quizAvg === null ? '–' : st.quizAvg + '%', st.quizzes.length ? `${st.quizzes.length} quiz${st.quizzes.length > 1 ? 'zes' : ''}` : 'no quizzes')}</div>
  <section class="adm-block"><h4>Needs attention</h4>${attention(L, st, prev)}</section>
  ${tgt}
  <section class="adm-block"><h4>Daily activity</h4>${bars(st.days, len > 7)}</section>
  <div class="adm-two"><section class="adm-block"><h4>Time by area</h4>${areaList(st.byArea, st.app)}</section><section class="adm-block"><h4>Results and progress</h4>${outcomes(st)}</section></div>
  ${weeks}
  <section class="adm-block"><h4>Topics and sections covered</h4>${topicList(st.byTopic)}</section>
  ${Object.keys(st.byDev).length ? `<p class="cisa-mini">Devices: ${Object.entries(st.byDev).sort((a, b) => b[1] - a[1]).map(([d, s]) => `${h(d)} ${dur(s)}`).join(' · ')}</p>` : ''}`;
}
const progressBar = p => `<div class="adm-meter"><i style="width:${Math.min(100, p)}%;${p >= 100 ? 'background:#16a34a' : ''}"></i></div>`;
function reportUI(L) {
  const kind = rep, o = off[kind];
  return `<div class="adm-subtabs">${Object.entries(REP).map(([k, v]) => `<button type="button" data-a="rep" data-v="${k}" aria-current="${rep === k}">${v.replace(' report', '')}</button>`).join('')}</div>
  <section class="ed-card adm-sec adm-report"><div class="adm-report-bar"><div class="adm-seg">${btn('prev', '‹ Earlier', 'sm')}${btn('next', 'Later ›', 'sm', o === 0 ? 'disabled' : '')}${o ? btn('now', 'Latest', 'sm') : ''}</div><div class="adm-seg">${btn('csv-report', 'Download CSV', 'sm')}${btn('print', 'Print / Save PDF', 'sm primary')}</div></div>${reportBody(L, kind)}</section>`;
}

/* ---------- exams: trend, heatmap, mock review ---------- */
function weighted(r) { let a = 0, w = 0; for (const [d, x] of Object.entries(r.stats || {})) if (x.total) { a += WEIGHTS[d] * x.correct / x.total; w += WEIGHTS[d]; } return w ? Math.round(a / w * 100) : pct(r.correct, r.total); }
function lineChart(series, opts = {}) {
  const W = 760, H = 230, P = { l: 36, r: 14, t: 14, b: 30 };
  const pts = series.flatMap(s => s.points); if (!pts.length) return '<p class="cisa-mini">No scores yet.</p>';
  let x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x), opts.xMax || 0); if (x1 - x0 < 864e5 * 7) x1 = x0 + 864e5 * 7;
  const X = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), Y = y => P.t + (1 - y / 100) * (H - P.t - P.b);
  const grid = [0, 25, 50, 75, 100].map(v => `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${P.l - 6}" y="${Y(v) + 4}" text-anchor="end">${v}%</text>`).join('');
  const ticks = []; for (let i = 0; i <= 4; i++) { const t = x0 + (x1 - x0) * i / 4; ticks.push(`<text x="${X(t)}" y="${H - 8}" text-anchor="middle">${new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</text>`); }
  const lines = series.map(s => { const ps = [...s.points].sort((a, b) => a.x - b.x); return `${ps.length > 1 ? `<polyline class="ln" style="stroke:${s.color}" points="${ps.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ')}"/>` : ''}${ps.map(p => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="4" style="fill:${s.color}"><title>${h(p.label || '')}: ${p.y}%</title></circle>`).join('')}`; }).join('');
  const extra = (opts.lines || []).map(l => l.x1 ? `<line x1="${X(l.x0)}" x2="${X(l.x1)}" y1="${Y(l.y0)}" y2="${Y(l.y1)}" class="${l.cls}"/>` : `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(l.y)}" y2="${Y(l.y)}" class="${l.cls}"/><text x="${W - P.r}" y="${Y(l.y) - 4}" text-anchor="end" class="${l.cls}">${h(l.label)}</text>`).join('');
  const vlines = (opts.vlines || []).map(v => `<line x1="${X(v.x)}" x2="${X(v.x)}" y1="${P.t}" y2="${H - P.b}" class="exam"/><text x="${X(v.x) - 4}" y="${P.t + 10}" text-anchor="end" class="exam">${h(v.label)}</text>`).join('');
  return `<svg class="adm-line" viewBox="0 0 ${W} ${H}" role="img" aria-label="${h(opts.aria || 'Score trend')}">${grid}${ticks.join('')}${extra}${vlines}${lines}</svg><div class="adm-legend">${series.map(s => `<span><i style="background:${s.color}"></i>${h(s.name)}</span>`).join('')}${(opts.lines || []).filter(l => l.legend).map(l => `<span><i class="${l.cls}"></i>${h(l.legend)}</span>`).join('')}</div>`;
}
function examsUI(L) {
  const c = (L.data && L.data.cisa) || {}, s = L.snap || {}, results = (c.results || []).filter(r => r.date).sort((a, b) => new Date(a.date) - new Date(b.date));
  const mockPts = results.filter(r => !(r.attempt > 1)).map(r => ({ x: +new Date(r.date), y: weighted(r), label: `Mock ${r.mockId}` }));
  const retPts = results.filter(r => r.attempt > 1).map(r => ({ x: +new Date(r.date), y: weighted(r), label: `Mock ${r.mockId} retake` }));
  const qz = (c.quizzes || []).filter(q => q.at && q.n >= 5); const qByWeek = {}; for (const q of qz) { const k = mondayOf(dOf(q.at)); const v = qByWeek[k] || (qByWeek[k] = [0, 0]); v[0] += q.right; v[1] += q.n; }
  const quizPts = Object.entries(qByWeek).map(([k, v]) => ({ x: +asDate(addDays(k, 3)), y: pct(v[0], v[1]), label: `Quizzes week of ${fmtShort(k)}` }));
  // projection: least squares over all scored points
  const all = [...mockPts, ...quizPts].sort((a, b) => a.x - b.x); let proj = null, lines = [{ y: 75, cls: 'goal', label: 'Target 75%', legend: '' }];
  const examX = s.exam ? +asDate(s.exam) : null;
  const span = all.length ? (all[all.length - 1].x - all[0].x) / 864e5 : 0;
  if (all.length >= 4 && span >= 21 && examX) { const n = all.length, mx = all.reduce((a, p) => a + p.x, 0) / n, my = all.reduce((a, p) => a + p.y, 0) / n; let num = 0, den = 0; for (const p of all) { num += (p.x - mx) * (p.y - my); den += (p.x - mx) ** 2; } const k = den ? num / den : 0; const at = x => Math.max(0, Math.min(100, my + k * (x - mx))); const recent = all.slice(-4).reduce((x, p) => x + p.y, 0) / Math.min(4, all.length); proj = Math.round(Math.max(recent - 20, Math.min(recent + 20, at(examX)))); lines.push({ x0: all[n - 1].x, y0: at(all[n - 1].x), x1: examX, y1: proj, cls: 'proj', legend: 'Projection' }); }
  const projNote = proj === null && all.length ? 'A projection appears once there are at least 4 scores spread over 3 weeks.' : '';
  const trend = lineChart([{ name: 'Mock first attempts (exam-weighted)', color: '#2563eb', points: mockPts }, { name: 'Mock retakes', color: '#93c5fd', points: retPts }, { name: 'Quick quizzes (weekly)', color: '#f59e0b', points: quizPts }], { xMax: examX || 0, lines, vlines: examX ? [{ x: examX, label: 'Exam' }] : [], aria: 'Readiness trend' });
  // heatmap
  const ts = {}; for (const r of results) for (const [t, x] of Object.entries(r.topicStats || {})) { const v = ts[t] || (ts[t] = [0, 0]); v[0] += x.correct; v[1] += x.total; }
  const tTime = {}; for (const r of actRowsRaw(L)) if (r.k === 't') { const m = /^(\d[A-Z]\d+)\b/.exec(r.x || ''); if (m) tTime[m[1]] = (tTime[m[1]] || 0) + (r.sec || 0); }
  const names = s.topicNames || {}, ids = Object.keys(names).filter(id => /^\d[A-Z]\d+$/.test(id));
  const col = a => a === null ? 'none' : a >= 80 ? 'g4' : a >= 70 ? 'g3' : a >= 60 ? 'g2' : a >= 45 ? 'g1' : 'g0';
  const heat = [1, 2, 3, 4, 5].map(d => `<div class="adm-heat-row"><span>D${d}</span><div>${ids.filter(id => id[0] === String(d)).map(id => { const v = ts[id], a = v && v[1] ? pct(v[0], v[1]) : null, done = c.complete && c.complete[id]; return `<i class="${col(a)} ${done ? 'done' : ''}" title="${h(id + ' ' + names[id])} · ${a === null ? 'no questions yet' : a + '% of ' + v[1] + ' questions'}${done ? ' · completed' : ''}${tTime[id] ? ' · ' + dur(tTime[id]) + ' studied' : ''}">${h(id)}</i>`; }).join('')}</div></div>`).join('');
  const weakest = ids.map(id => ({ id, v: ts[id] })).filter(x => x.v && x.v[1] >= 3).map(x => ({ ...x, a: pct(x.v[0], x.v[1]) })).sort((a, b) => a.a - b.a).slice(0, 6);
  // review list
  const rs = [...results].reverse();
  const cur = rs.find(r => r.id === exSel) || null;
  return `<section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Readiness trend</span><h3 class="ed-title">${proj === null ? (mockPts.length ? `Latest mock ${mockPts[mockPts.length - 1].y}% (exam-weighted)` : 'No mock exams yet') : `Projected about ${proj}% by the exam`}</h3><p class="ed-sub">${s.exam ? `Exam ${h(fmtDayLong(s.exam))} · ${s.days} days left` : ''}${proj !== null ? ` · ${proj >= 75 ? 'on track for the 75% target' : proj >= 65 ? 'close to the 75% target' : 'below target at the current pace'}` : ''}</p></div></div>${trend}<p class="cisa-mini">The projection is a straight-line trend through all mock and quiz scores. It moves at most 20 points from the recent average, and it's a guide, not a prediction of the ISACA scaled score. ${projNote}</p></section>
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Topic heatmap</span><h3 class="ed-title">Accuracy by topic across all mock exams</h3><p class="ed-sub">Ringed topics are marked complete · hover a topic for details</p></div></div><div class="adm-heat">${heat}</div><div class="adm-heat-key"><span><i class="g0"></i>&lt;45%</span><span><i class="g1"></i>45–59%</span><span><i class="g2"></i>60–69%</span><span><i class="g3"></i>70–79%</span><span><i class="g4"></i>80%+</span><span><i class="none"></i>no data</span></div>${weakest.length ? `<p class="cisa-mini">Weakest topics: ${weakest.map(x => `<b>${h(x.id)}</b> ${h(names[x.id])} (${x.a}%)`).join(' · ')}</p>` : ''}</section>
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Mock exam review</span><h3 class="ed-title">${rs.length} attempt${rs.length === 1 ? '' : 's'}</h3><p class="ed-sub">Open an attempt to see each answer</p></div></div>
  ${rs.length ? `<div class="adm-scroll"><table class="adm-table"><thead><tr><th>Date</th><th>Mock</th><th>Attempt</th><th class="r">Score</th><th class="r">Exam-weighted</th><th class="r">Time used</th><th>D1–D5</th><th></th></tr></thead><tbody>${rs.map(r => `<tr class="${r.id === exSel ? 'sel' : ''}"><td>${h(fmtShort(dOf(r.date)))} ${h(hmOf(r.date))}</td><td>Mock ${r.mockId}${s.mockTitles && s.mockTitles[r.mockId] ? ' · ' + h(s.mockTitles[r.mockId]) : ''}</td><td>${r.attempt > 1 ? 'Retake ' + r.attempt : 'First'}</td><td class="r">${r.correct}/${r.total} · ${pct(r.correct, r.total)}%</td><td class="r">${weighted(r)}%</td><td class="r">${r.elapsed ? Math.round(r.elapsed / 60000) + ' min' : '—'}</td><td>${[1, 2, 3, 4, 5].map(d => { const x = (r.stats || {})[d]; return x && x.total ? `<span class="adm-dchip ${col(pct(x.correct, x.total))}">${pct(x.correct, x.total)}</span>` : '<span class="adm-dchip none">–</span>'; }).join('')}</td><td>${btn('ex-open', r.id === exSel ? 'Close' : 'Review', 'sm', `data-id="${h(r.id)}"`)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="cisa-mini">No mock exams taken yet.</p>'}
  ${cur ? reviewUI(cur) : ''}</section>`;
}
function reviewUI(r) {
  const bank = banks[r.mockId];
  if (!bank) { loadBank(r.mockId); return '<p class="cisa-mini">Loading questions…</p>'; }
  if (bank.error) return `<p class="pl-err">Could not load mock ${r.mockId} questions.</p>`;
  const ans = r.answers || {}, qs = bank.questions;
  const rows = qs.map((q, i) => ({ q, i, pick: ans[q.id], ok: ans[q.id] === q.answer })).filter(x => !exWrongOnly || !x.ok);
  const L = n => n === undefined ? '—' : 'ABCD'[n];
  return `<div class="adm-review"><div class="adm-review-bar"><b>Mock ${r.mockId} · ${h(fmtDayLong(dOf(r.date)))}</b><label><input type="checkbox" data-f="wrong" ${exWrongOnly ? 'checked' : ''}> Show only wrong or unanswered (${qs.filter(q => ans[q.id] !== q.answer).length})</label></div>
  <div class="adm-scroll"><table class="adm-table rv"><thead><tr><th>#</th><th>Domain · topic</th><th>Question</th><th>Learner’s answer</th><th>Correct answer</th></tr></thead><tbody>${rows.map(x => `<tr class="${x.ok ? 'ok' : 'bad'}"><td>${x.i + 1}</td><td>D${x.q.domain} · ${h(x.q.topicId)}</td><td>${h(x.q.question)}</td><td>${x.pick === undefined ? '<em>Not answered</em>' : `<b>${x.ok ? '✓' : '✗'}</b> ${h(x.q.choices[x.pick])}`}</td><td>${x.ok ? '<span class="cisa-mini">same</span>' : h(x.q.choices[x.q.answer])}</td></tr>`).join('') || '<tr><td colspan="5">Every question was answered correctly.</td></tr>'}</tbody></table></div>
  <p class="cisa-mini">Answers are shown in the original order (A–D), not the shuffled order the learner saw.</p></div>`;
}
async function loadBank(id) { if (banks[id]) return; banks[id] = null; try { const res = await fetch(new URL(`./mock-exams/mock-${String(id).padStart(2, '0')}.json`, import.meta.url)); banks[id] = await res.json(); } catch (e) { banks[id] = { error: true }; } render(); }

/* ---------- habits ---------- */
function habitsUI(L) {
  const rows = rowsOf(L), byDay = {}, hours = new Array(24).fill(0), wdays = new Array(7).fill(0), dev = {};
  for (const r of rows) { const v = byDay[r.d] || (byDay[r.d] = { app: 0, logged: 0, act: 0 }); if (r.kind === 'time') { v.app += r.sec; const hr = +(r.s || '0').slice(0, 2); hours[hr] += r.sec; wdays[(asDate(r.d).getDay() + 6) % 7] += r.sec; if (r.dev) dev[r.dev] = (dev[r.dev] || 0) + r.sec; } else if (r.kind === 'logged') v.logged += r.sec; else v.act++; }
  const isActive = d => { const v = byDay[d]; return !!v && (v.app >= 60 || v.logged > 0 || v.act > 0); };
  const end = today(), start = addDays(mondayOf(end), -7 * 19), days = dayList(start, end);
  let cur = 0; for (let d = end; d >= start; d = addDays(d, -1)) { if (isActive(d)) cur++; else if (d !== end) break; }
  let best = 0, run = 0; for (const d of days) { if (isActive(d)) { run++; best = Math.max(best, run); } else run = 0; }
  const lvl = d => { const v = byDay[d]; if (!v) return 0; const m = (v.app + v.logged) / 60; return m === 0 ? (v.act ? 1 : 0) : m < 20 ? 1 : m < 45 ? 2 : m < 90 ? 3 : 4; };
  const weeks = []; for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const cal = `<div class="adm-cal"><div class="adm-cal-days"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span>Sun</span></div>${weeks.map(w => `<div class="adm-cal-col">${w.map(d => { const v = byDay[d]; return `<i class="l${lvl(d)}" title="${h(fmtDay(d))}: ${v ? `${dur(v.app)} in the app${v.logged ? ', ' + dur(v.logged) + ' logged' : ''}` : 'no activity'}"></i>`; }).join('')}</div>`).join('')}</div><div class="adm-heat-key cal"><span>Less</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>More</span></div>`;
  const total = hours.reduce((a, b) => a + b, 0), hmax = Math.max(1, ...hours), wmax = Math.max(1, ...wdays);
  const peak = hours.indexOf(Math.max(...hours));
  const study = rows.filter(r => r.kind === 'time' && (/^CISA/.test(r.a) || /academy|Flashcards|Explore|workbook/i.test(r.a)) && (r.x || /Quiz|Mistakes|Focus/.test(r.a))).reduce((a, r) => a + r.sec, 0);
  const focusQ = pct(study, total);
  const active30 = dayList(addDays(end, -29), end).filter(isActive).length;
  return `<section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Study habits</span><h3 class="ed-title">${cur} day streak · best ${best}</h3><p class="ed-sub">Last 20 weeks · ${active30} active days in the last 30</p></div></div>${cal}</section>
  <div class="adm-two"><section class="ed-card adm-sec"><span class="ed-kicker">Time of day</span><h3 class="ed-title">${total ? `Most active around ${p2(peak)}:00` : 'No data yet'}</h3><div class="adm-hours">${hours.map((v, i) => `<div title="${p2(i)}:00 · ${dur(v)}"><i style="height:${(v / hmax * 100).toFixed(1)}%"></i><span>${i % 3 === 0 ? p2(i) : ''}</span></div>`).join('')}</div></section>
  <section class="ed-card adm-sec"><span class="ed-kicker">Day of week</span><h3 class="ed-title">${total ? `Best day: ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][wdays.indexOf(Math.max(...wdays))]}` : 'No data yet'}</h3><div class="adm-areas">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<div class="adm-area"><span>${d}</span><div class="adm-meter"><i style="width:${pct(wdays[i], wmax)}%"></i></div><b>${dur(wdays[i])}</b><small>${pct(wdays[i], total)}%</small></div>`).join('')}</div></section></div>
  <div class="adm-two"><section class="ed-card adm-sec"><span class="ed-kicker">Focus quality</span><h3 class="ed-title">${total ? `${focusQ}% of app time on actual study` : 'No data yet'}</h3><div class="adm-meter big"><i style="width:${focusQ}%"></i></div><p class="cisa-mini">Study means time on a specific topic, manual section, lesson, mock, quiz, mistakes review, flashcards or focus timer. The rest is dashboards, lists and menus.</p></section>
  <section class="ed-card adm-sec"><span class="ed-kicker">Devices</span><h3 class="ed-title">${Object.keys(dev).length ? Object.entries(dev).sort((a, b) => b[1] - a[1])[0][0] + ' mostly' : 'No data yet'}</h3><div class="adm-areas">${Object.entries(dev).sort((a, b) => b[1] - a[1]).map(([d, v]) => `<div class="adm-area"><span>${h(d)}</span><div class="adm-meter"><i style="width:${pct(v, total)}%"></i></div><b>${dur(v)}</b><small>${pct(v, total)}%</small></div>`).join('')}</div></section></div>`;
}

/* ---------- coaching: popup, targets, assignments, sessions ---------- */
async function loadManual() { if (manualList) return; manualList = []; try { const g = await (await fetch(new URL('./data/manual-guide.json', import.meta.url))).json(); manualList = g.chapters.flatMap(c => c.parts.flatMap(p => p.sections.map(s => ({ id: s.id, title: s.title })))); } catch (e) { manualList = []; } render(); }
function coachingUI(L) {
  const cd = coachDocs[L.uid] || {}, t = cd.targets || {}, s = L.snap || {}, msgs = chats[L.uid] || [], live = isLive(L);
  const pops = msgs.filter(m => m.from === 'admin' && m.kind === 'popup').reverse().slice(0, 8);
  const from = mondayOf(today()), pr = targetProgress(L.data, actRowsRaw(L), from, addDays(from, 6));
  const tg = (k, label, cur, unit, max) => `<label class="adm-tg"><span>${label}</span><input type="number" min="0" max="${max}" step="${k === 'hours' ? '0.5' : '1'}" name="${k}" value="${t[k] ?? ''}" placeholder="—" data-keep="tg-${k}"><small>${unit}</small><em>This week: ${cur}</em></label>`;
  if (assignType === 'manual') loadManual();
  const names = s.topicNames || {};
  const refSel = assignType === 'topic' ? `<select name="ref" data-keep="as-ref">${Object.entries(names).map(([id, n]) => `<option value="${h(id)}">${h(id + ' ' + n)}</option>`).join('')}</select>`
    : assignType === 'manual' ? `<select name="ref" data-keep="as-ref">${(manualList || []).map(x => `<option value="${h(x.id)}">${h(x.id + ' ' + x.title)}</option>`).join('') || '<option>Loading…</option>'}</select>`
    : assignType === 'mock' ? `<select name="ref" data-keep="as-ref">${[1, 2, 3, 4, 5].map(i => `<option value="${i}">Mock ${i}${s.mockTitles && s.mockTitles[i] ? ' · ' + h(s.mockTitles[i]) : ''}</option>`).join('')}</select>`
    : assignType === 'quiz' ? `<input type="hidden" name="ref" value="quiz"><span class="cisa-mini">Any completed quick quiz after today counts.</span>`
    : `<input name="ref" maxlength="120" placeholder="e.g. Read chapter 4 of the printed manual" data-keep="as-task">`;
  const as = [...(cd.assignments || [])].reverse();
  const devs = {}; for (const r of actRowsRaw(L)) if (r.dev) { const v = devs[r.dev] || (devs[r.dev] = { last: 0, signIns: 0, days: new Set() }); v.last = Math.max(v.last, r.u || 0); v.days.add(r.d); if (r.a === 'Account' && /^Signed in/.test(r.x || '')) v.signIns++; }
  const lastIn = actRowsRaw(L).filter(r => r.a === 'Account' && /^Signed in/.test(r.x || '')).sort((a, b) => (b.u || 0) - (a.u || 0))[0];
  return `<div class="adm-two"><section class="ed-card adm-sec"><span class="ed-kicker">Popup message</span><h3 class="ed-title">Send a popup message</h3><p class="ed-sub"><span class="adm-dot ${live ? 'live' : ''}"></span> ${live ? 'Online now' : 'Offline'}</p>
  <form class="adm-form" data-form="popup"><div class="adm-group"><input name="title" maxlength="80" placeholder="Title" data-keep="pop-title" aria-label="Title (optional)"><textarea name="text" rows="4" maxlength="2000" placeholder="Message" required data-keep="pop-text" aria-label="Message"></textarea></div><div class="adm-form-foot">${flash === 'popup' ? '<span class="adm-ok">✓ Sent</span>' : `<span class="adm-hint">${live ? 'Shows on their screen now' : 'Shows when they next sign in'}</span>`}<button type="submit" class="cisa-btn primary sm">Send popup</button></div></form>
  ${pops.length ? `<h4 class="adm-h4">Recently sent</h4><ul class="adm-sent">${pops.map(m => `<li><span class="adm-sent-ic ${m.seenAt ? 'seen' : 'wait'}" aria-hidden="true">${m.seenAt ? '✓' : '•'}</span><div><b>${h(m.title || m.text.slice(0, 60))}</b><small>${h(new Date(m.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}${m.title ? ' · ' + h(m.text.slice(0, 50)) + (m.text.length > 50 ? '…' : '') : ''}</small></div><span class="adm-pill ${m.seenAt ? 'seen' : 'wait'}">${m.seenAt ? 'Seen ' + h(ago(m.seenAt)) : live ? 'Showing now' : 'Waiting for sign-in'}</span></li>`).join('')}</ul>` : ''}</section>
  <section class="ed-card adm-sec"><span class="ed-kicker">Weekly targets</span><h3 class="ed-title">Targets shown on the learner’s dashboard</h3><p class="ed-sub">Leave a box empty for no target</p>
  <form class="adm-form adm-tgs" data-form="targets">${tg('hours', 'Study hours', pr.hours.toFixed(1) + ' h', 'hours a week', 80)}${tg('days', 'Active days', pr.days, 'days a week', 7)}${tg('quizzes', 'Quick quizzes', pr.quizzes, 'a week', 50)}${tg('mocks', 'Mock exams', pr.mocks + ' in 2 wks', 'every 2 weeks', 10)}<div class="adm-form-foot">${flash === 'targets' ? '<span class="adm-ok">✓ Saved</span>' : '<span></span>'}<button type="submit" class="cisa-btn primary sm">Save targets</button></div></form></section></div>
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Assigned work</span><h3 class="ed-title">${as.filter(a => assignmentStatus(a, L.data) !== 'done').length} open · ${as.filter(a => assignmentStatus(a, L.data) === 'done').length} done</h3><p class="ed-sub">Shown on the learner’s dashboard and CISA overview. Topics, manual sections, mocks and quizzes are ticked off automatically.</p></div></div>
  <form class="adm-form adm-assign" data-form="assign"><label>Type<select name="type" data-f="atype">${[['topic', 'Syllabus topic'], ['manual', 'Manual section'], ['mock', 'Mock exam'], ['quiz', 'Quick quiz'], ['task', 'Custom task']].map(([k, v]) => `<option value="${k}" ${assignType === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label class="grow">What${refSel}</label><label>Due<input type="date" name="due" min="${today()}" data-keep="as-due"></label><label class="grow">Note (optional)<input name="note" maxlength="140" placeholder="e.g. Focus on the auditor’s perspective" data-keep="as-note"></label><button type="submit" class="cisa-btn primary sm">Assign</button></form>
  ${as.length ? `<div class="adm-scroll"><table class="adm-table"><thead><tr><th>Assigned</th><th>Work</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${as.map(a => { const st = assignmentStatus(a, L.data); return `<tr><td>${h(fmtShort(dOf(a.at)))}</td><td><b>${h(a.label)}</b>${a.note ? `<br><small class="cisa-mini">${h(a.note)}</small>` : ''}</td><td>${a.due ? h(fmtShort(a.due)) : '—'}</td><td><span class="adm-st ${st}">${st === 'done' ? 'Done' : st === 'overdue' ? 'Overdue' : 'Open'}</span></td><td>${btn('as-remove', 'Remove', 'sm', `data-id="${h(a.id)}"`)}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="cisa-mini">Nothing assigned yet.</p>'}</section>
  <section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Sessions and devices</span><h3 class="ed-title">${live ? '🟢 Signed in and active now' : `Last active ${h(ago(lastSeen(L)))}`}</h3><p class="ed-sub">${lastIn ? `Last sign-in ${h(fmtDayLong(lastIn.d))} at ${h(lastIn.s)} on ${h((lastIn.dev || '').toLowerCase() || 'a device')}` : 'No sign-ins recorded yet'}${cd.signOutAt ? ` · last remote sign-out ${h(new Date(cd.signOutAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}` : ''}</p></div>${btn('signout-remote', 'Sign out learner now', 'sm danger')}</div>
  ${Object.keys(devs).length ? `<table class="adm-table"><thead><tr><th>Device</th><th>Last used</th><th class="r">Days used</th><th class="r">Sign-ins</th></tr></thead><tbody>${Object.entries(devs).sort((a, b) => b[1].last - a[1].last).map(([d, v]) => `<tr><td>${h(d)}</td><td>${h(ago(v.last))}</td><td class="r">${v.days.size}</td><td class="r">${v.signIns}</td></tr>`).join('')}</tbody></table>` : '<p class="cisa-mini">No devices recorded yet.</p>'}<p class="cisa-mini">“Sign out learner now” signs them out on every device that is open. They can sign in again straight away.</p></section>`;
}
function isLive(L) { const p = L.act && L.act.profile; return !!(p && p.lastSeen && Date.now() - p.lastSeen < 3 * 60e3); }

/* ---------- chat ---------- */
function chatUI(L) {
  const msgs = chats[L.uid] || [], live = isLive(L);
  return `<section class="ed-card adm-sec adm-chat"><header><div class="lc-who"><span class="lc-av learner">${h(nameOf(L).charAt(0).toUpperCase())}${live ? '<i class="lc-live"></i>' : ''}</span><div><b>${h(nameOf(L))}</b><small>${live ? 'Active now' : 'Last active ' + h(ago(lastSeen(L)))}</small></div></div></header>${msgs.error ? `<p class="pl-err">Chat unavailable (${h(msgs.error)}). Publish the latest firestore.rules.</p>` : ''}<div class="lc-msgs adm-msgs">${threadHTML(msgs, 'admin', { live, emptyTitle: 'Start the conversation', empty: 'Messages appear on the learner’s screen with a notification. Tick Popup to show one as an alert.' })}</div>
  <form class="lc-input adm-chat-input" data-form="chat"><label class="adm-aspop" title="Show this message as a popup alert"><input type="checkbox" name="popup" data-keep="chat-pop"><span>Popup</span></label><div class="lc-field"><textarea name="text" rows="1" maxlength="2000" placeholder="Message ${h(nameOf(L))}" aria-label="Message" data-keep="chat-text"></textarea><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button></div></form></section>`;
}

/* ---------- audit ---------- */
function auditUI(L) {
  const au = [...((coachDocs[L.uid] || {}).audit || [])].reverse();
  return `<section class="ed-card adm-sec"><div class="adm-sec-head"><div><span class="ed-kicker">Audit trail</span><h3 class="ed-title">Admin actions for ${h(nameOf(L))}</h3><p class="ed-sub">Plan unlocks, popups, targets, assigned work and remote sign-outs</p></div>${au.length ? btn('csv-audit', 'Download CSV', 'sm') : ''}</div>
  ${au.length ? `<div class="adm-scroll"><table class="adm-table"><thead><tr><th>When</th><th>Action</th></tr></thead><tbody>${au.map(x => `<tr><td class="adm-when">${h(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</td><td>${h(x.what)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="cisa-mini">No admin actions recorded yet.</p>'}</section>`;
}

/* ---------- render ---------- */
function render() {
  if (!root) return;
  // keep what the admin is typing across live re-renders
  const keep = {}; let focusKey = null, selStart = null;
  root.querySelectorAll('[data-keep]').forEach(el => { keep[el.dataset.keep] = el.type === 'checkbox' ? el.checked : el.value; if (el === document.activeElement) { focusKey = el.dataset.keep; try { selStart = el.selectionStart; } catch (e) { } } });
  const msgBox = root.querySelector('.adm-msgs'); const atBottom = !msgBox || msgBox.scrollHeight - msgBox.scrollTop - msgBox.clientHeight < 40;
  const tabs = [['overview', 'Overview'], ['log', 'Activity log'], ['reports', 'Reports'], ['exams', 'Exams'], ['habits', 'Habits'], ['coaching', 'Coaching'], ['chat', 'Chat'], ['audit', 'Audit trail']];
  let body;
  if (!learners) body = `<section class="ed-card adm-sec"><p class="cisa-mini">${busy ? 'Loading learners…' : ''}</p></section>`;
  else if (!learners.length) body = `<section class="ed-card adm-sec"><p>No learner accounts yet. ${err ? h(err) : ''}</p></section>`;
  else {
    const L = learners[sel], un = unreadOf(L.uid);
    const warn = !L.ok ? `<p class="pl-err">Cannot read this learner (${h(L.error)}). Publish the latest <code>firestore.rules</code> in the Firebase Console.</p>` : !L.act.ok && L.act.error && L.act.error !== 'not-admin' ? `<p class="pl-err">Activity log unavailable (${h(L.act.error)}). Publish the latest <code>firestore.rules</code> in the Firebase Console; activity is recorded once the rules allow it.</p>` : '';
    const head = `<section class="ed-card adm-learner"><div class="adm-avatar">${h(nameOf(L).charAt(0).toUpperCase())}${isLive(L) ? '<i class="lc-live"></i>' : ''}</div><div class="adm-who"><b>${h(nameOf(L))}</b><span>${status(L)}</span></div>${btn('quick-chat', `Message${un ? ` <span class="cisa-count">${un}</span>` : ''}`, 'sm primary')}${learners.length > 1 ? `<select data-f="learner">${learners.map((x, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${h(nameOf(x))}</option>`).join('')}</select>` : ''}</section>${warn}`;
    const nav = `<div class="cisa-tabs adm-tabs" role="tablist">${tabs.map(([k, v]) => `<button type="button" data-a="view" data-v="${k}" aria-current="${view === k}">${v}${k === 'chat' && un ? ` <span class="cisa-count">${un}</span>` : ''}</button>`).join('')}</div>`;
    const empty = !L.data && !L.act.rows.length && !['chat', 'coaching', 'audit'].includes(view);
    const main = empty ? `<section class="ed-card adm-sec"><p class="cisa-mini">This learner hasn’t used the app yet.</p></section>` : view === 'log' ? logUI(L) : view === 'reports' ? reportUI(L) : view === 'exams' ? examsUI(L) : view === 'habits' ? habitsUI(L) : view === 'coaching' ? coachingUI(L) : view === 'chat' ? chatUI(L) : view === 'audit' ? auditUI(L) : overviewUI(L);
    body = head + nav + main;
  }
  root.innerHTML = `<div class="cisa-hub adm-portal"><header class="cisa-head adm-head"><div><span class="ed-kicker">Admin portal</span><h1>Learner monitoring</h1><p class="ed-sub">${loadedAt ? `Updated ${h(loadedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))} · chat and messages are live` : 'Loading…'}</p></div><div class="adm-head-act">${learners ? bellUI() : ''}${btn('refresh', busy ? 'Refreshing…' : '↻ Refresh', 'sm', busy ? 'disabled' : '')}</div></header>${body}</div>`;
  root.querySelectorAll('[data-keep]').forEach(el => { const k = el.dataset.keep; if (k in keep) { if (el.type === 'checkbox') el.checked = keep[k]; else if (el.tagName !== 'SELECT' || [...el.options].some(o => o.value === keep[k])) el.value = keep[k]; } if (k === focusKey) { el.focus(); try { if (selStart !== null) el.setSelectionRange(selStart, selStart); } catch (e) { } } });
  const mb = root.querySelector('.adm-msgs'); if (mb && atBottom) mb.scrollTop = mb.scrollHeight;
}

/* ---------- export / print ---------- */
function csvLog(L, rows, name) {
  const lines = [['Date', 'Start', 'End', 'Area', 'Type', 'Activity', 'Minutes', 'Device'].join(',')];
  for (const r of rows) lines.push([r.d, r.s, r.e, r.a, KIND_LABEL[r.kind], r.x, r.sec ? (r.sec / 60).toFixed(1) : '', r.dev].map(csvCell).join(','));
  dlFile(name, lines.join('\n'), 'text/csv');
}
function printReport(L, kind) {
  const css = `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;color:#1d2433;margin:28px;font-size:12px;line-height:1.45}h3{font-size:20px;margin:2px 0}h4{font-size:13px;margin:18px 0 6px}.ed-kicker{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;font-weight:700}.ed-sub,.cisa-mini{color:#64748b;margin:2px 0}.adm-summary{background:#f3f6fb;border-radius:8px;padding:10px 12px}.adm-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.adm-kpi{border:1px solid #e3e8f0;border-radius:8px;padding:8px 10px}.adm-kpi span{display:block;color:#64748b;font-size:10px}.adm-kpi b{font-size:17px}.adm-kpi small{display:block;font-size:10px;color:#64748b}.adm-delta.up{color:#15803d}.adm-delta.down{color:#b91c1c}.adm-flags{padding-left:16px}.adm-flags li.warn{color:#9a3412}.adm-flags li.good{color:#15803d}.adm-bars{display:flex;gap:3px;align-items:flex-end;height:150px}.adm-bar{flex:1;display:flex;flex-direction:column;align-items:center;font-size:8px;height:100%;min-width:0}.adm-bar-col{flex:1;width:100%;display:flex;gap:1px;align-items:flex-end;justify-content:center}.adm-bar-col i{width:38%;border-radius:3px 3px 0 0;min-height:1px}i.app{background:#2563eb}i.log{background:#f59e0b}.adm-bar span{color:#64748b;text-align:center}.adm-bar b{font-size:8px;white-space:nowrap}.adm-legend{font-size:10px;color:#64748b;display:flex;gap:14px;margin-top:4px}.adm-legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}.adm-two{display:grid;grid-template-columns:1fr 1fr;gap:18px}.adm-area{display:grid;grid-template-columns:1.4fr 1fr 52px 34px;gap:6px;align-items:center;margin-bottom:4px}.adm-meter{height:6px;background:#e8edf5;border-radius:4px;overflow:hidden}.adm-meter i{display:block;height:100%;background:#2563eb}.adm-table{width:100%;border-collapse:collapse}.adm-table td,.adm-table th{border-bottom:1px solid #e8edf3;padding:5px 6px;text-align:left;vertical-align:top}.adm-table th{font-size:10px;color:#64748b;text-transform:uppercase}.r{text-align:right!important}section{break-inside:avoid}`;
  const w = window.open('', '_blank'); if (!w) { uiAlert('Allow pop-ups for this site in your browser, then press Print again.', { title: 'Pop-up blocked' }); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${REP[kind]} · ${h(nameOf(L))}</title><style>${css}</style></head><body>${reportBody(L, kind)}<p class="cisa-mini" style="margin-top:20px">Generated ${h(new Date().toLocaleString('en-GB'))} · JS Learning admin portal</p></body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
}

/* ---------- events ---------- */
function setView(v) { view = v; logLimit = 150; bellOpen = false; flash = ''; render(); if (v === 'chat') { const L = learners && learners[sel]; if (L) markLearnerSeen(L.uid); setTimeout(() => root.querySelector('.adm-chat-input textarea')?.focus(), 30); } }
async function onClick(e) {
  const b = e.target.closest('[data-a]');
  if (bellOpen && !e.target.closest('.adm-bell-wrap')) { bellOpen = false; render(); if (!b) return; }
  if (!b || !root.contains(b) || b.disabled) return;
  const a = b.dataset.a, L = learners && learners[sel];
  if (a === 'refresh') { load(); return; }
  if (a === 'view') { setView(b.dataset.v); return; }
  if (a === 'bell') { bellOpen = !bellOpen; render(); return; }
  if (a === 'dismiss' || a === 'dismiss-all') { const dm = dismissed(); if (a === 'dismiss') dm[b.dataset.id] = Date.now(); else for (const x of (learners || []).flatMap(alertsOf)) dm[x.uid + ':' + x.id] = Date.now(); try { localStorage.setItem('adm-dismiss', JSON.stringify(dm)); } catch (err) { } render(); return; }
  if (a === 'alert-go') { const i = (learners || []).findIndex(x => x.uid === b.dataset.uid); if (i >= 0) sel = i; setView(b.dataset.go); return; }
  if (a === 'go-week') { view = 'reports'; rep = 'week'; off.week = 0; render(); return; }
  if (a === 'go-log') { setView('log'); return; }
  if (a === 'quick-chat') { setView('chat'); return; }
  if (a === 'more') { logLimit += 300; render(); return; }
  if (a === 'rep') { rep = b.dataset.v; render(); return; }
  if (a === 'prev' || a === 'next' || a === 'now') { off[rep] = a === 'now' ? 0 : Math.max(0, off[rep] + (a === 'prev' ? 1 : -1)); render(); return; }
  if (!L) return;
  if (a === 'csv-log') { csvLog(L, logRows(L), `activity-log-${today()}.csv`); return; }
  if (a === 'csv-report') { const { from, to, st } = reportData(L, rep); csvLog(L, st.rows, `${rep === 'week' ? 'weekly' : rep === 'month' ? 'monthly' : '2-week'}-report-${from}-to-${to}.csv`); return; }
  if (a === 'csv-audit') { const au = (coachDocs[L.uid] || {}).audit || []; dlFile(`admin-audit-${today()}.csv`, ['When,Action', ...au.map(x => [new Date(x.at).toISOString(), x.what].map(csvCell).join(','))].join('\n'), 'text/csv'); return; }
  if (a === 'print') { printReport(L, rep); return; }
  if (a === 'ex-open') { exSel = exSel === b.dataset.id ? null : b.dataset.id; render(); return; }
  if (a === 'as-remove') { const cd = coachDocs[L.uid] || {}, x = (cd.assignments || []).find(z => z.id === b.dataset.id); if (!x || !(await uiConfirm('It disappears from the learner’s list.', { title: `Remove “${x.label}”?`, ok: 'Remove', danger: true }))) return; await saveCoach(L.uid, { assignments: (cd.assignments || []).filter(z => z.id !== x.id) }, `Removed assigned work: ${x.label}`); render(); return; }
  if (a === 'signout-remote') { if (!(await uiConfirm('Any open session closes within a few seconds. They can sign in again straight away.', { title: `Sign ${nameOf(L)} out now?`, ok: 'Sign out', danger: true }))) return; if (await saveCoach(L.uid, { signOutAt: Date.now() }, 'Signed the learner out remotely')) { uiAlert('Any open session will close within a few seconds.', { title: 'Sign-out sent' }); } render(); return; }
  if (a === 'unlock') { if (!(await uiConfirm('They can set up and lock a new plan afterwards.', { title: 'Unlock the study plan?', ok: 'Unlock' }))) return; api.unlockLearner(b.dataset.uid).then(ok => { if (ok) saveCoach(b.dataset.uid, {}, 'Unlocked the study plan'); uiAlert(ok ? 'The learner can now set up a new plan.' : 'Check the Firestore rules are published, then try again.', { title: ok ? 'Plan unlocked' : 'Couldn’t unlock' }); load(); }); return; }
}
function onChange(e) {
  const f = e.target.dataset && e.target.dataset.f; if (!f) return;
  if (f === 'learner') { sel = +e.target.value; exSel = null; }
  else if (f === 'range') logRange = e.target.value; else if (f === 'area') logArea = e.target.value; else if (f === 'type') logType = e.target.value;
  else if (f === 'wrong') exWrongOnly = e.target.checked;
  else if (f === 'atype') { assignType = e.target.value; }
  logLimit = 150; render();
}
async function onSubmit(e) {
  const form = e.target.closest('[data-form]'); if (!form) return; e.preventDefault();
  const L = learners && learners[sel]; if (!L) return; const v = Object.fromEntries(new FormData(form)); const kind = form.dataset.form;
  const clear = keys => keys.forEach(k => { const el = form.querySelector(`[name="${k}"]`); if (el) { if (el.type === 'checkbox') el.checked = false; else el.value = ''; } });
  if (kind === 'chat') { const text = String(v.text || '').trim(); if (!text) return; clear(['text', 'popup']); if (!(await sendMsg(L.uid, text, v.popup ? 'popup' : 'chat', ''))) { form.querySelector('[name="text"]').value = text; } return; }
  if (kind === 'popup') { const text = String(v.text || '').trim(); if (!text) return; if (await sendMsg(L.uid, text, 'popup', String(v.title || '').trim())) { clear(['text', 'title']); flash = 'popup'; render(); setTimeout(() => { if (flash === 'popup') { flash = ''; render(); } }, 2500); } return; }
  if (kind === 'targets') { const t = {}; for (const k of ['hours', 'days', 'quizzes', 'mocks']) { const n = parseFloat(v[k]); if (n > 0) t[k] = n; } if (await saveCoach(L.uid, { targets: t }, `Set weekly targets: ${Object.entries(t).map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}`)) { flash = 'targets'; render(); setTimeout(() => { if (flash === 'targets') { flash = ''; render(); } }, 2500); } return; }
  if (kind === 'assign') {
    const s = L.snap || {}, type = v.type || 'topic', ref = String(v.ref || '').trim(); if (!ref) { uiAlert('Pick a topic, section, mock or write a task first.', { title: 'Choose what to assign' }); return; }
    const label = type === 'topic' ? `Topic ${ref} ${(s.topicNames || {})[ref] || ''}`.trim() : type === 'manual' ? `Manual ${ref} ${((manualList || []).find(x => x.id === ref) || {}).title || ''}`.trim() : type === 'mock' ? `Mock exam ${ref}${s.mockTitles && s.mockTitles[ref] ? ' · ' + s.mockTitles[ref] : ''}` : type === 'quiz' ? 'Complete a quick quiz' : ref;
    const item = { id: 'a' + Date.now().toString(36), type, ref: type === 'task' ? '' : ref, label: label.slice(0, 140), due: v.due || '', note: String(v.note || '').slice(0, 140), at: Date.now() };
    const cd = coachDocs[L.uid] || {};
    if (await saveCoach(L.uid, { assignments: [...(cd.assignments || []), item].slice(-100) }, `Assigned: ${item.label}${item.due ? ' (due ' + item.due + ')' : ''}`)) { clear(['note', 'due']); if (type === 'task') clear(['ref']); render(); }
    return;
  }
}
function onKey(e) { if (e.key === 'Enter' && !e.shiftKey && e.target.matches('.adm-chat-input textarea')) { e.preventDefault(); e.target.form.requestSubmit(); } }

export async function mountAdmin({ root: target, readLearners, readActivity, unlockLearner, fb }) {
  root = target; api = { readLearners, readActivity, unlockLearner, fb };
  root.onclick = onClick; root.onchange = onChange; root.onsubmit = onSubmit; root.onkeydown = onKey;
  unsubscribeAll(); chats = {}; coachDocs = {};
  clearInterval(refreshTimer);
  refreshTimer = setInterval(() => { if (!root.isConnected || !root.querySelector('.adm-portal')) { clearInterval(refreshTimer); unsubscribeAll(); return; } if (document.visibilityState === 'visible' && !busy && !root.contains(document.activeElement)) load(); }, 120e3);
  render(); await load();
}
