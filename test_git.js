const { execSync } = require('child_process');
const fs = require('fs');

const base = "C:\\Users\\Roberth 2\\Desktop\\Gilmer\\Nuvelshapestore";

// Set git config for the operation
try {
  execSync('git config user.name "dejesusgonzalezalvarez-glitch"', { cwd: base });
  execSync('git config user.email "admin@nuvelshape.store"', { cwd: base });
  fs.appendFileSync('debug.log', 'Git config set successfully\n\n');
} catch (e) {
  fs.appendFileSync('debug.log', 'Error setting git config: ' + (e.stderr || e.message) + '\n\n');
}

// List remote branches
try {
  const result = execSync('git ls-remote --heads origin', { cwd: base, encoding: 'utf8' });
  fs.appendFileSync('debug.log', 'Remote branches:\n' + result + '\n\n');
} catch (e) {
  fs.appendFileSync('debug.log', 'Error listing branches: ' + (e.stderr || e.message) + '\n\n');
}

// List remote files
try {
  const result2 = execSync('git ls-tree -r origin HEAD --name-only', { cwd: base, encoding: 'utf8' });
  fs.appendFileSync('debug.log', 'Remote files:\n' + result2 + '\n\n');
} catch (e2) {
  fs.appendFileSync('debug.log', 'Error listing remote files: ' + (e2.stderr || e2.message) + '\n\n');
}

// Try push with force
try {
  const result3 = execSync('git push -u origin feature/pdp-faja-nuvel --force', { cwd: base, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.appendFileSync('debug.log', 'Push success: ' + result3 + '\n\n');
} catch (e3) {
  fs.appendFileSync('debug.log', 'Push error: ' + (e3.stderr || e3.message) + '\n\n');
}

// Check status
try {
  const result4 = execSync('git status', { cwd: base, encoding: 'utf8' });
  fs.appendFileSync('debug.log', 'Status:\n' + result4 + '\n\n');
} catch (e4) {
  fs.appendFileSync('debug.log', 'Error status: ' + (e4.stderr || e4.message) + '\n\n');
}

console.log('Debug info written to debug.log');