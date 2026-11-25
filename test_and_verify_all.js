import('file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs').then(async ({ chromium }) => {
  const http = await import('http');
  const fs = await import('fs');
  const path = await import('path');
  const ROOT = process.cwd();
  const ARTIFACTS = 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900';

  const MIME = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let p = req.url.split('?')[0].replace(/^\/+/, '');
    if (p === '') p = 'index.html';
    const f = path.join(ROOT, p);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const ext = path.extname(f);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    } else {
      res.writeHead(404); res.end();
    }
  }).listen(8108, async () => {
    console.log('[TEST] Local server started on port 8108');
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });

    // 1. Desktop 1280x720 Tests
    console.log('[TEST] Running Desktop 1280x720 tests...');
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await desktopPage.goto('http://localhost:8108/');
    await desktopPage.waitForTimeout(2500);

    // Capture Home
    await desktopPage.screenshot({ path: path.join(ARTIFACTS, 'verified_desktop_home.png') });
    console.log('Saved verified_desktop_home.png');

    // Test Garage Screen
    await desktopPage.evaluate(() => window.navTo('garage'));
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(ARTIFACTS, 'verified_desktop_garage.png') });
    console.log('Saved verified_desktop_garage.png');

    // Test Modes Screen (All 3D cards)
    await desktopPage.evaluate(() => window.navTo('modes'));
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(ARTIFACTS, 'verified_desktop_modes.png') });
    console.log('Saved verified_desktop_modes.png');

    // Test Interactive Rewards Modal
    await desktopPage.evaluate(() => window.openRewardsModal());
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(ARTIFACTS, 'verified_desktop_modal_rewards.png') });
    console.log('Saved verified_desktop_modal_rewards.png');

    // Close Modal and test Customize Screen
    await desktopPage.evaluate(() => {
      window.closeGameModal();
      window.navTo('customize');
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(ARTIFACTS, 'verified_desktop_customize.png') });
    console.log('Saved verified_desktop_customize.png');

    // 2. Mobile Landscape 844x390 Tests
    console.log('[TEST] Running Mobile Landscape 844x390 tests...');
    const mobilePage = await browser.newPage({ viewport: { width: 844, height: 390 } });
    await mobilePage.goto('http://localhost:8108/');
    await mobilePage.waitForTimeout(2500);
    await mobilePage.screenshot({ path: path.join(ARTIFACTS, 'verified_mobile_home.png') });
    console.log('Saved verified_mobile_home.png');

    await mobilePage.evaluate(() => window.navTo('garage'));
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: path.join(ARTIFACTS, 'verified_mobile_garage.png') });
    console.log('Saved verified_mobile_garage.png');

    await mobilePage.evaluate(() => window.navTo('modes'));
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: path.join(ARTIFACTS, 'verified_mobile_modes.png') });
    console.log('Saved verified_mobile_modes.png');

    // 3. Live 3D Race Session Launch Test
    console.log('[TEST] Testing Live 3D Race launch on Mobile...');
    await mobilePage.goto('http://localhost:8108/#/race?quick=1');
    await mobilePage.waitForTimeout(4000);
    await mobilePage.screenshot({ path: path.join(ARTIFACTS, 'verified_mobile_live_3d_race.png') });
    console.log('Saved verified_mobile_live_3d_race.png');

    await browser.close();
    server.close();
    console.log('[TEST] All tests completed successfully!');
    process.exit(0);
  });
});
