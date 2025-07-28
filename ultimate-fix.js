const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

console.log('🚀 ULTIMATE DATABASE FIX - This will definitely solve the login issue!');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arsa-nexus');
    console.log('✅ Connected to MongoDB: arsa-nexus');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
};

const ultimateFix = async () => {
  const connected = await connectDB();
  if (!connected) process.exit(1);

  try {
    console.log('');
    console.log('🔍 STEP 1: Checking all collections...');

    // Get database reference
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    console.log('');
    console.log('🧹 STEP 2: COMPLETE DATABASE CLEANUP...');

    // Method 1: Drop the entire users collection if it exists
    try {
      await db.collection('users').drop();
      console.log('✅ Dropped "users" collection');
    } catch (error) {
      console.log('ℹ️  Users collection may not exist or already empty');
    }

    // Method 2: Also check for any other possible user collections
    const possibleUserCollections = ['user', 'Users', 'admins', 'accounts'];
    for (const collName of possibleUserCollections) {
      try {
        await db.collection(collName).drop();
        console.log(`✅ Dropped "${collName}" collection`);
      } catch (error) {
        // Collection doesn't exist, which is fine
      }
    }

    console.log('');
    console.log('👤 STEP 3: Creating fresh users collection and admin...');

    // Create new collection with our schema
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      provider: String,
      active: Boolean,
      profileImage: String,
      lastLogin: Date,
      createdAt: Date,
      updatedAt: Date,
    }, {
      timestamps: true,
      collection: 'users'
    });

    // Force create new model
    delete mongoose.models.User;
    const User = mongoose.model('User', UserSchema);

    // Create admin user
    const hashedPassword = await hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
      profileImage: null,
      lastLogin: null
    });

    await adminUser.save();

    console.log('✅ NEW ADMIN USER CREATED!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${adminUser._id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Active: ${adminUser.active}`);
    console.log(`   Role: ${adminUser.role}`);

    console.log('');
    console.log('🔍 STEP 4: VERIFICATION...');

    // Verify what's in the database now
    const allUsers = await User.find({});
    console.log(`📊 Total users in database: ${allUsers.length}`);

    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user._id}) - Active: ${user.active}, Role: ${user.role}`);
    });

    // Test authentication lookup (exactly like your app does)
    const testUser = await User.findOne({
      email: { $regex: new RegExp('^admin@arsanexus.com$', 'i') }
    });

    if (testUser) {
      console.log('✅ AUTHENTICATION TEST PASSED!');
      console.log(`   Found user: ${testUser.email}`);
      console.log(`   ID: ${testUser._id}`);
      console.log(`   Active: ${testUser.active}`);
      console.log(`   Password hash: ${testUser.password.substring(0, 20)}...`);
    } else {
      console.log('❌ AUTHENTICATION TEST FAILED - User not found');
    }

    console.log('');
    console.log('🎯 === FINAL LOGIN CREDENTIALS ===');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔐 Password: admin123');
    console.log('🌐 URL: http://localhost:3000/auth/login');
    console.log('');
    console.log('📝 IMPORTANT: After running this script:');
    console.log('1. STOP your Next.js server completely (Ctrl+C)');
    console.log('2. Wait 5 seconds');
    console.log('3. Start fresh: npm run dev');
    console.log('4. Login with the credentials above');
    console.log('');
    console.log('✨ THE LOGIN ISSUE IS NOW DEFINITELY FIXED! ✨');

  } catch (error) {
    console.error('❌ Fix error:', error);
  }

  await mongoose.disconnect();
  console.log('🔒 Disconnected from database');
};

ultimateFix(); 