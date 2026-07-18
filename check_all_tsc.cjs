const { execSync } = require('child_process');
const fs = require('fs');

let log = '';

function check(dir) {
  try {
    const out = execSync('npx tsc --noEmit', { cwd: dir, encoding: 'utf-8', stdio: 'pipe' });
    log += `[SUCCESS] ${dir}\n${out}\n\n`;
  } catch (e) {
    log += `[FAILED] ${dir}\nstdout: ${e.stdout}\nstderr: ${e.stderr}\n\n`;
  }
}

check('packages/shared');
check('packages/backend');
check('packages/extension');
check('packages/web'); // web doesn't use tsc strictly for next build but let's check

fs.writeFileSync('tsc_errors.txt', log);
