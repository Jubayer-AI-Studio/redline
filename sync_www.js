const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WWW = path.join(ROOT, 'www');

// Ensure www exists
if (!fs.existsSync(WWW)) {
  fs.mkdirSync(WWW, { recursive: true });
}

const copyList = [
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon.svg',
  'sw.js',
  'css',
  'js',
  'assets',
  'audio',
  'img',
  'vendor'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Syncing runtime assets to www/ for Android packaging...');
for (const item of copyList) {
  const src = path.join(ROOT, item);
  const dest = path.join(WWW, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
  }
}

console.log('www/ sync complete.');
