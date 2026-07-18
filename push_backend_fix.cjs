const { execSync } = require('child_process');
try {
  console.log("Adding backend bundles...");
  execSync('git add packages/backend/src/modules/bundles/index.ts', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Committing...");
  execSync('git commit -m "fix(backend): remove unused reply parameter causing TS6133 CI failure"', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Pushing...");
  const out = execSync('git push origin main', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('push_backend_status.txt', 'SUCCESS:\n' + out);
  console.log("Successfully pushed!");
} catch (e) {
  require('fs').writeFileSync('push_backend_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
  console.error("Failed to push!");
}
