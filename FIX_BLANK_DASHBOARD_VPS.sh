#!/bin/bash

echo "🚨 EMERGENCY FIX: BLANK DASHBOARD - MISSING BUILD FILES"
echo "======================================================"

# Emergency stop all processes
echo "📛 Force stopping all PM2 processes..."
pm2 kill
sleep 3

# Remove corrupted build files
echo "🧹 Removing corrupted build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

# Clear all caches
echo "🗑️  Clearing all caches..."
npm cache clean --force
yarn cache clean 2>/dev/null || true

# Reinstall dependencies (in case of corruption)
echo "📦 Reinstalling dependencies..."
rm -rf node_modules
npm install

# Force rebuild with production optimizations
echo "🏗️  Force rebuilding application..."
export NODE_ENV=production
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ Build failed! Check for errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Start fresh PM2 instance
echo "🚀 Starting fresh PM2 instance..."
pm2 start npm --name "arsanexus" -- start
sleep 5

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Set PM2 to start on boot
echo "⚙️  Setting PM2 startup..."
pm2 startup

echo ""
echo "📊 Checking PM2 status..."
pm2 status

echo ""
echo "🌐 Checking application health..."
sleep 5
curl -I https://arsanexus.com/admin/dashboard || echo "⚠️  Site may still be starting..."

echo ""
echo "✅ EMERGENCY FIX COMPLETED!"
echo "======================================================"
echo ""
echo "🧪 TEST NOW:"
echo "1. Go to: https://arsanexus.com/admin/login"
echo "2. Login with admin credentials"
echo "3. Dashboard should load completely (no blank page)"
echo "4. Check browser console - no 404 errors for JS files"
echo ""
echo "🔍 IF STILL BLANK PAGE:"
echo "- Wait 30 seconds for PM2 to fully start"
echo "- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)"
echo "- Clear browser cache"
echo "- Try incognito/private mode"
echo ""
echo "📞 Debug commands:"
echo "pm2 logs arsanexus --lines 20"
echo "pm2 monit"
echo "ls -la .next/static/" 