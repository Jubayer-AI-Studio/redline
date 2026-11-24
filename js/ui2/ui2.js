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
  var isV2 = (uiParam === '2') || (!uiParam && savedUi === '2') || (uiParam !== '1' && !savedUi);

  if (!isV2) {
    document.documentElement.classList.remove('rl-v2');
    return;
  }

  document.documentElement.classList.add('rl-v2');

  var APP_HTML = "<div class=\"vignette-overlay\"></div>\n\n    <!-- 3D Studio Stage (Turntable with Soft Floor Shadow & Real In-Game Render) -->\n    <div class=\"studio-stage\" id=\"stage\">\n      <div class=\"studio-floor-reflection\"></div>\n      <img src=\"assets/realistic/real_porsche_911_gt3_studio.png\" class=\"studio-car-img\" id=\"studio-car\" alt=\"Porsche 911 GT3\">\n    </div>\n\n    <!-- Top Navigation & Profile Bar -->\n    <header class=\"topbar\">\n      <div class=\"brand-wrap\">\n        <span class=\"brand-title\">JUBAYER <span class=\"brand-accent\">RACING</span></span>\n        <span class=\"brand-badge\">PRO EDITION</span>\n      </div>\n      <div class=\"top-stats\">\n        <div class=\"stat-chip\">\n          <span class=\"stat-label\">CREDITS</span>\n          <span class=\"stat-val\" id=\"val-credits\">150,000 CR</span>\n        </div>\n        <div class=\"stat-chip\">\n          <span class=\"stat-label\">DRIVER</span>\n          <span class=\"stat-val\" id=\"val-level\">LVL 1</span>\n        </div>\n      </div>\n    </header>\n\n    <!-- Navigation Rail -->\n    <nav class=\"nav-rail\">\n      <button class=\"nav-btn active\" onclick=\"navTo('home')\" id=\"rail-home\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg>\n        <span>Showroom</span>\n      </button>\n      <button class=\"nav-btn\" onclick=\"navTo('modes')\" id=\"rail-modes\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"10 8 16 12 10 16 10 8\"/></svg>\n        <span>Events</span>\n      </button>\n      <button class=\"nav-btn\" onclick=\"navTo('garage')\" id=\"rail-garage\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M9 21V9\"/></svg>\n        <span>Garage</span>\n      </button>\n      <button class=\"nav-btn\" onclick=\"navTo('customize')\" id=\"rail-customize\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><path d=\"M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z\"/></svg>\n        <span>Tuning</span>\n      </button>\n      <button class=\"nav-btn\" onclick=\"navTo('settings')\" id=\"rail-settings\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>\n        <span>Settings</span>\n      </button>\n      <button class=\"nav-btn\" onclick=\"navTo('hud')\" id=\"rail-hud\">\n        <svg class=\"nav-icon\" viewBox=\"0 0 24 24\"><path d=\"M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83\"/></svg>\n        <span>Cockpit</span>\n      </button>\n    </nav>\n\n    <!-- Screen Containers -->\n    <div class=\"screen-container\">\n\n      <!-- SCREEN 1: HOME (Restrained Forza Horizon Style) -->\n      <section class=\"screen active\" id=\"screen-home\">\n        <div class=\"home-hero-info\">\n          <div class=\"hero-make\" id=\"home-car-make\">PORSCHE</div>\n          <div class=\"hero-title\" id=\"home-car-title\">911 GT3 (992)</div>\n          <div class=\"hero-subtitle\">4.0L Naturally Aspirated Boxer-6 · 502 HP · Rear-Engine RWD</div>\n        </div>\n        <div class=\"home-quick-actions\">\n          <button class=\"quick-btn\" onclick=\"navTo('garage')\">\n            <span>🏎️ 53 Cars Garage</span>\n          </button>\n          <button class=\"quick-btn\" onclick=\"navTo('modes')\">\n            <span>🏆 10 Game Modes</span>\n          </button>\n          <button class=\"quick-btn\" onclick=\"navTo('customize')\">\n            <span>🎨 Paint & Tuning</span>\n          </button>\n          <button class=\"quick-btn\" onclick=\"navTo('settings')\">\n            <span>⚙️ Settings</span>\n          </button>\n        </div>\n        <button class=\"cta-play-btn\" onclick=\"launchSelectedMode()\">\n          <span>RACE NOW</span>\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><polyline points=\"9 18 15 12 9 6\"/></svg>\n        </button>\n      </section>\n\n      <!-- SCREEN 2: MODES (Photographic Real Event Cards - All 10 Game Modes) -->\n      <section class=\"screen\" id=\"screen-modes\">\n        <div class=\"modes-content\">\n          <div class=\"section-header\">\n            <h2 class=\"section-title\">CHOOSE COMPETITION</h2>\n            <p class=\"section-desc\">Select from 10 competitive disciplines with verified telemetry</p>\n          </div>\n          <div class=\"modes-carousel\">\n            <!-- Mode 1: Circuit Race -->\n            <div class=\"mode-card selected\" onclick=\"selectMode(this, 'race')\">\n              <img src=\"assets/cards/mode_race.webp\" class=\"mode-card-img\" alt=\"Circuit Sprint\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">CIRCUIT</span>\n                <div class=\"mode-name\">Grand Prix Sprint</div>\n                <div class=\"mode-info\">8-car closed-course race on Dhaka GP.</div>\n              </div>\n            </div>\n            <!-- Mode 2: Drift Attack -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'drift')\">\n              <img src=\"assets/cards/mode_drift.webp\" class=\"mode-card-img\" alt=\"Drift Attack\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">DRIFT</span>\n                <div class=\"mode-name\">Tandem Battles</div>\n                <div class=\"mode-info\">Precision angle scoring & clipping zones.</div>\n              </div>\n            </div>\n            <!-- Mode 3: Formula 1 -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'f1')\">\n              <img src=\"assets/cards/mode_f1.webp\" class=\"mode-card-img\" alt=\"Formula 1\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">OPEN WHEEL</span>\n                <div class=\"mode-name\">F1 World Tour</div>\n                <div class=\"mode-info\">22-car grid with DRS and tire strategy.</div>\n              </div>\n            </div>\n            <!-- Mode 4: 1/4 Mile Drag -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'drag')\">\n              <img src=\"assets/cards/mode_drag.webp\" class=\"mode-card-img\" alt=\"Drag Strip\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">DRAG STRIP</span>\n                <div class=\"mode-name\">Pro Staging</div>\n                <div class=\"mode-info\">Reaction times, burnout grip and trap speeds.</div>\n              </div>\n            </div>\n            <!-- Mode 5: Demolition Derby -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'derby')\">\n              <img src=\"assets/cards/mode_derby.webp\" class=\"mode-card-img\" alt=\"Demolition Derby\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">DESTRUCTION</span>\n                <div class=\"mode-name\">Demolition Derby</div>\n                <div class=\"mode-info\">Vehicular combat with live metal deformation.</div>\n              </div>\n            </div>\n            <!-- Mode 6: Stunt Arcade -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'arcade')\">\n              <img src=\"assets/cards/mode_arcade.webp\" class=\"mode-card-img\" alt=\"Stunt Arcade\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">ARCADE</span>\n                <div class=\"mode-name\">Stunt Stadium</div>\n                <div class=\"mode-info\">High-flying loops, corkscrews and nitro stunts.</div>\n              </div>\n            </div>\n            <!-- Mode 7: Career -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'career')\">\n              <img src=\"assets/cards/mode_career.webp\" class=\"mode-card-img\" alt=\"Career Mode\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">CAREER</span>\n                <div class=\"mode-name\">Professional Path</div>\n                <div class=\"mode-info\">Championship tiers, sponsors and prizes.</div>\n              </div>\n            </div>\n            <!-- Mode 8: Challenges -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'challenges')\">\n              <img src=\"assets/cards/mode_challenges.webp\" class=\"mode-card-img\" alt=\"Challenges\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">CHALLENGE</span>\n                <div class=\"mode-name\">Master Trials</div>\n                <div class=\"mode-info\">Target times and technical obstacle courses.</div>\n              </div>\n            </div>\n            <!-- Mode 9: Time Attack -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'timetrial')\">\n              <img src=\"assets/cards/mode_timetrial.webp\" class=\"mode-card-img\" alt=\"Time Attack\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">TIME ATTACK</span>\n                <div class=\"mode-name\">Hotlap Records</div>\n                <div class=\"mode-info\">Ghost cars, sector splits and global records.</div>\n              </div>\n            </div>\n            <!-- Mode 10: Multiplayer -->\n            <div class=\"mode-card\" onclick=\"selectMode(this, 'multiplayer')\">\n              <img src=\"assets/cards/mode_online.webp\" class=\"mode-card-img\" alt=\"Multiplayer\">\n              <div class=\"mode-card-grad\"></div>\n              <div class=\"mode-card-body\">\n                <span class=\"mode-badge\">MULTIPLAYER</span>\n                <div class=\"mode-name\">Live P2P Lobby</div>\n                <div class=\"mode-info\">Low-latency WebRTC real-time racing.</div>\n              </div>\n            </div>\n          </div>\n          <div class=\"modes-action-bar\">\n            <button class=\"cta-play-btn\" id=\"launch-mode-btn\" onclick=\"launchSelectedMode()\">\n              <span>START EVENT</span>\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><polyline points=\"9 18 15 12 9 6\"/></svg>\n            </button>\n          </div>\n        </div>\n      </section>\n\n      <!-- SCREEN 3: GARAGE (Gran Turismo Style Telemetry & 53 Cars) -->\n      <section class=\"screen\" id=\"screen-garage\">\n        <!-- Floating Prev/Next Car Arrows -->\n        <button class=\"car-nav-arrow arrow-prev\" onclick=\"prevCar()\" title=\"Previous Vehicle\">◀</button>\n        <button class=\"car-nav-arrow arrow-next\" onclick=\"nextCar()\" title=\"Next Vehicle\">▶</button>\n\n        <!-- Camera Viewing Angles Bar -->\n        <div class=\"camera-bar\">\n          <button class=\"cam-pill active\" onclick=\"setStudioView(this, 'side')\">3/4 ORBIT</button>\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'front')\">FRONT</button>\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'rear')\">REAR</button>\n          <button class=\"cam-pill\" onclick=\"setStudioView(this, 'top')\">TOP</button>\n        </div>\n\n        <div class=\"garage-telemetry\">\n          <div class=\"micro-label\">TECHNICAL SPECIFICATION</div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">PEAK POWER</span>\n            <span class=\"telemetry-val\" id=\"g-hp\">502 HP @ 8,400 RPM</span>\n          </div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">PEAK TORQUE</span>\n            <span class=\"telemetry-val\" id=\"g-torque\">470 NM</span>\n          </div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">KERB WEIGHT</span>\n            <span class=\"telemetry-val\" id=\"g-weight\">1,435 KG</span>\n          </div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">0–100 KM/H</span>\n            <span class=\"telemetry-val\" id=\"g-accel\">3.2 S</span>\n          </div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">MAX SPEED</span>\n            <span class=\"telemetry-val\" id=\"g-speed\">318 KM/H</span>\n          </div>\n          <div class=\"telemetry-row\">\n            <span class=\"telemetry-key\">POWER / WEIGHT</span>\n            <span class=\"telemetry-val\" id=\"g-ptw\">0.350 HP/KG</span>\n          </div>\n        </div>\n\n        <div class=\"garage-action-btns\">\n          <button class=\"garage-select-btn\" onclick=\"confirmSelectCar()\">SELECT THIS CAR</button>\n          <button class=\"garage-drive-btn\" onclick=\"launchCarRace()\">🏎️ DRIVE NOW</button>\n        </div>\n\n        <div class=\"garage-roster-strip\" id=\"garage-roster\">\n          <!-- Real models rendered directly from game catalog -->\n          <div class=\"roster-thumb active\" onclick=\"selectCar(0)\">\n            <span class=\"thumb-make\">PORSCHE</span>\n            <span class=\"thumb-model\">911 GT3 (992)</span>\n            <span class=\"thumb-spec\">502 HP · 3.2s</span>\n          </div>\n          <div class=\"roster-thumb\" onclick=\"selectCar(1)\">\n            <span class=\"thumb-make\">BMW</span>\n            <span class=\"thumb-model\">M4 Competition</span>\n            <span class=\"thumb-spec\">503 HP · 3.8s</span>\n          </div>\n          <div class=\"roster-thumb\" onclick=\"selectCar(2)\">\n            <span class=\"thumb-make\">TOYOTA</span>\n            <span class=\"thumb-model\">GR Supra RZ</span>\n            <span class=\"thumb-spec\">382 HP · 3.9s</span>\n          </div>\n          <div class=\"roster-thumb\" onclick=\"selectCar(3)\">\n            <span class=\"thumb-make\">FERRARI</span>\n            <span class=\"thumb-model\">SF90 Stradale</span>\n            <span class=\"thumb-spec\">986 HP · 2.5s</span>\n          </div>\n          <div class=\"roster-thumb\" onclick=\"selectCar(4)\">\n            <span class=\"thumb-make\">MCLAREN</span>\n            <span class=\"thumb-model\">P1 Hypercar</span>\n            <span class=\"thumb-spec\">903 HP · 2.8s</span>\n          </div>\n        </div>\n      </section>\n\n      <!-- SCREEN 4: CUSTOMIZE (Photoreal Paint & Hotspots) -->\n      <section class=\"screen\" id=\"screen-customize\">\n        <!-- Hotspot pins with thin leader lines -->\n        <div class=\"hotspot-pin pin-aero\">\n          <div class=\"hotspot-label\">AERO SPOILER</div>\n        </div>\n        <div class=\"hotspot-pin pin-paint\">\n          <div class=\"hotspot-label\">OEM PAINT FINISH</div>\n        </div>\n        <div class=\"hotspot-pin pin-wheels\">\n          <div class=\"hotspot-label\">FORGED WHEELS & TIRES</div>\n        </div>\n\n        <div class=\"customize-panel\">\n          <div class=\"customize-title\">FINISH & COATING</div>\n          <div class=\"finish-selector\">\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'gloss')\">Gloss</button>\n            <button class=\"finish-pill selected\" onclick=\"setFinish(this, 'metallic')\">Metallic</button>\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'matte')\">Satin</button>\n            <button class=\"finish-pill\" onclick=\"setFinish(this, 'pearl')\">Pearl</button>\n          </div>\n\n          <div class=\"micro-label\">OEM PALETTE</div>\n          <div class=\"swatch-grid\">\n            <button class=\"swatch-btn selected\" data-swatch=\"red\" onclick=\"pickColor(this, '#b91c1c')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"blue\" onclick=\"pickColor(this, '#1d4ed8')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"black\" onclick=\"pickColor(this, '#111827')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"silver\" onclick=\"pickColor(this, '#e5e7eb')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"orange\" onclick=\"pickColor(this, '#c2410c')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"green\" onclick=\"pickColor(this, '#047857')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"grey\" onclick=\"pickColor(this, '#4b5563')\"></button>\n            <button class=\"swatch-btn\" data-swatch=\"gold\" onclick=\"pickColor(this, '#d97706')\"></button>\n          </div>\n\n          <div class=\"cost-summary-row\">\n            <span class=\"cost-key\">INSTALLATION</span>\n            <span class=\"cost-val\">2,500 CR</span>\n          </div>\n\n          <button class=\"apply-btn\" onclick=\"applyCustomization()\">APPLY MODIFICATIONS</button>\n        </div>\n      </section>\n\n      <!-- SCREEN: SETTINGS (Global Graphics, Audio, Controls & Offline) -->\n      <section class=\"screen\" id=\"screen-settings\">\n        <div class=\"settings-content\">\n          <div class=\"section-header\">\n            <h2 class=\"section-title\">GLOBAL SETTINGS</h2>\n            <p class=\"section-desc\">Performance, graphics tiers, acoustics, input sensitivity and storage</p>\n          </div>\n          <div class=\"settings-grid\">\n            <!-- Group 1: Graphics & Display -->\n            <div class=\"settings-group\">\n              <div class=\"settings-group-title\"><span>🖥️ GRAPHICS & FIDELITY</span></div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Preset Tier</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-tier-val\">AUTO (HIGH)</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill selected\" onclick=\"setGraphicsTier(this, 'auto')\">Auto</button>\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'low')\">Low</button>\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'medium')\">Med</button>\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'high')\">High</button>\n                  <button class=\"setting-pill\" onclick=\"setGraphicsTier(this, 'ultra')\">Ultra</button>\n                </div>\n              </div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Speedometer Units</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-units-val\">KM/H</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill selected\" onclick=\"setUnits(this, 'kph')\">KM/H</button>\n                  <button class=\"setting-pill\" onclick=\"setUnits(this, 'mph')\">MPH</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Group 2: Audio Mixer -->\n            <div class=\"settings-group\">\n              <div class=\"settings-group-title\"><span>🔊 AUDIO & ACOUSTICS</span></div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Master Volume</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-vol-val\">85%</span>\n                </div>\n                <input type=\"range\" class=\"setting-slider\" min=\"0\" max=\"100\" value=\"85\" oninput=\"setMasterVolume(this.value)\">\n              </div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Theme Music</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-music-val\">ENABLED</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill selected\" onclick=\"toggleThemeMusic(this, true)\">On</button>\n                  <button class=\"setting-pill\" onclick=\"toggleThemeMusic(this, false)\">Mute</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Group 3: Driving & Input -->\n            <div class=\"settings-group\">\n              <div class=\"settings-group-title\"><span>🎮 STEERING & CONTROLS</span></div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Steering Sensitivity</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-sens-val\">1.0x</span>\n                </div>\n                <input type=\"range\" class=\"setting-slider\" min=\"50\" max=\"160\" value=\"100\" oninput=\"setSteeringSensitivity(this.value)\">\n              </div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Steering Assist</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-assist-val\">MEDIUM</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'off')\">Off</button>\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'light')\">Light</button>\n                  <button class=\"setting-pill selected\" onclick=\"setSteerAssist(this, 'medium')\">Med</button>\n                  <button class=\"setting-pill\" onclick=\"setSteerAssist(this, 'heavy')\">Heavy</button>\n                </div>\n              </div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Touch Controls (Mobile)</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-touch-val\">ALWAYS</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill selected\" onclick=\"setTouchMode(this, 'always')\">Always</button>\n                  <button class=\"setting-pill\" onclick=\"setTouchMode(this, 'auto')\">Auto</button>\n                  <button class=\"setting-pill\" onclick=\"setTouchMode(this, 'never')\">Hide</button>\n                </div>\n              </div>\n            </div>\n\n            <!-- Group 4: Offline & Localization -->\n            <div class=\"settings-group\">\n              <div class=\"settings-group-title\"><span>🌐 SYSTEM & OFFLINE</span></div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Language</span>\n                  <span class=\"setting-value-badge\" id=\"cfg-lang-val\">ENGLISH</span>\n                </div>\n                <div class=\"setting-pills\">\n                  <button class=\"setting-pill selected\" onclick=\"setLanguage(this, 'en')\">English</button>\n                  <button class=\"setting-pill\" onclick=\"setLanguage(this, 'bn')\">বাংলা</button>\n                </div>\n              </div>\n              <div class=\"setting-item\">\n                <div class=\"setting-label-row\">\n                  <span class=\"setting-label\">Offline Playback</span>\n                  <span class=\"offline-badge\">● 100% OFFLINE READY</span>\n                </div>\n                <p class=\"section-desc\">All 53 cars, audio, tracks & physics run locally without internet.</p>\n              </div>\n              <div class=\"setting-item\">\n                <button class=\"quick-btn\" style=\"width:100%;justify-content:center;margin-top:6px;\" onclick=\"resetSaveData()\">\n                  <span>Reset Local Progress</span>\n                </button>\n              </div>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <!-- SCREEN 5: IN-RACE HUD (Minimalist & Unobtrusive) -->\n      <section class=\"screen\" id=\"screen-hud\">\n        <!-- Road Backdrop -->\n        <div class=\"hud-backdrop\"></div>\n\n        <!-- Top Cluster -->\n        <div class=\"hud-cluster-top\">\n          <span class=\"hud-lap-badge\">LAP 2/3</span>\n          <span class=\"hud-lap-time\">01:24.89</span>\n          <span class=\"hud-split-time\">-0.34s</span>\n        </div>\n\n        <!-- Top Right Actions -->\n        <div class=\"hud-top-actions\">\n          <button class=\"hud-util-btn\" title=\"Pause\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg>\n          </button>\n          <button class=\"hud-util-btn\" title=\"Camera\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"/><circle cx=\"12\" cy=\"13\" r=\"4\"/></svg>\n          </button>\n        </div>\n\n        <!-- Minimal Slim Tachometer Arc & Central Speed -->\n        <div class=\"hud-telemetry-bottom\">\n          <div class=\"speed-gauge-wrap\">\n            <svg class=\"speed-gauge-svg\" viewBox=\"0 0 140 70\">\n              <!-- Background Arc -->\n              <path d=\"M 15 65 A 55 55 0 0 1 125 65\" fill=\"none\" stroke=\"rgba(255,255,255,0.12)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n              <!-- Active RPM Arc -->\n              <path d=\"M 15 65 A 55 55 0 0 1 100 20\" fill=\"none\" stroke=\"var(--text-white)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n              <!-- Redline Tip -->\n              <path d=\"M 100 20 A 55 55 0 0 1 125 65\" fill=\"none\" stroke=\"var(--accent-red)\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n            </svg>\n            <span class=\"hud-speed-num\">248</span>\n            <span class=\"hud-speed-unit\">KM/H</span>\n          </div>\n          <span class=\"hud-gear-badge\">GEAR 5</span>\n        </div>\n\n        <!-- Low-Opacity Minimalist Touch Controls (Transparent Wireframes) -->\n        <div class=\"hud-touch-left\">\n          <button class=\"touch-btn\">◀</button>\n          <button class=\"touch-btn\">▶</button>\n        </div>\n\n        <div class=\"hud-touch-right\">\n          <button class=\"touch-btn touch-brk\">BRK</button>\n          <button class=\"touch-btn touch-gas\">GAS</button>\n        </div>\n      </section>\n\n    </div>";

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
