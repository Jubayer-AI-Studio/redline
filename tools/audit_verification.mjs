import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9444;
const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=920,440',
  '--disable-gpu',
  '--no-sandbox',
  'https://jubayer-racing.pages.dev/'
]);

async function getWs() {
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json`, res => {
          let buf = '';
          res.on('data', c => buf += c);
          res.on('end', () => resolve(buf));
        }).on('error', reject);
      });
      const list = JSON.parse(data);
      const page = list.find(p => p.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) {}
  }
  return null;
}

(async () => {
  const wsUrl = await getWs();
  if (!wsUrl) {
    console.error('Failed to get chrome websocket');
    chrome.kill();
    process.exit(1);
  }
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  ws.addEventListener('open', async () => {
    console.log('Connected to headless Chrome');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 920, height: 440, deviceScaleFactor: 1, mobile: true, screenOrientation: { type: 'landscapePrimary', angle: 90 }
    });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Garage / Showroom
    console.log('Navigating to showroom (atelier)...');
    await send('Runtime.evaluate', { expression: 'if (window.CB && CB.router && CB.router.go) CB.router.go("atelier"); else location.hash = "#/garage";' });
    await new Promise(r => setTimeout(r, 4000));
    await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".gach-toast, .cb-toast").forEach(t => t.remove());' });
    await new Promise(r => setTimeout(r, 500));

    const domInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const el = document.elementFromPoint(50, 425);
        return {
          tag: el ? el.tagName : null,
          className: el ? el.className : null,
          id: el ? el.id : null,
          parentClass: el && el.parentElement ? el.parentElement.className : null,
          parentId: el && el.parentElement ? el.parentElement.id : null,
          outer: el ? el.outerHTML.slice(0, 300) : null
        };
      })()`
    });
    console.log('BOTTOM ELEMENT:', JSON.stringify(domInfo.result?.value, null, 2));

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verified_no_pilots_garage.png', Buffer.from(shot.data, 'base64'));
    console.log('Captured verified_no_pilots_garage.png');

    // 2. Race
    console.log('Navigating to race and launching 3D drive...');
    await send('Runtime.evaluate', { expression: 'if (window.CB && CB.race && CB.race.ui && CB.race.ui.open) CB.race.ui.open(null, { autoStart: true }); else if (window.CB && CB.router && CB.router.go) CB.router.go("race");' });
    await new Promise(r => setTimeout(r, 4500));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verified_no_pilots_race.png', Buffer.from(shot.data, 'base64'));
    console.log('Captured verified_no_pilots_race.png');

    ws.close();
    chrome.kill();
    process.exit(0);
  });
})();
