const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// 1. Ensure stage uses the reference workshop image
const stageRegex = /<div class="studio-stage" id="stage">[\s\S]*?<\/div>/;
const newStage = `<div class="studio-stage" id="stage">
      <img src="assets/realistic/workshop_reference.jpg" class="workshop-backdrop" id="studio-backdrop" alt="Showroom Workshop">
    </div>`;
html = html.replace(stageRegex, newStage);

// 2. Refined Left Event Stack HTML (Grid with Hypercar on left, BMW + Drift on right, Battle Pass below, Chat below)
const leftStackRegex = /<aside class="rk-left-stack">[\s\S]*?<\/aside>/;
const newLeftStack = `<aside class="rk-left-stack">
        <!-- Top Row: Hero Event (Left) + 2 Stacked Mini Events (Right) -->
        <div class="rk-event-top-row">
          <div class="rk-card-hero" onclick="navTo('modes')" title="Featured Hypercar Event">
            <img src="assets/realistic/banner_event_hypercar.jpg" alt="Featured Event">
          </div>
          <div class="rk-mini-col">
            <div class="rk-card-mini" onclick="navTo('modes')" title="BMW M4 Challenge">
              <img src="assets/realistic/banner_event_bmw.jpg" alt="BMW Event">
            </div>
            <div class="rk-card-mini" onclick="navTo('modes')" title="Drift King Championship">
              <img src="assets/realistic/banner_event_drift.jpg" alt="Drift Event">
            </div>
          </div>
        </div>

        <!-- Middle Row: Battle Pass Card -->
        <div class="rk-card-bp" onclick="openRewardsModal()" title="Season 3 Battle Pass">
          <img src="assets/realistic/banner_battlepass.jpg" alt="Battle Pass">
        </div>

        <!-- Bottom Row: Chat Pill -->
        <button class="rk-chat-btn" onclick="openSocialModal('chat')">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Chat</span>
        </button>
      </aside>`;
html = html.replace(leftStackRegex, newLeftStack);

// 3. Right Rail HTML
const rightRailRegex = /<nav class="rk-right-rail">[\s\S]*?<\/nav>/;
const newRightRail = `<nav class="rk-right-rail">
        <button class="rk-rail-item" onclick="navTo('settings')" title="Settings" id="rail-settings">
          <svg viewBox="0 0 24 24" class="rk-rail-svg"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span class="rk-rail-txt">Settings</span>
        </button>
        <button class="rk-rail-item" onclick="openSocialModal('friends')" title="Friends">
          <svg viewBox="0 0 24 24" class="rk-rail-svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="rk-rail-txt">Friends</span>
        </button>
        <button class="rk-rail-item" onclick="openSocialModal('messages')" title="Messages">
          <span class="rk-rail-badge">9+</span>
          <svg viewBox="0 0 24 24" class="rk-rail-svg"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span class="rk-rail-txt">Messages</span>
        </button>
        <button class="rk-rail-item" onclick="openSocialModal('clan')" title="Clan">
          <svg viewBox="0 0 24 24" class="rk-rail-svg"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          <span class="rk-rail-txt">Clan</span>
        </button>
        <button class="rk-rail-item" onclick="openRewardsModal()" title="Rewards">
          <span class="rk-rail-badge pink">2</span>
          <svg viewBox="0 0 24 24" class="rk-rail-svg"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          <span class="rk-rail-txt">Rewards</span>
        </button>
      </nav>`;
html = html.replace(rightRailRegex, newRightRail);

