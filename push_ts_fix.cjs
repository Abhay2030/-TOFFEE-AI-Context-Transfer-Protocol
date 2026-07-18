const { execSync } = require('child_process');
try {
  console.log("Adding...");
  execSync('git add packages/backend/src/services/anthropic.service.ts', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Committing...");
  execSync('git commit -m "fix: remove unused preview variable breaking backend build"', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Pushing...");
  const out = execSync('git push origin main', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('push_ts_status.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('push_ts_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
