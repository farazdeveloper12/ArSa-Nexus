const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arsa-nexus';
    console.log('🔗 Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// User Schema - Matching your structure
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  provider: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, {
  timestamps: false,
  collection: 'users'
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const testDatabase = async () => {
  console.log('🚀 Testing database connection and user data...');
  console.log('');

  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database:`);
    console.log('');

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.active}`);
      console.log(`   Provider: ${user.provider}`);
      console.log(`   Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'Not set'}`);
      console.log('');
    });

    // Find admin user specifically
    const adminUser = await User.findOne({
      email: { $regex: new RegExp('^arsalan@arsanexus.com$', 'i') }
    });

    if (adminUser) {
      console.log('✅ Admin user found with email: arsalan@arsanexus.com');

      // Update password to simple one
      const newPassword = 'admin123';
      const hashedPassword = await hash(newPassword, 12);

      console.log('🔄 Updating admin password...');
      const result = await User.updateOne(
        { _id: adminUser._id },
        { password: hashedPassword }
      );

      if (result.modifiedCount === 1) {
        console.log('✅ Password updated successfully!');
        console.log('');
        console.log('🔑 === LOGIN CREDENTIALS ===');
        console.log('📧 Email: arsalan@arsanexus.com');
        console.log('🔐 Password: admin123');
        console.log('');
      } else {
        console.log('❌ Password update failed');
      }
    } else {
      console.log('❌ Admin user not found with email arsalan@arsanexus.com');

      // Show all admin role users
      const adminsByRole = await User.find({ role: 'admin' });
      if (adminsByRole.length > 0) {
        console.log('📋 Found these admin users:');
        adminsByRole.forEach(admin => {
          console.log(`   - ${admin.email} (${admin.name})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Database test error:', error);
  }

  await mongoose.disconnect();
  console.log('✨ Test completed!');
};

testDatabase(); 