// 4. Bottom Command Bar HTML (2x2 Quad Grid + Store + Race CTA)
const bottomBarRegex = /<footer class="rk-bottom-bar">[\s\S]*?<\/footer>/;
const newBottomBar = `<footer class="rk-bottom-bar">
        <!-- 2x2 Grid Segment (Slanted parallelogram container with red/pink accents) -->
        <div class="rk-cmd-quad-frame">
          <div class="rk-cmd-quad-grid">
            <!-- Row 1: Buy Car | Upgrades -->
            <button class="rk-quad-btn" onclick="navTo('garage')" id="cmd-buy-car">
              <span class="rk-quad-txt">Buy Car</span>
              <span class="rk-quad-ico">
                <svg viewBox="0 0 24 24" class="rk-icon-red"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.4-.1.6v4.5c0 .6.4 1 1 1h2m0 0a2 2 0 1 0 4 0m8 0a2 2 0 1 0 4 0" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>
              </span>
            </button>
            <button class="rk-quad-btn" onclick="navTo('customize')" id="cmd-upgrades">
              <span class="rk-quad-txt">Upgrades</span>
              <span class="rk-quad-ico">
                <svg viewBox="0 0 24 24" class="rk-icon-red"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 16V8m-4 4l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>
              </span>
            </button>
            <!-- Row 2: Customization | Tuning -->
            <button class="rk-quad-btn" onclick="navTo('customize')" id="cmd-customization">
              <span class="rk-quad-txt">Customization</span>
              <span class="rk-quad-ico">
                <svg viewBox="0 0 24 24" class="rk-icon-red"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>
              </span>
            </button>
            <button class="rk-quad-btn" onclick="navTo('customize')" id="cmd-tuning">
              <span class="rk-quad-txt">Tuning</span>
              <span class="rk-quad-ico">
                <svg viewBox="0 0 24 24" class="rk-icon-red"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>
              </span>
            </button>
          </div>
        </div>

        <!-- Store Button (Slanted Parallelogram with Tools/Hoist Icon) -->
        <button class="rk-store-btn" onclick="navTo('garage')" id="cmd-store">
          <span class="rk-store-txt">Store</span>
          <span class="rk-store-ico">
            <svg viewBox="0 0 24 24" class="rk-icon-red"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>
          </span>
        </button>

        <!-- Big Slanted High-Energy RACE CTA Button with Flag Pattern -->
        <button class="rk-race-cta" onclick="navTo('modes')" id="cta-race">
          <span class="rk-race-word">Race</span>
          <span class="rk-flag-pattern"></span>
        </button>
      </footer>`;
html = html.replace(bottomBarRegex, newBottomBar);

