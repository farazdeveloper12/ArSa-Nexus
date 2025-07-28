const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://annovationarsa:Arsalan123@cluster0.1cbcr.mongodb.net/arsanexus';

// User Schema
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
    enum: ['user', 'admin', 'instructor', 'manager', 'employee'],
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function cleanupAndSetupUsers() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing users
    console.log('🗑️  Removing all existing users...');
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    // Create the main admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: adminPassword,
      role: 'admin',
      active: true,
      provider: 'credentials'
    });

    console.log('✅ Created admin user:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    console.log('\n🎯 === CLEANUP COMPLETED SUCCESSFULLY! ===');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔐 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3000/auth/login');
    console.log('\n✨ Database is now clean with only the admin user!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    // Close connection
    console.log('🔒 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
}

// Run the cleanup
cleanupAndSetupUsers(); 