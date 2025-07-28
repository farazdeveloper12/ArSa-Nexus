#!/bin/bash

echo "🚀 ArSa Nexus Quick Fix Script"
echo "=============================="

echo "📁 Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔄 Restarting PM2..."
    pm2 restart all --update-env
    
    echo "📊 PM2 Status:"
    pm2 status
    
    echo ""
    echo "🎉 Quick fix completed successfully!"
    echo "✅ Website should now load faster"
    echo "✅ Build manifest errors should be resolved"
    echo "✅ Training pages should work properly"
    echo ""
    echo "🔗 Test your website: https://arsanexus.com"
    
else
    echo "❌ Build failed!"
    echo "Please check the error messages above."
    echo "Common fixes:"
    echo "1. Check for syntax errors in code"
    echo "2. Verify all dependencies are installed"
    echo "3. Check Node.js version compatibility"
fi 