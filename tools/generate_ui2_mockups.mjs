import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 8089;
const CDP_PORT = 9475;
const REDLINE_DIR = path.resolve('C:/Users/ASSDi/Desktop/car/redline');
const MOCKUPS_DIR = path.join(REDLINE_DIR, 'docs', 'mockups');
fs.mkdirSync(MOCKUPS_DIR, { recursive: true });

// Minimal local static server to serve redline files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(REDLINE_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
    return;
  }
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    res.writeHead(403);
    res.end('Directory listing forbidden');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1');

async function run() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-mockup-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-extensions",
    "--window-size=844,390",
    `http://127.0.0.1:${PORT}/index.html?dev=1`
  ], { stdio: 'ignore' });

  let pageTab = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const tabs = await res.json();
        pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
        if (pageTab) break;
      }
    } catch (e) {}
  }

  if (!pageTab || !pageTab.webSocketDebuggerUrl) {
    chromeProc.kill();
    server.close();
    throw new Error('Failed to find page tab on CDP');
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const id = msgId++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise(resolve => ws.onopen = resolve);
  await send('Page.enable');
  await send('Runtime.enable');

  const evalJs = async (expr, awaitPromise = false) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: awaitPromise });
    return res && res.result ? res.result.value : null;
  };

  console.log('Waiting for boot...');
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const booted = await evalJs(`!document.getElementById('cb-boot') || document.getElementById('cb-boot').classList.contains('is-done') || !document.getElementById('cb-boot').isConnected`);
    if (booted) break;
  }
  await new Promise(r => setTimeout(r, 1500));

  // Dismiss start screen if present
  await evalJs(`
    (function() {
      var title = document.querySelector('.gh-title');
      if (title) title.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));

  // Switch to garage route to ensure 3D turntable is mounted and running
  await evalJs(`window.location.hash = '#/garage';`);
  await new Promise(r => setTimeout(r, 2000));

  // Inject UI2 Mockup Overlay
  console.log('Injecting UI2 Forza / Gran Turismo Overlay...');
  await evalJs(`
    (function() {
      // Remove any existing mockup overlay
      var old = document.getElementById('ui2-mockup-root');
      if (old) old.remove();

      // Hide old UI elements so only live WebGL canvas + UI2 are visible
      var hideOldStyle = document.createElement('style');
      hideOldStyle.textContent = \`
        #cb-showroom-ctrls, #gnav, #atelier-root, #game-hub, #rotate-overlay, #portrait-orientation-guard, .portrait-guard, .cb-showroom-ctrls {
          display: none !important;
        }
        #viewer::before {
          content: none !important;
          display: none !important;
        }
        :root {
          --studio-top: #16171c !important;
          --studio-mid: #0f1013 !important;
          --studio-floor: #0a0a0c !important;
          --studio-spot: rgba(224, 65, 47, .15) !important;
          --studio-spot-2: rgba(106, 166, 216, .08) !important;
          --studio-grid: rgba(255, 255, 255, .06) !important;
        }
        body, html {
          background: #090a0f !important;
          overflow: hidden !important;
        }
        #stage, #viewer {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 1 !important;
          pointer-events: auto !important;
        }
        #stage canvas, #viewer canvas, .cb-s3d-canvas {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: auto !important;
        }
      \`;
      document.head.appendChild(hideOldStyle);

      var root = document.createElement('div');
      root.id = 'ui2-mockup-root';
      root.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:auto;font-family:Inter,system-ui,sans-serif;color:#f8fafc;display:flex;flex-direction:column;overflow:hidden;';

      // Load fonts & base CSS
      var style = document.createElement('style');
      style.textContent = \`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        
        #ui2-mockup-root * { box-sizing: border-box; }
        .ui2-glass {
          background: rgba(13, 16, 23, 0.88);
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65);
        }
        .ui2-topbar {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(10, 12, 18, 0.96) 0%, rgba(10, 12, 18, 0.85) 100%);
        }
        .ui2-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .ui2-brand-badge {
          background: #e0412f;
          color: #fff;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 3px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .ui2-nav {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ui2-nav-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ui2-nav-btn.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .ui2-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
        }
        .ui2-cr {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.25);
          padding: 3px 10px;
          border-radius: 12px;
        }
        .ui2-main {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: space-between;
          padding: 16px 24px 12px 24px;
          pointer-events: none;
        }
        .ui2-card {
          pointer-events: auto;
          border-radius: 8px;
        }
        /* Telemetry Spec Card */
        .ui2-spec-card {
          width: 250px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ui2-pi-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e0412f;
          color: #fff;
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 3px;
          align-self: flex-start;
          letter-spacing: 0.06em;
        }
        .ui2-car-name {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: 0.02em;
        }
        .ui2-car-class {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .ui2-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 4px;
        }
        .ui2-stat-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 8px;
          border-radius: 4px;
        }
        .ui2-stat-label {
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ui2-stat-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
        }
        /* Right Action Area */
        .ui2-action-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;
          gap: 10px;
          pointer-events: auto;
        }
        .ui2-race-btn {
          background: linear-gradient(135deg, #e0412f 0%, #b91c1c 100%);
          color: #fff;
          border: 0;
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.1em;
          padding: 12px 28px;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(224, 65, 47, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ui2-sec-btn {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        /* Bottom Swipeable Car Selector */
        .ui2-car-strip-container {
          height: 80px;
          padding: 8px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(10, 12, 18, 0.94);
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
          pointer-events: auto;
        }
        .ui2-thumb-card {
          flex: 0 0 140px;
          height: 62px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          position: relative;
        }
        .ui2-thumb-card.active {
          border-color: #e0412f;
          background: rgba(224, 65, 47, 0.08);
        }
        .ui2-thumb-card.locked {
          opacity: 0.6;
        }
        .ui2-thumb-header {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
          font-family: 'JetBrains Mono', monospace;
        }
        .ui2-thumb-title {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ui2-lock-tag {
          color: #ef4444;
          font-size: 9px;
          font-weight: 700;
        }

        /* Responsive Portrait Styles (360x800) */
        @media (max-width: 600px) {
          .ui2-topbar {
            height: 44px;
            padding: 0 12px;
          }
          .ui2-brand span:not(.ui2-brand-badge) {
            font-size: 11px;
          }
          .ui2-nav {
            display: none;
          }
          .ui2-main {
            flex-direction: column;
            justify-content: flex-end;
            padding: 12px;
            gap: 10px;
          }
          .ui2-spec-card {
            width: 100%;
            padding: 12px;
          }
          .ui2-action-col {
            width: 100%;
            flex-direction: row;
            justify-content: stretch;
          }
          .ui2-race-btn {
            flex: 1;
            justify-content: center;
            padding: 10px 16px;
          }
          .ui2-sec-btn {
            padding: 10px 14px;
          }
          .ui2-car-strip-container {
            height: 72px;
            padding: 6px 12px;
          }
          .ui2-thumb-card {
            flex: 0 0 120px;
            height: 56px;
          }
        }
      \`;
      document.head.appendChild(style);

      // Home Screen HTML
      root.innerHTML = \`
        <div class="ui2-topbar">
          <div class="ui2-brand">
            <span class="ui2-brand-badge">FORZA / GT</span>
            <span>JUBAYER REDLINE</span>
            <span style="color:#64748b;font-weight:400;font-size:11px;">| AS-SUNNAH STUDIO</span>
          </div>
          <div class="ui2-nav">
            <button class="ui2-nav-btn active" id="btn-tab-home">HOME</button>
            <button class="ui2-nav-btn" id="btn-tab-modes">MODES (10)</button>
            <button class="ui2-nav-btn" id="btn-tab-garage">GARAGE / TUNE</button>
            <button class="ui2-nav-btn">MULTIPLAYER</button>
            <button class="ui2-nav-btn">SETTINGS</button>
          </div>
          <div class="ui2-profile">
            <span style="color:#94a3b8;">DRIVER: <strong style="color:#fff;">JUBAYER</strong> · LV 2</span>
            <span class="ui2-cr">CR 100,023,999</span>
          </div>
        </div>

        <div class="ui2-main" id="ui2-content">
          <!-- Dynamic View injected here -->
        </div>

        <div class="ui2-car-strip-container" id="ui2-car-strip">
          <!-- 53 Car Cards generated below -->
        </div>
      \`;

      document.body.appendChild(root);

      // Render Home View
      window.renderUI2Home = function() {
        document.getElementById('ui2-content').innerHTML = \`
          <div class="ui2-card ui2-glass ui2-spec-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="ui2-pi-pill">S1 885</span>
              <span style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono'">TURNTABLE 3D</span>
            </div>
            <div>
              <div class="ui2-car-name">PORSCHE 911 GT3 RS</div>
              <div class="ui2-car-class">SUPERCAR · TRACK SPEC</div>
            </div>
            <div class="ui2-stats-grid">
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">POWER</div>
                <div class="ui2-stat-val">525 HP</div>
              </div>
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">TORQUE</div>
                <div class="ui2-stat-val">465 NM</div>
              </div>
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">WEIGHT</div>
                <div class="ui2-stat-val">1,450 KG</div>
              </div>
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">TOP SPEED</div>
                <div class="ui2-stat-val">318 KM/H</div>
              </div>
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">0-100</div>
                <div class="ui2-stat-val">3.2 S</div>
              </div>
              <div class="ui2-stat-item">
                <div class="ui2-stat-label">DRIVETRAIN</div>
                <div class="ui2-stat-val">RWD · PDK</div>
              </div>
            </div>
            <div style="margin-top:auto;font-size:10px;color:#64748b;display:flex;gap:6px;align-items:center;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;"></span>
              <span>LIVE WEBGL 3D ROTATION</span>
            </div>
          </div>

          <div class="ui2-action-col">
            <button class="ui2-race-btn" onclick="window.renderUI2Modes()">
              <span>RACE NOW</span>
              <span>&rarr;</span>
            </button>
            <button class="ui2-sec-btn" onclick="window.renderUI2Garage()">TUNE & UPGRADE CAR</button>
            <button class="ui2-sec-btn">TEST DRIVE</button>
          </div>
        \`;
      };

      // Render Modes Carousel View
      window.renderUI2Modes = function() {
        var modes = [
          { id: 'race', title: 'CIRCUIT SPRINT', desc: 'Full-grid 3D circuit championship', req: 'LV 1', unlocked: true, img: 'smoke_01_race.png' },
          { id: 'drift', title: 'DRIFT BATTLES', desc: 'Tandem drift score attacks & clipping points', req: 'LV 1', unlocked: true, img: 'smoke_02_drift.png' },
          { id: 'arcade', title: 'STUNT ARCADE', desc: 'High-speed loops, corkscrews & boosts', req: 'LV 2', unlocked: true, img: 'smoke_03_arcade.png' },
          { id: 'derby', title: 'DEMOLITION DERBY', desc: 'Last car standing destruction arena', req: 'LV 3', unlocked: false, img: 'smoke_04_derby.png' },
          { id: 'drag', title: '1/4-MILE DRAG', desc: 'Pro tree launch, burnout, speed trap', req: 'LV 3', unlocked: false, img: 'smoke_05_drag.png' },
          { id: 'f1', title: 'FORMULA 1', desc: 'Open-wheel high-downforce racing', req: 'LV 4', unlocked: false, img: 'smoke_06_f1.png' },
          { id: 'timetrial', title: 'TIME TRIAL', desc: 'Solo ghost pursuit against global records', req: 'LV 1', unlocked: true, img: 'smoke_07_timetrial.png' },
          { id: 'career', title: 'CAREER MODE', desc: '5 tiers from Rookie to World Champion', req: 'LV 1', unlocked: true, img: 'smoke_08_career.png' },
          { id: 'challenges', title: 'DRIVING SCHOOL', desc: 'Precision slalom, braking & launch training', req: 'LV 2', unlocked: true, img: 'smoke_09_challenges.png' },
          { id: 'multiplayer', title: 'MULTIPLAYER', desc: 'Realtime 8-player WebRTC peer-to-peer', req: 'LV 5', unlocked: false, img: 'smoke_10_multiplayer.png' }
        ];

        var cardsHtml = modes.map(function(m) {
          return \`
            <div class="ui2-card ui2-glass" style="flex:0 0 210px;height:245px;display:flex;flex-direction:column;overflow:hidden;border:1px solid \${m.unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.25)'};position:relative;">
              <div style="height:115px;background:url('docs/smoke_screens/\${m.img}') center/cover no-repeat;position:relative;">
                <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(11,13,18,0.95) 100%);"></div>
                <div style="position:absolute;top:8px;right:8px;">
                  \${m.unlocked ? '<span style="background:#22c55e;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:2px;">UNLOCKED</span>' : '<span style="background:#dc2626;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:2px;">🔒 ' + m.req + '</span>'}
                </div>
              </div>
              <div style="padding:10px 12px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-family:'Chakra Petch',sans-serif;font-size:13px;font-weight:700;color:#fff;">\${m.title}</div>
                  <div style="font-size:10px;color:#94a3b8;line-height:1.3;margin-top:4px;">\${m.desc}</div>
                </div>
                <button class="ui2-sec-btn" style="width:100%;text-align:center;padding:6px 0;background:\${m.unlocked ? '#e0412f' : 'rgba(255,255,255,0.05)'};color:#fff;border:0;">
                  \${m.unlocked ? 'SELECT MODE' : 'LOCKED (REQUIRES ' + m.req + ')'}
                </button>
              </div>
            </div>
          \`;
        }).join('');

        document.getElementById('ui2-content').innerHTML = \`
          <div style="width:100%;display:flex;flex-direction:column;gap:10px;pointer-events:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-family:'Chakra Petch',sans-serif;font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px;">
                <span>ALL 10 GAME MODES</span>
                <span style="font-size:11px;color:#94a3b8;font-weight:500;">(CAROUSEL VIEW)</span>
              </div>
              <button class="ui2-sec-btn" onclick="window.renderUI2Home()">&larr; BACK TO SHOWROOM</button>
            </div>
            <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:6px;">
              \${cardsHtml}
            </div>
          </div>
        \`;
      };

      // Render Garage / Tuning View
      window.renderUI2Garage = function() {
        document.getElementById('ui2-content').innerHTML = \`
          <div class="ui2-card ui2-glass ui2-spec-card" style="width:260px;">
            <div style="font-family:'Chakra Petch',sans-serif;font-size:14px;font-weight:700;color:#e0412f;">TUNING CATEGORIES</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="ui2-sec-btn" style="text-align:left;background:rgba(224,65,47,0.15);border-color:#e0412f;color:#fff;">⚡ POWER & ENGINE (STAGE 3)</button>
              <button class="ui2-sec-btn" style="text-align:left;">🛑 BRAKES & TIRES (CARBON-CERAMIC)</button>
              <button class="ui2-sec-btn" style="text-align:left;">📐 SUSPENSION & STANCE (RACE COILOVERS)</button>
              <button class="ui2-sec-btn" style="text-align:left;">✈️ AERO & DOWNFORCE (ACTIVE GT WING)</button>
              <button class="ui2-sec-btn" style="text-align:left;">🪶 WEIGHT REDUCTION (-120 KG)</button>
              <button class="ui2-sec-btn" style="text-align:left;">🎨 LIVERY & WHEELS</button>
            </div>
            <div style="margin-top:auto;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;border:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:10px;color:#94a3b8;">UPGRADE DELTA</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#22c55e;font-weight:700;">+85 HP · -40 KG · +32 PI</div>
            </div>
          </div>

          <div class="ui2-action-col">
            <button class="ui2-race-btn" style="background:#22c55e;">
              <span>APPLY UPGRADES (CR 24,500)</span>
            </button>
            <button class="ui2-sec-btn" onclick="window.renderUI2Home()">&larr; BACK TO HOME</button>
          </div>
        \`;
      };

      // Populate 53-car strip
      var strip = document.getElementById('ui2-car-strip');
      var sampleCars = [
        { id: 'porsche-911', name: 'Porsche 911 GT3 RS', class: 'S1 885', req: 'LV 1', active: true },
        { id: 'ferrari-f8', name: 'Ferrari F8 Tributo', class: 'S2 940', req: 'LV 4', locked: true },
        { id: 'mclaren-720s', name: 'McLaren 720S', class: 'S2 925', req: 'LV 4', locked: true },
        { id: 'nissan-gtr', name: 'Nissan GT-R Nismo', class: 'S1 860', req: 'LV 2', locked: false },
        { id: 'toyota-supra', name: 'Toyota GR Supra', class: 'A 740', req: 'LV 1', locked: false },
        { id: 'mazda-rx7', name: 'Mazda RX-7 FD3S', class: 'A 715', req: 'LV 1', locked: false },
        { id: 'bmw-m3', name: 'BMW M3 Competition', class: 'A 780', req: 'LV 2', locked: false },
        { id: 'audi-r8', name: 'Audi R8 V10 Plus', class: 'S1 870', req: 'LV 3', locked: true },
        { id: 'corvette-z06', name: 'Chevrolet Corvette Z06', class: 'S1 865', req: 'LV 3', locked: true },
        { id: 'dodge-viper', name: 'Dodge Viper ACR', class: 'S1 890', req: 'LV 3', locked: true },
        { id: 'ford-gt', name: 'Ford GT', class: 'S2 915', req: 'LV 5', locked: true },
        { id: 'bugatti-chiron', name: 'Bugatti Chiron', class: 'X 999', req: 'LV 7', locked: true }
      ];

      strip.innerHTML = sampleCars.map(function(c) {
        return \`
          <div class="ui2-thumb-card \${c.active ? 'active' : ''} \${c.locked ? 'locked' : ''}">
            <div class="ui2-thumb-header">
              <span>\${c.class}</span>
              \${c.locked ? '<span class="ui2-lock-tag">🔒 ' + c.req + '</span>' : '<span style="color:#22c55e">READY</span>'}
            </div>
            <div class="ui2-thumb-title">\${c.name}</div>
          </div>
        \`;
      }).join('');

      // Wire Tab Clicks
      document.getElementById('btn-tab-home').onclick = function() {
        document.querySelectorAll('.ui2-nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        window.renderUI2Home();
      };
      document.getElementById('btn-tab-modes').onclick = function() {
        document.querySelectorAll('.ui2-nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        window.renderUI2Modes();
      };
      document.getElementById('btn-tab-garage').onclick = function() {
        document.querySelectorAll('.ui2-nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        window.renderUI2Garage();
      };

      // Initial View
      window.renderUI2Home();
    })()
  `);

  await new Promise(r => setTimeout(r, 1200));

  // Helper to take screenshot
  const capture = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(MOCKUPS_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  };

  // 1. Home Landscape
  console.log('Capturing 01_ui2_home_landscape.png...');
  await evalJs(`window.renderUI2Home()`);
  await new Promise(r => setTimeout(r, 800));
  await capture('01_ui2_home_landscape.png');

  // 2. Modes Landscape
  console.log('Capturing 02_ui2_modes_landscape.png...');
  await evalJs(`window.renderUI2Modes()`);
  await new Promise(r => setTimeout(r, 800));
  await capture('02_ui2_modes_landscape.png');

  // 3. Garage Landscape
  console.log('Capturing 03_ui2_garage_landscape.png...');
  await evalJs(`window.renderUI2Garage()`);
  await new Promise(r => setTimeout(r, 800));
  await capture('03_ui2_garage_landscape.png');

  // 4. Portrait 360x800
  console.log('Setting viewport to 360x800 for portrait mockup...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 800,
    deviceScaleFactor: 2,
    mobile: true
  });
  await evalJs(`
    var ro = document.getElementById('rotate-overlay');
    if (ro) ro.style.setProperty('display', 'none', 'important');
    window.renderUI2Home();
  `);
  await new Promise(r => setTimeout(r, 800));
  await capture('04_ui2_home_portrait.png');

  console.log('\nAll mockups captured successfully!');
  chromeProc.kill();
  server.close();
}

run().catch(err => {
  console.error('Failed to generate mockups:', err);
  process.exit(1);
});
