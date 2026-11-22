import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function capture() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-redline-cap-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const port = 9445;
  const chromeProcess = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-extensions",
    "https://jubayer-racing.pages.dev/"
  ], { stdio: 'ignore' });

  let tabs = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          tabs = JSON.parse(text);
          const pageTab = tabs.find(t => t.url.includes("jubayer-racing"));
          if (pageTab && pageTab.webSocketDebuggerUrl) {
            break;
          }
        }
      }
    } catch (e) {}
  }

  const pageTab = tabs ? tabs.find(t => t.url.includes("jubayer-racing")) : null;
  if (!pageTab || !pageTab.webSocketDebuggerUrl) {
    chromeProcess.kill();
    throw new Error("Could not find page target on port " + port);
  }

  console.log("Connected to page tab:", pageTab.title);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");

  async function setViewport(width, height, isLandscape = true) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: width,
      height: height,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: {
        angle: isLandscape ? 90 : 0,
        type: isLandscape ? "landscapePrimary" : "portraitPrimary"
      }
    });
  }

  async function takeScreenshot(filePath) {
    const res = await send("Page.captureScreenshot", { format: "png" });
    if (res && res.result && res.result.data) {
      fs.writeFileSync(filePath, Buffer.from(res.result.data, "base64"));
      console.log("Saved screenshot:", filePath);
    }
  }

  await setViewport(920, 520, true);
  await new Promise(r => setTimeout(r, 4500));

  // 1. Check Showroom (Garage / Viewer)
  console.log("Navigating to atelier / viewer...");
  await send("Runtime.evaluate", {
    expression: `window.location.hash = '#/atelier';`
  });
  await new Promise(r => setTimeout(r, 3500));
  await takeScreenshot('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_showroom_1.png');

  // Cycle next car (BMW M4)
  console.log("Cycling to next car...");
  await send("Runtime.evaluate", {
    expression: `var btn = document.getElementById('cb-showroom-next'); if (btn) btn.click();`
  });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_showroom_2.png');

  // Cycle next car (Supra)
  console.log("Cycling to 3rd car...");
  await send("Runtime.evaluate", {
    expression: `var btn = document.getElementById('cb-showroom-next'); if (btn) btn.click();`
  });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_showroom_3.png');

  // 2. Check Derby Menu
  console.log("Navigating to Derby...");
  await send("Runtime.evaluate", {
    expression: `window.location.hash = '#/derby';`
  });
  await new Promise(r => setTimeout(r, 3500));
  await takeScreenshot('C:/Users/ASSDi/.gemini/antigravity/brain/a94b5c18-35ae-4889-97c4-e96ab1fc6900/verify_derby_3d.png');

  ws.close();
  chromeProcess.kill();
  console.log("All verification screenshots complete!");
  process.exit(0);
}

capture().catch(e => {
  console.error(e);
  process.exit(1);
});
