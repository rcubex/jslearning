// JS Learning · Monday weekly status email
// Runs in GitHub Actions (see .github/workflows/weekly-report.yml). For each learner it reads last week's study
// data from Firestore (with a Firebase service account) and emails a designed weekly report through EmailJS (same template as the admin Notify button).
//
// Secrets / environment:
//   FIREBASE_SERVICE_ACCOUNT  the full JSON of a Firebase service-account key
//   EMAILJS_SERVICE_ID        EmailJS → Email Services (e.g. service_abc123)
//   EMAILJS_TEMPLATE_ID       EmailJS → Email Templates → your JS Learning template (e.g. template_xyz789)
//   EMAILJS_PUBLIC_KEY        EmailJS → Account → General → Public Key
//   EMAILJS_PRIVATE_KEY       EmailJS → Account → General → Private Key
//   ADMIN_EMAIL   (optional)  gets a short "who was sent" summary
//   SENDER_NAME   (optional)  display name and sign-off (default: stranger)
//   TEST_TO       (optional)  send every report to this address instead of the learners (for testing)
//   DRY_RUN=1     (optional)  build the emails but don't send; writes them to ./weekly-preview/
//   FIXTURE       (optional)  path to a JSON file with sample data instead of Firestore (local testing)
import fs from 'node:fs';
import path from 'node:path';

const SITE = process.env.SITE_URL || 'https://rcubex.github.io/jslearning/';
const TZ_OFFSET_H = 4; // Dubai, UTC+4
const SENDER = process.env.SENDER_NAME || 'stranger';
const DRY = process.env.DRY_RUN === '1';
const MODE = (process.env.MODE || 'weekly').toLowerCase(); // 'weekly' (Monday report) or 'nudge' (daily 3-day check)
const NUDGE_MIN_AVG = 15, NUDGE_GAP_DAYS = 3;
const DAY = 864e5;

