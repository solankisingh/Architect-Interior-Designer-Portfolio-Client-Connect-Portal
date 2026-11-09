const { spawn } = require('child_process');
const path = require('path');

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

console.log('🚀 Starting ArchiConnect Portal development servers...');
console.log('-------------------------------------------------------');

// Start backend
const serverProcess = spawn('node', ['src/index.js'], {
  cwd: serverDir,
  env: { ...process.env, PORT: 5000 },
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[API]\x1b[0m ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[API ERR]\x1b[0m ${data}`);
});

// Start frontend
const vitePath = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');
const clientProcess = spawn('node', [vitePath], {
  cwd: clientDir,
  stdio: 'pipe'
});

clientProcess.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[UI]\x1b[0m ${data}`);
});

clientProcess.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[UI ERR]\x1b[0m ${data}`);
});

const cleanup = () => {
  console.log('\n🛑 Shutting down servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
