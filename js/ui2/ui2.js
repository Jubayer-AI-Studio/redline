/* ==========================================================================
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
  var isV2 = (uiParam !== '1');

  if (!isV2) {
    document.documentElement.classList.remove('rl-v2');
    return;
  }

  document.documentElement.classList.add('rl-v2');

  var APP_HTML = "<div class=\"vignette-overlay\"></div>\r\n\r\n    <!-- 3D Studio Stage (Turntable with Soft Floor Shadow & Real In-Game Render) -->\r\n    <div class=\"studio-stage\" id=\"stage\">\r\n      <img src=\"assets/realistic/pristine_showroom_studio.jpg\" class=\"workshop-backdrop\" id=\"studio-backdrop\" alt=\"Showroom Workshop\">\r\n    </div>\r\n\r\n    <!-- Top Navigation & Profile Bar -->\r\n    <header class=\"topbar rk-topbar\" id=\"app-topbar\">\r\n      <!-- Showroom Left Header: Level + Synergy -->\r\n      <div class=\"rk-top-left\" id=\"top-showroom-left\">\r\n        <div class=\"rk-lvl-box\">\r\n          <div class=\"rk-lvl-tag\">Lvl. <span id=\"rk-lvl-num\">28</span></div>\r\n          <div class=\"rk-lvl-track\">\r\n            <div class=\"rk-lvl-fill\" style=\"width: 72%;\"></div>\r\n          </div>\r\n        </div>\r\n        <div class=\"rk-synergy-box\" onclick=\"openRewardsModal()\" style=\"cursor:pointer;\" title=\"Synergy Bonus\">\r\n          <span class=\"rk-gas-icon\">⛽</span>\r\n          <span class=\"rk-synergy-lbl\">Synergy</span>\r\n          <div class=\"rk-synergy-pips\">\r\n            <span class=\"pip active\"></span>\r\n            <span class=\"pip active\"></span>\r\n            <span class=\"pip active\"></span>\r\n            <span class=\"pip active\"></span>\r\n            <span class=\"pip active\"></span>\r\n            <span class=\"pip\"></span>\r\n            <span class=\"pip\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Sub-screen Left Header: Back to Showroom Button (Hidden on Home) -->\r\n      <div class=\"rk-subscreen-left\" id=\"top-subscreen-left\" style=\"display: none;\">\r\n        <button class=\"rk-back-btn\" onclick=\"navTo('home')\" title=\"Back to Showroom\">\r\n          <span class=\"rk-back-arrow\">◀</span>\r\n          <span>SHOWROOM</span>\r\n        </button>\r\n      </div>\r\n\r\n      <!-- Showroom Center: Brand + Model + Tier Badge -->\r\n      <div class=\"rk-top-center\" id=\"top-showroom-center\" onclick=\"navTo('garage')\" style=\"cursor:pointer;\" title=\"Choose Vehicle\">\r\n        <div class=\"rk-car-pill\" id=\"rk-header-car-pill\">\r\n          <div class=\"rk-brand-logo\">\r\n            <span id=\"rk-brand-icon\">🏎️</span>\r\n          </div>\r\n          <div class=\"rk-car-names\">\r\n            <span class=\"rk-make-text\" id=\"rk-make-text\">CHEVROLET</span>\r\n            <span class=\"rk-model-text\" id=\"rk-model-text\">Corvette Z06</span>\r\n          </div>\r\n          <div class=\"rk-tier-tag\">\r\n            <span id=\"rk-tier-text\">T5 1080</span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Sub-screen Center: Screen Title (Hidden on Home) -->\r\n      <div class=\"rk-subscreen-center\" id=\"top-subscreen-center\">\r\n        <span class=\"rk-subscreen-title\" id=\"rk-subscreen-title\" style=\"display: none;\">DEALERSHIP · 53 VEHICLES</span>\r\n      </div>\r\n\r\n      <!-- Right: Dual Currencies (Always Visible) -->\r\n      <div class=\"rk-top-right\">\r\n        <div class=\"rk-currency-chip rk-coin-chip\">\r\n          <span class=\"rk-coin-tag\">RK</span>\r\n          <span class=\"rk-cur-val\" id=\"val-credits\">148,000</span>\r\n          <button class=\"rk-plus-btn\" onclick=\"openRewardsModal()\" title=\"Add Coins\">+</button>\r\n        </div>\r\n        <div class=\"rk-currency-chip rk-cash-chip\">\r\n          <span class=\"rk-cash-tag\">$</span>\r\n          <span class=\"rk-cur-val\" id=\"val-cash\">682</span>\r\n          <button class=\"rk-plus-btn\" onclick=\"openRewardsModal()\" title=\"Add Cash\">+</button>\r\n        </div>\r\n      </div>\r\n    </header>\r\n\r\n    <!-- Navigation Rail -->\r\n    \r\n\r\n    \r\n\r\n    \r\n\r\n    <!-- Screen Containers -->\r\n    <div class=\"screen-container\">\r\n\r\n      <!-- SCREEN 1: SHOWROOM (Clean Automotive Workshop Experience) -->\r\n      <section class=\"screen active\" id=\"screen-home\">\r\n        <!-- Left Event Cards Stack -->\r\n    <aside class=\"rk-left-stack\">\r\n        <!-- Top Row: Hero Event (Left) + 2 Stacked Mini Events (Right) -->\r\n        <div class=\"rk-event-top-row\">\r\n          <div class=\"rk-card-hero\" onclick=\"launchSelectedMode('race')\" title=\"Featured Hypercar Event\">\r\n            <img src=\"assets/realistic/banner_event_hypercar.jpg\" alt=\"Featured Event\">\r\n          </div>\r\n          <div class=\"rk-mini-col\">\r\n            <div class=\"rk-card-mini\" onclick=\"launchSelectedMode('arcade')\" title=\"BMW M4 Challenge\">\r\n              <img src=\"assets/realistic/banner_event_bmw.jpg\" alt=\"BMW Event\">\r\n            </div>\r\n            <div class=\"rk-card-mini\" onclick=\"launchSelectedMode('drift')\" title=\"Drift King Championship\">\r\n              <img src=\"assets/realistic/banner_event_drift.jpg\" alt=\"Drift Event\">\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Middle Row: Battle Pass Card -->\r\n        <div class=\"rk-card-bp\" onclick=\"openRewardsModal()\" title=\"Season 3 Battle Pass\">\r\n          <img src=\"assets/realistic/banner_battlepass.jpg\" alt=\"Battle Pass\">\r\n        </div>\r\n\r\n        <!-- Bottom Row: Chat Pill -->\r\n        <button class=\"rk-chat-btn\" onclick=\"openSocialModal('chat')\">\r\n          <svg viewBox=\"0 0 24 24\"><path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/></svg>\r\n          <span>Chat</span>\r\n        </button>\r\n      </aside>\r\n        <!-- Right Rail (Vertical utility buttons) -->\r\n    <nav class=\"rk-right-rail\">\r\n        <button class=\"rk-rail-item\" onclick=\"navTo('settings')\" title=\"Settings\" id=\"rail-settings\">\r\n          <svg viewBox=\"0 0 24 24\" class=\"rk-rail-svg\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>\r\n          <span class=\"rk-rail-txt\">Settings</span>\r\n        </button>\r\n        <button class=\"rk-rail-item\" onclick=\"openSocialModal('friends')\" title=\"Friends\">\r\n          <svg viewBox=\"0 0 24 24\" class=\"rk-rail-svg\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>\r\n          <span class=\"rk-rail-txt\">Friends</span>\r\n        </button>\r\n        <button class=\"rk-rail-item\" onclick=\"openSocialModal('messages')\" title=\"Messages\">\r\n          <span class=\"rk-rail-badge\">9+</span>\r\n          <svg viewBox=\"0 0 24 24\" class=\"rk-rail-svg\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/></svg>\r\n          <span class=\"rk-rail-txt\">Messages</span>\r\n        </button>\r\n        <button class=\"rk-rail-item\" onclick=\"openSocialModal('clan')\" title=\"Clan\">\r\n          <svg viewBox=\"0 0 24 24\" class=\"rk-rail-svg\"><path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"/><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"/></svg>\r\n          <span class=\"rk-rail-txt\">Clan</span>\r\n        </button>\r\n        <button class=\"rk-rail-item\" onclick=\"openRewardsModal()\" title=\"Rewards\">\r\n          <span class=\"rk-rail-badge pink\">2</span>\r\n          <svg viewBox=\"0 0 24 24\" class=\"rk-rail-svg\"><polyline points=\"20 12 20 22 4 22 4 12\"/><rect x=\"2\" y=\"7\" width=\"20\" height=\"5\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"7\"/><path d=\"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z\"/><path d=\"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\"/></svg>\r\n          <span class=\"rk-rail-txt\">Rewards</span>\r\n        </button>\r\n      </nav>\r\n        <!-- Bottom Command Bar -->\r\n    <footer class=\"rk-bottom-bar\">\r\n        <!-- 2x2 Grid Segment (Slanted parallelogram container with red/pink accents) -->\r\n        <div class=\"rk-cmd-quad-frame\">\r\n          <div class=\"rk-cmd-quad-grid\">\r\n            <!-- Row 1: Buy Car | Upgrades -->\r\n            <button class=\"rk-quad-btn\" onclick=\"navTo('garage')\" id=\"cmd-buy-car\">\r\n              <span class=\"rk-quad-txt\">Buy Car</span>\r\n              <span class=\"rk-quad-ico\">\r\n                <svg viewBox=\"0 0 24 24\" class=\"rk-icon-red\"><path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.4-.1.6v4.5c0 .6.4 1 1 1h2m0 0a2 2 0 1 0 4 0m8 0a2 2 0 1 0 4 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/></svg>\r\n              </span>\r\n            </button>\r\n            <button class=\"rk-quad-btn\" onclick=\"navTo('customize')\" id=\"cmd-upgrades\">\r\n              <span class=\"rk-quad-txt\">Upgrades</span>\r\n              <span class=\"rk-quad-ico\">\r\n                <svg viewBox=\"0 0 24 24\" class=\"rk-icon-red\"><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M12 16V8m-4 4l4-4 4 4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/></svg>\r\n              </span>\r\n            </button>\r\n            <!-- Row 2: Customization | Tuning -->\r\n            <button class=\"rk-quad-btn\" onclick=\"navTo('customize')\" id=\"cmd-customization\">\r\n              <span class=\"rk-quad-txt\">Customization</span>\r\n              <span class=\"rk-quad-ico\">\r\n                <svg viewBox=\"0 0 24 24\" class=\"rk-icon-red\"><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/></svg>\r\n              </span>\r\n            </button>\r\n            <button class=\"rk-quad-btn\" onclick=\"navTo('customize')\" id=\"cmd-tuning\">\r\n              <span class=\"rk-quad-txt\">Tuning</span>\r\n              <span class=\"rk-quad-ico\">\r\n                <svg viewBox=\"0 0 24 24\" class=\"rk-icon-red\"><path d=\"M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/></svg>\r\n              </span>\r\n            </button>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Store Button (Slanted Parallelogram with Tools/Hoist Icon) -->\r\n        <button class=\"rk-store-btn\" onclick=\"navTo('garage')\" id=\"cmd-store\">\r\n          <span class=\"rk-store-txt\">Store</span>\r\n          <span class=\"rk-store-ico\">\r\n            <svg viewBox=\"0 0 24 24\" class=\"rk-icon-red\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/></svg>\r\n          </span>\r\n        </button>\r\n\r\n        <!-- Big Slanted High-Energy RACE CTA Button with Flag Pattern -->\r\n        <button class=\"rk-race-cta\" onclick=\"launchCarRace()\" id=\"cta-race\">\r\n          <span class=\"rk-race-word\">Race</span>\r\n          <span class=\"rk-flag-pattern\"></span>\r\n        </button>\r\n      </footer>\r\n      </section>\r\n\r\n      <!-- SCREEN 2: MODES (Photographic Real Event Cards - All 10 Game Modes) -->\r\n      <section class=\"screen\" id=\"screen-modes\">\r\n        <div class=\"modes-content\">\r\n          <div class=\"section-header\">\r\n            <h2 class=\"section-title\">CHOOSE COMPETITION</h2>\r\n            <p class=\"section-desc\">Select from 10 competitive disciplines with verified telemetry</p>\r\n          </div>\r\n          <div class=\"modes-carousel\">\r\n            <!-- Mode 1: Circuit Race -->\r\n            <div class=\"mode-card selected\" onclick=\"selectMode(this, 'race')\">\r\n              <img src=\"assets/cards/mode_race.webp\" class=\"mode-card-img\" alt=\"Circuit Sprint\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">CIRCUIT</span>\r\n                <div class=\"mode-name\">Grand Prix Sprint</div>\r\n                <div class=\"mode-info\">8-car closed-course race on Dhaka GP.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 2: Drift Attack -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'drift')\">\r\n              <img src=\"assets/cards/mode_drift.webp\" class=\"mode-card-img\" alt=\"Drift Attack\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">DRIFT</span>\r\n                <div class=\"mode-name\">Tandem Battles</div>\r\n                <div class=\"mode-info\">Precision angle scoring & clipping zones.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 3: Formula 1 -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'f1')\">\r\n              <img src=\"assets/cards/mode_f1.webp\" class=\"mode-card-img\" alt=\"Formula 1\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">OPEN WHEEL</span>\r\n                <div class=\"mode-name\">F1 World Tour</div>\r\n                <div class=\"mode-info\">22-car grid with DRS and tire strategy.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 4: 1/4 Mile Drag -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'drag')\">\r\n              <img src=\"assets/cards/mode_drag.webp\" class=\"mode-card-img\" alt=\"Drag Strip\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">DRAG STRIP</span>\r\n                <div class=\"mode-name\">Pro Staging</div>\r\n                <div class=\"mode-info\">Reaction times, burnout grip and trap speeds.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 5: Demolition Derby -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'derby')\">\r\n              <img src=\"assets/cards/mode_derby.webp\" class=\"mode-card-img\" alt=\"Demolition Derby\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">DESTRUCTION</span>\r\n                <div class=\"mode-name\">Demolition Derby</div>\r\n                <div class=\"mode-info\">Vehicular combat with live metal deformation.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 6: Stunt Arcade -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'arcade')\">\r\n              <img src=\"assets/cards/mode_arcade.webp\" class=\"mode-card-img\" alt=\"Stunt Arcade\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">ARCADE</span>\r\n                <div class=\"mode-name\">Stunt Stadium</div>\r\n                <div class=\"mode-info\">High-flying loops, corkscrews and nitro stunts.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 7: Career -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'career')\">\r\n              <img src=\"assets/cards/mode_career.webp\" class=\"mode-card-img\" alt=\"Career Mode\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">CAREER</span>\r\n                <div class=\"mode-name\">Professional Path</div>\r\n                <div class=\"mode-info\">Championship tiers, sponsors and prizes.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 8: Challenges -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'challenges')\">\r\n              <img src=\"assets/cards/mode_challenges.webp\" class=\"mode-card-img\" alt=\"Challenges\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">CHALLENGE</span>\r\n                <div class=\"mode-name\">Master Trials</div>\r\n                <div class=\"mode-info\">Target times and technical obstacle courses.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 9: Time Attack -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'timetrial')\">\r\n              <img src=\"assets/cards/mode_timetrial.webp\" class=\"mode-card-img\" alt=\"Time Attack\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">TIME ATTACK</span>\r\n                <div class=\"mode-name\">Hotlap Records</div>\r\n                <div class=\"mode-info\">Ghost cars, sector splits and global records.</div>\r\n              </div>\r\n            </div>\r\n            <!-- Mode 10: Multiplayer -->\r\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'multiplayer')\">\r\n              <img src=\"assets/cards/mode_online.webp\" class=\"mode-card-img\" alt=\"Multiplayer\">\r\n              <div class=\"mode-card-grad\"></div>\r\n              <div class=\"mode-card-body\">\r\n                <span class=\"mode-badge\">MULTIPLAYER</span>\r\n                <div class=\"mode-name\">Live P2P Lobby</div>\r\n                <div class=\"mode-info\">Low-latency WebRTC real-time racing.</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"modes-action-bar\">\r\n            <button class=\"cta-play-btn\" id=\"launch-mode-btn\" onclick=\"launchSelectedMode()\">\r\n              <span>START EVENT</span>\r\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><polyline points=\"9 18 15 12 9 6\"/></svg>\r\n            </button>\r\n          </div>\r\n        </div>\r\n      </section>\r\n\r\n      <!-- SCREEN 3: GARAGE (Gran Turismo Telemetry & 53 Cars Dealership) -->\r\n      <section class=\"screen\" id=\"screen-garage\">\r\n        <!-- Floating Prev/Next Car Arrows -->\r\n        <button class=\"car-nav-arrow arrow-prev\" onclick=\"prevCar()\" title=\"Previous Vehicle\">◀</button>\r\n        <button class=\"car-nav-arrow arrow-next\" onclick=\"nextCar()\" title=\"Next Vehicle\">▶</button>\r\n\r\n        <!-- Top-Center: Camera Viewing Angles Bar -->\r\n        <div class=\"camera-bar\">\r\n          <button class=\"cam-pill active\" onclick=\"setStudioView(this, 'side')\">3/4 ORBIT</button>\r\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'front')\">FRONT</button>\r\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'rear')\">REAR</button>\r\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'top')\">TOP</button>\r\n        </div>\r\n\r\n        \r\n        <!-- Dealership 3D Hero Car Centerpiece -->\r\n        <div class=\"garage-car-showcase\">\r\n          <img src=\"assets/realistic/real_porsche_911_gt3_studio.png\" class=\"garage-hero-img\" id=\"garage-hero-img\" alt=\"Selected Dealership Vehicle\">\r\n          <div class=\"garage-floor-shadow\"></div>\r\n        </div>\r\n\r\n        <!-- Top-Left: Technical Specifications Card -->\r\n        <div class=\"garage-telemetry\">\r\n          <div class=\"micro-label\">TECHNICAL SPECIFICATION</div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">PEAK POWER</span>\r\n            <span class=\"telemetry-val\" id=\"g-hp\">502 HP @ 8,400 RPM</span>\r\n          </div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">PEAK TORQUE</span>\r\n            <span class=\"telemetry-val\" id=\"g-torque\">470 NM</span>\r\n          </div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">KERB WEIGHT</span>\r\n            <span class=\"telemetry-val\" id=\"g-weight\">1,435 KG</span>\r\n          </div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">0–100 KM/H</span>\r\n            <span class=\"telemetry-val\" id=\"g-accel\">3.2 S</span>\r\n          </div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">MAX SPEED</span>\r\n            <span class=\"telemetry-val\" id=\"g-speed\">318 KM/H</span>\r\n          </div>\r\n          <div class=\"telemetry-row\">\r\n            <span class=\"telemetry-key\">POWER / WEIGHT</span>\r\n            <span class=\"telemetry-val\" id=\"g-ptw\">0.350 HP/KG</span>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Top-Right: Action Buttons -->\r\n        <div class=\"garage-action-btns\">\r\n          <button class=\"garage-select-btn\" onclick=\"confirmSelectCar()\">SELECT THIS CAR</button>\r\n          <button class=\"garage-drive-btn\" onclick=\"launchCarRace()\">🏎️ DRIVE NOW</button>\r\n        </div>\r\n\r\n        <!-- Bottom: 53 Cars Horizontal Roster Strip -->\r\n        <div class=\"garage-roster-strip\" id=\"garage-roster\">\r\n          <!-- Real models rendered directly from game catalog -->\r\n          <div class=\"roster-thumb active\" onclick=\"selectCar(0)\">\r\n            <span class=\"thumb-make\">PORSCHE</span>\r\n            <span class=\"thumb-model\">911 GT3 (992)</span>\r\n            <span class=\"thumb-spec\">502 HP · 3.2s</span>\r\n          </div>\r\n          <div class=\"roster-thumb\" onclick=\"selectCar(1)\">\r\n            <span class=\"thumb-make\">BMW</span>\r\n            <span class=\"thumb-model\">M4 Competition</span>\r\n            <span class=\"thumb-spec\">503 HP · 3.8s</span>\r\n          </div>\r\n          <div class=\"roster-thumb\" onclick=\"selectCar(2)\">\r\n            <span class=\"thumb-make\">TOYOTA</span>\r\n            <span class=\"thumb-model\">GR Supra RZ</span>\r\n            <span class=\"thumb-spec\">382 HP · 3.9s</span>\r\n          </div>\r\n          <div class=\"roster-thumb\" onclick=\"selectCar(3)\">\r\n            <span class=\"thumb-make\">FERRARI</span>\r\n            <span class=\"thumb-model\">SF90 Stradale</span>\r\n            <span class=\"thumb-spec\">986 HP · 2.5s</span>\r\n          </div>\r\n          <div class=\"roster-thumb\" onclick=\"selectCar(4)\">\r\n            <span class=\"thumb-make\">MCLAREN</span>\r\n            <span class=\"thumb-model\">P1 Hypercar</span>\r\n            <span class=\"thumb-spec\">903 HP · 2.8s</span>\r\n          </div>\r\n        </div>\r\n      </section>\r\n\r\n      <!-- SCREEN 4: CUSTOMIZE (Photoreal Paint & Hotspots) -->\r\n      <section class=\"screen\" id=\"screen-customize\">\r\n        <!-- Hotspot pins with thin leader lines -->\r\n        <div class=\"hotspot-pin pin-aero\">\r\n          <div class=\"hotspot-label\">AERO SPOILER</div>\r\n        </div>\r\n        <div class=\"hotspot-pin pin-paint\">\r\n          <div class=\"hotspot-label\">OEM PAINT FINISH</div>\r\n        </div>\r\n        <div class=\"hotspot-pin pin-wheels\">\r\n          <div class=\"hotspot-label\">FORGED WHEELS & TIRES</div>\r\n        </div>\r\n\r\n        <div class=\"customize-panel\">\r\n          <div class=\"customize-title\">FINISH & COATING</div>\r\n          <div class=\"finish-selector\">\r\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'gloss')\">Gloss</button>\r\n            <button class=\"finish-pill selected\" onclick=\"setFinish(this, 'metallic')\">Metallic</button>\r\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'matte')\">Satin</button>\r\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'pearl')\">Pearl</button>\r\n          </div>\r\n\r\n          <div class=\"micro-label\">OEM PALETTE</div>\r\n          <div class=\"swatch-grid\">\r\n            <button class=\"swatch-btn selected\" data-swatch=\"red\" onclick=\"pickColor(this, '#b91c1c')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"blue\" onclick=\"pickColor(this, '#1d4ed8')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"black\" onclick=\"pickColor(this, '#111827')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"silver\" onclick=\"pickColor(this, '#e5e7eb')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"orange\" onclick=\"pickColor(this, '#c2410c')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"green\" onclick=\"pickColor(this, '#047857')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"grey\" onclick=\"pickColor(this, '#4b5563')\"></button>\r\n            <button class=\"swatch-btn\" data-swatch=\"gold\" onclick=\"pickColor(this, '#d97706')\"></button>\r\n          </div>\r\n\r\n          <div class=\"cost-summary-row\">\r\n            <span class=\"cost-key\">INSTALLATION</span>\r\n            <span class=\"cost-val\">2,500 CR</span>\r\n          </div>\r\n\r\n          <button class=\"apply-btn\" onclick=\"applyCustomization()\">APPLY MODIFICATIONS</button>\r\n        </div>\r\n      </section>\r\n\r\n      <!-- SCREEN: SETTINGS (Global Graphics, Audio, Controls & Offline) -->\r\n      <section class=\"screen\" id=\"screen-settings\">\r\n        <div class=\"settings-content\">\r\n          <div class=\"section-header\">\r\n            <h2 class=\"section-title\">GLOBAL SETTINGS</h2>\r\n            <p class=\"section-desc\">Performance, graphics tiers, acoustics, input sensitivity and storage</p>\r\n          </div>\r\n          <div class=\"settings-grid\">\r\n            <!-- Group 1: Graphics & Display -->\r\n            <div class=\"settings-group\">\r\n              <div class=\"settings-group-title\"><span>🖥️ GRAPHICS & FIDELITY</span></div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Preset Tier</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-tier-val\">AUTO (HIGH)</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill selected\" onclick=\"setGraphicsTier(this, 'auto')\">Auto</button>\r\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'low')\">Low</button>\r\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'medium')\">Med</button>\r\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'high')\">High</button>\r\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'ultra')\">Ultra</button>\r\n                </div>\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Speedometer Units</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-units-val\">KM/H</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill selected\" onclick=\"setUnits(this, 'kph')\">KM/H</button>\r\n                  <button class=\"setting-pill\" onclick=\"setUnits(this, 'mph')\">MPH</button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            <!-- Group 2: Audio Mixer -->\r\n            <div class=\"settings-group\">\r\n              <div class=\"settings-group-title\"><span>🔊 AUDIO & ACOUSTICS</span></div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Master Volume</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-vol-val\">85%</span>\r\n                </div>\r\n                <input type=\"range\" class=\"setting-slider\" min=\"0\" max=\"100\" value=\"85\" oninput=\"setMasterVolume(this.value)\">\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Theme Music</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-music-val\">ENABLED</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill selected\" onclick=\"toggleThemeMusic(this, true)\">On</button>\r\n                  <button class=\"setting-pill\" onclick=\"toggleThemeMusic(this, false)\">Mute</button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            <!-- Group 3: Driving & Input -->\r\n            <div class=\"settings-group\">\r\n              <div class=\"settings-group-title\"><span>🎮 STEERING & CONTROLS</span></div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Steering Sensitivity</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-sens-val\">1.0x</span>\r\n                </div>\r\n                <input type=\"range\" class=\"setting-slider\" min=\"50\" max=\"160\" value=\"100\" oninput=\"setSteeringSensitivity(this.value)\">\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Steering Assist</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-assist-val\">MEDIUM</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'off')\">Off</button>\r\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'light')\">Light</button>\r\n                  <button class=\"setting-pill selected\" onclick=\"setSteerAssist(this, 'medium')\">Med</button>\r\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'heavy')\">Heavy</button>\r\n                </div>\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Touch Controls (Mobile)</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-touch-val\">ALWAYS</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill selected\" onclick=\"setTouchMode(this, 'always')\">Always</button>\r\n                  <button class=\"setting-pill\" onclick=\"setTouchMode(this, 'auto')\">Auto</button>\r\n                  <button class=\"setting-pill\" onclick=\"setTouchMode(this, 'never')\">Hide</button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            <!-- Group 4: Offline & Localization -->\r\n            <div class=\"settings-group\">\r\n              <div class=\"settings-group-title\"><span>🌐 SYSTEM & OFFLINE</span></div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Language</span>\r\n                  <span class=\"setting-value-badge\" id=\"cfg-lang-val\">ENGLISH</span>\r\n                </div>\r\n                <div class=\"setting-pills\">\r\n                  <button class=\"setting-pill selected\" onclick=\"setLanguage(this, 'en')\">English</button>\r\n                  <button class=\"setting-pill\" onclick=\"setLanguage(this, 'bn')\">বাংলা</button>\r\n                </div>\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <div class=\"setting-label-row\">\r\n                  <span class=\"setting-label\">Offline Playback</span>\r\n                  <span class=\"offline-badge\">● 100% OFFLINE READY</span>\r\n                </div>\r\n                <p class=\"section-desc\">All 53 cars, audio, tracks & physics run locally without internet.</p>\r\n              </div>\r\n              <div class=\"setting-item\">\r\n                <button class=\"quick-btn\" style=\"width:100%;justify-content:center;margin-top:6px;\" onclick=\"resetSaveData()\">\r\n                  <span>Reset Local Progress</span>\r\n                </button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </section>\r\n\r\n      <!-- SCREEN 5: IN-RACE HUD (Minimalist & Unobtrusive) -->\r\n      <section class=\"screen\" id=\"screen-hud\">\r\n        <!-- Road Backdrop -->\r\n        <div class=\"hud-backdrop\"></div>\r\n\r\n        <!-- Top Cluster -->\r\n        <div class=\"hud-cluster-top\">\r\n          <span class=\"hud-lap-badge\">LAP 2/3</span>\r\n          <span class=\"hud-lap-time\">01:24.89</span>\r\n          <span class=\"hud-split-time\">-0.34s</span>\r\n        </div>\r\n\r\n        <!-- Top Right Actions -->\r\n        <div class=\"hud-top-actions\">\r\n          <button class=\"hud-util-btn\" title=\"Pause\">\r\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg>\r\n          </button>\r\n          <button class=\"hud-util-btn\" title=\"Camera\">\r\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"/><circle cx=\"12\" cy=\"13\" r=\"4\"/></svg>\r\n          </button>\r\n        </div>\r\n\r\n        <!-- Minimal Slim Tachometer Arc & Central Speed -->\r\n        <div class=\"hud-telemetry-bottom\">\r\n          <div class=\"speed-gauge-wrap\">\r\n            <svg class=\"speed-gauge-svg\" viewBox=\"0 0 140 70\">\r\n              <!-- Background Arc -->\r\n              <path d=\"M 15 65 A 55 55 0 0 1 125 65\" fill=\"none\" stroke=\"rgba(255,255,255,0.12)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\r\n              <!-- Active RPM Arc -->\r\n              <path d=\"M 15 65 A 55 55 0 0 1 100 20\" fill=\"none\" stroke=\"var(--text-white)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\r\n              <!-- Redline Tip -->\r\n              <path d=\"M 100 20 A 55 55 0 0 1 125 65\" fill=\"none\" stroke=\"var(--accent-red)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\r\n            </svg>\r\n            <span class=\"hud-speed-num\">248</span>\r\n            <span class=\"hud-speed-unit\">KM/H</span>\r\n          </div>\r\n          <span class=\"hud-gear-badge\">GEAR 5</span>\r\n        </div>\r\n\r\n        <!-- Low-Opacity Minimalist Touch Controls (Transparent Wireframes) -->\r\n        <div class=\"hud-touch-left\">\r\n          <button class=\"touch-btn\">◀</button>\r\n          <button class=\"touch-btn\">▶</button>\r\n        </div>\r\n\r\n        <div class=\"hud-touch-right\">\r\n          <button class=\"touch-btn touch-brk\">BRK</button>\r\n          <button class=\"touch-btn touch-gas\">GAS</button>\r\n        </div>\r\n      </section>\r\n\r\n    \r\n    <!-- Interactive In-Game Social & Rewards Modal -->\r\n    <div class=\"rk-modal-overlay\" id=\"rk-modal-overlay\" onclick=\"closeGameModal(event)\">\r\n      <div class=\"rk-modal-dialog\" onclick=\"event.stopPropagation()\">\r\n        <header class=\"rk-modal-header\">\r\n          <div class=\"rk-modal-title-row\">\r\n            <span class=\"rk-modal-icon\" id=\"rk-modal-icon\">🏆</span>\r\n            <h3 class=\"rk-modal-title\" id=\"rk-modal-title\">DAILY REWARDS</h3>\r\n          </div>\r\n          <button class=\"rk-modal-close\" onclick=\"closeGameModal()\" title=\"Close\">✕</button>\r\n        </header>\r\n        <div class=\"rk-modal-body\" id=\"rk-modal-body\">\r\n          <!-- Dynamic Content -->\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- In-Game Animated Toast Notification -->\r\n    <div class=\"rk-game-toast\" id=\"rk-game-toast\">\r\n      <span class=\"rk-toast-ico\" id=\"rk-toast-ico\">🏎️</span>\r\n      <span class=\"rk-toast-msg\" id=\"rk-toast-msg\">Vehicle Equipped</span>\r\n    </div>\r\n\r\n</div>";

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

  var _navTo, _selectCar, _selectEngineCar, _selectMode, _launchSelectedMode, _launchCarRace;
  var _setFinish, _pickColor, _applyCustomization, _setGraphicsTier, _setUnits;
  var _setMasterVolume, _toggleThemeMusic, _setSteeringSensitivity, _setSteerAssist;
  var _setTouchMode, _setLanguage, _resetSaveData, _setUIVersion, _syncProfileData;
  var _nextCar, _prevCar, _setStudioView, _confirmSelectCar, _openSocialModal, _openRewardsModal;
  var _showToast, _closeGameModal, _sendChatMessage, _claimBonusCredits, _claimDailyReward, _inviteFriend, _pokeFriend, _refillBooster;


  window.navTo = function(s) { if (_navTo) _navTo(s); };
  window.selectCar = function(i) { if (_selectCar) _selectCar(i); };
  window.selectEngineCar = function(i, m) { if (_selectEngineCar) _selectEngineCar(i, m); };
  window.selectMode = function(c, m) { if (_selectMode) _selectMode(c, m); };
  window.launchSelectedMode = function(m) { if (_launchSelectedMode) _launchSelectedMode(m); };
  window.launchCarRace = function() { if (_launchCarRace) _launchCarRace(); };
  window.nextCar = function() { if (_nextCar) _nextCar(); };
  window.prevCar = function() { if (_prevCar) _prevCar(); };
  window.setStudioView = function(b, v) { if (_setStudioView) _setStudioView(b, v); };
  window.confirmSelectCar = function() { if (_confirmSelectCar) _confirmSelectCar(); };
  window.setFinish = function(p, f) { if (_setFinish) _setFinish(p, f); };
  window.pickColor = function(b, h) { if (_pickColor) _pickColor(b, h); };
  window.applyCustomization = function() { if (_applyCustomization) _applyCustomization(); };
  window.setGraphicsTier = function(b, t) { if (_setGraphicsTier) _setGraphicsTier(b, t); };
  window.setUnits = function(b, u) { if (_setUnits) _setUnits(b, u); };
  window.setMasterVolume = function(v) { if (_setMasterVolume) _setMasterVolume(v); };
  window.toggleThemeMusic = function(b, e) { if (_toggleThemeMusic) _toggleThemeMusic(b, e); };
  window.setSteeringSensitivity = function(v) { if (_setSteeringSensitivity) _setSteeringSensitivity(v); };
  window.setSteerAssist = function(b, l) { if (_setSteerAssist) _setSteerAssist(b, l); };
  window.setTouchMode = function(b, m) { if (_setTouchMode) _setTouchMode(b, m); };
  window.setLanguage = function(b, l) { if (_setLanguage) _setLanguage(b, l); };
  window.resetSaveData = function() { if (_resetSaveData) _resetSaveData(); };
  window.setUIVersion = function(v) { if (_setUIVersion) _setUIVersion(v); };
  window.syncProfileData = function() { if (_syncProfileData) _syncProfileData(); };
  window.openSocialModal = function(t) { if (_openSocialModal) _openSocialModal(t); };
  window.openRewardsModal = function() { if (_openRewardsModal) _openRewardsModal(); };
  window.showToast = function(m, i) { if (_showToast) _showToast(m, i); };
  window.closeGameModal = function(e) { if (_closeGameModal) _closeGameModal(e); };
  window.sendChatMessage = function() { if (_sendChatMessage) _sendChatMessage(); };
  window.claimBonusCredits = function(a, b) { if (_claimBonusCredits) _claimBonusCredits(a, b); };
  window.claimDailyReward = function(a) { if (_claimDailyReward) _claimDailyReward(a); };
  window.inviteFriend = function(id) { if (_inviteFriend) _inviteFriend(id); };
  window.pokeFriend = function(id) { if (_pokeFriend) _pokeFriend(id); };
  window.refillBooster = function() { if (_refillBooster) _refillBooster(); };


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
        var gImg = document.getElementById('garage-hero-img');
        if (gImg) {
          var carObj = CARS[currentCar % CARS.length];
          if (carObj && carObj.img) gImg.src = carObj.img;
        }
      } catch (e) {}
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
      var app = document.getElementById('rl-app');
      if (app) app.classList.toggle('has-subscreen', screenId !== 'home');

      currentScreen = screenId;
      rlHaptic('tap');
      rlPlaySound('tap');

      document.querySelectorAll('#rl-app .screen').forEach(function (s) { s.classList.remove('active'); });

      var scr = document.getElementById('screen-' + screenId);
      if (scr) scr.classList.add('active');

      var stage = document.getElementById('stage');
      if (stage) {
        stage.style.display = (screenId === 'hud' || screenId === 'settings') ? 'none' : 'flex';
      }

      // Update topbar header between showroom and subscreen
      var showroomLeft = document.getElementById('top-showroom-left');
      var showroomCenter = document.getElementById('top-showroom-center');
      var subscreenLeft = document.getElementById('top-subscreen-left');
      var subscreenTitle = document.getElementById('rk-subscreen-title');

      var titles = {
        garage: 'DEALERSHIP · 53 VEHICLES',
        modes: 'COMPETITION · 10 DISCIPLINES',
        customize: 'OEM CUSTOMIZATION & ATELIER',
        settings: 'GLOBAL SYSTEM SETTINGS',
        hud: 'RACE TELEMETRY COCKPIT'
      };

      if (screenId === 'home') {
        if (showroomLeft) showroomLeft.style.display = 'flex';
        if (showroomCenter) showroomCenter.style.display = 'flex';
        if (subscreenLeft) subscreenLeft.style.display = 'none';
        if (subscreenTitle) subscreenTitle.style.display = 'none';
      } else {
        if (showroomLeft) showroomLeft.style.display = 'none';
        if (showroomCenter) showroomCenter.style.display = 'none';
        if (subscreenLeft) subscreenLeft.style.display = 'flex';
        if (subscreenTitle) {
          subscreenTitle.style.display = 'block';
          subscreenTitle.textContent = titles[screenId] || screenId.toUpperCase();
        }
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

      var rkMake = document.getElementById('rk-make-text');
      var rkModel = document.getElementById('rk-model-text');
      var rkTier = document.getElementById('rk-tier-text');
      if (rkMake) rkMake.textContent = c.make;
      if (rkModel) rkModel.textContent = c.name;
      if (rkTier) rkTier.textContent = c.tier || 'T5 1080';

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

    function showToast(msg, icon) {
      var toast = document.getElementById('rk-game-toast');
      var msgEl = document.getElementById('rk-toast-msg');
      var icoEl = document.getElementById('rk-toast-ico');
      if (toast && msgEl) {
        msgEl.textContent = msg;
        if (icoEl && icon) icoEl.textContent = icon;
        toast.classList.add('show');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2600);
      }
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
      showToast(c.name + ' Equipped', '🏎️');
    }

    /* Mode Selection and Launcher */
    function selectMode(card, modeKey) {
      selectedMode = modeKey || 'race';
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('#rl-app .mode-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    }

    function launchSelectedMode(overrideMode) {
      rlHaptic('cta');
      var mode = overrideMode || selectedMode || 'race';
      showToast('Launching ' + mode.toUpperCase() + '...', '🏎️');
      setTimeout(function() {
        enterRaceSession(mode);
      }, 300);
    }

    
    function inviteFriend(id) {
      var name = id === 1 ? 'Tamim_Apex' : 'Rahat_DriftKing';
      showToast('Invite sent to ' + name, '🏎️');
    }
    function pokeFriend(id) {
      showToast('Profile pinged', '🔔');
    }
    function refillBooster() {
      showToast('Free Gold Booster Refilled', '✨');
    }

    function openSocialModal(type) {
      rlHaptic('tap');
      var overlay = document.getElementById('rk-modal-overlay');
      var titleEl = document.getElementById('rk-modal-title');
      var iconEl = document.getElementById('rk-modal-icon');
      var bodyEl = document.getElementById('rk-modal-body');
      if (!overlay || !bodyEl) return;

      var titles = {
        chat: { title: 'PADDOCK LOBBY CHAT', icon: '💬' },
        friends: { title: 'RIVAL DRIVERS & FRIENDS', icon: '👥' },
        messages: { title: 'TEAM INBOX & ALERTS', icon: '✉️' },
        clan: { title: 'MOTORSPORT CLAN · BANGLADESH', icon: '🏁' },
        rewards: { title: 'DAILY LOGIN REWARDS', icon: '🎁' },
        wallet: { title: 'BANK & CREDITS STORE', icon: '💳' }
      };

      var meta = titles[type] || { title: 'SERVICE PORTAL', icon: '🌐' };
      if (titleEl) titleEl.textContent = meta.title;
      if (iconEl) iconEl.textContent = meta.icon;

      if (type === 'chat') {
        bodyEl.innerHTML = '<div class="rk-chat-feed" id="rk-chat-feed">' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">SpeedDemon:</span>Anyone up for downhill drift on Mountain Pass?</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">ApexHunter:</span>Just beat the 01:22 lap record on Dhaka GP!</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">TurboDrift:</span>The GR Supra with Stage 2 turbo feels incredible.</div>' +
          '<div class="rk-chat-msg"><span class="rk-chat-sender">RedlineDev:</span>Server connection 100% active. Offline cache verified.</div>' +
          '</div>' +
          '<div class="rk-chat-input-row">' +
          '<input type="text" class="rk-chat-input" id="rk-chat-inp" placeholder="Send paddock message..." onkeydown="if(event.keyCode===13)sendChatMessage()">' +
          '<button class="rk-chat-send" onclick="sendChatMessage()">SEND</button>' +
          '</div>';
      } else if (type === 'friends') {
        bodyEl.innerHTML = '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Tamim_Apex</span><span class="rk-list-status online">● Online · Dhaka GP</span></div>' +
          '<button class="rk-action-pill primary" onclick="inviteFriend(1)">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Rahat_DriftKing</span><span class="rk-list-status online">● Online · In Garage</span></div>' +
          '<button class="rk-action-pill primary" onclick="inviteFriend(2)">INVITE</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Speedy_Jubayer</span><span class="rk-list-status">● Offline 2h ago</span></div>' +
          '<button class="rk-action-pill" onclick="pokeFriend(3)">POKE</button>' +
          '</div>';
      } else if (type === 'messages') {
        bodyEl.innerHTML = '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Season 3 Pro Sponsor Payout</span><span class="rk-list-status">+25,000 CR available</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(25000, this)">CLAIM</button>' +
          '</div>' +
          '<div class="rk-list-row">' +
          '<div class="rk-list-col"><span class="rk-list-name">Clean Drift Challenge Bonus</span><span class="rk-list-status">+15,000 CR available</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(15000, this)">CLAIM</button>' +
          '</div>';
      } else if (type === 'clan') {
        bodyEl.innerHTML = '<div style="background:rgba(255,42,75,0.08);padding:12px;border-radius:8px;border:1px solid rgba(255,42,75,0.2);display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
          '<div style="font-size:15px;font-weight:800;color:#fff;">RACING KINGDOM BD</div>' +
          '<div style="font-size:11px;color:#ff6b84;">Rank #3 · 48/50 Drivers · Lvl 14 Club</div>' +
          '</div>' +
          '<span style="font-size:24px;">👑</span>' +
          '</div>' +
          '<div class="rk-list-row" style="margin-top:8px;">' +
          '<div class="rk-list-col"><span class="rk-list-name">Daily Clan Check-in</span><span class="rk-list-status">Earn +5,000 CR for your team</span></div>' +
          '<button class="rk-action-pill primary" onclick="claimBonusCredits(5000, this)">CHECK IN</button>' +
          '</div>';
      } else if (type === 'rewards') {
        bodyEl.innerHTML = '<div style="font-size:12px;color:#aaa;">Log in consecutively each day to claim exclusive automotive rewards and rare chassis blueprints:</div>' +
          '<div class="rk-reward-grid">' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 1</span><span style="font-size:18px;">💰</span><span class="rk-reward-val">10K CR</span></div>' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 2</span><span style="font-size:18px;">⚡</span><span class="rk-reward-val">NITRO</span></div>' +
          '<div class="rk-reward-card"><span class="rk-reward-day">DAY 3</span><span style="font-size:18px;">💰</span><span class="rk-reward-val">25K CR</span></div>' +
          '<div class="rk-reward-card active"><span class="rk-reward-day" style="color:#ff4767;">DAY 4</span><span style="font-size:18px;">🏆</span><span class="rk-reward-val">50K CR</span></div>' +
          '</div>' +
          '<button class="rk-claim-cta" id="rk-claim-btn" onclick="claimDailyReward(50000)">CLAIM 50,000 CR</button>';
      } else if (type === 'wallet') {
        bodyEl.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<div style="background:rgba(255,255,255,0.04);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);text-align:center;">' +
          '<div style="font-size:11px;color:#888;">RACING CREDITS</div>' +
          '<div style="font-size:18px;font-weight:900;color:#ffcc00;margin:4px 0;"><span id="modal-rk-cr">148,000</span> CR</div>' +
          '<button class="rk-action-pill primary" style="width:100%;margin-top:6px;" onclick="claimBonusCredits(10000, this)">+10K FREE</button>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.04);padding:14px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);text-align:center;">' +
          '<div style="font-size:11px;color:#888;">PREMIUM CASH</div>' +
          '<div style="font-size:18px;font-weight:900;color:#22c55e;margin:4px 0;">$682</div>' +
          '<button class="rk-action-pill" style="width:100%;margin-top:6px;" onclick="refillBooster()">BOOSTER</button>' +
          '</div>' +
          '</div>';
      }
      overlay.classList.add('open');
    }

    function closeGameModal(e) {
      var overlay = document.getElementById('rk-modal-overlay');
      if (overlay) overlay.classList.remove('open');
    }

    function openRewardsModal() {
      openSocialModal('rewards');
    }

    function sendChatMessage() {
      var inp = document.getElementById('rk-chat-inp');
      var feed = document.getElementById('rk-chat-feed');
      if (inp && inp.value.trim() && feed) {
        var div = document.createElement('div');
        div.className = 'rk-chat-msg';
        div.innerHTML = '<span class="rk-chat-sender">PlayerOne:</span>' + inp.value.trim().replace(/</g, '&lt;');
        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
        inp.value = '';
        showToast('Message sent to paddock lobby', '💬');
      }
    }

    function claimBonusCredits(amt, btn) {
      if (btn) {
        btn.textContent = 'CLAIMED';
        btn.disabled = true;
        btn.classList.remove('primary');
      }
      var crEl = document.getElementById('topbar-credits');
      if (crEl) {
        var cur = parseInt(crEl.textContent.replace(/[^0-9]/g, ''), 10) || 148000;
        cur += amt;
        crEl.textContent = cur.toLocaleString();
      }
      showToast('+' + amt.toLocaleString() + ' Credits Added!', '💰');
    }

    function claimDailyReward(amt) {
      var btn = document.getElementById('rk-claim-btn');
      if (btn) {
        btn.textContent = 'REWARD CLAIMED ✓';
        btn.disabled = true;
        btn.style.opacity = '0.5';
      }
      claimBonusCredits(amt);
    }

    function launchCarRace() {
      rlHaptic('cta');
      showToast('Starting 3D Race...', '🏁');
      setTimeout(function() {
        enterRaceSession('race');
      }, 300);
    }

    function enterRaceSession(routeId) {
      var mode = routeId || selectedMode || 'race';
      document.documentElement.classList.add('rl-in-session');
      var app = document.getElementById('rl-app');
      if (app) app.style.display = 'none';

      try {
        var c = CARS[currentCar];
        if (c && typeof CB !== 'undefined' && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: c.id });
        }
      } catch (e) {}

      // Instant 3D launch directly to route with ?quick=1 (no washed-out white screen!)
      window.location.hash = '#/' + mode + '?quick=1';
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
                html += '<div class="roster-thumb ' + (isCur ? 'active' : '') + '" onclick="selectEngineCar(' + i + ', \'' + mId + '\')">' +
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

    // Assign internal implementations to outer delegation pointers
    _navTo = navTo;
    _selectCar = selectCar;
    _selectEngineCar = selectEngineCar;
    _selectMode = selectMode;
    _launchSelectedMode = launchSelectedMode;
    _launchCarRace = launchCarRace;
    _nextCar = nextCar;
    _prevCar = prevCar;
    _setStudioView = setStudioView;
    _confirmSelectCar = confirmSelectCar;
    _setFinish = setFinish;
    _pickColor = pickColor;
    _applyCustomization = applyCustomization;
    _setGraphicsTier = setGraphicsTier;
    _setUnits = setUnits;
    _setMasterVolume = setMasterVolume;
    _toggleThemeMusic = toggleThemeMusic;
    _setSteeringSensitivity = setSteeringSensitivity;
    _setSteerAssist = setSteerAssist;
    _setTouchMode = setTouchMode;
    _setLanguage = setLanguage;
    _resetSaveData = resetSaveData;
    _setUIVersion = setUIVersion;
    _syncProfileData = syncProfileData;
    _openSocialModal = openSocialModal;
    _openRewardsModal = openRewardsModal;
    _showToast = showToast;
    _closeGameModal = closeGameModal;
    _sendChatMessage = sendChatMessage;
    _claimBonusCredits = claimBonusCredits;
    _claimDailyReward = claimDailyReward;
    _inviteFriend = inviteFriend;
    _pokeFriend = pokeFriend;
    _refillBooster = refillBooster;

    
    // Hashchange listener to synchronize UI v2 visibility and direct subscreen routing
    window.addEventListener('hashchange', function() {
      var rawHash = window.location.hash || ''; var h = rawHash.indexOf('#/') === 0 ? rawHash.substring(2) : (rawHash.indexOf('#') === 0 ? rawHash.substring(1) : rawHash);
      var baseRoute = h.split('?')[0];
      var raceModes = ['race', 'drift', 'arcade', 'derby', 'drag', 'f1', 'career', 'multiplayer', 'timetrial'];
      var isRace = raceModes.indexOf(baseRoute) !== -1;
      var app = document.getElementById('rl-app');

      if (isRace) {
        document.documentElement.classList.add('rl-in-session');
        if (app) app.style.display = 'none';
      } else {
        document.documentElement.classList.remove('rl-in-session');
        if (app) app.style.display = 'flex';
        if (baseRoute === 'garage') navTo('garage');
        else if (baseRoute === 'modes') navTo('modes');
        else if (baseRoute === 'customize') navTo('customize');
        else if (baseRoute === 'settings') navTo('settings');
        else if (baseRoute === 'hub' || baseRoute === '' || baseRoute === 'home') navTo('home');
      }
    });

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
