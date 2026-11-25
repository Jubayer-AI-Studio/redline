import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const REDLINE_DIR = path.resolve('redline');
const ASSETS_DIR = path.resolve('redline/assets/realistic');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(REDLINE_DIR, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.webp': 'image/webp',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8091, async () => {
  console.log('Capture server running on port 8091');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  // Load the original garage at ?ui=1#/garage
  console.log('Loading studio 3D scene...');
  await page.goto('http://localhost:8091/index.html?ui=1#/garage', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Capture real 3D WebGL car turntable directly from studio3d canvas
  const canvasElement = await page.$('#viewer canvas, #screen-atelier canvas');
  if (canvasElement) {
    console.log('Found 3D studio canvas, capturing real car render...');
    await page.evaluate(() => {
      // Hide UI overlays on viewer for clean photo capture
      const v = document.getElementById('viewer');
      if (v) {
        const overlays = v.querySelectorAll('.cb-s3d-hint, .cb-s3d-photobar, .cb-s3d-labels, #viewer-toolbar');
        overlays.forEach(el => el.style.display = 'none');
      }
    });
    await page.waitForTimeout(500);

    // Capture clean 3D car render
    await page.screenshot({ path: path.join(ASSETS_DIR, 'real_porsche_911_gt3_studio.png') });
    console.log('Captured real_porsche_911_gt3_studio.png');

    // Switch car model via CB.stock.apply or CB.state
    const modelsToRender = [
      { id: 'bmw-m4-g82', name: 'bmw_m4' },
      { id: 'toyota-gr-supra-a90', name: 'supra_a90' },
      { id: 'ferrari-sf90-stradale', name: 'ferrari_sf90' },
      { id: 'mclaren-p1', name: 'mclaren_p1' }
    ];

    for (const m of modelsToRender) {
      console.log(`Switching to ${m.id}...`);
      await page.evaluate((modelId) => {
        if (window.CB && CB.stock && typeof CB.stock.apply === 'function') {
          CB.stock.apply({ model: modelId });
        }
      }, m.id);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ASSETS_DIR, `real_${m.name}_studio.png`) });
      console.log(`Captured real_${m.name}_studio.png`);
    }
  } else {
    console.warn('Canvas element not found directly on page');
  }

  await browser.close();
  server.close();
  console.log('Finished capturing real car renders.');
});
