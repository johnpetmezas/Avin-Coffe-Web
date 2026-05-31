const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('☕ [AVIN MIX] Building website...');
execSync('npm run build', { stdio: 'inherit' });

console.log('☕ [AVIN MIX] Building order-taking application...');
execSync('npm run build', { cwd: path.join(__dirname, 'app'), stdio: 'inherit' });

console.log('☕ [AVIN MIX] Merging application build into website subfolder...');
const distAppPath = path.join(__dirname, 'dist', 'app');
if (fs.existsSync(distAppPath)) {
  fs.rmSync(distAppPath, { recursive: true, force: true });
}

// Copy app/dist directory to dist/app
fs.mkdirSync(distAppPath, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(__dirname, 'app', 'dist'), distAppPath);
console.log('✅ [AVIN MIX] All builds completed successfully! Compiled app available at dist/app/');
