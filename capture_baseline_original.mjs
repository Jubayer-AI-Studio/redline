import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900';

async function captureOriginal() {
  console.log('Capturing original game baseline from production at 844x390...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  // 1. Menu
  console.log('Navigating to menu...');
  await page.goto('https://jubayer-racing.pages.dev/#/menu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'original_baseline_menu_844x390.png') });
  console.log('Captured original_baseline_menu_844x390.png');

  // 2. Garage (Builder)
  console.log('Navigating to garage...');
  await page.goto('https://jubayer-racing.pages.dev/#/garage', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // wait for 3D turntable
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'original_baseline_garage_844x390.png') });
  console.log('Captured original_baseline_garage_844x390.png');

  // 3. My Cars
  console.log('Navigating to cars...');
  await page.goto('https://jubayer-racing.pages.dev/#/cars', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'original_baseline_cars_844x390.png') });
  console.log('Captured original_baseline_cars_844x390.png');

  // 4. Race HUD
  console.log('Navigating to race...');
  await page.goto('https://jubayer-racing.pages.dev/#/race', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500); // wait for race 3d canvas & hud
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'original_baseline_race_844x390.png') });
  console.log('Captured original_baseline_race_844x390.png');

  await browser.close();
  console.log('All baseline original screenshots captured successfully.');
}

captureOriginal().catch(err => {
  console.error('Error capturing baseline:', err);
  process.exit(1);
});
