/* ==========================================================================
   Redline — js/mobile/shell.js
   Phase 1: Mobile Shell & Viewport Controller
   - Eliminates unwanted pull-to-refresh, page bounce, rubberbanding, pinch-zoom
   - Handles true fullscreen on first tap and landscape lock
   - Constrains scrolling exclusively to registered scrollable list views
   - Safe-area inset integration for notches, punch-holes, and gesture bars
   ========================================================================== */
var CB = (globalThis.CB = globalThis.CB || {});
CB.mobile = CB.mobile || {};

(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Block pull-to-refresh, page bounce, rubberband, and pinch zoom
  document.addEventListener('touchmove', function (e) {
    // Multi-touch pinch-to-zoom is strictly forbidden
    if (e.touches && e.touches.length > 1) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    // Allow native interaction on form controls (sliders, inputs, dropdowns)
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }

    // Single touch: allow scrolling ONLY if target is within an explicitly scrollable container
    var el = e.target;
    var canScroll = false;
    while (el && el !== document.body && el !== document.documentElement) {
      // Check explicit class or computed style
      if (el.classList && (
        el.classList.contains('cb-scrollable') ||
        el.classList.contains('menu-scrollable') ||
        el.classList.contains('dialog-scrollable') ||
        el.classList.contains('rx-scroll') ||
        el.classList.contains('hub-scroll') ||
        el.classList.contains('settings-scroll') ||
        el.classList.contains('gh-main') ||
        el.classList.contains('settings-grid') ||
        el.classList.contains('modes-carousel') ||
        el.classList.contains('garage-roster-strip') ||
        el.classList.contains('gh-ledger')
      )) {
        var style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowX === 'auto' || style.overflowX === 'scroll') {
          canScroll = true;
          break;
        }
      }
      el = el.parentElement;
    }

    if (!canScroll && e.cancelable) {
      e.preventDefault();
    }
  }, { passive: false });

  // 2. Block Safari gesture zoom (pinch/expand)
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
  });

  // 3. Block long-press context menu and text selection on game UI
  window.addEventListener('contextmenu', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  document.addEventListener('selectstart', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  // 4. Fullscreen on first tap & Landscape orientation lock (touch devices only)
  var hasInteracted = false;
  function triggerFullscreenAndLock(e) {
    var isTouch = (e && e.pointerType === 'touch') ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      ('ontouchstart' in window);
    if (!isTouch) return;
    if (hasInteracted) return;
    hasInteracted = true;

    // Request fullscreen
    try {
      var root = document.documentElement;
      var req = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;
      if (req && !document.fullscreenElement && !document.webkitFullscreenElement) {
        var p = req.call(root);
        if (p && typeof p.catch === 'function') p.catch(function () {});
      }
    } catch (eFs) {}

    // Lock orientation to landscape
    try {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        var pLock = screen.orientation.lock('landscape');
        if (pLock && typeof pLock.catch === 'function') pLock.catch(function () {});
      }
    } catch (eLock) {}
  }

  window.addEventListener('pointerdown', triggerFullscreenAndLock, { passive: true, once: true });
  window.addEventListener('touchstart', triggerFullscreenAndLock, { passive: true, once: true });

  // 5. Shell public API
  CB.mobile.shell = {
    isLocked: true,
    requestFullscreen: function () {
      triggerFullscreenAndLock();
    }
  };
})();
