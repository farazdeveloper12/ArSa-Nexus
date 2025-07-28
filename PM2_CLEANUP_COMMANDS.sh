#!/bin/bash
# PM2 Cleanup and Optimization Script for ArSa Nexus
# Run this on your VPS to fix PM2 multiple instances

echo "🔧 Starting PM2 Cleanup and Optimization..."

# Navigate to app directory
cd /home/arsanexus.com/public_html

# Step 1: Stop and delete ALL existing PM2 processes
echo "📋 Current PM2 processes:"
pm2 list

echo "🛑 Stopping all PM2 processes..."
pm2 stop all
pm2 delete all

# Step 2: Clear PM2 logs and cache
echo "🧹 Cleaning PM2 cache..."
pm2 flush
rm -rf ~/.pm2/logs/*

# Step 3: Start ONLY ONE optimized instance
echo "🚀 Starting single optimized instance..."
pm2 start npm --name "arsanexus-app" -- start \
  --max-memory-restart 500M \
  --node-args="--max-old-space-size=1024" \
  --restart-delay=1000

# Step 4: Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save
pm2 startup

# Step 5: Show final status
echo "✅ PM2 Cleanup Complete!"
pm2 list
pm2 info arsanexus-app

echo "🎯 Now you have only ONE clean PM2 instance running!"
echo "📊 Use 'pm2 monit' to monitor your app performance" 