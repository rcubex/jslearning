/* JS Learning · learner side of admin coaching
   - Popup messages from the admin: shown at once while signed in (live), or at the next sign-in.
   - Live chat with the admin (floating chat button).
   - "From your admin" card: weekly targets and assigned work (dashboard + CISA overview).
   - Remote sign-out requested by the admin.
   Firestore: chats/{uid}/messages/{id}, coach/{uid}. */

export const VERSION = '43';
let fb, uid, getS, saveS, onRemoteSignOut, startedAt = 0, unsubs = [], timers = [], observer = null;
let msgs = [], coach = null, chatOpen = false, firstMsgs = true, shownPopups = new Set(), popupOpen = null, week = { app: 0, days: new Set(), loaded: false };
let rootEl = null; const tst = { sel: null, editing: null }; let expiryTimer = null;

const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p2 = n => String(n).padStart(2, '0');
const ds = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const asDate = s => new Date(s + 'T12:00:00');
const addDays = (s, n) => { const d = asDate(s); d.setDate(d.getDate() + n); return ds(d); };
const today = () => ds(new Date());
const mondayOf = s => { const d = asDate(s), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return ds(d); };
const timeOf = ms => new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const whenOf = ms => { const d = new Date(ms); return ds(d) === today() ? timeOf(ms) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + timeOf(ms); };
const fmtDue = s => asDate(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const linkify = t => h(t).replace(/\n/g, '<br>');

/* ---------- shared rules (the admin portal uses the same definitions) ---------- */
export function assignmentStatus(a, S, doneMap) {
  const c = (S && S.cisa) || {}, since = a.at || 0;
  let done = false;
  if (a.type === 'topic') done = !!(c.complete && c.complete[a.ref]);
  else if (a.type === 'manual') done = !!(c.manRead && c.manRead[a.ref]);
  else if (a.type === 'mock') done = (c.results || []).some(r => String(r.mockId) === String(a.ref) && +new Date(r.date) >= since);
  else if (a.type === 'quiz') done = (c.quizzes || []).some(q => +new Date(q.at) >= since && !q.partial);
  else done = !!((doneMap || (S && S.coachDone) || {})[a.id]);
  const overdue = !done && a.due && a.due < today();
  return done ? 'done' : overdue ? 'overdue' : 'open';
}
export function targetProgress(S, actRows, from, to) {
  const c = (S && S.cisa) || {};
  const inR = d => d >= from && d <= to;
  let app = 0; const days = new Set();
  for (const r of actRows || []) if (inR(r.d)) { if (r.k === 't') { app += r.sec || 0; if ((r.sec || 0) >= 60) days.add(r.d); } }
  let outside = 0; for (const l of c.logs || []) if (inR(l.date)) { if (l.notes !== 'Focus timer session') outside += (+l.minutes || 0) * 60; days.add(l.date); }
  const quizzes = (c.quizzes || []).filter(q => q.at && inR(ds(new Date(q.at))) && !q.partial).length;
  const m2from = addDays(to, -13);
  const mocks = (c.results || []).filter(r => r.date && ds(new Date(r.date)) >= m2from && ds(new Date(r.date)) <= to).length;
  return { hours: (app + outside) / 3600, days: days.size, quizzes, mocks };
}

/* ---------- data ---------- */
async function loadWeek() {
  try {
    const from = mondayOf(today());
    const snap = await fb.getDocs(fb.query(fb.collection(fb.fdb, 'activity', uid, 'days'), fb.where('d', '>=', from)));
    const rows = []; snap.forEach(x => { const r = (x.data() || {}).r || {}; for (const v of Object.values(r)) rows.push(v); });
    week = { rows, loaded: true };
  } catch (e) { week = { rows: [], loaded: true }; }
  renderCard();
}
const msgRef = id => fb.doc(fb.fdb, 'chats', uid, 'messages', id);
async function markSeen(list) { for (const m of list) { try { await fb.updateDoc(msgRef(m.id), { seenAt: Date.now() }); } catch (e) { } } }

/* ---------- shared message thread (also used by the admin portal) ---------- */
const SEND_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
export const EDIT_WINDOW = 5 * 60e3;
export const canChange = (m, me) => !!m && m.from === me && !m.deleted && Date.now() - m.at < EDIT_WINDOW;
const minsLeft = m => Math.max(1, Math.ceil((EDIT_WINDOW - (Date.now() - m.at)) / 60e3));
export function threadHTML(list, me, opts = {}) {
  if (!list.length) return `<div class="lc-empty"><div class="lc-empty-ic" aria-hidden="true">${CHAT_ICON}</div><b>${h(opts.emptyTitle || 'No messages yet')}</b><span>${h(opts.empty || '')}</span></div>`;
  const sel = opts.sel || null, editing = opts.editing || null;
  const lastMine = [...list].reverse().find(m => m.from === me && m.kind !== 'popup' && !m.deleted);
  const actions = m => canChange(m, me) && (sel === m.id) && editing !== m.id ? `<div class="lc-acts ${m.kind === 'popup' ? 'center' : ''}"><button type="button" data-msg="edit" data-id="${h(m.id)}">Edit</button><button type="button" data-msg="del" data-id="${h(m.id)}" class="del">${m.kind === 'popup' && !m.seenAt ? 'Cancel popup' : 'Delete'}</button><span>${minsLeft(m)} min left</span></div>` : '';
  const editor = m => `<form class="lc-edit" data-msg-form="${h(m.id)}"><textarea rows="2" maxlength="2000" data-keep="edit-${h(m.id)}" aria-label="Edit message">${h(m.text)}</textarea><div><button type="button" data-msg="cancel">Cancel</button><button type="submit" class="pri">Save</button></div></form>`;
  const edited = m => m.editedAt ? '<i class="lc-edited">Edited</i>' : '';
  let out = '', prev = null;
  list.forEach((m, i) => {
    const next = list[i + 1];
    if (!prev || m.at - prev.at > 15 * 60e3 || new Date(m.at).toDateString() !== new Date(prev.at).toDateString()) {
      const d = new Date(m.at), td = ds(d) === today(), yd = ds(d) === addDays(today(), -1);
      out += `<div class="lc-stamp"><b>${td ? 'Today' : yd ? 'Yesterday' : h(d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))}</b> ${h(timeOf(m.at))}</div>`;
    }
    const mine = m.from === me, mayChange = canChange(m, me);
    if (m.deleted) {
      out += `<div class="lc-b ${mine ? 'me' : 'them'} tail gone"><span>${m.kind === 'popup' ? 'Popup cancelled' : mine ? 'You deleted a message' : 'Message deleted'}</span></div>`;
    } else if (m.kind === 'popup') {
      out += editing === m.id ? `<div class="lc-notice mine editing">${editor(m)}</div>` : `<div class="lc-notice ${mine ? 'mine' : ''} ${mayChange ? 'can' : ''} ${sel === m.id ? 'sel' : ''}" ${mayChange ? `data-msg="sel" data-id="${h(m.id)}" tabindex="0" role="button" aria-label="Message options"` : ''}><div class="lc-notice-ic" aria-hidden="true">${BELL_ICON}</div><div class="lc-notice-body"><small>${mine ? 'You sent a popup' : 'Popup from your admin'} · ${h(timeOf(m.at))}</small>${m.title ? `<b>${h(m.title)}</b>` : ''}<span>${linkify(m.text)}</span>${edited(m)}${mine ? `<em class="${m.seenAt ? 'seen' : ''}">${m.seenAt ? 'Seen ' + h(whenOf(m.seenAt)) : opts.live ? 'Showing now' : 'Pops up at next sign-in'}</em>` : ''}</div></div>${actions(m)}`;
    } else {
      const side = mine ? 'me' : 'them';
      const sameNext = next && next.from === m.from && next.kind !== 'popup' && !next.deleted && next.at - m.at < 3 * 60e3;
      const samePrev = prev && prev.from === m.from && prev.kind !== 'popup' && !prev.deleted && m.at - prev.at < 3 * 60e3;
      if (editing === m.id) out += `<div class="lc-b me tail editing">${editor(m)}</div>`;
      else { const tick = mine ? `<i class="lc-tick ${m.seenAt ? 'read' : ''}" title="${m.seenAt ? 'Read ' + h(timeOf(m.seenAt)) : 'Delivered'}" aria-label="${m.seenAt ? 'Read' : 'Delivered'}">${m.seenAt ? '✓✓' : '✓'}</i>` : '';
        out += `<div class="lc-b ${side} ${sameNext ? '' : 'tail'} ${samePrev ? 'cont' : ''} ${mayChange ? 'can' : ''} ${sel === m.id ? 'sel' : ''}" ${mayChange ? `title="Tap to edit or delete" data-msg="sel" data-id="${h(m.id)}" tabindex="0" role="button" aria-label="Message options"` : ''}><span><em class="lc-tx">${linkify(m.text)}</em><small class="lc-meta">${m.editedAt ? 'Edited ' : ''}${h(timeOf(m.at))}${tick}</small></span></div>${actions(m)}`; }
      if (m === lastMine && editing !== m.id && m.seenAt) out += `<div class="lc-receipt"><b>Read</b> ${h(timeOf(m.seenAt))}</div>`;
    }
    prev = m;
  });
  return out;
}
/* Shared click/submit handling for edit and delete. st = { sel, editing }; returns true if handled. */
export async function threadAction(e, { me, list, ref, fb, st, rerender, confirmFn }) {
  const form = e.type === 'submit' ? e.target.closest('[data-msg-form]') : null;
  if (form) {
    e.preventDefault(); const id = form.dataset.msgForm, m = list.find(x => x.id === id), text = form.querySelector('textarea').value.trim();
    if (!m) return true;
    if (!canChange(m, me)) { st.editing = null; rerender(); if (window.uiAlert) uiAlert('Messages can only be edited for 5 minutes after sending.', { title: 'Too late to edit' }); return true; }
    if (!text) return true;
    st.editing = null; st.sel = null; rerender();
    if (text !== m.text) { try { await fb.updateDoc(ref(id), { text: text.slice(0, 2000), editedAt: Date.now() }); } catch (err) { if (window.uiAlert) uiAlert('Check the connection and that the latest firestore.rules are published.', { title: 'Couldn’t save the edit' }); } }
    return true;
  }
  const b = e.target.closest('[data-msg]'); if (!b) return false;
  const a = b.dataset.msg, id = b.dataset.id, m = id && list.find(x => x.id === id);
  if (a === 'sel') { if (e.target.closest('a')) return true; st.sel = st.sel === id ? null : id; st.editing = null; rerender(); return true; }
  if (a === 'cancel') { st.editing = null; rerender(); return true; }
  if (!m || !canChange(m, me)) { st.sel = null; rerender(); return true; }
  if (a === 'edit') { st.editing = id; rerender(); setTimeout(() => { const t = document.querySelector(`[data-msg-form="${CSS.escape(id)}"] textarea`); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }, 30); return true; }
  if (a === 'del') {
    const ok = await (confirmFn || window.uiConfirm)(m.kind === 'popup' && !m.seenAt ? 'It won’t pop up for the learner.' : 'It’s removed for both of you. The chat shows that a message was deleted.', { title: m.kind === 'popup' && !m.seenAt ? 'Cancel this popup?' : 'Delete this message?', ok: m.kind === 'popup' && !m.seenAt ? 'Cancel popup' : 'Delete', cancel: 'Keep', danger: true });
    if (!ok) return true;
    st.sel = null; rerender();
    try { await fb.updateDoc(ref(id), { deleted: true, text: '', title: '', editedAt: Date.now() }); } catch (err) { if (window.uiAlert) uiAlert('Check the connection and that the latest firestore.rules are published.', { title: 'Couldn’t delete' }); }
    return true;
  }
  return false;
}
const CHAT_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3.5c5 0 9 3.3 9 7.4s-4 7.4-9 7.4c-1 0-2-.1-2.9-.4L4.5 20l1.2-3.7C4 14.9 3 13 3 10.9 3 6.8 7 3.5 12 3.5z"/></svg>';
const BELL_ICON = '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2.2 2.2 0 0 0 4 0"/></svg>';

/* ---------- popup (iOS-style alert) ---------- */
function pendingPopups() { return msgs.filter(x => x.from === 'admin' && x.kind === 'popup' && !x.seenAt && !x.deleted && !shownPopups.has(x.id)); }
function nextPopup() {
  if (popupOpen || document.visibilityState !== 'visible') return;
  const list = pendingPopups(), m = list[0];
  if (!m) return;
  popupOpen = m; shownPopups.add(m.id);
  const more = list.length - 1;
  const layer = rootEl.querySelector('.lc-pop');
  layer.innerHTML = `<div class="lc-alert" role="alertdialog" aria-modal="true" aria-labelledby="lcPopT" aria-describedby="lcPopB">
    <div class="lc-alert-top"><div class="lc-alert-ic" aria-hidden="true">${BELL_ICON}</div><small>Your admin · ${h(whenOf(m.at))}${more ? ` · ${more} more` : ''}</small><h3 id="lcPopT">${h(m.title || 'New message')}</h3><p id="lcPopB" class="${m.text.length > 140 ? 'long' : ''}">${linkify(m.text)}</p></div>
    <div class="lc-alert-btns"><button type="button" data-lc="pop-reply">Reply</button><button type="button" class="pri" data-lc="pop-ok">${more ? 'Next' : 'OK'}</button></div></div>`;
  layer.hidden = false; requestAnimationFrame(() => layer.classList.add('on'));
  setTimeout(() => layer.querySelector('[data-lc="pop-ok"]')?.focus(), 60);
}
function closePopup(reply) {
  const m = popupOpen; if (!m) return; popupOpen = null;
  markSeen([m]);
  const layer = rootEl.querySelector('.lc-pop'); layer.classList.remove('on'); layer.classList.add('off');
  setTimeout(() => { layer.classList.remove('off'); layer.hidden = true; layer.innerHTML = ''; if (reply) openChat(true); else nextPopup(); }, 200);
}

/* ---------- chat ---------- */
function unread() { return msgs.filter(m => m.from === 'admin' && !m.seenAt && !m.deleted && !(m.kind === 'popup' && !shownPopups.has(m.id))).length; }
function renderChat() {
  if (!rootEl) return;
  const n = unread(), fab = rootEl.querySelector('.lc-fab'), badge = fab.querySelector('b');
  if (n > (+badge.textContent || 0) && !chatOpen) { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }
  badge.textContent = n > 9 ? '9+' : n; badge.hidden = !n;
  const nb = document.getElementById('lcNavBadge'); if (nb) { nb.textContent = badge.textContent; nb.hidden = !n; }
  const list = rootEl.querySelector('.lc-msgs'); if (!list) return;
  const atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  const ed = list.querySelector('.lc-edit textarea'), edVal = ed ? ed.value : null, edFocus = ed && ed === document.activeElement;
  if (tst.editing && !msgs.some(m => m.id === tst.editing && canChange(m, 'learner'))) tst.editing = null;
  list.innerHTML = threadHTML(msgs, 'learner', { sel: tst.sel, editing: tst.editing, emptyTitle: 'Message your admin', empty: 'Ask a question or share an update. Your admin sees it in the admin portal.' });
  const ed2 = list.querySelector('.lc-edit textarea'); if (ed2 && edVal !== null) { ed2.value = edVal; if (edFocus) ed2.focus(); }
  if (atBottom || chatOpen) list.scrollTop = list.scrollHeight;
  if (chatOpen && document.visibilityState === 'visible') { const toSee = msgs.filter(m => m.from === 'admin' && !m.seenAt && !m.deleted && (m.kind !== 'popup' || shownPopups.has(m.id))); if (toSee.length) markSeen(toSee); }
}
function openChat(focus) {
  chatOpen = true; const p = rootEl.querySelector('.lc-panel'); p.hidden = false; requestAnimationFrame(() => p.classList.add('on')); document.documentElement.classList.add('lc-lock');
  rootEl.querySelector('.lc-fab').setAttribute('aria-expanded', 'true'); rootEl.querySelector('.lc-toast').classList.remove('on'); renderChat();
  if (focus) setTimeout(() => rootEl.querySelector('.lc-input textarea')?.focus(), 80);
}
function closeChat() { chatOpen = false; document.documentElement.classList.remove('lc-lock'); const p = rootEl.querySelector('.lc-panel'); p.classList.remove('on'); rootEl.querySelector('.lc-fab').setAttribute('aria-expanded', 'false'); setTimeout(() => { if (!chatOpen) p.hidden = true; }, 220); }
function syncSend() { const ta = rootEl.querySelector('.lc-input textarea'), b = rootEl.querySelector('.lc-input button'); b.disabled = !ta.value.trim(); }
async function send() {
  const ta = rootEl.querySelector('.lc-input textarea'); const text = ta.value.trim(); if (!text) return;
  ta.value = ''; ta.style.height = ''; syncSend();
  try { await fb.addDoc(fb.collection(fb.fdb, 'chats', uid, 'messages'), { from: 'learner', text: text.slice(0, 2000), kind: 'chat', at: Date.now(), seenAt: null }); }
  catch (e) { ta.value = text; syncSend(); toast('Not sent', 'Check your connection and try again.'); }
}
function toast(title, text) {
  const t = rootEl.querySelector('.lc-toast');
  t.innerHTML = `<div class="lc-toast-ic" aria-hidden="true">${CHAT_ICON}</div><div class="lc-toast-body"><div class="lc-toast-row"><span>JS Learning</span><time>now</time></div><b>${h(title)}</b><p>${h(text)}</p></div>`;
  t.hidden = false; requestAnimationFrame(() => t.classList.add('on')); clearTimeout(t._h);
  t._h = setTimeout(() => { t.classList.remove('on'); setTimeout(() => { if (!t.classList.contains('on')) t.hidden = true; }, 350); }, 6000);
}

/* ---------- "From your admin" card ---------- */
const RING_COLORS = { hours: '#0a84ff', days: '#30d158', quizzes: '#ff9f0a', mocks: '#bf5af2' };
function ringsSVG(items) {
  const size = 132, stroke = 13, gap = 3; let r = size / 2 - stroke / 2;
  const rings = items.map(it => { const c = 2 * Math.PI * r, p = Math.min(1, it.goal ? it.cur / it.goal : 0), o = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="bg" style="stroke:${it.color}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="fg" style="stroke:${it.color};stroke-dasharray:${(c * p).toFixed(1)} ${c.toFixed(1)}"/>`; r -= stroke + gap; return o; }).join('');
  return `<svg class="lc-rings-svg" viewBox="0 0 ${size} ${size}" aria-hidden="true">${rings}</svg>`;
}
function cardHTML() {
  const S = getS(); const as = (coach && coach.assignments) || [], tg = (coach && coach.targets) || null;
  const st = a => assignmentStatus(a, S);
  const open = as.filter(a => st(a) !== 'done').sort((a, b) => (a.due || '9') < (b.due || '9') ? -1 : 1);
  const recentDone = as.filter(a => st(a) === 'done').slice(-2);
  if (!tg && !as.length) return '';
  const from = mondayOf(today()), pr = targetProgress(S, week.rows, from, addDays(from, 6));
  const items = tg ? [['hours', 'Study', +pr.hours.toFixed(1), +tg.hours, 'h'], ['days', 'Active days', pr.days, +tg.days, ''], ['quizzes', 'Quizzes', pr.quizzes, +tg.quizzes, ''], ['mocks', 'Mocks · 2 wks', pr.mocks, +tg.mocks, '']].filter(x => x[3]).map(([k, label, cur, goal, unit]) => ({ k, label, cur, goal, unit, color: RING_COLORS[k] })) : [];
  const rings = items.length ? `<div class="lc-goals">${ringsSVG(items)}<ul>${items.map(it => `<li><i style="background:${it.color}"></i><span>${it.label}</span><b style="color:${it.color}">${it.cur}<small>/${it.goal}${it.unit}</small></b></li>`).join('')}</ul></div>` : '';
  const item = a => { const s = st(a); return `<li class="${s}"><span class="lc-check" aria-label="${s === 'done' ? 'Done' : 'Not done'}">${s === 'done' ? '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>' : ''}</span><div><b>${h(a.label)}</b>${a.note ? `<small>${h(a.note)}</small>` : ''}${a.due && s !== 'done' ? `<em>${s === 'overdue' ? 'Overdue · was due ' : 'Due '}${h(fmtDue(a.due))}</em>` : ''}</div>${a.type === 'task' && s !== 'done' ? `<button type="button" data-lc="task-done" data-id="${h(a.id)}">Done</button>` : ''}</li>`; };
  const overdue = open.filter(a => st(a) === 'overdue').length;
  return `<section class="lc-card"><header class="lc-card-head"><div class="lc-card-av" aria-hidden="true">A</div><div><h3>From your admin</h3><p>${open.length ? `${open.length} to do${overdue ? `, ${overdue} overdue` : ''}` : as.length ? 'All assigned work done' : 'This week’s targets'}</p></div><button type="button" data-lc="open-chat" class="lc-chip">${CHAT_ICON}<span>Message</span></button></header>${rings}${as.length ? `<ul class="lc-tasks">${[...open, ...recentDone].map(item).join('')}</ul>` : ''}</section>`;
}
function renderCard() {
  if (!rootEl) return;
  const html = cardHTML();
  const slots = [document.getElementById('coachSlot')];
  const hub = document.querySelector('#app .cisa-hub:not(.adm-portal)'); const ov = hub && hub.querySelector('.cisa-tabs [data-target="overview"][aria-current="true"]');
  if (ov) { let s = hub.querySelector('.lc-cisa-slot'); if (!s) { s = document.createElement('div'); s.className = 'lc-cisa-slot'; hub.querySelector('.cisa-tabs').after(s); } slots.push(s); }
  for (const s of slots) if (s && s.dataset.html !== html) { s.dataset.html = html; s.innerHTML = html; }
}

/* ---------- events ---------- */
function threadCtx() { return { me: 'learner', list: msgs, ref: id => msgRef(id), fb, st: tst, rerender: renderChat }; }
async function onClick(e) {
  if (e.target.closest('.lc-msgs') && await threadAction(e, threadCtx())) return;
  const b = e.target.closest('[data-lc]'); if (!b) return;
  const a = b.dataset.lc;
  if (a === 'fab') { chatOpen ? closeChat() : openChat(true); return; }
  if (a === 'close') { closeChat(); return; }
  if (a === 'send') { send(); return; }
  if (a === 'pop-ok') { closePopup(false); return; }
  if (a === 'pop-reply') { closePopup(true); return; }
  if (a === 'open-chat') { openChat(true); return; }
  if (a === 'toast') { rootEl.querySelector('.lc-toast').hidden = true; openChat(true); return; }
  if (a === 'task-done') { const S = getS(); S.coachDone = S.coachDone || {}; S.coachDone[b.dataset.id] = today(); saveS(); renderCard(); return; }
}

export function startCoach(opts) {
  stopCoach();
  ({ fb, uid, getS, save: saveS, onRemoteSignOut } = opts);
  startedAt = Date.now(); msgs = []; coach = null; firstMsgs = true; shownPopups = new Set(); popupOpen = null; chatOpen = false; week = { rows: [], loaded: false };
  rootEl = document.createElement('div'); rootEl.id = 'lcRoot';
  rootEl.innerHTML = `<button type="button" class="lc-fab" data-lc="fab" aria-label="Messages: chat with your admin" aria-expanded="false">${CHAT_ICON}<span class="lc-fab-t">Messages</span><b hidden>0</b></button>
  <section class="lc-panel" hidden aria-label="Chat with your admin"><header><button type="button" class="lc-done" data-lc="close">Done</button><div class="lc-who"><span class="lc-av">A</span><b>Admin</b></div><span class="lc-hd-sp"></span></header><div class="lc-msgs" aria-live="polite"></div><form class="lc-input" onsubmit="return false"><div class="lc-field"><textarea rows="1" maxlength="2000" placeholder="Message" aria-label="Message"></textarea><button type="button" data-lc="send" aria-label="Send" disabled>${SEND_ICON}</button></div></form></section>
  <div class="lc-pop" hidden></div><div class="lc-toast" hidden data-lc="toast" role="status"></div>`;
  document.body.appendChild(rootEl);
  window.__openChat = () => openChat(true);
  if (window.visualViewport) { const vv = () => { if (rootEl) rootEl.style.setProperty('--lc-h', window.visualViewport.height + 'px'); }; window.visualViewport.addEventListener('resize', vv); vv(); }
  document.documentElement.classList.add('lc-ready');
  rootEl.addEventListener('click', onClick);
  rootEl.addEventListener('submit', e => { if (e.target.closest('.lc-msgs')) threadAction(e, threadCtx()); });
  rootEl.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.lc-msgs [data-msg="sel"]')) { e.preventDefault(); e.target.click(); } if (e.key === 'Escape' && (tst.sel || tst.editing)) { tst.sel = tst.editing = null; renderChat(); e.stopPropagation(); } if (e.key === 'Enter' && !e.shiftKey && e.target.matches('.lc-edit textarea')) { e.preventDefault(); e.target.form.requestSubmit(); } });
  expiryTimer = setInterval(() => { if (chatOpen && msgs.some(m => m.from === 'learner' && !m.deleted && Date.now() - m.at < EDIT_WINDOW + 30e3)) renderChat(); }, 30e3);
  const ta = rootEl.querySelector('textarea');
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } if (e.key === 'Escape') closeChat(); });
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; syncSend(); });
  document.addEventListener('keydown', escPop);
  try {
    unsubs.push(fb.onSnapshot(fb.query(fb.collection(fb.fdb, 'chats', uid, 'messages'), fb.orderBy('at')), snap => {
      const prev = new Set(msgs.map(m => m.id));
      msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!firstMsgs && !chatOpen) { const fresh = msgs.filter(m => !prev.has(m.id) && m.from === 'admin' && m.kind !== 'popup' && !m.deleted); if (fresh.length) toast('Admin', fresh[fresh.length - 1].text.slice(0, 160)); }
      if (popupOpen) { const cur = msgs.find(m => m.id === popupOpen.id); if (cur && cur.deleted) { popupOpen = null; const l = rootEl.querySelector('.lc-pop'); l.classList.remove('on'); l.hidden = true; l.innerHTML = ''; } }
      firstMsgs = false; renderChat(); nextPopup();
    }, () => { }));
    unsubs.push(fb.onSnapshot(fb.doc(fb.fdb, 'coach', uid), s => {
      coach = s.exists() ? s.data() : null;
      if (coach && coach.signOutAt && coach.signOutAt > startedAt && onRemoteSignOut) { const f = onRemoteSignOut; stopCoach(); f(); return; }
      renderCard();
    }, () => { }));
  } catch (e) { console.warn('coach listeners failed', e); }
  loadWeek(); timers.push(setInterval(loadWeek, 5 * 60e3));
  let q = 0; observer = new MutationObserver(() => { if (q) return; q = 1; requestAnimationFrame(() => { q = 0; renderCard(); }); });
  const app = document.getElementById('app'); if (app) observer.observe(app, { childList: true, subtree: true });
  document.addEventListener('visibilitychange', visib);
}
function escPop(e) { if (e.key === 'Escape' && popupOpen) closePopup(false); }
function visib() { if (document.visibilityState === 'visible') { renderChat(); nextPopup(); } }
export function stopCoach() {
  unsubs.forEach(f => { try { f(); } catch (e) { } }); unsubs = [];
  timers.forEach(clearInterval); timers = []; clearInterval(expiryTimer); tst.sel = tst.editing = null;
  if (observer) { observer.disconnect(); observer = null; }
  document.removeEventListener('keydown', escPop); document.removeEventListener('visibilitychange', visib);
  if (rootEl) { rootEl.remove(); rootEl = null; }
  window.__openChat = null; document.documentElement.classList.remove('lc-ready', 'lc-lock'); const nb = document.getElementById('lcNavBadge'); if (nb) nb.hidden = true;
  document.querySelectorAll('.lc-cisa-slot').forEach(x => x.remove()); const s = document.getElementById('coachSlot'); if (s) { s.innerHTML = ''; s.dataset.html = ''; }
}
