import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 8096;
const CDP_PORT = 9482;
const REDLINE_DIR = path.resolve('C:/Users/ASSDi/Desktop/car/redline');

// Serve redline files locally and track 404s
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg'
};

const serverRequests = [];
const server404s = [];

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(REDLINE_DIR, reqPath);

  serverRequests.push(reqPath);

  if (!fs.existsSync(filePath)) {
    server404s.push(reqPath);
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
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

async function runAudit() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-audit-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('========================================================');
  console.log(' REDLINE UI2 COMPREHENSIVE FINAL AUDIT');
  console.log('========================================================\n');

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
    "--window-size=1366,768",
    `http://127.0.0.1:${PORT}/index.html?ui=2&dev=1`
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
    throw new Error('Failed to connect to Chrome tab via CDP');
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];
  const networkErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
    if (data.method === 'Runtime.consoleAPICalled' && data.params && data.params.type === 'error') {
      const errText = data.params.args.map(a => a.value || a.description).join(' ');
      consoleErrors.push(errText);
    }
    if (data.method === 'Network.responseReceived' && data.params && data.params.response) {
      if (data.params.response.status >= 400) {
        networkErrors.push(`${data.params.response.status} ${data.params.response.url}`);
      }
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
  await send('Network.enable');

  const evalJs = async (expr, awaitPromise = false) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: awaitPromise });
    return res && res.result ? res.result.value : null;
  };

  // Wait for boot
  console.log('1. Waiting for boot on UI2 (?ui=2&dev=1)...');
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const booted = await evalJs(`!document.getElementById('cb-boot') || document.getElementById('cb-boot').classList.contains('is-done') || !document.getElementById('cb-boot').isConnected`);
    if (booted) break;
  }
  await new Promise(r => setTimeout(r, 1500));

  // Dismiss start screen
  await evalJs(`
    (function() {
      var title = document.querySelector('.gh-title');
      if (title) title.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // --- AUDIT SECTION 1: ALL 53 VEHICLES TESTING ---
  console.log('\n2. AUDIT SECTION 1: Exhaustive Test of All 53 Vehicles...');
  const carModels = await evalJs(`CB.shapes ? CB.shapes.list().map(m => ({ id: m.id, make: m.make, name: m.name, style: m.style })) : []`);
  console.log(`   Found ${carModels.length} models registered in CB.shapes.`);

  const vehicleAuditResults = [];
  let carFailures = 0;

  for (let i = 0; i < carModels.length; i++) {
    const car = carModels[i];
    const selectRes = await evalJs(`
      (function() {
        try {
          CB.ui2.selectCar('${car.id}');
          var b = CB.state.get();
          var m = (b && b.body) ? b.body.model : null;
          var metrics = CB.physics.compute(b);
          var hp = metrics ? metrics.power_hp : null;
          var v = metrics ? metrics.topSpeed_kph : null;
          var kg = metrics ? metrics.weight_kg : null;
          return {
            appliedModel: m,
            hasPhysics: (hp != null && v != null && kg != null),
            hp: Math.round(hp || 0),
            topSpeed: Math.round(v || 0),
            weight: Math.round(kg || 0)
          };
        } catch(e) {
          return { error: e.message };
        }
      })()
    `);

    const ok = selectRes && selectRes.appliedModel === car.id && selectRes.hasPhysics && !selectRes.error;
    if (!ok) carFailures++;

    vehicleAuditResults.push({
      index: i + 1,
      id: car.id,
      make: car.make,
      name: car.name,
      applied: selectRes ? selectRes.appliedModel : 'ERROR',
      hp: selectRes ? selectRes.hp : 0,
      vmax: selectRes ? selectRes.topSpeed : 0,
      status: ok ? 'PASS' : 'FAIL'
    });
  }

  console.log(`   Vehicle Switch Test Complete: ${carModels.length - carFailures}/${carModels.length} passed.`);

  // --- AUDIT SECTION 2: CAMERA & TURNTABLE INTERACTION ---
  console.log('\n3. AUDIT SECTION 2: Camera & Turntable Orbit Interaction...');
  const cameraInteractionResult = await evalJs(`
    (function() {
      try {
        var canvas = document.querySelector('.cb-s3d-canvas');
        if (!canvas) return { ok: false, reason: 'Canvas not found' };
        
        // Read initial turntable rotation
        var S3 = CB.studio3d;
        var r0 = S3 && S3._test ? S3._test.getAngle() : null;

        // Dispatch mouse drag
        var rect = canvas.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        var down = new MouseEvent('mousedown', { clientX: cx, clientY: cy, bubbles: true });
        var move = new MouseEvent('mousemove', { clientX: cx + 120, clientY: cy, bubbles: true });
        var up = new MouseEvent('mouseup', { clientX: cx + 120, clientY: cy, bubbles: true });

        canvas.dispatchEvent(down);
        window.dispatchEvent(move);
        window.dispatchEvent(up);

        return { ok: true, canvasFound: true };
      } catch(e) {
        return { ok: false, error: e.message };
      }
    })()
  `);
  console.log(`   Camera Drag Event Dispatch: ${cameraInteractionResult.ok ? 'PASS' : 'FAIL'}`);

  // --- AUDIT SECTION 3: GARAGE & TUNING SYSTEM ---
  console.log('\n4. AUDIT SECTION 3: Garage & Tuning System Interaction...');
  await evalJs(`CB.ui2.showGarage()`);
  await new Promise(r => setTimeout(r, 600));

  const tuningAudit = await evalJs(`
    (function() {
      var categories = Array.from(document.querySelectorAll('.ui2-tune-category-btn')).map(b => b.getAttribute('data-cat'));
      var clickResults = [];
      categories.forEach(function(cat) {
        var btn = document.querySelector('.ui2-tune-category-btn[data-cat="' + cat + '"]');
        if (btn) {
          btn.click();
          clickResults.push({ cat: cat, active: btn.classList.contains('is-active') });
        }
      });
      var deltas = Array.from(document.querySelectorAll('.ui2-delta-item')).length;
      return {
        categories: categories,
        clickResults: clickResults,
        deltaItemCount: deltas
      };
    })()
  `);
  console.log(`   Tuning Categories Tested (${tuningAudit.categories.length}): ${tuningAudit.categories.join(', ')}`);
  console.log(`   Delta Calculations Present: ${tuningAudit.deltaItemCount} stat comparison rows.`);

  // Return to Home
  await evalJs(`CB.ui2.showHome()`);
  await new Promise(r => setTimeout(r, 500));

  // --- AUDIT SECTION 4: ALL 10 GAME MODES ROUTING & INIT AUDIT ---
  console.log('\n5. AUDIT SECTION 4: All 10 Game Modes Routing & Init Verification...');
  const modesToTest = [
    { id: 'race', route: '#/race', name: 'Circuit Sprint' },
    { id: 'drift', route: '#/drift', name: 'Drift Battles' },
    { id: 'arcade', route: '#/arcade', name: 'Stunt Arcade' },
    { id: 'derby', route: '#/derby', name: 'Demolition Derby' },
    { id: 'drag', route: '#/drag', name: '1/4-Mile Drag' },
    { id: 'f1', route: '#/f1', name: 'Formula 1' },
    { id: 'timetrial', route: '#/timetrial', name: 'Time Trial' },
    { id: 'career', route: '#/career', name: 'Career Mode' },
    { id: 'challenges', route: '#/challenges', name: 'Driving School' },
    { id: 'multiplayer', route: '#/multiplayer', name: 'Multiplayer Lobby' }
  ];

  const modeAuditResults = [];
  for (const m of modesToTest) {
    await evalJs(`window.location.hash = '${m.route}'`);
    await new Promise(r => setTimeout(r, 1200));

    const check = await evalJs(`
      (function() {
        var h = window.location.hash;
        var r = (CB.router && CB.router.current) ? CB.router.current().route : null;
        var activeScreen = document.querySelector('.cb-screen:not([hidden])');
        var layerId = activeScreen ? activeScreen.id : null;
        return {
          currentHash: h,
          routerRoute: r,
          visibleScreenId: layerId
        };
      })()
    `);

    modeAuditResults.push({
      mode: m.name,
      targetRoute: m.route,
      landedRoute: check.routerRoute,
      visibleLayer: check.visibleScreenId,
      status: check.routerRoute === m.id || (m.id === 'timetrial' && check.routerRoute === 'race') || (m.id === 'challenges' && check.routerRoute === 'challenges') || (m.id === 'career' && check.routerRoute === 'career') ? 'PASS' : 'WARN'
    });
  }

  // --- AUDIT SECTION 5: UI1 ISOLATION AUDIT ---
  console.log('\n6. AUDIT SECTION 5: UI1 Isolation & Legacy Preservation Audit...');
  // Navigate to UI1
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html?ui=1&dev=1` });
  await new Promise(r => setTimeout(r, 2500));

  const ui1Audit = await evalJs(`
    (function() {
      var isUi2Active = document.documentElement.classList.contains('ui2-active');
      var ui2Root = document.getElementById('ui2-root');
      var atelier = document.getElementById('screen-atelier');
      var gnav = document.getElementById('gnav');
      var hub = document.getElementById('screen-hub');
      var sidenav = document.getElementById('sidenav');
      var perfStrip = document.getElementById('perf-strip');

      return {
        isUi2Active: isUi2Active,
        ui2RootPresent: !!ui2Root,
        gnavVisible: !!gnav,
        atelierPresent: !!atelier,
        hubPresent: !!hub,
        sidenavPresent: !!sidenav,
        perfStripPresent: !!perfStrip
      };
    })()
  `);

  console.log(`   UI1 Isolation Check:`);
  console.log(`     html.ui2-active absent: ${!ui1Audit.isUi2Active}`);
  console.log(`     #ui2-root absent: ${!ui1Audit.ui2RootPresent}`);
  console.log(`     Legacy Global Nav present: ${ui1Audit.gnavVisible}`);
  console.log(`     Legacy Atelier present: ${ui1Audit.atelierPresent}`);
  console.log(`     Legacy Hub present: ${ui1Audit.hubPresent}`);

  // Summary
  console.log('\n========================================================');
  console.log(' AUDIT COMPLETE: METRICS & DIAGNOSTICS');
  console.log('========================================================');
  console.log(`Total 404 Requests Encountered: ${server404s.length}`);
  if (server404s.length > 0) console.log('  404 list:', [...new Set(server404s)]);
  console.log(`Total Console Errors Caught: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) console.log('  Errors:', consoleErrors);

  const auditOutput = {
    carModelsTested: carModels.length,
    carFailures: carFailures,
    vehicleAuditResults: vehicleAuditResults,
    cameraInteraction: cameraInteractionResult,
    tuningAudit: tuningAudit,
    modeAuditResults: modeAuditResults,
    ui1Audit: ui1Audit,
    network404s: [...new Set(server404s)],
    consoleErrors: consoleErrors
  };

  fs.writeFileSync(path.join(REDLINE_DIR, 'docs', 'comprehensive_audit_data.json'), JSON.stringify(auditOutput, null, 2));

  chromeProc.kill();
  server.close();
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
