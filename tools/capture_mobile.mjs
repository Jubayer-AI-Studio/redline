import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

async function capture() {
  const tmpDir = path.join(os.tmpdir(), 'chrome-redline-cap-' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const port = 9444;
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

  console.log("Connected to page tab:", pageTab.title, "at", pageTab.url);
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

  // Helper to set device viewport
  async function setViewport(width, height, isLandscape = false) {
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
    } else {
      console.error("Failed to capture screenshot for", filePath, res);
    }
  }

  // 1. Portrait mode 390x844
  console.log("Setting portrait viewport (390x844)...");
  await setViewport(390, 844, false);

  // Wait for initial boot and title screen
  await new Promise(r => setTimeout(r, 4000));

  // If on title screen, click to enter main menu
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.router) {
        window.CB.router.go('menu');
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_portrait_home.png"));

  // 2. Portrait Garage
  console.log("Navigating to Garage in portrait...");
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.router) {
        window.CB.router.go('atelier');
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2500));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_portrait_garage.png"));

  // 3. Portrait Profile (verify 5 charts & ledger removed)
  console.log("Navigating to Profile in portrait...");
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.router) {
        window.CB.router.go('profile');
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_portrait_profile.png"));

  // 3.5 Portrait Race
  console.log("Starting Quick Race in portrait...");
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.app && window.CB.app.drive) {
        window.CB.app.drive('race', { quick: true });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 4500));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_portrait_race.png"));

  // 4. Landscape mode 844x390
  console.log("Setting landscape viewport (844x390)...");
  await setViewport(844, 390, true);
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.router) {
        window.CB.router.go('menu');
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2500));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_landscape_home.png"));

  // 5. Landscape Garage
  console.log("Navigating to Garage in landscape...");
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.router) {
        window.CB.router.go('atelier');
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 2500));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_landscape_garage.png"));

  // 6. Landscape Race
  console.log("Starting Quick Race in landscape...");
  await send("Runtime.evaluate", {
    expression: `(function() {
      if (window.CB && window.CB.app && window.CB.app.drive) {
        window.CB.app.drive('race', { quick: true });
      } else if (window.CB && window.CB.race && window.CB.race.ui && window.CB.race.ui.launch) {
        window.CB.race.ui.launch({ autoStart: true, discipline: 'race' });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 5000));
  await takeScreenshot(path.join("d:\\my project\\game rea", "mobile_landscape_race.png"));

  console.log("All screenshots captured successfully!");
  ws.close();
  chromeProcess.kill();
  process.exit(0);
}

capture().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
