const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// 1. Add CSS for Racing Kingdom Showroom
const rkCss = `
    /* ==========================================================================
       RACING KINGDOM / CSR2 SHOWROOM STYLING
       ========================================================================== */
    .studio-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 0;
      overflow: hidden;
      background: radial-gradient(circle at 50% 30%, #20242e 0%, #0d0f14 65%, #050608 100%);
    }

    .workshop-backdrop {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center bottom;
      opacity: 0.88;
      filter: contrast(1.08) brightness(0.92);
      pointer-events: none;
    }

    /* Top Bar */
    .rk-topbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 max(14px, env(safe-area-inset-right)) 0 max(14px, env(safe-area-inset-left));
      z-index: 25;
      background: linear-gradient(180deg, rgba(7, 8, 11, 0.94) 0%, rgba(7, 8, 11, 0.6) 70%, transparent 100%);
      pointer-events: auto;
    }

    .rk-top-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rk-lvl-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: rgba(18, 21, 28, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      padding: 3px 8px;
      backdrop-filter: blur(8px);
    }

    .rk-lvl-tag {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #f3f4f6;
    }

    .rk-lvl-track {
      width: 68px;
      height: 5px;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 3px;
      overflow: hidden;
    }

    .rk-lvl-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff9900 0%, #ff5500 100%);
      border-radius: 3px;
      box-shadow: 0 0 6px rgba(255, 120, 0, 0.6);
    }

    .rk-synergy-box {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(18, 21, 28, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      padding: 3px 8px;
      backdrop-filter: blur(8px);
    }

    .rk-gas-icon {
      font-size: 11px;
    }

    .rk-synergy-lbl {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #f3f4f6;
    }

    .rk-synergy-pips {
      display: flex;
      gap: 2.5px;
    }

    .rk-synergy-pips .pip {
      width: 6px;
      height: 12px;
      background: rgba(255, 255, 255, 0.16);
      transform: skewX(-14deg);
      border-radius: 1px;
    }

    .rk-synergy-pips .pip.active {
      background: linear-gradient(180deg, #ff5500 0%, #d42200 100%);
      box-shadow: 0 0 6px rgba(255, 60, 0, 0.7);
    }

    /* Top Center: Car Pill with Tier Badge */
    .rk-top-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
    }

    .rk-car-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(12, 14, 19, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 3px 6px 3px 10px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
    }

    .rk-brand-logo {
      font-size: 14px;
    }

    .rk-car-names {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .rk-make-text {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #9ca3af;
    }

    .rk-model-text {
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
      white-space: nowrap;
    }

    .rk-tier-tag {
      padding: 3px 8px;
      background: linear-gradient(135deg, #e10650 0%, #aa0033 100%);
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(225, 6, 80, 0.5);
    }

    .rk-tier-tag span {
      display: inline-block;
      transform: skewX(14deg);
    }

    /* Top Right Currencies */
    .rk-top-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rk-currency-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(16, 19, 26, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      padding: 3px 5px 3px 8px;
      backdrop-filter: blur(8px);
    }

    .rk-coin-tag {
      font-size: 8.5px;
      font-weight: 900;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.18);
      border-radius: 3px;
      padding: 1px 3px;
    }

    .rk-cash-tag {
      font-size: 10px;
      font-weight: 900;
      color: #10b981;
      background: rgba(16, 185, 129, 0.18);
      border-radius: 3px;
      padding: 1px 4px;
    }

    .rk-cur-val {
      font-size: 11.5px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: #ffffff;
    }

    .rk-plus-btn {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f59e0b;
      color: #000;
      border: none;
      border-radius: 2px;
      font-size: 11px;
      font-weight: 900;
      cursor: pointer;
    }

    .rk-cash-chip .rk-plus-btn {
      background: #10b981;
      color: #fff;
    }

    /* Left Event Cards Stack */
    .rk-left-stack {
      position: absolute;
      left: max(12px, env(safe-area-inset-left));
      top: 54px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 20;
      width: 155px;
      pointer-events: auto;
    }

    .rk-card-hero {
      position: relative;
      width: 100%;
      height: 64px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .rk-card-hero:hover, .rk-card-hero:active {
      transform: scale(1.02);
      border-color: #ff0055;
    }

    .rk-card-hero img, .rk-card-mini img, .rk-card-bp img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rk-card-badge {
      position: absolute;
      top: 3px;
      left: 5px;
      z-index: 2;
      font-size: 8.5px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      border-left: 2px solid #ff0055;
      padding-left: 4px;
    }

    .rk-card-foot {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 5px 3px 5px;
      background: linear-gradient(180deg, transparent 0%, rgba(9, 10, 14, 0.92) 100%);
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .rk-card-title {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #ffffff;
    }

    .rk-card-timer {
      font-size: 7.5px;
      font-weight: 600;
      color: #9ca3af;
    }

    .rk-mini-row {
      display: flex;
      gap: 5px;
      width: 100%;
    }

    .rk-card-mini {
      position: relative;
      flex: 1;
      height: 42px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .rk-card-mini:hover, .rk-card-mini:active {
      transform: scale(1.02);
      border-color: #ff0055;
    }

    .rk-card-bp {
      position: relative;
      width: 100%;
      height: 46px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .rk-card-bp:hover, .rk-card-bp:active {
      transform: scale(1.02);
      border-color: #a855f7;
    }

    .rk-chat-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      background: rgba(18, 21, 28, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 4px;
      color: #9ca3af;
      font-size: 9px;
      font-weight: 700;
      cursor: pointer;
      width: fit-content;
      backdrop-filter: blur(8px);
      margin-top: 1px;
    }

    .rk-chat-btn svg {
      width: 11px;
      height: 11px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    /* Right Rail (Vertical utility buttons) */
    .rk-right-rail {
      position: absolute;
      right: max(12px, env(safe-area-inset-right));
      top: 54px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      z-index: 20;
      pointer-events: auto;
    }

    .rk-rail-btn {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      background: rgba(14, 16, 22, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 5px;
      color: #9ca3af;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      transition: all 0.15s ease;
    }

    .rk-rail-btn:hover, .rk-rail-btn:active {
      background: rgba(28, 32, 44, 0.95);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.28);
    }

    .rk-rail-btn svg {
      width: 15px;
      height: 15px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .rk-rail-btn span {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .rk-rail-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #ef4444;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 900;
      padding: 1px 3.5px;
      border-radius: 8px;
      line-height: 1;
      border: 1px solid #000;
    }

    .rk-rail-badge.pink {
      background: #ec4899;
    }

    /* Bottom Command Bar */
    .rk-bottom-bar {
      position: absolute;
      bottom: max(8px, env(safe-area-inset-bottom));
      left: max(12px, env(safe-area-inset-left));
      right: max(12px, env(safe-area-inset-right));
      height: 50px;
      display: flex;
      align-items: stretch;
      gap: 8px;
      z-index: 25;
      pointer-events: auto;
    }

    .rk-cmd-group {
      display: flex;
      align-items: stretch;
      flex: 1;
      gap: 3px;
      background: rgba(12, 14, 20, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 5px;
      padding: 3px;
      backdrop-filter: blur(14px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .rk-cmd-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      border-radius: 3px;
      color: #d1d5db;
      cursor: pointer;
      padding: 0 4px;
      transition: all 0.15s ease;
    }

    .rk-cmd-btn:hover, .rk-cmd-btn:active {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .rk-cmd-icon {
      font-size: 13px;
    }

    .rk-cmd-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.15;
    }

    .rk-cmd-title {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
      white-space: nowrap;
    }

    .rk-cmd-sub {
      font-size: 7px;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.02em;
    }

    /* Slanted High-Energy RACE CTA Button */
    .rk-race-cta {
      position: relative;
      min-width: 160px;
      background: linear-gradient(135deg, #ff0055 0%, #d40040 100%);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 5px;
      transform: skewX(-14deg);
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(255, 0, 85, 0.55);
      transition: transform 0.1s ease, box-shadow 0.15s ease;
    }

    .rk-race-cta:active {
      transform: skewX(-14deg) scale(0.97);
      box-shadow: 0 2px 12px rgba(255, 0, 85, 0.4);
    }

    .rk-race-slant-wrap {
      transform: skewX(14deg);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .rk-race-title {
      font-size: 20px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .rk-checkered-flag {
      width: 32px;
      height: 20px;
      background-image: 
        linear-gradient(45deg, #ffffff 25%, transparent 25%), 
        linear-gradient(-45deg, #ffffff 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #ffffff 75%), 
        linear-gradient(-45deg, transparent 75%, #ffffff 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      opacity: 0.88;
      border-radius: 2px;
    }
`;

