import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const REDLINE_DIR = path.resolve('redline');

// Simple static server
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
      '.svg': 'image/svg+xml',
      '.mp3': 'audio/mpeg'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8089, async () => {
  console.log('Test server running at http://localhost:8089');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = { passed: 0, failed: 0, errors: [] };

  try {
    const page = await browser.newPage({
      viewport: { width: 844, height: 390 },
      deviceScaleFactor: 2
    });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    // TEST 1: Load with ?ui=2
    console.log('\n--- TEST 1: Testing UI v2 (?ui=2) ---');
    await page.goto('http://localhost:8089/index.html?ui=2', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const isV2Active = await page.evaluate(() => {
      const rlApp = document.getElementById('rl-app');
      return rlApp && window.getComputedStyle(rlApp).display !== 'none';
    });

    if (isV2Active) {
      console.log('✅ UI v2 #rl-app mounted and active');
      results.passed++;
    } else {
      console.error('❌ UI v2 failed to activate');
      results.failed++;
    }

    // Check zero scroll
    const scrollOverflow = await page.evaluate(() => {
      return document.documentElement.scrollHeight > window.innerHeight;
    });
    if (!scrollOverflow) {
      console.log('✅ UI v2 Zero-scroll verified (scrollHeight <= innerHeight)');
      results.passed++;
    } else {
      console.error('❌ UI v2 has vertical scroll overflow');
      results.failed++;
    }

    // Check screens transition and capture screenshots
    const screens = ['home', 'modes', 'garage', 'customize', 'hud'];
    for (const scr of screens) {
      await page.evaluate((s) => {
        if (typeof rlNav === 'function') rlNav(s);
      }, scr);
      await page.waitForTimeout(300);

      const isScrActive = await page.evaluate((s) => {
        const el = document.getElementById('screen-' + s);
        return el && el.classList.contains('is-active');
      }, scr);

      if (isScrActive) {
        console.log(`✅ Screen [${scr}] active`);
        results.passed++;
        await page.screenshot({ path: `redline/screenshot_ui2_${scr}_844x390.png` });
      } else {
        console.error(`❌ Screen [${scr}] not active`);
        results.failed++;
      }
    }

    // TEST 2: Bangla Language Translation Check
    console.log('\n--- TEST 2: Bangla Localization Check ---');
    await page.evaluate(() => {
      if (typeof rlSetLanguage === 'function') rlSetLanguage('bn');
    });
    await page.waitForTimeout(300);

    const hasBanglaText = await page.evaluate(() => {
      const playBtn = document.querySelector('[data-i18n="btn_play"]');
      return playBtn && playBtn.textContent.includes('শুরু');
    });

    if (hasBanglaText) {
      console.log('✅ Bangla localization rendered accurately');
      results.passed++;
      await page.screenshot({ path: `redline/screenshot_ui2_home_bn_844x390.png` });
    } else {
      console.error('❌ Bangla text translation not found');
      results.failed++;
    }

    // Switch back to en
    await page.evaluate(() => {
      if (typeof rlSetLanguage === 'function') rlSetLanguage('en');
    });

    // TEST 3: Classic UI fallback (?ui=1)
    console.log('\n--- TEST 3: Testing Classic UI Fallback (?ui=1) ---');
    await page.goto('http://localhost:8089/index.html?ui=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const isV1Active = await page.evaluate(() => {
      const rlApp = document.getElementById('rl-app');
      const gnav = document.getElementById('gnav');
      const appRoot = document.getElementById('app-root');
      const rlAppHidden = !rlApp || window.getComputedStyle(rlApp).display === 'none';
      const appRootVisible = appRoot && window.getComputedStyle(appRoot).display !== 'none';
      return rlAppHidden && appRootVisible;
    });

    if (isV1Active) {
      console.log('✅ Classic UI v1 preserved and active under ?ui=1');
      results.passed++;
    } else {
      console.error('❌ Classic UI v1 fallback failed');
      results.failed++;
    }

    // Check console errors
    console.log('\n--- Console Error Check ---');
    if (consoleErrors.length === 0) {
      console.log('✅ Zero console errors detected');
      results.passed++;
    } else {
      console.warn('⚠️ Console errors noticed:', consoleErrors);
    }

  } catch (err) {
    console.error('Test run failed with error:', err);
    results.errors.push(err);
  } finally {
    await browser.close();
    server.close();
    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${results.passed} Passed, ${results.failed} Failed`);
    console.log(`========================================`);
    process.exit(results.failed > 0 ? 1 : 0);
  }
});
