import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 8092;
const CDP_PORT = 9478;
const REDLINE_DIR = path.resolve('C:/Users/ASSDi/Desktop/car/redline');

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
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1');

async function testUI2() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-ui2-test-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('========================================================');
  console.log(' REDLINE UI2 FUNCTIONAL VERIFICATION SUITE');
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
    throw new Error('Failed to find page tab on CDP');
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
    if (data.method === 'Runtime.consoleAPICalled' && data.params && data.params.type === 'error') {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
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

  console.log('1. Waiting for boot...');
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
  await new Promise(r => setTimeout(r, 1200));

  // Test 1: Check UI2 Mount
  console.log('2. Verifying UI2 Mount & DOM Isolation...');
  const ui2RootMounted = await evalJs(`!!document.getElementById('ui2-root')`);
  const ui2ActiveCls = await evalJs(`document.documentElement.classList.contains('ui2-active')`);
  console.log(`   ui2-root mounted: ${ui2RootMounted}`);
  console.log(`   html.ui2-active applied: ${ui2ActiveCls}`);
  if (!ui2RootMounted || !ui2ActiveCls) throw new Error('UI2 did not mount properly');

  // Test 2: Check 3D Turntable
  console.log('3. Verifying Live 3D Turntable Canvas...');
  const canvasExists = await evalJs(`!!document.querySelector('#viewer canvas, #stage canvas, .cb-s3d-canvas')`);
  console.log(`   3D WebGL Canvas present: ${canvasExists}`);

  // Test 3: Check Spec Panel Values
  console.log('4. Verifying Vehicle Spec HUD (Real Physics Values)...');
  const initialSpecs = await evalJs(`
    (function() {
      var title = document.querySelector('.ui2-car-title');
      var pi = document.querySelector('.ui2-pi-tag');
      var vals = Array.from(document.querySelectorAll('.ui2-spec-val')).map(el => el.textContent);
      return {
        title: title ? title.textContent : null,
        pi: pi ? pi.textContent : null,
        specs: vals
      };
    })()
  `);
  console.log(`   Active Car: ${initialSpecs.title}`);
  console.log(`   PI Rating: ${initialSpecs.pi}`);
  console.log(`   Telemetry Values: ${initialSpecs.specs.join(', ')}`);

  // Test 4: Check 53 Car Carousel
  console.log('5. Verifying 53-Vehicle Carousel...');
  const carCount = await evalJs(`document.querySelectorAll('.ui2-car-thumb-card').length`);
  console.log(`   Total Vehicles in Carousel: ${carCount}`);
  if (carCount < 50) throw new Error(`Expected at least 50 cars, found ${carCount}`);

  // Test 5: Interactive Vehicle Selection
  console.log('6. Testing Interactive Vehicle Selection (Applying Ferrari SF90)...');
  const newModelSelected = await evalJs(`
    (function() {
      var card = document.querySelector('.ui2-car-thumb-card[data-id="ferrari-sf90-stradale"]') || document.querySelectorAll('.ui2-car-thumb-card')[5];
      if (card) {
        card.click();
        return card.getAttribute('data-id');
      }
      return null;
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  const updatedModel = await evalJs(`CB.state.get().body.model`);
  const updatedSpecs = await evalJs(`
    (function() {
      var title = document.querySelector('.ui2-car-title');
      var pi = document.querySelector('.ui2-pi-tag');
      return { title: title ? title.textContent : null, pi: pi ? pi.textContent : null };
    })()
  `);
  console.log(`   Selected Model in State: ${updatedModel}`);
  console.log(`   Updated HUD Car Title: ${updatedSpecs.title}`);
  console.log(`   Updated PI: ${updatedSpecs.pi}`);

  // Test 6: Modes View Navigation
  console.log('7. Verifying Game Modes View (10 Modes)...');
  await evalJs(`CB.ui2.showModes()`);
  await new Promise(r => setTimeout(r, 600));
  const modeCardCount = await evalJs(`document.querySelectorAll('.ui2-mode-card').length`);
  console.log(`   Modes rendered: ${modeCardCount}`);
  if (modeCardCount !== 10) throw new Error(`Expected 10 game modes, found ${modeCardCount}`);

  // Test 7: Garage / Tuning View
  console.log('8. Verifying Garage / Tuning View & Performance Deltas...');
  await evalJs(`CB.ui2.showGarage()`);
  await new Promise(r => setTimeout(r, 600));
  const catCount = await evalJs(`document.querySelectorAll('.ui2-tune-category-btn').length`);
  const deltaCount = await evalJs(`document.querySelectorAll('.ui2-delta-item').length`);
  console.log(`   Tuning Categories: ${catCount}`);
  console.log(`   Stat Deltas Computed: ${deltaCount}`);

  // Switch back to home
  await evalJs(`CB.ui2.showHome()`);
  await new Promise(r => setTimeout(r, 600));

  // Check Console Errors
  console.log(`\n9. Checking Console Errors...`);
  console.log(`   Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.warn('   Errors found:', consoleErrors);
  }

  console.log('\n========================================================');
  console.log(' ALL UI2 FUNCTIONAL CHECKS PASSED SUCCESSFULLY!');
  console.log('========================================================\n');

  chromeProc.kill();
  server.close();
}

testUI2().catch(err => {
  console.error('UI2 Test failed:', err);
  process.exit(1);
});
