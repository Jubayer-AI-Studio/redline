import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('redline');
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8092, async () => {
  console.log('Testing server running on http://localhost:8092');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader']
  });

  const viewports = [
    { name: 'iPhone 13 (844x390)', width: 844, height: 390 },
    { name: 'Android Mid-range (800x360)', width: 800, height: 360 },
    { name: 'iPhone Pro Max (932x430)', width: 932, height: 430 }
  ];

  const results = [];

  for (const vp of viewports) {
    console.log(`\n================ Testing Viewport: ${vp.name} ================`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.goto('http://localhost:8092/?ui=2', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 1. Home Screen
    const homeScroll = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      has3dCanvas: !!document.querySelector('#stage canvas'),
      brand: document.querySelector('.brand-title') ? document.querySelector('.brand-title').textContent.trim() : null
    }));
    console.log('Home Screen State:', JSON.stringify(homeScroll));

    const prefix = vp.width + 'x' + vp.height;
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_home_${prefix}.png` });

    // 2. Modes Screen
    await page.evaluate(() => window.navTo('modes'));
    await page.waitForTimeout(400);
    const modesScroll = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth
    }));
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_modes_${prefix}.png` });

    // 3. Garage Screen (with prev/next arrows and camera pills)
    await page.evaluate(() => window.navTo('garage'));
    await page.waitForTimeout(400);

    // Test clicking Next Car and Top View
    await page.evaluate(() => {
      if (window.nextCar) window.nextCar();
      if (window.setStudioView) {
        var topBtn = document.querySelectorAll('.cam-pill')[3];
        if (topBtn) window.setStudioView(topBtn, 'top');
      }
    });
    await page.waitForTimeout(400);

    const garageScroll = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      activeCarMake: document.getElementById('home-car-make') ? document.getElementById('home-car-make').textContent : null,
      activeCarModel: document.getElementById('home-car-title') ? document.getElementById('home-car-title').textContent : null
    }));
    console.log('Garage State after Next Car:', JSON.stringify(garageScroll));
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_garage_${prefix}.png` });

    // 4. Customize Screen
    await page.evaluate(() => window.navTo('customize'));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_customize_${prefix}.png` });

    // 5. HUD Screen
    await page.evaluate(() => window.navTo('hud'));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_hud_${prefix}.png` });

    results.push({
      viewport: vp.name,
      zeroScrollHome: homeScroll.scrollH <= homeScroll.innerH && homeScroll.scrollW <= homeScroll.innerW,
      zeroScrollModes: modesScroll.scrollH <= modesScroll.innerH && modesScroll.scrollW <= modesScroll.innerW,
      zeroScrollGarage: garageScroll.scrollH <= vp.height,
      consoleErrors: consoleErrors.length
    });

    await context.close();
  }

  // 6. Test Offline Capability
  console.log('\n================ Testing Offline Capability ================');
  const offlineContext = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true
  });
  const offlinePage = await offlineContext.newPage();

  // Load once online to populate SW cache
  await offlinePage.goto('http://localhost:8092/?ui=2', { waitUntil: 'domcontentloaded' });
  await offlinePage.waitForTimeout(2000);

  // Set offline mode
  await offlineContext.setOffline(true);
  console.log('Network disabled (Offline simulation). Reloading page...');
  try {
    await offlinePage.reload({ waitUntil: 'domcontentloaded', timeout: 5000 });
    const offlineTitle = await offlinePage.title();
    console.log('Offline reload succeeded! Title:', offlineTitle);
    await offlinePage.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/ultimate_offline_844x390.png' });
  } catch (err) {
    console.error('Offline reload failed:', err.message);
  }

  console.log('\n================ Verification Summary ================');
  console.table(results);

  await browser.close();
  server.close();
  process.exit(0);
});
