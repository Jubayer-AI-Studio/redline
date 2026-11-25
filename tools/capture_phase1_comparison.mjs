import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function captureUrl(url, outputPath, port) {
  const tmpDir = path.join(os.tmpdir(), 'chrome-cap-' + port + '-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`Spawning Chrome for ${url} on port ${port}...`);
  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-extensions",
    url
  ], { stdio: 'ignore' });

  let pageTab = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const tabs = await res.json();
        pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
        if (pageTab) break;
      }
    } catch (e) {}
  }

  if (!pageTab || !pageTab.webSocketDebuggerUrl) {
    chromeProc.kill();
    throw new Error('Failed to find page tab on port ' + port);
  }

  console.log('Connected to tab for:', url);
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 915,
    height: 412,
    deviceScaleFactor: 2.625,
    mobile: true,
    screenOrientation: { type: 'landscapePrimary', angle: 90 }
  });

  console.log('Waiting 7s for page render and layout...');
  await new Promise(r => setTimeout(r, 7000));

  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes && screenshotRes.data) {
    fs.writeFileSync(outputPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log('Saved screenshot to:', outputPath);
  }

  ws.close();
  chromeProc.kill();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
}

async function main() {
  const redlineDir = 'C:\\Users\\ASSDi\\Desktop\\car\\redline';
  const beforeImg = path.join(redlineDir, 'phase1_before.png');
  const afterImg = path.join(redlineDir, 'phase1_after.png');

  // Baseline production
  await captureUrl('https://jubayer-racing.pages.dev/game.html', beforeImg, 9450);
  // Phase 1 preview
  await captureUrl('https://preview-phase1.jubayer-racing.pages.dev/game.html', afterImg, 9451);

  console.log('Comparison captures complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
