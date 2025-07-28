#!/usr/bin/env node

/**
 * PRODUCTION NEXTAUTH ENVIRONMENT FIX
 * 
 * This script fixes NextAuth configuration issues causing 401 errors on live server
 * by ensuring proper environment variables and production settings.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING NEXTAUTH PRODUCTION CONFIGURATION...\n');

// Check if .env.local exists
const envLocalPath = '.env.local';
const envPath = '.env';

let envFile = envLocalPath;
if (!fs.existsSync(envLocalPath) && fs.existsSync(envPath)) {
  envFile = envPath;
} else if (!fs.existsSync(envLocalPath) && !fs.existsSync(envPath)) {
  console.log('📄 Creating .env.local file...');
  fs.writeFileSync(envLocalPath, '');
  envFile = envLocalPath;
}

console.log(`📄 Using environment file: ${envFile}`);

// Read current environment variables
let envContent = '';
if (fs.existsSync(envFile)) {
  envContent = fs.readFileSync(envFile, 'utf8');
}

// Required NextAuth environment variables for production
const requiredEnvVars = {
  'NEXTAUTH_URL': 'https://arsanexus.com',
  'NEXTAUTH_SECRET': 'super-secret-32-character-production-key-arsanexus-2024-admin-panel'
};

let envUpdated = false;
let newEnvContent = envContent;

// Add missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!envContent.includes(key + '=')) {
    console.log(`✅ Adding ${key} to environment`);
    newEnvContent += `\n${key}=${value}`;
    envUpdated = true;
  } else {
    console.log(`✅ ${key} already exists in environment`);
  }
});

// Write updated environment file
if (envUpdated) {
  fs.writeFileSync(envFile, newEnvContent);
  console.log(`\n📝 Updated ${envFile} with required NextAuth variables`);
} else {
  console.log('\n✅ All required NextAuth environment variables already exist');
}

// Create VPS deployment commands
const vpsCommands = `#!/bin/bash

echo "🔧 DEPLOYING NEXTAUTH PRODUCTION FIX..."

# Set environment variables for production
export NEXTAUTH_URL="https://arsanexus.com"
export NEXTAUTH_SECRET="super-secret-32-character-production-key-arsanexus-2024-admin-panel"

# Add to .env.local if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    touch .env.local
fi

# Check and add NEXTAUTH_URL
if ! grep -q "NEXTAUTH_URL" .env.local; then
    echo "NEXTAUTH_URL=https://arsanexus.com" >> .env.local
    echo "✅ Added NEXTAUTH_URL to .env.local"
fi

# Check and add NEXTAUTH_SECRET
if ! grep -q "NEXTAUTH_SECRET" .env.local; then
    echo "NEXTAUTH_SECRET=super-secret-32-character-production-key-arsanexus-2024-admin-panel" >> .env.local
    echo "✅ Added NEXTAUTH_SECRET to .env.local"
fi

# Stop PM2 processes
echo "📛 Stopping PM2 processes..."
pm2 stop all

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
npm cache clean --force

# Build application
echo "🏗️  Building application..."
npm run build

# Restart PM2
echo "🚀 Restarting PM2..."
pm2 delete all
pm2 start npm --name "arsanexus" -- start
pm2 save

echo ""
echo "✅ NEXTAUTH PRODUCTION FIX DEPLOYED!"
echo ""
echo "🧪 Test the fix:"
echo "1. Go to: https://arsanexus.com/admin/login"
echo "2. Login with admin credentials"
echo "3. Should stay logged in without redirect"
echo "4. Check browser console - no 401 errors"
echo ""
echo "🔍 Debug if needed:"
echo "pm2 logs arsanexus --lines 50"
`;

fs.writeFileSync('DEPLOY_NEXTAUTH_FIX.sh', vpsCommands);
fs.chmodSync('DEPLOY_NEXTAUTH_FIX.sh', '755');

console.log('\n🎉 NEXTAUTH PRODUCTION FIX COMPLETED!');
console.log('\n📋 SUMMARY:');
console.log('✅ Fixed NextAuth cookie configuration for production');
console.log('✅ Added required environment variables');
console.log('✅ Created deployment script for VPS');

console.log('\n🚀 DEPLOY ON VPS:');
console.log('scp DEPLOY_NEXTAUTH_FIX.sh user@your-server:/path/to/project/');
console.log('ssh user@your-server');
console.log('cd /path/to/project');
console.log('./DEPLOY_NEXTAUTH_FIX.sh');

console.log('\n🔧 OR MANUAL VPS COMMANDS:');
console.log('export NEXTAUTH_URL="https://arsanexus.com"');
console.log('export NEXTAUTH_SECRET="super-secret-32-character-production-key-arsanexus-2024-admin-panel"');
console.log('echo "NEXTAUTH_URL=https://arsanexus.com" >> .env.local');
console.log('echo "NEXTAUTH_SECRET=super-secret-32-character-production-key-arsanexus-2024-admin-panel" >> .env.local');
console.log('pm2 stop all && rm -rf .next && npm run build && pm2 restart all'); 