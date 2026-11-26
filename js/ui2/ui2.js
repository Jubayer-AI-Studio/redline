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
    if (!model || (CB.isDevUnlock && CB.isDevUnlock())) return false;
    var p = getProfile();
    var lvl = (p && p.level) ? p.level : 1;
    var style = (model.bodyStyle || (model.ref && model.ref.style) || 'coupe');
    var req = (CB.game && CB.game.economy && CB.game.economy.bodyStyleUnlockLevel) ? CB.game.economy.bodyStyleUnlockLevel(style) : 1;
    return lvl < req ? { locked: true, level: req } : false;
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
      img: 'docs/smoke_screens/smoke_01_race.png'
    },
    {
      id: 'drift',
      route: '#/drift',
      title: 'DRIFT BATTLES',
      desc: 'Tandem drift score attacks, clipping zones & angle multipliers',
      players: '1–8 PLAYERS',
      req: 1,
      img: 'docs/smoke_screens/smoke_02_drift.png'
    },
    {
      id: 'arcade',
      route: '#/arcade',
      title: 'STUNT ARCADE',
      desc: 'High-speed loops, corkscrews, nitro boost pads & item power-ups',
      players: '1–4 PLAYERS',
      req: 2,
      img: 'docs/smoke_screens/smoke_03_arcade.png'
    },
    {
      id: 'derby',
      route: '#/derby',
      title: 'DEMOLITION DERBY',
      desc: 'Arena destruction combat: flamethrowers, ramming & last car standing',
      players: '1–8 PLAYERS',
      req: 3,
      img: 'docs/smoke_screens/smoke_04_derby.png'
    },
    {
      id: 'drag',
      route: '#/drag',
      title: '1/4-MILE DRAG',
      desc: 'Burnout tire warmup, Christmas tree staging & high-rpm clutch drop',
      players: '1–2 PLAYERS',
      req: 3,
      img: 'docs/smoke_screens/smoke_05_drag.png'
    },
    {
      id: 'f1',
      route: '#/f1',
      title: 'FORMULA 1',
      desc: 'High-downforce open-wheel racing with real aerodynamic DRS',
      players: '1–20 PLAYERS',
      req: 4,
      img: 'docs/smoke_screens/smoke_06_f1.png'
    },
    {
      id: 'timetrial',
      route: '#/timetrial',
      title: 'TIME TRIAL',
      desc: 'Solo hot laps against personal best and global leaderboard ghosts',
      players: '1 PLAYER',
      req: 1,
      img: 'docs/smoke_screens/smoke_07_timetrial.png'
    },
    {
      id: 'career',
      route: '#/career',
      title: 'CAREER MODE',
      desc: '5 prestige tiers from Rookie Cup to Hypercar World Championship',
      players: '5 TIERS',
      req: 1,
      img: 'docs/smoke_screens/smoke_08_career.png'
    },
    {
      id: 'challenges',
      route: '#/challenges',
      title: 'DRIVING SCHOOL',
      desc: 'Precision slalom, threshold braking & launch control challenges',
      players: '1 PLAYER',
      req: 2,
      img: 'docs/smoke_screens/smoke_09_challenges.png'
    },
    {
      id: 'multiplayer',
      route: '#/multiplayer',
      title: 'MULTIPLAYER',
      desc: 'Realtime WebRTC peer-to-peer multiplayer with matchmaking lobby',
      players: '2–16 PLAYERS',
      req: 5,
      img: 'docs/smoke_screens/smoke_10_multiplayer.png'
    }
  ];

  // DOM Elements
  var rootEl, topbarEl, viewportEl, carouselEl;

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

    var sa = document.getElementById('screen-atelier');
    if (sa) sa.removeAttribute('hidden');
    var sh = document.getElementById('screen-hub');
    if (sh) sh.setAttribute('hidden', '');

    showView('home');

    // Subscribe to state changes to refresh specs and active car
    if (CB.state && typeof CB.state.subscribe === 'function') {
      CB.state.subscribe(function () {
        if (currentTab === 'home') refreshSpecPanel();
        updateCarouselActiveCard();
      });
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
        '<div class="ui2-driver-chip">' +
          '<span>DRIVER: <strong>' + esc(p.driverName || 'JUBAYER') + '</strong> · LV ' + (p.level || 2) + '</span>' +
        '</div>' +
        '<div class="ui2-cr-wallet">' +
          '<span class="ui2-cr-symbol">CR</span>' +
          '<span>' + crFmt + '</span>' +
        '</div>' +
      '</div>';

    // Hook click listeners
    var bHome = $('ui2-brand-home');
    if (bHome) bHome.onclick = function () { showView('home'); };
    var tHome = $('ui2-tab-home');
    if (tHome) tHome.onclick = function () { showView('home'); };
    var tModes = $('ui2-tab-modes');
    if (tModes) tModes.onclick = function () { showView('modes'); };
    var tGarage = $('ui2-tab-garage');
    if (tGarage) tGarage.onclick = function () { showView('garage'); };
    var tMp = $('ui2-tab-multiplayer');
    if (tMp) tMp.onclick = function () { window.location.hash = '#/multiplayer'; };
    var tSet = $('ui2-tab-settings');
    if (tSet) tSet.onclick = function () { window.location.hash = '#/settings'; };
  }

  function updateTabButtons() {
    var tabs = ['home', 'modes', 'garage', 'multiplayer', 'settings'];
    tabs.forEach(function (t) {
      var btn = $('ui2-tab-' + t);
      if (btn) {
        if (t === currentTab) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
      }
    });
  }

  /* ----------------------------------------------------------------------
     VIEW DISPATCHER
     ---------------------------------------------------------------------- */
  function showView(viewName) {
    currentTab = viewName;
    updateTabButtons();

    if (carouselEl) {
      carouselEl.style.display = (viewName === 'modes') ? 'none' : 'flex';
    }

    var sa = document.getElementById('screen-atelier');
    if (sa) {
      if (viewName === 'modes') {
        sa.setAttribute('hidden', '');
      } else {
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
    $('ui2-btn-race-now').onclick = function () { window.location.hash = '#/race'; };
    $('ui2-btn-tune').onclick = function () { showView('garage'); };
    $('ui2-btn-test-drive').onclick = function () { window.location.hash = '#/timetrial'; };

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

    specEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        '<span class="ui2-pi-tag">' + esc(pi) + '</span>' +
        '<span class="ui2-turntable-tag">TURNTABLE 3D</span>' +
      '</div>' +
      '<div class="ui2-car-headings">' +
        '<h2 class="ui2-car-title">' + esc(curModel.make + ' ' + curModel.name).toUpperCase() + '</h2>' +
        '<span class="ui2-car-subtitle">' + esc(styleName) + ' &middot; TRACK SPEC</span>' +
      '</div>' +
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
      '</div>';
  }

  /* ----------------------------------------------------------------------
     VIEW 2: GAME MODES (ALL 10 MODES GRID)
     ---------------------------------------------------------------------- */
  function renderModesView() {
    var p = getProfile();
    var curLvl = p.level || 1;
    var dev = CB.isDevUnlock && CB.isDevUnlock();

    var cardsHtml = MODES.map(function (m) {
      var isUnlocked = dev || curLvl >= m.req;
      var badgeHtml = isUnlocked
        ? '<span class="ui2-badge-ready">READY</span>'
        : '<span class="ui2-badge-locked">🔒 LV ' + m.req + '</span>';

      return (
        '<div class="ui2-mode-card ui2-glass-card' + (isUnlocked ? '' : ' is-locked') + '" data-mode="' + m.id + '" data-route="' + m.route + '">' +
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
        var route = this.getAttribute('data-route');
        if (route) window.location.hash = route;
      };
    });
  }

  /* ----------------------------------------------------------------------
     VIEW 3: GARAGE & TUNING
     ---------------------------------------------------------------------- */
  var activeCategory = 'power';

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

    // Calculate before-and-after upgrades
    var build = (CB.state && CB.state.get) ? CB.state.get() : {};
    var curMetrics = (CB.physics && CB.physics.compute) ? CB.physics.compute(build) : {};

    // Simulate next upgrade stage if possible
    var nextHp = Math.round((curMetrics.power_hp || 450) + 45);
    var nextNm = Math.round((curMetrics.torque_nm || 530) + 35);
    var nextKg = Math.round((curMetrics.weight_kg || 1450) - 30);
    var nextVmax = Math.round((curMetrics.topSpeed_kph || 308) + 12);

    viewportEl.innerHTML =
      '<div class="ui2-garage-container">' +
        '<div class="ui2-garage-sidebar">' +
          '<div class="ui2-tune-categories-header">TUNING CATEGORIES</div>' +
          sideHtml +
        '</div>' +
        '<div class="ui2-tune-panel-right ui2-glass-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<span class="ui2-perf-preview-title">PERFORMANCE IMPROVEMENT</span>' +
            '<span class="ui2-pi-tag">STAGE 2 UPGRADE</span>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:4px;margin-top:6px;">' +
            '<div class="ui2-delta-item">' +
              '<span class="ui2-delta-label">HORSEPOWER</span>' +
              '<div class="ui2-delta-calc">' +
                '<span>' + Math.round(curMetrics.power_hp || 450) + ' &rarr; ' + nextHp + ' HP</span>' +
                '<span class="delta-green">+45</span>' +
              '</div>' +
            '</div>' +
            '<div class="ui2-delta-item">' +
              '<span class="ui2-delta-label">TORQUE</span>' +
              '<div class="ui2-delta-calc">' +
                '<span>' + Math.round(curMetrics.torque_nm || 530) + ' &rarr; ' + nextNm + ' NM</span>' +
                '<span class="delta-green">+35</span>' +
              '</div>' +
            '</div>' +
            '<div class="ui2-delta-item">' +
              '<span class="ui2-delta-label">CURB WEIGHT</span>' +
              '<div class="ui2-delta-calc">' +
                '<span>' + Math.round(curMetrics.weight_kg || 1450) + ' &rarr; ' + nextKg + ' KG</span>' +
                '<span class="delta-green">-30</span>' +
              '</div>' +
            '</div>' +
            '<div class="ui2-delta-item">' +
              '<span class="ui2-delta-label">TOP SPEED</span>' +
              '<div class="ui2-delta-calc">' +
                '<span>' + Math.round(curMetrics.topSpeed_kph || 308) + ' &rarr; ' + nextVmax + ' KM/H</span>' +
                '<span class="delta-green">+12</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:auto;display:flex;flex-direction:column;gap:8px;">' +
            '<button class="ui2-btn-race ui2-btn-block" id="ui2-btn-apply-upgrades">' +
              '<span>APPLY UPGRADES (CR 24,500)</span>' +
            '</button>' +
            '<button class="ui2-btn-secondary" id="ui2-garage-back">&larr; BACK TO SHOWROOM</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    $('ui2-garage-back').onclick = function () { showView('home'); };
    $('ui2-btn-apply-upgrades').onclick = function () {
      alert('Upgrades applied successfully! Vehicle performance upgraded.');
      showView('home');
    };

    var catBtns = viewportEl.querySelectorAll('.ui2-tune-category-btn');
    catBtns.forEach(function (btn) {
      btn.onclick = function () {
        activeCategory = this.getAttribute('data-cat');
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

      // Vector side-profile preview
      var svgPreview = (CB.render && typeof CB.render.thumbnail === 'function')
        ? CB.render.thumbnail({ body: { model: m.id, style: m.style } }, { spin: false })
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
        c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        c.classList.remove('is-active');
      }
    });
  }

  function selectCarById(modelId) {
    if (!modelId) return;
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
