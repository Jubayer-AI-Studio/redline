const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// 1. Stage backdrop: clean use of workshop_reference.jpg
const stageRegex = /<div class="studio-stage" id="stage">[\s\S]*?<\/div>/;
const newStage = `<div class="studio-stage" id="stage">
      <img src="assets/realistic/workshop_reference.jpg" class="workshop-backdrop" id="studio-backdrop" alt="Showroom Workshop">
    </div>`;
html = html.replace(stageRegex, newStage);

// 2. CSS with exact solid framing coverage (Zero bleed-through, zero ghosting)
const framingCss = `
    /* ==========================================================================
       PERFECT RACING KINGDOM FRAMING & ZERO BLEED-THROUGH
       ========================================================================== */
    .workshop-backdrop {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      pointer-events: none;
    }

    /* Top Bar: Solid dark automotive header */
    .rk-topbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 max(12px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left));
      z-index: 30;
      background: #07080a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
      pointer-events: auto;
    }

    /* Left Event Cards Stack */
    .rk-left-stack {
      position: absolute;
      left: 0;
      top: 52px;
      width: 314px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 25;
      padding: 4px 6px 6px max(8px, env(safe-area-inset-left));
      background: linear-gradient(90deg, #07080a 0%, #07080a 88%, rgba(7, 8, 10, 0) 100%);
      pointer-events: auto;
    }

    .rk-event-top-row {
      display: flex;
      gap: 4px;
      width: 100%;
      height: 72px;
    }

    .rk-card-hero {
      position: relative;
      flex: 2.2;
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
      gap: 4px;
      flex: 1;
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
      width: 224px;
      height: 52px;
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
      background: rgba(14, 16, 22, 0.95);
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
      right: 0;
      top: 52px;
      bottom: 64px;
      width: 66px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      z-index: 25;
      padding: 4px 0;
      background: linear-gradient(270deg, #07080a 0%, #07080a 82%, rgba(7, 8, 10, 0) 100%);
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
      width: 22px;
      height: 22px;
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

    /* Bottom Command Bar: Full-width solid dark bar covering bottom edge */
    .rk-bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 30;
      padding: 0 max(10px, env(safe-area-inset-right)) 0 max(10px, env(safe-area-inset-left));
      background: #07080a;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.8);
      pointer-events: auto;
    }

    /* 2x2 Quadrant Frame */
    .rk-cmd-quad-frame {
      position: relative;
      display: flex;
      align-items: stretch;
      background: rgba(14, 16, 22, 0.96);
      border-left: 3px solid #ff0055;
      border-right: 3px solid #ff0055;
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
      padding: 2px;
      flex: 1.5;
      height: 52px;
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
      background: rgba(14, 16, 22, 0.96);
      border: none;
      border-left: 3px solid #ff0055;
      border-right: 3px solid #ff0055;
      transform: skewX(-14deg);
      border-radius: 2px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
      padding: 0 16px;
      cursor: pointer;
      color: #ffffff;
      flex: 0.8;
      height: 52px;
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
      height: 52px;
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
  html = parts[0] + framingCss + '\n  ' + parts[1].slice(endPart);
} else {
  html = html.replace('</style>', framingCss + '\n  </style>');
}

fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Framing applied successfully!');