// Inject CSS before </style>
html = html.replace('</style>', rkCss + '\n  </style>');

// 2. Replace studio stage with workshop backdrop
const oldStudioStage = `<div class="studio-stage">
      <div class="studio-spotlight"></div>
      <div class="studio-floor-reflection"></div>
      <img src="assets/realistic/real_porsche_911_gt3_studio.png" class="studio-car-img" id="studio-car" alt="Porsche 911 GT3">
    </div>`;

const newStudioStage = `<div class="studio-stage">
      <img src="assets/realistic/workshop_reference.jpg" class="workshop-backdrop" alt="Workshop Showroom">
      <div class="studio-spotlight"></div>
      <div class="studio-floor-reflection"></div>
      <img src="assets/realistic/real_porsche_911_gt3_studio.png" class="studio-car-img" id="studio-car" alt="Porsche 911 GT3">
    </div>`;

html = html.replace(oldStudioStage, newStudioStage);

// 3. Replace header with Racing Kingdom Topbar
const oldTopBarMatch = html.match(/<header class="topbar">[\s\S]*?<\/header>/);
if (oldTopBarMatch) {
  const newTopBar = `<header class="topbar rk-topbar">
      <!-- Left: Level badge + Synergy energy -->
      <div class="rk-top-left">
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

      <!-- Center: Brand Emblem + Vehicle Name + Tier Badge -->
      <div class="rk-top-center">
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

      <!-- Right: Dual Currencies (RK Coins + Cash) -->
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

  html = html.replace(oldTopBarMatch[0], newTopBar);
}

// 4. Inject Left Stack and Right Rail and Bottom Bar into #app
const oldNavRailMatch = html.match(/<nav class="nav-rail">[\s\S]*?<\/nav>/);
if (oldNavRailMatch) {
  const newRailsAndBottom = `<!-- Left Event Cards Stack -->
    <aside class="rk-left-stack">
      <!-- Hero Event Card -->
      <div class="rk-card-hero" onclick="launchSelectedMode('race')">
        <div class="rk-card-badge">| Event</div>
        <img src="assets/cards/mode_race.webp" alt="Grand Prix Sprint">
        <div class="rk-card-foot">
          <span class="rk-card-title">Grand Prix Sprint</span>
          <span class="rk-card-timer">Dhaka GP · 2H Left</span>
        </div>
      </div>

      <!-- Stack of 2 Mini Event Cards -->
      <div class="rk-mini-row">
        <div class="rk-card-mini" onclick="launchSelectedMode('drift')">
          <div class="rk-card-badge">| Drift</div>
          <img src="assets/cards/mode_drift.webp" alt="Drift Attack">
        </div>
        <div class="rk-card-mini" onclick="launchSelectedMode('f1')">
          <div class="rk-card-badge">| F1</div>
          <img src="assets/cards/mode_f1.webp" alt="Formula 1">
        </div>
      </div>

      <!-- Battle Pass Card -->
      <div class="rk-card-bp" onclick="navTo('modes')">
        <div class="rk-card-badge">| Battle Pass</div>
        <img src="assets/cards/mode_career.webp" alt="Battle Pass">
      </div>

      <!-- Bottom Left Chat Button -->
      <button class="rk-chat-btn" onclick="openSocialModal('chat')" title="Chat Lobby">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Chat</span>
      </button>
    </aside>

    <!-- Right Rail (Vertical utility buttons) -->
    <nav class="rk-right-rail">
      <button class="rk-rail-btn" onclick="navTo('settings')" title="Settings" id="rail-settings">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span>Settings</span>
      </button>
      <button class="rk-rail-btn" onclick="openSocialModal('friends')" title="Friends">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Friends</span>
      </button>
      <button class="rk-rail-btn" onclick="openSocialModal('messages')" title="Messages">
        <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span class="rk-rail-badge">9+</span>
        <span>Messages</span>
      </button>
      <button class="rk-rail-btn" onclick="openSocialModal('clan')" title="Clan">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>Clan</span>
      </button>
      <button class="rk-rail-btn" onclick="openSocialModal('rewards')" title="Rewards">
        <svg viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        <span class="rk-rail-badge pink">2</span>
        <span>Rewards</span>
      </button>
    </nav>

    <!-- Bottom Command Bar -->
    <footer class="rk-bottom-bar">
      <div class="rk-cmd-group">
        <!-- Buy Car -->
        <button class="rk-cmd-btn" onclick="navTo('garage')" id="cmd-buy-car">
          <span class="rk-cmd-icon">🏷️</span>
          <div class="rk-cmd-text">
            <span class="rk-cmd-title">Buy Car</span>
            <span class="rk-cmd-sub">53 Vehicles</span>
          </div>
        </button>
        <!-- Customization -->
        <button class="rk-cmd-btn" onclick="navTo('customize')" id="cmd-customization">
          <span class="rk-cmd-icon">🎨</span>
          <div class="rk-cmd-text">
            <span class="rk-cmd-title">Customization</span>
            <span class="rk-cmd-sub">Paint & Decal</span>
          </div>
        </button>
        <!-- Upgrades -->
        <button class="rk-cmd-btn" onclick="navTo('customize')" id="cmd-upgrades">
          <span class="rk-cmd-icon">⬆️</span>
          <div class="rk-cmd-text">
            <span class="rk-cmd-title">Upgrades</span>
            <span class="rk-cmd-sub">Powertrain</span>
          </div>
        </button>
        <!-- Tuning -->
        <button class="rk-cmd-btn" onclick="navTo('customize')" id="cmd-tuning">
          <span class="rk-cmd-icon">⚙️</span>
          <div class="rk-cmd-text">
            <span class="rk-cmd-title">Tuning</span>
            <span class="rk-cmd-sub">Dyno & Gear</span>
          </div>
        </button>
        <!-- Store -->
        <button class="rk-cmd-btn" onclick="navTo('garage')" id="cmd-store">
          <span class="rk-cmd-icon">🛒</span>
          <div class="rk-cmd-text">
            <span class="rk-cmd-title">Store</span>
            <span class="rk-cmd-sub">Atelier</span>
          </div>
        </button>
      </div>

      <!-- Giant Slanted RACE CTA Button -->
      <button class="rk-race-cta" onclick="launchSelectedMode()" id="rk-race-btn">
        <div class="rk-race-slant-wrap">
          <span class="rk-race-title">Race</span>
          <div class="rk-checkered-flag"></div>
        </div>
      </button>
    </footer>`;

  html = html.replace(oldNavRailMatch[0], newRailsAndBottom);
}

// 5. Update selectCar in script to also update rk-make-text, rk-model-text, rk-tier-text
const carUpdateInjection = `
      const rkMake = document.getElementById('rk-make-text');
      const rkModel = document.getElementById('rk-model-text');
      const rkTier = document.getElementById('rk-tier-text');
      if (rkMake) rkMake.textContent = c.brand || 'CHEVROLET';
      if (rkModel) rkModel.textContent = c.name;
      if (rkTier) rkTier.textContent = c.tier || 'T5 1080';
`;

html = html.replace("document.getElementById('home-car-title').textContent = c.name;", "document.getElementById('home-car-title').textContent = c.name;\n" + carUpdateInjection);

// 6. Add openSocialModal helper function
const socialModalFunc = `
    function openSocialModal(type) {
      const titles = {
        chat: 'LOBBY CHAT',
        friends: 'DRIVERS & FRIENDS',
        messages: 'INBOX NOTIFICATIONS (9+)',
        clan: 'MOTORSPORT CLAN',
        rewards: 'DAILY REWARDS (2 CLAIMABLE)'
      };
      alert('[' + (titles[type] || type.toUpperCase()) + '] Live service connection active.');
    }
    function openRewardsModal() {
      openSocialModal('rewards');
    }
`;

html = html.replace("function launchSelectedMode() {", socialModalFunc + "\n    function launchSelectedMode(overrideMode) {\n      if (overrideMode) selectedMode = overrideMode;");

fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Successfully upgraded mockup_realistic.html with Racing Kingdom Showroom!');
