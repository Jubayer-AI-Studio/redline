const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// 1. Refine the Top Bar to support both Showroom mode and Sub-screen mode with ◀ SHOWROOM Back button
const oldTopBarRegex = /<header class="topbar rk-topbar">[\s\S]*?<\/header>/;

const refinedTopBar = `<header class="topbar rk-topbar" id="app-topbar">
      <!-- Showroom Left Header: Level + Synergy -->
      <div class="rk-top-left" id="top-showroom-left">
        <div class="rk-lvl-box">
          <div class="rk-lvl-tag">Lvl. <span id="rk-lvl-num">28</span></div>
          <div class="rk-lvl-track">
            <div class="rk-lvl-fill" style="width: 72%;"></div>
          </div>
        </div>
        <div class="rk-synergy-box">
          <span class="rk-gas-icon">⛽</span>
          <span class="rk-synergy-lbl">Synergy</span>
          <div class="rk-synergy-pips">
            <span class="pip active"></span>
            <span class="pip active"></span>
            <span class="pip active"></span>
            <span class="pip active"></span>
            <span class="pip active"></span>
            <span class="pip"></span>
            <span class="pip"></span>
          </div>
        </div>
      </div>

      <!-- Sub-screen Left Header: Back to Showroom Button (Hidden on Home) -->
      <div class="rk-subscreen-left" id="top-subscreen-left" style="display: none;">
        <button class="rk-back-btn" onclick="navTo('home')" title="Back to Showroom">
          <span class="rk-back-arrow">◀</span>
          <span>SHOWROOM</span>
        </button>
      </div>

      <!-- Showroom Center: Brand + Model + Tier Badge -->
      <div class="rk-top-center" id="top-showroom-center">
        <div class="rk-car-pill" id="rk-header-car-pill">
          <div class="rk-brand-logo">
            <span id="rk-brand-icon">🏎️</span>
          </div>
          <div class="rk-car-names">
            <span class="rk-make-text" id="rk-make-text">CHEVROLET</span>
            <span class="rk-model-text" id="rk-model-text">Corvette Z06</span>
          </div>
          <div class="rk-tier-tag">
            <span id="rk-tier-text">T5 1080</span>
          </div>
        </div>
      </div>

      <!-- Sub-screen Center: Screen Title (Hidden on Home) -->
      <div class="rk-subscreen-center" id="top-subscreen-center">
        <span class="rk-subscreen-title" id="rk-subscreen-title" style="display: none;">DEALERSHIP · 53 VEHICLES</span>
      </div>

      <!-- Right: Dual Currencies (Always Visible) -->
      <div class="rk-top-right">
        <div class="rk-currency-chip rk-coin-chip">
          <span class="rk-coin-tag">RK</span>
          <span class="rk-cur-val" id="val-credits">148,000</span>
          <button class="rk-plus-btn" onclick="openRewardsModal()" title="Add Coins">+</button>
        </div>
        <div class="rk-currency-chip rk-cash-chip">
          <span class="rk-cash-tag">$</span>
          <span class="rk-cur-val" id="val-cash">682</span>
          <button class="rk-plus-btn" onclick="openRewardsModal()" title="Add Cash">+</button>
        </div>
      </div>
    </header>`;

html = html.replace(oldTopBarRegex, refinedTopBar);

// 2. Refine Screen 1: Home (Remove duplicate overlapping buttons, place rk-left-stack, rk-right-rail, and rk-bottom-bar inside screen-home)
// First, extract rk-left-stack, rk-right-rail, rk-bottom-bar if they are outside screen-container
const leftStackMatch = html.match(/<!-- Left Event Cards Stack -->\s*<aside class="rk-left-stack">[\s\S]*?<\/aside>/);
const rightRailMatch = html.match(/<!-- Right Rail \(Vertical utility buttons\) -->\s*<nav class="rk-right-rail">[\s\S]*?<\/nav>/);
const bottomBarMatch = html.match(/<!-- Bottom Command Bar -->\s*<footer class="rk-bottom-bar">[\s\S]*?<\/footer>/);

