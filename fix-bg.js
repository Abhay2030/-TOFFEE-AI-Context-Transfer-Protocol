const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('packages/web/src/app');
files.push('packages/web/src/components/layout/Navbar.tsx');
files.push('packages/web/src/components/layout/Footer.tsx');

let changedCount = 0;
files.forEach(file => {
  if (file.includes('DynamicBackground.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Target exact matches of bg-navy-950 surrounded by space, quote, or backtick.
  // Note: We use string replace with regex that checks word boundaries to avoid replacing bg-navy-950/50
  
  // Replace space + bg-navy-950 + space
  content = content.replace(/ bg-navy-950(?=[\s\"\'\`])/g, '');
  
  // Replace quote + bg-navy-950 + quote
  content = content.replace(/\"bg-navy-950\"/g, '\"\"');
  
  // Replace quote + bg-navy-950 + space
  content = content.replace(/\"bg-navy-950 /g, '\"');

  // Replace bg-navy-950 alone if it's the only class (unlikely but just in case)
  content = content.replace(/\bbg-navy-950\b/g, (match, offset, string) => {
    // Check next character to ensure it's not a slash
    if (string[offset + match.length] === '/') return match;
    return '';
  });

  if (original !== content) {
    fs.writeFileSync(file, content);
    changedCount++;
    console.log('Updated', file);
  }
});
console.log('Total files fixed:', changedCount);
