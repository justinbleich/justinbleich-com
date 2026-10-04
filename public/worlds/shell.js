/* Shared shell for every world. Owns the career content (one stop per world),
   the persistent exit, and the card shown when a world is cleared.
   Each world calls BW.complete() at its own finish line. */
(function () {
  'use strict';

  var HOME = '/';
  var SELECT = '/worlds';
  var STORE = 'bleich-worlds-cleared';

  /* One stop per world, oldest first. World 5 is the finale. */
  var WORLDS = [
    { n: 1, name: 'The Run', role: { period: 'Previously', name: 'Sprinklr', desc: 'Designed universal search and a new self-serve dashboard experience.', url: 'https://www.sprinklr.com' } },
    { n: 2, name: 'The Gallery', role: { period: '2021–2024', name: 'NFTX', desc: 'The first NFT liquidity protocol in web3, creating tradable pools for collections.', url: 'https://v2.nftx.io' } },
    { n: 3, name: 'The Diorama', role: { period: '2024–2026', name: 'OKX', desc: 'Built global payments experiences to bridge consumers and web3.', url: 'https://www.okx.com' } },
    { n: 4, name: 'Grand Prix', role: { period: 'Current', name: 'OnePay', desc: 'Leading OnePay Crypto design.', url: 'https://www.onepay.com' } },
    { n: 5, name: 'The Lab', role: null }
  ];
  var FINALE = {
    title: 'That’s the whole career so far.',
    desc: 'Also → <a href="https://app.frax.finance" target="_blank" rel="noopener">FRAX</a>, <a href="https://paste.so" target="_blank" rel="noopener">Paste</a>. ' +
      'Say hi at <a href="mailto:justin.bleich@gmail.com">justin.bleich@gmail.com</a> or on ' +
      '<a href="https://linkedin.com/in/justinbleich" target="_blank" rel="noopener">LinkedIn</a>.'
  };

  var n = parseInt(document.body.getAttribute('data-world'), 10) || 0;
  var world = WORLDS[n - 1] || null;

  function cleared() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }
  function markCleared(k) {
    var c = cleared();
    if (c.indexOf(k) < 0) c.push(k);
    try { localStorage.setItem(STORE, JSON.stringify(c)); } catch (e) {}
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------- persistent exit ---------- */
  var chrome = el('nav', 'bw-chrome');
  chrome.setAttribute('aria-label', 'Worlds');
  var exit = el('a', 'bw-exit', '<span aria-hidden="true">✕</span> Exit');
  exit.href = HOME;
  exit.setAttribute('aria-label', 'Exit to portfolio');
  chrome.appendChild(exit);
  if (world) {
    var where = el('a', 'bw-where', 'World ' + n + '/' + WORLDS.length);
    where.href = SELECT;
    where.setAttribute('aria-label', 'World ' + n + ' of ' + WORLDS.length + ', open world select');
    chrome.appendChild(where);
  }
  document.body.appendChild(chrome);

  /* ---------- world select: show what has been unlocked ---------- */
  if (!world) {
    var got = cleared();
    WORLDS.forEach(function (w) {
      var slot = document.querySelector('[data-unlock="' + w.n + '"]');
      if (!slot) return;
      if (got.indexOf(w.n) < 0) { slot.textContent = 'Locked'; return; }
      slot.textContent = w.role ? w.role.period + ' → ' + w.role.name : 'Cleared';
      slot.setAttribute('data-on', 'true');
    });
    return;
  }

  /* ---------- reveal card ---------- */
  var overlay = null, onClose = null;

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    var fn = onClose; onClose = null;
    if (fn) fn();
  }

  function complete(opts) {
    opts = opts || {};
    markCleared(n);
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}

    if (!overlay) {
      overlay = el('div', 'bw-reveal');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'bw-title');
      document.body.appendChild(overlay);
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    overlay.innerHTML = '';
    onClose = opts.onClose || null;

    var role = world.role;
    var next = WORLDS[n] || null;
    var card = el('div', 'bw-card');
    card.appendChild(el('p', 'bw-eyebrow', 'World ' + n + ' clear · ' + (role ? 'Experience unlocked' : 'All five worlds')));
    var title = el('p', 'bw-title', role ? role.period + ' → ' + role.name : FINALE.title);
    title.id = 'bw-title';
    card.appendChild(title);
    card.appendChild(el('p', 'bw-desc', role ? role.desc : FINALE.desc));
    if (opts.note) card.appendChild(el('p', 'bw-note', opts.note));

    var actions = el('div', 'bw-actions');
    var go = el('a', 'bw-btn bw-go', next ? 'World ' + next.n + ' · ' + next.name + ' →' : 'Back to portfolio');
    go.href = next ? SELECT + '/world-' + next.n : HOME;
    actions.appendChild(go);
    if (role && role.url) {
      var visit = el('a', 'bw-btn', 'Visit ' + role.name + ' ↗');
      visit.href = role.url; visit.target = '_blank'; visit.rel = 'noopener';
      actions.appendChild(visit);
    }
    var stay = el('button', 'bw-btn', opts.stayLabel || 'Keep playing');
    stay.type = 'button';
    stay.addEventListener('click', close);
    actions.appendChild(stay);
    card.appendChild(actions);

    var got = cleared();
    var pips = el('div', 'bw-pips');
    pips.setAttribute('aria-label', got.length + ' of ' + WORLDS.length + ' worlds cleared');
    WORLDS.forEach(function (w) {
      var i = el('i');
      i.setAttribute('data-on', got.indexOf(w.n) >= 0 ? 'true' : 'false');
      pips.appendChild(i);
    });
    card.appendChild(pips);

    overlay.appendChild(card);
    overlay.hidden = false;
    setTimeout(function () { try { go.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }

  window.BW = {
    world: n,
    complete: complete,
    isOpen: function () { return !!overlay && !overlay.hidden; }
  };
})();
