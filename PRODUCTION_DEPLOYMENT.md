# ArSa Nexus - Production Deployment Guide

## 🚀 Deploying to Hostinger with Domain arsanexus.com

This guide will walk you through deploying your ArSa Nexus website to Hostinger production environment.

---

## 📋 Pre-Deployment Checklist

### ✅ Security Updates Completed
- [x] Dashboard button removed from user interface (only visible to admin/manager)
- [x] Admin routes secured with proper role-based access control
- [x] All admin pages now support both admin and manager roles

### ✅ Production Readiness
- [x] Next.js configuration optimized for production
- [x] Security headers configured
- [x] Environment variables template ready

---

## 🔧 Step 1: Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```bash
# ===== REQUIRED FOR PRODUCTION =====

# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/arsanexus?retryWrites=true&w=majority

# NextAuth.js Configuration (REQUIRED)
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=https://arsanexus.com

# JWT Secret (REQUIRED) 
JWT_SECRET=your-jwt-secret-key-here

# ===== OPTIONAL BUT RECOMMENDED =====

# Google OAuth (for Google login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Production Settings
NODE_ENV=production
```

### 🔐 Generate Secure Keys
```bash
# Generate NEXTAUTH_SECRET (32+ characters)
openssl rand -base64 32

# Or use online generator: https://generate-secret.vercel.app/32
```

---

## 🗄️ Step 2: Database Setup

### MongoDB Atlas Configuration
1. **Create MongoDB Atlas Account**: https://cloud.mongodb.com/
2. **Create a New Cluster**
3. **Setup Database Access**:
   - Create a database user with username/password
   - Note down the credentials
4. **Setup Network Access**:
   - Add `0.0.0.0/0` for all IPs (or specific Hostinger IPs)
5. **Get Connection String**:
   - Replace `<username>`, `<password>`, and `<database>` in the connection string

### Create Admin User
Run this script to create your admin user:

```bash
# Create admin user in production database
npm run create-admin
```

**Default Admin Credentials** (Change after first login):
- Email: `admin@arsanexus.com`
- Password: `admin123`

---

## 🔧 Step 3: Build and Test Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

**Verify everything works**:
- Visit `http://localhost:3000`
- Test admin login at `http://localhost:3000/auth/login`
- Verify dashboard is only accessible to admin users

---

## 🌐 Step 4: Hostinger Deployment

### Option A: Node.js Hosting (Recommended)

1. **Login to Hostinger Panel**
2. **Go to Hosting → Manage → Node.js**
3. **Create New Node.js App**:
   - **Node.js Version**: 18.x or higher
   - **App Root**: `/public_html/arsanexus.com`
   - **Startup File**: `server.js`
   - **App URL**: `arsanexus.com`

4. **Upload Your Files**:
   ```bash
   # Compress your project (exclude node_modules)
   zip -r arsanexus-production.zip . -x "node_modules/*" ".git/*" ".next/*"
   ```
   - Upload via File Manager or FTP
   - Extract in the app root directory

5. **Set Environment Variables**:
   - In Hostinger Node.js panel, add all environment variables from Step 1
   - **Important**: Set `NEXTAUTH_URL=https://arsanexus.com`

6. **Install Dependencies & Build**:
   ```bash
   # SSH into your server or use Hostinger terminal
   npm install
   npm run build
   ```

### Option B: Static Export (Alternative)

If Node.js hosting isn't available:

1. **Configure for Static Export**:
   ```javascript
   // next.config.js
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. **Build Static Files**:
   ```bash
   npm run build
   ```

3. **Upload `/out` folder** to your domain's public_html directory

---

## 🔒 Step 5: Domain & SSL Setup

### Domain Configuration
1. **Point Domain to Hostinger**:
   - Update nameservers to Hostinger's nameservers
   - Or update A record to point to Hostinger IP

2. **SSL Certificate**:
   - Enable free SSL in Hostinger panel
   - Or upload custom SSL certificate

### DNS Records
```
Type: A
Name: @
Value: [Hostinger Server IP]

Type: CNAME  
Name: www
Value: arsanexus.com
```

---

## 🛡️ Step 6: Security & Performance

### Security Headers (Already configured)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff  
- Referrer-Policy: origin-when-cross-origin

### Performance Optimizations
- Image optimization enabled
- Compression enabled
- CSS optimization enabled

### Admin Access Security
- **Admin Dashboard**: Only accessible to users with `admin` or `manager` roles
- **Secure Admin Login**: Use `/auth/login` with admin credentials
- **Hidden Admin Access**: Available at `/hidden-admin-login` with additional security

---

## 🔧 Step 7: Post-Deployment Setup

### 1. Test Your Website
```bash
# Test main website
curl -I https://arsanexus.com

# Test admin login
# Visit: https://arsanexus.com/auth/login
```

### 2. Create Additional Admin Users
1. Login with default admin account
2. Go to Admin Dashboard → Users → Add New User
3. Create additional admin/manager accounts
4. **Change default admin password**

### 3. Configure Website Content
1. Go to Admin Dashboard → Website Content
2. Update all website text, images, and settings
3. Update contact information and social media links

---

## 🔍 Step 8: Monitoring & Maintenance

### Regular Tasks
- **Monitor Database**: Check MongoDB Atlas for performance
- **Update Dependencies**: `npm update` monthly
- **Backup Database**: Regular MongoDB backups
- **Monitor Logs**: Check Hostinger logs for errors

### Performance Monitoring
- **Google PageSpeed Insights**: Test site speed
- **GTmetrix**: Monitor loading performance  
- **Uptime Monitoring**: Set up uptime alerts

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Working
```bash
# Check if variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
```

#### 2. Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check username/password in connection string
- Ensure database exists

#### 3. NextAuth Errors
- Verify `NEXTAUTH_URL` matches your domain exactly
- Ensure `NEXTAUTH_SECRET` is at least 32 characters
- Check Google OAuth settings if using Google login

#### 4. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 5. Admin Access Issues
- Use direct admin login: `https://arsanexus.com/auth/login`
- Check user role in database
- Reset admin password using database directly

---

## 📞 Support

If you encounter issues:

1. **Check Hostinger Documentation**: Hostinger support for Node.js hosting
2. **Database Issues**: MongoDB Atlas support
3. **Domain Issues**: Domain registrar support

---

## 🎉 Deployment Complete!

Your ArSa Nexus website is now live at **https://arsanexus.com**

### Admin Access:
- **Website**: https://arsanexus.com
- **Admin Login**: https://arsanexus.com/auth/login
- **Secure Admin**: https://arsanexus.com/hidden-admin-login

**Remember to**:
- Change default admin password
- Add your real content and images  
- Test all functionality thoroughly
- Set up monitoring and backups

### Next Steps:
1. Update website content via Admin Dashboard
2. Add real training programs and products
3. Configure email notifications
4. Set up analytics and monitoring

**Your professional ArSa Nexus website is now ready for business!** 🚀 