let leftStackHtml = leftStackMatch ? leftStackMatch[0] : '';
let rightRailHtml = rightRailMatch ? rightRailMatch[0] : '';
let bottomBarHtml = bottomBarMatch ? bottomBarMatch[0] : '';

// Remove them from global scope outside screen-container
if (leftStackMatch) html = html.replace(leftStackMatch[0], '');
if (rightRailMatch) html = html.replace(rightRailMatch[0], '');
if (bottomBarMatch) html = html.replace(bottomBarMatch[0], '');

// Replace old Screen 1 (Home) with clean, non-overlapping Showroom layout
const oldScreenHomeRegex = /<!-- SCREEN 1: HOME [\s\S]*?<\/section>/;

const refinedScreenHome = `<!-- SCREEN 1: SHOWROOM (Clean Automotive Workshop Experience) -->
      <section class="screen active" id="screen-home">
        ${leftStackHtml}
        ${rightRailHtml}
        ${bottomBarHtml}
      </section>`;

html = html.replace(oldScreenHomeRegex, refinedScreenHome);

// 3. Refine Screen 3: Garage Layout (Eliminate 180px left gap, position telemetry top-left, camera top-mid, buttons top-right, roster full bottom)
const oldGarageRegex = /<!-- SCREEN 3: GARAGE [\s\S]*?<\/section>/;

const refinedScreenGarage = `<!-- SCREEN 3: GARAGE (Gran Turismo Telemetry & 53 Cars Dealership) -->
      <section class="screen" id="screen-garage">
        <!-- Floating Prev/Next Car Arrows -->
        <button class="car-nav-arrow arrow-prev" onclick="prevCar()" title="Previous Vehicle">◀</button>
        <button class="car-nav-arrow arrow-next" onclick="nextCar()" title="Next Vehicle">▶</button>

        <!-- Top-Center: Camera Viewing Angles Bar -->
        <div class="camera-bar">
          <button class="cam-pill active" onclick="setStudioView(this, 'side')">3/4 ORBIT</button>
          <button class="cam-pill" onclick="setStudioView(this, 'front')">FRONT</button>
          <button class="cam-pill" onclick="setStudioView(this, 'rear')">REAR</button>
          <button class="cam-pill" onclick="setStudioView(this, 'top')">TOP</button>
        </div>

        <!-- Top-Left: Technical Specifications Card -->
        <div class="garage-telemetry">
          <div class="micro-label">TECHNICAL SPECIFICATION</div>
          <div class="telemetry-row">
            <span class="telemetry-key">PEAK POWER</span>
            <span class="telemetry-val" id="g-hp">502 HP @ 8,400 RPM</span>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-key">PEAK TORQUE</span>
            <span class="telemetry-val" id="g-torque">470 NM</span>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-key">KERB WEIGHT</span>
            <span class="telemetry-val" id="g-weight">1,435 KG</span>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-key">0–100 KM/H</span>
            <span class="telemetry-val" id="g-accel">3.2 S</span>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-key">MAX SPEED</span>
            <span class="telemetry-val" id="g-speed">318 KM/H</span>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-key">POWER / WEIGHT</span>
            <span class="telemetry-val" id="g-ptw">0.350 HP/KG</span>
          </div>
        </div>

        <!-- Top-Right: Action Buttons -->
        <div class="garage-action-btns">
          <button class="garage-select-btn" onclick="confirmSelectCar()">SELECT THIS CAR</button>
          <button class="garage-drive-btn" onclick="launchCarRace()">🏎️ DRIVE NOW</button>
        </div>

        <!-- Bottom: 53 Cars Horizontal Roster Strip -->
        <div class="garage-roster-strip" id="garage-roster">
          <!-- Real models rendered directly from game catalog -->
          <div class="roster-thumb active" onclick="selectCar(0)">
            <span class="thumb-make">PORSCHE</span>
            <span class="thumb-model">911 GT3 (992)</span>
            <span class="thumb-spec">502 HP · 3.2s</span>
          </div>
          <div class="roster-thumb" onclick="selectCar(1)">
            <span class="thumb-make">BMW</span>
            <span class="thumb-model">M4 Competition</span>
            <span class="thumb-spec">503 HP · 3.8s</span>
          </div>
          <div class="roster-thumb" onclick="selectCar(2)">
            <span class="thumb-make">TOYOTA</span>
            <span class="thumb-model">GR Supra RZ</span>
            <span class="thumb-spec">382 HP · 3.9s</span>
          </div>
          <div class="roster-thumb" onclick="selectCar(3)">
            <span class="thumb-make">FERRARI</span>
            <span class="thumb-model">SF90 Stradale</span>
            <span class="thumb-spec">986 HP · 2.5s</span>
          </div>
          <div class="roster-thumb" onclick="selectCar(4)">
            <span class="thumb-make">MCLAREN</span>
            <span class="thumb-model">P1 Hypercar</span>
            <span class="thumb-spec">903 HP · 2.8s</span>
          </div>
        </div>
      </section>`;

