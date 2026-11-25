import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = __dirname;
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
    // Mobile Landscape Viewports
    { name: 'Mobile Android (800x360)', width: 800, height: 360, isMobile: true },
    { name: 'iPhone 13 (844x390)', width: 844, height: 390, isMobile: true },
    { name: 'iPhone Pro Max (932x430)', width: 932, height: 430, isMobile: true },
    // Mobile Portrait Viewports (Guard / Responsive Handling)
    { name: 'Mobile Portrait (360x800)', width: 360, height: 800, isMobile: true },
    { name: 'Mobile Portrait (412x915)', width: 412, height: 915, isMobile: true },
    // Desktop Viewports
    { name: 'Desktop Laptop (1366x768)', width: 1366, height: 768, isMobile: false },
    { name: 'Desktop Widescreen (1440x900)', width: 1440, height: 900, isMobile: false },
    { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080, isMobile: false }
  ];

  const results = [];

  for (const vp of viewports) {
    console.log(`\n================ Testing Viewport: ${vp.name} ================`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
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
    await page.waitForTimeout(1500);

    // 1. Home Screen
    const homeScroll = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      has3dCanvas: !!document.querySelector('#stage canvas'),
      brand: document.querySelector('.rk-topbar') ? 'Racing Kingdom Showroom' : (document.querySelector('.brand-title') ? document.querySelector('.brand-title').textContent.trim() : null)
    }));
    console.log('Home Screen State:', JSON.stringify(homeScroll));

    const prefix = vp.width + 'x' + vp.height;
    await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/test_home_${prefix}.png` });

    // 2. Modes Screen (Verify all 10 cards)
    await page.evaluate(() => window.navTo('modes'));
    await page.waitForTimeout(300);
    const modesCount = await page.evaluate(() => document.querySelectorAll('#screen-modes .mode-card').length);
    console.log('Modes screen card count:', modesCount);

    // 3. Garage Screen (Car selection & specs)
    await page.evaluate(() => window.navTo('garage'));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.nextCar());
    await page.waitForTimeout(300);
    const garageState = await page.evaluate(() => ({
      activeCarMake: document.querySelector('#home-car-make')?.textContent,
      activeCarModel: document.querySelector('#home-car-title')?.textContent,
      specsHp: document.querySelector('#g-hp')?.textContent
    }));
    console.log('Garage state after nextCar():', JSON.stringify(garageState));

    // 4. Settings Screen (Graphics tier toggle & audio)
    await page.evaluate(() => window.navTo('settings'));
    await page.waitForTimeout(300);
    const settingsState = await page.evaluate(() => ({
      tierVal: document.querySelector('#cfg-tier-val')?.textContent,
      hasOfflineBadge: !!document.querySelector('.offline-badge')
    }));
    console.log('Settings screen state:', JSON.stringify(settingsState));

    // Capture Settings Screenshot on standard resolutions
    if (vp.width === 844 || vp.width === 1920) {
      await page.screenshot({ path: `../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/test_settings_${prefix}.png` });
    }

    // Return to Home
    await page.evaluate(() => window.navTo('home'));
    await page.waitForTimeout(200);

    const isZeroScroll = (vp.height <= vp.width) ? (homeScroll.scrollH <= homeScroll.innerH + 1) : true;
    results.push({
      viewport: vp.name,
      zeroScroll: isZeroScroll,
      has3D: homeScroll.has3dCanvas,
      modesCount: modesCount,
      consoleErrors: consoleErrors.length
    });

    await context.close();
  }

  // 5. Offline Simulation Test
  console.log('\n================ Testing Offline Capability ================');
  const offlineContext = await browser.newContext({
    viewport: { width: 844, height: 390 }
  });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto('http://localhost:8092/?ui=2', { waitUntil: 'domcontentloaded' });
  await offlinePage.waitForTimeout(1500);

  // Turn off network (Airplane mode simulation)
  await offlineContext.setOffline(true);
  console.log('Network disabled (Offline simulation). Reloading page...');
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.waitForTimeout(1500);

  const offlineTitle = await offlinePage.title();
  const offlineBrand = await offlinePage.evaluate(() => document.querySelector('.rk-topbar') ? 'Racing Kingdom Showroom' : document.querySelector('.brand-title')?.textContent.trim());
  console.log(`Offline reload succeeded! Title: ${offlineTitle}, Brand: ${offlineBrand}`);

  console.log('\n================ Verification Summary ================');
  console.table(results);

  await browser.close();
  server.close();
  process.exit(0);
});
