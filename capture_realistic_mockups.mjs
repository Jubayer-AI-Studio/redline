import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const REDLINE_DIR = path.resolve('redline');
const ARTIFACTS_DIR = 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/mockup_realistic.html';
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

server.listen(8092, async () => {
  console.log('Capture server running on port 8092');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  await page.goto('http://localhost:8092/mockup_realistic.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const screens = ['home', 'modes', 'garage', 'customize', 'hud'];
  for (const scr of screens) {
    console.log(`Capturing screen: ${scr}...`);
    await page.evaluate((s) => navTo(s), scr);
    await page.waitForTimeout(400);
    const outPath = path.join(ARTIFACTS_DIR, `realistic_${scr}_844x390.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
  }

  await browser.close();
  server.close();
  console.log('Finished capturing realistic mockups.');
});
