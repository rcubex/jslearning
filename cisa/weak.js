// JS Learning · CISA weak-spot analysis and exam-readiness forecast (v71).
// Pure functions, shared by the learner dashboard, the admin portal and the weekly email script.
//   weakReport(cisa, refs)  → weakest domains and topics from mocks, practice quizzes, logged questions and open mistakes
//   forecast(cisa, refs)    → plan pace vs exam date
// `cisa` is the learner's S.cisa object; `refs` = { syllabus, questions: Map(questionId → {domain, topicId}) }.

const DAY = 864e5;
const MIN_Q = 4; // a topic needs at least this many answered questions before it is judged

export async function loadRefs(base = './cisa/') {
  const get = async p => { const r = await fetch(base + p, { cache: 'force-cache' }); if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); };
  const [syllabus, m1, m2, normal, relaxed] = await Promise.all([get('data/syllabus.json'), get('mock-exams/mock-01.json').catch(() => null), get('mock-exams/mock-02.json').catch(() => null), get('data/normal-plan.json').catch(() => null), get('data/relaxed-plan.json').catch(() => null)]);
  return makeRefs(syllabus, [m1, m2], { normal, relaxed });
}
export function makeRefs(syllabus, mocks, templates = {}) {
  const questions = new Map();
  for (const m of mocks || []) for (const q of (m && m.questions) || []) questions.set(q.id, { domain: q.domain, topicId: q.topicId });
  const topics = new Map();
  for (const d of syllabus.domains || []) for (const t of d.topics || []) topics.set(t.id, { ...t, domain: d.id });
  return { syllabus, questions, topics, templates: templates || {} };
}

export function weakReport(cisa, refs) {
  const C = cisa || {}, S = refs.syllabus, dom = {}, top = {};
  for (const d of S.domains) dom[d.id] = { id: d.id, name: d.name, weight: d.weight, q: 0, ok: 0, mistakes: 0 };
  const addD = (d, n, ok) => { const x = dom[Number(d)]; if (x && n > 0) { x.q += n; x.ok += Math.min(ok, n); } };
  const addT = (t, n, ok) => { if (!refs.topics.has(t) || !(n > 0)) return; const x = top[t] || (top[t] = { id: t, q: 0, ok: 0, mistakes: 0 }); x.q += n; x.ok += Math.min(ok, n); };
  // mock exams (every attempt, so improvement on retakes counts)
  for (const r of C.results || []) {
    for (const [d, v] of Object.entries(r.stats || {})) addD(d, +v.total || 0, +v.correct || 0);
    for (const [t, v] of Object.entries(r.topicStats || {})) addT(t, +v.total || 0, +v.correct || 0);
  }
  // practice quizzes: dom = { domain: [right, total] }
  for (const z of C.quizzes || []) for (const [d, v] of Object.entries(z.dom || {})) if (Array.isArray(v)) addD(d, +v[1] || 0, +v[0] || 0);
  // questions the learner logged themselves
  for (const l of C.logs || []) if (+l.questions > 0) addD(l.domain, +l.questions, +l.correct || 0);
  // open mistakes (not yet cleared in the mistake review)
  let openMistakes = 0;
  for (const [id, m] of Object.entries(C.mistakes || {})) {
    if (!m || m.x) continue; const q = refs.questions.get(id); if (!q) continue; openMistakes++;
    if (dom[q.domain]) dom[q.domain].mistakes++;
    const t = top[q.topicId] || (refs.topics.has(q.topicId) ? (top[q.topicId] = { id: q.topicId, q: 0, ok: 0, mistakes: 0 }) : null); if (t) t.mistakes++;
  }
  const domains = Object.values(dom).map(d => ({ ...d, acc: d.q ? Math.round(d.ok / d.q * 100) : null }));
  const topics = Object.values(top).map(t => {
    const meta = refs.topics.get(t.id) || {};
    const acc = t.q ? Math.round(t.ok / t.q * 100) : null;
    // weakness: low accuracy (with enough answers) plus open mistakes
    const score = (t.q >= MIN_Q ? (100 - acc) : 0) + t.mistakes * 12;
    return { ...t, acc, score, title: meta.title || t.id, domain: meta.domain, section: meta.section || '', done: !!(C.complete || {})[t.id] };
  }).filter(t => t.score > 0 && (t.acc === null || t.acc < 75 || t.mistakes > 0)).sort((a, b) => b.score - a.score);
  const judged = domains.filter(d => d.q >= 10);
  const weakDomains = judged.filter(d => d.acc < 70).sort((a, b) => a.acc - b.acc);
  const strong = judged.filter(d => d.acc >= 80).sort((a, b) => b.acc - a.acc);
  const answered = domains.reduce((n, d) => n + d.q, 0);
  return { domains, weakDomains, strong, topics: topics.slice(0, 6), openMistakes, answered, enough: answered >= 20 };
}

