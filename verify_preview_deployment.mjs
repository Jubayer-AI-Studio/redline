import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';

async function verify() {
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

  const previewBase = 'https://c061523b.jubayer-racing.pages.dev';

  console.log('Testing Preview UI v2 (?ui=2)...');
  await page.goto(previewBase + '/?ui=2', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const scrollInfo = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      innerHeight: window.innerHeight,
      isV2: document.documentElement.classList.contains('rl-v2'),
      activeScreen: document.querySelector('#rl-app .screen.active') ? document.querySelector('#rl-app .screen.active').id : null
    };
  });
  console.log('Preview UI v2 Scroll & State:', JSON.stringify(scrollInfo));

  // 1. Home Screen
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_home_844x390.png' });
  console.log('Saved preview_step3_home_844x390.png');

  // 2. Modes Screen
  await page.evaluate(() => window.navTo('modes'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_modes_844x390.png' });
  console.log('Saved preview_step3_modes_844x390.png');

  // 3. Garage Screen
  await page.evaluate(() => window.navTo('garage'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_garage_844x390.png' });
  console.log('Saved preview_step3_garage_844x390.png');

  // 4. Customize Screen
  await page.evaluate(() => window.navTo('customize'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_customize_844x390.png' });
  console.log('Saved preview_step3_customize_844x390.png');

  // 5. HUD Screen
  await page.evaluate(() => window.navTo('hud'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_hud_844x390.png' });
  console.log('Saved preview_step3_hud_844x390.png');

  // 6. Test Pristine Fallback ?ui=1 on Preview
  console.log('Testing Preview Pristine Fallback (?ui=1)...');
  await page.goto(previewBase + '/?ui=1', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const v1Check = await page.evaluate(() => {
    return {
      isV2: document.documentElement.classList.contains('rl-v2'),
      rlAppDisplay: document.getElementById('rl-app') ? window.getComputedStyle(document.getElementById('rl-app')).display : 'none'
    };
  });
  console.log('Preview UI v1 Fallback Check:', JSON.stringify(v1Check));
  await page.screenshot({ path: '../brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/preview_step3_ui1_fallback_844x390.png' });
  console.log('Saved preview_step3_ui1_fallback_844x390.png');

  console.log('Console Errors caught on Preview:', consoleErrors);

  await browser.close();
}

verify().catch(console.error);
