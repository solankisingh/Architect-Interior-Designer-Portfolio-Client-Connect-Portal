const { spawn } = require('child_process');
const path = require('path');

const serverDir = path.join(__dirname, 'server');

console.log('🏛️ Starting ArchiConnect Unified Production Server...');
console.log(`Port: ${process.env.PORT || 5000}`);

const serverProcess = spawn('node', ['src/index.js'], {
  cwd: serverDir,
  env: { ...process.env, PORT: process.env.PORT || 5000, NODE_ENV: 'production' },
  stdio: 'inherit'
});

serverProcess.on('exit', (code) => {
  process.exit(code);
});
