#!/bin/bash

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
