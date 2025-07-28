const mongoose = require('mongoose');
const { hash, compare } = require('bcryptjs');

// Use EXACT same connection as the app
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arsa-nexus';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('✅ Already connected to MongoDB');
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB:', MONGODB_URI);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Use EXACT same User schema as the app
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

// Remove any existing model to avoid conflicts
delete mongoose.models.User;
const User = mongoose.model('User', UserSchema);

const debugAuth = async () => {
  console.log('🚀 COMPREHENSIVE AUTHENTICATION DEBUG & FIX');
  console.log('================================================');

  await connectDB();

  try {
    console.log('\n🔍 STEP 1: Current Database State');
    console.log('-----------------------------------');

    // Check what users exist
    const allUsers = await User.find({});
    console.log(`📊 Total users in database: ${allUsers.length}`);

    allUsers.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.active}`);
      console.log(`   Provider: ${user.provider}`);
      console.log(`   Password: ${user.password ? user.password.substring(0, 30) + '...' : 'None'}`);
      console.log(`   Created: ${user.createdAt}`);
    });

    console.log('\n🧪 STEP 2: Authentication Simulation');
    console.log('-------------------------------------');

    // Simulate EXACT same lookup as the app does
    const testEmail = 'admin@arsanexus.com';
    const testPassword = 'admin123';

    console.log(`🔍 Looking for user: ${testEmail}`);

    // Use EXACT same query as the app
    const foundUser = await User.findOne({
      email: { $regex: new RegExp(`^${testEmail}$`, 'i') }
    });

    if (!foundUser) {
      console.log('❌ No user found - will create one');
    } else {
      console.log('✅ User found:');
      console.log(`   ID: ${foundUser._id}`);
      console.log(`   Email: ${foundUser.email}`);
      console.log(`   Active: ${foundUser.active}`);
      console.log(`   Password hash: ${foundUser.password.substring(0, 30)}...`);

      // Test password verification
      console.log('\n🔐 Testing password verification...');
      const isValid = await compare(testPassword, foundUser.password);
      console.log(`   Password "${testPassword}" valid: ${isValid}`);
    }

    console.log('\n🧹 STEP 3: Complete Database Reset');
    console.log('-----------------------------------');

    // Delete ALL users completely
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    // Verify deletion
    const remainingUsers = await User.find({});
    console.log(`📊 Users remaining: ${remainingUsers.length}`);

    console.log('\n👤 STEP 4: Creating Perfect Admin User');
    console.log('--------------------------------------');

    // Create admin with EXACT password
    const adminPassword = 'admin123';
    const hashedPassword = await hash(adminPassword, 12);

    console.log(`🔐 Creating password hash for: "${adminPassword}"`);
    console.log(`🔐 Generated hash: ${hashedPassword.substring(0, 30)}...`);

    const adminData = {
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
      profileImage: null,
      lastLogin: null
    };

    const newAdmin = await User.create(adminData);
    console.log('\n✅ NEW ADMIN CREATED:');
    console.log(`   ID: ${newAdmin._id}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Active: ${newAdmin.active}`);
    console.log(`   Role: ${newAdmin.role}`);
    console.log(`   Hash: ${newAdmin.password.substring(0, 30)}...`);

    console.log('\n🧪 STEP 5: Final Authentication Test');
    console.log('------------------------------------');

    // Test the exact authentication flow
    const finalUser = await User.findOne({
      email: { $regex: new RegExp('^admin@arsanexus.com$', 'i') }
    });

    if (finalUser) {
      console.log('✅ Final user lookup: SUCCESS');
      console.log(`   ID: ${finalUser._id}`);
      console.log(`   Active: ${finalUser.active}`);

      const finalPasswordTest = await compare('admin123', finalUser.password);
      console.log(`   Password verification: ${finalPasswordTest ? '✅ SUCCESS' : '❌ FAILED'}`);

      if (finalPasswordTest) {
        console.log('\n🎯 === AUTHENTICATION FIXED! ===');
        console.log('📧 Email: admin@arsanexus.com');
        console.log('🔐 Password: admin123');
        console.log('🌐 URL: http://localhost:3000/auth/login');
        console.log('\n📝 RESTART YOUR SERVER NOW:');
        console.log('1. Stop: Ctrl+C');
        console.log('2. Start: npm run dev');
        console.log('3. Login with credentials above');
      } else {
        console.log('\n❌ Password verification still failing!');
      }
    } else {
      console.log('❌ Final user lookup: FAILED');
    }

  } catch (error) {
    console.error('❌ Debug error:', error);
  }

  await mongoose.disconnect();
  console.log('\n🔒 Database connection closed');
  console.log('\n✨ DEBUG COMPLETE');
};

debugAuth(); 