import('file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs').then(async ({ chromium }) => {
  const http = await import('http');
  const fs = await import('fs');
  const path = await import('path');
  const ROOT = __dirname;
  const MIME = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp'
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
  }).listen(8101, async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
    const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
    await page.goto('http://localhost:8101/?ui=2');
    await page.waitForTimeout(1000);
    
    // Check navigation to garage
    await page.evaluate(() => window.navTo('garage'));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/index_garage_test.png' });

    // Click DRIVE NOW to launch race
    console.log('Clicking DRIVE NOW...');
    await page.evaluate(() => {
      const driveBtn = document.querySelector('.garage-drive-btn') || document.getElementById('cta-race');
      if (driveBtn) driveBtn.click();
    });

    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/index_race_launch_test.png' });

    await browser.close();
    server.close();
    console.log('Saved index_garage_test.png and index_race_launch_test.png');
    process.exit(0);
  });
});
