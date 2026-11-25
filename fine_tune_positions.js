const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const mockupPath = path.join(ROOT, 'mockup_realistic.html');
let html = fs.readFileSync(mockupPath, 'utf8');

// Update Left Stack CSS: top: 48px
html = html.replace(/\.rk-left-stack\s*\{[\s\S]*?pointer-events:\s*auto;\s*\}/, `.rk-left-stack {
      position: absolute;
      left: 0;
      top: 48px;
      width: 314px;
      display: flex;
      flex-direction: column;
      z-index: 25;
      pointer-events: auto;
    }`);

// Update Bottom Bar CSS: height: 70px
html = html.replace(/\.rk-bottom-bar\s*\{[\s\S]*?pointer-events:\s*auto;\s*\}/, `.rk-bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 30;
      padding: 0 max(10px, env(safe-area-inset-right)) 0 max(10px, env(safe-area-inset-left));
      background: linear-gradient(0deg, #07080a 0%, #07080a 82%, rgba(7, 8, 10, 0) 100%);
      pointer-events: auto;
    }`);

// Update Bottom Bar Quadrant Frame & Buttons: height: 56px
html = html.replace(/\.rk-cmd-quad-frame\s*\{[\s\S]*?height:\s*\d+px;\s*\}/, `.rk-cmd-quad-frame {
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
      height: 56px;
    }`);

html = html.replace(/\.rk-store-btn\s*\{[\s\S]*?height:\s*\d+px;\s*transition:/, `.rk-store-btn {
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
      height: 56px;
      transition:`);

html = html.replace(/\.rk-race-cta\s*\{[\s\S]*?height:\s*\d+px;\s*transition:/, `.rk-race-cta {
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
      height: 56px;
      transition:`);

fs.writeFileSync(mockupPath, html, 'utf8');
console.log('Fine-tuned positions applied!');
