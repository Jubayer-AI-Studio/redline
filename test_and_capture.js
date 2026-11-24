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
    if (p === '') p = 'mockup_realistic.html';
    const f = path.join(ROOT, p);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const ext = path.extname(f);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    } else {
      res.writeHead(404); res.end();
    }
  }).listen(8099, async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
    
    // Test Viewports: Mobile Landscape (844x390) and Desktop (1920x1080)
    for (const [vpName, w, h] of [['mobile', 844, 390], ['desktop', 1920, 1080]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto('http://localhost:8099/mockup_realistic.html');
      await page.waitForTimeout(1000);
      
      for (const scr of ['home', 'garage', 'modes', 'customize', 'settings']) {
        await page.evaluate(s => window.navTo(s), scr);
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/rk_refine_' + vpName + '_' + scr + '.png' });
      }
      await page.close();
    }

    console.log('All screenshots captured successfully!');
    await browser.close();
    server.close();
    process.exit(0);
  });
});
