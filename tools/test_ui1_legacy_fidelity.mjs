import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 8097;
const CDP_PORT = 9484;
const REDLINE_DIR = path.resolve('C:/Users/ASSDi/Desktop/car/redline');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
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

async function testUI1() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-ui1-fidelity-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('Testing UI1 legacy fidelity (no ?ui=2 query param)...');

  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--no-sandbox",
    "--window-size=1366,768",
    `http://127.0.0.1:${PORT}/index.html?ui=1&dev=1`
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

  if (!pageTab) throw new Error('Could not connect to CDP');

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

  // Wait for boot
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
  await new Promise(r => setTimeout(r, 1000));

  // Check 1: UI2 is completely absent
  const isUI2Active = await evalJs(`document.documentElement.classList.contains('ui2-active')`);
  const ui2Root = await evalJs(`!!document.getElementById('ui2-root')`);
  console.log(`1. UI2 Isolation: isUI2Active=${isUI2Active}, ui2Root=${ui2Root}`);

  // Check 2: Global Nav is present
  const gnav = await evalJs(`!!document.getElementById('gnav')`);
  console.log(`2. Global Nav (#gnav) present: ${gnav}`);

  // Check 3: Navigate to Garage (#/garage)
  await evalJs(`window.location.hash = '#/garage'`);
  await new Promise(r => setTimeout(r, 1200));

  const atelierCheck = await evalJs(`
    (function() {
      var scr = document.getElementById('screen-atelier');
      var isHidden = scr ? scr.hasAttribute('hidden') : true;
      var stage = document.getElementById('stage');
      var canvas = stage ? stage.querySelector('canvas') : null;
      var sidenav = document.getElementById('sidenav');
      var perfStrip = document.getElementById('perf-strip');
      return {
        screenAtelierVisible: !isHidden,
        stagePresent: !!stage,
        canvasPresent: !!canvas,
        sidenavPresent: !!sidenav,
        perfStripPresent: !!perfStrip
      };
    })()
  `);

  console.log('3. Legacy Atelier / Garage screen on UI1:');
  console.log(`   screen-atelier visible: ${atelierCheck.screenAtelierVisible}`);
  console.log(`   3D canvas present: ${atelierCheck.canvasPresent}`);
  console.log(`   sidenav present: ${atelierCheck.sidenavPresent}`);
  console.log(`   perfStrip present: ${atelierCheck.perfStripPresent}`);

  // Capture screenshot of UI1
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(REDLINE_DIR, 'docs', 'ui1_legacy_verified.png');
  fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
  console.log(`4. Saved UI1 legacy verification screenshot: ${outPath}`);

  console.log(`5. Console errors on UI1: ${consoleErrors.length}`);

  chromeProc.kill();
  server.close();
}

testUI1().catch(err => {
  console.error('UI1 test failed:', err);
  process.exit(1);
});
