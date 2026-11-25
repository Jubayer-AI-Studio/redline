/* ==========================================================================
   Redline — js/mobile/debug-overlay.js
   Phase 0: Diagnostic Debug Overlay for mobile performance benchmarking.
   Measures: FPS, Frame Time, Draw Calls, DPR, DOM Updates/sec, JS Heap.
   Toggle: 3-finger tap, Ctrl+Shift+D, or URL parameter ?debug=1
   ========================================================================== */
var CB = (globalThis.CB = globalThis.CB || {});
CB.mobile = CB.mobile || {};

(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Fully inert unless ?debug=1 is explicitly in the query string
  var isDebugRequested = false;
  try {
    isDebugRequested = /[?&]debug(=1)?(&|$)/.test(window.location.search);
  } catch (e) {}

  if (!isDebugRequested) {
    CB.mobile.debugOverlay = {
      active: false,
      show: function () {},
      hide: function () {},
      toggle: function () {},
      isVisible: function () { return false; },
      getStats: function () { return null; }
    };
    return;
  }

  var visible = false;
  var overlayEl = null;

  // 1. Draw call tracking via WebGL prototype hooks
  var drawCallsThisFrame = 0;
  var lastFrameDrawCalls = 0;

  function hookWebGL(proto) {
    if (!proto) return;
    ['drawArrays', 'drawElements'].forEach(function (method) {
      if (typeof proto[method] === 'function') {
        var orig = proto[method];
        proto[method] = function () {
          drawCallsThisFrame++;
          return orig.apply(this, arguments);
        };
      }
    });
  }

  function hookWebGL2(proto) {
    if (!proto) return;
    ['drawArraysInstanced', 'drawElementsInstanced'].forEach(function (method) {
      if (typeof proto[method] === 'function') {
        var orig = proto[method];
        proto[method] = function () {
          drawCallsThisFrame++;
          return orig.apply(this, arguments);
        };
      }
    });
  }

  try {
    if (typeof WebGLRenderingContext !== 'undefined') hookWebGL(WebGLRenderingContext.prototype);
    if (typeof WebGL2RenderingContext !== 'undefined') {
      hookWebGL(WebGL2RenderingContext.prototype);
      hookWebGL2(WebGL2RenderingContext.prototype);
    }
  } catch (e) {
    console.warn('[debug-overlay] WebGL hook skipped:', e);
  }

  // 2. DOM Mutation tracking
  var domMutationsInSec = 0;
  var domMutationRate = 0;
  var lastSecTime = performance.now();

  try {
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        domMutationsInSec += mutations.length;
      });
      document.addEventListener('DOMContentLoaded', function () {
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true, attributes: false });
        }
      });
    }
  } catch (eM) {}

  // 3. Performance metric states
  var frameTimes = [];
  var lastFrameTime = performance.now();
  var avgFps = 60;
  var curFrameMs = 16.6;
  var worstFrameMs = 16.6;
  var lastUiUpdate = 0;

  function measureFrame(now) {
    var dt = now - lastFrameTime;
    lastFrameTime = now;
    curFrameMs = dt;

    lastFrameDrawCalls = drawCallsThisFrame;
    drawCallsThisFrame = 0;

    frameTimes.push(dt);
    if (frameTimes.length > 60) frameTimes.shift();

    // DOM mutation per-second rate
    if (now - lastSecTime >= 1000) {
      domMutationRate = domMutationsInSec;
      domMutationsInSec = 0;
      lastSecTime = now;
    }

    if (visible && now - lastUiUpdate >= 220) {
      lastUiUpdate = now;
      updateUI();
    }

    requestAnimationFrame(measureFrame);
  }
  requestAnimationFrame(measureFrame);

  // 4. UI Rendering
  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'cb-debug-overlay';
    overlayEl.setAttribute('role', 'status');
    overlayEl.setAttribute('aria-label', 'Performance Diagnostics');
    overlayEl.innerHTML =
      '<div class="dbg-hdr"><span>REDLINE DIAG</span><span id="dbg-target">60 FPS</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">FPS</span><span id="dbg-fps" class="dbg-val">--</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">Frame Time</span><span id="dbg-ft" class="dbg-val">-- ms</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">Draw Calls</span><span id="dbg-dc" class="dbg-val">--</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">DPR / Scale</span><span id="dbg-dpr" class="dbg-val">--</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">DOM Updates</span><span id="dbg-dom" class="dbg-val">-- /s</span></div>' +
      '<div class="dbg-row"><span class="dbg-label">JS Heap</span><span id="dbg-heap" class="dbg-val">--</span></div>';
    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  function updateUI() {
    if (!overlayEl) return;

    var sum = 0, worst = 0;
    for (var i = 0; i < frameTimes.length; i++) {
      sum += frameTimes[i];
      if (frameTimes[i] > worst) worst = frameTimes[i];
    }
    var avgDt = frameTimes.length > 0 ? sum / frameTimes.length : 16.6;
    avgFps = Math.round(1000 / Math.max(1, avgDt));
    worstFrameMs = worst;

    var fpsEl = document.getElementById('dbg-fps');
    if (fpsEl) {
      fpsEl.textContent = avgFps + ' fps';
      fpsEl.className = 'dbg-val' + (avgFps >= 55 ? '' : avgFps >= 30 ? ' warn' : ' bad');
    }

    var ftEl = document.getElementById('dbg-ft');
    if (ftEl) {
      ftEl.textContent = curFrameMs.toFixed(1) + ' ms (max ' + worstFrameMs.toFixed(1) + ')';
      ftEl.className = 'dbg-val' + (curFrameMs <= 17.5 ? '' : curFrameMs <= 33.3 ? ' warn' : ' bad');
    }

    var dcEl = document.getElementById('dbg-dc');
    if (dcEl) {
      dcEl.textContent = String(lastFrameDrawCalls);
      dcEl.className = 'dbg-val' + (lastFrameDrawCalls <= 60 ? '' : lastFrameDrawCalls <= 120 ? ' warn' : ' bad');
    }

    var dprEl = document.getElementById('dbg-dpr');
    if (dprEl) {
      var dpr = window.devicePixelRatio || 1;
      dprEl.textContent = dpr.toFixed(2) + 'x';
    }

    var domEl = document.getElementById('dbg-dom');
    if (domEl) {
      domEl.textContent = domMutationRate + ' mut/s';
      domEl.className = 'dbg-val' + (domMutationRate <= 10 ? '' : domMutationRate <= 40 ? ' warn' : ' bad');
    }

    var heapEl = document.getElementById('dbg-heap');
    if (heapEl) {
      if (performance.memory && performance.memory.usedJSHeapSize) {
        var mb = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
        heapEl.textContent = mb + ' MB';
      } else {
        heapEl.textContent = 'N/A';
      }
    }
  }

  function show() {
    ensureOverlay();
    overlayEl.style.display = 'block';
    visible = true;
    try { localStorage.setItem('redline_debug_overlay', '1'); } catch (e) {}
  }

  function hide() {
    if (overlayEl) overlayEl.style.display = 'none';
    visible = false;
    try { localStorage.removeItem('redline_debug_overlay'); } catch (e) {}
  }

  function toggle() {
    if (visible) hide();
    else show();
  }

  // 5. Toggles: 3-finger tap, key shortcuts, URL ?debug=1
  window.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches.length === 3) {
      e.preventDefault();
      toggle();
    }
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      toggle();
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var queryMatch = /[?&]debug(=1)?(&|$)/.test(window.location.search);
    var storedMatch = false;
    try { storedMatch = localStorage.getItem('redline_debug_overlay') === '1'; } catch (e) {}

    if (queryMatch || storedMatch) {
      show();
    }
  });

  CB.mobile.debugOverlay = {
    show: show,
    hide: hide,
    toggle: toggle,
    isVisible: function () { return visible; },
    getStats: function () {
      return {
        fps: avgFps,
        frameTimeMs: curFrameMs,
        worstFrameMs: worstFrameMs,
        drawCalls: lastFrameDrawCalls,
        dpr: window.devicePixelRatio || 1,
        domMutationsPerSec: domMutationRate,
        jsHeapMB: performance.memory && performance.memory.usedJSHeapSize ? (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1) : null
      };
    }
  };
})();
