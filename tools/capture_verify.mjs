import http from 'http';
import fs from 'fs';

async function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page' && p.url.includes('jubayer-racing'));
          resolve(page ? page.webSocketDebuggerUrl : null);
        } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const wsUrl = await getWs();
  if (!wsUrl) { console.log('No tab found'); return; }
  const WebSocket = (await import('ws')).default;
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg);
      if (data.id === curId) {
        ws.off('message', handler);
        res(data.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  ws.on('open', async () => {
    console.log('Setting cache disabled & reloading...');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 2500));

    console.log('Navigating to showroom...');
    await send('Runtime.evaluate', { expression: 'location.hash = "#garage"; if (window.CB && CB.router) CB.router.navigate("garage");' });
    await new Promise(r => setTimeout(r, 2000));

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_no_pilots_garage.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_no_pilots_garage.png');

    console.log('Starting race...');
    await send('Runtime.evaluate', { expression: 'location.hash = "#race"; if (window.CB && CB.router) CB.router.navigate("race");' });
    await new Promise(r => setTimeout(r, 3500));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_clean_race.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_clean_race.png');

    ws.close();
  });
})();
