/* ==========================================================================
   Redline UI v2.0 â€” js/ui2/ui2.js
   Mobile-First Presentation & Navigation Layer for Jubayer Racing
   Zero feature removal â€” 100% feature, car data, physics & save parity.
   ========================================================================== */
var CB = (globalThis.CB = globalThis.CB || {});

(function () {
  'use strict';

  var hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';
  if (!hasDOM) return;

  var UI2_HTML = "\n  <div id=\"rl-app\">\n    <!-- Carbon Texture -->\n    <div class=\"rl-carbon-pattern\"></div>\n\n    <!-- 3D Showroom Turntable Simulation Backdrop (Shared between Home, Garage, Customize) -->\n    <div class=\"rl-stage-backdrop\" id=\"rl-stage\">\n      <div class=\"rl-stage-floor\">\n        <div class=\"rl-floor-grid\"></div>\n      </div>\n      <div class=\"rl-floor-spotlight\" id=\"rl-stage-spotlight\"></div>\n      <div class=\"rl-floor-shadow\"></div>\n      \n      <!-- Central Showcase Car (Vector High-Fi Model) -->\n      <div class=\"rl-stage-car-wrap\" id=\"rl-stage-car\">\n        <svg viewBox=\"0 0 600 240\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n          <!-- Car Silhouette: Modern Aggressive Supercar -->\n          <path d=\"M45 158 C65 155 105 155 125 158 C145 130 185 110 245 102 C315 92 375 96 425 118 C465 136 495 152 535 156 C555 158 565 168 555 178 C545 186 525 188 505 188 C485 188 475 165 440 165 C405 165 395 188 205 188 C185 188 175 165 140 165 C105 165 95 188 65 188 C45 188 35 178 45 158 Z\" fill=\"#0f1117\" stroke=\"#252936\" stroke-width=\"2\"/>\n          <!-- Body Main Paint Surface (Metallic Crimson Red with Highlights) -->\n          <path d=\"M55 156 C75 153 115 153 135 156 C155 132 195 112 250 105 C320 96 375 100 422 120 C460 137 490 152 530 155 C545 157 552 165 545 172 C535 175 495 175 480 175 C468 152 432 152 420 175 C370 175 220 175 180 175 C168 152 132 152 120 175 C85 175 55 175 50 168 C45 162 48 158 55 156 Z\" fill=\"url(#paintGrad)\"/>\n          <!-- Cabin Glass / Windshield & Tint -->\n          <path d=\"M190 135 C235 112 305 104 365 106 C400 108 415 122 425 135 C380 137 250 137 190 135 Z\" fill=\"#05070a\" stroke=\"#3b4252\" stroke-width=\"1.5\"/>\n          <!-- Glare Streak on Glass -->\n          <path d=\"M225 130 C270 115 330 110 380 112\" stroke=\"rgba(255,255,255,0.45)\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          <!-- Aerodynamic Side Vent & Carbon Skirt -->\n          <path d=\"M185 162 L275 158 L285 165 L180 168 Z\" fill=\"#12141a\" stroke=\"#2a303c\" stroke-width=\"1\"/>\n          <!-- Rear Wing / Carbon Spoiler -->\n          <path d=\"M60 142 L115 140 L110 146 L55 148 Z\" fill=\"#181a20\" stroke=\"#3d4454\" stroke-width=\"1\"/>\n          <path d=\"M72 148 L70 156\" stroke=\"#2a2e3a\" stroke-width=\"2\"/>\n          <path d=\"M102 146 L100 155\" stroke=\"#2a2e3a\" stroke-width=\"2\"/>\n          <!-- Front Splitter & LED Headlight -->\n          <path d=\"M495 154 L525 155\" stroke=\"#00e5ff\" stroke-width=\"3\" stroke-linecap=\"round\" filter=\"drop-shadow(0 0 6px #00e5ff)\"/>\n          <!-- Rear Taillight Strip (Signature Redline) -->\n          <path d=\"M52 158 L72 159\" stroke=\"#e0412f\" stroke-width=\"3\" stroke-linecap=\"round\" filter=\"drop-shadow(0 0 8px #e0412f)\"/>\n          <!-- Front Wheel & Performance Caliper -->\n          <circle cx=\"445\" cy=\"175\" r=\"28\" fill=\"#0b0c0e\" stroke=\"#1f232d\" stroke-width=\"3\"/>\n          <circle cx=\"445\" cy=\"175\" r=\"21\" fill=\"#141720\" stroke=\"#3a4150\" stroke-width=\"1.5\"/>\n          <path d=\"M435 164 A14 14 0 0 1 455 164\" stroke=\"#e0412f\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n          <circle cx=\"445\" cy=\"175\" r=\"6\" fill=\"#fff\"/>\n          <!-- Rear Wheel & Performance Caliper -->\n          <circle cx=\"145\" cy=\"175\" r=\"28\" fill=\"#0b0c0e\" stroke=\"#1f232d\" stroke-width=\"3\"/>\n          <circle cx=\"145\" cy=\"175\" r=\"21\" fill=\"#141720\" stroke=\"#3a4150\" stroke-width=\"1.5\"/>\n          <path d=\"M135 164 A14 14 0 0 1 155 164\" stroke=\"#e0412f\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n          <circle cx=\"145\" cy=\"175\" r=\"6\" fill=\"#fff\"/>\n          <!-- Definitions -->\n          <defs>\n            <linearGradient id=\"paintGrad\" x1=\"50\" y1=\"100\" x2=\"550\" y2=\"180\" gradientUnits=\"userSpaceOnUse\">\n              <stop offset=\"0%\" stop-color=\"#8f180d\"/>\n              <stop offset=\"35%\" stop-color=\"#e0412f\"/>\n              <stop offset=\"65%\" stop-color=\"#ff523d\"/>\n              <stop offset=\"100%\" stop-color=\"#a82315\"/>\n            </linearGradient>\n          </defs>\n        </svg>\n      </div>\n\n      <!-- Reflective Mirror on Floor -->\n      <div class=\"rl-car-reflection\">\n        <svg viewBox=\"0 0 600 240\" fill=\"none\">\n          <use href=\"#rl-stage-car svg path\" />\n        </svg>\n      </div>\n\n      <!-- Turntable Left / Right Chevrons (Garage view) -->\n      <button class=\"rl-stage-arrow left\" id=\"rl-arrow-prev\" onclick=\"rlCycleCar(-1)\" style=\"display:none;\" title=\"Previous Car\">\n        <svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><path d=\"M15 18l-6-6 6-6\"/></svg>\n      </button>\n      <button class=\"rl-stage-arrow right\" id=\"rl-arrow-next\" onclick=\"rlCycleCar(1)\" style=\"display:none;\" title=\"Next Car\">\n        <svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><path d=\"M9 18l6-6-6-6\"/></svg>\n      </button>\n    </div>\n\n    <!-- Universal Header Bar (Active across all screens) -->\n    <header class=\"rl-header-bar\" id=\"rl-header\">\n      <div class=\"rl-brand-group\">\n        <button class=\"rl-back-btn\" id=\"rl-btn-back\" title=\"Back\" style=\"display:none;\" onclick=\"rlNav('home')\">\n          <svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" stroke=\"currentColor\" stroke-width=\"2.4\" fill=\"none\"><path d=\"M15 19l-7-7 7-7\"/></svg>\n        </button>\n        <div class=\"rl-brand-title\">\n          <div class=\"rl-brand-name\">RED<span>LINE</span></div>\n          <div class=\"rl-brand-inst\" data-i18n=\"inst_title\">AS-SUNNAH INSTITUTE</div>\n        </div>\n      </div>\n\n      <div class=\"rl-header-chips\">\n        <!-- Level Chip -->\n        <div class=\"rl-chip lvl\">\n          <span class=\"rl-lvl-badge\">LVL 18</span>\n          <span style=\"font-size:11px;color:#94a3b8\">XP 4,820</span>\n        </div>\n        <!-- Credits Chip -->\n        <div class=\"rl-chip cr\">\n          <div class=\"rl-chip-icon\">\n            <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"12\" y=\"16\" font-size=\"12\" font-weight=\"800\" text-anchor=\"middle\" fill=\"currentColor\">$</text></svg>\n          </div>\n          <span id=\"rl-val-cr\">425,800 CR</span>\n        </div>\n        <!-- Gold Tokens Chip -->\n        <div class=\"rl-chip gold\">\n          <div class=\"rl-chip-icon\">\n            <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>\n          </div>\n          <span>1,250</span>\n        </div>\n        <!-- Language Switcher Button (>= 48px) -->\n        <button class=\"rl-quick-btn\" id=\"rl-lang-btn\" onclick=\"rlToggleLang()\" title=\"Switch Language\">\n          BN\n        </button>\n        <!-- Audio Mute Button (>= 48px) -->\n        <button class=\"rl-quick-btn\" id=\"rl-audio-btn\" onclick=\"rlToggleAudio()\" title=\"Toggle Sound\">\n          <svg id=\"rl-audio-icon\" viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"><polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"/></svg>\n        </button>\n        <!-- Reduced Motion Toggle (>= 48px) -->\n        <button class=\"rl-quick-btn\" id=\"rl-motion-btn\" onclick=\"rlToggleMotion()\" title=\"Reduced Motion\">\n          ⚡\n        </button>\n      </div>\n    </header>\n\n    <!-- Left Ergonomic Navigation Rail (>= 48px touch targets) -->\n    <nav class=\"rl-nav-rail\" id=\"rl-nav-rail\">\n      <button class=\"rl-nav-item is-active\" id=\"rail-home\" onclick=\"rlNav('home')\" title=\"Home\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/></svg>\n        <span data-i18n=\"nav_home\">Home</span>\n      </button>\n      <button class=\"rl-nav-item\" id=\"rail-modes\" onclick=\"rlNav('modes')\" title=\"Game Modes\">\n        <svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/><line x1=\"6\" y1=\"12\" x2=\"10\" y2=\"12\"/><line x1=\"8\" y1=\"10\" x2=\"8\" y2=\"14\"/><circle cx=\"16\" cy=\"10\" r=\"1\"/><circle cx=\"18\" cy=\"13\" r=\"1\"/></svg>\n        <span data-i18n=\"nav_modes\">Modes</span>\n      </button>\n      <button class=\"rl-nav-item\" id=\"rail-garage\" onclick=\"rlNav('garage')\" title=\"Garage\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M3 21V9l9-5 9 5v12\"/><path d=\"M7 21v-7h10v7\"/></svg>\n        <span data-i18n=\"nav_garage\">Garage</span>\n      </button>\n      <button class=\"rl-nav-item\" id=\"rail-customize\" onclick=\"rlNav('customize')\" title=\"Customize\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z\"/></svg>\n        <span data-i18n=\"nav_custom\">Custom</span>\n      </button>\n      <button class=\"rl-nav-item\" id=\"rail-race\" onclick=\"rlNav('hud')\" title=\"Race HUD\">\n        <svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg>\n        <span data-i18n=\"nav_race\">Race HUD</span>\n      </button>\n    </nav>\n\n    <!-- ======================================================================\n         SCREEN 1: HOME\n         ====================================================================== -->\n    <section class=\"rl-screen is-active\" id=\"screen-home\">\n      <div class=\"rl-screen-body\">\n        <!-- Hero Car Identity Card -->\n        <div class=\"rl-home-hero\">\n          <div class=\"rl-hero-tag\">\n            <svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>\n            <span data-i18n=\"hero_class\">S-CLASS · TIER 4</span>\n          </div>\n          <div class=\"rl-hero-name\" id=\"rl-home-car-name\">PORSCHE 911 GT3</div>\n          <div class=\"rl-hero-stats-mini\">\n            <span><b id=\"rl-home-hp\">502</b> HP</span>\n            <span>·</span>\n            <span><b id=\"rl-home-speed\">318</b> KM/H</span>\n            <span>·</span>\n            <span><b id=\"rl-home-accel\">3.2</b>s (0-100)</span>\n          </div>\n        </div>\n\n        <!-- Big Skewed PLAY Button Bottom-Right -->\n        <div class=\"rl-home-cta-wrap\">\n          <button class=\"rl-btn-cta\" onclick=\"rlNav('modes')\" id=\"rl-btn-play\">\n            <span class=\"rl-pulse-ring\"></span>\n            <span data-i18n=\"btn_play\">PLAY</span>\n            <svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" stroke=\"currentColor\" stroke-width=\"2.4\" fill=\"none\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n          </button>\n        </div>\n      </div>\n    </section>\n\n    <!-- ======================================================================\n         SCREEN 2: GAME MODES (SWIPEABLE HORIZONTAL CAROUSEL - ALL 10 MODES)\n         ====================================================================== -->\n    <section class=\"rl-screen\" id=\"screen-modes\">\n      <div class=\"rl-screen-body\">\n        <div class=\"rl-modes-wrap\">\n          <div class=\"rl-section-header\">\n            <div class=\"rl-section-title\" data-i18n=\"modes_title\">SELECT GAME MODE</div>\n            <div class=\"rl-section-subtitle\" data-i18n=\"modes_subtitle\">Swipe to explore 10 competitive racing disciplines</div>\n          </div>\n\n          <div class=\"rl-carousel-track\" id=\"rl-modes-carousel\">\n            <!-- Mode 1: Quick Race -->\n            <div class=\"rl-mode-card is-focused\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_race.webp'), linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" data-i18n=\"badge_circuit\">CIRCUIT</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_race\">QUICK RACE</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_race_desc\">8-car sprint on Dhaka Grand Prix circuit.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 18/24 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 2: Drift Challenge -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_drift.webp'), linear-gradient(135deg, #701a75 0%, #18021e 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#a855f7\" data-i18n=\"badge_drift\">TANDEM</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_drift\">DRIFT ATTACK</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_drift_desc\">High-angle mountain slides & multiplier combos.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 12/15 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#a855f7\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 3: Arcade Stunts -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_arcade.webp'), linear-gradient(135deg, #065f46 0%, #022c22 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#10b981\" data-i18n=\"badge_arcade\">ACTION</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_arcade\">ARCADE STUNTS</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_arcade_desc\">Mega ramps, barrel rolls and nitro boost pads.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 9/12 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#10b981\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 4: Demolition Derby -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_derby.webp'), linear-gradient(135deg, #991b1b 0%, #450a0a 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#ef4444\" data-i18n=\"badge_derby\">ARENA</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_derby\">DEMO DERBY</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_derby_desc\">High-impact metal crumple. Last car standing wins.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 15/18 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#ef4444\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 5: Drag Strip -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_drag.webp'), linear-gradient(135deg, #b45309 0%, #451a03 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#f59e0b\" data-i18n=\"badge_drag\">1/4 MILE</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_drag\">DRAG STRIP</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_drag_desc\">Christmas tree light launch & manual shift timings.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 6/9 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#f59e0b\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 6: Formula 1 -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_f1.webp'), linear-gradient(135deg, #0f172a 0%, #0369a1 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#38bdf8\" data-i18n=\"badge_f1\">GRAND PRIX</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_f1\">FORMULA 1</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_f1_desc\">Open-wheel apex speeds, tire wear & DRS zones.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 8/10 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#38bdf8\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 7: Time Trial -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_timetrial.webp'), linear-gradient(135deg, #1f2937 0%, #374151 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#9ca3af\" data-i18n=\"badge_timetrial\">SOLO</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_timetrial\">TIME TRIAL</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_timetrial_desc\">Chase personal bests against translucent ghost telemetry.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 20/25 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#9ca3af\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 8: Driving School / Challenges -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_challenges.webp'), linear-gradient(135deg, #3b0764 0%, #581c87 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#c084fc\" data-i18n=\"badge_challenges\">ACADEMY</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_challenges\">CHALLENGES</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_challenges_desc\">Master slalom maneuvers, threshold braking & hairpin apexes.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 14/16 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#c084fc\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 9: Online Multiplayer -->\n            <div class=\"rl-mode-card\" onclick=\"rlOpenDialog('Multiplayer Lobby', 'Connect to private P2P racing rooms or search for open competitive lobbies across Asia/Global servers.')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_online.webp'), linear-gradient(135deg, #082f49 0%, #0369a1 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#00e5ff;color:#000\" data-i18n=\"badge_online\">ONLINE</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_online\">MULTIPLAYER</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_online_desc\">Live competitive lobbies with room codes & real-time sync.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 8 SLOTS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#00e5ff;color:#000\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Mode 10: Career Championship -->\n            <div class=\"rl-mode-card\" onclick=\"rlSelectModeCard(this, 'hud')\">\n              <div class=\"rl-mode-bg\" style=\"background-image: url('assets/cards/mode_career.webp'), linear-gradient(135deg, #1e293b 0%, #090d16 100%);\"></div>\n              <div class=\"rl-mode-gradient\"></div>\n              <div class=\"rl-mode-content\">\n                <span class=\"rl-mode-badge\" style=\"background:#c9a56b\" data-i18n=\"badge_career\">SEASON 3</span>\n                <div class=\"rl-mode-title\" data-i18n=\"mode_career\">PRO CAREER</div>\n                <div class=\"rl-mode-desc\" data-i18n=\"mode_career_desc\">Climb from Rookie Cup to the Redline World Masters.</div>\n                <div class=\"rl-mode-meta\">\n                  <span class=\"rl-mode-stars\">★ 42/60 STARS</span>\n                  <button class=\"rl-mode-btn-sm\" style=\"background:#c9a56b\" data-i18n=\"btn_enter\">ENTER</button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- ======================================================================\n         SCREEN 3: GARAGE & 53 CAR SELECTOR\n         ====================================================================== -->\n    <section class=\"rl-screen\" id=\"screen-garage\">\n      <div class=\"rl-screen-body\">\n        <div class=\"rl-garage-body\">\n          <!-- Left Floating Stat Card -->\n          <div class=\"rl-stat-panel\">\n            <div class=\"rl-stat-header\">\n              <span class=\"rl-stat-car-title\" id=\"rl-garage-car-name\">PORSCHE 911 GT3</span>\n              <span class=\"rl-car-tier-badge\" id=\"rl-garage-car-tier\">1 / 53 · TIER 4</span>\n            </div>\n\n            <!-- Power Stat -->\n            <div class=\"rl-stat-row\">\n              <div class=\"rl-stat-label-wrap\">\n                <span data-i18n=\"stat_power\">POWER</span>\n                <span class=\"rl-stat-val\" id=\"rl-val-power\">502 HP</span>\n              </div>\n              <div class=\"rl-stat-bar-bg\">\n                <div class=\"rl-stat-bar-fill\" id=\"rl-bar-power\" style=\"width: 75%;\"></div>\n              </div>\n            </div>\n\n            <!-- Top Speed Stat -->\n            <div class=\"rl-stat-row\">\n              <div class=\"rl-stat-label-wrap\">\n                <span data-i18n=\"stat_speed\">TOP SPEED</span>\n                <span class=\"rl-stat-val\" id=\"rl-val-speed\">318 KM/H</span>\n              </div>\n              <div class=\"rl-stat-bar-bg\">\n                <div class=\"rl-stat-bar-fill\" id=\"rl-bar-speed\" style=\"width: 82%;\"></div>\n              </div>\n            </div>\n\n            <!-- 0-100 Sprint Stat -->\n            <div class=\"rl-stat-row\">\n              <div class=\"rl-stat-label-wrap\">\n                <span data-i18n=\"stat_accel\">0-100 KM/H</span>\n                <span class=\"rl-stat-val\" id=\"rl-val-accel\">3.2 SEC</span>\n              </div>\n              <div class=\"rl-stat-bar-bg\">\n                <div class=\"rl-stat-bar-fill\" id=\"rl-bar-accel\" style=\"width: 86%;\"></div>\n              </div>\n            </div>\n\n            <!-- Cornering Grip Stat -->\n            <div class=\"rl-stat-row\">\n              <div class=\"rl-stat-label-wrap\">\n                <span data-i18n=\"stat_grip\">GRIP</span>\n                <span class=\"rl-stat-val\" id=\"rl-val-grip\">1.28 G</span>\n              </div>\n              <div class=\"rl-stat-bar-bg\">\n                <div class=\"rl-stat-bar-fill\" id=\"rl-bar-grip\" style=\"width: 84%;\"></div>\n              </div>\n            </div>\n\n            <!-- Curb Weight Stat -->\n            <div class=\"rl-stat-row\">\n              <div class=\"rl-stat-label-wrap\">\n                <span data-i18n=\"stat_weight\">WEIGHT</span>\n                <span class=\"rl-stat-val\" id=\"rl-val-weight\">1,435 KG</span>\n              </div>\n              <div class=\"rl-stat-bar-bg\">\n                <div class=\"rl-stat-bar-fill\" id=\"rl-bar-weight\" style=\"width: 65%;\"></div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Center Stage Bottom Thumbnail Strip -->\n          <div class=\"rl-garage-center\">\n            <div class=\"rl-thumb-carousel\" id=\"rl-car-strip\">\n              <!-- Dynamically populated from CAR_ROSTER -->\n            </div>\n          </div>\n\n          <!-- Right Category Jump Buttons (Strictly >= 48px) -->\n          <div class=\"rl-category-tabs\">\n            <button class=\"rl-cat-tab-btn\" onclick=\"rlNav('customize')\">\n              <svg viewBox=\"0 0 24 24\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\"/></svg>\n              <span data-i18n=\"cat_upgrade\">UPGRADE</span>\n            </button>\n            <button class=\"rl-cat-tab-btn\" onclick=\"rlNav('customize')\">\n              <svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>\n              <span data-i18n=\"cat_tune\">TUNE</span>\n            </button>\n            <button class=\"rl-cat-tab-btn\" onclick=\"rlNav('customize')\">\n              <svg viewBox=\"0 0 24 24\"><circle cx=\"13.5\" cy=\"6.5\" r=\".5\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\"/><path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\"/></svg>\n              <span data-i18n=\"cat_paint\">PAINT</span>\n            </button>\n            <button class=\"rl-cat-tab-btn primary-race\" onclick=\"rlNav('hud')\">\n              <svg viewBox=\"0 0 24 24\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n              <span data-i18n=\"btn_race_now\">RACE</span>\n            </button>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- ======================================================================\n         SCREEN 4: CUSTOMIZATION & INTERACTIVE HOTSPOTS\n         ====================================================================== -->\n    <section class=\"rl-screen\" id=\"screen-customize\">\n      <div class=\"rl-screen-body\">\n        <div class=\"rl-customize-body\">\n          <!-- 3D Leader Line Hotspot Pins (>= 48px touch targets) -->\n          <div class=\"rl-hotspot-container\">\n            <!-- Hotspot: Front Wheels -->\n            <div class=\"rl-hotspot-pin rl-pin-wheels is-active\" onclick=\"rlSetHotspot('wheels')\">\n              <div class=\"rl-pin-circle\"></div>\n              <div class=\"rl-pin-label\" data-i18n=\"pin_wheels\">WHEELS & TIRES</div>\n            </div>\n\n            <!-- Hotspot: Aero & Spoiler -->\n            <div class=\"rl-hotspot-pin rl-pin-aero\" onclick=\"rlSetHotspot('aero')\">\n              <div class=\"rl-pin-circle\"></div>\n              <div class=\"rl-pin-label\" data-i18n=\"pin_aero\">AERO WING</div>\n            </div>\n\n            <!-- Hotspot: Engine / Turbo -->\n            <div class=\"rl-hotspot-pin rl-pin-engine\" onclick=\"rlSetHotspot('engine')\">\n              <div class=\"rl-pin-circle\"></div>\n              <div class=\"rl-pin-label\" data-i18n=\"pin_engine\">TWIN TURBO</div>\n            </div>\n\n            <!-- Hotspot: Body Paint -->\n            <div class=\"rl-hotspot-pin rl-pin-paint\" onclick=\"rlSetHotspot('paint')\">\n              <div class=\"rl-pin-circle\"></div>\n              <div class=\"rl-pin-label\" data-i18n=\"pin_paint\">PAINT FINISH</div>\n            </div>\n          </div>\n\n          <!-- Bottom Parts Drawer -->\n          <div class=\"rl-parts-drawer\">\n            <div class=\"rl-drawer-top\">\n              <div class=\"rl-drawer-title\">\n                <span data-i18n=\"custom_category_title\" id=\"rl-custom-title\">WHEELS & BRAKES</span>\n                <small style=\"color:var(--rl-text-secondary);font-size:11px;font-weight:600\">STAGE 3 PERFORMANCE</small>\n              </div>\n              <div class=\"rl-part-deltas\">\n                <span class=\"rl-delta-pos\" id=\"rl-delta-hp\">+45 HP</span>\n                <span class=\"rl-delta-pos\" id=\"rl-delta-wt\">-12 KG</span>\n                <span class=\"rl-delta-pos\" id=\"rl-delta-g\">+0.08 G</span>\n              </div>\n            </div>\n\n            <!-- Part Selection Carousel -->\n            <div class=\"rl-parts-grid\">\n              <!-- Tile 1: Stock Wheels -->\n              <div class=\"rl-part-tile is-equipped\" onclick=\"rlSelectPart(this, 0, 0, 0, 0)\">\n                <div class=\"rl-part-tier-bar rare\"></div>\n                <div class=\"rl-part-name\">FORGED R18</div>\n                <div class=\"rl-part-footer\">\n                  <span style=\"color:#34d399;font-weight:700\">EQUIPPED</span>\n                  <span style=\"color:var(--rl-text-muted)\">STOCK</span>\n                </div>\n              </div>\n\n              <!-- Tile 2: Carbon Fiber Wheels -->\n              <div class=\"rl-part-tile is-active\" onclick=\"rlSelectPart(this, 18500, 45, -12, 0.08)\">\n                <div class=\"rl-part-tier-bar epic\"></div>\n                <div class=\"rl-part-name\">CARBON R20</div>\n                <div class=\"rl-part-footer\">\n                  <span class=\"rl-part-price\">$18,500</span>\n                  <span style=\"color:var(--rl-tier-epic);font-weight:800\">EPIC</span>\n                </div>\n              </div>\n\n              <!-- Tile 3: Magnesium Ultralight -->\n              <div class=\"rl-part-tile\" onclick=\"rlSelectPart(this, 32000, 60, -20, 0.12)\">\n                <div class=\"rl-part-tier-bar legendary\"></div>\n                <div class=\"rl-part-name\">MAGNESIUM GT</div>\n                <div class=\"rl-part-footer\">\n                  <span class=\"rl-part-price\">$32,000</span>\n                  <span style=\"color:var(--rl-tier-legendary);font-weight:800\">LEGEND</span>\n                </div>\n              </div>\n\n              <!-- Tile 4: Aero Dish Spec -->\n              <div class=\"rl-part-tile\" onclick=\"rlSelectPart(this, 24000, 30, -8, 0.06)\">\n                <div class=\"rl-part-tier-bar epic\"></div>\n                <div class=\"rl-part-name\">AERO TURBINE</div>\n                <div class=\"rl-part-footer\">\n                  <span class=\"rl-part-price\">$24,000</span>\n                  <span style=\"color:var(--rl-tier-epic);font-weight:800\">EPIC</span>\n                </div>\n              </div>\n            </div>\n\n            <!-- Drawer Bottom Controls -->\n            <div class=\"rl-drawer-footer\">\n              <div class=\"rl-total-price-chip\">\n                <span data-i18n=\"lbl_total\">TOTAL PRICE:</span>\n                <b id=\"rl-custom-price\">$18,500 CR</b>\n              </div>\n              <button class=\"rl-btn-apply\" onclick=\"rlApplyCustomization()\" data-i18n=\"btn_apply\">\n                BUY & INSTALL\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- ======================================================================\n         SCREEN 5: IN-RACE HUD & TELEMETRY\n         ====================================================================== -->\n    <div class=\"rl-hud-screen\" id=\"screen-hud\">\n      <!-- 3D Circuit Perspective Simulation Backdrop -->\n      <div class=\"rl-hud-track-bg\">\n        <svg viewBox=\"0 0 1000 500\" style=\"width:100%;height:100%\">\n          <!-- Road Perspective -->\n          <polygon points=\"500,200 480,200 120,500 880,500\" fill=\"#171922\"/>\n          <!-- Curb Markers (Red & White) -->\n          <polygon points=\"480,200 470,200 80,500 120,500\" fill=\"#e0412f\"/>\n          <polygon points=\"500,200 510,200 920,500 880,500\" fill=\"#ecebe6\"/>\n          <!-- Center Road Dash -->\n          <line x1=\"490\" y1=\"200\" x2=\"490\" y2=\"500\" stroke=\"#facc15\" stroke-dasharray=\"20 20\" stroke-width=\"4\"/>\n          <!-- Distant Horizon Glow -->\n          <ellipse cx=\"490\" cy=\"200\" rx=\"350\" ry=\"25\" fill=\"rgba(224,65,47,0.18)\" filter=\"blur(15px)\"/>\n        </svg>\n      </div>\n\n      <!-- Topbar Telemetry & Mini-Map (Corner buttons >= 48px) -->\n      <div class=\"rl-hud-topbar\">\n        <!-- Top-Left: Pause & Camera Toggle -->\n        <div style=\"display:flex;gap:8px;align-items:center\">\n          <button class=\"rl-quick-btn\" onclick=\"rlNav('home')\" title=\"Pause Race\">\n            <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg>\n          </button>\n          <button class=\"rl-quick-btn\" onclick=\"rlToggleCamera()\" title=\"Switch Camera\">\n            CAM\n          </button>\n          <!-- Lap Counter & Time -->\n          <div class=\"rl-hud-timer-card\">\n            <div class=\"rl-hud-lap\">LAP <b>2/3</b> · POS <b>1/8</b></div>\n            <div class=\"rl-hud-time\">01:14.280</div>\n            <div class=\"rl-hud-split\">-0.34s BEST SPLIT</div>\n          </div>\n        </div>\n\n        <!-- Center Tachometer & Speed Digits -->\n        <div class=\"rl-hud-center-cluster\">\n          <div class=\"rl-tach-arc\">\n            <div class=\"rl-tach-led green is-lit\"></div>\n            <div class=\"rl-tach-led green is-lit\"></div>\n            <div class=\"rl-tach-led green is-lit\"></div>\n            <div class=\"rl-tach-led yellow is-lit\"></div>\n            <div class=\"rl-tach-led yellow is-lit\"></div>\n            <div class=\"rl-tach-led red is-lit\"></div>\n            <div class=\"rl-tach-led red is-lit\"></div>\n            <div class=\"rl-tach-led blue is-lit\"></div>\n          </div>\n          <div class=\"rl-speed-digits\" id=\"rl-hud-speed\">214</div>\n          <div class=\"rl-speed-unit\">KM / H</div>\n          <div class=\"rl-gear-indicator\">4</div>\n        </div>\n\n        <!-- Top-Right: Mini-Map & Audio Mute -->\n        <div style=\"display:flex;gap:10px;align-items:flex-start\">\n          <div class=\"rl-hud-minimap\">\n            <svg viewBox=\"0 0 100 100\">\n              <path d=\"M25,20 C45,15 80,25 75,55 C70,75 55,85 35,75 C15,65 15,25 25,20 Z\" fill=\"none\" stroke=\"rgba(255,255,255,0.4)\" stroke-width=\"4\"/>\n              <circle cx=\"75\" cy=\"55\" r=\"4\" fill=\"#e0412f\"/>\n              <circle cx=\"55\" cy=\"80\" r=\"3\" fill=\"#38bdf8\"/>\n            </svg>\n          </div>\n          <button class=\"rl-quick-btn\" onclick=\"rlToggleAudio()\" title=\"Sound\">\n            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"><polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"/></svg>\n          </button>\n        </div>\n      </div>\n\n      <!-- Bottom Ergonomic Touch Controls -->\n      <div class=\"rl-hud-controls\">\n        <!-- Left Virtual Steering Controller -->\n        <div class=\"rl-steer-control\" id=\"rl-steer-touch\">\n          <div class=\"rl-steer-rim\"></div>\n          <div class=\"rl-steer-spoke\"></div>\n          <div class=\"rl-steer-center-badge\">\n            <div style=\"width:8px;height:8px;border-radius:50%;background:var(--rl-accent-red)\"></div>\n          </div>\n        </div>\n\n        <!-- Right Stacked Vertical Pedals (>= 48px) -->\n        <div class=\"rl-pedals-stack\">\n          <!-- Brake Pedal -->\n          <button class=\"rl-pedal-btn brake\" id=\"rl-btn-brake\" data-i18n=\"pedal_brake\">\n            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v8\"/></svg>\n            <span>BRAKE</span>\n          </button>\n          <!-- Accelerator / Gas Pedal -->\n          <button class=\"rl-pedal-btn gas\" id=\"rl-btn-gas\" data-i18n=\"pedal_gas\">\n            <svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" stroke=\"currentColor\" stroke-width=\"2.2\" fill=\"none\"><polyline points=\"18 15 12 9 6 15\"/></svg>\n            <span>GAS</span>\n          </button>\n        </div>\n      </div>\n    </div>\n\n    <!-- ======================================================================\n         SCREEN 6: PORTRAIT ORIENTATION LOCK OVERLAY\n         ====================================================================== -->\n    <div class=\"rl-portrait-overlay auto-detect\" id=\"rl-portrait-overlay\">\n      <svg class=\"rl-rotate-phone-anim\" viewBox=\"0 0 64 64\" fill=\"none\">\n        <rect x=\"18\" y=\"8\" width=\"28\" height=\"48\" rx=\"6\" stroke=\"#e0412f\" stroke-width=\"3\"/>\n        <line x1=\"28\" y1=\"48\" x2=\"36\" y2=\"48\" stroke=\"#e0412f\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n        <path d=\"M48 20 A20 20 0 0 1 52 36 L58 32\" stroke=\"#fff\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n      <div class=\"rl-portrait-title\" data-i18n=\"rotate_title\">ROTATE YOUR DEVICE</div>\n      <div class=\"rl-portrait-desc\" data-i18n=\"rotate_desc\">Landscape mode is required for high-performance precision driving and full cockpit telemetry.</div>\n      <button class=\"rl-portrait-override-btn\" onclick=\"rlDismissPortrait()\" data-i18n=\"rotate_dismiss\">Continue anyway (Preview)</button>\n    </div>\n\n    <!-- Universal Toast Notification Pill -->\n    <div class=\"rl-toast\" id=\"rl-toast\">\n      <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"var(--rl-accent-gold)\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>\n      <span id=\"rl-toast-msg\">Achievement Unlocked: Apex Predator (+5,000 CR)</span>\n    </div>\n\n    <!-- Universal Confirmation / Info Dialog -->\n    <div class=\"rl-dialog-backdrop\" id=\"rl-dialog\">\n      <div class=\"rl-dialog-card\">\n        <div class=\"rl-dialog-title\" id=\"rl-dialog-title\">CONFIRM PURCHASE</div>\n        <div class=\"rl-dialog-desc\" id=\"rl-dialog-desc\">Are you sure you want to purchase and install Carbon R20 wheels for $18,500 CR?</div>\n        <div class=\"rl-dialog-actions\">\n          <button class=\"rl-dialog-btn cancel\" onclick=\"rlCloseDialog()\">Cancel</button>\n          <button class=\"rl-dialog-btn confirm\" id=\"rl-dialog-confirm\" onclick=\"rlConfirmDialog()\">Confirm</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Interactive Mockup Logic -->\n  ";

  var ui2 = {
    version: '2.0.0',
    active: false,
    currentScreen: 'home',
    init: init
  };

  CB.ui2 = ui2;

  function shouldActivate() {
    var p = new URLSearchParams(window.location.search);
    var u = p.get('ui');
    if (u === '1') return false;
    if (u === '2') return true;
    var saved = null;
    try { saved = localStorage.getItem('redline_ui_version'); } catch (e) {}
    if (saved === '1') return false;
    // Default to UI v2
    return true;
  }

  function init() {
    if (ui2.active) return;
    if (!shouldActivate()) {
      console.log('[Redline UI] Running UI v1 (Classic mode)');
      return;
    }

    ui2.active = true;
    document.documentElement.classList.add('rl-v2');

    // Mount UI2 App Container if not already mounted
    var appContainer = document.getElementById('rl-app');
    if (!appContainer) {
      var wrap = document.createElement('div');
      wrap.innerHTML = UI2_HTML.trim();
      appContainer = wrap.firstElementChild;
      document.body.appendChild(appContainer);
    }

    console.log('[Redline UI] v2.0 Mobile-First layer mounted successfully');

    // Execute UI2 interactive runtime
    try {
      runUI2Runtime();
    } catch (err) {
      console.error('[Redline UI] Runtime init error:', err);
    }
  }

  function runUI2Runtime() {

    /* ==========================================================================
       CAR ROSTER (12 Real Models from 53 Shapes Library)
       ========================================================================== */
    var CAR_ROSTER = [
      { id: 'porsche-911-992', make: 'Porsche', name: '911 GT3', tier: 'TIER 4', hp: 502, speed: 318, accel: 3.2, grip: 1.28, weight: 1435, color: '#c8102e' },
      { id: 'bmw-m4-g82', make: 'BMW', name: 'M4 Competition', tier: 'TIER 3', hp: 503, speed: 290, accel: 3.8, grip: 1.20, weight: 1725, color: '#0066b1' },
      { id: 'toyota-gr-supra-a90', make: 'Toyota', name: 'GR Supra RZ', tier: 'TIER 3', hp: 382, speed: 250, accel: 3.9, grip: 1.18, weight: 1520, color: '#ea580c' },
      { id: 'ferrari-sf90-stradale', make: 'Ferrari', name: 'SF90 Stradale', tier: 'TIER 4', hp: 986, speed: 340, accel: 2.5, grip: 1.34, weight: 1570, color: '#d40000' },
      { id: 'mclaren-p1', make: 'McLaren', name: 'P1 Hypercar', tier: 'TIER 4', hp: 903, speed: 350, accel: 2.8, grip: 1.32, weight: 1395, color: '#ff6f00' },
      { id: 'bugatti-chiron', make: 'Bugatti', name: 'Chiron Pur Sport', tier: 'TIER 4', hp: 1479, speed: 380, accel: 2.3, grip: 1.35, weight: 1980, color: '#0f2b5c' },
      { id: 'nissan-skyline-gtr-r34', make: 'Nissan', name: 'Skyline GT-R R34', tier: 'TIER 3', hp: 327, speed: 250, accel: 4.8, grip: 1.15, weight: 1560, color: '#1a4480' },
      { id: 'nissan-silvia-s15', make: 'Nissan', name: 'Silvia Spec-R S15', tier: 'TIER 2', hp: 247, speed: 235, accel: 5.5, grip: 1.08, weight: 1240, color: '#f5c518' },
      { id: 'mazda-rx7-fd3s', make: 'Mazda', name: 'RX-7 Spirit R', tier: 'TIER 2', hp: 276, speed: 250, accel: 5.1, grip: 1.12, weight: 1280, color: '#c41212' },
      { id: 'chevrolet-corvette-c8', make: 'Chevrolet', name: 'Corvette Stingray C8', tier: 'TIER 3', hp: 495, speed: 312, accel: 2.9, grip: 1.25, weight: 1530, color: '#d62226' },
      { id: 'koenigsegg-jesko', make: 'Koenigsegg', name: 'Jesko Attack', tier: 'TIER 4', hp: 1600, speed: 400, accel: 2.4, grip: 1.40, weight: 1420, color: '#0a72cc' },
      { id: 'lamborghini-huracan-evo', make: 'Lamborghini', name: 'Huracán EVO', tier: 'TIER 4', hp: 631, speed: 325, accel: 2.9, grip: 1.30, weight: 1422, color: '#39b54a' }
    ];

    var currentCarIdx = 0;

    /* ==========================================================================
       HARDWARE HAPTICS (Vibration API)
       ========================================================================== */
    function rlHaptic(type) {
      if (!('vibrate' in navigator)) return;
      try {
        if (type === 'tap') navigator.vibrate(15);
        else if (type === 'nav') navigator.vibrate(20);
        else if (type === 'select') navigator.vibrate(30);
        else if (type === 'cta') navigator.vibrate([25, 40, 25]);
      } catch (e) {}
    }

    /* ==========================================================================
       SUBTLE SYNTHESIZED WEB AUDIO & MUTE
       ========================================================================== */
    var audioCtx = null;
    var isMuted = false;

    function getAudioCtx() {
      if (!audioCtx && typeof window.AudioContext !== 'undefined') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioCtx;
    }

    function rlPlaySound(type) {
      if (isMuted) return;
      var ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      var now = ctx.currentTime;
      if (type === 'tap') {
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'nav') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.045);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.045);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'select') {
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.setValueAtTime(1200, now + 0.02);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    }

    function rlToggleAudio() {
      isMuted = !isMuted;
      rlHaptic('tap');
      var icon = document.getElementById('rl-audio-icon');
      if (icon) {
        if (isMuted) {
          icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
          rlShowToast('Audio Muted', 'warn');
        } else {
          icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
          rlPlaySound('select');
          rlShowToast('Audio Enabled', 'good');
        }
      }
    }

    /* ==========================================================================
       REDUCED MOTION TOGGLE
       ========================================================================== */
    var isReducedMotion = false;
    function rlToggleMotion() {
      isReducedMotion = !isReducedMotion;
      document.body.classList.toggle('reduced-motion', isReducedMotion);
      var btn = document.getElementById('rl-motion-btn');
      if (btn) btn.textContent = isReducedMotion ? '🛑' : '⚡';
      rlHaptic('tap');
      rlShowToast(isReducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF', 'info');
    }

    /* ==========================================================================
       I18N BILINGUAL TRANSLATION DICTIONARY (ENGLISH & BANGLA)
       ========================================================================== */
    var currentLang = 'en';
    var I18N = {
      en: {
        inst_title: 'AS-SUNNAH INSTITUTE',
        nav_home: 'Home',
        nav_modes: 'Modes',
        nav_garage: 'Garage',
        nav_custom: 'Custom',
        nav_race: 'Race HUD',
        hero_class: 'S-CLASS · TIER 4',
        btn_play: 'PLAY',
        modes_title: 'SELECT GAME MODE',
        modes_subtitle: 'Swipe to explore 10 competitive racing disciplines',
        badge_circuit: 'CIRCUIT',
        mode_race: 'QUICK RACE',
        mode_race_desc: '8-car sprint on Dhaka Grand Prix circuit.',
        badge_drift: 'TANDEM',
        mode_drift: 'DRIFT ATTACK',
        mode_drift_desc: 'High-angle mountain slides & multiplier combos.',
        badge_arcade: 'ACTION',
        mode_arcade: 'ARCADE STUNTS',
        mode_arcade_desc: 'Mega ramps, barrel rolls and nitro boost pads.',
        badge_derby: 'ARENA',
        mode_derby: 'DEMO DERBY',
        mode_derby_desc: 'High-impact metal crumple. Last car standing wins.',
        badge_drag: '1/4 MILE',
        mode_drag: 'DRAG STRIP',
        mode_drag_desc: 'Christmas tree light launch & manual shift timings.',
        badge_f1: 'GRAND PRIX',
        mode_f1: 'FORMULA 1',
        mode_f1_desc: 'Open-wheel apex speeds, tire wear & DRS zones.',
        badge_timetrial: 'SOLO',
        mode_timetrial: 'TIME TRIAL',
        mode_timetrial_desc: 'Chase personal bests against translucent ghost telemetry.',
        badge_challenges: 'ACADEMY',
        mode_challenges: 'CHALLENGES',
        mode_challenges_desc: 'Master slalom maneuvers, threshold braking & hairpin apexes.',
        badge_online: 'ONLINE',
        mode_online: 'MULTIPLAYER',
        mode_online_desc: 'Live competitive lobbies with room codes & real-time sync.',
        badge_career: 'SEASON 3',
        mode_career: 'PRO CAREER',
        mode_career_desc: 'Climb from Rookie Cup to the Redline World Masters.',
        btn_enter: 'ENTER',
        stat_power: 'POWER',
        stat_speed: 'TOP SPEED',
        stat_accel: '0-100 KM/H',
        stat_grip: 'GRIP',
        stat_weight: 'WEIGHT',
        cat_upgrade: 'UPGRADE',
        cat_tune: 'TUNE',
        cat_paint: 'PAINT',
        btn_race_now: 'RACE',
        pin_wheels: 'WHEELS & TIRES',
        pin_aero: 'AERO WING',
        pin_engine: 'TWIN TURBO',
        pin_paint: 'PAINT FINISH',
        custom_category_title: 'WHEELS & BRAKES',
        lbl_total: 'TOTAL PRICE:',
        btn_apply: 'BUY & INSTALL',
        pedal_brake: 'BRAKE',
        pedal_gas: 'GAS',
        rotate_title: 'ROTATE YOUR DEVICE',
        rotate_desc: 'Landscape mode is required for high-performance precision driving and full cockpit telemetry.',
        rotate_dismiss: 'Continue anyway (Preview)'
      },
      bn: {
        inst_title: 'আস-সুন্নাহ ইনস্টিটিউট',
        nav_home: 'হোম',
        nav_modes: 'মোডসমূহ',
        nav_garage: 'গ্যারেজ',
        nav_custom: 'কাস্টম',
        nav_race: 'রেস HUD',
        hero_class: 'এস-ক্লাস · টায়ার ৪',
        btn_play: 'শুরু করুন',
        modes_title: 'গেম মোড নির্বাচন করুন',
        modes_subtitle: '১০টি রোমাঞ্চকর রেসিং মোড অন্বেষণ করতে সোয়াইপ করুন',
        badge_circuit: 'সার্কিট',
        mode_race: 'দ্রুত রেস',
        mode_race_desc: 'ঢাকা গ্র্যান্ড প্রিক্সে ৮-গাড়ির গতিশীল রেস প্রতিযোগিতা।',
        badge_drift: 'ট্যান্ডেম',
        mode_drift: 'ড্রিফ্ট অ্যাটাক',
        mode_drift_desc: 'উঁচু পাহাড়ে নিখুঁত ড্রিফ্ট স্লাইড ও কম্বো পয়েন্ট।',
        badge_arcade: 'অ্যাকশন',
        mode_arcade: 'আর্কেড স্টান্ট',
        mode_arcade_desc: 'বিশাল জাম্প র‌্যাম্প, ব্যারেল রোল এবং নাইট্রো বুস্ট।',
        badge_derby: 'অ্যারেনা',
        mode_derby: 'ডেমোলিশন ডার্বি',
        mode_derby_desc: 'ধাতব সংঘর্ষের লড়াই। টিকে থাকা শেষ গাড়িটি বিজয়ী।',
        badge_drag: '১/৪ মাইল',
        mode_drag: 'ড্র্যাগ স্ট্রিপ',
        mode_drag_desc: 'ক্রিসমাস ট্রি সিগন্যাল ও নিখুঁত গিয়ার শিফট টাইমিং।',
        badge_f1: 'গ্র্যান্ড প্রিক্স',
        mode_f1: 'ফর্মুলা ১',
        mode_f1_desc: 'ওপেন-হুইল সর্বোচ্চ গতি, টায়ার ক্ষয় ও ডিআরএস জোন।',
        badge_timetrial: 'একক ল্যাপ',
        mode_timetrial: 'টাইম ট্রায়াল',
        mode_timetrial_desc: 'ঘোস্ট গাড়ির সাথে ব্যক্তিগত সেরা ল্যাপ টাইম রেকর্ড গড়ুন।',
        badge_challenges: 'অ্যাকাডেমি',
        mode_challenges: 'চ্যালেঞ্জসমূহ',
        mode_challenges_desc: 'স্লালম ড্রাইভ, থ্রেশহোল্ড ব্রেকিং ও কঠিন বাঁকে দক্ষতা অর্জন।',
        badge_online: 'অনলাইন',
        mode_online: 'মাল্টিপ্লেয়ার',
        mode_online_desc: 'রুম কোড ও রিয়েল-টাইম রেসিং লবিতে বন্ধুদের সাথে খেলুন।',
        badge_career: 'সিজন ৩',
        mode_career: 'প্রো ক্যারিয়ার',
        mode_career_desc: 'রুকি কাপ থেকে শুরু করে রেডলাইন ওয়ার্ল্ড মাস্টার্স জয় করুন।',
        btn_enter: 'প্রবেশ',
        stat_power: 'শক্তি',
        stat_speed: 'সর্বোচ্চ গতি',
        stat_accel: '০-১০০ কিমি/ঘণ্টা',
        stat_grip: 'গ্রিপ',
        stat_weight: 'ওজন',
        cat_upgrade: 'আপগ্রেড',
        cat_tune: 'টিউনিং',
        cat_paint: 'কালার',
        btn_race_now: 'রেস',
        pin_wheels: 'চাকা ও টায়ার',
        pin_aero: 'এয়ারো উইং',
        pin_engine: 'টুইন টার্বো',
        pin_paint: 'বডি পেইন্ট',
        custom_category_title: 'চাকা ও ব্রেক',
        lbl_total: 'মোট মূল্য:',
        btn_apply: 'ক্রয় ও ইনস্টল',
        pedal_brake: 'ব্রেক',
        pedal_gas: 'গ্যাস',
        rotate_title: 'আপনার ডিভাইসটি ঘোরান',
        rotate_desc: 'উচ্চ-গতির রেসিং এবং ফুল ককপিট টেলিমেট্রির জন্য ল্যান্ডস্কেপ মোড বাধ্যতামূলক।',
        rotate_dismiss: 'চালিয়ে যান (প্রিভিউ)'
      }
    };

    function rlToggleLang() {
      currentLang = currentLang === 'en' ? 'bn' : 'en';
      document.getElementById('rl-lang-btn').textContent = currentLang === 'en' ? 'BN' : 'EN';
      var dict = I18N[currentLang];
      var elements = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        if (dict[key]) {
          elements[i].textContent = dict[key];
        }
      }
      rlHaptic('tap');
      rlPlaySound('tap');
    }

    /* Screen Navigation Handler */
    function rlNav(screenId) {
      rlHaptic('nav');
      rlPlaySound('nav');

      var screens = document.querySelectorAll('.rl-screen, .rl-hud-screen');
      screens.forEach(function(s) { s.classList.remove('is-active'); });

      var railItems = document.querySelectorAll('.rl-nav-item');
      railItems.forEach(function(r) { r.classList.remove('is-active'); });

      var backBtn = document.getElementById('rl-btn-back');
      var stageCar = document.getElementById('rl-stage-car');
      var stageBackdrop = document.getElementById('rl-stage');
      var arrowPrev = document.getElementById('rl-arrow-prev');
      var arrowNext = document.getElementById('rl-arrow-next');

      if (arrowPrev) arrowPrev.style.display = (screenId === 'garage') ? 'flex' : 'none';
      if (arrowNext) arrowNext.style.display = (screenId === 'garage') ? 'flex' : 'none';

      if (screenId === 'home') {
        document.getElementById('screen-home').classList.add('is-active');
        document.getElementById('rail-home').classList.add('is-active');
        backBtn.style.display = 'none';
        stageBackdrop.style.display = 'flex';
        stageCar.style.transform = 'translateX(-50%) scale(1)';
      } else if (screenId === 'modes') {
        document.getElementById('screen-modes').classList.add('is-active');
        document.getElementById('rail-modes').classList.add('is-active');
        backBtn.style.display = 'flex';
        stageBackdrop.style.display = 'none';
      } else if (screenId === 'garage') {
        document.getElementById('screen-garage').classList.add('is-active');
        document.getElementById('rail-garage').classList.add('is-active');
        backBtn.style.display = 'flex';
        stageBackdrop.style.display = 'flex';
        stageCar.style.transform = 'translateX(-50%) scale(0.92) translateY(10px)';
      } else if (screenId === 'customize') {
        document.getElementById('screen-customize').classList.add('is-active');
        document.getElementById('rail-customize').classList.add('is-active');
        backBtn.style.display = 'flex';
        stageBackdrop.style.display = 'flex';
        stageCar.style.transform = 'translateX(-50%) scale(1.08) translateY(-10px)';
      } else if (screenId === 'hud') {
        document.getElementById('screen-hud').classList.add('is-active');
        document.getElementById('rail-race').classList.add('is-active');
        backBtn.style.display = 'none';
        stageBackdrop.style.display = 'none';
      }
    }

    /* Mode Selection Carousel Card Click */
    function rlSelectModeCard(card, target) {
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('.rl-mode-card').forEach(function(c) { c.classList.remove('is-focused'); });
      card.classList.add('is-focused');
      if (target) {
        setTimeout(function() { rlNav(target); }, 150);
      }
    }

    /* Garage Car Selection */
    function rlSelectCar(idx) {
      currentCarIdx = idx;
      var c = CAR_ROSTER[idx];
      if (!c) return;

      rlHaptic('select');
      rlPlaySound('select');

      document.querySelectorAll('.rl-car-thumb-item').forEach(function(t) { t.classList.remove('is-selected'); });
      var strip = document.getElementById('rl-car-strip');
      if (strip && strip.children[idx]) {
        strip.children[idx].classList.add('is-selected');
        strip.children[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      document.getElementById('rl-garage-car-name').textContent = (c.make + ' ' + c.name).toUpperCase();
      document.getElementById('rl-garage-car-tier').textContent = (idx + 1) + ' / 53 · ' + c.tier;
      document.getElementById('rl-val-power').textContent = c.hp + ' HP';
      document.getElementById('rl-val-speed').textContent = c.speed + ' KM/H';
      document.getElementById('rl-val-accel').textContent = c.accel + ' SEC';
      document.getElementById('rl-val-grip').textContent = c.grip + ' G';
      document.getElementById('rl-val-weight').textContent = c.weight.toLocaleString() + ' KG';

      document.getElementById('rl-bar-power').style.width = Math.min(100, (c.hp / 1600) * 100) + '%';
      document.getElementById('rl-bar-speed').style.width = Math.min(100, (c.speed / 420) * 100) + '%';
      document.getElementById('rl-bar-accel').style.width = Math.min(100, (1 - (c.accel - 2) / 4) * 100) + '%';
      document.getElementById('rl-bar-grip').style.width = Math.min(100, (c.grip / 1.5) * 100) + '%';
      document.getElementById('rl-bar-weight').style.width = Math.min(100, (1 - (c.weight - 1000) / 1200) * 100) + '%';

      var carPath = document.querySelector('#paintGrad stop:nth-child(2)');
      if (carPath) carPath.setAttribute('stop-color', c.color);

      // Slide-in animation on car
      var stageCar = document.getElementById('rl-stage-car');
      if (stageCar) {
        stageCar.style.transform = 'translateX(-45%) scale(0.92) translateY(10px)';
        setTimeout(function() {
          stageCar.style.transform = 'translateX(-50%) scale(0.92) translateY(10px)';
        }, 80);
      }
    }

    function rlCycleCar(delta) {
      var nextIdx = (currentCarIdx + delta + CAR_ROSTER.length) % CAR_ROSTER.length;
      rlSelectCar(nextIdx);
    }

    /* Populate 12 Real Cars from Roster into Garage Strip */
    function initGarageStrip() {
      var strip = document.getElementById('rl-car-strip');
      if (!strip) return;
      strip.innerHTML = '';
      CAR_ROSTER.forEach(function(c, i) {
        var item = document.createElement('div');
        item.className = 'rl-car-thumb-item' + (i === 0 ? ' is-selected' : '');
        item.onclick = function() { rlSelectCar(i); };
        item.innerHTML = '<svg viewBox="0 0 80 35"><path d="M5 25 C15 24 20 18 35 15 C50 14 65 20 75 25 Z" fill="' + c.color + '"/><circle cx="20" cy="25" r="5" fill="#333"/><circle cx="60" cy="25" r="5" fill="#333"/></svg><span>' + c.name + '</span>';
        strip.appendChild(item);
      });
    }

    /* Swipe gestures on 3D turntable */
    var touchStartX = 0;
    var stageEl = document.getElementById('rl-stage');
    if (stageEl) {
      stageEl.addEventListener('pointerdown', function(e) {
        touchStartX = e.clientX;
      });
      stageEl.addEventListener('pointerup', function(e) {
        var dx = e.clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          rlCycleCar(dx > 0 ? -1 : 1);
        }
      });
    }

    /* Hotspot Navigation in Customization */
    function rlSetHotspot(type) {
      rlHaptic('tap');
      rlPlaySound('tap');
      document.querySelectorAll('.rl-hotspot-pin').forEach(function(p) { p.classList.remove('is-active'); });
      var target = document.querySelector('.rl-pin-' + type);
      if (target) target.classList.add('is-active');

      var catTitles = {
        wheels: 'WHEELS & BRAKES',
        aero: 'AERODYNAMICS & SPOILERS',
        engine: 'TWIN TURBOCHARGERS',
        paint: 'BODY FINISH & PAINT'
      };
      var tEl = document.getElementById('rl-custom-title');
      if (tEl && catTitles[type]) tEl.textContent = catTitles[type];
    }

    /* Part Selection in Customization */
    function rlSelectPart(tile, price, hpDelta, wtDelta, gDelta) {
      rlHaptic('select');
      rlPlaySound('select');
      document.querySelectorAll('.rl-part-tile').forEach(function(t) { t.classList.remove('is-active'); });
      tile.classList.add('is-active');
      document.getElementById('rl-custom-price').textContent = '$' + price.toLocaleString() + ' CR';
      document.getElementById('rl-delta-hp').textContent = (hpDelta >= 0 ? '+' : '') + hpDelta + ' HP';
      document.getElementById('rl-delta-wt').textContent = (wtDelta >= 0 ? '+' : '') + wtDelta + ' KG';
      document.getElementById('rl-delta-g').textContent = (gDelta >= 0 ? '+' : '') + gDelta + ' G';
    }

    function rlApplyCustomization() {
      rlHaptic('cta');
      rlPlaySound('select');
      rlOpenDialog('Install Customization', 'Purchase and install selected performance parts for $18,500 CR onto your 911 GT3?');
    }

    /* Toast Notification */
    var toastTimer = null;
    function rlShowToast(msg, type) {
      var toast = document.getElementById('rl-toast');
      var toastMsg = document.getElementById('rl-toast-msg');
      if (!toast || !toastMsg) return;
      toastMsg.textContent = msg;
      toast.classList.add('is-visible');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function() {
        toast.classList.remove('is-visible');
      }, 3200);
    }

    /* Dialog Handlers */
    function rlOpenDialog(title, desc) {
      document.getElementById('rl-dialog-title').textContent = title;
      document.getElementById('rl-dialog-desc').textContent = desc;
      document.getElementById('rl-dialog').classList.add('is-open');
    }

    function rlCloseDialog() {
      document.getElementById('rl-dialog').classList.remove('is-open');
    }

    function rlConfirmDialog() {
      rlCloseDialog();
      rlShowToast('Customization installed! +45 HP added to 911 GT3.');
    }

    /* Dismiss portrait prompt for testing */
    function rlDismissPortrait() {
      document.getElementById('rl-portrait-overlay').classList.remove('auto-detect');
      document.getElementById('rl-portrait-overlay').style.display = 'none';
    }

    function rlToggleCamera() {
      rlHaptic('tap');
      rlPlaySound('tap');
      rlShowToast('Camera: CHASE VIEW', 'info');
    }

    // Interactive pedal press simulation
    var gasBtn = document.getElementById('rl-btn-gas');
    var speedEl = document.getElementById('rl-hud-speed');
    var spd = 214;
    var gasTimer = null;

    if (gasBtn) {
      gasBtn.addEventListener('pointerdown', function() {
        rlHaptic('tap');
        gasTimer = setInterval(function() {
          spd = Math.min(340, spd + 2);
          if (speedEl) speedEl.textContent = spd;
        }, 60);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev) {
        gasBtn.addEventListener(ev, function() {
          if (gasTimer) clearInterval(gasTimer);
        });
      });
    }

    // Initialize car roster on boot
    initGarageStrip();
  

    /* ==========================================================================
       REAL DATA SYNC HOOKS (Jubayer Racing Engine Parity)
       ========================================================================== */
    function rlSyncProfileData() {
      try {
        if (typeof CB !== 'undefined' && CB.game && CB.game.profile && typeof CB.game.profile.get === 'function') {
          var p = CB.game.profile.get();
          if (p) {
            var credEl = document.getElementById('rl-credits-val');
            if (credEl && p.credits != null) {
              credEl.textContent = Number(p.credits).toLocaleString() + ' CR';
            }
            var lvlEl = document.getElementById('rl-level-val');
            if (lvlEl && p.level != null) {
              lvlEl.textContent = 'LVL ' + p.level;
            }
          }
        }
      } catch (e) {
        console.warn('[Redline UI] Profile sync notice:', e);
      }
    }

    function rlPopulateFull53Roster() {
      try {
        if (typeof CB !== 'undefined' && CB.shapes && CB.shapes.models) {
          var modelKeys = Object.keys(CB.shapes.models);
          if (modelKeys && modelKeys.length > 0) {
            var fullRoster = [];
            var specs = (CB.stock && CB.stock.SPECS) || {};
            for (var i = 0; i < modelKeys.length; i++) {
              var mId = modelKeys[i];
              var sp = specs[mId] || {};
              var mObj = CB.shapes.models[mId] || {};
              
              var make = mObj.make || (sp.t ? sp.t.split(' ')[0] : 'Jubayer');
              var name = mObj.name || (sp.t || mId.replace(/-/g, ' ').toUpperCase());
              var hp = sp.hp || 380;
              var tier = hp > 800 ? 'TIER 4' : hp > 450 ? 'TIER 3' : hp > 250 ? 'TIER 2' : 'TIER 1';
              var speed = sp.v || Math.min(380, Math.round(180 + hp * 0.18));
              var accel = sp.s || Math.max(2.2, +(6.5 - hp * 0.0035).toFixed(1));
              var grip = +(1.0 + (hp / 2500)).toFixed(2);
              var weight = sp.kg || Math.round(1100 + hp * 0.4);
              var color = sp.p && sp.p[0] ? sp.p[0] : '#c8102e';

              fullRoster.push({
                id: mId,
                make: make,
                name: name,
                tier: tier,
                hp: hp,
                speed: speed,
                accel: accel,
                grip: grip,
                weight: weight,
                color: color
              });
            }
            if (fullRoster.length > 0) {
              CAR_ROSTER = fullRoster;
              // Re-render thumbnail bar
              var bar = document.getElementById('rl-garage-thumb-bar');
              if (bar) {
                var html = '';
                for (var j = 0; j < CAR_ROSTER.length; j++) {
                  var c = CAR_ROSTER[j];
                  var isCur = j === currentCarIdx;
                  html += '<div class="rl-car-thumb ' + (isCur ? 'active' : '') + '" data-idx="' + j + '" onclick="rlSelectCar(' + j + ')" role="tab" tabindex="0">' +
                    '<div class="rl-thumb-glow"></div>' +
                    '<div style="font-size:10px;font-weight:700;color:var(--rl-text-muted);text-transform:uppercase">' + c.make + '</div>' +
                    '<div style="font-size:12px;font-weight:800;color:var(--rl-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + c.name + '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px">' +
                      '<span style="font-size:9px;color:var(--rl-accent-gold);font-weight:700">' + c.tier + '</span>' +
                      '<span style="font-size:10px;font-weight:800;color:var(--rl-text-secondary)">' + c.hp + ' HP</span>' +
                    '</div>' +
                  '</div>';
                }
                bar.innerHTML = html;
              }
            }
          }
        }
      } catch (e) {
        console.warn('[Redline UI] 53-car roster population note:', e);
      }
    }

    // Connect mode cards to real routes
    function rlLaunchRealMode(modeKey) {
      rlHaptic('cta');
      rlPlaySound('cta');
      if (typeof CB !== 'undefined' && CB.router && typeof CB.router.go === 'function') {
        if (modeKey === 'race') CB.router.go('race');
        else if (modeKey === 'drift') CB.router.go('drift');
        else if (modeKey === 'arcade') CB.router.go('arcade');
        else if (modeKey === 'derby') CB.router.go('derby');
        else if (modeKey === 'drag') CB.router.go('drag');
        else if (modeKey === 'f1') CB.router.go('f1');
        else if (modeKey === 'career') CB.router.go('career');
        else if (modeKey === 'timetrial') CB.router.go('hub', { sub: 'timetrial' });
        else if (modeKey === 'online') CB.router.go('multiplayer');
        else if (modeKey === 'challenges') CB.router.go('challenges');
        else CB.router.go(modeKey);
      } else {
        rlSwitchScreen('hud');
      }
    }

    // Switch between UI versions
    function rlSetUIVersion(v) {
      try {
        localStorage.setItem('redline_ui_version', String(v));
      } catch (e) {}
      var url = new URL(window.location.href);
      url.searchParams.set('ui', String(v));
      window.location.href = url.toString();
    }

    function rlSetLanguage(lang) {
      currentLang = lang;
      var dict = I18N[lang] || I18N.en;
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var k = el.getAttribute('data-i18n');
        if (dict[k]) el.textContent = dict[k];
      });
      var toggleBtn = document.getElementById('rl-lang-btn');
      if (toggleBtn) toggleBtn.textContent = lang === 'en' ? 'EN' : 'বাংলা';
    }

    // Expose APIs globally for automation and inline handlers
    window.rlNav = rlNav;
    window.rlToggleLang = rlToggleLang;
    window.rlSetLanguage = rlSetLanguage;
    window.rlSelectCar = rlSelectCar;
    window.rlCycleCar = rlCycleCar;
    window.rlSetHotspot = rlSetHotspot;
    window.rlSelectPart = rlSelectPart;
    window.rlApplyCustomization = rlApplyCustomization;
    window.rlHaptic = rlHaptic;
    window.rlPlaySound = rlPlaySound;
    window.rlToggleAudio = rlToggleAudio;
    window.rlToggleMotion = rlToggleMotion;
    window.rlShowToast = rlShowToast;
    window.rlOpenDialog = rlOpenDialog;
    window.rlCloseDialog = rlCloseDialog;
    window.rlConfirmDialog = rlConfirmDialog;
    window.rlDismissPortrait = rlDismissPortrait;
    window.rlToggleCamera = rlToggleCamera;
    window.rlLaunchRealMode = rlLaunchRealMode;
    window.rlSetUIVersion = rlSetUIVersion;
    window.rlSyncProfileData = rlSyncProfileData;

    // Initial sync
    setTimeout(function() {
      rlSyncProfileData();
      rlPopulateFull53Roster();
    }, 100);

  }

  // Auto-boot on DOM ready or router ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  window.addEventListener('cb:router-ready', function () {
    if (ui2.active && typeof rlSyncProfileData === 'function') {
      rlSyncProfileData();
    }
  });

})();
