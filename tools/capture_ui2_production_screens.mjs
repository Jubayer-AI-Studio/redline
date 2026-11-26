import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 8094;
const CDP_PORT = 9480;
const REDLINE_DIR = path.resolve('C:/Users/ASSDi/Desktop/car/redline');
const OUT_DIR = path.join(REDLINE_DIR, 'docs', 'ui2_production');

fs.mkdirSync(OUT_DIR, { recursive: true });

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

async function captureScreens() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-ui2-prod-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('========================================================');
  console.log(' CAPTURING REDLINE UI2 MULTI-RESOLUTION SCREENSHOTS');
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

  console.log('1. Waiting for boot...');
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
  await new Promise(r => setTimeout(r, 1200));

  // Helper to set viewport & capture
  async function takeShot(filename, width, height, isMobile) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: width,
      height: height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
    await new Promise(r => setTimeout(r, 800));
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
    console.log(`   Captured: ${filename} (${width}x${height}, mobile: ${isMobile})`);
  }

  // --- DESKTOP (1366x768) ---
  console.log('\n2. Capturing Desktop Views (1366x768)...');
  await evalJs(`CB.ui2.showHome()`);
  await takeShot('01_desktop_home_1366x768.png', 1366, 768, false);

  await evalJs(`CB.ui2.showModes()`);
  await takeShot('02_desktop_modes_1366x768.png', 1366, 768, false);

  await evalJs(`CB.ui2.showGarage()`);
  await takeShot('03_desktop_garage_1366x768.png', 1366, 768, false);

  // --- MOBILE LANDSCAPE (844x390 - iPhone 14 / modern flagship) ---
  console.log('\n3. Capturing Mobile Landscape Views (844x390)...');
  await evalJs(`CB.ui2.showHome()`);
  await takeShot('04_mobile_landscape_home_844x390.png', 844, 390, true);

  await evalJs(`CB.ui2.showModes()`);
  await takeShot('05_mobile_landscape_modes_844x390.png', 844, 390, true);

  await evalJs(`CB.ui2.showGarage()`);
  await takeShot('06_mobile_landscape_garage_844x390.png', 844, 390, true);

  // --- MOBILE PORTRAIT (360x800, 390x844, 430x932) ---
  console.log('\n4. Capturing Mobile Portrait Views...');
  await evalJs(`CB.ui2.showHome()`);
  await takeShot('07_mobile_portrait_home_360x800.png', 360, 800, true);
  await takeShot('08_mobile_portrait_home_390x844.png', 390, 844, true);
  await takeShot('09_mobile_portrait_home_430x932.png', 430, 932, true);

  console.log('\n========================================================');
  console.log(' ALL 9 PRODUCTION SCREENSHOTS CAPTURED IN:');
  console.log(` ${OUT_DIR}`);
  console.log('========================================================\n');

  chromeProc.kill();
  server.close();
}

captureScreens().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
