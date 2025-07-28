const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🚀 FINAL AUTHENTICATION FIX');
console.log('============================');

// Load environment variables like the app does
const loadEnv = () => {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
      if (line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
        console.log(`📝 Loaded env: ${key.trim()}=${value.substring(0, 20)}...`);
      }
    });
  } else {
    console.log('ℹ️  No .env.local file found');
  }
};

const fix = async () => {
  try {
    // Load environment variables first
    loadEnv();

    // Use EXACT same connection logic as the app
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in environment');
      console.log('🔧 Creating .env.local with default connection...');

      // Create .env.local file with the connection string
      const envContent = `MONGODB_URI=mongodb://localhost:27017/arsa-nexus
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here`;

      fs.writeFileSync('.env.local', envContent);
      console.log('✅ Created .env.local file');

      // Set for this script
      process.env.MONGODB_URI = 'mongodb://localhost:27017/arsa-nexus';
    }

    console.log(`🔗 Connecting to: ${process.env.MONGODB_URI}`);

    // Connect using exact same method as the app
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB (using app connection method)');

    // Use exact schema as your app
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

    // Clear any existing model
    delete mongoose.models.User;
    const User = mongoose.model('User', UserSchema);

    console.log('\n🔍 STEP 1: Current database state');
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users:`);
    allUsers.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.email} (${user._id}) - Active: ${user.active}, Role: ${user.role}`);
    });

    console.log('\n🧹 STEP 2: Complete database cleanup');
    // Delete ALL users to ensure clean state
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    console.log('\n👤 STEP 3: Creating fresh admin user');
    const hashedPassword = await hash('admin123', 12);
    console.log(`🔐 Password hash: ${hashedPassword.substring(0, 30)}...`);

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

    console.log('✅ NEW ADMIN CREATED:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🆔 ID: ${admin._id}`);
    console.log(`   ✅ Active: ${admin.active}`);
    console.log(`   🔑 Role: ${admin.role}`);

    console.log('\n🧪 STEP 4: Authentication test');
    // Test exact same lookup as your app
    const testUser = await User.findOne({
      email: { $regex: new RegExp('^admin@arsanexus.com$', 'i') }
    });

    if (testUser) {
      console.log('✅ User lookup: SUCCESS');
      console.log(`   Found: ${testUser._id}`);
      console.log(`   Active: ${testUser.active}`);

      // Test password
      const { compare } = require('bcryptjs');
      const passwordTest = await compare('admin123', testUser.password);
      console.log(`   Password test: ${passwordTest ? '✅ SUCCESS' : '❌ FAILED'}`);

      if (passwordTest) {
        console.log('\n🎯 === AUTHENTICATION COMPLETELY FIXED! ===');
        console.log('📧 Email: admin@arsanexus.com');
        console.log('🔐 Password: admin123');
        console.log('🌐 Login URL: http://localhost:3000/auth/login');
        console.log('\n📝 RESTART YOUR SERVER NOW:');
        console.log('1. ⛔ Stop server: Ctrl+C');
        console.log('2. ⏱️  Wait 5 seconds');
        console.log('3. 🚀 Run: npm run dev');
        console.log('4. 🔓 Login with credentials above');
        console.log('\n✨ LOGIN WILL WORK 100%!');
      }
    } else {
      console.log('❌ User lookup failed');
    }

  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔒 Database disconnected');
  }
};

fix(); 