/* ---------- who are the learners: read the same lists the app uses ---------- */
function learnersFromApp() {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const allowed = (html.match(/const ALLOWED_USER_UIDS=\[([^\]]*)\]/) || [])[1] || '';
  const admin = (html.match(/const ADMIN_UID='([^']+)'/) || [])[1] || 'Yk0WCbGfCOfiy7fnXqMgcfxjvze2';
  const namesSrc = (html.match(/const LEARNER_NAMES=\{([^}]*)\}/) || [])[1] || '';
  const names = Object.fromEntries([...namesSrc.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
  return { admin, names, learners: [...allowed.matchAll(/'([^']+)'/g)].map(m => m[1]).filter(u => u !== admin) };
}

/* ---------- the week that just ended: Monday 00:00 → Sunday 23:59, Dubai time ---------- */
function lastWeek(now = new Date()) {
  const local = new Date(now.getTime() + TZ_OFFSET_H * 36e5);            // shift to Dubai wall-clock
  const dow = (local.getUTCDay() + 6) % 7;                               // Monday = 0
  const thisMon = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - dow * DAY;
  const start = thisMon - 7 * DAY;                                       // last Monday (Dubai midnight, as UTC date)
  const days = [...Array(7)].map((_, i) => new Date(start + i * DAY).toISOString().slice(0, 10));
  const prev = [...Array(7)].map((_, i) => new Date(start - 7 * DAY + i * DAY).toISOString().slice(0, 10));
  const startMs = start - TZ_OFFSET_H * 36e5, endMs = startMs + 7 * DAY;  // real instants for timestamps
  return { days, prev, startMs, endMs };
}

/* ---------- the last 3 full days (yesterday and the two before), Dubai time ---------- */
function last3(now = new Date()) {
  const local = new Date(now.getTime() + TZ_OFFSET_H * 36e5);
  const today = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const days = [3, 2, 1].map(i => new Date(today - i * DAY).toISOString().slice(0, 10));
  const prev = [6, 5, 4].map(i => new Date(today - i * DAY).toISOString().slice(0, 10));
  const startMs = today - 3 * DAY - TZ_OFFSET_H * 36e5;
  return { days, prev, startMs, endMs: startMs + 3 * DAY };
}

/* ---------- nudge emails (same EmailJS template as Notify) ---------- */
function nudgeMail(kind, name, s) {
  const P = t => `<p style="margin:0 0 14px;">${t}</p>`;
  if (kind === 'idle') return {
    subject: 'Hey ' + name + ', what happened? 👀',
    heading: 'What happened?',
    pre: 'No study in the last 3 days — let’s get moving again.',
    html: P('We haven’t seen you studying for the last <b>3 days</b>. What happened? Are you feeling demotivated, a little lazy, or not feeling well?')
      + P('If you’re not feeling well, that’s completely okay — rest and get better first. 💙')
      + P('But if it’s laziness or low motivation: stand up, go for a short walk, take a few deep breaths, and then open just <b>one lesson</b>. Twenty minutes is enough to restart the habit.')
      + P('<b>We have to grow.</b> Small steps every day add up. 🌱'),
    cta: ['Start a 20-minute session', SITE + '#dashboard'] };
  return {
    subject: name + ', you’re studying less — let’s step it up 💪',
    heading: 'Dude, you’re studying less',
    pre: `Only about ${s.avg} min a day over the last 3 days.`,
    html: P(`Over the last 3 days you studied about <b>${s.avg} minutes a day</b> (${s.mins} min in total). That’s below the ${NUDGE_MIN_AVG}-minute minimum.`)
      + P('You’ve started — that’s good. Now push a little harder: aim for <b>30 focused minutes</b> today. Put your phone away, open the next topic, and go.')
      + P('<b>Study more and grow.</b> Your future self will thank you. 🚀'),
    cta: ['Continue studying', SITE + '#dashboard'] };
}
async function runNudges(store, learners, send, names = {}) {
  const W3 = last3(), out = [];
  console.log(`Nudge check for ${W3.days[0]} → ${W3.days[2]} · ${learners.length} learner(s)${DRY ? ' · DRY RUN' : ''}`);
  for (const uid of learners) {
    try {
      const [progress, act, coach] = await Promise.all([store.get('progress/' + uid), store.get('activity/' + uid), store.get('coach/' + uid)]);
      const email = act && act.email;
      if (!email) { out.push(`${uid.slice(0, 8)}… skipped (never signed in)`); continue; }
      if (coach && coach.access && coach.access.blocked) { out.push(`${email} skipped (blocked)`); continue; }
      const last = coach && coach.nudgeAt || 0;
      if (Date.now() - last < NUDGE_GAP_DAYS * DAY - 36e5) { out.push(`${email} skipped (nudged ${Math.round((Date.now() - last) / 36e5)} h ago)`); continue; }
      const [days, grc] = await Promise.all([store.list('activity/' + uid + '/days'), store.list('users/' + uid + '/grcProgress')]);
      const st = weekStats(uid, { progress, days, grc }, W3), mins = st.mins, avg = Math.round(mins / 3);
      const kind = mins === 0 ? 'idle' : avg < NUDGE_MIN_AVG ? 'low' : null;
      if (!kind) { out.push(`${email} fine (${avg} min/day)`); continue; }
      const name = names[uid] || email.split('@')[0], m = nudgeMail(kind, name, { mins, avg }), to = process.env.TEST_TO || email;
      if (DRY) { fs.mkdirSync('weekly-preview', { recursive: true }); fs.writeFileSync(path.join('weekly-preview', 'nudge-' + uid + '.json'), JSON.stringify(m, null, 1)); }
      else { await send(to, name, m.subject, m.heading, m.pre, m.html, m.cta); await store.note(uid, kind === 'idle' ? 'Nudge emailed: no study for 3 days' : `Nudge emailed: low study (${avg} min/day over 3 days)`, { nudgeAt: Date.now(), nudgeKind: kind }); }
      out.push(`${email} ${DRY ? 'would get' : 'sent'} "${kind === 'idle' ? 'what happened?' : 'studying less'}" (${avg} min/day)`); console.log('  ' + out[out.length - 1]);
    } catch (e) { console.error('  failed for', uid, e.message); out.push(`${uid.slice(0, 8)}… FAILED: ${e.message}`); process.exitCode = 1; }
  }
  console.log(out.join('\n'));
}

/* ---------- data access (Firestore, or a fixture file for local testing) ---------- */
async function makeStore() {
  if (process.env.FIXTURE) {
    const fx = JSON.parse(fs.readFileSync(process.env.FIXTURE, 'utf8'));
    return { get: async p => fx[p] ?? null, list: async p => Object.entries(fx).filter(([k]) => k.startsWith(p + '/') && k.split('/').length === p.split('/').length + 1).map(([k, v]) => ({ id: k.split('/').pop(), ...v })), note: async () => { }, close: async () => { } };
  }
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (!sa.project_id) throw new Error('FIREBASE_SERVICE_ACCOUNT secret is missing or not valid JSON.');
  const db = getFirestore(initializeApp({ credential: cert(sa) }));
  return {
    get: async p => { const s = await db.doc(p).get(); return s.exists ? s.data() : null; },
    list: async p => (await db.collection(p).get()).docs.map(d => ({ id: d.id, ...d.data() })),
    note: async (uid, what, extra = { weeklySentAt: Date.now() }) => { await db.doc('coach/' + uid).set({ audit: FieldValue.arrayUnion({ at: Date.now(), what }), ...extra }, { merge: true }); },
    close: async () => { }
  };
}

/* ---------- weak spots + exam forecast (shared with the app: cisa/weak.js) ---------- */
let WEAK = null;
async function loadWeak() {
  if (WEAK) return WEAK;
  const rd = p => fs.readFileSync(new URL('../cisa/' + p, import.meta.url), 'utf8');
  const M = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(rd('weak.js')));
  const js = p => { try { return JSON.parse(rd(p)); } catch (e) { return null; } };
  WEAK = { M, refs: M.makeRefs(js('data/syllabus.json'), [js('mock-exams/mock-01.json'), js('mock-exams/mock-02.json')], { normal: js('data/normal-plan.json'), relaxed: js('data/relaxed-plan.json') }) };
  return WEAK;
}

/* ---------- metrics ---------- */
function weekStats(uid, data, W) {
  const P = data.progress || {}, C = P.cisa || {}, rows = [];
  for (const d of data.days) if (d && d.r && /^\d{4}-\d{2}-\d{2}$/.test(d.id)) rows.push(...Object.values(d.r));
  const inW = (ds, list) => list.includes(ds);
  const secBy = {}; for (const r of rows) if (r && r.k === 't') secBy[r.d] = (secBy[r.d] || 0) + (+r.sec || 0);
  const logBy = {}; for (const e of (P.log || [])) logBy[e.d] = (logBy[e.d] || 0) + (+e.m || 0) * 60;          // study log minutes
  for (const e of (C.logs || [])) { const ds = String(e.date || '').slice(0, 10); logBy[ds] = (logBy[ds] || 0) + (+e.minutes || 0) * 60; } // CISA recorder
  const minsOn = ds => Math.round(Math.max(secBy[ds] || 0, logBy[ds] || 0) / 60);   // tracked time, or logged time if larger
  const daily = W.days.map(ds => ({ ds, m: minsOn(ds) })), prevDaily = W.prev.map(ds => minsOn(ds));
  const mins = daily.reduce((a, x) => a + x.m, 0), prevMins = prevDaily.reduce((a, b) => a + b, 0);
  const active = daily.filter(x => x.m >= 5).length, prevActive = prevDaily.filter(m => m >= 5).length;
  // areas by time
  const areaSec = {}; for (const r of rows) if (r && r.k === 't' && inW(r.d, W.days)) { const a = String(r.a || 'Other').split(' · ')[0]; areaSec[a] = (areaSec[a] || 0) + (+r.sec || 0); }
  const areas = Object.entries(areaSec).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([a, s]) => ({ a, m: Math.round(s / 60) }));
  // things done
  const ev = rows.filter(r => r && r.k === 'e' && inW(r.d, W.days)).map(r => String(r.x || ''));
  const aiLessons = (data.grc || []).filter(x => /^a[ib]\d+-l\d+$/.test(x.id) && x.done && x._t >= W.startMs && x._t < W.endMs).length;
  const manWeek = Object.values(C.manRead || {}).filter(d => inW(String(d).slice(0, 10), W.days)).length;
  const topicsWeek = ev.filter(x => /topic.*complete|complete.*topic|marked .* complete/i.test(x)).length;
  const lessonsWeek = ev.filter(x => /complet(ed)? lesson|lesson .*complete/i.test(x)).length;
  const resW = (C.results || []).filter(r => inW(String(r.date || '').slice(0, 10), W.days));
  const mocksWeek = resW.length, mockBest = resW.reduce((a, r) => Math.max(a, r.total ? Math.round(r.correct / r.total * 100) : 0), 0);
  const logsW = (C.logs || []).filter(l => inW(String(l.date || '').slice(0, 10), W.days));
  const qWeek = logsW.reduce((a, l) => a + (+l.questions || 0), 0), qRight = logsW.reduce((a, l) => a + (+l.correct || 0), 0);
  const reviews = (data.grc || []).filter(x => /^rv-/.test(x.id)).reduce((a, x) => a + ((x.log || []).filter(l => { const t = Date.parse(l.at); return t >= W.startMs && t < W.endMs; }).length), 0);
  // totals
  const techDone = Object.values(P.ls || {}).filter(Boolean).length;
  const cisaDone = Object.values(C.complete || {}).filter(Boolean).length, manDone = Object.keys(C.manRead || {}).length;
  const aiDone = (data.grc || []).filter(x => /^a[ib]\d+-l\d+$/.test(x.id) && x.done).length;
  const fc = WEAK ? WEAK.M.forecast(C, WEAK.refs) : null, weak = WEAK ? WEAK.M.weakReport(C, WEAK.refs) : null;
  const exam = fc ? fc.exam : '2027-01-13';
  const daysToExam = exam ? Math.max(0, Math.round((Date.parse(exam + 'T00:00:00Z') - Date.now()) / DAY)) : null;
  // streak (consecutive active days up to Sunday)
  let streak = 0; for (let i = daily.length - 1; i >= 0 && daily[i].m >= 5; i--) streak++;
  return { fc, weak, mins, prevMins, active, prevActive, daily, areas, aiLessons, manWeek, topicsWeek, lessonsWeek, mocksWeek, mockBest, qWeek, qRight, reviews, techDone, cisaDone, manDone, aiDone, exam, daysToExam, locked: !!(C.planLock && C.planLock.locked), mode: C.planMode, streak, best: daily.reduce((a, x) => x.m > a.m ? x : a, { m: 0 }) };
}

