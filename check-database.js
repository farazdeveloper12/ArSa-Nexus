const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arsa-nexus');
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
};

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

const checkDatabase = async () => {
  console.log('🔍 Checking database...');

  const connected = await connectDB();
  if (!connected) process.exit(1);

  try {
    // Get ALL users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users in database:`);

    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.active}`);
      console.log(`   Provider: ${user.provider}`);
      console.log(`   Password: ${user.password ? user.password.substring(0, 30) + '...' : 'None'}`);
      console.log(`   Created: ${user.createdAt}`);
    });

    // Check for admin@arsanexus.com specifically
    const adminUsers = await User.find({ email: 'admin@arsanexus.com' });
    console.log(`\n🔍 Admin users with email 'admin@arsanexus.com': ${adminUsers.length}`);

    if (adminUsers.length > 1) {
      console.log('⚠️  WARNING: Multiple admin users found! This is causing the login issue.');
      console.log('🧹 Will clean up duplicates...');

      // Delete all admin users
      await User.deleteMany({ email: 'admin@arsanexus.com' });
      console.log('✅ Deleted all admin users');

      // Create ONE clean admin user
      const { hash } = require('bcryptjs');
      const hashedPassword = await hash('admin123', 12);

      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@arsanexus.com',
        password: hashedPassword,
        role: 'admin',
        provider: 'credentials',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('\n✅ Created clean admin user:');
      console.log(`   ID: ${newAdmin._id}`);
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Active: ${newAdmin.active}`);
      console.log('\n🔑 LOGIN CREDENTIALS:');
      console.log('📧 Email: admin@arsanexus.com');
      console.log('🔐 Password: admin123');
    }

  } catch (error) {
    console.error('❌ Database check error:', error);
  }

  await mongoose.disconnect();
  console.log('\n✨ Database check completed!');
};

checkDatabase(); 