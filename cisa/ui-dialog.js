/* JS Learning · Apple-style dialogs
   uiConfirm(message, {title, ok, cancel, danger}) -> Promise<boolean>
   uiAlert(message, {title, ok}) -> Promise<void>
   One dialog at a time; later calls wait in a queue. Esc cancels, Enter confirms. */

const queue = [];
let busy = false;
const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function show(kind, message, o = {}) {
  return new Promise(resolve => { queue.push({ kind, message, o, resolve }); next(); });
}
function next() {
  if (busy || !queue.length) return;
  const { kind, message, o, resolve } = queue.shift();
  if (window.__uiAutoConfirm) { resolve(kind === 'confirm' ? true : undefined); next(); return; }
  busy = true;
  const prevFocus = document.activeElement;
  const wrap = document.createElement('div');
  wrap.className = 'ui-dlg';
  const lines = String(message || '').split(/\n{2,}/);
  const title = o.title || (kind === 'alert' ? '' : lines.length > 1 ? lines.shift() : '');
  const body = (o.title || kind === 'alert' || lines.length) ? lines.join('\n\n') : '';
  wrap.innerHTML = `<div class="ui-dlg-card ${kind}" role="${kind === 'confirm' ? 'alertdialog' : 'dialog'}" aria-modal="true" ${title ? 'aria-labelledby="uiDlgT"' : ''} aria-describedby="uiDlgB">
    ${o.icon !== false ? `<div class="ui-dlg-icon ${o.danger ? 'danger' : ''}" aria-hidden="true">${o.danger ? '!' : kind === 'alert' ? 'i' : '?'}</div>` : ''}
    ${title ? `<h2 id="uiDlgT">${h(title)}</h2>` : ''}
    ${body ? `<p id="uiDlgB">${h(body).replace(/\n/g, '<br>')}</p>` : ''}
    <div class="ui-dlg-btns ${kind === 'alert' ? 'one' : ''}">${kind === 'confirm' ? `<button type="button" data-v="0">${h(o.cancel || 'Cancel')}</button>` : ''}<button type="button" data-v="1" class="${o.danger ? 'danger' : 'pri'}">${h(o.ok || (kind === 'alert' ? 'OK' : 'Continue'))}</button></div></div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('on'));
  const okBtn = wrap.querySelector('[data-v="1"]'), cancelBtn = wrap.querySelector('[data-v="0"]');
  (o.danger && cancelBtn ? cancelBtn : okBtn).focus();
  const done = v => {
    document.removeEventListener('keydown', key, true);
    wrap.classList.remove('on'); wrap.classList.add('off');
    setTimeout(() => { wrap.remove(); busy = false; try { prevFocus && prevFocus.focus && prevFocus.focus(); } catch (e) { } next(); }, 180);
    resolve(kind === 'confirm' ? v : undefined);
  };
  const key = e => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
    else if (e.key === 'Enter' && document.activeElement && wrap.contains(document.activeElement)) { e.preventDefault(); e.stopPropagation(); done(document.activeElement.dataset.v !== '0'); }
    else if (e.key === 'Tab') { const b = [...wrap.querySelectorAll('button')]; const i = b.indexOf(document.activeElement); e.preventDefault(); b[(i + (e.shiftKey ? -1 : 1) + b.length) % b.length].focus(); }
  };
  document.addEventListener('keydown', key, true);
  wrap.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (b) done(b.dataset.v === '1'); else if (e.target === wrap && kind === 'alert') done(true); });
}
export const uiConfirm = (message, o) => show('confirm', message, o);
export const uiAlert = (message, o) => show('alert', message, o);
window.uiConfirm = uiConfirm; window.uiAlert = uiAlert;
