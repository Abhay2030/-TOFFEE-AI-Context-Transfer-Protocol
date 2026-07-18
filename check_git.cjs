const { execSync } = require('child_process');
try {
  const out = execSync('git status', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('git_status.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('git_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
