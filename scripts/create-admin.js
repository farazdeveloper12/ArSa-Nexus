const { hash } = require('bcryptjs');
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arsa-nexus');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

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
    minlength: 6,
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
  emailVerified: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Create Admin User
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: 'admin@arsanexus.com' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Hash password
    const hashedPassword = await hash('ArsaAdmin2024!', 12);

    // Create admin user
    const adminUser = new User({
      name: 'Arsa Nexus Administrator',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true,
      isActive: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔑 Password: ArsaAdmin2024!');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting admin user creation...');

  await connectDB();
  await createAdminUser();

  console.log('✨ Admin setup completed!');
  process.exit(0);
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createAdminUser, connectDB }; 