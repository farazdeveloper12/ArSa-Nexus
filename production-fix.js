#!/usr/bin/env node

/**
 * ArSa Nexus - Production Deployment Fix
 * Fixes all the issues with the live website on arsanexus.com
 * 
 * This script helps configure your VPS server for production deployment.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ArSa Nexus Production Deployment Fix');
console.log('=====================================');
console.log('');

// Check if we're in the correct directory
if (!fs.existsSync('package.json')) {
  console.log('❌ Error: Please run this script from your project root directory');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.name !== 'arsa-nexus') {
  console.log('❌ Error: This script should be run in the arsa-nexus project directory');
  process.exit(1);
}

console.log('✅ Detected ArSa Nexus project');
console.log('');

// Production Environment Variables Template
const productionEnvTemplate = `# ===== PRODUCTION ENVIRONMENT VARIABLES FOR ARSANEXUS.COM =====
# Copy these to your VPS server environment or .env.local file

# ===== CRITICAL: NEXTAUTH CONFIGURATION =====
NEXTAUTH_URL=https://arsanexus.com
NEXTAUTH_SECRET=your-super-secret-32-character-key-here-replace-this

# ===== DATABASE CONNECTION =====
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arsanexus?retryWrites=true&w=majority

# ===== JWT SECRET =====
JWT_SECRET=your-jwt-secret-key-minimum-32-characters

# ===== PRODUCTION SETTINGS =====
NODE_ENV=production

# ===== OPTIONAL: GOOGLE OAUTH =====
# Only needed if you want Google login to work
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ===== OPTIONAL: FILE UPLOAD =====
# Only needed if you use AWS S3 for file uploads
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=arsanexus-uploads
`;

// Google OAuth Configuration Instructions
const googleOAuthInstructions = `
🔧 GOOGLE OAUTH CONFIGURATION FOR PRODUCTION
============================================

Your Google OAuth settings need to be updated for production:

1. Go to: https://console.developers.google.com/
2. Select your project
3. Navigate to "Credentials" → "OAuth 2.0 Client IDs"
4. Click on your existing OAuth client or create a new one
5. Update the following settings:

   AUTHORIZED JAVASCRIPT ORIGINS:
   ✅ https://arsanexus.com
   ❌ Remove: http://localhost:3000

   AUTHORIZED REDIRECT URIS:
   ✅ https://arsanexus.com/api/auth/callback/google
   ❌ Remove: http://localhost:3000/api/auth/callback/google

6. Save the changes
7. Copy the Client ID and Client Secret to your production environment

`;

// Hostinger/VPS Deployment Instructions
const vpsInstructions = `
🌐 VPS/HOSTINGER DEPLOYMENT INSTRUCTIONS
=======================================

STEP 1: Upload your project to the VPS
--------------------------------------
1. Upload all project files to your VPS public_html directory
2. Make sure node_modules is NOT uploaded (will install fresh)

STEP 2: Set Environment Variables on VPS
----------------------------------------
Method A - Create .env.local file on server:
1. SSH into your VPS
2. Navigate to your project directory
3. Create .env.local file with the content above
4. Set proper permissions: chmod 600 .env.local

Method B - Use Hostinger Environment Variables:
1. Log into Hostinger panel
2. Go to Advanced → Environment Variables
3. Add each variable from the template above

STEP 3: Install Dependencies and Build
-------------------------------------
SSH into your VPS and run:

cd /path/to/your/project
npm install
npm run build
npm start

STEP 4: Configure Web Server (if using Apache/Nginx)
---------------------------------------------------
Make sure your web server is configured to:
- Serve static files from .next/static/
- Proxy all other requests to your Next.js app (port 3000 by default)
- Enable SSL/HTTPS for arsanexus.com

`;

// Quick fixes for common issues
const quickFixes = `
🔧 QUICK FIXES FOR COMMON PRODUCTION ISSUES
==========================================

Issue 1: "Failed to fetch training" errors
------------------------------------------
✅ Fix: Set NEXTAUTH_URL=https://arsanexus.com in production environment
✅ Fix: Ensure your API routes are accessible (check firewall/port settings)

Issue 2: Admin login redirects to user pages
--------------------------------------------
✅ Fix: Clear browser cookies and localStorage
✅ Fix: Ensure NextAuth session is working with correct domain

Issue 3: Authentication not persisting
--------------------------------------
✅ Fix: Set secure NEXTAUTH_SECRET (minimum 32 characters)
✅ Fix: Ensure cookies are being set for correct domain

Issue 4: User pages showing login instead of content
---------------------------------------------------
✅ Fix: Update authentication checks to handle production URLs
✅ Fix: Ensure session validation works with production domain

`;

console.log('📋 PRODUCTION CONFIGURATION CHECKLIST');
console.log('=====================================');
console.log('');

// Create production environment file
console.log('1️⃣  Creating production environment template...');
fs.writeFileSync('.env.production.template', productionEnvTemplate);
console.log('✅ Created .env.production.template');
console.log('');

// Create instructions file
console.log('2️⃣  Creating deployment instructions...');
const fullInstructions = googleOAuthInstructions + vpsInstructions + quickFixes;
fs.writeFileSync('PRODUCTION_DEPLOYMENT_FIX.md', fullInstructions);
console.log('✅ Created PRODUCTION_DEPLOYMENT_FIX.md');
console.log('');

// Check current environment issues
console.log('3️⃣  Checking current configuration issues...');
console.log('');

// Check .env.local
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');

  if (envContent.includes('localhost:3000')) {
    console.log('⚠️  WARNING: .env.local contains localhost:3000');
    console.log('   This will cause issues in production!');
    console.log('   You need separate environment variables for production.');
    console.log('');
  }

  if (!envContent.includes('NEXTAUTH_URL')) {
    console.log('❌ MISSING: NEXTAUTH_URL in .env.local');
    console.log('');
  }

  if (!envContent.includes('NEXTAUTH_SECRET')) {
    console.log('❌ MISSING: NEXTAUTH_SECRET in .env.local');
    console.log('');
  }
} else {
  console.log('ℹ️  No .env.local file found (this is normal for production)');
  console.log('');
}

// Check next.config.js for production issues
if (fs.existsSync('next.config.js')) {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  console.log('✅ Found next.config.js');
} else if (fs.existsSync('next.config.mjs')) {
  const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
  console.log('✅ Found next.config.mjs');
} else {
  console.log('⚠️  No next.config.js found - you may need this for production');
}
console.log('');

console.log('4️⃣  IMMEDIATE ACTIONS REQUIRED');
console.log('==============================');
console.log('');

console.log('🎯 FOR YOUR VPS SERVER (arsanexus.com):');
console.log('');
console.log('1. Set these environment variables on your VPS:');
console.log('   NEXTAUTH_URL=https://arsanexus.com');
console.log('   NEXTAUTH_SECRET=your-32-character-secret');
console.log('   NODE_ENV=production');
console.log('');

console.log('2. Update Google OAuth settings:');
console.log('   - Authorized origins: https://arsanexus.com');
console.log('   - Redirect URIs: https://arsanexus.com/api/auth/callback/google');
console.log('');

console.log('3. Restart your Next.js application on the VPS');
console.log('');

console.log('4. Clear browser cache/cookies for arsanexus.com');
console.log('');

console.log('🔍 TESTING CHECKLIST:');
console.log('');
console.log('□ Visit https://arsanexus.com/auth/login');
console.log('□ Try admin login with your credentials');
console.log('□ Check if training pages load: https://arsanexus.com/training');
console.log('□ Verify admin dashboard access');
console.log('□ Test user page navigation');
console.log('');

console.log('📁 FILES CREATED:');
console.log('- .env.production.template (use this as reference for VPS env vars)');
console.log('- PRODUCTION_DEPLOYMENT_FIX.md (detailed instructions)');
console.log('');

console.log('🆘 IF YOU STILL HAVE ISSUES:');
console.log('');
console.log('1. Check VPS logs for errors:');
console.log('   - PM2 logs (if using PM2): pm2 logs');
console.log('   - Application logs in your VPS');
console.log('');

console.log('2. Verify environment variables are loaded:');
console.log('   - SSH to VPS and check: echo $NEXTAUTH_URL');
console.log('   - Should show: https://arsanexus.com');
console.log('');

console.log('3. Test API endpoints directly:');
console.log('   - https://arsanexus.com/api/training');
console.log('   - https://arsanexus.com/api/auth/session');
console.log('');

console.log('✨ Production deployment fix complete!');
console.log('📖 Read PRODUCTION_DEPLOYMENT_FIX.md for detailed instructions.'); 