const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

// EXACT connection like the app - this is the key!
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arsa-nexus';

console.log('🚀 SIMPLE LOGIN FIX - Using exact app connection');
console.log('Connection:', MONGODB_URI);

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
  console.log('✅ Connected to MongoDB');
};

// EXACT User schema from the app
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

const User = mongoose.model('User', UserSchema);

const simpleFix = async () => {
  await connectDB();

  console.log('\n🔍 Current users:');
  const users = await User.find({});
  users.forEach(u => console.log(`  - ${u.email} (${u._id})`));

  console.log('\n🧹 Deleting ALL users...');
  await User.deleteMany({});

  console.log('\n👤 Creating new admin...');
  const hashedPassword = await hash('admin123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@arsanexus.com',
    password: hashedPassword,
    role: 'admin',
    provider: 'credentials',
    active: true
  });

  console.log('✅ Admin created!');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🆔 ID: ${admin._id}`);
  console.log(`🔐 Password: admin123`);
  console.log(`✅ Active: ${admin.active}`);

  // Test the password immediately
  const { compare } = require('bcryptjs');
  const testResult = await compare('admin123', admin.password);
  console.log(`🧪 Password test: ${testResult ? 'PASS' : 'FAIL'}`);

  await mongoose.disconnect();
  console.log('\n🎯 FIXED! Restart server and login with:');
  console.log('📧 admin@arsanexus.com');
  console.log('🔐 admin123');
};

simpleFix(); 