/* ---------- copy ---------- */
const hms = m => m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`;
const hm = m => m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + ' min' : ''}`.trim() : `${m} min`;
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dayName = ds => new Date(ds + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
const fmtDate = ds => new Date(ds + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
function headline(s) {
  if (s.mins === 0) return ['A fresh start this week', 'You didn’t log any study time last week. A short session today gets you moving again — even 20 minutes counts.'];
  if (s.mins >= s.prevMins * 1.2 && s.prevMins > 0) return ['Great week — you stepped it up', `You studied ${hm(s.mins)}, up from ${hm(s.prevMins)} the week before. Keep this rhythm going.`];
  if (s.active >= 5) return ['Consistent week — well done', `You studied on ${s.active} days. Steady, regular sessions are exactly what builds lasting knowledge.`];
  if (s.mins < s.prevMins * 0.7) return ['Let’s get back on track', `You studied ${hm(s.mins)}, less than the ${hm(s.prevMins)} the week before. Plan two short sessions in the next few days to catch up.`];
  return ['Here’s your week in review', `You studied ${hm(s.mins)} across ${s.active} day${s.active === 1 ? '' : 's'}. Here’s how it went and what to focus on next.`];
}
function focusList(s) {
  const out = [];
  const wt = s.weak && s.weak.topics[0], wd = s.weak && s.weak.weakDomains[0];
  if (wt || wd) out.push([wt ? `Fix your weakest topic: ${wt.id}` : `Strengthen Domain ${wd.id}`, wt ? `${wt.title} — ${wt.acc === null ? '' : wt.acc + '% correct'}${wt.mistakes ? `${wt.acc === null ? '' : ', '}${wt.mistakes} open mistake${wt.mistakes === 1 ? '' : 's'}` : ''}. Re-read it and redo the questions you missed.` : `${wd.name} — only ${wd.acc}% correct so far. Spend one session on its topics.`, SITE + '#cisa', 'Review mistakes']);
  if (s.fc && (s.fc.status === 'late' || s.fc.status === 'behind')) out.push(['Speed up your CISA plan', `You need about ${s.fc.needPerWeek} topics a week; you're doing ${s.fc.perWeek}.`, SITE + '#cisa', 'Open study plan']);
  if (s.active < 4) out.push(['Study on at least 4 days', 'Short daily sessions beat one long one. Aim for 30 minutes on four days this week.', SITE + '#dashboard', 'Plan a session']);
  if (s.daysToExam !== null) out.push([`CISA exam in ${s.daysToExam} days`, s.locked ? 'Follow your locked plan and clear today’s topics in the CISA Hub.' : 'Set up and lock your study plan so every week has clear targets.', SITE + '#cisa', 'Open CISA Hub']);
  if (s.reviews === 0 && s.aiDone > 0) out.push(['Do your spaced reviews', 'A 3-minute review of finished AI modules helps you remember what you learned.', SITE + '#aic-review', 'Start review']);
  out.push(['Keep your flashcards fresh', 'Run through the cards that are due — it takes five minutes.', SITE + '#flash', 'Review flashcards']);
  return out.slice(0, 3);
}

/* ---------- email HTML (email-safe: tables + inline styles) ---------- */
function emailHTML(name, s, W, part = false) {
  const [h1, lead] = headline(s), F = 'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;';
  const maxM = Math.max(30, ...s.daily.map(x => x.m)), trend = s.prevMins ? Math.round((s.mins - s.prevMins) / s.prevMins * 100) : null;
  const arrow = d => d > 0 ? `<span style="color:#16a34a;">▲ ${d}</span>` : d < 0 ? `<span style="color:#dc2626;">▼ ${Math.abs(d)}</span>` : '<span style="color:#8a94a6;">=</span>';
  const stat = (v, l, extra = '') => `<td width="25%" valign="top" style="padding:6px;height:100%;"><table role="presentation" width="100%" height="100%" cellpadding="0" cellspacing="0" style="height:100%;min-height:96px;background:#f6f8fb;border:1px solid #e8ecf2;border-radius:12px;"><tr><td valign="top" style="padding:14px 14px 12px;${F}"><div style="font-size:22px;white-space:nowrap;font-weight:700;color:#0A2540;letter-spacing:-.3px;">${v}</div><div style="font-size:12px;color:#6b7686;margin-top:2px;">${l}</div>${extra ? `<div style="font-size:11.5px;margin-top:4px;">${extra}</div>` : ''}</td></tr></table></td>`;
  const bars = s.daily.map(x => { const hgt = x.m ? Math.max(6, Math.round(x.m / maxM * 90)) : 3; return `<td align="center" valign="bottom" style="padding:0 5px;${F}"><div style="font-size:11px;color:#6b7686;height:16px;">${x.m ? x.m : ''}</div><table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="width:28px;height:${hgt}px;background:${x.m ? (x === s.best ? '#0A84FF' : '#9cc8ff') : '#e8ecf2'};border-radius:6px 6px 2px 2px;font-size:0;line-height:0;">&nbsp;</td></tr></table><div style="font-size:11.5px;color:#33415c;margin-top:6px;font-weight:600;">${dayName(x.ds)}</div></td>`; }).join('');
  const done = [[s.lessonsWeek + s.aiLessons, 'lessons completed'], [s.topicsWeek, 'CISA topics completed'], [s.manWeek, 'manual sections read'], [s.mocksWeek, 'mock exam' + (s.mocksWeek === 1 ? '' : 's') + ' finished' + (s.mockBest ? ` (best ${s.mockBest}%)` : '')], [s.qWeek, 'practice questions' + (s.qWeek ? ` (${Math.round(s.qRight / s.qWeek * 100)}% correct)` : '')], [s.reviews, 'module reviews done']].filter(x => x[0] > 0);
  const prog = [['Technical Academy', s.techDone, 243, '#0A84FF'], ['CISA topics', s.cisaDone, 60, '#8e5cf7'], ['CISA manual', s.manDone, 60, '#ff9500'], ['AI Compliance lessons', s.aiDone, 246, '#34c759']];
  const progRow = ([n, v, of, c]) => { const p = Math.min(100, Math.round(v / of * 100)); return `<tr><td style="padding:7px 0;${F}font-size:13.5px;color:#33415c;" width="44%">${n}</td><td style="padding:7px 10px;" width="40%"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;border-radius:4px;"><tr><td width="${Math.max(p, 1)}%" style="background:${c};height:8px;border-radius:4px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table></td><td align="right" style="${F}font-size:13px;color:#0A2540;font-weight:600;" width="16%">${v}<span style="color:#8a94a6;font-weight:400;"> / ${of}</span></td></tr>`; };
  const btn = (t, u, primary) => `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;margin:4px;"><tr><td bgcolor="${primary ? '#0A84FF' : '#ffffff'}" style="border-radius:10px;${primary ? 'background:#0A84FF;' : 'border:1px solid #d8dee8;'}"><a href="${u}" target="_blank" style="display:inline-block;padding:11px 20px;${F}font-size:14px;font-weight:600;color:${primary ? '#ffffff' : '#0A2540'};text-decoration:none;">${t}</a></td></tr></table>`;
  const focus = focusList(s).map(([t, d, u, b]) => `<tr><td style="padding:10px 0;border-top:1px solid #eef1f6;${F}"><div style="font-size:14px;font-weight:600;color:#0A2540;">${esc(t)}</div><div style="font-size:13px;color:#5b6577;margin-top:2px;line-height:1.45;">${esc(d)}</div></td><td align="right" style="padding:10px 0 10px 12px;border-top:1px solid #eef1f6;white-space:nowrap;"><a href="${u}" style="${F}font-size:13px;font-weight:600;color:#0A84FF;text-decoration:none;">${esc(b)} →</a></td></tr>`).join('');
  const inner = ` <tr><td class="pad" style="padding:18px ${part ? 0 : 26}px 0;"><table role="presentation" class="st" width="100%" cellpadding="0" cellspacing="0"><tr>
   ${stat(hms(s.mins), 'studied', trend === null ? '' : arrow(trend) + '<span style="color:#8a94a6;">% vs last wk</span>')}${stat(s.active + ' / 7', 'active days', arrow(s.active - s.prevActive) + '<span style="color:#8a94a6;"> vs last wk</span>')}${stat(s.streak, 'day streak', s.streak >= 3 ? '<span style="color:#f97316;">● keep it up</span>' : '<span style="color:#8a94a6;">study today</span>')}${stat(s.daysToExam === null ? '—' : s.daysToExam, 'days to exam', s.exam ? '<span style="color:#8a94a6;">' + fmtDate(s.exam) + '</span>' : '')}
 </tr></table></td></tr>
 <tr><td class="pad" style="padding:22px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;">Study time by day</div><div style="font-size:12.5px;color:#8a94a6;margin-top:2px;">Minutes per day${s.best.m ? ` · best day ${dayName(s.best.ds)} (${hm(s.best.m)})` : ''}</div></td></tr>
 <tr><td class="pad" style="padding:12px ${part ? 0 : 26}px 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafbfc;border:1px solid #eef1f6;border-radius:12px;"><tr><td style="padding:14px 10px 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="height:130px;"><tr>${bars}</tr></table></td></tr></table></td></tr>
 ${done.length ? `<tr><td class="pad" style="padding:22px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;">What you got done</div><table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px;">${done.map(([n, l]) => `<tr><td style="padding:4px 0;${F}font-size:14px;color:#33415c;"><span style="display:inline-block;min-width:34px;font-weight:700;color:#0A84FF;">${n}</span>${l}</td></tr>`).join('')}</table></td></tr>` : ''}
 ${s.areas.length ? `<tr><td class="pad" style="padding:18px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;">Where your time went</div><div style="font-size:13.5px;color:#4a5568;margin-top:6px;line-height:1.7;">${s.areas.map(x => `${esc(x.a)} <b style="color:#0A2540;">${hm(x.m)}</b>`).join(' &nbsp;·&nbsp; ')}</div></td></tr>` : ''}
 <tr><td class="pad" style="padding:22px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;">Overall progress</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;">${prog.map(progRow).join('')}</table></td></tr>
 ${s.fc ? `<tr><td class="pad" style="padding:22px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;">Exam readiness</div>
   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;background:${{ ok: '#f0fdf4', done: '#f0fdf4', behind: '#fff7ed', late: '#fef2f2' }[s.fc.status]};border:1px solid ${{ ok: '#bbf7d0', done: '#bbf7d0', behind: '#fed7aa', late: '#fecaca' }[s.fc.status]};border-radius:12px;"><tr><td style="padding:12px 14px;${F}">
   <div style="font-size:14px;font-weight:700;color:${{ ok: '#15803d', done: '#15803d', behind: '#c2410c', late: '#b91c1c' }[s.fc.status]};">${{ ok: '✓ On track for the exam', done: '✓ Syllabus finished', behind: '⚠ Falling behind the plan', late: '⚠ Not on track for the exam date' }[s.fc.status]}</div>
   <div style="font-size:13.5px;color:#33415c;margin-top:4px;line-height:1.5;">${esc(s.fc.msg)}</div></td></tr></table>
   ${s.weak && (s.weak.weakDomains.length || s.weak.topics.length) ? `<div style="font-size:13px;color:#6b7686;margin:12px 0 4px;">Your weak spots</div><table role="presentation" cellpadding="0" cellspacing="0">${[...s.weak.weakDomains.slice(0, 2).map(d => [d.acc + '%', `<b>Domain ${d.id}</b> · ${esc(d.name)}`]), ...s.weak.topics.slice(0, 3).map(t => [t.acc === null ? '—' : t.acc + '%', `<b>${esc(t.id)}</b> · ${esc(t.title)}${t.mistakes ? ` <span style="color:#b91c1c;">(${t.mistakes} open mistake${t.mistakes === 1 ? '' : 's'})</span>` : ''}`])].map(([p, t]) => `<tr><td valign="top" style="padding:3px 10px 3px 0;"><span style="display:inline-block;min-width:38px;text-align:center;font-size:12px;font-weight:700;color:#b91c1c;background:#fee2e2;border-radius:6px;padding:2px 4px;${F}">${p}</span></td><td style="padding:3px 0;${F}font-size:13.5px;color:#33415c;line-height:1.4;">${t}</td></tr>`).join('')}</table>` : ''}
 </td></tr>` : ''}
 <tr><td class="pad" style="padding:22px ${part ? 0 : 32}px 0;${F}"><div style="font-size:15px;font-weight:700;color:#0A2540;margin-bottom:4px;">Focus for this week</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${focus}</table></td></tr>
 <tr><td class="pad" align="center" style="padding:24px ${part ? 0 : 26}px 6px;">${part ? '' : btn('Continue studying →', SITE + '#dashboard', true)}${btn('Open CISA Hub', SITE + '#cisa')}${btn('Study insights', SITE + '#insights')}</td></tr>
`;
  if (part) return `<p style="margin:0 0 6px;">${esc(lead)}</p><p style="margin:0 0 4px;font-size:13px;color:#8a94a6;">Week of ${fmtDate(W.days[0])} – ${fmtDate(W.days[6])}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -6px;width:calc(100% + 12px);">${inner}</table>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Your week on JS Learning</title>
<style>@media (max-width:600px){.card{border-radius:0!important}.pad{padding-left:20px!important;padding-right:20px!important}.st td{display:block!important;width:100%!important}}</style></head>
<body style="margin:0;padding:0;background:#f2f3f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(hm(s.mins))} studied · ${s.active} active days · ${esc(h1)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f5;"><tr><td align="center" style="padding:28px 10px;">
<table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e3e6eb;border-radius:14px;overflow:hidden;">
 <tr><td style="background:#f6f7f9;border-bottom:1px solid #e9ecf1;padding:11px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="70" style="font-size:0;line-height:0;"><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#ff5f57;margin-right:7px;"></span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#febc2e;margin-right:7px;"></span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#28c840;"></span></td><td align="center" style="${F}font-size:13px;font-weight:600;color:#5b6577;">Weekly report · ${fmtDate(W.days[0])} – ${fmtDate(W.days[6])}</td><td width="70"></td></tr></table></td></tr>
 <tr><td class="pad" style="padding:28px 32px 4px;${F}"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td><img src="${SITE}icons/icon-192.png" width="44" height="44" alt="JS Learning" style="display:block;border-radius:11px;border:0;"></td><td style="padding-left:12px;${F}font-size:13px;color:#6b7686;">Hi ${esc(name)},<br><b style="color:#0A2540;">your week on JS Learning</b></td></tr></table>
   <h1 style="margin:22px 0 6px;font-size:26px;line-height:1.2;font-weight:800;letter-spacing:-.5px;color:#0A2540;">${esc(h1)}</h1><p style="margin:0;font-size:15px;line-height:1.55;color:#4a5568;">${esc(lead)}</p></td></tr>
${inner} <tr><td class="pad" style="padding:18px 32px 28px;${F}font-size:14px;color:#33415c;line-height:1.5;border-top:1px solid #f0f2f6;">Keep going,<br><b style="color:#f97316;">${esc(SENDER)}</b></td></tr>
</table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;"><tr><td align="center" style="padding:16px 20px 0;${F}font-size:12px;line-height:1.6;color:#7b8598;">You get this report every Monday because you study on JS Learning.<br>Reply to this email to contact your admin.</td></tr></table>
</td></tr></table></body></html>`;
}
function emailText(name, s, W) {
  const [h1, lead] = headline(s);
  return `Hi ${name},\n\n${h1}\n${lead}\n\nLast week (${fmtDate(W.days[0])} – ${fmtDate(W.days[6])})\n- Studied: ${hm(s.mins)} (previous week ${hm(s.prevMins)})\n- Active days: ${s.active}/7\n- Day streak: ${s.streak}\n${s.daysToExam !== null ? `- CISA exam in ${s.daysToExam} days\n` : ''}\nOverall: Technical ${s.techDone}/243 · CISA topics ${s.cisaDone}/60 · Manual ${s.manDone}/60 · AI lessons ${s.aiDone}/246\n\nContinue studying: ${SITE}\n\nKeep going,\n${SENDER}`;
}

/* ---------- main ---------- */
async function main() {
  try { await loadWeak(); } catch (e) { console.warn('weak spots unavailable:', e.message); }
  const { admin, learners, names } = learnersFromApp(), W = lastWeek(), store = await makeStore();
  if (MODE !== 'nudge') console.log(`Week ${W.days[0]} → ${W.days[6]} · ${learners.length} learner(s)${DRY ? ' · DRY RUN' : ''}`);
  const EJ = { service: process.env.EMAILJS_SERVICE_ID, template: process.env.EMAILJS_TEMPLATE_ID, pub: process.env.EMAILJS_PUBLIC_KEY, priv: process.env.EMAILJS_PRIVATE_KEY };
  if (!DRY && !(EJ.service && EJ.template && EJ.pub && EJ.priv)) throw new Error('EmailJS secrets missing: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY are all required.');
  // EmailJS REST API (needs "Allow EmailJS API for non-browser applications" in EmailJS → Account → Security)
  const send = async (to, toName, subject, heading, preheader, messageHtml, cta = ['Continue studying', SITE + '#dashboard']) => {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      service_id: EJ.service, template_id: EJ.template, user_id: EJ.pub, accessToken: EJ.priv,
      template_params: { to_email: to, to_name: toName, subject, heading, preheader, message: preheader, message_html: messageHtml, cta_text: cta[0], cta_url: cta[1], site: SITE, sender_name: SENDER } }) });
    if (!r.ok) throw new Error('EmailJS ' + r.status + ': ' + (await r.text()).slice(0, 200));
  };
  if (MODE === 'nudge') return runNudges(store, learners, send, names);
  const summary = [];
  for (const uid of learners) {
    try {
      const [progress, act, coach] = await Promise.all([store.get('progress/' + uid), store.get('activity/' + uid), store.get('coach/' + uid)]);
      const email = act && act.email;
      if (!email) { summary.push(`• ${uid.slice(0, 8)}… — skipped (no email yet; the learner hasn’t signed in)`); continue; }
      if (coach && coach.access && coach.access.blocked) { summary.push(`• ${email} — skipped (blocked)`); continue; }
      const [days, grc] = await Promise.all([store.list('activity/' + uid + '/days'), store.list('users/' + uid + '/grcProgress')]);
      const s = weekStats(uid, { progress, days, grc }, W), name = names[uid] || email.split('@')[0];
      const subject = `Your week on JS Learning: ${hm(s.mins)} · ${s.active} active day${s.active === 1 ? '' : 's'}`;
      const html = emailHTML(name, s, W), text = emailText(name, s, W), to = process.env.TEST_TO || email;
      if (DRY) { fs.mkdirSync('weekly-preview', { recursive: true }); fs.writeFileSync(path.join('weekly-preview', uid + '.html'), html); console.log(`  [dry] ${email}: ${subject}`); }
      else { const [h1] = headline(s); await send(to, name, subject, h1, `${hm(s.mins)} studied · ${s.active} active days`, emailHTML(name, s, W, true)); await store.note(uid, `Weekly report emailed (${hm(s.mins)}, ${s.active} active days)`); console.log(`  sent → ${to}: ${subject}`); }
      summary.push(`• ${email} — ${hm(s.mins)}, ${s.active}/7 active days (prev. ${hm(s.prevMins)})${s.daysToExam !== null ? `, CISA exam in ${s.daysToExam} days` : ''}`);
    } catch (e) { console.error('  failed for', uid, e.message); summary.push(`• ${uid.slice(0, 8)}… — FAILED: ${e.message}`); process.exitCode = 1; }
  }
  if (!DRY && process.env.ADMIN_EMAIL) {
    const list = summary.map(x => `<li style="margin:0 0 6px;">${esc(x.replace(/^• /, ''))}</li>`).join('');
    try { await send(process.env.ADMIN_EMAIL, 'admin', `Weekly reports sent · ${fmtDate(W.days[0])} – ${fmtDate(W.days[6])}`, 'Weekly reports sent', `${learners.length} learner(s)`, `<p style="margin:0 0 10px;">Here’s who got their weekly report this Monday:</p><ul style="padding-left:18px;margin:0;">${list}</ul>`, ['Open admin portal', SITE + '#admin']); }
    catch (e) { console.error('admin summary failed', e.message); }
  }
  console.log(summary.join('\n'));
  await store.close();
}
// Also write the result to the run's Summary page (visible even when GitHub can't load the step log)
const ghSummary = t => { try { if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, t + '\n'); } catch (e) { } };
const _log = console.log; console.log = (...a) => { _log(...a); ghSummary('    ' + a.join(' ').split('\n').join('\n    ')); };
ghSummary(`### JS Learning emails · mode: ${MODE}${process.env.TEST_TO ? ' · test to ' + process.env.TEST_TO : ''}\n`);
main().catch(e => { console.error(e); ghSummary(`\n**❌ Failed:** ${String(e && e.message || e)}\n`); process.exit(1); });
