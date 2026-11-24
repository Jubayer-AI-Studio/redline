const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
const cssPath = path.join(ROOT, 'css', 'ui2.css');
const jsPath = path.join(ROOT, 'js', 'ui2', 'ui2.js');

const mockupHtml = fs.readFileSync(mockupPath, 'utf8');

// 1. Extract CSS from mockup_realistic.html
const styleMatch = mockupHtml.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('No style block found in mockup_realistic.html');
  process.exit(1);
}

let rawCss = styleMatch[1];

// Scope CSS cleanly under html.rl-v2 and #rl-app
let cleanedCss = rawCss
  .replace(/html,\s*body\s*\{[\s\S]*?\}/, '')
  .replace(/\*\s*\{[\s\S]*?\}/, '')
  .replace(/#app\b/g, '#rl-app');

const scopedCss = `/* ==========================================================================
   JUBAYER RACING UI v2.0 Realistic Theme (Gran Turismo & Forza Horizon Aesthetic)
   Scoped strictly to html.rl-v2 and #rl-app so ?ui=1 is 100% pristine.
   Zero vertical and zero horizontal scrolling on mobile landscape viewports.
   ========================================================================== */

/* Hidden when not in UI v2 mode */
html:not(.rl-v2) #rl-app {
  display: none !important;
}

html.rl-v2 {
  overflow: hidden !important;
  width: 100% !important;
  height: 100% !important;
}

html.rl-v2 body {
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  overflow: hidden !important;
  background-color: #090a0c !important;
  color: #f3f4f6 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  touch-action: manipulation !important;
}

/* Hide original menu chrome when UI v2 is active in menu mode */
html.rl-v2:not(.rl-in-session) #global-nav,
html.rl-v2:not(.rl-in-session) #app-root,
html.rl-v2:not(.rl-in-session) #garage-flow,
html.rl-v2:not(.rl-in-session) #main-menu-shell {
  display: none !important;
}

/* When in active race session, hide UI v2 overlay and reveal real WebGL race screen */
html.rl-v2.rl-in-session #rl-app {
  display: none !important;
}

html.rl-v2.rl-in-session #app-root {
  display: block !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
}

/* In-Race HUD & Touch Controls Styling Enhancements for UI v2 */
html.rl-v2 #race-root .rx-touch-steering,
html.rl-v2 #race-root .rx-touch-pedals {
  opacity: 0.72;
  transition: opacity 0.15s ease;
}
html.rl-v2 #race-root .rx-touch-steering:hover,
html.rl-v2 #race-root .rx-touch-pedals:hover,
html.rl-v2 #race-root .rx-touch-steering:active,
html.rl-v2 #race-root .rx-touch-pedals:active {
  opacity: 0.95;
}
html.rl-v2 #race-root .rx-steer-btn,
html.rl-v2 #race-root .rx-pedal-btn {
  background: rgba(14, 16, 22, 0.65) !important;
  border-width: 1.5px !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

/* UI v2 App Container: Fixed 100dvh viewport, zero scroll */
#rl-app {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 2147482000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#rl-app, #rl-app * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

${cleanedCss}
`;

fs.writeFileSync(cssPath, scopedCss, 'utf8');
console.log('Wrote scoped CSS to', cssPath, '(' + scopedCss.length + ' bytes)');

// 2. Extract Body HTML (inside <div id="app">...</div>)
const appMatch = mockupHtml.match(/<div id="app">([\s\S]*?)<\/div>\s*<script>/);
if (!appMatch) {
  console.error('No <div id="app"> found in mockup_realistic.html');
  process.exit(1);
}

let appInnerHtml = appMatch[1].trim();

// 3. Generate robust js/ui2/ui2.js with complete engine integration
const ui2JsCode = `/* ==========================================================================
   JUBAYER RACING UI v2.0 - js/ui2/ui2.js
   Realistic, Restrained Mobile-First UI (Gran Turismo & Forza Horizon Style)
   Full parity with Redline engine: 53 cars, real profile saves, all 10 modes.
   Active when URL has ?ui=2 or localStorage redline_ui_version === '2'.
   Fallback ?ui=1 restores pristine original design.
   ========================================================================== */
var CB = (globalThis.CB = globalThis.CB || {});

(function () {
  'use strict';

  var hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';
  if (!hasDOM) return;

  var searchParams = new URLSearchParams(window.location.search);
  var uiParam = searchParams.get('ui');
  var savedUi = null;
  try { savedUi = localStorage.getItem('redline_ui_version'); } catch (e) {}

  // Determine active UI version: default to v2 if requested or stored, else check flag
  var isV2 = (uiParam === '2') || (!uiParam && savedUi === '2') || (uiParam !== '1' && !savedUi);

  if (!isV2) {
    document.documentElement.classList.remove('rl-v2');
    return;
  }

  document.documentElement.classList.add('rl-v2');

  var APP_HTML = ${JSON.stringify(appInnerHtml)};

  var CARS = [
    { id: 'porsche-911-992', make: 'PORSCHE', name: '911 GT3 (992)', img: 'assets/realistic/real_porsche_911_gt3_studio.png', hp: '502 HP @ 8,400 RPM', torque: '470 NM', weight: '1,435 KG', accel: '3.2 S', speed: '318 KM/H', ptw: '0.350 HP/KG' },
    { id: 'bmw-m4-g82', make: 'BMW', name: 'M4 Competition', img: 'assets/realistic/real_bmw_m4_studio.png', hp: '503 HP @ 6,250 RPM', torque: '650 NM', weight: '1,725 KG', accel: '3.8 S', speed: '290 KM/H', ptw: '0.291 HP/KG' },
    { id: 'toyota-gr-supra-a90', make: 'TOYOTA', name: 'GR Supra RZ', img: 'assets/realistic/real_supra_a90_studio.png', hp: '382 HP @ 5,800 RPM', torque: '500 NM', weight: '1,520 KG', accel: '3.9 S', speed: '250 KM/H', ptw: '0.251 HP/KG' },
    { id: 'ferrari-sf90-stradale', make: 'FERRARI', name: 'SF90 Stradale', img: 'assets/realistic/real_ferrari_sf90_studio.png', hp: '986 HP @ 7,500 RPM', torque: '800 NM', weight: '1,570 KG', accel: '2.5 S', speed: '340 KM/H', ptw: '0.628 HP/KG' },
    { id: 'mclaren-p1', make: 'MCLAREN', name: 'P1 Hypercar', img: 'assets/realistic/real_mclaren_p1_studio.png', hp: '903 HP @ 7,500 RPM', torque: '900 NM', weight: '1,395 KG', accel: '2.8 S', speed: '350 KM/H', ptw: '0.647 HP/KG' }
  ];

  var currentScreen = 'home';
  var currentCar = 0;
  var selectedMode = 'race';
  var audioCtx = null;
  var s3dCanvas = null;

  function initUI2() {
    if (document.getElementById('rl-app')) return;

    var container = document.createElement('div');
    container.id = 'rl-app';
    container.innerHTML = APP_HTML;
    document.body.appendChild(container);

    // Audio & Haptic feedback
    function rlHaptic(type) {
      try {
        if ('vibrate' in navigator) {
          if (type === 'tap') navigator.vibrate(8);
          else if (type === 'select') navigator.vibrate(15);
          else if (type === 'cta') navigator.vibrate([15, 30, 25]);
        }
      } catch (e) {}
    }

    function rlPlaySound(type) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!audioCtx) audioCtx = new AC();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        var t = audioCtx.currentTime;

        if (type === 'tap') {
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.04);
          gain.gain.setValueAtTime(0.04, t);
          gain.gain.linearRampToValueAtTime(0.001, t + 0.04);
          osc.start(t);
          osc.stop(t + 0.04);
        } else if (type === 'select') {
          osc.frequency.setValueAtTime(660, t);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0.001, t + 0.06);
          osc.start(t);
          osc.stop(t + 0.06);
        }
      } catch (e) {}
    }

    /* Mount live 3D WebGL Turntable in #stage */
    function mountStudio3D() {
      try {
        var stageEl = document.getElementById('stage');
        if (stageEl && typeof CB !== 'undefined' && CB.studio3d && typeof CB.studio3d.mount === 'function' && CB.studio3d.isSupported()) {
          s3dCanvas = CB.studio3d.mount(stageEl, { view: 'side', spin: true });
          if (s3dCanvas) {
            var fbImg = document.getElementById('studio-car');
            if (fbImg) fbImg.style.display = 'none';
            var floorRefl = document.querySelector('.studio-floor-reflection');
            if (floorRefl) floorRefl.style.display = 'none';
            updateStudioCar();
          }
        }
      } catch (e) {
        if (typeof console !== 'undefined') console.warn('[ui2] 3D studio mount fallback to photographic render', e);
      }
    }

    function updateStudioCar(modelId) {
      try {
        if (typeof CB !== 'undefined' && CB.studio3d && typeof CB.studio3d.update === 'function') {
          var mId = modelId || (CARS[currentCar] && CARS[currentCar].id);
          var b = (CB.state && typeof CB.state.get === 'function') ? CB.state.get() : { model: mId };
          if (b) {
            b.model = mId;
            CB.studio3d.update(b);
          }
        }
      } catch (e) {}
    }

    /* Screen Navigation */
    function navTo(screenId) {
      currentScreen = screenId;
      rlHaptic('tap');
      rlPlaySound('tap');

      document.querySelectorAll('#rl-app .screen').forEach(function (s) { s.classList.remove('active'); });
      document.querySelectorAll('#rl-app .nav-btn').forEach(function (b) { b.classList.remove('active'); });

      var scr = document.getElementById('screen-' + screenId);
      if (scr) scr.classList.add('active');

      var btn = document.getElementById('rail-' + screenId);
      if (btn) btn.classList.add('active');

      var stage = document.getElementById('stage');
      if (stage) {
        stage.style.display = (screenId === 'hud' || screenId === 'settings') ? 'none' : 'flex';
      }
    }

    /* Studio Camera Angles */
    function setStudioView(btn, vId) {
      rlHaptic('tap');
      document.querySelectorAll('#rl-app .cam-pill').forEach(function (p) { p.classList.remove('active'); });
      if (btn) btn.classList.add('active');
      try {
        if (typeof CB !== 'undefined' && CB.studio3d && typeof CB.studio3d.setView === 'function') {
          CB.studio3d.setView(vId);
        }
      } catch (e) {}
    }

    /* Car Selection */
    function selectCar(idx) {
      currentCar = idx;
      rlHaptic('select');
      rlPlaySound('select');
      var c = CARS[idx];
      var carImg = document.getElementById('studio-car');
      if (carImg) carImg.src = c.img;

      var makeEl = document.getElementById('home-car-make');
      if (makeEl) makeEl.textContent = c.make;
      var titleEl = document.getElementById('home-car-title');
      if (titleEl) titleEl.textContent = c.name;

      var hpEl = document.getElementById('g-hp');
      if (hpEl) hpEl.textContent = c.hp;
      var tqEl = document.getElementById('g-torque');
      if (tqEl) tqEl.textContent = c.torque;
      var wtEl = document.getElementById('g-weight');
      if (wtEl) wtEl.textContent = c.weight;
      var acEl = document.getElementById('g-accel');
      if (acEl) acEl.textContent = c.accel;
      var spEl = document.getElementById('g-speed');
      if (spEl) spEl.textContent = c.speed;
      var ptwEl = document.getElementById('g-ptw');
      if (ptwEl) ptwEl.textContent = c.ptw;

      document.querySelectorAll('#rl-app .roster-thumb').forEach(function (t, i) {
        t.classList.toggle('active', i === idx);
      });

      updateStudioCar(c.id);

      // Synchronize with Redline game engine if available
      try {
        if (typeof CB !== 'undefined') {
          if (CB.stock && typeof CB.stock.apply === 'function') {
            CB.stock.apply({ model: c.id });
          } else if (CB.state && typeof CB.state.set === 'function') {
            CB.state.set('shape', c.id);
          }
        }
      } catch (e) {}
    }

    function nextCar() {
      var nextIdx = (currentCar + 1) % CARS.length;
      selectCar(nextIdx);
    }

    function prevCar() {
      var prevIdx = (currentCar - 1 + CARS.length) % CARS.length;
      selectCar(prevIdx);
    }

    function confirmSelectCar() {
      rlHaptic('cta');
      var c = CARS[currentCar];
      try {
        if (typeof CB !== 'undefined') {
          if (CB.stock && typeof CB.stock.apply === 'function') {
            CB.stock.apply({ model: c.id });
          } else if (CB.state && typeof CB.state.set === 'function') {
            CB.state.set('shape', c.id);
          }
        }
      } catch (e) {}
      alert('Selected ' + c.name + ' as your active competition car.');
    }

    /* Mode Selection and Launcher */
    function selectMode(card, modeKey) {
      selectedMode = modeKey || 'race';
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('#rl-app .mode-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    }

    function launchSelectedMode() {
      rlHaptic('cta');
      var mode = selectedMode || 'race';
      enterRaceSession(mode);
    }

    function launchCarRace() {
      rlHaptic('cta');
      enterRaceSession('race');
    }

    function enterRaceSession(routeId) {
      document.documentElement.classList.add('rl-in-session');
      try {
        var c = CARS[currentCar];
        if (c && typeof CB !== 'undefined' && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: c.id });
        }
      } catch (e) {}

      if (typeof CB !== 'undefined' && CB.router && typeof CB.router.go === 'function') {
        if (routeId === 'timetrial') CB.router.go('hub', { sub: 'timetrial' });
        else if (routeId === 'multiplayer') CB.router.go('multiplayer');
        else CB.router.go(routeId);
      }
    }

    /* Customization handlers */
    function setFinish(pill, finish) {
      rlHaptic('tap');
      document.querySelectorAll('#rl-app .finish-pill').forEach(function (p) { p.classList.remove('selected'); });
      pill.classList.add('selected');
      try {
        if (typeof CB !== 'undefined' && CB.state && typeof CB.state.set === 'function') {
          CB.state.set('paint.finish', finish);
          updateStudioCar();
        }
      } catch (e) {}
    }

    function pickColor(btn, hex) {
      rlHaptic('tap');
      document.querySelectorAll('#rl-app .swatch-btn').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      try {
        if (typeof CB !== 'undefined' && CB.state && typeof CB.state.set === 'function') {
          CB.state.set('paint.color', hex);
          updateStudioCar();
        }
      } catch (e) {}
    }

    function applyCustomization() {
      rlHaptic('cta');
      try {
        if (typeof CB !== 'undefined' && CB.game && CB.game.profile && typeof CB.game.profile.get === 'function') {
          var p = CB.game.profile.get();
          if (p && p.credits >= 2500) {
            p.credits -= 2500;
            if (typeof CB.game.profile.save === 'function') CB.game.profile.save(p);
            syncProfileData();
            alert('Modifications installed successfully (-2,500 CR).');
            return;
          }
        }
      } catch (e) {}
      alert('Modifications installed successfully.');
    }

    /* Settings handlers */
    function setGraphicsTier(btn, tier) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-tier-val');
      if (valEl) valEl.textContent = tier.toUpperCase();
      try {
        var raw = localStorage.getItem('forge.race.settings.v1');
        var s = raw ? JSON.parse(raw) : {};
        s.quality = tier;
        localStorage.setItem('forge.race.settings.v1', JSON.stringify(s));
        if (typeof CB !== 'undefined' && CB.device && typeof CB.device.setTier === 'function') {
          CB.device.setTier(tier);
        }
      } catch (e) {}
    }

    function setUnits(btn, unit) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-units-val');
      if (valEl) valEl.textContent = unit.toUpperCase();
      try {
        var raw = localStorage.getItem('forge.race.settings.v1');
        var s = raw ? JSON.parse(raw) : {};
        s.units = unit;
        localStorage.setItem('forge.race.settings.v1', JSON.stringify(s));
      } catch (e) {}
    }

    function setMasterVolume(val) {
      var valEl = document.getElementById('cfg-vol-val');
      if (valEl) valEl.textContent = val + '%';
      var themeAudio = document.getElementById('as-sunnah-theme-audio');
      if (themeAudio) {
        themeAudio.volume = Math.max(0, Math.min(1, val / 100));
      }
    }

    function toggleThemeMusic(btn, enable) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-music-val');
      if (valEl) valEl.textContent = enable ? 'ENABLED' : 'MUTED';
      var themeAudio = document.getElementById('as-sunnah-theme-audio');
      if (themeAudio) {
        if (enable) themeAudio.play().catch(function () {});
        else themeAudio.pause();
      }
    }

    function setSteeringSensitivity(val) {
      var valEl = document.getElementById('cfg-sens-val');
      if (valEl) valEl.textContent = (val / 100).toFixed(1) + 'x';
      try {
        var raw = localStorage.getItem('forge.race.settings.v1');
        var s = raw ? JSON.parse(raw) : {};
        s.steerSensitivity = val / 100;
        localStorage.setItem('forge.race.settings.v1', JSON.stringify(s));
      } catch (e) {}
    }

    function setSteerAssist(btn, level) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-assist-val');
      if (valEl) valEl.textContent = level.toUpperCase();
      try {
        var raw = localStorage.getItem('forge.race.settings.v1');
        var s = raw ? JSON.parse(raw) : {};
        s.raceSteerAssist = level;
        s.driftSteerAssist = level;
        localStorage.setItem('forge.race.settings.v1', JSON.stringify(s));
      } catch (e) {}
    }

    function setTouchMode(btn, mode) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-touch-val');
      if (valEl) valEl.textContent = mode.toUpperCase();
      try {
        var raw = localStorage.getItem('forge.race.settings.v1');
        var s = raw ? JSON.parse(raw) : {};
        s.touchControls = mode;
        localStorage.setItem('forge.race.settings.v1', JSON.stringify(s));
      } catch (e) {}
    }

    function setLanguage(btn, lang) {
      rlHaptic('tap');
      btn.parentElement.querySelectorAll('.setting-pill').forEach(function (p) { p.classList.remove('selected'); });
      btn.classList.add('selected');
      var valEl = document.getElementById('cfg-lang-val');
      if (valEl) valEl.textContent = lang === 'bn' ? 'বাংলা' : 'ENGLISH';
    }

    function resetSaveData() {
      if (confirm('Reset your profile, coins, and unlocks to factory default?')) {
        try {
          if (typeof CB !== 'undefined' && CB.game && CB.game.profile && typeof CB.game.profile.reset === 'function') {
            CB.game.profile.reset();
          } else {
            localStorage.removeItem('forge.profile.v1');
          }
        } catch (e) {}
        alert('Profile reset to factory defaults (150,000 CR starter bonus).');
        syncProfileData();
      }
    }

    /* Profile Sync */
    function syncProfileData() {
      try {
        if (typeof CB !== 'undefined' && CB.game && CB.game.profile && typeof CB.game.profile.get === 'function') {
          var p = CB.game.profile.get();
          if (p) {
            var credEl = document.getElementById('val-credits');
            if (credEl && p.credits != null) {
              credEl.textContent = Number(p.credits).toLocaleString() + ' CR';
            }
            var lvlEl = document.getElementById('val-level');
            if (lvlEl && p.level != null) {
              lvlEl.textContent = 'LVL ' + p.level;
            }
          }
        }
      } catch (e) {}
    }

    /* Populate 53 Cars from Engine */
    function populate53Cars() {
      try {
        if (typeof CB !== 'undefined' && CB.shapes && CB.shapes.models) {
          var modelKeys = Object.keys(CB.shapes.models);
          if (modelKeys && modelKeys.length > 5) {
            var strip = document.getElementById('garage-roster');
            if (strip) {
              var specs = (CB.stock && CB.stock.SPECS) || {};
              var html = '';
              for (var i = 0; i < modelKeys.length; i++) {
                var mId = modelKeys[i];
                var sp = specs[mId] || {};
                var mObj = CB.shapes.models[mId] || {};
                var make = mObj.make || (sp.t ? sp.t.split(' ')[0] : 'Jubayer');
                var name = mObj.name || (sp.t || mId.replace(/-/g, ' ').toUpperCase());
                var hp = sp.hp || 380;
                var accel = sp.s || 3.8;
                var isCur = (i === currentCar);
                html += '<div class="roster-thumb ' + (isCur ? 'active' : '') + '" onclick="selectEngineCar(' + i + ', \\'' + mId + '\\')">' +
                  '<span class="thumb-make">' + make + '</span>' +
                  '<span class="thumb-model">' + name + '</span>' +
                  '<span class="thumb-spec">' + hp + ' HP · ' + accel + 's</span>' +
                '</div>';
              }
              strip.innerHTML = html;
            }
          }
        }
      } catch (e) {}
    }

    function selectEngineCar(idx, mId) {
      currentCar = idx;
      rlHaptic('select');
      document.querySelectorAll('#rl-app .roster-thumb').forEach(function (t, i) {
        t.classList.toggle('active', i === idx);
      });
      try {
        if (typeof CB !== 'undefined' && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: mId });
          var sp = CB.stock.SPECS[mId];
          if (sp) {
            var hpEl = document.getElementById('g-hp');
            if (hpEl && sp.hp) hpEl.textContent = sp.hp + ' HP';
            var wtEl = document.getElementById('g-weight');
            if (wtEl && sp.kg) wtEl.textContent = sp.kg + ' KG';
            var acEl = document.getElementById('g-accel');
            if (acEl && sp.s) acEl.textContent = sp.s + ' S';
            var spEl = document.getElementById('g-speed');
            if (spEl && sp.v) spEl.textContent = sp.v + ' KM/H';
          }
        }
      } catch (e) {}
      updateStudioCar(mId);
    }

    /* Switch between UI versions */
    function setUIVersion(v) {
      try {
        localStorage.setItem('redline_ui_version', String(v));
      } catch (e) {}
      var url = new URL(window.location.href);
      url.searchParams.set('ui', String(v));
      window.location.href = url.toString();
    }

    /* Keyboard navigation on Desktop */
    window.addEventListener('keydown', function (e) {
      if (document.documentElement.classList.contains('rl-in-session')) return;
      if (e.key === 'ArrowLeft') {
        prevCar();
      } else if (e.key === 'ArrowRight') {
        nextCar();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (currentScreen === 'home' || currentScreen === 'modes') launchSelectedMode();
        else if (currentScreen === 'garage') launchCarRace();
      } else if (e.key === 'Escape') {
        if (currentScreen !== 'home') navTo('home');
      }
    });

    // Expose APIs globally
    window.navTo = navTo;
    window.selectCar = selectCar;
    window.selectEngineCar = selectEngineCar;
    window.selectMode = selectMode;
    window.launchSelectedMode = launchSelectedMode;
    window.launchCarRace = launchCarRace;
    window.setFinish = setFinish;
    window.pickColor = pickColor;
    window.applyCustomization = applyCustomization;
    window.setGraphicsTier = setGraphicsTier;
    window.setUnits = setUnits;
    window.setMasterVolume = setMasterVolume;
    window.toggleThemeMusic = toggleThemeMusic;
    window.setSteeringSensitivity = setSteeringSensitivity;
    window.setSteerAssist = setSteerAssist;
    window.setTouchMode = setTouchMode;
    window.setLanguage = setLanguage;
    window.resetSaveData = resetSaveData;
    window.setUIVersion = setUIVersion;
    window.syncProfileData = syncProfileData;
    window.nextCar = nextCar;
    window.prevCar = prevCar;
    window.setStudioView = setStudioView;
    window.confirmSelectCar = confirmSelectCar;

    // Listen to router route changes to restore UI v2 on return from race
    document.addEventListener('cb:route', function (ev) {
      var r = ev && ev.detail && ev.detail.route;
      if (r === 'menu') {
        document.documentElement.classList.remove('rl-in-session');
        var app = document.getElementById('rl-app');
        if (app) app.style.display = 'flex';
        syncProfileData();
        updateStudioCar();
      } else if (r === 'race' || r === 'drift' || r === 'arcade' || r === 'derby' || r === 'drag' || r === 'f1') {
        document.documentElement.classList.add('rl-in-session');
      }
    });

    // Initial sync
    setTimeout(function () {
      syncProfileData();
      populate53Cars();
      mountStudio3D();
    }, 150);
  }

  // Auto-boot on DOM ready or router ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI2);
  } else {
    setTimeout(initUI2, 0);
  }

  window.addEventListener('cb:router-ready', function () {
    if (typeof syncProfileData === 'function') {
      syncProfileData();
    }
  });

  CB.ui2 = {
    active: true,
    navTo: function (screen) { if (window.navTo) window.navTo(screen); },
    setVersion: function (v) { if (window.setUIVersion) window.setUIVersion(v); }
  };
})();
`;

fs.writeFileSync(jsPath, ui2JsCode, 'utf8');
console.log('Wrote UI v2 script to', jsPath, '(' + ui2JsCode.length + ' bytes)');
