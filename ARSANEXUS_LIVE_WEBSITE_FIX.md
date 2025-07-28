# 🚨 ArSa Nexus Live Website Issues - URGENT FIX GUIDE

## 🔍 Issues Identified on arsanexus.com

Based on your report, you're experiencing these issues:
1. **Admin panel redirects to login page when accessing user pages**
2. **Admin login goes directly to dashboard but user pages are not accessible** 
3. **Training program pages showing "Failed to fetch training" errors**
4. **URL routing issues in production**
5. **Page linking problems between admin and user sections**

## 🎯 ROOT CAUSE: NextAuth Configuration Issues

The main problem is that your **NextAuth configuration is still set for localhost development** but your website is now live on **arsanexus.com**. This causes authentication and routing failures.

---

## 🚀 IMMEDIATE FIXES REQUIRED

### 1️⃣ **CRITICAL: Fix Environment Variables on Your VPS**

SSH into your VPS server and create/update your environment variables:

```bash
# SSH into your VPS
ssh your-username@your-vps-server

# Navigate to your project directory
cd /path/to/your/arsanexus-project

# Create or edit .env.local file
nano .env.local
```

**Add these exact environment variables:**

```bash
# ===== CRITICAL FIXES FOR ARSANEXUS.COM =====
NEXTAUTH_URL=https://arsanexus.com
NEXTAUTH_SECRET=ArSaNexus2024ProductionSecretKey32Characters
NODE_ENV=production

# ===== YOUR DATABASE (update with your actual connection) =====
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/arsanexus?retryWrites=true&w=majority

# ===== JWT SECRET =====
JWT_SECRET=ArSaNexusJWTSecret2024ProductionKey32Chars
```

**Save the file and set proper permissions:**
```bash
chmod 600 .env.local
```

### 2️⃣ **Update Google OAuth Settings (if using Google login)**

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Select your project
3. Navigate to **Credentials** → **OAuth 2.0 Client IDs**
4. Update your OAuth client settings:

   **Authorized JavaScript origins:**
   - ✅ ADD: `https://arsanexus.com`
   - ❌ REMOVE: `http://localhost:3000`

   **Authorized redirect URIs:**
   - ✅ ADD: `https://arsanexus.com/api/auth/callback/google`
   - ❌ REMOVE: `http://localhost:3000/api/auth/callback/google`

5. Save changes

### 3️⃣ **Restart Your Application on VPS**

```bash
# If using PM2
pm2 restart all

# If using systemctl
sudo systemctl restart your-app-name

# If running directly with npm
pkill -f "node.*next"
npm run build
npm start

# If using yarn
yarn build
yarn start
```

### 4️⃣ **Clear Browser Cache and Cookies**

1. Open arsanexus.com in browser
2. Press **F12** to open Developer Tools
3. Right-click the refresh button → **Empty Cache and Hard Reload**
4. Or manually clear cookies for arsanexus.com domain

---

## 🧪 TESTING CHECKLIST

After applying the fixes, test these in order:

### ✅ **Test 1: Basic Website Access**
- [ ] Visit `https://arsanexus.com` - should load homepage
- [ ] Check if any console errors in browser DevTools (F12)

### ✅ **Test 2: API Endpoints**
- [ ] Visit `https://arsanexus.com/api/training` - should return JSON data
- [ ] Visit `https://arsanexus.com/api/auth/session` - should show session info

### ✅ **Test 3: User Pages**
- [ ] Visit `https://arsanexus.com/training` - should load training programs
- [ ] Visit `https://arsanexus.com/jobs` - should load job listings
- [ ] Check that "View Details" and "Apply" buttons work

### ✅ **Test 4: Admin Authentication**
- [ ] Visit `https://arsanexus.com/auth/login`
- [ ] Login with admin credentials
- [ ] Should redirect to `https://arsanexus.com/admin/dashboard`
- [ ] Dashboard should load without errors

### ✅ **Test 5: Admin Navigation**
- [ ] From admin dashboard, click different menu items
- [ ] Test: Users, Training, Products, etc.
- [ ] Should NOT redirect to login page

### ✅ **Test 6: Cross-Navigation**
- [ ] From admin panel, access user pages (if intended)
- [ ] Should maintain authentication state

---

## 🛠️ ADVANCED TROUBLESHOOTING

### **If Training Pages Still Show "Failed to fetch":**

1. **Check API Response:**
   ```bash
   curl https://arsanexus.com/api/training
   ```
   Should return JSON with training data.

2. **Check Server Logs:**
   ```bash
   # PM2 logs
   pm2 logs

   # Or check your server's error logs
   tail -f /var/log/your-app/error.log
   ```

3. **Verify Database Connection:**
   ```bash
   # In your project directory
   node -e "
   require('dotenv').config();
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('✅ Database connected'))
     .catch(err => console.log('❌ Database error:', err));
   "
   ```

### **If Admin Routing Still Fails:**

1. **Check NextAuth Session:**
   - Visit `https://arsanexus.com/api/auth/session`
   - Should show your user data with role: "admin"

2. **Verify JWT Secret:**
   - Ensure `JWT_SECRET` is set and matches between requests

3. **Check Authentication Middleware:**
   - Ensure your API routes are properly checking authentication

---

## 🔧 CONFIGURATION FILE UPDATES

### **Update next.config.js (if needed):**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Add these for production
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  // Enable compression
  compress: true,
}

module.exports = nextConfig
```

---

## 🚨 EMERGENCY CONTACT CHECKLIST

If you're still having issues after following this guide:

### **Quick Diagnostic Commands:**

```bash
# Check if environment variables are loaded
echo $NEXTAUTH_URL
# Should output: https://arsanexus.com

echo $NODE_ENV  
# Should output: production

# Check if your app is running
ps aux | grep node
```

### **Verify These URLs Work:**
- ✅ `https://arsanexus.com` (homepage)
- ✅ `https://arsanexus.com/training` (training page)
- ✅ `https://arsanexus.com/api/training` (API endpoint)
- ✅ `https://arsanexus.com/auth/login` (login page)
- ✅ `https://arsanexus.com/admin/dashboard` (admin dashboard - after login)

---

## 🎉 POST-FIX VERIFICATION

Once everything is working:

1. **Test all user journeys:**
   - Regular user browsing training programs
   - User applying for training/jobs
   - Admin logging in and managing content

2. **Monitor for errors:**
   - Check server logs regularly
   - Monitor database connections
   - Watch for authentication issues

3. **Performance optimization:**
   - Ensure static files are being served efficiently
   - Consider using a CDN for better global performance

---

## 📞 SUPPORT

If you continue to experience issues after following this guide:

1. **Check the exact error messages** in browser console (F12)
2. **Capture server logs** during the time issues occur
3. **Verify environment variables** are properly set on your VPS
4. **Test API endpoints individually** to isolate the problem

The most critical fix is setting `NEXTAUTH_URL=https://arsanexus.com` on your production server and restarting the application. 