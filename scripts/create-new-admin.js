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

// User Schema
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

const createNewAdmin = async () => {
  console.log('🚀 Creating new admin user...');
  console.log('');

  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Delete ALL existing users
    console.log('🗑️  Deleting all existing users...');
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);
    console.log('');

    // Create new admin user
    const adminEmail = 'admin@arsanexus.com';
    const adminPassword = 'admin123';
    const hashedPassword = await hash(adminPassword, 12);

    console.log('👤 Creating new admin user...');
    const newAdmin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ New admin user created successfully!');
    console.log('');
    console.log('🔑 === NEW ADMIN LOGIN CREDENTIALS ===');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔐 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3003/auth/login');
    console.log('📊 Dashboard: http://localhost:3003/admin/dashboard');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   ID: ${newAdmin._id}`);
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role: ${newAdmin.role}`);
    console.log(`   Active: ${newAdmin.active}`);
    console.log(`   Provider: ${newAdmin.provider}`);
    console.log('');
    console.log('🎯 You can now login with these credentials!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }

  await mongoose.disconnect();
  console.log('✨ Admin creation completed!');
};

createNewAdmin(); 