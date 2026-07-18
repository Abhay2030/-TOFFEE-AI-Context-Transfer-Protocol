const { execSync } = require('child_process');
try {
  const out = execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('build_output.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('build_output.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