html = html.replace(oldGarageRegex, refinedScreenGarage);

// 4. Update CSS for Clean Layout & Desktop/Mobile Responsiveness
const refinedCss = `
    /* ==========================================================================
       REFINED LAYOUT & RESPONSIVE RULES (ZERO OVERLAP, ZERO CLIPPING)
       ========================================================================== */

    /* Sub-screen Top Bar Elements */
    .rk-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 4px;
      color: #ffffff;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.15s ease;
    }

    .rk-back-btn:hover, .rk-back-btn:active {
      background: rgba(225, 6, 80, 0.35);
      border-color: #ff0055;
      color: #ffffff;
    }

    .rk-back-arrow {
      font-size: 9px;
      color: #ff0055;
    }

    .rk-subscreen-title {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    /* Screen 2: Modes Layout (Full-width, zero gap) */
    .modes-content {
      position: absolute;
      inset: 54px max(16px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 0;
    }

    .modes-carousel {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      padding: 4px 2px 10px 2px;
      flex: 1;
      align-items: center;
    }

    .modes-action-bar {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
    }

    /* Screen 3: Garage Layout (Full-width, clean panels) */
    .garage-telemetry {
      position: absolute;
      left: max(16px, env(safe-area-inset-left));
      top: 56px;
      width: 220px;
      background: rgba(14, 17, 24, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 10px 14px;
      backdrop-filter: blur(14px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
      z-index: 10;
    }

    .camera-bar {
      position: absolute;
      top: 56px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 4px;
      background: rgba(14, 17, 24, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 3px;
      backdrop-filter: blur(12px);
      z-index: 10;
    }

    .garage-action-btns {
      position: absolute;
      right: max(16px, env(safe-area-inset-right));
      top: 56px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .garage-roster-strip {
      position: absolute;
      left: max(16px, env(safe-area-inset-left));
      right: max(16px, env(safe-area-inset-right));
      bottom: max(10px, env(safe-area-inset-bottom));
      height: 64px;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: thin;
      padding: 4px 2px;
      z-index: 10;
    }

    .car-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(14, 17, 24, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      backdrop-filter: blur(8px);
      z-index: 15;
      transition: all 0.15s ease;
    }
    .arrow-prev { left: max(16px, env(safe-area-inset-left)); }
    .arrow-next { right: max(16px, env(safe-area-inset-right)); }

    /* Screen 4: Customize Panel Layout */
    .customize-panel {
      position: absolute;
      right: max(16px, env(safe-area-inset-right));
      top: 56px;
      bottom: max(14px, env(safe-area-inset-bottom));
      width: 280px;
      max-height: calc(100% - 70px);
      background: rgba(14, 17, 24, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      padding: 12px 14px;
      backdrop-filter: blur(14px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 10;
    }

    /* Screen 5: Settings Content */
    .settings-content {
      position: absolute;
      inset: 56px max(16px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      overflow-y: auto;
      scrollbar-width: thin;
      padding-bottom: 20px;
    }

    /* Responsive Adaptation: Mobile Landscape vs Desktop */
    @media (max-width: 960px) {
      .rk-cmd-sub { display: none !important; }
      .rk-cmd-title { font-size: 8.5px !important; }
      .rk-cmd-btn { gap: 3px !important; padding: 0 3px !important; }
      .rk-race-cta { min-width: 130px !important; }
      .rk-race-title { font-size: 17px !important; }
      .rk-left-stack { width: 135px !important; top: 50px !important; }
      .rk-card-hero { height: 54px !important; }
      .rk-card-mini { height: 38px !important; }
      .rk-card-bp { height: 40px !important; }
      .rk-right-rail { top: 50px !important; gap: 5px !important; }
      .rk-rail-btn { width: 34px !important; height: 34px !important; }
      .studio-car-img { width: 460px !important; max-width: 75vw !important; bottom: 11% !important; }
      .garage-telemetry { width: 190px !important; padding: 8px 10px !important; }
      .telemetry-row { padding: 3px 0 !important; }
      .telemetry-key { font-size: 8.5px !important; }
      .telemetry-val { font-size: 10.5px !important; }
    }

    @media (min-width: 961px) {
      .rk-topbar { height: 58px !important; padding: 0 36px !important; }
      .rk-bottom-bar { max-width: 1280px !important; margin: 0 auto !important; bottom: 20px !important; height: 60px !important; }
      .rk-left-stack { width: 200px !important; top: 70px !important; left: 36px !important; gap: 8px !important; }
      .rk-card-hero { height: 86px !important; }
      .rk-card-mini { height: 56px !important; }
      .rk-card-bp { height: 62px !important; }
      .rk-right-rail { top: 70px !important; right: 36px !important; gap: 10px !important; }
      .rk-rail-btn { width: 48px !important; height: 48px !important; }
      .studio-car-img { width: 660px !important; max-width: 62vw !important; bottom: 12% !important; }
      .garage-telemetry { width: 260px !important; top: 70px !important; left: 36px !important; padding: 14px 18px !important; }
      .garage-action-btns { top: 70px !important; right: 36px !important; }
      .camera-bar { top: 70px !important; }
      .garage-roster-strip { left: 36px !important; right: 36px !important; bottom: 20px !important; height: 72px !important; }
      .customize-panel { top: 70px !important; right: 36px !important; width: 320px !important; }
      .modes-content { inset: 70px 36px 20px 36px !important; }
      .settings-content { inset: 70px 36px 20px 36px !important; }
    }
`;

html = html.replace('</style>', refinedCss + '\n  </style>');

// 5. Update navTo script logic to update topbar subscreen headers
const oldNavToRegex = /function navTo\(screenId\) \{[\s\S]*?if \(stage\) \{[\s\S]*?\}[\s\S]*?\}/;

const refinedNavTo = `function navTo(screenId) {
      currentScreen = screenId;
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const scr = document.getElementById('screen-' + screenId);
      if (scr) scr.classList.add('active');

      const stage = document.getElementById('stage');
      if (stage) {
        stage.style.display = (screenId === 'hud' || screenId === 'settings') ? 'none' : 'flex';
      }

      // Update topbar header between showroom and subscreen
      const showroomLeft = document.getElementById('top-showroom-left');
      const showroomCenter = document.getElementById('top-showroom-center');
      const subscreenLeft = document.getElementById('top-subscreen-left');
      const subscreenTitle = document.getElementById('rk-subscreen-title');

      const titles = {
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
    }`;

html = html.replace(oldNavToRegex, refinedNavTo);

fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Successfully refined mockup_realistic.html with clean non-overlapping layout!');
