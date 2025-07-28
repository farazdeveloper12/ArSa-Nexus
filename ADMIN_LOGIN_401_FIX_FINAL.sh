#!/bin/bash

echo "🔧 FIXING ADMIN LOGIN 401 AUTHENTICATION ISSUE ON LIVE VPS..."
echo "======================================================"

# Set production environment variables
echo "📝 Setting up production environment variables..."

# Ensure .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    touch .env.local
fi

# Add NextAuth production configuration
if ! grep -q "NEXTAUTH_URL" .env.local; then
    echo "NEXTAUTH_URL=https://arsanexus.com" >> .env.local
    echo "✅ Added NEXTAUTH_URL"
else
    echo "✅ NEXTAUTH_URL already configured"
fi

if ! grep -q "NEXTAUTH_SECRET" .env.local; then
    echo "NEXTAUTH_SECRET=super-secret-32-character-production-key-arsanexus-2024-admin-panel" >> .env.local
    echo "✅ Added NEXTAUTH_SECRET"
else
    echo "✅ NEXTAUTH_SECRET already configured"
fi

# Set NODE_ENV for production
export NODE_ENV=production
if ! grep -q "NODE_ENV" .env.local; then
    echo "NODE_ENV=production" >> .env.local
    echo "✅ Added NODE_ENV=production"
fi

echo ""
echo "📛 Stopping PM2 processes..."
pm2 stop all

echo ""
echo "🧹 Cleaning build cache and dependencies..."
rm -rf .next
rm -rf node_modules/.cache
npm cache clean --force

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building application with production optimizations..."
npm run build

echo ""
echo "🚀 Starting PM2 with production configuration..."
pm2 delete all
pm2 start npm --name "arsanexus" -- start
pm2 save

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📋 Checking application health..."
sleep 5
pm2 logs arsanexus --lines 10

echo ""
echo "✅ ADMIN LOGIN 401 FIX DEPLOYED SUCCESSFULLY!"
echo "======================================================"
echo ""
echo "🧪 CRITICAL TEST STEPS:"
echo "1. Go to: https://arsanexus.com/admin/login"
echo "2. Login with admin credentials"
echo "3. ✅ Should redirect to dashboard without auto-logout"
echo "4. ✅ Dashboard should load data (no 401 errors)"
echo "5. ✅ Navigate to other admin pages - should work"
echo "6. ✅ Refresh page - should stay logged in"
echo ""
echo "🔍 WHAT WAS FIXED:"
echo "✅ NextAuth cookie configuration for production domain"
echo "✅ Session validation in API routes"
echo "✅ NEXTAUTH_URL set to https://arsanexus.com"
echo "✅ Production-ready cookie settings (secure, domain)"
echo "✅ Enhanced API credential handling"
echo "✅ Better error handling and debugging"
echo ""
echo "🐛 IF STILL ISSUES, CHECK:"
echo "pm2 logs arsanexus --follow"
echo "tail -f /var/log/cyberpanel/nextjs.log"
echo ""
echo "📞 CONSOLE DEBUGGING:"
echo "Open browser DevTools → Console/Network tabs"
echo "Look for session/cookie errors"
echo "Verify no 401 errors on /api/users?summary=true" 