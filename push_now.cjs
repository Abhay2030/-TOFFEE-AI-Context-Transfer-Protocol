const { execSync } = require('child_process');
try {
  console.log("Adding...");
  execSync('git add .github/workflows/main.yml', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Committing...");
  execSync('git commit -m "ci: inject mock env variables to fix backend tests in github actions"', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Pushing...");
  const out = execSync('git push origin main', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('push_status.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('push_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