// 5. CSS Update with Pixel-Matched Exact Dimensions
const exactLayoutCss = `
    /* ==========================================================================
       AUTHENTIC RACING KINGDOM EXACT PROPORTIONS & ZERO OVERLAP CSS
       ========================================================================== */
    .workshop-backdrop {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center bottom;
      pointer-events: none;
    }

    /* Top Bar: Clean black gradient covering top edge */
    .rk-topbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 max(12px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left));
      z-index: 30;
      background: linear-gradient(180deg, rgba(7, 8, 10, 0.98) 0%, rgba(7, 8, 10, 0.88) 75%, transparent 100%);
      pointer-events: auto;
    }

    /* Left Event Cards Stack: Exact Match to Reference */
    .rk-left-stack {
      position: absolute;
      left: max(8px, env(safe-area-inset-left));
      top: 48px;
      width: 250px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 25;
      pointer-events: auto;
    }

    .rk-event-top-row {
      display: flex;
      gap: 3px;
      width: 100%;
      height: 68px;
    }

    .rk-card-hero {
      position: relative;
      flex: 1.8;
      height: 100%;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .rk-card-hero:hover { transform: scale(1.02); border-color: #ff0055; }

    .rk-mini-col {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 0.9;
      height: 100%;
    }

    .rk-card-mini {
      position: relative;
      width: 100%;
      flex: 1;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .rk-card-mini:hover { transform: scale(1.02); border-color: #ff0055; }

    .rk-card-bp {
      position: relative;
      width: 100%;
      height: 48px;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .rk-card-bp:hover { transform: scale(1.015); border-color: #ec4899; }

    .rk-card-hero img, .rk-card-mini img, .rk-card-bp img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      display: block;
    }

    .rk-chat-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      background: rgba(14, 16, 22, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 12px;
      color: #e5e7eb;
      font-size: 9.5px;
      font-weight: 800;
      cursor: pointer;
      width: fit-content;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      margin-top: 1px;
    }
    .rk-chat-btn:hover { background: rgba(255, 0, 85, 0.35); border-color: #ff0055; color: #fff; }
    .rk-chat-btn svg { width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2; }

    /* Right Rail Floating Icons */
    .rk-right-rail {
      position: absolute;
      right: max(8px, env(safe-area-inset-right));
      top: 50px;
      bottom: 56px;
      width: 52px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 25;
      pointer-events: auto;
    }

    .rk-rail-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1px;
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 2px;
      text-shadow: 0 2px 6px rgba(0,0,0,0.9);
      transition: transform 0.15s ease;
    }
    .rk-rail-item:hover, .rk-rail-item:active { transform: scale(1.12); filter: drop-shadow(0 0 6px rgba(255, 0, 85, 0.8)); }
    .rk-rail-svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2.2;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9));
    }
    .rk-rail-txt {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-shadow: 0 2px 4px #000;
      color: #ffffff;
    }
    .rk-rail-badge {
      position: absolute;
      top: -3px;
      right: -2px;
      background: #ff0055;
      color: #ffffff;
      font-size: 7.5px;
      font-weight: 900;
      padding: 1px 3.5px;
      border-radius: 8px;
      border: 1px solid #ffffff;
      box-shadow: 0 2px 6px rgba(255, 0, 85, 0.8);
    }
    .rk-rail-badge.pink {
      background: #ec4899;
      box-shadow: 0 2px 6px rgba(236, 72, 153, 0.8);
    }

    /* Bottom Command Bar: Full-width black gradient covering bottom edge */
    .rk-bottom-bar {
      position: absolute;
      bottom: max(6px, env(safe-area-inset-bottom));
      left: max(10px, env(safe-area-inset-left));
      right: max(10px, env(safe-area-inset-right));
      height: 52px;
      display: flex;
      align-items: stretch;
      gap: 6px;
      z-index: 30;
      pointer-events: auto;
    }

    /* 2x2 Quadrant Frame */
    .rk-cmd-quad-frame {
      position: relative;
      display: flex;
      align-items: stretch;
      background: rgba(14, 16, 22, 0.94);
      border-left: 3px solid #ff0055;
      border-right: 3px solid #ff0055;
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(12px);
      padding: 2px;
      flex: 1.5;
    }

    .rk-cmd-quad-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      width: 100%;
      height: 100%;
      gap: 1px;
      background: rgba(255, 0, 85, 0.35);
    }

    .rk-quad-btn {
      background: rgba(14, 16, 24, 0.98);
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      cursor: pointer;
      color: #ffffff;
      transition: background 0.15s ease;
    }
    .rk-quad-btn:hover, .rk-quad-btn:active {
      background: rgba(255, 0, 85, 0.35);
    }

    .rk-quad-txt {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-style: italic;
      transform: skewX(14deg);
    }

    .rk-quad-ico {
      transform: skewX(14deg);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rk-icon-red {
      width: 14px;
      height: 14px;
      stroke: #ff0055;
      fill: none;
      filter: drop-shadow(0 0 4px rgba(255, 0, 85, 0.7));
    }

    /* Store Standalone Button */
    .rk-store-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(14, 16, 22, 0.94);
      border: none;
      border-left: 3px solid #ff0055;
      border-right: 3px solid #ff0055;
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(12px);
      padding: 0 16px;
      cursor: pointer;
      color: #ffffff;
      flex: 0.8;
      transition: background 0.15s ease;
    }
    .rk-store-btn:hover, .rk-store-btn:active {
      background: rgba(255, 0, 85, 0.35);
    }
    .rk-store-txt {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-style: italic;
      transform: skewX(14deg);
      color: #ffffff;
    }
    .rk-store-ico {
      transform: skewX(14deg);
      display: flex;
      align-items: center;
    }
    .rk-store-ico svg {
      width: 18px;
      height: 18px;
      stroke: #ff0055;
      fill: none;
    }

    /* Slanted High-Energy RACE CTA Button */
    .rk-race-cta {
      position: relative;
      flex: 1.2;
      background: linear-gradient(135deg, #ff0055 0%, #d40040 100%);
      border: 1px solid rgba(255, 255, 255, 0.45);
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 0 22px rgba(255, 0, 85, 0.8);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px 0 20px;
      overflow: hidden;
      transition: all 0.15s ease;
    }
    .rk-race-cta:hover, .rk-race-cta:active {
      transform: skewX(-14deg) scale(1.02);
      box-shadow: 0 0 32px rgba(255, 0, 85, 1);
    }

    .rk-race-word {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-style: italic;
      color: #ffffff;
      transform: skewX(14deg);
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    }

    .rk-flag-pattern {
      display: inline-block;
      width: 44px;
      height: 32px;
      transform: skewX(14deg);
      background-image: 
        linear-gradient(45deg, #ffffff 25%, transparent 25%), 
        linear-gradient(-45deg, #ffffff 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #ffffff 75%), 
        linear-gradient(-45deg, transparent 75%, #ffffff 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      opacity: 0.85;
      border-radius: 2px;
    }
`;

// Replace CSS block
const marker = '/* ==========================================================================\n       AUTHENTIC RACING KINGDOM EXACT PROPORTIONS';
if (html.includes(marker)) {
  const parts = html.split(marker);
  const endPart = parts[1].indexOf('</style>');
  html = parts[0] + exactLayoutCss + '\n  ' + parts[1].slice(endPart);
} else {
  html = html.replace('</style>', exactLayoutCss + '\n  </style>');
}

fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Applied exact reference layout successfully!');
