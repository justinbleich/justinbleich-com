/* Shared shell for every world: the persistent exit, and the screen shown when
   a world is cleared. The worlds themselves carry no name or career content;
   the clear screen and the world select are the only places that look like
   the portfolio. Each world calls BW.complete() at its own finish line. */
(function () {
  'use strict';

  var HOME = '/';
  var SELECT = '/worlds';
  var STORE = 'worlds-cleared';

  var WORLDS = [
    { n: 1, name: 'The Run', desc: 'A gray 2D platformer', band: ['#101012', '#29292e', '#6c6c72', '#f1f1ef', '#f2c14e'] },
    { n: 2, name: 'The Gallery', desc: 'A low-poly hall of paintings', band: ['#2f3d73', '#e9dfc6', '#b3302c', '#f2c14e', '#231c45'] },
    { n: 3, name: 'The Diorama', desc: 'An isometric puzzle', band: ['#f7dfcd', '#d7c3e3', '#e2735c', '#4f9e98', '#fbf6ef'] },
    { n: 4, name: 'Grand Prix', desc: 'A kart race', band: ['#4fa8ff', '#5cb94a', '#4b4e59', '#e8453c', '#ff6a2f'] },
    { n: 5, name: 'The Lab', desc: 'A first-person portal facility', band: ['#3a3d44', '#eef0f2', '#8d6bff', '#c6f04a', '#16181d'] },
    { n: 6, name: 'The Library', desc: 'A point-and-click archive', band: ['#24352f', '#4a3222', '#6b2a2a', '#c9a24a', '#ece2c8'] }
  ];
  var COUNT = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

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
  function band(colors, cls) {
    var b = el('span', cls || 'bw-band');
    b.setAttribute('aria-hidden', 'true');
    colors.forEach(function (c) { var i = el('i'); i.style.background = c; b.appendChild(i); });
    return b;
  }

  /* the portfolio's typeface, for the clear screen */
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;700&display=swap';
  document.head.appendChild(font);

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

  /* ---------- world select: mark what has been cleared ---------- */
  if (!world) {
    var done = cleared();
    WORLDS.forEach(function (w) {
      var slot = document.querySelector('[data-unlock="' + w.n + '"]');
      if (slot && done.indexOf(w.n) >= 0) slot.textContent = 'Cleared';
    });
    return;
  }

  /* ---------- clear screen ----------
     Laid out like the portfolio home: a name and one line under it, then a
     short list of "label → link" rows with a summary beneath each. */
  var screen = null, onClose = null;

  function close() {
    if (!screen || screen.hidden) return;
    screen.hidden = true;
    var fn = onClose; onClose = null;
    if (fn) fn();
  }
  function row(marker, label, summary, opts) {
    var item = el('article', 'bw-item');
    var head = el('p', 'bw-heading');
    head.appendChild(el('span', '', marker + ' → '));
    var a;
    if (opts.href) { a = el('a', '', label); a.href = opts.href; }
    else { a = el('button', '', label); a.type = 'button'; a.addEventListener('click', opts.onClick); }
    head.appendChild(a);
    if (opts.band) head.appendChild(band(opts.band));
    item.appendChild(head);
    if (summary) item.appendChild(el('p', 'bw-summary', summary));
    return { item: item, link: a };
  }

  function complete(opts) {
    opts = opts || {};
    markCleared(n);
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}

    if (!screen) {
      screen = el('div', 'bw-clear');
      screen.setAttribute('role', 'dialog');
      screen.setAttribute('aria-modal', 'true');
      screen.setAttribute('aria-labelledby', 'bw-title');
      document.body.appendChild(screen);
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    screen.innerHTML = '';
    onClose = opts.onClose || null;

    var got = cleared(), next = WORLDS[n] || null, all = got.length >= WORLDS.length;
    var shell = el('main', 'bw-shell');

    var identity = el('div', 'bw-identity');
    var title = el('h1', '', 'Justin Bleich');
    title.id = 'bw-title';
    identity.appendChild(title);
    identity.appendChild(el('p', '', next ? 'World ' + n + ' cleared' : 'World ' + n + ' cleared. That’s all of them.'));
    shell.appendChild(identity);

    var list = el('div', 'bw-list');
    var first = next
      ? row('Next', next.name, next.desc, { href: SELECT + '/world-' + next.n, band: next.band })
      : row('Portfolio', 'Back to the start', 'Product design, the plain version', { href: HOME });
    list.appendChild(first.item);
    list.appendChild(row('Stay', opts.stayLabel || 'Keep playing', opts.note || world.name, { onClick: close }).item);
    if (next) list.appendChild(row('Exit', 'Portfolio', 'Product design, the plain version', { href: HOME }).item);
    else list.appendChild(row('Again', WORLDS[0].name, WORLDS[0].desc, { href: SELECT + '/world-1', band: WORLDS[0].band }).item);
    shell.appendChild(list);

    /* the six worlds as colour bands; the ones you have cleared are lit */
    var foot = el('footer', 'bw-footer');
    var prog = el('div', 'bw-progress');
    prog.setAttribute('role', 'img');
    prog.setAttribute('aria-label', (all ? 'All six' : (COUNT[got.length] || got.length) + ' of six') + ' worlds cleared');
    WORLDS.forEach(function (w) {
      var b = band(w.band, 'bw-band bw-band-wide');
      b.setAttribute('data-on', got.indexOf(w.n) >= 0 ? 'true' : 'false');
      prog.appendChild(b);
    });
    foot.appendChild(prog);
    var allLink = el('a', 'bw-all', 'All worlds');
    allLink.href = SELECT;
    foot.appendChild(allLink);
    shell.appendChild(foot);

    screen.appendChild(shell);
    screen.hidden = false;
    setTimeout(function () { try { first.link.focus({ preventScroll: true }); } catch (e) {} }, 30);
  }

  window.BW = {
    world: n,
    complete: complete,
    isOpen: function () { return !!screen && !screen.hidden; }
  };
})();
