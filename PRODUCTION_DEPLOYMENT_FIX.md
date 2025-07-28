
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

