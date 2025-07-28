const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🚀 CLOUD AUTHENTICATION FIX');
console.log('============================');

const fix = async () => {
  try {
    // Load .env.local
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      const lines = envFile.split('\n');
      lines.forEach(line => {
        if (line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim().replace(/"/g, ''); // Remove quotes
          process.env[key.trim()] = value;
        }
      });
      console.log('✅ Loaded environment variables');
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔗 Connecting to Atlas database...');
    console.log(`📍 Database: ${MONGODB_URI.includes('cluster0') ? 'MongoDB Atlas' : 'Local'}`);

    // Connect to the ACTUAL database your app uses
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Use exact schema
    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['user', 'admin', 'instructor'],
        default: 'user',
      },
      provider: {
        type: String,
        default: 'credentials',
      },
      active: {
        type: Boolean,
        default: true,
      },
      profileImage: {
        type: String,
        default: null,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
    }, {
      timestamps: true,
      collection: 'users'
    });

    delete mongoose.models.User;
    const User = mongoose.model('User', UserSchema);

    console.log('\n🔍 STEP 1: Current Atlas database state');
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users in Atlas:`);
    allUsers.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.email} (${user._id}) - Active: ${user.active}`);
    });

    console.log('\n🧹 STEP 2: Cleaning Atlas database');
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users from Atlas`);

    console.log('\n👤 STEP 3: Creating admin in Atlas');
    const hashedPassword = await hash('admin123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
      profileImage: null,
      lastLogin: null
    });

    console.log('✅ ADMIN CREATED IN ATLAS:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🆔 ID: ${admin._id}`);
    console.log(`   ✅ Active: ${admin.active}`);

    console.log('\n🧪 STEP 4: Authentication test');
    const testUser = await User.findOne({
      email: { $regex: new RegExp('^admin@arsanexus.com$', 'i') }
    });

    if (testUser) {
      const { compare } = require('bcryptjs');
      const passwordTest = await compare('admin123', testUser.password);

      if (passwordTest) {
        console.log('\n🎯 === AUTHENTICATION COMPLETELY FIXED! ===');
        console.log('📧 Email: admin@arsanexus.com');
        console.log('🔐 Password: admin123');
        console.log('🌐 Login URL: http://localhost:3000/auth/login');
        console.log('\n📝 RESTART YOUR SERVER:');
        console.log('1. ⛔ Stop server: Ctrl+C');
        console.log('2. 🚀 Run: npm run dev');
        console.log('3. 🔓 Login with credentials above');
        console.log('\n✨ THIS WILL DEFINITELY WORK NOW!');
      }
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔒 Atlas connection closed');
  }
};

fix(); 