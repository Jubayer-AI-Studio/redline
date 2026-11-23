import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Simple static HTTP server for redline directory
const ROOT = path.resolve('redline');
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
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

server.listen(8089, async () => {
  console.log('Static server listening on http://localhost:8089');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader']
  });

  const context = await browser.newContext({
    viewport: { width: 844, height: 390 }, // iPhone landscape
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

  console.log('Testing ?ui=2 (Realistic UI v2)...');
  await page.goto('http://localhost:8089/?ui=2', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Wait for scripts & car sync

  // Verify Zero Vertical Scroll
  const scrollInfo = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      innerHeight: window.innerHeight,
      bodyScrollHeight: document.body.scrollHeight,
      appScrollHeight: document.getElementById('rl-app') ? document.getElementById('rl-app').scrollHeight : null,
      isV2: document.documentElement.classList.contains('rl-v2'),
      activeScreen: document.querySelector('#rl-app .screen.active') ? document.querySelector('#rl-app .screen.active').id : null
    };
  });
  console.log('Scroll Info (?ui=2):', JSON.stringify(scrollInfo));

  // Capture Screenshot of Home Screen
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui2_home_844x390.png' });
  console.log('Captured step3_ui2_home_844x390.png');

  // Test Nav to Modes
  await page.evaluate(() => window.navTo('modes'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui2_modes_844x390.png' });
  console.log('Captured step3_ui2_modes_844x390.png');

  // Test Nav to Garage
  await page.evaluate(() => window.navTo('garage'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui2_garage_844x390.png' });
  console.log('Captured step3_ui2_garage_844x390.png');

  // Test Nav to Customize
  await page.evaluate(() => window.navTo('customize'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui2_customize_844x390.png' });
  console.log('Captured step3_ui2_customize_844x390.png');

  // Test Nav to HUD
  await page.evaluate(() => window.navTo('hud'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui2_hud_844x390.png' });
  console.log('Captured step3_ui2_hud_844x390.png');

  // Test Pristine Fallback ?ui=1
  console.log('Testing ?ui=1 (Original UI baseline)...');
  await page.goto('http://localhost:8089/?ui=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const v1Info = await page.evaluate(() => {
    return {
      isV2: document.documentElement.classList.contains('rl-v2'),
      rlAppDisplay: document.getElementById('rl-app') ? window.getComputedStyle(document.getElementById('rl-app')).display : 'none',
      globalNavDisplay: document.getElementById('global-nav') ? window.getComputedStyle(document.getElementById('global-nav')).display : 'none'
    };
  });
  console.log('V1 Fallback Info (?ui=1):', JSON.stringify(v1Info));
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/step3_ui1_fallback_844x390.png' });
  console.log('Captured step3_ui1_fallback_844x390.png');

  console.log('Console Errors caught:', consoleErrors);

  await browser.close();
  server.close();
  process.exit(0);
});