/* ---------- exam-readiness forecast ---------- */
const ds = d => new Date(d).toISOString().slice(0, 10);
export function forecast(cisa, refs, now = Date.now()) {
  const C = cisa || {}, mode = C.planMode || 'normal';
  const plan = (C.plans && C.plans[mode]) || (refs.templates || {})[mode] || {};
  const exam = plan.examDate || (mode === 'relaxed' ? '2027-01-29' : '2027-01-13');
  const hid = new Set(Array.isArray(C.hidden) ? C.hidden : Object.keys(C.hidden || {}).filter(k => C.hidden[k]));
  const all = [...refs.topics.keys()].filter(id => !hid.has(id));
  const total = all.length || 1, done = all.filter(id => (C.complete || {})[id]).length, left = total - done;
  const examMs = Date.parse(exam + 'T00:00:00Z'), daysLeft = Math.max(0, Math.ceil((examMs - now) / DAY));
  const reviewDays = Math.max(3, +plan.reviewDays || 10);
  // finish topics by exam minus review days
  const targetMs = examMs - reviewDays * DAY, daysToTarget = Math.max(0, Math.ceil((targetMs - now) / DAY));
  // pace: topics completed in the last 14 days (completion dates from C.completeAt if present, else the activity of logs)
  const since = now - 14 * DAY;
  const cAt = C.completeAt || {};
  const estimated = !Object.keys(cAt).length;
  let recent = Object.entries(cAt).filter(([id, t]) => (C.complete || {})[id] && Date.parse(t) >= since).length;
  if (!Object.keys(cAt).length) {
    // older data has no completion dates: estimate pace from logged study days in the last 14 days
    const daysStudied = new Set((C.logs || []).filter(l => Date.parse(l.date) >= since).map(l => String(l.date).slice(0, 10))).size;
    recent = Math.round(daysStudied * 0.8);
  }
  const perDay = recent / 14;
  const need = daysToTarget > 0 ? left / daysToTarget : left > 0 ? Infinity : 0;
  const finishMs = left === 0 ? now : perDay > 0 ? now + Math.ceil(left / perDay) * DAY : null;
  let status = 'ok', msg;
  if (left === 0) { status = 'done'; msg = 'All topics are done — spend the time left on mocks and your weak spots.'; }
  else if (!perDay) { status = 'behind'; msg = `No topics completed in the last 2 weeks. You need about ${need === Infinity ? left : Math.ceil(need * 7)} topics a week to finish before the review period.`; }
  else if (finishMs > examMs) { status = 'late'; msg = `At your current pace you finish on ${fmt(finishMs)} — after the exam (${fmt(examMs)}). You need about ${Math.ceil(need * 7)} topics a week; you're doing ${Math.round(perDay * 7 * 10) / 10}.`; }
  else if (finishMs > targetMs) { status = 'behind'; msg = `At your current pace you finish on ${fmt(finishMs)}, leaving fewer than ${reviewDays} review days before the exam. Aim for ${Math.ceil(need * 7)} topics a week.`; }
  else msg = `At your current pace you finish on ${fmt(finishMs)}, with ${Math.round((examMs - finishMs) / DAY)} days left for review before the exam on ${fmt(examMs)}.`;
  if (estimated && left > 0 && perDay > 0) msg += ' (Pace is estimated from your study days; it becomes exact as you tick off topics.)';
  return { estimated, exam, examMs, daysLeft, total, done, left, perWeek: Math.round(perDay * 7 * 10) / 10, needPerWeek: need === Infinity ? left : Math.ceil(need * 7), finish: finishMs ? ds(finishMs) : null, status, msg, reviewDays };
}
function fmt(ms) { const d = new Date(ms); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(d.getUTCFullYear() !== new Date().getUTCFullYear() ? { year: 'numeric' } : {}), timeZone: 'UTC' }); }
