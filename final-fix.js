const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

console.log('🚀 FINAL LOGIN FIX - This will solve the authentication issue');
console.log('');

const connectDB = async () => {
  try {
    // Use exact same connection as your app
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arsa-nexus';
    console.log('🔗 Connecting to:', MONGODB_URI);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
};

// Use EXACT same schema as your app
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
  collection: 'users' // Explicitly use 'users' collection
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const finalFix = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.log('❌ Failed to connect to database');
    process.exit(1);
  }

  try {
    console.log('🔍 Checking current database state...');

    // Get all users first
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users before cleanup:`);

    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user._id}, Active: ${user.active})`);
    });

    console.log('');
    console.log('🧹 DELETING ALL USERS...');

    // Delete ALL users - this will clear everything
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    // Verify deletion
    const remainingUsers = await User.find({});
    console.log(`📊 Users remaining after deletion: ${remainingUsers.length}`);

    if (remainingUsers.length > 0) {
      console.log('⚠️  Some users still exist, force deleting...');
      await User.collection.drop();
      console.log('✅ Collection dropped completely');
    }

    console.log('');
    console.log('👤 CREATING NEW ADMIN USER...');

    // Create brand new admin with proper hash
    const plainPassword = 'admin123';
    const hashedPassword = await hash(plainPassword, 12);

    console.log('🔐 Password hash created:', hashedPassword.substring(0, 20) + '...');

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

    console.log('✅ NEW ADMIN CREATED SUCCESSFULLY!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   ID: ${newAdmin._id}`);
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role: ${newAdmin.role}`);
    console.log(`   Active: ${newAdmin.active}`);
    console.log(`   Provider: ${newAdmin.provider}`);
    console.log(`   Created: ${newAdmin.createdAt}`);
    console.log('');

    // Verify the user was created properly
    const verifyUser = await User.findOne({ email: 'admin@arsanexus.com' });
    if (verifyUser) {
      console.log('✅ VERIFICATION PASSED - User found in database');
      console.log(`   Verification ID: ${verifyUser._id}`);
      console.log(`   Verification Active: ${verifyUser.active}`);
    } else {
      console.log('❌ VERIFICATION FAILED - User not found!');
    }

    console.log('');
    console.log('🎯 === YOUR LOGIN CREDENTIALS ===');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔐 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3000/auth/login');
    console.log('');
    console.log('📝 NEXT STEPS:');
    console.log('1. Stop your Next.js server (Ctrl+C)');
    console.log('2. Start it again: npm run dev');
    console.log('3. Go to the login page');
    console.log('4. Use the credentials above');
    console.log('');
    console.log('✨ LOGIN ISSUE SHOULD NOW BE FIXED! ✨');

  } catch (error) {
    console.error('❌ Error during fix:', error);
  }

  await mongoose.disconnect();
  console.log('🔒 Database connection closed');
};

finalFix(); 