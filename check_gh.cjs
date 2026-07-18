const { execSync } = require('child_process');
try {
  const out = execSync('gh run list --limit 3', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('gh_status.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('gh_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
