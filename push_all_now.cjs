const { execSync } = require('child_process');
try {
  console.log("Adding...");
  execSync('git add .', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("Committing...");
  try {
    execSync('git commit -m "chore: push pending updates"', { encoding: 'utf-8', stdio: 'pipe' });
  } catch (err) {
    if (err.stdout && err.stdout.includes('nothing to commit')) {
      console.log('Nothing to commit, tree is clean.');
    } else {
      throw err;
    }
  }
  console.log("Pushing...");
  const out = execSync('git push origin main', { encoding: 'utf-8', stdio: 'pipe' });
  require('fs').writeFileSync('push_all_status.txt', 'SUCCESS:\n' + out);
} catch (e) {
  require('fs').writeFileSync('push_all_status.txt', 'FAILED:\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
