const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// Update Left Stack CSS to exact pixel-matched dimensions
const oldCssBlock = /\.rk-left-stack \{[\s\S]*?\.rk-chat-btn svg \{ width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2; \}/;

const pixelMatchedLeftStackCss = `.rk-left-stack {
      position: absolute;
      left: 0;
      top: 60px;
      width: 314px;
      display: flex;
      flex-direction: column;
      z-index: 25;
      pointer-events: auto;
    }

    .rk-event-top-row {
      display: flex;
      gap: 3px;
      width: 312px;
      height: 108px;
    }

    .rk-card-hero {
      position: relative;
      width: 228px;
      height: 108px;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: #141720;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .rk-card-hero:hover { transform: scale(1.015); border-color: #ff0055; }

    .rk-mini-col {
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: 80px;
      height: 108px;
    }

    .rk-card-mini {
      position: relative;
      width: 80px;
      height: 52px;
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
      width: 228px;
      height: 76px;
      margin-top: 4px;
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
      margin-top: 5px;
      margin-left: 8px;
    }
    .rk-chat-btn:hover { background: rgba(255, 0, 85, 0.35); border-color: #ff0055; color: #fff; }
    .rk-chat-btn svg { width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2; }`;

html = html.replace(oldCssBlock, pixelMatchedLeftStackCss);
fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Left stack CSS updated with exact pixel-matching!');
