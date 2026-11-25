import { chromium } from 'file:///C:/Users/ASSDi/AppData/Local/npm-cache/_npx/a1722018f28f9df2/node_modules/playwright-core/index.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, 'assets', 'cards');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const CARDS = [
  // Game Modes
  { id: 'mode_race', title: 'QUICK RACE', sub: 'CIRCUIT · 8 CARS', bg: ['#0f172a', '#1e3a8a', '#e0412f'], color: '#ff4733' },
  { id: 'mode_drift', title: 'DRIFT ATTACK', sub: 'MOUNTAIN · TANDEM', bg: ['#18021e', '#701a75', '#a855f7'], color: '#c084fc' },
  { id: 'mode_arcade', title: 'ARCADE STUNTS', sub: 'RAMPS · NITRO', bg: ['#022c22', '#065f46', '#10b981'], color: '#34d399' },
  { id: 'mode_derby', title: 'DEMO DERBY', sub: 'ARENA · CRUSH', bg: ['#450a0a', '#991b1b', '#ef4444'], color: '#f87171' },
  { id: 'mode_drag', title: 'DRAG STRIP', sub: '1/4 MILE · TREE', bg: ['#451a03', '#b45309', '#f59e0b'], color: '#fbbf24' },
  { id: 'mode_f1', title: 'FORMULA 1', sub: 'GRAND PRIX · DRS', bg: ['#0a0e1a', '#1e293b', '#38bdf8'], color: '#38bdf8' },
  { id: 'mode_timetrial', title: 'TIME TRIAL', sub: 'SOLO · GHOST LAP', bg: ['#111827', '#374151', '#9ca3af'], color: '#cbd5e1' },
  { id: 'mode_challenges', title: 'CHALLENGES', sub: 'SLALOM · ACADEMY', bg: ['#2e1065', '#581c87', '#c084fc'], color: '#e879f9' },
  { id: 'mode_online', title: 'MULTIPLAYER', sub: 'LOBBY · P2P ROOMS', bg: ['#082f49', '#0369a1', '#00e5ff'], color: '#22d3ee' },
  { id: 'mode_career', title: 'PRO CAREER', sub: 'SEASON 3 · TROPHIES', bg: ['#1c1917', '#44403c', '#c9a56b'], color: '#f59e0b' },

  // Track Cards
  { id: 'track_dhaka_gp', title: 'DHAKA GP CIRCUIT', sub: '4.8 KM · 16 TURNS', bg: ['#090d16', '#1e3a8a', '#2563eb'], color: '#60a5fa' },
  { id: 'track_mountain_pass', title: 'MOUNTAIN PASS', sub: '6.2 KM · DOWNHILL', bg: ['#150e24', '#581c87', '#9333ea'], color: '#c084fc' },
  { id: 'track_neon_harbor', title: 'NEON HARBOR', sub: '3.9 KM · NIGHT DOCKS', bg: ['#06202a', '#0e7490', '#06b6d4'], color: '#22d3ee' },

  // Car Thumbnails
  { id: 'car_porsche_911', title: 'PORSCHE 911 GT3', sub: '502 HP · RWD', bg: ['#181a20', '#252936', '#e0412f'], color: '#c8102e' },
  { id: 'car_bmw_m4', title: 'BMW M4 COMPETITION', sub: '503 HP · RWD', bg: ['#181a20', '#252936', '#0066b1'], color: '#0066b1' },
  { id: 'car_supra_a90', title: 'GR SUPRA RZ', sub: '382 HP · RWD', bg: ['#181a20', '#252936', '#ea580c'], color: '#ea580c' },
  { id: 'car_ferrari_sf90', title: 'FERRARI SF90', sub: '986 HP · AWD', bg: ['#181a20', '#252936', '#d40000'], color: '#d40000' },
  { id: 'car_mclaren_p1', title: 'MCLAREN P1', sub: '903 HP · RWD', bg: ['#181a20', '#252936', '#ff6f00'], color: '#ff6f00' },
  { id: 'car_skyline_r34', title: 'SKYLINE GT-R R34', sub: '327 HP · AWD', bg: ['#181a20', '#252936', '#1a4480'], color: '#1a4480' }
];

async function generate() {
  console.log('[CARDS] Launching Playwright to render compressed WebP assets...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  for (const card of CARDS) {
    const isCar = card.id.startsWith('car_');
    const width = isCar ? 320 : 480;
    const height = isCar ? 200 : 270;

    const webpDataUrl = await page.evaluate((args) => {
      const { width, height, card, isCar } = args;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, card.bg[0]);
      grad.addColorStop(0.65, card.bg[1]);
      grad.addColorStop(1, card.bg[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. High-Tech Grid Pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Diagonal Racing Stripes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let i = -width; i < width * 2; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 15, 0);
        ctx.lineTo(i + 15 + height, height);
        ctx.lineTo(i + height, height);
        ctx.closePath();
        ctx.fill();
      }

      // 4. Stylized Car Silhouette (Vector Path)
      ctx.save();
      ctx.translate(width - (isCar ? 200 : 250), 30);
      const scale = isCar ? 0.48 : 0.60;
      ctx.scale(scale, scale);

      ctx.fillStyle = card.color;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 12;

      ctx.beginPath();
      // Aerodynamic profile path
      ctx.moveTo(20, 120);
      ctx.bezierCurveTo(40, 118, 70, 118, 90, 120);
      ctx.bezierCurveTo(110, 95, 140, 75, 190, 70);
      ctx.bezierCurveTo(240, 65, 290, 68, 330, 85);
      ctx.bezierCurveTo(360, 98, 375, 112, 390, 120);
      ctx.bezierCurveTo(380, 135, 340, 135, 320, 135);
      ctx.bezierCurveTo(310, 115, 280, 115, 270, 135);
      ctx.bezierCurveTo(200, 135, 150, 135, 120, 135);
      ctx.bezierCurveTo(110, 115, 80, 115, 70, 135);
      ctx.bezierCurveTo(50, 135, 30, 135, 20, 120);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.stroke();

      // Wheels
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0a0d14';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(95, 128, 20, 0, Math.PI * 2);
      ctx.arc(295, 128, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // 5. Dark Vignette at Bottom
      const vigGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      vigGrad.addColorStop(0, 'rgba(8, 9, 11, 0.0)');
      vigGrad.addColorStop(1, 'rgba(8, 9, 11, 0.92)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, width, height);

      // 6. Typography & Badges
      // Tag
      ctx.fillStyle = card.color;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('REDLINE RACING', 20, height - 54);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic bold ' + (isCar ? '18px' : '23px') + ' sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 8;
      ctx.fillText(card.title, 20, height - 30);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillText(card.sub, 20, height - 14);

      return canvas.toDataURL('image/webp', 0.85);
    }, { width, height, card, isCar });

    const base64Data = webpDataUrl.replace(/^data:image\/webp;base64,/, '');
    const outPath = path.join(OUT_DIR, `${card.id}.webp`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));

    const stat = fs.statSync(outPath);
    const sizeKb = (stat.size / 1024).toFixed(1);
    console.log(`  [OK] ${card.id}.webp -> ${sizeKb} KB (Target <= 60 KB: ${stat.size <= 60 * 1024})`);
  }

  await browser.close();
  console.log(`\n[COMPLETE] All ${CARDS.length} WebP card and hero assets rendered to ${OUT_DIR}`);
}

generate().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
