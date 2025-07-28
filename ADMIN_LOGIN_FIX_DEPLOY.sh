#!/bin/bash

echo "🔧 DEPLOYING ADMIN LOGIN SESSION FIX..."

# Stop all PM2 processes
echo "📛 Stopping PM2 processes..."
pm2 stop all

# Clean build artifacts and cache
echo "🧹 Cleaning build cache..."
rm -rf .next
npm cache clean --force

# Reinstall dependencies (optional, only if needed)
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️  Building application..."
npm run build

# Restart PM2 processes
echo "🚀 Starting PM2 processes..."
pm2 delete all
pm2 start npm --name "arsanexus" -- start

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ ADMIN LOGIN SESSION FIX DEPLOYED SUCCESSFULLY!"
echo ""
echo "🧪 TEST STEPS:"
echo "1. Go to: https://arsanexus.com/admin/login"
echo "2. Login with admin credentials"
echo "3. Verify you stay logged in (no auto-redirect)"
echo "4. Navigate between admin pages"
echo "5. Refresh the page - should remain logged in"
echo ""
echo "🎯 EXPECTED BEHAVIOR:"
echo "- Login redirects to dashboard immediately"
echo "- No automatic redirects back to login"
echo "- Session persists across page navigation"
echo "- Admin pages load without authentication issues"
echo ""
echo "📞 If issues persist, check:"
echo "- Browser console for errors"
echo "- Clear browser cache/cookies"
echo "- Try incognito/private browsing mode" 