const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Firebase App Hosting build...');

// Kopiere die Firebase-spezifische Next.js-Konfiguration
if (fs.existsSync('next.config.firebase.js')) {
  fs.copyFileSync('next.config.firebase.js', 'next.config.js');
  console.log('✅ Firebase Next.js config applied');
}

// Führe den Build aus
try {
  console.log('📦 Running Next.js build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Firebase App Hosting build ready!');
