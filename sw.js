/* ==========================================================================
   JUBAYER RACING — Complete Offline Service Worker
   Stale-While-Revalidate & Cache-First with Dynamic Runtime Caching
   Guarantees 100% offline single-player gameplay, instant cold start,
   and zero network dependency once cached.
   ========================================================================== */
'use strict';

var CACHE_NAME = 'jubayer-racing-v2-cache-v2';

var PRECACHE_CORE = [
  './',
  './index.html',
  './mockup_realistic.html',
  './manifest.webmanifest',
  './css/styles.css',
  './css/ui2.css',
  './js/ui2/ui2.js',
  './js/router.js',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './audio/as_sunnah_theme.mp3',
  './assets/cards/mode_race.webp',
  './assets/cards/mode_drift.webp',
  './assets/cards/mode_f1.webp',
  './assets/cards/mode_drag.webp',
  './assets/cards/mode_derby.webp',
  './assets/cards/mode_arcade.webp',
  './assets/cards/mode_career.webp',
  './assets/cards/mode_challenges.webp',
  './assets/cards/mode_timetrial.webp',
  './assets/cards/mode_online.webp',
  './assets/cards/car_bmw_m4.webp',
  './assets/cards/car_ferrari_sf90.webp',
  './assets/cards/car_mclaren_p1.webp',
  './assets/cards/car_porsche_911.webp',
  './assets/cards/car_skyline_r34.webp',
  './assets/cards/car_supra_a90.webp',
  './assets/realistic/real_bmw_m4_studio.png',
  './assets/realistic/real_ferrari_sf90_studio.png',
  './assets/realistic/real_mclaren_p1_studio.png',
  './assets/realistic/real_porsche_911_gt3_studio.png',
  './assets/realistic/real_supra_a90_studio.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_CORE);
    }).catch(function (err) {
      console.warn('[SW] Core precache skipped:', err);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // Exclude external origins
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        // Cache hit: serve immediately and refresh in background
        fetch(request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, networkResponse);
            });
          }
        }).catch(function () {});
        return cachedResponse;
      }

      // Cache miss: fetch from network and cache for next offline use
      return fetch(request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      }).catch(function () {
        // Navigation fallback for offline reload
        if (request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
