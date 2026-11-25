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
  }).listen(8104, async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });

    const modes = [
      ['mode_race.webp', '#/race?quick=1'],
      ['mode_drift.webp', '#/drift?quick=1'],
      ['mode_arcade.webp', '#/arcade?quick=1'],
      ['mode_derby.webp', '#/derby?quick=1'],
      ['mode_f1.webp', '#/f1?quick=1'],
      ['mode_drag.webp', '#/drag?quick=1']
    ];

    for (const [filename, hash] of modes) {
      try {
        console.log('Capturing real in-engine shot for', hash);
        await page.goto('http://localhost:8104/' + hash);
        await page.waitForTimeout(3000);
        const shotBuffer = await page.screenshot({ type: 'png' });
        fs.writeFileSync(path.join(ROOT, 'assets/cards', filename.replace('.webp', '.png')), shotBuffer);
      } catch (err) {
        console.error('Error capturing', hash, err.message);
      }
    }

    await browser.close();
    server.close();
    console.log('Finished capturing real in-engine mode screenshots!');
    process.exit(0);
  });
});
