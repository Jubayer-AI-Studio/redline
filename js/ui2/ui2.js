/**
 * REDLINE RACING — PREMIUM UI2 CONTROLLER
 * Inspired by Forza Motorsport & Gran Turismo
 * Classic script on window.CB.ui2, zero dependencies.
 * Activated by default unless ?ui=1 is in the query string.
 */
(function () {
  'use strict';

  var root = (typeof globalThis !== 'undefined') ? globalThis : ((typeof window !== 'undefined') ? window : this);
  var CB = root.CB = root.CB || {};
  CB.ui2 = CB.ui2 || {};

  function isUI2() {
    try {
      if (typeof window === 'undefined' || !window.location) return false;
      var sp = new URLSearchParams(window.location.search);
      return sp.get('ui') !== '1';
    } catch (e) {
      return false;
    }
  }

  CB.ui2.isActive = isUI2;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = CB.ui2;
    return;
  }
  if (!isUI2()) return;

  console.log('[UI2] Activating Forza / Gran Turismo Premium Interface (default)');

  // Tag documentElement for scoped UI2 styles and studio variables
  document.documentElement.classList.add('ui2-active');

  var currentTab = 'home'; // 'home' | 'modes' | 'garage' | 'multiplayer' | 'settings'

  // Helper functions
  function $(id) {
    var el = document.getElementById(id);
    if (!el && rootEl) {
      el = rootEl.querySelector('#' + id);
    }
    return el;
  }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function getModels() {
    return (CB.shapes && typeof CB.shapes.list === 'function') ? CB.shapes.list() : [];
  }

  function getStock(id) {
    return (CB.stock && typeof CB.stock.spec === 'function') ? CB.stock.spec(id) : null;
  }

  function getProfile() {
    return (CB.game && CB.game.profile && CB.game.profile.get) ? CB.game.profile.get() : { driverName: 'JUBAYER', level: 2, credits: 100023999 };
  }

  function isCarLocked(model) {
    // All 53 vehicles are open for everyone to drive and customize
    return false;
  }

  function computePI(metrics) {
    if (!metrics) return 'S1 885';
    var hp = metrics.power_hp || 450;
    var kg = metrics.weight_kg || 1450;
    var latG = metrics.lateralG || 1.25;
    var score = Math.round((hp / kg) * 1200 + latG * 250);
    var cls = 'A';
    if (score >= 950) cls = 'X';
    else if (score >= 900) cls = 'S2';
    else if (score >= 800) cls = 'S1';
    else if (score >= 700) cls = 'A';
    else if (score >= 600) cls = 'B';
    else cls = 'C';
    return cls + ' ' + Math.min(999, Math.max(500, score));
  }

  // 10 Game Modes Metadata
  var MODES = [
    {
      id: 'race',
      route: '#/race',
      title: 'CIRCUIT SPRINT',
      desc: 'Full-grid championship racing on international tarmac circuits',
      players: '1–12 PLAYERS',
      req: 1,
      img: 'img/modes/smoke_01_race.png'
    },
    {
      id: 'drift',
      route: '#/drift',
      title: 'DRIFT BATTLES',
      desc: 'Tandem drift score attacks, clipping zones & angle multipliers',
      players: '1–8 PLAYERS',
      req: 1,
      img: 'img/modes/smoke_02_drift.png'
    },
    {
      id: 'arcade',
      route: '#/arcade',
      title: 'STUNT ARCADE',
      desc: 'High-speed loops, corkscrews, nitro boost pads & item power-ups',
      players: '1–4 PLAYERS',
      req: 2,
      img: 'img/modes/smoke_03_arcade.png'
    },
    {
      id: 'derby',
      route: '#/derby',
      title: 'DEMOLITION DERBY',
      desc: 'Arena destruction combat: flamethrowers, ramming & last car standing',
      players: '1–8 PLAYERS',
      req: 3,
      img: 'img/modes/smoke_04_derby.png'
    },
    {
      id: 'drag',
      route: '#/drag',
      title: '1/4-MILE DRAG',
      desc: 'Burnout tire warmup, Christmas tree staging & high-rpm clutch drop',
      players: '1–2 PLAYERS',
      req: 3,
      img: 'img/modes/smoke_05_drag.png'
    },
    {
      id: 'f1',
      route: '#/f1',
      title: 'FORMULA 1',
      desc: 'High-downforce open-wheel racing with real aerodynamic DRS',
      players: '1–20 PLAYERS',
      req: 4,
      img: 'img/modes/smoke_06_f1.png'
    },
    {
      id: 'timetrial',
      route: '#/timetrial',
      title: 'TIME TRIAL',
      desc: 'Solo hot laps against personal best and global leaderboard ghosts',
      players: '1 PLAYER',
      req: 1,
      img: 'img/modes/smoke_07_timetrial.png'
    },
    {
      id: 'career',
      route: '#/career',
      title: 'CAREER MODE',
      desc: '5 prestige tiers from Rookie Cup to Hypercar World Championship',
      players: '5 TIERS',
      req: 1,
      img: 'img/modes/smoke_08_career.png'
    },
    {
      id: 'challenges',
      route: '#/challenges',
      title: 'DRIVING SCHOOL',
      desc: 'Precision slalom, threshold braking & launch control challenges',
      players: '1 PLAYER',
      req: 2,
      img: 'img/modes/smoke_09_challenges.png'
    },
    {
      id: 'multiplayer',
      route: '#/multiplayer',
      title: 'MULTIPLAYER',
      desc: 'Realtime WebRTC peer-to-peer multiplayer with matchmaking lobby',
      players: '2–16 PLAYERS',
      req: 5,
      img: 'img/modes/smoke_10_multiplayer.png'
    }
  ];

  // DOM Elements
  var rootEl, topbarEl, mobileNavEl, viewportEl, carouselEl, toastEl;
  var toastTimer = null;
  var specCollapsed = false;
  var garageCatsCollapsed = false;
  var garageTuneCollapsed = false;
  var pendingPatch = {};

  var AUDIO_MUTE_KEY = 'redline.ui2.muted';

  function getAudioMuted() {
    try {
      var ls = localStorage.getItem(AUDIO_MUTE_KEY);
      if (ls === '1' || ls === '0') return ls === '1';
    } catch (e) {}
    if (CB.game && CB.game.profile && typeof CB.game.profile.getSetting === 'function') {
      try { return !!CB.game.profile.getSetting('audio.muted', false); } catch (e) {}
    }
    var a = document.getElementById('as-sunnah-theme-audio');
    return !!(a && a.muted);
  }

  function updateMuteButton(muted) {
    var btn = $('ui2-btn-mute');
    if (!btn) return;
    btn.classList.toggle('is-muted', !!muted);
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    btn.setAttribute('aria-label', muted ? 'Unmute audio' : 'Mute audio');
    btn.setAttribute('title', muted ? 'Unmute audio' : 'Mute audio');
    btn.innerHTML = muted
      ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
      : '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  }

  function applyAudioMuted(muted) {
    muted = !!muted;
    var a = document.getElementById('as-sunnah-theme-audio');
    if (a) a.muted = muted;
    try { localStorage.setItem(AUDIO_MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    if (CB.game && CB.game.profile && typeof CB.game.profile.setSetting === 'function') {
      try { CB.game.profile.setSetting('audio.muted', muted); } catch (e) {}
    }
    if (CB.music && typeof CB.music.setMuted === 'function') {
      try { CB.music.setMuted(muted); } catch (e) {}
    }
    updateMuteButton(muted);
  }

  function showToast(title, message) {
    if (!rootEl) return;
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'ui2-toast';
      toastEl.className = 'ui2-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      rootEl.appendChild(toastEl);
    }
    toastEl.innerHTML =
      '<div class="ui2-toast-icon" aria-hidden="true">&#128274;</div>' +
      '<div class="ui2-toast-body">' +
        '<div class="ui2-toast-title">' + esc(title) + '</div>' +
        '<div class="ui2-toast-msg">' + esc(message) + '</div>' +
      '</div>' +
      '<button type="button" class="ui2-toast-close" id="ui2-toast-close" aria-label="Dismiss notification">&times;</button>';

    toastEl.classList.add('is-visible');
    var closeBtn = $('ui2-toast-close');
    if (closeBtn) {
      closeBtn.onclick = function () {
        toastEl.classList.remove('is-visible');
        if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
      };
    }
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (toastEl) toastEl.classList.remove('is-visible');
      toastTimer = null;
    }, 5000);
  }

  function mountUI2() {
    if (typeof document === 'undefined' || !document.body) {
      setTimeout(mountUI2, 30);
      return;
    }
    if ($('ui2-root')) return;

    rootEl = document.createElement('div');
    rootEl.id = 'ui2-root';
    document.body.appendChild(rootEl);

    // Top Navigation Bar
    topbarEl = document.createElement('header');
    topbarEl.className = 'ui2-topbar';
    rootEl.appendChild(topbarEl);
    renderTopBar();
    applyAudioMuted(getAudioMuted());

    // Mobile Portrait Navigation Bar
    mobileNavEl = document.createElement('nav');
    mobileNavEl.id = 'ui2-mobile-nav';
    mobileNavEl.className = 'ui2-mobile-nav';
    mobileNavEl.setAttribute('aria-label', 'Mobile Navigation');
    rootEl.appendChild(mobileNavEl);
    renderMobileNav();

    // Viewport Content Stage
    viewportEl = document.createElement('main');
    viewportEl.id = 'ui2-viewport';
    viewportEl.className = 'ui2-stage-viewport';
    rootEl.appendChild(viewportEl);

    // Bottom Carousel Shell
    carouselEl = document.createElement('footer');
    carouselEl.id = 'ui2-carousel';
    carouselEl.className = 'ui2-carousel-shell';
    rootEl.appendChild(carouselEl);
    renderCarousel();

    // Show initial view
    try {
      document.documentElement.setAttribute('data-theme', 'dark');
    } catch (e) {}

    showView('home');
    syncRouteVisibility();

    // Subscribe to route changes so UI2 cleanly yields to all sub-screens
    document.addEventListener('cb:route', function (e) {
      syncRouteVisibility(e && e.detail);
    });
    window.addEventListener('hashchange', function () {
      syncRouteVisibility();
    });

    // Subscribe to state changes to refresh specs and active car
    if (CB.state && typeof CB.state.subscribe === 'function') {
      CB.state.subscribe(function (build, change) {
        if (currentTab === 'home') refreshSpecPanel();
        else if (currentTab === 'garage') {
          if (!change || change.type !== 'preview') {
            pendingPatch = {};
            renderGarageView();
          }
        }
        updateCarouselActiveCard();
      });
    }
  }

  function navigateTo(route) {
    if (!route) return;
    if (CB.router && typeof CB.router.go === 'function') {
      CB.router.go(route);
    } else {
      window.location.hash = route;
    }
  }

  function getRouteState(detail) {
    if (detail && detail.route) {
      return { route: detail.route, sub: detail.sub || null };
    }
    if (CB.router && typeof CB.router.current === 'function') {
      var c = CB.router.current();
      if (c && c.route) return { route: c.route, sub: c.sub || null };
    }
    var h = (typeof window !== 'undefined' && window.location) ? (window.location.hash || '') : '';
    if (!h || h === '#' || h === '#/' || h === '#/menu' || h.indexOf('#/menu?') === 0) {
      return { route: 'menu', sub: null };
    }
    if (h.indexOf('#/menu/') === 0) {
      var after = h.slice('#/menu/'.length).split('?')[0];
      return { route: 'menu', sub: after || null };
    }
    return { route: 'other', sub: null };
  }

  function syncRouteVisibility(detail) {
    var st = getRouteState(detail);
    var isMenuRoot = (st.route === 'menu' && !st.sub);
    var docEl = document.documentElement;
    var sa = document.getElementById('screen-atelier');
    var sh = document.getElementById('screen-hub');

    if (isMenuRoot) {
      docEl.classList.remove('ui2-subroute');
      if (rootEl) {
        rootEl.hidden = false;
        rootEl.style.display = 'flex';
      }
      if (sh) sh.setAttribute('hidden', '');
      if (sa) {
        if (currentTab === 'modes') sa.setAttribute('hidden', '');
        else sa.removeAttribute('hidden');
      }
      setTimeout(function () {
        try { window.dispatchEvent(new Event('resize')); } catch (e) {}
      }, 30);
    } else {
      if (currentTab === 'garage' && Object.keys(pendingPatch).length > 0) {
        pendingPatch = {};
        if (CB.studio3d && typeof CB.studio3d.update === 'function' && CB.state && CB.state.get) {
          try {
            var b = CB.state.get();
            var m = (CB.physics && CB.physics.compute) ? CB.physics.compute(b) : null;
            CB.studio3d.update(b, m);
          } catch (e) {}
        }
      }
      docEl.classList.add('ui2-subroute');
      if (rootEl) {
        rootEl.hidden = true;
        rootEl.style.display = 'none';
      }
      if (sa && st.route !== 'atelier') {
        sa.setAttribute('hidden', '');
      }
    }
  }

  /* ----------------------------------------------------------------------
     TOP BAR RENDERING
     ---------------------------------------------------------------------- */
  function renderTopBar() {
    var p = getProfile();
    var crFmt = (p.credits != null ? p.credits : 100023999).toLocaleString();

    topbarEl.innerHTML =
      '<div class="ui2-brand-lockup" id="ui2-brand-home">' +
        '<span class="ui2-brand-badge">FORZA / GT</span>' +
        '<div class="ui2-brand-title">' +
          '<h1>REDLINE RACING</h1>' +
          '<span>PREMIUM SHOWROOM</span>' +
        '</div>' +
      '</div>' +
      '<nav class="ui2-nav-tabs" aria-label="Main Navigation">' +
        '<button class="ui2-tab-btn' + (currentTab === 'home' ? ' is-active' : '') + '" id="ui2-tab-home">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' +
          '<span>HOME</span>' +
        '</button>' +
        '<button class="ui2-tab-btn' + (currentTab === 'modes' ? ' is-active' : '') + '" id="ui2-tab-modes">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/></svg>' +
          '<span>MODES (10)</span>' +
        '</button>' +
        '<button class="ui2-tab-btn' + (currentTab === 'garage' ? ' is-active' : '') + '" id="ui2-tab-garage">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' +
          '<span>GARAGE / TUNE</span>' +
        '</button>' +
        '<button class="ui2-tab-btn' + (currentTab === 'multiplayer' ? ' is-active' : '') + '" id="ui2-tab-multiplayer">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
          '<span>MULTIPLAYER</span>' +
        '</button>' +
        '<button class="ui2-tab-btn' + (currentTab === 'settings' ? ' is-active' : '') + '" id="ui2-tab-settings">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>' +
          '<span>SETTINGS</span>' +
        '</button>' +
      '</nav>' +
      '<div class="ui2-header-meta">' +
        '<button type="button" class="ui2-mute-btn" id="ui2-btn-mute" aria-label="Mute audio" aria-pressed="false" title="Mute / Unmute audio"></button>' +
        '<div class="ui2-driver-chip">' +
          '<span>DRIVER: <strong>' + esc(p.driverName || 'JUBAYER') + '</strong> · LV ' + (p.level || 2) + '</span>' +
        '</div>' +
        '<div class="ui2-cr-wallet">' +
          '<span class="ui2-cr-symbol">CR</span>' +
          '<span>' + crFmt + '</span>' +
        '</div>' +
      '</div>';

    // Hook click listeners
    var muteBtn = $('ui2-btn-mute');
    if (muteBtn) {
      updateMuteButton(getAudioMuted());
      muteBtn.onclick = function () {
        applyAudioMuted(!getAudioMuted());
      };
    }
    var bHome = $('ui2-brand-home');
    if (bHome) bHome.onclick = function () { showView('home'); };
    var tHome = $('ui2-tab-home');
    if (tHome) tHome.onclick = function () { showView('home'); };
    var tModes = $('ui2-tab-modes');
    if (tModes) tModes.onclick = function () { showView('modes'); };
    var tGarage = $('ui2-tab-garage');
    if (tGarage) tGarage.onclick = function () { showView('garage'); };
    var tMp = $('ui2-tab-multiplayer');
    if (tMp) tMp.onclick = function () { navigateTo('#/multiplayer'); };
    var tSet = $('ui2-tab-settings');
    if (tSet) tSet.onclick = function () { navigateTo('#/settings'); };
  }

  function renderMobileNav() {
    if (!mobileNavEl) return;
    mobileNavEl.innerHTML =
      '<button type="button" class="ui2-mobile-tab-btn' + (currentTab === 'home' ? ' is-active' : '') + '" id="ui2-mtab-home">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' +
        '<span>HOME</span>' +
      '</button>' +
      '<button type="button" class="ui2-mobile-tab-btn' + (currentTab === 'modes' ? ' is-active' : '') + '" id="ui2-mtab-modes">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/></svg>' +
        '<span>MODES</span>' +
      '</button>' +
      '<button type="button" class="ui2-mobile-tab-btn' + (currentTab === 'garage' ? ' is-active' : '') + '" id="ui2-mtab-garage">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' +
        '<span>GARAGE</span>' +
      '</button>' +
      '<button type="button" class="ui2-mobile-tab-btn' + (currentTab === 'multiplayer' ? ' is-active' : '') + '" id="ui2-mtab-multiplayer">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
        '<span>MULTI</span>' +
      '</button>' +
      '<button type="button" class="ui2-mobile-tab-btn' + (currentTab === 'settings' ? ' is-active' : '') + '" id="ui2-mtab-settings">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>' +
        '<span>SETTINGS</span>' +
      '</button>';

    var mHome = $('ui2-mtab-home');
    if (mHome) mHome.onclick = function () { showView('home'); };
    var mModes = $('ui2-mtab-modes');
    if (mModes) mModes.onclick = function () { showView('modes'); };
    var mGarage = $('ui2-mtab-garage');
    if (mGarage) mGarage.onclick = function () { showView('garage'); };
    var mMp = $('ui2-mtab-multiplayer');
    if (mMp) mMp.onclick = function () { navigateTo('#/multiplayer'); };
    var mSet = $('ui2-mtab-settings');
    if (mSet) mSet.onclick = function () { navigateTo('#/settings'); };
  }

  function updateTabButtons() {
    var tabs = ['home', 'modes', 'garage', 'multiplayer', 'settings'];
    tabs.forEach(function (t) {
      var btn = $('ui2-tab-' + t);
      if (btn) {
        if (t === currentTab) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
      }
      var mbtn = $('ui2-mtab-' + t);
      if (mbtn) {
        if (t === currentTab) mbtn.classList.add('is-active');
        else mbtn.classList.remove('is-active');
      }
    });
  }

  /* ----------------------------------------------------------------------
     VIEW DISPATCHER
     ---------------------------------------------------------------------- */
  function showView(viewName) {
    var prevTab = currentTab;
    currentTab = viewName;
    updateTabButtons();

    if (prevTab === 'garage' && viewName !== 'garage' && Object.keys(pendingPatch).length > 0) {
      pendingPatch = {};
      if (CB.studio3d && typeof CB.studio3d.update === 'function' && CB.state && CB.state.get) {
        try {
          var b = CB.state.get();
          var m = (CB.physics && CB.physics.compute) ? CB.physics.compute(b) : null;
          CB.studio3d.update(b, m);
        } catch (e) {}
      }
    }

    if (carouselEl) {
      carouselEl.style.display = (viewName === 'modes') ? 'none' : 'flex';
    }

    var sa = document.getElementById('screen-atelier');
    if (sa) {
      var st = getRouteState();
      var isMenuRoot = (st.route === 'menu' && !st.sub);
      if (viewName === 'modes' || (!isMenuRoot && st.route !== 'atelier')) {
        sa.setAttribute('hidden', '');
      } else if (isMenuRoot) {
        sa.removeAttribute('hidden');
      }
    }

    if (viewName === 'home') renderHomeView();
    else if (viewName === 'modes') renderModesView();
    else if (viewName === 'garage') renderGarageView();

    setTimeout(function () {
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    }, 30);
  }

  CB.ui2.showHome = function () { showView('home'); };
  CB.ui2.showModes = function () { showView('modes'); };
  CB.ui2.showGarage = function () { showView('garage'); };

  /* ----------------------------------------------------------------------
     VIEW 1: HOME (SHOWROOM + TELEMETRY + ACTIONS)
     ---------------------------------------------------------------------- */
  function renderHomeView() {
    viewportEl.innerHTML =
      '<aside class="ui2-spec-panel ui2-glass-card" id="ui2-spec-panel">' +
        '<!-- Spec HUD injected here -->' +
      '</aside>' +
      '<div class="ui2-action-column" id="ui2-action-column">' +
        '<button class="ui2-btn-race" id="ui2-btn-race-now">' +
          '<span>RACE NOW</span>' +
          '<span class="ui2-btn-arrow">&rsaquo;&rsaquo;</span>' +
        '</button>' +
        '<button class="ui2-btn-secondary" id="ui2-btn-tune">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' +
          '<span>TUNE &amp; UPGRADE</span>' +
        '</button>' +
        '<button class="ui2-btn-secondary" id="ui2-btn-test-drive">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>' +
          '<span>TEST DRIVE</span>' +
        '</button>' +
      '</div>';

    // Hook buttons
    $('ui2-btn-race-now').onclick = function () { navigateTo('#/race'); };
    $('ui2-btn-tune').onclick = function () { showView('garage'); };
    $('ui2-btn-test-drive').onclick = function () { navigateTo('#/timetrial'); };

    refreshSpecPanel();
  }

  function refreshSpecPanel() {
    var specEl = $('ui2-spec-panel');
    if (!specEl) return;

    var build = (CB.state && CB.state.get) ? CB.state.get() : {};
    var metrics = (CB.physics && CB.physics.compute) ? CB.physics.compute(build) : {};
    var modelId = (build.body && build.body.model) || 'porsche-911-992';
    var sp = getStock(modelId) || {};
    var list = getModels();
    var curModel = list.find(function (m) { return m.id === modelId; }) || { make: 'PORSCHE', name: '911 Carrera S', style: 'coupe' };

    var pi = computePI(metrics);
    var hp = Math.round(metrics.power_hp || sp.hp || 450);
    var nm = Math.round(metrics.torque_nm || sp.nm || 530);
    var kg = Math.round(metrics.weight_kg || sp.kg || 1450);
    var vmax = Math.round(metrics.topSpeed_kph || sp.v || 308);
    var acc = (metrics.zeroTo100_s != null ? metrics.zeroTo100_s : (sp.s || 3.5)).toFixed(1);
    var drive = (build.drivetrain && build.drivetrain.drive) ? build.drivetrain.drive.toUpperCase() : (sp.d || 'RWD').toUpperCase();
    var styleName = (curModel.style || 'SUPERCAR').toUpperCase();

    if (specCollapsed) specEl.classList.add('is-collapsed');
    else specEl.classList.remove('is-collapsed');

    specEl.innerHTML =
      '<div class="ui2-panel-hdr">' +
        '<span class="ui2-pi-tag">' + esc(pi) + '</span>' +
        '<span class="ui2-turntable-tag">TURNTABLE 3D</span>' +
        '<button type="button" class="ui2-collapse-btn" id="ui2-toggle-spec" aria-expanded="' + (!specCollapsed) + '" aria-label="Toggle specs">' + (specCollapsed ? '&#9656; SPECS' : '&#9662;') + '</button>' +
      '</div>' +
      '<div class="ui2-car-headings">' +
        '<h2 class="ui2-car-title">' + esc(curModel.make + ' ' + curModel.name).toUpperCase() + '</h2>' +
        '<span class="ui2-car-subtitle">' + esc(styleName) + ' &middot; TRACK SPEC</span>' +
      '</div>' +
      '<div class="ui2-spec-body">' +
        '<div class="ui2-spec-grid">' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' +
              '<span>POWER</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + hp + ' HP</div>' +
          '</div>' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>' +
              '<span>TORQUE</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + nm + ' NM</div>' +
          '</div>' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M12 3v18M3 12h18"/></svg>' +
              '<span>WEIGHT</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + kg.toLocaleString() + ' KG</div>' +
          '</div>' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>' +
              '<span>TOP SPEED</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + vmax + ' KM/H</div>' +
          '</div>' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
              '<span>0–100 KM/H</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + acc + ' S</div>' +
          '</div>' +
          '<div class="ui2-spec-row">' +
            '<div class="ui2-spec-item-left">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>' +
              '<span>DRIVETRAIN</span>' +
            '</div>' +
            '<div class="ui2-spec-val">' + esc(drive) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ui2-live-tag">' +
          '<span class="ui2-live-dot"></span>' +
          '<span>LIVE WEBGL 3D ROTATION</span>' +
        '</div>' +
      '</div>';

    var toggleSpec = $('ui2-toggle-spec');
    if (toggleSpec) {
      toggleSpec.onclick = function () {
        specCollapsed = !specCollapsed;
        refreshSpecPanel();
      };
    }
  }

  /* ----------------------------------------------------------------------
     VIEW 2: GAME MODES (ALL 10 MODES GRID)
     ---------------------------------------------------------------------- */
  function renderModesView() {
    var p = getProfile();
    var curLvl = p.level || 1;
    var dev = CB.isDevUnlock && CB.isDevUnlock();

    var cardsHtml = MODES.map(function (m) {
      var isUnlocked = true;
      var badgeHtml = '<span class="ui2-badge-ready">READY</span>';

      return (
        '<div class="ui2-mode-card ui2-glass-card' + (isUnlocked ? '' : ' is-locked') + '" data-mode="' + m.id + '" data-route="' + m.route + '" data-locked="' + (isUnlocked ? '0' : '1') + '" data-req="' + m.req + '" data-title="' + esc(m.title) + '">' +
          '<div class="ui2-mode-hero-img" style="background-image:url(\'' + m.img + '\');">' +
            '<div class="ui2-mode-hero-overlay"></div>' +
            '<div class="ui2-mode-badge-top">' + badgeHtml + '</div>' +
          '</div>' +
          '<div class="ui2-mode-body">' +
            '<div>' +
              '<div class="ui2-mode-title">' + esc(m.title) + '</div>' +
              '<div class="ui2-mode-desc">' + esc(m.desc) + '</div>' +
            '</div>' +
            '<div class="ui2-mode-meta">' +
              '<span>' + esc(m.players) + '</span>' +
              '<span class="ui2-mode-cta-link">' + (isUnlocked ? 'SELECT &rsaquo;' : 'LOCKED') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    viewportEl.innerHTML =
      '<div class="ui2-modes-container">' +
        '<div class="ui2-view-header">' +
          '<h2 class="ui2-view-title">' +
            '<span>SELECT GAME MODE</span>' +
            '<small>CHOOSE YOUR RACING EXPERIENCE</small>' +
          '</h2>' +
          '<button class="ui2-btn-secondary" id="ui2-modes-back">&larr; BACK TO SHOWROOM</button>' +
        '</div>' +
        '<div class="ui2-modes-grid" id="ui2-modes-grid">' +
          cardsHtml +
        '</div>' +
      '</div>';

    $('ui2-modes-back').onclick = function () { showView('home'); };

    // Hook mode card clicks
    var cards = viewportEl.querySelectorAll('.ui2-mode-card');
    cards.forEach(function (card) {
      card.onclick = function () {
        var locked = this.getAttribute('data-locked') === '1';
        if (locked) {
          var title = this.getAttribute('data-title') || 'MODE';
          var req = this.getAttribute('data-req') || '2';
          showToast(
            title + ' LOCKED',
            'Requires Driver Level ' + req + ' to unlock (Current: Level ' + curLvl + '). Earn XP in unlocked modes to level up.'
          );
          return;
        }
        var route = this.getAttribute('data-route');
        if (route) navigateTo(route);
      };
    });
  }

  /* ----------------------------------------------------------------------
     VIEW 3: GARAGE & TUNING (REAL CB.state / CB.physics / CB.game.economy)
     ---------------------------------------------------------------------- */
  var activeCategory = 'power';

  function getByPath(obj, path) {
    var parts = String(path).split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function setPendingPath(path, val) {
    var parts = String(path).split('.');
    var cur = pendingPatch;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function getPreviewBuild(baseBuild) {
    if (!pendingPatch || !Object.keys(pendingPatch).length) return baseBuild;
    var merged = (CB.util && CB.util.deepMerge)
      ? CB.util.deepMerge(baseBuild, pendingPatch)
      : JSON.parse(JSON.stringify(baseBuild));
    if (CB.state && typeof CB.state.normalize === 'function') {
      return CB.state.normalize(merged);
    }
    return merged;
  }

  function preview3DCar(build, metrics) {
    if (CB.studio3d && typeof CB.studio3d.update === 'function') {
      try { CB.studio3d.update(build, metrics); } catch (e) {}
    }
  }

  function getGarageGroups(catId, build) {
    var D = CB.data || {};
    var eng = build.engine || {};
    var drv = build.drivetrain || {};
    if (catId === 'power') {
      if (eng.type === 'ev') {
        return [
          { title: 'E-MOTORS', path: 'engine.motors', type: 'options', options: [
            { id: 1, name: '1 Motor' }, { id: 2, name: '2 Motors' }, { id: 3, name: '3 Motors' }, { id: 4, name: '4 Motors' }
          ] },
          { title: 'MOTOR POWER', path: 'engine.motorPower_kw', type: 'options', options: [
            { id: 150, name: '150 kW' }, { id: 250, name: '250 kW' }, { id: 360, name: '360 kW' }, { id: 500, name: '500 kW' }
          ] },
          { title: 'BATTERY CHEMISTRY', path: 'engine.chemistry', type: 'options', options: D.batteryChemistries || [] },
          { title: 'ARCHITECTURE', path: 'engine.voltage', type: 'options', options: D.voltages || [] },
          { title: 'THERMAL COOLING', path: 'engine.cooling', type: 'options', options: D.coolings || [] }
        ];
      }
      return [
        { title: 'ECU CALIBRATION', path: 'engine.tune', type: 'options', options: D.tunes || [] },
        { title: 'INDUCTION', path: 'engine.aspiration', type: 'options', options: D.aspirations || [] },
        { title: 'EXHAUST SYSTEM', path: 'engine.exhaust', type: 'options', options: D.exhausts || [] },
        { title: 'COOLING', path: 'engine.cooling', type: 'options', options: D.coolings || [] }
      ];
    }
    if (catId === 'brakes') {
      return [
        { title: 'BRAKE ROTORS', path: 'brakes.material', type: 'options', options: D.brakeMaterials || [] },
        { title: 'ABS CALIBRATION', path: 'brakes.abs', type: 'options', options: D.absModes || [] },
        { title: 'TIRE COMPOUND', path: 'tires.compound', type: 'options', options: D.tireCompounds || [] },
        { title: 'WHEEL MATERIAL', path: 'wheels.material', type: 'options', options: D.wheelMaterials || [] }
      ];
    }
    if (catId === 'suspension') {
      var diffPath = drv.layout === 'fwd' ? 'drivetrain.frontDiff' : 'drivetrain.rearDiff';
      var diffs = (D.differentials || []).filter(function (d) { return d.id !== 'none'; });
      return [
        { title: 'SUSPENSION TYPE', path: 'suspension.type', type: 'options', options: D.suspensionTypes || [] },
        { title: 'RIDE HEIGHT', path: 'suspension.rideHeight_mm', type: 'options', options: [
          { id: 75, name: '75 mm (Track)' },
          { id: 100, name: '100 mm (Sport)' },
          { id: 120, name: '120 mm (Street)' },
          { id: 160, name: '160 mm (Raised)' }
        ] },
        { title: 'DAMPING STIFFNESS', path: 'suspension.damping', type: 'options', options: [
          { id: 2, name: 'Soft (2)' },
          { id: 5, name: 'Street (5)' },
          { id: 8, name: 'Track (8)' },
          { id: 10, name: 'Race (10)' }
        ] },
        { title: 'DIFFERENTIAL', path: diffPath, type: 'options', options: diffs }
      ];
    }
    if (catId === 'aero') {
      var aeroData = D.aero || {};
      return [
        { title: 'FRONT SPLITTER', path: 'aero.splitter', type: 'options', options: aeroData.splitters || [] },
        { title: 'REAR WING', path: 'aero.wing', type: 'options', options: aeroData.wings || [] },
        { title: 'REAR DIFFUSER', path: 'aero.diffuser', type: 'options', options: aeroData.diffusers || [] },
        { title: 'AERO PACKAGES', type: 'toggles', options: [
          { path: 'aero.canards', name: 'Front Canards' },
          { path: 'aero.sideSkirts', name: 'Side Skirts' },
          { path: 'aero.activeAero', name: 'Active Aero' }
        ] }
      ];
    }
    if (catId === 'weight') {
      return [
        { title: 'CHASSIS MATERIAL', path: 'body.chassisMaterial', type: 'options', options: D.chassisMaterials || [] },
        { title: 'BODY CONSTRUCTION', path: 'body.construction', type: 'options', options: D.constructions || [] },
        { title: 'WINDOW GLASS', path: 'weight.glass', type: 'options', options: D.glassTypes || [] },
        { title: '12V BATTERY', path: 'weight.battery', type: 'options', options: D.batteryTypes || [] },
        { title: 'ROLL CAGE', path: 'weight.rollCage', type: 'options', options: D.rollCages || [] },
        { title: 'INTERIOR STRIP', type: 'toggles', options: [
          { path: 'weight.soundDeadening', name: 'Sound Deadening' },
          { path: 'weight.rearSeats', name: 'Rear Seats' }
        ] }
      ];
    }
    // livery
    return [
      { title: 'EXTERIOR PAINT', path: 'exterior.paint', type: 'swatches', options: D.paintSwatches || [] },
      { title: 'PAINT FINISH', path: 'exterior.finish', type: 'options', options: D.paintFinishes || [] },
      { title: 'RACING STRIPES', path: 'exterior.stripe', type: 'options', options: D.stripes || [] },
      { title: 'ROOF PANEL', path: 'exterior.roof', type: 'options', options: D.roofTypes || [] },
      { title: 'WHEEL DESIGN', path: 'wheels.design', type: 'options', options: D.wheelDesigns || [] }
    ];
  }

  function formatDeltaRow(label, beforeVal, afterVal, unit, decimals, lowerIsBetter) {
    var b = Number(beforeVal);
    var a = Number(afterVal);
    if (!isFinite(b)) b = 0;
    if (!isFinite(a)) a = b;
    var diff = a - b;
    var factor = Math.pow(10, decimals || 0);
    var bFmt = decimals ? b.toFixed(decimals) : Math.round(b);
    var aFmt = decimals ? a.toFixed(decimals) : Math.round(a);
    var dRounded = Math.round(diff * factor) / factor;
    var hasDiff = Math.abs(dRounded) > (decimals ? 0.001 : 0);
    var cls = '';
    var dStr = '—';
    if (hasDiff) {
      var good = lowerIsBetter ? (dRounded < 0) : (dRounded > 0);
      cls = good ? 'delta-green' : 'delta-red';
      dStr = (dRounded > 0 ? '+' : '') + (decimals ? dRounded.toFixed(decimals) : dRounded);
    }
    return (
      '<div class="ui2-delta-item">' +
        '<span class="ui2-delta-label">' + esc(label) + '</span>' +
        '<div class="ui2-delta-calc">' +
          '<span>' + bFmt + ' &rarr; ' + aFmt + ' ' + esc(unit) + '</span>' +
          '<span class="' + cls + '">' + dStr + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  function renderGarageView() {
    var categories = [
      { id: 'power', icon: '⚡', label: 'POWER & ENGINE', sys: 'engine' },
      { id: 'brakes', icon: '🛑', label: 'BRAKES & TIRES', sys: 'brakes' },
      { id: 'suspension', icon: '📐', label: 'SUSPENSION', sys: 'suspension' },
      { id: 'aero', icon: '✈️', label: 'AERODYNAMICS', sys: 'aero' },
      { id: 'weight', icon: '🪶', label: 'WEIGHT REDUCTION', sys: 'weight' },
      { id: 'livery', icon: '🎨', label: 'LIVERY & STYLE', sys: 'finish' }
    ];

    var sideHtml = categories.map(function (c) {
      return (
        '<button class="ui2-tune-category-btn' + (c.id === activeCategory ? ' is-active' : '') + '" data-cat="' + c.id + '" data-sys="' + c.sys + '">' +
          '<span>' + c.icon + '</span>' +
          '<span>' + c.label + '</span>' +
        '</button>'
      );
    }).join('');

    var baseBuild = (CB.state && CB.state.get) ? CB.state.get() : {};
    var previewBuild = getPreviewBuild(baseBuild);
    var curMetrics = (CB.physics && CB.physics.compute) ? CB.physics.compute(baseBuild) : {};
    var nextMetrics = (CB.physics && CB.physics.compute) ? CB.physics.compute(previewBuild) : curMetrics;

    var econ = (CB.game && CB.game.economy) ? CB.game.economy : null;
    var prof = getProfile();
    var dev = !!(CB.isDevUnlock && CB.isDevUnlock());
    var curLvl = (prof && prof.level) ? prof.level : 1;

    var quote = (econ && typeof econ.upgradeQuote === 'function')
      ? econ.upgradeQuote(baseBuild, previewBuild)
      : { total: 0, changes: 0 };
    var hasChanges = JSON.stringify(baseBuild) !== JSON.stringify(previewBuild);
    var cost = dev ? 0 : Math.max(0, Math.round(quote.total || 0));

    var groups = getGarageGroups(activeCategory, previewBuild);
    var partsHtml = groups.map(function (grp) {
      if (grp.type === 'swatches') {
        var curPaint = String(getByPath(previewBuild, grp.path) || '').toLowerCase();
        var swHtml = (grp.options || []).map(function (sw) {
          var isSel = String(sw.hex).toLowerCase() === curPaint;
          return (
            '<button type="button" class="ui2-swatch-btn' + (isSel ? ' is-active' : '') + '" ' +
              'data-path="' + esc(grp.path) + '" data-val="' + esc(sw.hex) + '" data-valtype="string" ' +
              'title="' + esc(sw.name) + '" aria-label="' + esc(sw.name) + '" ' +
              'style="background-color:' + esc(sw.hex) + ';"></button>'
          );
        }).join('');
        return (
          '<div class="ui2-part-group">' +
            '<div class="ui2-part-group-title">' + esc(grp.title) + '</div>' +
            '<div class="ui2-swatch-grid">' + swHtml + '</div>' +
          '</div>'
        );
      }

      if (grp.type === 'toggles') {
        var tgHtml = (grp.options || []).map(function (tg) {
          var isOn = !!getByPath(previewBuild, tg.path);
          var fUnlocked = true;
          var fReqLvl = 1;
          var tgBadge = '<span class="ui2-part-tag">' + (isOn ? 'ON' : 'OFF') + '</span>';
          return (
            '<button type="button" class="ui2-part-pill' + (isOn ? ' is-active' : '') + (fUnlocked ? '' : ' is-locked') + '" ' +
              'data-path="' + esc(tg.path) + '" data-val="' + (isOn ? '0' : '1') + '" data-valtype="bool" ' +
              'data-locked="' + (fUnlocked ? '0' : '1') + '" data-req="' + fReqLvl + '" data-name="' + esc(tg.name) + '">' +
              '<span class="ui2-part-name">' + esc(tg.name) + '</span>' +
              tgBadge +
            '</button>'
          );
        }).join('');
        return (
          '<div class="ui2-part-group">' +
            '<div class="ui2-part-group-title">' + esc(grp.title) + '</div>' +
            '<div class="ui2-part-pills">' + tgHtml + '</div>' +
          '</div>'
        );
      }

      var curVal = getByPath(previewBuild, grp.path);
      var optsHtml = (grp.options || []).map(function (opt) {
        var isNum = typeof opt.id === 'number';
        var isSel = isNum ? (Number(curVal) === opt.id) : (String(curVal) === String(opt.id));
        var unlocked = true;
        var reqLvl = 1;
        var partCr = (!dev && econ && typeof econ.partCost === 'function') ? econ.partCost(grp.path, opt.id) : 0;
        var badge = isSel ? '<span class="ui2-part-tag">ACTIVE</span>' : (partCr > 0 ? '<span class="ui2-part-cost">CR ' + partCr.toLocaleString() + '</span>' : '');
        return (
          '<button type="button" class="ui2-part-pill' + (isSel ? ' is-active' : '') + (unlocked ? '' : ' is-locked') + '" ' +
            'data-path="' + esc(grp.path) + '" data-val="' + esc(opt.id) + '" data-valtype="' + (isNum ? 'number' : 'string') + '" ' +
            'data-locked="' + (unlocked ? '0' : '1') + '" data-req="' + reqLvl + '" data-name="' + esc(opt.name) + '">' +
            '<span class="ui2-part-name">' + esc(opt.name) + '</span>' +
            badge +
          '</button>'
        );
      }).join('');

      return (
        '<div class="ui2-part-group">' +
          '<div class="ui2-part-group-title">' + esc(grp.title) + '</div>' +
          '<div class="ui2-part-pills">' + optsHtml + '</div>' +
        '</div>'
      );
    }).join('');

    var piBefore = computePI(curMetrics);
    var piAfter = computePI(nextMetrics);
    var piLabel = hasChanges ? (piBefore + ' → ' + piAfter) : piBefore;
    var applyLabel = !hasChanges
      ? 'SELECT PARTS TO UPGRADE'
      : (dev ? 'APPLY UPGRADES (FREE · DEV)' : (cost > 0 ? 'APPLY UPGRADES (CR ' + cost.toLocaleString() + ')' : 'APPLY CHANGES (FREE)'));

    viewportEl.innerHTML =
      '<div class="ui2-garage-container">' +
        '<div class="ui2-garage-sidebar ui2-glass-card' + (garageCatsCollapsed ? ' is-collapsed' : '') + '" id="ui2-garage-sidebar">' +
          '<div class="ui2-panel-hdr">' +
            '<div class="ui2-tune-categories-header">TUNING &amp; PARTS</div>' +
            '<button type="button" class="ui2-collapse-btn" id="ui2-toggle-garage-cats" aria-expanded="' + (!garageCatsCollapsed) + '" aria-label="Toggle tuning categories">' + (garageCatsCollapsed ? '&#9656;' : '&#9662;') + '</button>' +
          '</div>' +
          '<div class="ui2-garage-cats-list">' +
            sideHtml +
          '</div>' +
          '<div class="ui2-garage-parts" id="ui2-garage-parts">' +
            partsHtml +
          '</div>' +
        '</div>' +
        '<div class="ui2-tune-panel-right ui2-glass-card' + (garageTuneCollapsed ? ' is-collapsed' : '') + '" id="ui2-garage-tune-panel">' +
          '<div class="ui2-panel-hdr">' +
            '<span class="ui2-perf-preview-title">LIVE TELEMETRY DELTA</span>' +
            '<span class="ui2-pi-tag">' + esc(piLabel) + '</span>' +
            '<button type="button" class="ui2-collapse-btn" id="ui2-toggle-garage-tune" aria-expanded="' + (!garageTuneCollapsed) + '" aria-label="Toggle performance preview">' + (garageTuneCollapsed ? '&#9656;' : '&#9662;') + '</button>' +
          '</div>' +
          '<div class="ui2-garage-tune-body">' +
            '<div class="ui2-delta-list">' +
              formatDeltaRow('HORSEPOWER', curMetrics.power_hp, nextMetrics.power_hp, 'HP', 0, false) +
              formatDeltaRow('TORQUE', curMetrics.torque_nm, nextMetrics.torque_nm, 'NM', 0, false) +
              formatDeltaRow('CURB WEIGHT', curMetrics.weight_kg, nextMetrics.weight_kg, 'KG', 0, true) +
              formatDeltaRow('TOP SPEED', curMetrics.topSpeed_kph, nextMetrics.topSpeed_kph, 'KM/H', 0, false) +
              formatDeltaRow('0–100 KM/H', curMetrics.zeroTo100_s, nextMetrics.zeroTo100_s, 'S', 2, true) +
              formatDeltaRow('LATERAL GRIP', curMetrics.lateralG, nextMetrics.lateralG, 'G', 2, false) +
              formatDeltaRow('100–0 BRAKING', curMetrics.brakingDist_100_0_m, nextMetrics.brakingDist_100_0_m, 'M', 1, true) +
              formatDeltaRow('DOWNFORCE @200', curMetrics.downforce_kg_200, nextMetrics.downforce_kg_200, 'KG', 0, false) +
            '</div>' +
            '<div class="ui2-garage-actions">' +
              '<button type="button" class="ui2-btn-race ui2-btn-block" id="ui2-btn-apply-upgrades"' + (hasChanges ? '' : ' disabled') + '>' +
                '<span>' + esc(applyLabel) + '</span>' +
              '</button>' +
              '<button type="button" class="ui2-btn-secondary" id="ui2-garage-back">&larr; BACK TO SHOWROOM</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var tCats = $('ui2-toggle-garage-cats');
    if (tCats) {
      tCats.onclick = function () {
        garageCatsCollapsed = !garageCatsCollapsed;
        renderGarageView();
      };
    }
    var tTune = $('ui2-toggle-garage-tune');
    if (tTune) {
      tTune.onclick = function () {
        garageTuneCollapsed = !garageTuneCollapsed;
        renderGarageView();
      };
    }
    $('ui2-garage-back').onclick = function () { showView('home'); };

    $('ui2-btn-apply-upgrades').onclick = function () {
      if (!hasChanges) return;
      if (!dev && cost > 0 && CB.game && CB.game.profile) {
        if (typeof CB.game.profile.canAfford === 'function' && !CB.game.profile.canAfford(cost)) {
          showToast('INSUFFICIENT CREDITS', 'Need CR ' + cost.toLocaleString() + ' to apply these upgrades.');
          return;
        }
        if (typeof CB.game.profile.spend === 'function') {
          var ok = CB.game.profile.spend(cost, 'Garage Upgrade', 'upgrade');
          if (!ok) {
            showToast('INSUFFICIENT CREDITS', 'Could not deduct CR ' + cost.toLocaleString() + '.');
            return;
          }
        }
      }
      var patchToApply = JSON.parse(JSON.stringify(pendingPatch));
      pendingPatch = {};
      if (CB.state && typeof CB.state.patch === 'function') {
        CB.state.patch(patchToApply, { label: 'Garage Upgrade' });
      }
      renderTopBar();
      showToast(
        'UPGRADES APPLIED',
        (!dev && cost > 0)
          ? ('Spent CR ' + cost.toLocaleString() + ' on vehicle upgrades.')
          : 'Vehicle specification updated.'
      );
      renderGarageView();
    };

    var catBtns = viewportEl.querySelectorAll('.ui2-tune-category-btn');
    catBtns.forEach(function (btn) {
      btn.onclick = function () {
        activeCategory = this.getAttribute('data-cat');
        renderGarageView();
      };
    });

    var partBtns = viewportEl.querySelectorAll('.ui2-part-pill, .ui2-swatch-btn');
    partBtns.forEach(function (btn) {
      btn.onclick = function () {
        if (this.getAttribute('data-locked') === '1') {
          var name = this.getAttribute('data-name') || 'PART';
          var req = this.getAttribute('data-req') || '2';
          showToast(name + ' LOCKED', 'Requires Driver Level ' + req + ' (Current: Level ' + curLvl + ').');
          return;
        }
        var p = this.getAttribute('data-path');
        var raw = this.getAttribute('data-val');
        var vt = this.getAttribute('data-valtype');
        var val = vt === 'number' ? Number(raw) : (vt === 'bool' ? (raw === '1') : raw);
        setPendingPath(p, val);
        var nextB = getPreviewBuild(baseBuild);
        var nextM = (CB.physics && CB.physics.compute) ? CB.physics.compute(nextB) : null;
        preview3DCar(nextB, nextM);
        renderGarageView();
      };
    });
  }

  /* ----------------------------------------------------------------------
     CAROUSEL: 53 INTERACTIVE CARS
     ---------------------------------------------------------------------- */
  function renderCarousel() {
    var models = getModels();
    if (!models || !models.length) {
      setTimeout(renderCarousel, 150);
      return;
    }

    var curBuild = (CB.state && CB.state.get) ? CB.state.get() : {};
    var curModelId = (curBuild.body && curBuild.body.model) || models[0].id;

    var cardsHtml = models.map(function (m, idx) {
      var isActive = m.id === curModelId;
      var lockInfo = isCarLocked(m);
      var sp = getStock(m.id) || {};
      var cls = sp.c ? sp.c.toUpperCase() : 'SPORT';
      var lockBadge = lockInfo && lockInfo.locked
        ? '<span class="ui2-thumb-lock-badge">🔒 LV ' + lockInfo.level + '</span>'
        : '<span class="ui2-status-ready">READY</span>';

      // Vector side-profile preview with stock paint & finish
      var thumbBuild = (sp && sp.p && sp.p[0])
        ? { body: { model: m.id, style: m.style }, exterior: { paint: sp.p[0], finish: sp.p[1] || 'metallic' } }
        : { body: { model: m.id, style: m.style } };
      var svgPreview = (CB.render && typeof CB.render.thumbnail === 'function')
        ? CB.render.thumbnail(thumbBuild, { spin: false })
        : '';

      return (
        '<div class="ui2-car-thumb-card' + (isActive ? ' is-active' : '') + (lockInfo && lockInfo.locked ? ' is-locked' : '') + '" data-id="' + m.id + '" data-idx="' + idx + '" id="ui2-card-' + m.id + '">' +
          '<div class="ui2-thumb-meta">' +
            '<span>' + esc(cls) + '</span>' +
            lockBadge +
          '</div>' +
          '<div class="ui2-thumb-preview">' + svgPreview + '</div>' +
          '<div class="ui2-thumb-name">' + esc(m.make + ' ' + m.name) + '</div>' +
        '</div>'
      );
    }).join('');

    carouselEl.innerHTML =
      '<button class="ui2-carousel-arrow" id="ui2-prev-car" aria-label="Previous Vehicle">&lsaquo;</button>' +
      '<div class="ui2-carousel-track" id="ui2-carousel-track">' +
        cardsHtml +
      '</div>' +
      '<button class="ui2-carousel-arrow" id="ui2-next-car" aria-label="Next Vehicle">&rsaquo;</button>';

    // Arrow navigation
    var prevBtn = $('ui2-prev-car');
    if (prevBtn) prevBtn.onclick = function () { cycleCar(-1); };
    var nextBtn = $('ui2-next-car');
    if (nextBtn) nextBtn.onclick = function () { cycleCar(1); };

    // Card selection
    var cards = carouselEl.querySelectorAll('.ui2-car-thumb-card');
    cards.forEach(function (card) {
      card.onclick = function () {
        var id = this.getAttribute('data-id');
        selectCarById(id);
      };
    });

    // Touch swipe handling
    var track = $('ui2-carousel-track');
    if (track) {
      var isDown = false, startX = 0, scrollLeft = 0;
      track.addEventListener('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      track.addEventListener('mouseleave', function () { isDown = false; });
      track.addEventListener('mouseup', function () { isDown = false; });
      track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        var walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
    }
  }

  function updateCarouselActiveCard() {
    var curBuild = (CB.state && CB.state.get) ? CB.state.get() : {};
    var curModelId = curBuild.body && curBuild.body.model;
    if (!curModelId) return;

    var cards = carouselEl ? carouselEl.querySelectorAll('.ui2-car-thumb-card') : [];
    cards.forEach(function (c) {
      if (c.getAttribute('data-id') === curModelId) {
        c.classList.add('is-active');
        var prevEl = c.querySelector('.ui2-thumb-preview');
        if (prevEl && CB.render && typeof CB.render.thumbnail === 'function') {
          prevEl.innerHTML = CB.render.thumbnail(curBuild, { spin: false });
        }
        c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        c.classList.remove('is-active');
      }
    });
  }

  function selectCarById(modelId) {
    if (!modelId) return;
    if (CB.stock && typeof CB.stock.has === 'function' && CB.stock.has(modelId) && typeof CB.stock.run === 'function') {
      CB.stock.run({ model: modelId });
      return;
    }
    if (CB.state && typeof CB.state.applyModel === 'function') {
      CB.state.applyModel(modelId);
      var sp = getStock(modelId);
      if (sp && sp.p && sp.p[0] && CB.state.patch) {
        CB.state.patch({ exterior: { paint: sp.p[0], finish: sp.p[1] || 'metallic' } }, { coalesce: false });
      }
    }
  }

  CB.ui2.selectCar = selectCarById;

  function cycleCar(delta) {
    var models = getModels();
    if (!models || !models.length) return;
    var curBuild = (CB.state && CB.state.get) ? CB.state.get() : {};
    var curId = (curBuild.body && curBuild.body.model) || models[0].id;
    var curIdx = 0;
    for (var i = 0; i < models.length; i++) {
      if (models[i].id === curId) { curIdx = i; break; }
    }
    var nextIdx = ((curIdx + delta) % models.length + models.length) % models.length;
    selectCarById(models[nextIdx].id);
  }

  /* ----------------------------------------------------------------------
     BOOT HOOK
     ---------------------------------------------------------------------- */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountUI2);
    } else {
      mountUI2();
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('load', function () {
        if (!$('ui2-root')) mountUI2();
      });
    }
  }

  init();

})();
