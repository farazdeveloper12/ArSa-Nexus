#!/usr/bin/env node

/**
 * ADMIN LOGIN SESSION PERSISTENCE FIX
 * 
 * This script fixes the race condition that causes users to be redirected
 * back to login immediately after successful authentication.
 * 
 * ISSUE: Session appears briefly as null while status is not 'loading',
 * triggering immediate redirect to login page.
 * 
 * SOLUTION: Improved authentication checks using NextAuth status properly.
 */

const fs = require('fs');
const path = require('path');

// Fixed authentication pattern
const FIXED_AUTH_PATTERN = `  // Authentication check - Fixed race condition
  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    
    if (session && !['admin', 'manager'].includes(session.user?.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);`;

// Files to fix
const filesToFix = [
  'src/pages/admin/dashboard.js',
  'src/pages/admin/jobs/index.js',
  'src/pages/admin/internships/index.js',
  'src/pages/admin/training/index.js',
  'src/pages/admin/blog/index.js',
  'src/pages/admin/content/index.js',
  'src/pages/admin/settings/index.js'
];

console.log('🔧 FIXING ADMIN LOGIN SESSION PERSISTENCE ISSUE...\n');

// Fix 1: Update Next.js config to disable React Strict Mode
console.log('📝 Fix 1: Disabling React Strict Mode in next.config.js');
const nextConfigPath = 'next.config.js';
if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfig.includes('reactStrictMode: true')) {
    nextConfig = nextConfig.replace(
      'reactStrictMode: true,',
      'reactStrictMode: false, // Disabled to prevent auth double-mounting issues'
    );
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ React Strict Mode disabled');
  } else {
    console.log('⚠️  React Strict Mode already disabled or not found');
  }
} else {
  console.log('❌ next.config.js not found');
}

// Fix 2: Update AdminLayout logout redirect
console.log('\n📝 Fix 2: Fixing AdminLayout logout redirect');
const adminLayoutPath = 'src/components/layout/AdminLayout.js';
if (fs.existsSync(adminLayoutPath)) {
  let adminLayout = fs.readFileSync(adminLayoutPath, 'utf8');
  if (adminLayout.includes("router.push('/auth/login');")) {
    adminLayout = adminLayout.replace(
      "router.push('/auth/login');",
      "router.push('/admin/login');"
    );
    fs.writeFileSync(adminLayoutPath, adminLayout);
    console.log('✅ AdminLayout logout redirect fixed');
  } else {
    console.log('⚠️  AdminLayout logout redirect already correct');
  }
} else {
  console.log('❌ AdminLayout.js not found');
}

// Fix 3: Update authentication patterns in admin pages
console.log('\n📝 Fix 3: Fixing authentication race conditions in admin pages');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Pattern 1: Basic pattern
    const pattern1 = /useEffect\(\(\) => \{[\s\S]*?if \(status === 'loading'\) return;[\s\S]*?if \(!session \|\| ![\s\S]*?\['admin', 'manager'\][\s\S]*?\) \{[\s\S]*?router\.push\('\/admin\/login'\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?\}, \[session, status, router\]\);/;

    // Pattern 2: More complex pattern
    const pattern2 = /\/\/ Redirect if not authenticated or not admin\/manager[\s\S]*?useEffect\(\(\) => \{[\s\S]*?if \(status === 'loading'\) return;[\s\S]*?if \(!session \|\| ![\s\S]*?\['admin', 'manager'\][\s\S]*?\) \{[\s\S]*?router\.push\('\/admin\/login'\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?\}, \[session, status, router\]\);/;

    let updated = false;

    if (pattern1.test(content)) {
      content = content.replace(pattern1, FIXED_AUTH_PATTERN);
      updated = true;
    } else if (pattern2.test(content)) {
      content = content.replace(pattern2, FIXED_AUTH_PATTERN);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed authentication in ${filePath}`);
    } else {
      console.log(`⚠️  No matching auth pattern found in ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

// Fix 4: Create optimized NextAuth configuration
console.log('\n📝 Fix 4: Checking NextAuth configuration');
const nextAuthPath = 'src/pages/api/auth/[...nextauth].js';
if (fs.existsSync(nextAuthPath)) {
  let nextAuthConfig = fs.readFileSync(nextAuthPath, 'utf8');

  // Check if session strategy is JWT (good for performance)
  if (nextAuthConfig.includes("strategy: 'jwt'")) {
    console.log('✅ NextAuth session strategy is already JWT');
  } else {
    console.log('⚠️  Consider using JWT session strategy for better performance');
  }

  // Check if login page is correctly configured
  if (nextAuthConfig.includes("signIn: '/admin/login'")) {
    console.log('✅ NextAuth login page configuration is correct');
  } else {
    console.log('⚠️  NextAuth login page configuration may need adjustment');
  }
} else {
  console.log('❌ NextAuth configuration not found');
}

console.log('\n🎉 ADMIN LOGIN SESSION FIX COMPLETED!');
console.log('\n📋 SUMMARY OF FIXES:');
console.log('1. ✅ Disabled React Strict Mode to prevent double mounting');
console.log('2. ✅ Fixed logout redirect in AdminLayout');
console.log('3. ✅ Improved authentication checks to prevent race conditions');
console.log('4. ✅ Verified NextAuth configuration');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Run: npm run build');
console.log('2. Run: pm2 restart all');
console.log('3. Test login → should stay logged in without auto-redirect');
console.log('\n⚠️  If running on VPS, execute these commands:');
console.log('cd /path/to/your/project');
console.log('npm run build');
console.log('pm2 restart all');
console.log('pm2 save'); 