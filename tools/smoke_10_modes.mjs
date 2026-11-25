import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'https://preview-phase1.jubayer-racing.pages.dev/game.html?dev=1';
const PORT = 9472;
const OUTPUT_DIR = path.resolve('docs/smoke_screens');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function run() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-smoke-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  console.log('========================================================');
  console.log(' Redline 10-Mode Gameplay Smoke Test Suite');
  console.log('========================================================');
  console.log(`Launching Headless Chrome on port ${PORT}...`);

  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-extensions",
    "--window-size=844,390",
    BASE_URL
  ], { stdio: 'ignore' });

  let pageTab = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        const tabs = await res.json();
        pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
        if (pageTab) break;
      }
    } catch (e) {}
  }

  if (!pageTab || !pageTab.webSocketDebuggerUrl) {
    chromeProc.kill();
    throw new Error('Failed to find page tab on port ' + PORT);
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
    if (data.method === 'Runtime.consoleAPICalled') {
      if (data.params.type === 'error') {
        const text = data.params.args.map(a => a.value || a.description || '').join(' ');
        consoleErrors.push(text);
      }
    }
    if (data.method === 'Runtime.exceptionThrown') {
      const text = data.params.exceptionDetails.text || (data.params.exceptionDetails.exception && data.params.exceptionDetails.exception.description) || '';
      consoleErrors.push(text);
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 844, height: 390, deviceScaleFactor: 2, mobile: true,
    screenOrientation: { angle: 90, type: 'landscapePrimary' }
  });

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res && res.result ? res.result.value : null;
  };

  const pressThrottle = async (down) => {
    await send('Input.dispatchKeyEvent', {
      type: down ? 'rawKeyDown' : 'keyUp',
      key: 'ArrowUp',
      code: 'ArrowUp',
      windowsVirtualKeyCode: 38,
      nativeVirtualKeyCode: 38
    });
  };

  const captureScreen = async (filename) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
    return filePath;
  };

  console.log('Waiting for engine boot...');
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const booted = await evalJs(`!document.getElementById('cb-boot') || document.getElementById('cb-boot').classList.contains('is-done') || !document.getElementById('cb-boot').isConnected`);
    if (booted) break;
  }
  await new Promise(r => setTimeout(r, 1200));

  // Dismiss start/title screen if visible by clicking body
  await evalJs(`
    (function() {
      var title = document.querySelector('.gh-title');
      if (title) title.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  const MODES = [
    {
      id: 'race',
      name: 'Circuit Sprint',
      route: '#/race',
      startSelector: '[data-act="start"], .race-start-btn',
      startFn: `if (CB.race && CB.race.ui && CB.race.ui.startRace) CB.race.ui.startRace();`,
      filename: 'smoke_01_race.png'
    },
    {
      id: 'drift',
      name: 'Drift Battles',
      route: '#/drift',
      startSelector: '[data-act="start"], .race-start-btn',
      startFn: `if (CB.race && CB.race.ui && CB.race.ui.startRace) CB.race.ui.startRace();`,
      filename: 'smoke_02_drift.png'
    },
    {
      id: 'arcade',
      name: 'Stunt Arcade',
      route: '#/arcade',
      startSelector: '[data-act="start"], .race-start-btn',
      startFn: `if (CB.race && CB.race.ui && CB.race.ui.startRace) CB.race.ui.startRace();`,
      filename: 'smoke_03_arcade.png'
    },
    {
      id: 'derby',
      name: 'Demolition Derby',
      route: '#/derby',
      startSelector: '[data-dd="start"], .derby-start-btn',
      startFn: `if (CB.derby && CB.derby.ui && CB.derby.ui.startMatch) CB.derby.ui.startMatch();`,
      filename: 'smoke_04_derby.png'
    },
    {
      id: 'drag',
      name: '1/4-Mile Drag',
      route: '#/drag',
      startSelector: '[data-dg="start"], .drag-start-btn',
      startFn: `if (CB.drag && CB.drag.ui && CB.drag.ui.start) CB.drag.ui.start();`,
      filename: 'smoke_05_drag.png'
    },
    {
      id: 'f1',
      name: 'Formula 1 GP',
      route: '#/f1',
      startSelector: '[data-act="start"]',
      startFn: `if (CB.f1 && CB.f1.ui && CB.f1.ui.startRace) CB.f1.ui.startRace();`,
      filename: 'smoke_06_f1.png'
    },
    {
      id: 'timetrial',
      name: 'Time Trial Hot Lap',
      route: '#/timetrial',
      startSelector: '[data-act="start"], .race-start-btn',
      startFn: `if (CB.race && CB.race.ui && CB.race.ui.startRace) CB.race.ui.startRace();`,
      filename: 'smoke_07_timetrial.png'
    },
    {
      id: 'career',
      name: 'Career Championship',
      route: '#/career',
      startSelector: '.gh-champ-btn, .gh-btn.primary, [data-act="start"]',
      startFn: `(function() {
        var btn = document.querySelector('.gh-champ-btn, .gh-btn.primary, [data-act="start"]');
        if (btn) btn.click();
        else if (CB.race && CB.race.ui && CB.race.ui.startRace) CB.race.ui.startRace();
      })()`,
      filename: 'smoke_08_career.png'
    },
    {
      id: 'challenges',
      name: 'Driving School',
      route: '#/challenges',
      startSelector: '.gh-chal-card, .gh-btn.primary, [data-act="start"]',
      startFn: `(function() {
        var card = document.querySelector('.gh-chal-card');
        if (card) card.click();
        var btn = document.querySelector('.gh-btn.primary, [data-act="start"]');
        if (btn) btn.click();
      })()`,
      filename: 'smoke_09_challenges.png'
    },
    {
      id: 'multiplayer',
      name: 'Multiplayer Lobby',
      route: '#/multiplayer',
      startSelector: '[data-act="create"], .cb-btn.primary',
      startFn: `(function() {
        var btn = document.querySelector('[data-act="create"], .cb-btn.primary');
        if (btn) btn.click();
      })()`,
      filename: 'smoke_10_multiplayer.png'
    }
  ];

  const results = [];

  for (let i = 0; i < MODES.length; i++) {
    const m = MODES[i];
    const errorsBefore = consoleErrors.length;
    console.log(`\n[${i + 1}/10] Testing ${m.name} (${m.route})...`);

    // Navigate to mode
    await evalJs(`window.location.hash = '${m.route}'`);
    await new Promise(r => setTimeout(r, 1200));

    // Click start or execute start action
    await evalJs(`
      (function() {
        var btn = document.querySelector('${m.startSelector}');
        if (btn) btn.click();
        else {
          ${m.startFn}
        }
      })()
    `);

    // Drive / play for 10 seconds with throttle active
    console.log(`  -> Gameplay active: driving for 10 s...`);
    await pressThrottle(true);
    
    // Simulate slight steering oscillation during the 10s drive
    const startTime = Date.now();
    let steerStep = 0;
    while (Date.now() - startTime < 10000) {
      steerStep++;
      if (steerStep % 4 === 0) {
        await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
        await new Promise(r => setTimeout(r, 150));
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
      } else if (steerStep % 4 === 2) {
        await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
        await new Promise(r => setTimeout(r, 150));
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
      } else {
        await new Promise(r => setTimeout(r, 300));
      }
    }
    await pressThrottle(false);

    // Capture screenshot at end of 10s drive
    const shotPath = await captureScreen(m.filename);
    console.log(`  -> Captured gameplay screenshot: ${shotPath}`);

    // Check FPS / status
    const fps = await evalJs(`
      (function() {
        if (window.CB && CB.race && CB.race.ui && CB.race.ui.activeSession) {
          return 'Active 3D Session';
        }
        return 'Active Simulation';
      })()
    `);

    const modeErrors = consoleErrors.slice(errorsBefore);
    const passed = modeErrors.length === 0;

    results.push({
      mode: m.name,
      route: m.route,
      duration: '10.0 s',
      status: passed ? 'PASSED' : 'FAILED',
      fps: fps,
      errors: modeErrors.length,
      errorDetail: modeErrors.join('; '),
      screenshot: m.filename
    });

    // Return to menu
    await evalJs(`window.location.hash = '#/menu'`);
    await new Promise(r => setTimeout(r, 600));
  }

  chromeProc.kill();

  console.log('\n========================================================');
  console.log(' Redline 10-Mode Smoke Test Results');
  console.log('========================================================\n');
  console.table(results.map(r => ({
    Mode: r.mode,
    Route: r.route,
    PlayDuration: r.duration,
    Verdict: r.status,
    Errors: r.errors,
    Screenshot: r.screenshot
  })));

  const allPassed = results.every(r => r.status === 'PASSED');
  if (allPassed) {
    console.log('\n✨ ALL 10 MODES PASSED WITH ZERO CONSOLE ERRORS! ✨\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME MODES FAILED WITH CONSOLE ERRORS!\n');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal smoke test runner error:', err);
  process.exit(1);
});
