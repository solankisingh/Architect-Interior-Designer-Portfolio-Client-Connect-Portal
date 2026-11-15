// Simple script to replace Tailwind class 'text-xs' with 'text-sm' across .jsx and .js files
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, 'src');
function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/text-xs\b/g, 'text-sm');
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}
walk(dir);

