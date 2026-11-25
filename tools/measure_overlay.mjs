import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function measure() {
  const serverPort = 8899;
  const cdpPort = 9445;
  const redlineDir = 'C:\\Users\\ASSDi\\Desktop\\car\\redline';

  console.log('Starting local HTTP server on port ' + serverPort);
  const serverProc = spawn('python', ['-m', 'http.server', String(serverPort)], {
    cwd: redlineDir,
    stdio: 'ignore'
  });

  const tmpDir = path.join(os.tmpdir(), 'chrome-meas-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('Spawning Chrome with 4x CPU throttle mobile emulation...');
  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-extensions",
    `http://127.0.0.1:${serverPort}/index.html?debug=1#/race`
  ], { stdio: 'ignore' });

  let pageTab = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
      if (res.ok) {
        const tabs = await res.json();
        pageTab = tabs.find(t => t.url && t.url.includes('127.0.0.1:' + serverPort));
        if (pageTab && pageTab.webSocketDebuggerUrl) break;
      }
    } catch (e) {}
  }

  if (!pageTab || !pageTab.webSocketDebuggerUrl) {
    chromeProc.kill();
    serverProc.kill();
    throw new Error('Could not connect to Chrome tab via CDP');
  }

  console.log('Connected to Chrome tab:', pageTab.webSocketDebuggerUrl);
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

  // Set mobile device metrics (Landscape phone, 915x412, DPR 2.625)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 915,
    height: 412,
    deviceScaleFactor: 2.625,
    mobile: true,
    screenOrientation: { type: 'landscapePrimary', angle: 90 }
  });

  // Set 4x CPU Throttling
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log('Waiting 5s for page and assets to load...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('Launching active 3D race session...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof CB !== 'undefined' && CB.race && CB.race.ui) {
        CB.race.ui.launch({ track: 'circle-lab', autoStart: true });
      }
    `
  });

  console.log('Waiting 6s for active 3D WebGL race simulation...');
  await new Promise(r => setTimeout(r, 6000));

  // Evaluate CB.mobile.debugOverlay.getStats()
  const evalRes = await send('Runtime.evaluate', {
    expression: 'JSON.stringify(CB.mobile.debugOverlay ? CB.mobile.debugOverlay.getStats() : null)',
    returnByValue: true
  });

  let stats = null;
  try {
    stats = JSON.parse(evalRes.result.value);
  } catch (e) {
    stats = evalRes.result ? evalRes.result.value : null;
  }

  console.log('\n=============================================');
  console.log('REAL MEASUREMENTS [Emulated: Mobile Phone 915x412, DPR 2.625, 4x CPU Throttling, Active 3D Race]');
  console.log('=============================================');
  console.log(JSON.stringify(stats, null, 2));

  // Take screenshot
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes && screenshotRes.data) {
    const outPath = path.join(redlineDir, 'overlay_emulated_measured.png');
    fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log('Captured screenshot to:', outPath);
  }

  ws.close();
  chromeProc.kill();
  serverProc.kill();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
}

measure().catch(err => {
  console.error('Measurement failed:', err);
  process.exit(1);
});
