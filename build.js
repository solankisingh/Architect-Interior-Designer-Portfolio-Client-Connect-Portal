const { execSync } = require('child_process');
const path = require('path');

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

console.log('🏗️ Building ArchiConnect Portal for Production...');

function run(command, cwd) {
  console.log(`\n> [${path.basename(cwd)}] ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

try {
  // 1. Install server dependencies (including prisma)
  console.log('\n📦 Installing Server Dependencies...');
  run('npm install --include=dev', serverDir);

  // 2. Generate Prisma Client & Push DB schema
  console.log('\n🗄️ Setting up Database with Prisma...');
  const prismaBin = path.join('node_modules', 'prisma', 'build', 'index.js');
  run(`node "${prismaBin}" generate`, serverDir);
  run(`node "${prismaBin}" db push`, serverDir);

  // 3. Seed Database with Real Professional & Portfolio Data
  console.log('\n🌱 Seeding Database with Real Profiles...');
  run('node prisma/seed.js', serverDir);

  // 4. Install client dependencies (including vite & tailwind) & build frontend
  console.log('\n🎨 Installing Client Dependencies & Building UI...');
  run('npm install --include=dev', clientDir);
  const viteBin = path.join('node_modules', 'vite', 'bin', 'vite.js');
  run(`node "${viteBin}" build`, clientDir);

  console.log('\n✨ Build completed successfully! Ready for unified deployment.');
} catch (error) {
  console.error('\n❌ Production build failed:', error);
  process.exit(1);
}
